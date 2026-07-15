# Service

The agent module is **shared infrastructure** — one service handles persistence and the AI client for every agent in the project. Each agent passes its own config (system prompt + tool descriptions) at call time, so different agents get different behaviour without separate modules.

## Module Service

```ts
// src/modules/agent/service.ts
import { createAnthropic } from "@ai-sdk/anthropic"
import type { MedusaContainer } from "@medusajs/framework/types"
import { MedusaService } from "@medusajs/framework/utils"
import { medusaAgent } from "./agents"
import { AgentSession } from "./models/session"
import { AgentMessage } from "./models/message"

export type AgentModuleOptions = {
  apiKey: string
  model?: string  // defaults to "claude-sonnet-4-5"
}

export default class AgentModuleService extends MedusaService({
  AgentSession,
  AgentMessage,
}) {
  private model_: ReturnType<ReturnType<typeof createAnthropic>>

  constructor(_deps: unknown, options: AgentModuleOptions) {
    super(...arguments)
    const anthropic = createAnthropic({ apiKey: options.apiKey })
    this.model_ = anthropic(options.model ?? "claude-sonnet-4-5")
  }

  // config is passed per-call so each agent can use its own prompt and tools
  stream(messages: any[], container: MedusaContainer, config: any) {
    return medusaAgent({
      model: this.model_,
      messages,
      config,
      experimental_context: { medusa_container: container },
    })
  }
}
```

## What `MedusaService` Gives You

Passing the model map to `MedusaService({...})` auto-generates CRUD methods:

| Pattern | Example |
|---------|---------|
| `create<Entity>s(data)` | `createAgentSessions({ title, created_by_id })` |
| `list<Entity>s(filters, config)` | `listAgentSessions({}, { order: { created_at: "DESC" }, take: 50 })` |
| `retrieve<Entity>(id)` | `retrieveAgentSession(id)` |
| `update<Entity>s(id, data)` | `updateAgentSessions(id, { title: "…" })` |
| `delete<Entity>s(id)` | `deleteAgentSessions(id)` |

The method names are derived from the model class name (e.g., `AgentSession` → `AgentSession`).

> All agents share these methods. Filter by `agent_type` when listing sessions to scope results to the calling agent.

## Module Index File

```ts
// src/modules/agent/index.ts
import { Module } from "@medusajs/framework/utils"
import AgentModuleService from "./service"

export const AGENT_MODULE = "agentModule"

export default Module(AGENT_MODULE, {
  service: AgentModuleService,
})
```

> The constant (`AGENT_MODULE`) is the key used to resolve the service from the container in API routes:
> `req.scope.resolve(AGENT_MODULE)`

## Registering in medusa-config.ts

```ts
// medusa-config.ts
modules: [
  {
    resolve: "./src/modules/agent",
    options: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: "claude-sonnet-4-5",  // optional, this is the default
    },
  },
]
```

> **CRITICAL:** `resolve` must be the path to the module directory (containing `index.ts`). The options are forwarded to the service constructor.

## Environment Variables

Add to `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
```
