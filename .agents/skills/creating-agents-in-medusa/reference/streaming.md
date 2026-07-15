# Streaming

Agent responses are streamed as NDJSON (newline-delimited JSON) — one JSON object per line, emitted incrementally as the model produces output.

## Server-Side: Emitting Chunks

```ts
// Set headers before writing anything
res.setHeader("Content-Type", "application/x-ndjson")
res.setHeader("Transfer-Encoding", "chunked")
res.setHeader("Cache-Control", "no-cache")

// Helper: serialize one object as a line
const emit = (obj: object) => res.write(JSON.stringify(obj) + "\n")
```

## Chunk Types

| `type` | When emitted | Shape |
|--------|-------------|-------|
| `session_id` | Immediately at start | `{ type: "session_id", sessionId: string }` |
| `text` | Each word/token from the model | `{ type: "text", content: string }` |
| `tool_call` | When a tool fires | `{ type: "tool_call", tool: string, args: object }` |
| `tool_result` | When a tool call completes | `{ type: "tool_result", tool: string }` |

## Iterating the Full Stream

```ts
for await (const chunk of result.fullStream) {
  if (chunk.type === "text-delta") {
    const text =
      (chunk as any).text ??
      (chunk as any).textDelta ??
      (chunk as any).delta ??
      ""
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

res.end()  // REQUIRED — closes the HTTP response
```

> **Note:** The Vercel AI SDK uses inconsistent field names across versions. Always fall back through `text ?? textDelta ?? delta` and `args ?? input` to be safe.

## Client-Side: Parsing the NDJSON Stream

```ts
async function sendMessage(messages: any[], sessionId: string | null) {
  const response = await fetch("/admin/my-agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, session_id: sessionId }),
    credentials: "include",  // sends admin session cookie
  })

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    // Keep the last (potentially incomplete) line in the buffer
    buffer = lines.pop() ?? ""

    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const chunk = JSON.parse(line)
        handleChunk(chunk)
      } catch {
        // incomplete JSON line — wait for more data
      }
    }
  }
}

function handleChunk(chunk: any) {
  if (chunk.type === "session_id") {
    // Persist session ID in state for subsequent messages
    setSessionId(chunk.sessionId)
  } else if (chunk.type === "text") {
    // Append text to the current assistant message
    appendToLastMessage(chunk.content)
  } else if (chunk.type === "tool_call") {
    // Show a "running" indicator for this tool
    addToolCall({ tool: chunk.tool, status: "running" })
  } else if (chunk.type === "tool_result") {
    // Mark the tool call as done
    markToolDone(chunk.tool)
  }
}
```

## Key Rules

- **Buffer incomplete lines** — network packets may split a JSON object across two reads. Always accumulate a buffer and split on `\n`.
- **`credentials: "include"`** — Medusa admin uses cookie-based auth; without this the request is rejected as unauthenticated.
- **Emit `session_id` first** — the client needs this before any other chunk so it can link subsequent user messages to the same session.
- **Call `res.end()`** — without it, the client's `reader.read()` never returns `done: true` and the connection hangs.
- **`Transfer-Encoding: chunked`** — tells the HTTP layer not to buffer the response body; required for true streaming.
