<!-- 0. Reference -->
# 0. Reference for more details
Here are additional documentations, whenever needed about these details make sure to read them:

- @BRD-Ecommerce-Platform.md
- @DESIGN.md
- @docs/common-ecoomence-plan.md
- @docs/FUTURE-PAGES-DRAFTS.MD
- @docs/MEDUSA_SETUP.md
- @docs/API-workflow.md
- @docs/auth-workflow.md
- @docs/mobile-apps/MOBILE_APP_GUIDE.md
- @docs/mobile-apps/Design a Mobile High-Speed Capacitor Architecture.md
- @docs/mobile-apps/Converting an Existing Next.js Website into a Mobile App with Capacitor.md

<!-- 1.Product -->
# Product

**EzCommerce Storefront** is a high-performance, production-ready direct-to-consumer (DTC) e-commerce storefront. While initially styled and seeded for sports apparel and football jerseys, it is architected as an extensible, multi-category storefront supporting apparel, electronics, accessories, and any physical goods.

It operates seamlessly as both a **responsive web application** and a **native mobile application** (Android & iOS) packaged with Capacitor.

## Core Customer Features

- **Storefront & Discovery**:
  - Dynamic homepage with hero banners, category strip, featured banners, product grids, editorial tiles, value props, testimonials, Instagram grid, and newsletter.
  - Product Listing Page (PLP) with multi-criteria filtering (category, price, size, color, brand), sorting, and search refinement.
  - Product Detail Page (PDP) with interactive image galleries, variant selection, accordion specs, stock indicators, related products, and recently viewed tracking.
- **Cart & Wishlist**:
  - Slide-over cart sheet and dedicated cart page (`/cart`).
  - Real-time line item updates, promo/discount codes, and free shipping progress tracker.
  - Wishlist management (`/wishlist`).
- **Checkout & Payments**:
  - Multi-step checkout flow (`/checkout`) supporting both guest and registered shoppers.
  - Region-aware shipping rates and tax calculations via Medusa backend.
  - Support for Cash on Delivery (COD) and Stripe credit/debit card payments.
- **Customer Account Portal**:
  - Full account center (`/account`) with dedicated subpages:
    - Overview (`/account`)
    - Order History & Order Details (`/account/orders`, `/account/orders/details`)
    - Saved Addresses (`/account/addresses`)
    - Profile Information & Avatar Upload (`/account/profile`)
    - Security & Password Management (`/account/security`)
    - Notification Preferences (`/account/notifications`)
- **Authentication**:
  - Dedicated auth route group (`(auth)`) supporting Login, Register, Forgot Password, OTP Verification, Email Verification, Phone Verification, and Social Auth buttons.
- **Multi-Region & Localization**:
  - URL-prefixed country routing (e.g. `/[countryCode]/shop`, default `gb` or `bn`).
  - Region detection via URL segment, edge headers (Cloudflare `cf.country`, Vercel `x-vercel-ip-country`), and cookies.
- **Mobile-First & Native Experience**:
  - Native mobile app integration via **Capacitor 7**.
  - Hardware back button handling, haptic feedback, safe area insets (`pt-safe`, `pb-safe`), theme-synced status bar, and splash screen management.
  - Mobile bottom navigation bar (`BottomNav`) for seamless app-like navigation.

## Brand & Design Direction

- **Editorial Near-Monochrome Aesthetic**: High-contrast black-and-white visual identity (`--ink`, `--canvas`, `--cloud`, `--hairline`, `--charcoal`, `--mute`), photography-first with a single semantic accent color (`--sale` orange-red) for promotions and discounts.
- **Pill-Shaped Buttons**: **All buttons must use pill shape (`rounded-full` / `rounded-pill` / `border-radius: 9999px`)**. This is a non-negotiable brand requirement.
- **Typography**: `Instrument Sans` (`--font-sans`) for crisp body text and `Bebas Neue` (`--font-display`) for bold editorial display headings.
- **Price Presentation**: Discounted items display the sale price in `--sale` accent with original price struck through and discount percentage badge.

<!-- 2.Structure -->
# Project Structure

