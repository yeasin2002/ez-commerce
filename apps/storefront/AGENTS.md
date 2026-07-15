<!-- 1.Product -->
# Product

**ez-commerce storefront** is a multi-category e-commerce storefront built for a business that initially sells football jerseys and sportswear but is architected to support any product category (apparel, electronics, accessories, etc.).

## What It Does

- Customers browse products across categories, view product detail pages, add to cart, and complete checkout.
- Supports guest checkout and registered customer accounts.
- Handles regional routing — all URLs are prefixed with a country code (e.g. `/bn/shop`).
- Integrates with a Medusa v2 backend for products, cart, orders, payments, and regions.
- Supports Cash on Delivery and Stripe online payments.
- Displays promotional pricing (sale badges, strikethrough original prices, discount percentages).

## Target Users

- Guest shoppers and registered customers
- Mobile-first audience — the majority of traffic is expected on phones

## Key Business Rules

- All buttons must use pill shape (`rounded-pill` / `border-radius: 9999px`) — this is a non-negotiable brand requirement.
- Sale/discount prices are shown in the `--sale` accent color with the original price struck through.
- The design follows a near-monochrome editorial style: black ink on white canvas, with the sale orange-red as the only semantic accent.


<!-- 2.structure -->
# Project Structure

## Top-Level Layout

```
src/
├── app/                  # Next.js App Router pages and layouts
├── components/           # Reusable, generic components
├── data/                 # Static mock/seed data (not Medusa API calls)
├── feature/              # Page-level feature components, grouped by route
├── lib/                  # Shared utilities, hooks, config, and server data functions
├── modules/              # Self-contained feature modules (icons, store refinement)
└── types/                # Shared TypeScript types
```

## `src/app/` — Routes

All customer-facing routes live under the `[countryCode]` dynamic segment. The middleware in `src/middleware.ts` handles detection and redirection to the correct country prefix.

```
app/
├── layout.tsx              # Root layout (fonts, global CSS)
├── globals.css             # Design tokens and Tailwind base styles
└── [countryCode]/
    ├── page.tsx            # Homepage
    ├── shop/
    │   ├── page.tsx        # Product listing page (PLP)
    │   └── [id]/page.tsx   # Product detail page (PDP)
    └── contact/page.tsx
```

## `src/feature/` — Page Feature Components

Feature components are co-located by the page/route they belong to. They are not generic — they are purpose-built for a specific page section.

```
feature/
├── home/       # Homepage sections: Hero, Header, Footer, ProductCard, ProductGrid, FAQ, etc.
└── shop/       # Shop page sections: ShopGrid, ShopSidebar, ProductInfo, ProductGallery, etc.
```

- Feature components can be Server or Client Components depending on their needs.
- Add `"use client"` only when the component requires interactivity or browser APIs.

## `src/components/` — Shared UI Components

```
components/
├── ui/         # shadcn/ui primitives: Button, Input, Textarea, InputGroup
└── shared/     # Project-specific shared components (e.g. CommonInput)
```

- `ui/` components are generic and unstyled beyond the design system tokens.
- `shared/` components are thin wrappers that compose `ui/` components with project-specific defaults.
- Always export shared components through `shared/index.ts`.

## `src/lib/` — Utilities and Data Layer

```
lib/
├── config.ts           # Medusa SDK client initialization
├── utils.ts            # cn() helper (clsx + tailwind-merge)
├── constants.tsx       # App-wide constants
├── context/            # React context providers (e.g. modal-context)
├── hooks/              # Custom React hooks (use-in-view, use-toggle-state)
├── data/               # Server Actions for Medusa API calls
│   ├── products.ts
│   ├── cart.ts
│   ├── orders.ts
│   ├── regions.ts
│   ├── customer.ts
│   ├── payment.ts
│   └── ...
└── util/               # Pure utility functions (formatting, sorting, price calc)
```

- Every file in `lib/data/` must have `"use server"` at the top — these are Server Actions only.
- Pure helpers (no I/O, no server deps) belong in `lib/util/`.

## `src/modules/` — Self-Contained Feature Modules

