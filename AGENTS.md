<!-- 1.Product -->

# Product

**EZ Commerce** is a production-ready, direct-to-consumer (DTC) e-commerce platform. It is a multi-category online store built to sell physical goods (starting with sportswear/jerseys) while staying flexible enough to expand into other product categories without a redesign.

## Target Users
- **Guest shoppers** — browse and buy without an account
- **Registered customers** — saved addresses, order history, wishlists

## Core Customer Features
- Homepage with hero banners, featured categories, new arrivals, best sellers
- Product listing pages (PLP) and product detail pages (PDP) with variant selection
- Global search, filters (category, price, size, color, etc.), and sorting
- Shopping cart with promo/coupon code support
- Multi-step checkout (guest or authenticated) with address management
- Payments: Cash on Delivery + online payment (Stripe)
- Customer accounts: order history, tracking, wishlist, reviews
- Multi-region support with automatic country detection via URL prefix (`/[countryCode]/...`)
- Static content pages: FAQ, returns, shipping, contact, about

## Brand Direction
- Bold, high-contrast black-and-white visual identity
- Pill-shaped (fully rounded) buttons throughout — this is a hard brand requirement
- Premium, minimal feel with generous spacing
- Product cards show strike-through original price when discounted


<!-- 2.Structure -->
# Project Structure

## Monorepo Root
```
ez-commerce/
├── apps/
│   ├── backend/           # Medusa v2 backend
│   ├── storefront/        # Next.js storefront (primary, actively developed)
│   └── storefront-template/ # Reference template — do not modify
├── .kiro/steering/        # AI steering rules
├── .agents/skills/        # Agent skill definitions
├── turbo.json             # Turborepo pipeline config
├── pnpm-workspace.yaml    # pnpm workspaces config
└── package.json           # Root scripts and shared devDependencies
```

## Backend (`apps/backend`)
```
src/
├── admin/          # Admin dashboard extensions (widgets, UI routes)
│   └── i18n/       # Admin i18n translations
├── api/
│   ├── admin/      # Custom admin API routes (file-based: route.ts per folder)
│   └── store/      # Custom store API routes (file-based: route.ts per folder)
├── jobs/           # Scheduled jobs
├── links/          # Module link definitions (connecting custom modules to Medusa modules)
├── migration-scripts/ # One-off data migration/seed scripts
├── modules/        # Custom Medusa modules
│   └── <module>/
│       ├── models/     # Data models (model.define())
│       ├── service.ts  # MedusaService extending class
│       └── index.ts    # Module export (Module() definition + named constant)
├── subscribers/    # Event subscribers
└── workflows/      # Custom workflows (createWorkflow / createStep)
medusa-config.ts    # Medusa configuration (DB, CORS, modules registration)
```

### Backend Conventions
- API routes use file-based routing: `src/api/<prefix>/<path>/route.ts`, exporting named HTTP method functions (`GET`, `POST`, etc.)
- Each custom module lives in its own directory under `src/modules/` with `models/`, `service.ts`, and `index.ts`
- Register custom modules in `medusa-config.ts` under the `modules` array
- After creating or modifying a module's data model, run `pnpm medusa db:generate <module-name>` then `pnpm medusa db:migrate`
- Use `req.scope.resolve(MODULE_KEY)` inside API routes to access module services
- Business logic belongs in workflows (`createWorkflow`/`createStep`), not directly in API route handlers
- Use `MedusaService` as the base class for all module services

## Storefront (`apps/storefront`)
```
src/
├── app/
│   └── [countryCode]/     # All pages are scoped under a country code segment
│       ├── page.tsx        # Homepage
│       ├── shop/           # Shop/PLP pages
│       └── contact/        # Contact page
├── components/
│   ├── ui/                 # Generic, reusable UI primitives (Button, Input, etc.)
│   └── shared/             # Shared cross-feature components
├── data/                   # Static/mock data (to be replaced with live API calls)
├── feature/                # Page-level feature sections, grouped by page
│   ├── home/               # Homepage sections (Hero, Header, Footer, ProductGrid, etc.)
│   └── shop/               # Shop page sections (ShopGrid, ShopSidebar, ProductInfo, etc.)
├── lib/
│   ├── config.ts           # Medusa SDK client singleton
│   ├── constants.tsx       # App-wide constants
│   ├── utils.ts            # cn() utility (clsx + tailwind-merge)
│   ├── context/            # React context providers
│   ├── data/               # Server actions for Medusa API calls (products, cart, orders, etc.)
│   ├── hooks/              # Custom React hooks
│   └── util/               # Pure utility functions (money, sorting, product helpers)
├── modules/
│   ├── common/             # Shared icons and common module components
│   └── store/              # Store-specific components (refinement list, etc.)
├── types/                  # TypeScript type definitions
└── middleware.ts            # Region detection + countryCode redirect middleware
```