```
apps/storefront/
├── capacitor.config.ts        # Capacitor 7 mobile app configuration
├── check-env-variables.ts     # Startup environment variable validation
├── next.config.ts             # Next.js 16 configuration (compiler, images, remote patterns)
├── package.json
├── docs/                      # Technical guides (API, Auth, Mobile, Medusa setup)
└── src/
    ├── app/                   # Next.js App Router pages and layouts
    │   ├── globals.css        # Tailwind v4 theme, design tokens, safe area utilities
    │   ├── layout.tsx         # Root layout with fonts, RootWrapper, metadata, viewport
    │   └── [countryCode]/     # Region-scoped dynamic route segment
    │       ├── page.tsx       # Storefront homepage
    │       ├── (auth)/        # Authentication route group
    │       │   ├── layout.tsx
    │       │   ├── login/
    │       │   ├── register/
    │       │   ├── forgot-password/
    │       │   ├── otp/
    │       │   ├── verify-email/
    │       │   └── verify-phone/
    │       ├── (checkout)/    # Checkout flow route group
    │       │   ├── layout.tsx
    │       │   └── checkout/
    │       └── (main)/        # Standard browsing route group
    │           ├── account/   # Customer portal (addresses, orders, profile, security, notifications)
    │           ├── cart/      # Dedicated cart page
    │           ├── shop/      # PLP (`page.tsx`) & PDP (`[id]/page.tsx`)
    │           ├── wishlist/  # Wishlist page
    │           └── contact/   # Contact Us page
    ├── components/
    │   ├── ui/                # Base shadcn/ui primitives (button, input, select, sheet, dialog, etc.)
    │   └── shared/            # Cross-cutting project components:
    │                          # - `bottom-nav.tsx` (Mobile bottom navigation bar)
    │                          # - `mobile-initializer.tsx` (Capacitor status bar & back button)
    │                          # - `root-wrapper.tsx` (TanStack Query, NextThemes, Nuqs provider wrapper)
    │                          # - `common-input.tsx`, `auth-input.tsx`
    ├── config/                # App-level constants & metadata
    │   ├── branding.tsx       # Brand name, logo, slogan, social contact links
    │   └── index.ts
    ├── data/                  # Static mock/seed data (used for prototypes & fallback displays)
    ├── feature/               # Page-specific feature sections:
    │   ├── account/           # Account sidebar, profile avatar upload
    │   ├── auth/              # Social auth buttons & auth forms
    │   ├── home/              # Hero, Header, Footer, CategoryStrip, ProductGrid, ProductCard,
    │   │                      # FeatureBanner, EditorialTiles, ValueProps, Testimonials, FAQ,
    │   │                      # Marquee, Newsletter, show-carts
    │   └── shop/              # ProductGallery, ProductInfo, ShopGrid, ShopSidebar, ShopToolbar,
    │                          # ShopContent, RelatedProducts, RecentlyViewed, product-accordions
    ├── lib/
    │   ├── api/               # API client wrapper modules (Medusa SDK / custom endpoints)
    │   │   ├── products.ts
    │   │   ├── categories.ts
    │   │   └── regions.ts
    │   ├── capacitor/         # Capacitor native utilities (haptics, back button, status bar, splash)
    │   ├── config.ts          # Medusa JS SDK client singleton initialization
    │   ├── constants.tsx      # App-wide constants
    │   ├── context/           # React contexts (e.g. modal-context)
    │   ├── data/              # Server Actions for Medusa API calls ("use server")
    │   │   ├── cart.ts, customer.ts, products.ts, orders.ts, regions.ts,
    │   │   ├── collections.ts, categories.ts, fulfillment.ts, payment.ts,
    │   │   ├── locales.ts, locale-actions.ts, cookies.ts, onboarding.ts, variants.ts
    │   ├── font.ts            # Google fonts configuration (Instrument Sans, Bebas Neue)
    │   ├── hooks/             # Custom React hooks (use-in-view, use-toggle-state)
    │   │   └── api/           # TanStack Query API hooks (use-cart, use-products, use-categories, use-regions)
    │   ├── util/              # Pure utility functions (money, get-product-price, sort-products, etc.)
    │   └── utils.ts           # cn() helper (clsx + tailwind-merge)
    ├── modules/               # Self-contained modules (common icons, refinement-list)
    ├── proxy.ts               # Next.js middleware proxy (region detection, auth guard, caching)
    └── types/                 # Shared TypeScript interfaces (global.ts, icon.ts)
```

