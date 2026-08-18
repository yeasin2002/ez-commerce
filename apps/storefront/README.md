# EzCommerce Storefront

A modern, high-performance direct-to-consumer (DTC) e-commerce storefront built with **Next.js 16 (App Router)**, **React 19**, **Medusa v2**, and **Capacitor 7** for cross-platform Web, Android, and iOS experiences.

---

## Features

- **Multi-Region & Localization**: Dynamic country code routing (`/[countryCode]/...`) with automatic edge-based country detection and currency handling.
- **Modern Commerce UI**: Editorial, high-contrast monochrome design system with semantic accents, fluid typography, and brand-mandated pill-shaped buttons.
- **Product Catalog & Discovery**: Product listing with dynamic filtering (category, price, size, color), search refinement, and rich product detail pages with variant selection.
- **Cart & Checkout**: Slide-out cart drawer, dedicated cart page, free shipping progress indicator, promo code support, and multi-step checkout supporting Cash on Delivery & Stripe.
- **Customer Portal & Auth**: Complete account center (order tracking, addresses, profile & avatar upload, security, notification settings) and auth flows (Login, Register, Forgot Password, OTP, Email/Phone Verification).
- **Native Mobile App (Capacitor 7)**: Hybrid native support on Android & iOS with native haptic feedback, safe area insets, status bar syncing, splash screen management, hardware back button routing, and mobile bottom navigation.
- **Hybrid Data Layer**: Next.js Server Actions (`lib/data/`) for server-rendered data and mutations, paired with TanStack Query v5 (`lib/hooks/api/`) and URL query state (`nuqs`) for snappy client interactivity.

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) + React Compiler |
| **Backend** | [Medusa v2](https://medusajs.com/) (`@medusajs/js-sdk` 2.17.x) |
| **Mobile Runtime** | [Capacitor 7](https://capacitorjs.com/) (Android & iOS) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + OKLCH Design Tokens + [Radix UI](https://www.radix-ui.com/) |
| **Data Fetching** | Next.js Server Actions + [TanStack React Query v5](https://tanstack.com/query) |
| **Form Management** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) + [Tabler Icons](https://tabler.io/icons) |
| **URL State** | [nuqs](https://nuqs.47ng.com/) |

---

## Getting Started

### Prerequisites

- **Node.js**: v20+
- **pnpm**: v11+
- **Medusa Backend**: Running locally on `http://localhost:9000` (or configured remote URL)
- **Android Studio / Xcode** (optional, for mobile native builds)

### 1. Environment Setup

Create or verify `.env` in `apps/storefront`:

```env
# Required: Publishable API key from Medusa Admin (Settings -> Publishable API Keys)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_medusa_publishable_key_here

# Required: URL of your Medusa backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Optional: Default country code for routing (defaults to gb or bn)
NEXT_PUBLIC_DEFAULT_REGION=gb

# Optional: Storefront base URL
NEXT_PUBLIC_BASE_URL=http://localhost:8000

# Optional: Stripe publishable key for card payments
NEXT_PUBLIC_STRIPE_KEY=
```

### 2. Run Development Server

```bash
# From workspace root
pnpm storefront:dev

# Or directly inside apps/storefront
pnpm dev
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## Mobile App Development (Capacitor)

The storefront is configured with Capacitor to run as a native mobile app.

### Common Mobile Commands

```bash
# Sync web build and assets to native iOS and Android projects
pnpm cap:sync

# Copy web assets to native platforms
pnpm cap:copy

# Open Android Studio
pnpm cap:android

# Open Xcode (macOS only)
pnpm cap:ios

# Build and run directly on a connected Android device or emulator
pnpm cap:run:android

# Build and run directly on an iOS device or simulator (macOS only)
pnpm cap:run:ios
```

### Live Reload on Physical Android Devices

When running the Next.js dev server on your computer and testing on a connected USB Android device, reverse the ports:

```bash
adb reverse tcp:8000 tcp:8000
adb reverse tcp:9000 tcp:9000
```

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `pnpm dev` | `next dev --port 8000` | Starts development server on port 8000 |
| `pnpm build` | `next build` | Compiles production build |
| `pnpm start` | `next start --port 8000` | Runs production server on port 8000 |
| `pnpm lint` | `eslint` | Runs ESLint checks |
| `pnpm format` | `prettier --check` | Checks code formatting |
| `pnpm format:fix` | `prettier --write` | Automatically formats TypeScript/TSX files |
| `pnpm cap:sync` | `cap sync` | Syncs web assets & plugins with native projects |
| `pnpm cap:android`| `cap open android` | Opens the Android project in Android Studio |
| `pnpm cap:ios` | `cap open ios` | Opens the iOS project in Xcode |

---

## Directory Structure

```
src/
├── app/
│   ├── [countryCode]/
│   │   ├── (auth)/        # Login, Register, OTP, Forgot Password, Verification
│   │   ├── (checkout)/    # Multi-step checkout flow
│   │   ├── (main)/        # Shop (PLP/PDP), Cart, Wishlist, Account portal, Contact
│   │   └── page.tsx       # Homepage
│   ├── globals.css        # Tailwind v4 theme, tokens & safe area utilities
│   └── layout.tsx         # Root layout with fonts, viewport & RootWrapper
├── components/
│   ├── ui/                # Base UI primitives (Button, Input, Sheet, Select, etc.)
│   └── shared/            # MobileInitializer, BottomNav, RootWrapper, CommonInput
├── config/                # Branding and site configuration
├── feature/               # Page-specific components (home, shop, account, auth)
├── lib/
│   ├── api/               # Medusa SDK client wrappers (products, categories, regions)
│   ├── capacitor/         # Native bridge utilities (haptics, back button, status bar)
│   ├── config.ts          # Medusa SDK client instance
│   ├── data/              # Server Actions for Medusa API calls
│   ├── hooks/             # Custom hooks & TanStack Query hooks (`hooks/api/`)
│   └── util/              # Pure utility functions (pricing, sorting, formatters)
├── modules/               # Self-contained feature modules & SVG icons
├── proxy.ts               # Region routing and auth guard middleware proxy
└── types/                 # Global and shared TypeScript definitions
```
