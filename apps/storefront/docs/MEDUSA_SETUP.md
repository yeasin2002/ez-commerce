# Medusa Storefront API Integration Setup

This document serves as an instruction manual for future AI agents, developers, or engineers to continue building and integrating the **EZ Commerce Web Storefront** (`apps/web`) with the **Medusa Backend**.

---

##   1. Copied and Adapted Assets

The following files and configurations have been successfully ported from `apps/storefront` and adapted for `apps/web` (Next.js 16 + Tailwind CSS v4 + React 19):

### ✅ Configuration Files
- **[next.config.ts](file:///c:/yeasin2002/experiments/ez-commerce/apps/web/next.config.ts)**: Configured with `checkEnvVariables()`, strict mode, logging, remote patterns for localized images, and AWS S3 remote patterns.
- **[tsconfig.json](file:///c:/yeasin2002/experiments/ez-commerce/apps/web/tsconfig.json)**: Added path mapping aliases (`@lib/*`, `@types/*`, and `@modules/*`) to match storefront conventions and make imported API clients resolve natively.
- **[check-env-variables.ts](file:///c:/yeasin2002/experiments/ez-commerce/apps/web/check-env-variables.ts)**: Validates presence of necessary Medusa configuration keys at startup.
- **[.env.local](file:///c:/yeasin2002/experiments/ez-commerce/apps/web/.env.local)**: Ported env vars targeting the Medusa backend:
  ```env
  NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_b3cbe4f31ab219aa4b2777f4a1214d6bc93d667df9cd5e800b792a43cc1a1c48
  NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
  NEXT_PUBLIC_DEFAULT_REGION=dk
  NEXT_PUBLIC_BASE_URL=http://localhost:3000
  ```

### ✅Directory Structure of Copied Library Core (`apps/web/src/`)
- **`lib/config.ts`**: Instantiates and exports the Medusa SDK instance (`sdk = new Medusa(...)`). Overrides `sdk.client.fetch` to attach locale headers automatically.
- **`lib/constants.tsx`**: Maps payment providers (Stripe, Paypal, manual, etc.) and lists zero-decimal currencies.
- **`lib/context/modal-context.tsx`**: High-level state context to trigger/handle custom storefront modal dialogs.
- **`lib/data/`**: Server Actions wrapping the Medusa SDK client for fetching:
  - Carts (`cart.ts`)
  - Categories (`categories.ts`)
  - Collections (`collections.ts`)
  - Customers/Auth (`customer.ts`)
  - Shipping/Fulfillment (`fulfillment.ts`)
  - Regional locales (`locale-actions.ts`, `locales.ts`)
  - Orders (`orders.ts`)
  - Products & Product Lists (`products.ts`)
  - Regions (`regions.ts`)
  - Variants & Prices (`variants.ts`)
- **`lib/hooks/`**: Shared hooks: `useInView`, `useToggleState`.
- **`lib/util/`**: Shared utility actions for address formatting, price conversions, sorting, and error parsing.
- **`types/`**: Core types (`global.ts`, `icon.ts`).
- **`middleware.ts`**: Intercepts routing, extracts local country prefix (from URL/headers/defaults), configures cache parameters, and handles redirection.

---

## 2. API Integration Strategy & Future Tasks

When you start implementing custom screens (Homepage, Product Grid, Checkout, Cart), use this setup as your API engine.

### A. Data Fetching from Medusa (Server Components)
Always prefer fetching on the server side using Server Actions located in `@lib/data/*`.

**Example: Fetching and Displaying Products on a Page**
```tsx
import { listProducts } from "@lib/data/products";
import ProductCard from "@/components/ProductCard";

export default async function StorePage({ params }) {
  const { countryCode } = await params;
  const { response: { products } } = await listProducts({
    countryCode,
    pageParam: 1
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### B. Cart and Authentication Actions
Use the methods in `@lib/data/cart` and `@lib/data/customer`. These actions set cookies natively on the client using Next.js Server Actions.

---

## 3. Important Rules to Keep in Mind

1. **SDK-Only API requests**: Always use the imported `sdk` instance or functions from `@lib/data/` for fetching data from the backend. Never perform raw `fetch` calls to `/store/*`.
2. **CORS Configuration**: The Medusa Backend expects `STORE_CORS` to list all client origins. If you change the web app port (defaults to `3000`), make sure to append it to `STORE_CORS` in the backend environment.
3. **Pill-shaped Buttons**: Per the web app rules (`apps/web/AGENTS.md` and `DESIGN.md`), all buttons must always be styled with `rounded-full` (pill shape). No exceptions.
