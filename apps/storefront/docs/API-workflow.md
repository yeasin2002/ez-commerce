# API Layer — Implementation Guide (Medusa SDK + TanStack Query)

> A project-specific guide for building a consistent, type-safe API layer using
> **TanStack Query (React Query)** + **Medusa JS SDK** + **TypeScript**.
> Follow this guide to guarantee the same folder structure, naming conventions, and patterns across the storefront.

---

## Core Philosophy

The client-side API layer is split into **two strict layers**. Neither layer bleeds into the other, and neither layer directly couples with UI, routing, or complex business logic.

| Layer | Folder | Purpose |
|---|---|---|
| **API / SDK Wrappers** | `src/lib/api/` | Pure API definitions wrapping the Medusa JS SDK (built-in endpoints & custom route fetches) |
| **API Hooks** | `src/lib/hooks/api/` | TanStack Query hooks (`useQuery` and `useMutation`) that wrap and expose Layer 1 |

---

## Folder Structure

```
src/
└── lib/
    ├── api/                 # Layer 1: SDK & Custom API Wrappers
    │   ├── <module>.ts
    │   └── admin/           # Admin-scoped API wrappers
    │       └── <module>.ts
    │
    └── hooks/
        └── api/             # Layer 2: React Query Hooks
            ├── use-<module>.ts
            └── admin/       # Admin-scoped React Query hooks
                └── use-<module>.ts
```

### File Naming Rules

| Scope | API Wrapper File | Hook File |
|---|---|---|
| Storefront (Public) | `src/lib/api/<module>.ts` | `src/lib/hooks/api/use-<module>.ts` |
| Admin (Dashboard) | `src/lib/api/admin/<module>.ts` | `src/lib/hooks/api/admin/use-<module>.ts` |

---

## Layer 1 — API / SDK Wrappers

### Rules

- Only import `sdk` from `@lib/config` and types from `@medusajs/types` or `@medusajs/js-sdk`. **No React. No hooks.**
- Define any custom TypeScript interfaces in this file and export them.
- Export a single API object (named `<module>Api`) with one method per endpoint.
- **Built-in Endpoints**: Always use the built-in, type-safe SDK methods (e.g., `sdk.store.product.list(...)`, `sdk.store.cart.retrieve(...)`).
- **Custom Endpoints**: Use `sdk.client.fetch(url, options)` for custom routes.
- **⚠️ CRITICAL (SDK-No-JSON-Stringify)**: The Medusa SDK client automatically serializes objects. **NEVER use `JSON.stringify()` on the body.** Pass plain JavaScript objects directly.
- **Headers & Authentication**: The SDK automatically handles authorization (e.g., publishable keys, session cookies) and headers. Do not manually set headers like `Content-Type` unless passing custom overrides.

### Interface Naming Convention

| Interface / Type | Purpose |
|---|---|
| `<Entity>` | Core data model (typically imported from `@medusajs/types/http`) |
| `<Entity>Response` | API response payload wrapper (e.g. `{ review: ProductReview }`) |
| `<Entity>ListResponse` | API list response payload wrapper (e.g. `{ reviews: ProductReview[], count: number }`) |
| `Create<Entity>Data` | POST request payload |
| `Update<Entity>Data` | PATCH / PUT request payload |
| `<Entity>QueryParams` | Optional query parameters / filters |

### Example

```typescript
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

// Custom types for custom endpoints (not built-in to Medusa core)
export interface ProductReview {
  id: string
  product_id: string
  rating: number
  comment: string
  customer_name: string
  created_at: string
}

export interface ProductReviewResponse {
  review: ProductReview
}

export interface ProductReviewListResponse {
  reviews: ProductReview[]
  count: number
}

export interface CreateReviewData {
  product_id: string
  rating: number
  comment: string
  customer_name: string
}

export const reviewApi = {
  // Built-in endpoint wrapping: uses existing SDK method
  listProducts: (queryParams?: HttpTypes.StoreProductListParams) =>
    sdk.store.product.list(queryParams),

  // Custom GET endpoint: uses sdk.client.fetch
  getProductReviews: (productId: string) =>
    sdk.client.fetch<ProductReviewListResponse>(
      `/store/products/${productId}/reviews`
    ),

  // Custom POST endpoint: uses sdk.client.fetch with plain object body
  // ✅ CORRECT: No JSON.stringify around the body payload
  createReview: (data: CreateReviewData) =>
    sdk.client.fetch<ProductReviewResponse>(`/store/products/reviews`, {
      method: "POST",
      body: data,
    }),
}
```

---

## Layer 2 — API Hooks

### Rules