## Key Architectural Conventions

1. **All Customer Routes are Scoped**: Every route resides under `src/app/[countryCode]/`. Never create top-level un-scoped customer pages.
2. **Proxy / Middleware Routing (`src/proxy.ts`)**:
   - Resolves country code from path, edge geo headers, or fallback (`NEXT_PUBLIC_DEFAULT_REGION`).
   - Handles route guards: redirects unauthenticated users accessing `/account` to `/[countryCode]/login`, and redirects logged-in users away from auth pages to `/[countryCode]/account`.
3. **Data Fetching Paradigm**:
   - **Server Components & Server Actions (`src/lib/data/`)**: Always marked `"use server"`. Used for SSR data fetching, cart modifications, customer mutations, and order creation.
   - **Client-side TanStack Query (`src/lib/api/` + `src/lib/hooks/api/`)**: Used for rich client interactivity, dynamic filtering, category queries, and instant updates.
   - **Medusa SDK singleton (`src/lib/config.ts`)**: Always use the shared `sdk` instance for Medusa API requests. Never make raw `fetch` calls to `/store/*`.
4. **Mobile & Capacitor Awareness**:
   - Use safe area utilities (`pt-safe`, `pb-safe`, `min-h-screen-safe`) on sticky headers, bottom navigation, and full-screen views.
   - Use `triggerHaptic()` from `@/lib/capacitor` for tactile feedback on key actions (adding to cart, toggling wishlist, tab switching).
   - Use `useIsNative()` or `isNativePlatform()` to conditionally adjust behavior for mobile apps vs web.
5. **Path Aliases**:
   - Always use aliases: `@/*` (`src/*`), `@lib/*` (`src/lib/*`), `@modules/*` (`src/modules/*`), `@feature/*` (`src/feature/*`), `@types/*` (`src/types/*`).

<!-- 3.Tech -->
# Tech Stack

## Core Technologies
- **Framework**: Next.js 16.2.x (App Router)
- **React**: React 19.2.x + React Compiler (`babel-plugin-react-compiler`)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`, `tw-animate-css`)
- **Icons**: Lucide React (`lucide-react`) + Tabler Icons (`@tabler/icons-react`)
- **State & Data**: TanStack React Query v5 (`@tanstack/react-query`) + `nuqs` (URL query state)
- **Forms & Validation**: `react-hook-form` + `@hookform/resolvers` + `zod`
- **Theming**: `next-themes` (Dark/Light support)
- **Payments**: Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`)

## Backend & Commerce
- **Commerce Engine**: Medusa v2 (`@medusajs/js-sdk` 2.17.2, `@medusajs/types` 2.17.2)
- **Backend URL**: `http://localhost:9000` (default)
- **Storefront Dev Port**: `http://localhost:8000` (`--port 8000`)

## Mobile & Capacitor Stack
- **Capacitor Core**: `@capacitor/core` ^7.0.1, `@capacitor/cli` ^7.0.1
- **Platforms**: `@capacitor/android` ^7.0.1, `@capacitor/ios` ^7.0.1
- **Plugins**:
  - `@capacitor/app` (App state & minimize)
  - `@capacitor/haptics` (Impact & notification haptic vibrations)
  - `@capacitor/keyboard` (Keyboard display & viewport resizing)
  - `@capacitor/splash-screen` (Native splash launch & dismiss)
  - `@capacitor/status-bar` (Native status bar styling & theming)

## Environment Variables

