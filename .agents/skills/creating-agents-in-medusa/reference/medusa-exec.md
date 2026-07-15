# MedusaExec

MedusaExec gives the agent the ability to write and run arbitrary TypeScript against the live Medusa server. Instead of pre-building an endpoint for every possible action, the agent generates the right code for each task at runtime — querying data, triggering workflows, updating records — using full access to the Medusa DI container.

> **CRITICAL — Authentication required.** MedusaExec executes arbitrary code with full database and service access. It must only ever be reachable through routes protected by `AuthenticatedMedusaRequest`. Never expose the agent's POST endpoint (or any route that triggers `executeCode`) without admin authentication — doing so allows unauthenticated users to run arbitrary code against your database.

## The Executor

Add the executor to your project at `src/lib/code-mode/executor.ts`:

```ts
import { writeFileSync, unlinkSync } from "fs"
import { join } from "path"
import { randomUUID } from "crypto"
import type { MedusaContainer } from "@medusajs/framework/types"

export interface ExecutionResult {
  result: unknown
  logs: string[]
  execution_ms: number
}

const TIMEOUT_MS = 30_000

export async function executeCode(
  code: string,
  container: MedusaContainer
): Promise<ExecutionResult> {
  const tempFile = join(process.cwd(), `.medusa-exec-${randomUUID()}.ts`)
  writeFileSync(tempFile, code)

  const logs: string[] = []
  const originalLog = console.log
  console.log = (...args: any[]) => {
    logs.push(args.map(String).join(" "))
    originalLog(...args)
  }
  const log = (...args: unknown[]) => logs.push(args.map(String).join(" "))

  const start = Date.now()

  try {
    let mod: any
    try {
      mod = require(tempFile)
    } catch (err: any) {
      const error: any = new Error(err.message ?? "Compilation failed")
      error.code = "COMPILE_ERROR"
      error.details = { stack: err.stack?.trim() ?? "" }
      throw error
    }

    const fn = mod.default
    if (typeof fn !== "function") {
      const error: any = new Error("Script must default-export an async function.")
      error.code = "INVALID_EXPORT"
      throw error
    }

    const result = await Promise.race([
      fn({ container, log }),
      new Promise<never>((_, reject) =>
        setTimeout(() => {
          const error: any = new Error("Execution exceeded 30s")
          error.code = "TIMEOUT"
          reject(error)
        }, TIMEOUT_MS)
      ),
    ])

    return { result: result ?? null, logs, execution_ms: Date.now() - start }
  } catch (err: any) {
    if (err.code) throw err
    const error: any = new Error(err.message ?? String(err))
    error.code = "RUNTIME_ERROR"
    error.details = { stack: err.stack?.trim() ?? "" }
    throw error
  } finally {
    console.log = originalLog
    delete require.cache[require.resolve(tempFile)]
    try { unlinkSync(tempFile) } catch { /* ignore */ }
  }
}
```

## The MedusaExec Tool

```ts
// src/modules/agent/tools/medusa-exec.ts
import { z } from "@medusajs/framework/zod"
import { tool } from "ai"
import { executeCode } from "../../../lib/code-mode/executor"

export const medusaExecTool = tool({
  description: ``,  // injected from config at runtime
  inputSchema: z.object({
    code: z.string().describe("TypeScript source to execute"),
  }),
  execute: async (input, { experimental_context: context }) => {
    const container = (context as any).medusa_container
    return executeCode(input.code, container)
  },
})
```

Register it in your agent and config just like any other tool (see `agent-setup.md`).

## Required Code Structure

Every script the agent writes **must** default-export an async function:

```ts
import { ExecArgs } from "@medusajs/framework/types"

export default async function({ container, log }: ExecArgs) {
  // operations here
  return result  // optional — returned as `result` in ExecutionResult
}
```

> **CRITICAL:** If the script does not default-export a function, execution fails with `INVALID_EXPORT`. The agent must always follow this structure exactly.

## Querying Data

Use `query.graph()` — never resolve module services directly, as that bypasses Medusa's business logic layer.

```ts
import { ExecArgs } from "@medusajs/framework/types"

export default async function({ container, log }: ExecArgs) {
  const query = container.resolve("query")

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "status", "variants.*"],
    filters: { status: "published" },
    pagination: { take: 20, skip: 0 },
  })

  log(JSON.stringify(products))
  return products
}
```

**Common query patterns:**

```ts
// Filter by ID
filters: { id: "prod_01ABC" }

// Filter by multiple IDs
filters: { id: ["prod_01ABC", "prod_01DEF"] }

// Date range
filters: { created_at: { $gt: "2025-01-01" } }

// Nested relation fields
fields: ["id", "title", "variants.id", "variants.prices.*"]

// Pagination
pagination: { take: 50, skip: 0, order: { created_at: "DESC" } }
```

> **Always `log()` your results** — the tool returns `logs` as the primary output the agent reads. Return values are secondary. A script that doesn't log anything is effectively silent.

## Error Codes

| Code | Cause | Fix |
|------|-------|-----|
| `COMPILE_ERROR` | TypeScript/JS parse error | Fix syntax; check imports exist |
| `INVALID_EXPORT` | No default function export | Add `export default async function(...)` |
| `RUNTIME_ERROR` | Exception during execution | Check logic; validate inputs |
| `TIMEOUT` | Exceeded 30 seconds | Reduce scope; add pagination |

## System Prompt Guidance for the Agent

Add this to the agent's system prompt so it knows how to use MedusaExec correctly:

```ts
export const prompt = () => `
...

# MedusaExec

Use MedusaExec to query data from or make changes to the Medusa store.

Scripts MUST follow this exact structure:
\`\`\`ts
import { ExecArgs } from "@medusajs/framework/types"

export default async function({ container, log }: ExecArgs) {
  // your code here
}
\`\`\`

Rules:
- ALWAYS use query.graph() for data queries — never resolve module services directly.
- ALWAYS log results with log() so you can read the output.
- NEVER run mutations unless the user has explicitly confirmed the action.
- If a query fails, check the entity name and fields — ask MedusaDocs if unsure.

# Workflows

<!-- TODO: Add workflows reference — covers available core-flows workflows,
     their input shapes, and when to use each one for mutations. -->
`
```

## Config Description

```ts
MedusaExec: {
  description: `Execute TypeScript against the live Medusa server.

Scripts must default-export an async function:

\`\`\`ts
import { ExecArgs } from "@medusajs/framework/types"

export default async function({ container, log }: ExecArgs) {
  const query = container.resolve("query")
  const { data } = await query.graph({ entity: "product", fields: ["id", "title"] })
  log(JSON.stringify(data))
}
\`\`\`

Use for:
- Querying store data (products, orders, customers, etc.)
- Running workflows for mutations — only when user has confirmed

NEVER mutate data without explicit user confirmation.
Always use query.graph() for reads, never resolve services directly.
Always log() your results.`,
},
```