- Only import from `@tanstack/react-query`, UI/toast notification utilities, and Layer 1 API files.
- **Never** import from `src/app`, `src/components`, or any UI view layers.
- Define a `*_KEYS` constant at the **top** of every hook file — never inline.
- Use `useQuery` for GET requests (reads), `useMutation` for POST / PATCH / PUT / DELETE (writes).
- **⚠️ SDK Note**: Unlike Axios, the Medusa JS SDK returns the parsed JSON response body directly. **You do NOT need `select: (response) => response.data`** to unwrap the payload.
- Always show a toast or message feedback on success and on error for mutations.
- Always invalidate the relevant cache keys after a successful mutation to trigger refetching.

### Query Key Shape

```typescript
const REVIEW_KEYS = {
  all:    ()                  => ["reviews"] as const,
  lists:  ()                  => ["reviews", "list"] as const,
  list:   (productId: string)   => ["reviews", "list", productId] as const,
  detail: (id: string)          => ["reviews", "detail", id] as const,
}
```

> **Admin keys** must be prefixed with `'admin'` to avoid cache collisions:
> `['admin', 'reviews']`

### useQuery — Reads (GET)

```typescript
import { useQuery } from "@tanstack/react-query"
import { reviewApi } from "@lib/api/reviews"

// Fetching a list of items
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: REVIEW_KEYS.list(productId),
    queryFn: () => reviewApi.getProductReviews(productId),
    enabled: !!productId, // Only fetch when productId is provided
  })
}
```

### useMutation — Writes (POST / PATCH / DELETE)

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { reviewApi, CreateReviewData } from "@lib/api/reviews"

// Example Toast function import (adjust according to storefront framework)
// import { toast } from "@/hooks/use-toast"

export const useCreateReview = (productId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReviewData) => reviewApi.createReview(data),
    onSuccess: () => {
      // Invalidate specific product reviews cache key
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.list(productId) })
      
      // Provide user feedback
      // toast({ title: "Success", description: "Review submitted successfully!" })
    },
    onError: (error: Error) => {
      // Provide error feedback
      // toast({
      //   title: "Error",
      //   description: error.message || "Failed to submit review.",
      //   variant: "destructive"
      // })
    },
  })
}
```

> **Pill-shaped Buttons Rule**: In the UI component consuming these hooks, always use the custom `Button` primitive (`import { Button } from "@/components/ui/button"`) which has the required `rounded-full` styling, and disable it during mutations using `disabled={mutation.isPending}`.

---

## Implementation Workflow

When adding client-side API integrations, always follow these steps **in order**:

### 1. Create/Modify the API Wrapper (Layer 1)

- Place the wrapper in `src/lib/api/<module>.ts`.
- Declare/import all TypeScript models and payloads.
- Wrap native Medusa SDK calls or use `sdk.client.fetch` for custom endpoints.
- No React hooks, UI code, or raw `fetch()` calls.

### 2. Create the API Hook File (Layer 2)

- Place the hooks in `src/lib/hooks/api/use-<module>.ts`.
- Declare hierarchical `*_KEYS` at the top of the file.
- Write custom `useQuery` hooks for fetching data.
- Write custom `useMutation` hooks for write operations, including toast feedback and cache invalidation.

### 3. Connect to the UI Components

- Import the custom query and mutation hooks in your client components.
- Standardize on using `Button` with loading states (e.g. `isPending`).

---

## Boundaries — What Belongs Here vs. Not

| Belongs in `src/lib/api/` & `src/lib/hooks/api/` | Does NOT belong here |
|---|---|
| TypeScript interfaces for API payloads | UI components or Tailwind layouts |
| Medusa SDK client methods (`sdk.store.*`) | Navigation or router redirects (`useRouter()`) |
| Custom endpoints (`sdk.client.fetch`) | Form validation schemas (`zod`) |
| Hierarchical Query keys | Global UI state management |
| Toast feedback and cache invalidations | Business rules / calculation utilities |

---

## Quick Reference

| Need | Solution |
|---|---|
| Fetch a list | `useQuery` + `list(id)` or `lists()` key |
| Fetch one item (optional id) | `useQuery` + `enabled: !!id` |
| Fetch with query params / filters | Include params/filters object in the `queryKey` |
| Create | `useMutation` + invalidate relevant lists |
| Update | `useMutation` + invalidate specific list and `detail(id)` keys |
| Delete | `useMutation` + invalidate relevant lists |
| Wrap body parameters | Pass plain object directly (no `JSON.stringify()`) |
| Extract response body | No Axios `select` mapping needed; SDK returns body directly |
| Get error message | Access `error.message` directly in `onError` |
