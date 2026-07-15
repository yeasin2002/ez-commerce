# API Route

Each agent gets its own set of routes but they all share the same `AgentModuleService`. The agent's own config (system prompt + tool descriptions) is defined locally and passed into `stream()` at call time.

Route paths use the agent's type slug, e.g. `src/api/admin/agent/customer-service/route.ts`.

## POST — Main Chat Endpoint

```ts
// src/api/admin/agent/customer-service/route.ts
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import AgentModuleService from "../../../../modules/agent/service"
import { AGENT_MODULE } from "../../../../modules/agent"
import agentConfig from "../../../../modules/agent/config/customer-service"  // agent-specific config

const AGENT_TYPE = "customer-service"

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const { messages, session_id } = req.body as { messages: any[]; session_id?: string }

  const agentService: AgentModuleService = req.scope.resolve(AGENT_MODULE)

  // Create or reuse a session, always scoped to this agent type
  let sessionId = session_id
  if (!sessionId) {
    const firstUserMsg = messages.find((m) => m.role === "user")
    const title = firstUserMsg
      ? String(firstUserMsg.content).slice(0, 72)
      : "New conversation"
    const session = await agentService.createAgentSessions({
      agent_type: AGENT_TYPE,
      title,
      created_by_id: req.auth_context?.actor_id ?? "unknown",
    })
    sessionId = session.id
  }

  // Persist the latest user message
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")
  if (lastUserMsg) {
    await agentService.createAgentMessages({
      agent_session_id: sessionId,
      role: "user",
      content: String(lastUserMsg.content),
    })
  }

  // Stream — pass this agent's config so it uses the right prompt and tools
  const result = agentService.stream(messages, req.scope, agentConfig)

  res.setHeader("Content-Type", "application/x-ndjson")
  res.setHeader("Transfer-Encoding", "chunked")
  res.setHeader("Cache-Control", "no-cache")

  const emit = (obj: object) => res.write(JSON.stringify(obj) + "\n")

  emit({ type: "session_id", sessionId })

  let assistantContent = ""

  for await (const chunk of result.fullStream) {
    if (chunk.type === "text-delta") {
      const text = (chunk as any).text ?? (chunk as any).textDelta ?? (chunk as any).delta ?? ""
      if (text) {
        assistantContent += text
        emit({ type: "text", content: text })
      }
    } else if (chunk.type === "tool-call") {
      const args = (chunk as any).args ?? (chunk as any).input
      emit({ type: "tool_call", tool: chunk.toolName, args })
    } else if (chunk.type === "tool-result") {
      emit({ type: "tool_result", tool: chunk.toolName })
    }
  }

  if (assistantContent) {
    await agentService.createAgentMessages({
      agent_session_id: sessionId,
      role: "assistant",
      content: assistantContent,
    })
  }

  res.end()
}
```

## GET — Session List

Filter by `agent_type` so each agent only sees its own sessions.

```ts
// src/api/admin/agent/customer-service/sessions/route.ts
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import AgentModuleService from "../../../../../modules/agent/service"
import { AGENT_MODULE } from "../../../../../modules/agent"

const AGENT_TYPE = "customer-service"

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const agentService: AgentModuleService = req.scope.resolve(AGENT_MODULE)

  const sessions = await agentService.listAgentSessions(
    { agent_type: AGENT_TYPE },
    {
      select: ["id", "title", "created_at", "created_by_id"],
      order: { created_at: "DESC" },
      take: 50,
    }
  )

  res.json({ sessions })
}
```

## GET — Session Messages

```ts
// src/api/admin/agent/customer-service/sessions/[id]/route.ts
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import AgentModuleService from "../../../../../../modules/agent/service"
import { AGENT_MODULE } from "../../../../../../modules/agent"

export async function GET(
  req: AuthenticatedMedusaRequest & { params: { id: string } },
  res: MedusaResponse
) {
  const agentService: AgentModuleService = req.scope.resolve(AGENT_MODULE)

  const messages = await agentService.listAgentMessages(
    { agent_session_id: req.params.id },
    {
      select: ["id", "role", "content", "created_at"],
      order: { created_at: "ASC" },
    }
  )

  res.json({ messages })
}
```

## Adding a Second Agent

Add a new route directory with its own `AGENT_TYPE` constant and its own config import. Everything else — the service, the models, the DB tables — is reused unchanged.

```
src/api/admin/agent/
  customer-service/
    route.ts                  ← AGENT_TYPE = "customer-service"
    sessions/route.ts
    sessions/[id]/route.ts
  product-audit/
    route.ts                  ← AGENT_TYPE = "product-audit"
    sessions/route.ts
    sessions/[id]/route.ts
```

## Key Points

- **All agent routes must use `AuthenticatedMedusaRequest`** — the agent triggers MedusaExec which runs arbitrary TypeScript with full database access. An unauthenticated route is a remote code execution vulnerability. Never place agent routes outside `src/api/admin/` or relax the auth middleware.
- `agent_type` is the only thing that distinguishes sessions across agents — always set it on create and filter by it on list.
- Pass `agentConfig` (the agent-specific config) into `stream()` — not a shared default. Each agent's config lives alongside its routes or in `src/modules/agent/config/<agent-type>.ts`.
- `req.scope` is the Medusa DI container — pass it to `stream()` so MedusaExec can resolve services.
- Always call `res.end()` after the stream loop.
