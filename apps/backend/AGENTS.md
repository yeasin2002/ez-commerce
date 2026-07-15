# Product Overview

**ez-commerce** is a headless e-commerce backend built on [Medusa v2](https://docs.medusajs.com). It provides core commerce primitives — products, variants, inventory, regions, sales channels, shipping, and tax — that can be consumed by any frontend or storefront.

The backend exposes two API surfaces:

- **Store API** (`/store/*`) — public-facing endpoints for customer-facing storefronts
- **Admin API** (`/admin/*`) — authenticated endpoints for managing the store

The project is currently in early/starter stage with seed data covering apparel products (shirts, sweatshirts, sweatpants, shorts) sold across European markets in EUR and USD.

<!-- 2.strcuture -->

# Project Structure

## Root Layout

```
apps/backend/
├── src/                      # All application source code
├── medusa-config.ts          # Medusa project configuration (DB, CORS, secrets)
├── instrumentation.ts        # OpenTelemetry setup (disabled by default)
├── eslint.config.ts          # ESLint configuration
├── jest.config.js            # Jest test runner configuration
├── tsconfig.json             # TypeScript compiler options
├── .env                      # Local environment variables (not committed)
├── .env.template             # Template for required env vars
└── .medusa/                  # Build artifacts (auto-generated, not edited manually)
    ├── server/               # Compiled server output
    ├── client/               # Compiled admin UI output
    └── types/                # Generated type declarations
```

## Source Directory (`src/`)

Medusa v2 uses a **file-system based routing and registration** convention. Each folder under `src/` maps to a specific Medusa extension point:

```
src/
├── api/                      # Custom API route handlers
│   ├── admin/                # Admin API extensions (/admin/*)
│   │   └── <route>/
│   │       └── route.ts      # Named exports: GET, POST, PUT, DELETE, PATCH
│   └── store/                # Store API extensions (/store/*)
│       └── <route>/
│           └── route.ts      # Named exports: GET, POST, PUT, DELETE, PATCH
├── modules/                  # Custom Medusa modules (services, models, migrations)
├── workflows/                # Custom Medusa workflows (multi-step business logic)
├── subscribers/              # Event subscribers (react to Medusa events)
├── jobs/                     # Scheduled/background jobs
├── links/                    # Module link definitions (cross-module relationships)
└── migration-scripts/        # One-off data migration and seed scripts
    └── initial-data-seed.ts  # Initial store data seeding
```

## Conventions

### API Routes

- Each route lives in its own folder under `src/api/admin/` or `src/api/store/`
- The file must be named `route.ts`
- HTTP methods are exported as named async functions: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`
- Use `MedusaRequest` and `MedusaResponse` from `@medusajs/framework/http` for typing

```ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({ ... })
}
```

### Workflows

- Use Medusa's built-in core workflows from `@medusajs/medusa/core-flows` before writing custom ones
- Custom workflows go in `src/workflows/`
- Workflows receive a `MedusaContainer` and use `container.resolve()` to access services

### Modules

- Custom modules go in `src/modules/`
- Unit tests for a module live in `src/modules/<name>/__tests__/`

### Migration Scripts

- One-off scripts go in `src/migration-scripts/`
- Each script exports a default `async function({ container })` and is run via `medusa exec`

### Admin UI Extensions

- Admin extensions live under `src/admin/`
- i18n strings are in `src/admin/i18n/`
- Uses React 18 + react-router-dom + @tanstack/react-query

<!-- 3.tech -->

# Tech Stack

## Runtime & Language

- **Node.js** >= 20
- **TypeScript** 5.x — strict null checks enabled, ES2021 target, Node16 module resolution
- **TSX/JSX** via `react-jsx` transform (for admin UI extensions)

## Framework

- **Medusa v2** (`@medusajs/medusa` 2.17.2) — core commerce framework
- **@medusajs/framework** — base utilities, HTTP types, container, query, workflows
- **@medusajs/admin-sdk** — admin UI extension support

## Key Libraries

| Package                   | Purpose                |
| ------------------------- | ---------------------- |
| `zod` 4.x                 | Schema validation      |
| `react` + `react-dom` 18  | Admin UI extensions    |
| `react-router-dom` 6      | Admin UI routing       |
| `@tanstack/react-query` 5 | Admin UI data fetching |
| `react-i18next`           | Admin UI i18n          |

## Testing

- **Jest** 29 with `@swc/jest` transformer (SWC for fast TypeScript compilation)
- Three test suites, selected via `TEST_TYPE` env variable:
  - `integration:http` — HTTP integration tests in `integration-tests/http/*.spec.[jt]s`
  - `integration:modules` — module tests in `src/modules/*/__tests__/`
  - `unit` — unit tests matching `src/**/__tests__/*.unit.spec.[jt]s`

## Linting

- ESLint via `@medusajs/eslint-plugin` recommended config (`eslint.config.ts`)

## Build Output

- Compiled output goes to `.medusa/server/` (excluded from source control)
- Admin client assets go to `.medusa/client/`

## Common Commands

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Run unit tests
npm run test:unit

# Run HTTP integration tests
npm run test:integration:http

# Run module integration tests
npm run test:integration:modules

# Seed initial data (run after migrations)
npx medusa exec src/migration-scripts/initial-data-seed.ts
```

## Environment Variables

All secrets are loaded from `.env` (see `.env.template`). Required vars:

- `DATABASE_URL` — PostgreSQL connection string
- `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` — CORS origins
- `JWT_SECRET`, `COOKIE_SECRET` — auth secrets



<!-- BEGIN:modification-permission -->
## no modification permission. 
Do not do any modification in node_modules or any other file/folder that are in .gitignore. 

<!-- END:modification-permission -->


<!-- BEGIN:behavioral-guidelines -->

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Restricted file or this file: you don't need to edit.

- node_modules/
- android
  These are the files that are restricted and not only that. That folder or file that is mentioned in the.gitignore, do not edit or modify anything on that particular file or folder.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

<!-- END:behavioral-guidelines -->