| Variable | Required | Description | Default |
|---|---|---|---|
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | **Yes** | Publishable API key from Medusa Admin | — |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | **Yes** | Medusa v2 backend server URL | `http://localhost:9000` |
| `NEXT_PUBLIC_DEFAULT_REGION` | No | Default fallback country code | `gb` (or `bn`) |
| `NEXT_PUBLIC_BASE_URL` | No | Base storefront URL for absolute links | `http://localhost:8000` |
| `NEXT_PUBLIC_STRIPE_KEY` | No | Stripe publishable key for card payments | — |
| `CAPACITOR_SERVER_URL` | No | Override server URL for Capacitor livereload | `http://localhost:8000` |
| `MEDUSA_CLOUD_S3_HOSTNAME` | No | S3 bucket hostname for remote image optimization | — |
| `MEDUSA_CLOUD_S3_PATHNAME` | No | S3 bucket pathname for remote image optimization | — |

## Common Commands

```bash
# Run Next.js storefront dev server (port 8000)
pnpm dev

# Build for production
pnpm build

# Start production server (port 8000)
pnpm start

# Run ESLint & code checks
pnpm lint

# Format check / fix
pnpm format
pnpm format:fix

# --- Capacitor Mobile Commands ---
# Sync web build/assets to native projects
pnpm cap:sync

# Copy web assets to native projects
pnpm cap:copy

# Open Android Studio
pnpm cap:android

# Open Xcode (macOS only)
pnpm cap:ios

# Run on connected Android device / emulator
pnpm cap:run:android

# Run on iOS device / simulator (macOS only)
pnpm cap:run:ios
```

> **Android Dev Tip**: When testing on a physical Android device connected via USB with live-reload, run:
> ```bash
> adb reverse tcp:8000 tcp:8000
> adb reverse tcp:9000 tcp:9000
> ```

<!-- BEGIN:API-workflow -->
# API Layer Workflow (Medusa SDK + TanStack Query)

When working on API integration, follow the guidelines documented in `/docs/API-workflow.md`:

## Architecture
The API layer is structured in 2 complementary layers:

1. **API Wrappers (`src/lib/api/`)**:
   - Wrap Medusa SDK endpoints and custom route handlers.
   - No React hooks or UI logic.
   - Use `sdk.store.*` for standard Medusa store endpoints.
   - Use `sdk.client.fetch()` for custom backend endpoints.
   - Never use manual `JSON.stringify()` for request bodies (the SDK handles serialization).
   - Export one `<module>Api` object per file.

2. **API Hooks (`src/lib/hooks/api/`)**:
   - Wrap API wrappers with TanStack Query.
   - Use `useQuery` for GET requests.
   - Use `useMutation` for POST, PATCH, PUT, and DELETE operations.
   - Define query keys in a `*_KEYS` constant at the top of the file.
   - Invalidate related query keys upon successful mutation.

3. **Server Actions (`src/lib/data/`)**:
   - Use for SSR data loading, cart cookies, customer session cookies, and server-side checkout handling.
   - Must include `"use server"` directive at the top.

<!-- END:API-workflow -->

<!-- BEGIN:modification-permission -->
## Modification Permissions

- **Do NOT modify** `node_modules/`, `.next/`, `android/`, `ios/`, or any files listed in `.gitignore`.
- **Pill-shaped Buttons**: Per brand guidelines, all buttons must always be styled with `rounded-full` (`rounded-pill`). No square or slightly rounded buttons.
- **SDK-Only Requests**: Always use the Medusa SDK instance (`sdk`) or `@lib/data/` Server Actions for backend calls. Never make raw fetch calls to `/store/*`.
- **CORS Configuration**: If you adjust port numbers, ensure the Medusa backend `.env` `STORE_CORS` includes the client origin (e.g. `http://localhost:8000`).
<!-- END:modification-permission -->

<!-- BEGIN:behavioral-guidelines -->
## 1. Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**
- State assumptions explicitly. If uncertain, ask.
- If multiple approaches exist, explain the tradeoffs before deciding.
- Push back when simpler solutions exist.

## 2. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**
- No features beyond what was asked.
- No single-use abstractions or speculative flexibility.
- If 50 lines can do the work cleanly, don't write 200 lines.

## 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**
- Don't format or refactor unrelated code.
- Match existing repository patterns and conventions.
- Remove imports and variables made unused by your changes.

## 4. Goal-Driven Execution
**Define success criteria. Loop until verified.**
- Verify changes compile and build cleanly.
- Test both web and mobile-responsive viewport interactions when modifying UI components.
<!-- END:behavioral-guidelines -->