### Storefront Conventions
- All routes live under `src/app/[countryCode]/` — every page is region-aware
- Middleware (`src/middleware.ts`) handles region detection and redirects bare paths to `/<countryCode>/...`
- Data fetching functions live in `src/lib/data/` and are marked `"use server"` — they use the Medusa SDK (`sdk` from `src/lib/config.ts`)
- Feature-specific components go in `src/feature/<page>/` — these are page-section components, not reusable primitives
- Reusable UI primitives go in `src/components/ui/` following the shadcn/ui pattern (CVA variants, `cn()` for class merging)
- Use path aliases (`@/`, `@lib/`, `@modules/`, `@types/`) — never use relative `../../` imports across major directories
- Style with Tailwind utility classes; use `cn()` for conditional/merged class names
- Form validation uses `zod` schemas with `react-hook-form` + `@hookform/resolvers/zod`
- Buttons must use the `Button` component from `src/components/ui/button.tsx` — do not create raw `<button>` elements with custom styles


<!-- 3. Tech -->

# Tech Stack

## Monorepo
- **Package manager**: pnpm v11 with workspaces
- **Build orchestration**: Turborepo v2
- **Node requirement**: v20+

## Apps
| App | Purpose |
|-----|---------|
| `apps/backend` | Medusa v2 headless commerce server + admin dashboard |
| `apps/storefront` | Customer-facing Next.js storefront |
| `apps/storefront-template` | Reference/template storefront (do not modify directly) |

## Backend (`@dtc/backend`)
- **Framework**: Medusa v2 (`@medusajs/medusa` 2.17.x)
- **Language**: TypeScript, compiled with SWC
- **Database**: PostgreSQL (v15+)
- **Testing**: Jest with `@medusajs/test-utils`
- **Admin UI**: `@medusajs/dashboard` + `@medusajs/ui`
- **Config**: `medusa-config.ts` at the app root

## Storefront (`storefront`)
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + `tailwind-merge` + `clsx` (via `cn()` utility)
- **UI components**: shadcn/ui pattern with `class-variance-authority` + `radix-ui`
- **Icons**: `lucide-react` + `@tabler/icons-react`
- **Forms**: `react-hook-form` + `@hookform/resolvers` + `zod`
- **Medusa client**: `@medusajs/js-sdk` (configured in `src/lib/config.ts`)
- **Payments**: Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- **React version**: 19

## Common
- **Linting**: ESLint v9 with `@medusajs/eslint-plugin` (recommended config)
- **Formatting**: Prettier v3
- **TypeScript**: v5

## Path Aliases (Storefront)
```
@/*        → src/*
@lib/*     → src/lib/*
@types/*   → src/types/*
@modules/* → src/modules/*
```

## Common Commands

### Root (runs across all apps via Turborepo)
```bash
pnpm dev                  # Start all apps in dev mode
pnpm build                # Build all apps
pnpm lint                 # Lint all apps
pnpm test                 # Run all tests
pnpm backend:dev          # Start backend only
pnpm storefront:dev       # Start storefront only
pnpm backend:seed         # Seed backend data
```

### Backend (run from `apps/backend`)
```bash
pnpm dev                              # Start Medusa in development mode
pnpm build                            # Build for production
pnpm start                            # Start production server
pnpm medusa db:migrate                # Run database migrations
pnpm medusa db:generate <module>      # Generate migrations for a module
pnpm medusa user -e <email> -p <pass> # Create admin user
pnpm test:unit                        # Run unit tests
pnpm test:integration:http            # Run HTTP integration tests
pnpm test:integration:modules         # Run module integration tests
```

### Storefront (run from `apps/storefront`)
```bash
pnpm dev      # Start Next.js dev server on port 3002
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Environment Variables

### Backend (`apps/backend/.env`)
- `DATABASE_URL` — PostgreSQL connection string
- `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` — CORS origins
- `JWT_SECRET`, `COOKIE_SECRET`

### Storefront (`apps/storefront/.env.local`)
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` — required, get from Medusa admin
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` — defaults to `http://localhost:9000`
- `NEXT_PUBLIC_DEFAULT_REGION` — default country code (e.g. `us`)
- `NEXT_PUBLIC_BASE_URL` — storefront base URL
- `NEXT_PUBLIC_STRIPE_KEY` — Stripe publishable key (optional)




<!-- BEGIN:modification-permission -->

## no modification permission. 
Do not do any modification in node_modules or any other file/folder that are in .gitignore. 


## 3. Important Rules to Keep in Mind

1. **SDK-Only API requests**: Always use the imported `sdk` instance or functions from `@lib/data/` for fetching data from the backend. Never perform raw `fetch` calls to `/store/*`.
2. **CORS Configuration**: The Medusa Backend expects `STORE_CORS` to list all client origins. If you change the web app port (defaults to `3000`), make sure to append it to `STORE_CORS` in the backend environment.
3. **Pill-shaped Buttons**: Per the web app rules (`apps/web/AGENTS.md` and `DESIGN.md`), all buttons must always be styled with `rounded-full` (pill shape). No exceptions.


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