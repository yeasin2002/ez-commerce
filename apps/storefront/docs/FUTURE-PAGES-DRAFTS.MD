# Future Storefront Features & Pages Roadmap

This document maps out the current status of the pages in `apps/storefront` and details the remaining pages and features needed to build a complete, direct-to-consumer (DTC) e-commerce storefront. It incorporates patterns, routes, and business logic from the reference `storefront-template` project, while adhering to the brand's bold, near-monochrome design rules.

---

## 1. Page Audit & Status Tracker

Here is the exact mapping of routes currently implemented in the storefront versus those that need to be created before moving to the backend integrations.

### 🟢 Existing & Implemented Routes
These pages are already created in `apps/storefront/src/app` and contain layouts or mockups.

| Page / Route | Next.js File Path | Description / Status |
| :--- | :--- | :--- |
| **Homepage** (`/`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/page.tsx) | Hero banners, best sellers, new arrivals, FAQ, and footer. |
| **Shop (PLP)** (`/shop`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/shop/page.tsx) | Product grid with sidebar filters (price, collection, size). |
| **Product Detail (PDP)** (`/shop/[id]`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/shop/[id]/page.tsx) | Single product view with details, variant selection, and gallery. |
| **Wishlist** (`/wishlist`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/wishlist/page.tsx) | Grid of saved products, empty states, and quick add-to-cart. |
| **Contact** (`/contact`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/contact/page.tsx) | Customer service inquiry form. |
| **Cart** (`/cart`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(main)/cart/page.tsx) | Detailed shopping cart listing with dynamic selectors and flat styling. |
| **Checkout** (`/checkout`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(checkout)/checkout/page.tsx) | Multi-step shipping and address details form validated using Zod. |
| **Account Overview** (`/account`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(main)/account/page.tsx) | Stats overview of items, recent order lists, and shortcut links. |
| **Account Profile** (`/account/profile`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(main)/account/profile/page.tsx) | Form to edit personal info and manage photo uploads using Attachment. |
| **Account Addresses** (`/account/addresses`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(main)/account/addresses/page.tsx) | Grid layout of billing and shipping tags with editable inputs. |
| **Account Orders** (`/account/orders`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(main)/account/orders/page.tsx) | Tabular past orders table list with view button triggers. |
| **Order Details** (`/account/orders/details/[id]`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(main)/account/orders/details/[id]/page.tsx) | Vertical processing steps timeline grid, cost breakdown, and invoice summaries. |
| **Account Security** (`/account/security`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(main)/account/security/page.tsx) | Form to update user password, toggles to toggle 2FA, and device sessions card. |
| **Account Notifications** (`/account/notifications`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(main)/account/notifications/page.tsx) | Interactive read/unread filter logs and individual actions triggers. |
| **Login** (`/login`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(auth)/login/page.tsx) | Customer sign-in page. |
| **Register** (`/register`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(auth)/register/page.tsx) | Account creation form. |
| **Forgot Password** (`/forgot-password`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(auth)/forgot-password/page.tsx) | Password recovery email form. |
| **OTP Verification** (`/otp`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(auth)/otp/page.tsx) | One-Time Password verification boilerplate. |
| **Verify Email** (`/verify-email`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(auth)/verify-email/page.tsx) | Email confirmation link landing page boilerplate. |
| **Verify Phone** (`/verify-phone`) | [page.tsx](file:///c:/yeasin2002/experiments/ez-commerce/apps/storefront/src/app/[countryCode]/(auth)/verify-phone/page.tsx) | Phone confirmation landing page boilerplate. |

### 🔴 Missing Routes (To Be Created)
These pages exist in the `storefront-template` reference project and must be built in `apps/storefront` to complete the customer journey.

| Target Route URL | Proposed Next.js File Path | Purpose (Aligned with Medusa V2 & Template) |
| :--- | :--- | :--- |
| `/order/[id]/confirmed` | `src/app/[countryCode]/order/[id]/confirmed/page.tsx` | Thank-you page shown post-checkout. Displays summary of ordered products, invoice details, and tracking instructions. |
| `/order/[id]/transfer/[token]` | `src/app/[countryCode]/order/[id]/transfer/[token]/page.tsx` | Page to claim or transfer guest orders to registered customer accounts. |
| `/order/[id]/transfer/[token]/accept` | `src/app/[countryCode]/order/[id]/transfer/[token]/accept/page.tsx` | Action landing page to accept guest order transfer. |
| `/order/[id]/transfer/[token]/decline` | `src/app/[countryCode]/order/[id]/transfer/[token]/decline/page.tsx` | Action landing page to decline guest order transfer. |
| `/verify-account` | `src/app/[countryCode]/verify-account/page.tsx` | General account validation / confirmation action handler page. |
| `/categories/[...category]` | `src/app/[countryCode]/categories/[...category]/page.tsx` | Filtered product lists dynamically matching Medusa category hierarchy (e.g. `/categories/sportswear/jerseys`). |
| `/collections/[handle]` | `src/app/[countryCode]/collections/[handle]/page.tsx` | Filtered product lists matching marketing/editorial collections (e.g. `/collections/summer-sale`). |

---

## 2. Next.js Routing Structure Strategy

We have two options for structuring our missing pages inside `src/app/[countryCode]`:

### Option A: Standard Direct Directories (Simpler)
We create pages directly under their path names.
* **Pros**: Simple file structure; matches the current flat layout (`/shop`, `/contact`, `/wishlist`); doesn't require relocating files.
* **Cons**: Sharing layouts across specific pages (like keeping headers and footers on `/shop` but hiding them on `/checkout`) requires manually importing or omitting them inside the page files, or writing route check logic.

### Option B: Route Groups `(main)` and `(checkout)` (Recommended & Aligns with Template)
We organize the routes using Next.js layout groups to inherit page layouts automatically:
* `(main)` group layout renders global header and footer:
  - Homepage, Shop, Product Details, Cart, Wishlist, Contact, Categories, Collections, Account.
* `(checkout)` group layout hides main navigation and renders a simplified, secure checkout header/footer:
  - Checkout page.
* **Pros**: Clean code structure; matches the robust configuration in `storefront-template`; zero duplicate imports of `<Header />` and `<Footer />` across pages.
* **Cons**: Requires moving the existing `page.tsx`, `shop`, `wishlist`, and `contact` folders into a new `(main)` subdirectory.

> [!TIP]
> **Recommendation**: We should implement **Option B** before adding more pages. Moving existing pages into `(main)` is a 2-minute folder reorganization that ensures structural robustness, matching the template structure.

---

## 3. Specifications for Missing Pages (Phase 1 Checklist)

Here are the functional and aesthetic specifications for the core shopping flow pages we need to create first:

### 🛒 1. Cart Page
* **Route**: `/cart`
* **File**: `src/app/[countryCode]/cart/page.tsx`
* **Features**:
  * Dual-column layout on desktop: Left column shows item list; right column shows cart order summary and CTA.
  * Line items display: product image, name, selected options (size/color), unit price (original/discounted), quantity selectors (`+` / `-`), and an easy remove button (`X`).
  * Empty Cart State: Large icon, helper text, and a prominent black pill button redirecting to `/shop`.
  * Promo Code / Discount Input: Input bar for coupon codes.
* **Brand Design**:
  * Pill-shaped Checkout button: `className="w-full rounded-full bg-ink text-canvas hover:bg-charcoal py-3 font-semibold uppercase tracking-wider"`
  * Discount prices shown in red-orange (`text-sale`), with original prices struck through.

### 💳 2. Checkout Page
* **Route**: `/checkout`
* **File**: `src/app/[countryCode]/(checkout)/page.tsx`
* **Features**:
  * Split screen layout: Left side contains a clean accordion form (Shipping Address -> Delivery Method -> Payment Method -> Review); right side contains a sticky order summary showing items and subtotal.
  * Payment integrations: Toggle between **Cash on Delivery** and online card payments (using the Stripe element wrapper).
* **Brand Design**:
  * Clean, distraction-free header: only the storefront name and a simple `<- Back to cart` link.
  * All inputs styled with clean borders (`border-hairline-soft`) and pill-shaped interactive components where applicable.

### 🎉 3. Order Confirmed Page
* **Route**: `/order/[id]/confirmed`
* **File**: `src/app/[countryCode]/order/[id]/confirmed/page.tsx`
* **Features**:
  * A bold, minimal celebration layout confirming the purchase.
  * Displays the order code (e.g., `#10023`), summary of items, billing/shipping address, shipping method, and a payment receipt details grid.
  * Call to action button to continue shopping or log in to track.

### 👤 4. Customer Account Dashboard Pages
These pages will group together to give the shopper control over their profile and order history.

* **Account Home / Overview** (`/account`):
  * Displays customer welcome message.
  * Displays quick stats cards (Recent Orders, Saved Addresses, Profile Info).
* **Order History** (`/account/orders`):
  * A clean list of past orders with clear status tags (e.g., `Processing`, `Shipped`, `Delivered`, `Refunded`).
* **Order Details** (`/account/orders/details/[id]`):
  * Deep dive into order details, showing the timeline of updates, line items, and tracking numbers.
* **Address Book** (`/account/addresses`):
  * Visual cards showing saved addresses, default billing, and shipping tags.
  * Simple overlays/modals to edit or create new addresses.
* **Profile Settings & Security** (`/account/profile` and `/account/security`):
  * Clean edit fields for contact details and password change forms.

---

## 4. Visual Identity & Brand Styling Constraints

Every new component must follow these strict brand rules specified in `AGENTS.md`:

1. **Button Pill Shape**: All primary, secondary, and tertiary buttons must use the `Button` component or have explicit `rounded-full` (or `border-radius: 9999px`) styles.
2. **Bold Near-Monochrome Palette**:
   * Canvas/Background: `--canvas` (pure white) or `--cloud` (light grey).
   * Ink/Text: `--ink` (high-contrast black).
   * Hairlines: `--hairline-soft` for borders and thin grid separators.
3. **Accent Signal Color**:
   * Discounted/sale prices, discount banners, and promotional alerts must use `--sale` (red-orange accent: `oklch(0.58 0.22 27)`). Original prices must have a line-through.
4. **Typography Hierarchy**:
   * Display headings: `font-display` (`Bebas Neue` font) in uppercase.
   * Body text: `font-sans` (`Instrument Sans` font) with generous line heights.

---

## 5. Next Steps Roadmap

Before building backend features, we will create mockups and routing structures for the frontend page targets:

1. **~~Reorganize Layout Groups~~** (Completed): Moved existing routes under `(main)` and created `(checkout)` layout files.
2. **~~Build Cart & Checkout Layout Pages~~** (Completed): Added static/mock page components for `/cart` and `/checkout`.
3. **~~Build the Customer Account Pages~~** (Completed): Scaffolded the `/account` layouts and children views.
4. **Build Order Confirmation & Dynamic Shop Pages**: Add templates for `/order/[id]/confirmed` and Category/Collection templates.
5. **Connect Mock State**: Connect cart operations to a local storage mock or dummy state before replacing with actual Medusa SDK backend actions.