Used for more complex, self-contained UI features that bundle their own components.

```
modules/
├── common/icons/       # SVG icon components (Bancontact, iDEAL, PayPal)
└── store/components/refinement-list/   # Product sort/filter UI
```

## `src/types/` — Shared Types

- `global.ts` — shared types like `VariantPrice`, `FeaturedProduct`, `StoreFreeShippingPrice`
- `icon.ts` — icon prop types

## Path Aliases

Configured in `tsconfig.json`. Use these instead of relative paths:

| Alias | Resolves to |
|---|---|
| `@/*` | `src/*` |
| `@lib/*` | `src/lib/*` |
| `@modules/*` | `src/modules/*` |
| `@feature/*` | `src/feature/*` |

## Key Conventions

- **New pages** go under `src/app/[countryCode]/`.
- **New page sections** go in the matching `src/feature/<page>/` directory.
- **New reusable primitives** go in `src/components/ui/` (generic) or `src/components/shared/` (project-specific).
- **New Medusa data calls** go in `src/lib/data/` as Server Actions (`"use server"`).
- **New utility functions** (pure, no I/O) go in `src/lib/util/`.
- **Static/mock data** used for prototyping goes in `src/data/`.


<!-- 3.Tech -->
# Tech Stack

## Core Framework
- **Next.js 16** (App Router) with React 19
- **TypeScript 5** — `ignoreBuildErrors: true` in next.config.ts (do not rely on build-time type errors catching issues)
- **React Compiler** enabled (`reactCompiler: true`)

## Backend Integration
- **Medusa v2** (`@medusajs/js-sdk` 2.17.2) — headless commerce backend
- The SDK client is initialized in `src/lib/config.ts` and extended to inject `x-medusa-locale` headers on every request
- All data-fetching functions in `src/lib/data/` are **Server Actions** (`"use server"`) — never import them in client components directly
- Cache is handled via Next.js `fetch` tags (`getCacheOptions`) and `force-cache`

## Styling
- **Tailwind CSS v4** with `@tailwindcss/postcss`
- **Design tokens** are defined as CSS custom properties in `src/app/globals.css` using `oklch` color space — never hardcode hex values in components
- Key semantic tokens: `--ink`, `--canvas`, `--cloud`, `--mute`, `--sale`, `--hairline-soft`
- `rounded-pill` (9999px) is defined as a custom radius token — use it for all buttons
- `container-page` is a custom `@utility` for the max-width page wrapper (1440px, responsive padding)
- **shadcn/ui** components live in `src/components/ui/` — use `cn()` from `src/lib/utils.ts` for class merging

## UI Libraries
- `radix-ui` — primitives used by shadcn components
- `class-variance-authority` (CVA) — variant definitions for UI components
- `clsx` + `tailwind-merge` — via the `cn()` helper
- `lucide-react` + `@tabler/icons-react` — icon sets
- `react-hook-form` + `zod` — forms and validation
- `@stripe/react-stripe-js` + `@stripe/stripe-js` — payment UI

## Fonts
- **Instrument Sans** — `--font-sans`, used for body text
- **Bebas Neue** — `--font-display`, used for headings (`h1`–`h6`)
- Both loaded via `next/font/google`

## Environment Variables
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` — Medusa backend URL (defaults to `http://localhost:9000`)
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` — Medusa publishable API key
- `NEXT_PUBLIC_DEFAULT_REGION` — fallback country code for regional routing (defaults to `"bn"`)
- `MEDUSA_CLOUD_S3_HOSTNAME` / `MEDUSA_CLOUD_S3_PATHNAME` — optional S3 image host for `next/image` remote patterns
- Validated at boot via `check-env-variables.ts`

## Common Commands

```bash
# Development server (port 3002)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

> This project is part of a pnpm monorepo (`ez-commerce`). Run commands from the `apps/storefront` directory or via the root workspace tooling (Turborepo — see `.turbo/`).





<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version might have  breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices. And also do not check every time. Only if you face any version-related issue then do check this. 
<!-- END:nextjs-agent-rules -->


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