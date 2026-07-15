# Agent Setup

The agent runtime is a function that calls `streamText` from the Vercel AI SDK with tools, a system prompt, and a model. Tools are defined separately and wired through a config object so descriptions can be changed without touching tool logic.

> **Use MedusaExec instead of custom tools.** For any operation that reads or writes Medusa data, the agent should write TypeScript and execute it via MedusaExec. This is far more efficient than building a separate tool per operation — a single MedusaExec tool replaces dozens of bespoke tools. Only build a custom tool for capabilities that genuinely cannot be expressed as executable TypeScript (e.g. calling an external API with a secret, sending an email via a third-party SDK).

## Agent Function

```ts
// src/modules/agent/agents/index.ts
import { smoothStream, stepCountIs, streamText, Tool } from "ai"
import { medusaExecTool } from "../tools/medusa-exec"
import { todoWriteTool } from "../tools/todo-write"

export const myAgent = (options) => {
  const config = options.config

  const allTools = {
    TodoWrite: todoWriteTool,
    MedusaExec: medusaExecTool,
  }

  const tools: Record<string, Tool> = {}
  const activeTools: string[] = []

  for (const [toolName, toolConfig] of Object.entries(config.tools)) {
    const toolImpl = allTools[toolName as keyof typeof allTools]
    if (toolImpl) {
      tools[toolName] = {
        ...toolImpl,
        description: (toolConfig as any).description,
      }
      activeTools.push(toolName)
    }
  }

  const { config: _, ...restOptions } = options

  return streamText({
    ...restOptions,
    system: config.systemPrompt(),
    maxOutputTokens: 61000,
    stopWhen: stepCountIs(100),   // prevent infinite loops
    tools,
    activeTools,
    experimental_transform: [smoothStream({ chunking: "word" })],
    onStepFinish({ stepType, toolCalls, finishReason, usage }) {
      if (toolCalls?.length) {
        for (const call of toolCalls) {
          console.log(`[agent] tool_call  ${call.toolName}`, JSON.stringify(call.input ?? call.args))
        }
      }
      console.log(`[agent] step_finish type=${stepType} finish=${finishReason} tokens=${usage?.totalTokens ?? "?"}`)
    },
  })
}
```

## Config Object

```ts
// src/modules/agent/config/index.ts
import { prompt } from "./prompt"

const defaultConfig = {
  systemPrompt: prompt,
  tools: {
    TodoWrite: {
      description: `Track task progress. Call at the start of every multi-step task. Only one todo in_progress at a time.`,
    },
    MedusaExec: {
      description: `Execute TypeScript against the live Medusa server to query or mutate data.

Scripts must default-export an async function:

\`\`\`ts
import { ExecArgs } from "@medusajs/framework/types"

export default async function({ container, log }: ExecArgs) {
  const query = container.resolve("query")
  const { data } = await query.graph({ entity: "product", fields: ["id", "title"] })
  log(JSON.stringify(data))
}
\`\`\`

Use for ALL data operations — queries and mutations. Always use query.graph() for reads.
Never mutate data without explicit user confirmation. Always log() results.`,
    },
  },
}

export default defaultConfig
```

## System Prompt

```ts
// src/modules/agent/config/prompt.ts
export const prompt = () => `
You are a [describe the agent's role and domain].

Core behavior:
- [List 3-5 key behavioral rules specific to this agent's purpose]
- Research before acting — always query data with MedusaExec before making changes
- Ask for confirmation before any mutation

Available tools:
- MedusaExec: query and mutate Medusa data by writing TypeScript — use this for ALL data operations
- TodoWrite: track multi-step progress

[Domain-specific guidance here]

Tone: concise, direct, fewer than 4 lines unless detail is requested.
`
```

## Key `streamText` Parameters

| Parameter | Purpose |
|-----------|---------|
| `model` | The Anthropic model instance from the service |
| `messages` | Full conversation history (user + assistant turns) |
| `system` | System prompt string |
| `maxOutputTokens` | Cap token usage per response |
| `stopWhen: stepCountIs(100)` | Kill switch — prevents runaway tool loops |
| `experimental_context` | Object passed to all tool `execute` functions |
| `experimental_transform` | `smoothStream` for word-chunked output |
| `activeTools` | Subset of tools the agent can use this turn |
