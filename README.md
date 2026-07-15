# EZ Commerce — DTC E-Commerce Platform Starter

EZ Commerce is a production-ready, direct-to-consumer (DTC) e-commerce platform built as a monorepo. It features a Next.js storefront client and a Medusa v2 headless commerce backend. It is designed to initially sell sportswear (football jerseys, training kit, accessories) but is architected to scale into other product categories without redesigning the core codebase.

---

## 🎨 Brand & Design Philosophy

EZ Commerce follows a strict editorial identity:
- **Visual Identity**: Bold, high-contrast near-monochromatic style (black ink on white canvas).
- **Core Accent**: Bright orange-red (`--sale`) reserved exclusively for discounted prices, sale badges, and promotions.
- **Button Styling**: Every button is pill-shaped (`rounded-full` / `border-radius: 9999px`) — this is a non-negotiable brand rule.
- **Typography**: Editorial titles with Bebas Neue (`--font-display`) and clean body text with Instrument Sans (`--font-sans`).

---

## ⚡ Tech Stack

| Layer | Technologies |
|---|---|
| **Monorepo** | Turborepo v2, pnpm v11 Workspaces |
| **Storefront App** | Next.js 16 (App Router), React 19 (React Compiler enabled), Tailwind CSS v4, Lucide & Tabler Icons, Radix UI |
| **Headless Backend** | Medusa v2 (2.17.x), Medusa Dashboard, Medusa Admin SDK |
| **Database** | PostgreSQL v15+ |
| **Integrations** | Stripe Payments, Cash on Delivery (COD) |

---

## 📦 Project Structure

```text
ez-commerce/
├── apps/
│   ├── backend/             # Medusa v2 Commerce Server & Admin Panel
│   │   ├── src/
│   │   │   ├── admin/       # Dashboard UI widgets & custom pages
│   │   │   ├── api/         # File-based custom routes (/admin and /store)
│   │   │   ├── modules/     # Custom business modules (Models, Service, Migrations)
│   │   │   └── workflows/   # Custom multi-step Medusa workflows
│   │   └── medusa-config.ts # Core backend server configuration
│   │
│   ├── storefront/          # Next.js Customer Storefront
│   │   ├── src/
│   │   │   ├── app/         # Dynamic [countryCode] regional routing
│   │   │   ├── components/  # ui/ (shadcn primitives) & shared/ UI components
│   │   │   ├── feature/     # Page-specific feature layouts (home, shop)
│   │   │   └── lib/
│   │   │       ├── data/    # Server Actions containing Medusa SDK calls
│   │   │       └── config.ts# Medusa SDK client instance
│   │   └── package.json
│   └── storefront-template/ # Reference template (Read-only)
├── turbo.json               # Turborepo task pipeline configuration
├── pnpm-workspace.yaml      # Monorepo workspaces definition
└── package.json             # Root monorepo scripts & dependencies
```

---

## ✨ Features

### Customer Experience
- **Regional Routing**: Automatic country code prefix routing (e.g., `/us/shop`, `/bn/shop`) backed by custom middleware region detection.
- **Product Discovery**: Clean homepage layout featuring hero banners, grid carousels, category collections, global search, filtering, and sorting.
- **Shopping Cart**: Fully functional cart management with support for promo/coupon discount codes.
- **Multi-Step Checkout**: Guest or registered user checkout flows, integrating Cash on Delivery and Stripe Payments.
- **Customer Accounts**: Secure customer authentication, order history, package tracking, addresses, and wishlists.

### Merchant & Admin Panel
- **Medusa v2 Admin Dashboard**: Built-in visual interface for processing orders, adding/editing products, customizing regions, and tracking customers.
- **Custom Admin Widgets**: Extensible UI components for customizing and monitoring business logic.

---

## 🚀 Getting Started & Setup

### Prerequisites
Make sure you have the following installed locally:
- **Node.js** >= 20
- **pnpm** >= 11
- **PostgreSQL** >= 15 (Make sure a PostgreSQL database instance is running)

---

### Step-by-Step Setup

#### 1. Clone the repository and install dependencies
```bash
git clone <repository-url> ez-commerce
cd ez-commerce
pnpm install
```

#### 2. Configure the Backend Environment
Create the `.env` configuration file for the backend server:
```bash
cp apps/backend/.env.template apps/backend/.env
```

Configure `apps/backend/.env` with your PostgreSQL database URL and session secrets:
```env
DATABASE_URL=postgres://postgres@127.0.0.1:5432/medusa-backend
STORE_CORS=http://localhost:3000,http://localhost:3002
ADMIN_CORS=http://localhost:9000,http://localhost:7001
AUTH_CORS=http://localhost:9000,http://localhost:7001
JWT_SECRET=supersecretjwtsecret
COOKIE_SECRET=supersecretcookiesecret
```

#### 3. Run Backend Migrations & Seed Data
Generate and run migrations to create the commerce tables, and run the seeding script:
```bash
# Navigate to the backend directory
cd apps/backend

# Apply core migrations
pnpm medusa db:migrate

# Seed initial store data (products, regions, currencies)
npx medusa exec src/migration-scripts/initial-data-seed.ts
```

#### 4. Create an Admin User
Create your administrator account to access the dashboard:
```bash
pnpm medusa user -e admin@test.com -p supersecret
```

#### 5. Start the Backend Server
Start the headless Medusa dev server:
```bash
pnpm dev
```
The server will boot on `http://localhost:9000`. You can access the Admin Dashboard at `http://localhost:9000/app` using your admin credentials.

---

#### 6. Configure the Storefront Client
Navigate to Settings > Publishable API Keys in the Admin Dashboard, copy the API key, and configure the storefront environment:

Create the storefront client environment variables:
```bash
# From the monorepo root directory
cp apps/storefront/.env.template apps/storefront/.env.local
```

Edit `apps/storefront/.env.local` to inject the publishable key and the backend URL:
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key_here
NEXT_PUBLIC_DEFAULT_REGION=us
```

---

#### 7. Run the Entire Project
You can spin up both the Next.js Storefront and the Medusa Backend concurrently using the Turborepo root command:
```bash
# From the monorepo root directory
pnpm dev
```

- **Next.js Storefront**: Running at `http://localhost:3002`
- **Medusa Backend Server**: Running at `http://localhost:9000` (Admin panel at `/app`)

---

## 🛠️ Main Development Commands

Run these scripts from the monorepo root:

| Command | Action |
|---|---|
| `pnpm dev` | Starts all applications (storefront and backend) concurrently |
| `pnpm build` | Builds all packages and apps for production |
| `pnpm lint` | Runs ESLint analysis across the workspace |
| `pnpm test` | Runs the workspace test suites via Jest |
| `pnpm backend:dev` | Runs only the Medusa backend server |
| `pnpm storefront:dev` | Runs only the Next.js storefront client |
| `pnpm backend:seed` | Re-seeds initial dataset into backend |
