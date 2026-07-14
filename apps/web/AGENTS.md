<!-- Products -->

# Product: FootyStyleHub / EZ Commerce Storefront

A multi-category e-commerce storefront (currently focused on sportswear/football jerseys but designed to expand to any retail category). The platform serves customer-facing shopping flows only — no admin dashboard.

## Core User Types
- **Guest Shopper** — browse and buy without an account
- **Registered Customer** — account with order history, wishlist, saved addresses
- **Returning Customer** — repeat buyer with personalized experience

## Key Customer-Facing Features
- Homepage with hero banners, featured categories, new arrivals, best sellers
- Category & sub-category browsing, Product Listing Pages (PLP), Product Detail Pages (PDP)
- Global search, filters, sorting
- Shopping cart, guest checkout, address management, order summary
- Payment: Cash on Delivery + online payment methods (TBD by region)
- Customer accounts: order history, order tracking, wishlist, reviews & ratings
- Discount pricing, promo codes, promotional badges
- Static content pages: FAQ, Returns, Shipping, Contact, About
- Order confirmation and status notifications

## Brand Identity
- **Two-canvas system**: black (`#000000`) for cinematic/marketing pages; white/cream (`#ffffff`, `#fbfbf5`) for transactional pages
- **Buttons are always pill-shaped** (`border-radius: 9999px`) — no exceptions
- Primary fonts: **Instrument Sans** (brand/UI), **Neue Haas Grotesk Display** (display/hero), **Inter Variable** (body/UI)
- Design system is documented in `DESIGN.md` and `SKILL.md`
- BRD is in `BRD-Ecommerce-Platform.md`

## Out of Scope
- Admin/management dashboard
- Vendor/marketplace seller onboarding
- Physical logistics/warehouse operations


<!-- Refarence files -->

@BRD-Ecommerce-Platform.md
@SKILL.md 
@DESIGN.md


<!-- Structure -->

# Project Structure

## Root Layout

```
apps/web/
├── src/
│   └── app/                  # Next.js App Router root
│       ├── layout.tsx        # Root layout (fonts, metadata, body wrapper)
│       ├── page.tsx          # Homepage
│       └── globals.css       # Global styles / Tailwind base
├── public/                   # Static assets (SVGs, images)
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── DESIGN.md                 # Design system tokens and component specs
├── SKILL.md                  # FootyStyleHub design-system authoring rules
└── BRD-Ecommerce-Platform.md # Business requirements document
```

## Conventions

### File & Folder Naming
- Route folders and files: `kebab-case` (e.g., `product-detail/`, `shopping-cart/`)
- React components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Utility/helper modules: `camelCase.ts` (e.g., `formatPrice.ts`)
- Co-locate component-specific styles, tests, and types in the same folder as the component

### App Router Patterns
- Pages live at `src/app/<route>/page.tsx`
- Shared layouts at `src/app/<route>/layout.tsx`
- Server Components by default; add `"use client"` only when needed (event handlers, browser APIs, hooks)
- Use `next/image` for all images and `next/link` for all internal navigation
- Metadata exported from `layout.tsx` or `page.tsx` via the `Metadata` type

### Imports
- Use the `@/*` alias for all imports from `src/` (e.g., `import { Button } from "@/components/ui/Button"`)
- Avoid relative `../` imports that cross feature boundaries

### Styling
- Tailwind CSS v4 utility classes are the primary styling mechanism
- No inline `style` props except for dynamic values that can't be expressed as utilities
- Design tokens from `DESIGN.md` should be mapped to Tailwind config / CSS variables
- **Buttons must always use `rounded-full`** — pill shape is non-negotiable per brand rules
- Two canvas contexts: dark (`bg-black text-white`) for marketing/hero, light (`bg-white text-black`) for transactional pages — never mix

### TypeScript
- Strict mode is on — no `any`, no `// @ts-ignore` without a documented reason
- Prefer `interface` for object shapes, `type` for unions and aliases
- Co-locate types with the module that owns them; shared types go in `src/types/`

## Planned Directory Expansion
As the project grows, organize under `src/` like this:

```
src/
├── app/                  # Routes (App Router)
├── components/
│   ├── ui/               # Primitive/design-system components (Button, Card, Input…)
│   └── <feature>/        # Feature-specific components (ProductCard, CartItem…)
├── lib/                  # Utilities, helpers, API clients
├── hooks/                # Custom React hooks
├── types/                # Shared TypeScript types
└── styles/               # Global CSS variables / Tailwind theme extension
```


<!-- Tech -->

# Tech Stack

## Core
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Runtime**: React 19
- **Styling**: Tailwind CSS v4
- **Linting**: ESLint 9 with `eslint-config-next`

## Compiler & Optimization
- **React Compiler** is enabled (`reactCompiler: true` in `next.config.ts`) — do not manually wrap components in `useMemo`/`useCallback` where the compiler can handle it
- TypeScript path alias: `@/*` maps to `./src/*`

## Fonts
Loaded via `next/font/google`. Currently scaffolded with Geist/Geist Mono — these should be replaced with the brand fonts:
- **Instrument Sans** — primary UI font
- **Neue Haas Grotesk Display** (or Inter Display as open-source substitute) — display/hero headings
- **Inter Variable** — body and UI copy

## Common Commands

```bash
# Development server (run manually in terminal)
bun run dev

# Production build
bun run build

# Start production server
bun run start

# Lint
bun run lint
```

> Note: `bun run dev` is a long-running process — run it manually in a terminal, do not execute it programmatically.

## Key Config Files
- `next.config.ts` — Next.js config
- `tsconfig.json` — TypeScript config (strict, bundler module resolution)
- `postcss.config.mjs` — PostCSS with `@tailwindcss/postcss`
- `eslint.config.mjs` — ESLint flat config



<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version might have  breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices. And also do not check every time. Only if you face any version-related issue then do check this. 
<!-- END:nextjs-agent-rules -->
