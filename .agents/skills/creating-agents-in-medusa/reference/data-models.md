# Data Models

`AgentSession` and `AgentMessage` are shared infrastructure — one set of tables serves every agent in the project. An `agent_type` field on the session distinguishes which agent owns it, so a customer service agent and a product audit agent both write to the same tables without colliding.

> **Do not create separate session/message models per agent.** Add `agent_type` and reuse these models.

## Models

```ts
// src/modules/agent/models/session.ts
import { model } from "@medusajs/framework/utils"
import { AgentMessage } from "./message"

export const AgentSession = model.define("agent_session", {
  id: model.id({ prefix: "sess" }).primaryKey(),
  agent_type: model.text(),                // e.g. "customer-service", "product-audit"
  title: model.text().nullable(),          // first 72 chars of opening message
  created_by_id: model.text(),             // actor_id from auth context
  messages: model.hasMany(() => AgentMessage),
})
```

```ts
// src/modules/agent/models/message.ts
import { model } from "@medusajs/framework/utils"
import { AgentSession } from "./session"

export const AgentMessage = model.define("agent_message", {
  id: model.id({ prefix: "msg" }).primaryKey(),
  agent_session: model.belongsTo(() => AgentSession, { mappedBy: "messages" }),
  role: model.enum(["user", "assistant"]),
  content: model.text(),
})
```

## Key Rules

- **`agent_type`** — set this to a stable, lowercase slug when creating a session. Each agent's API route passes its own value. Use it to filter sessions in the list endpoint so each agent only sees its own history.
- **`model.id({ prefix: "..." })`** — generates a prefixed ID (e.g. `sess_01JABCD…`).
- **`hasMany` / `belongsTo`** — always define both sides. The `mappedBy` value must match the field name on the parent.
- **`nullable()`** — `title` is set lazily from the first message; it can be null at creation.

## Migrations

After adding or changing models, run:

```bash
npx medusa db:generate agent   # matches the module resolve path in medusa-config.ts
npx medusa db:migrate
```

> **CRITICAL:** The name passed to `db:generate` must match how the module is resolved in `medusa-config.ts`.

## Exporting Models

```ts
// Imported directly in service.ts
import { AgentSession } from "./models/session"
import { AgentMessage } from "./models/message"
```
