# Medusa v2 Backend Architecture & Newsletter Feature Documentation

Welcome to the Medusa v2 Backend Architecture Guide and Newsletter Feature Documentation. This guide is written specifically for developers who are new to Medusa v2.

---

## Table of Contents
1. [Part 1: Core Concepts of Medusa v2 Backend](#part-1-core-concepts-of-medusa-v2-backend)
   - [1. Modules](#1-modules)
   - [2. Workflows](#2-workflows)
   - [3. Scheduled Jobs](#3-scheduled-jobs)
   - [4. API Routes (Store & Admin)](#4-api-routes-store--admin)
   - [5. Architecture Data Flow](#5-architecture-data-flow)
2. [Part 2: Deep Dive into Newsletter Implementation](#part-2-deep-dive-into-newsletter-implementation)
   - [Feature Overview](#feature-overview)
   - [Step-by-Step Breakdown of Changes](#step-by-step-breakdown-of-changes)
   - [Database Migrations](#database-migrations)
   - [How to Test the Feature](#how-to-test-the-feature)

---

# Part 1: Core Concepts of Medusa v2 Backend

Medusa v2 uses a modular, layered architecture designed to keep business logic maintainable, data persistent, and transactional operations safe.

```
┌─────────────────────────────────────────────────────────┐
│                    Storefront / Admin UI                │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP Request
                             ▼
┌─────────────────────────────────────────────────────────┐
│              API Routes (Store & Admin)                 │
│         Middleware (Validation, Authentication)         │
└────────────────────────────┬────────────────────────────┘
                             │ Run Workflow
                             ▼
┌─────────────────────────────────────────────────────────┐
│              Workflows & Steps (Transactions)            │
└────────────────────────────┬────────────────────────────┘
                             │ Resolve Module Service
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Custom / Core Medusa Modules               │
│                  Data Models & Database                 │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Modules

### What is a Module?
In Medusa v2, a **Module** is a self-contained package of business functionality that manages a specific domain of data (for example: products, carts, orders, or custom domains like reviews or newsletter subscribers).

Each module owns:
- **Data Models**: TypeScript definitions of database tables created with `model.define(...)`.
- **Module Service**: A TypeScript class extending `MedusaService(...)` that automatically generates CRUD (Create, Read, Update, Delete) database operations.
- **Module Registration**: An export using `Module("moduleName", { service })` registered in `medusa-config.ts`.

### Why do we use Modules?
Instead of mixing database queries everywhere, modules provide strict boundaries:
- **Database isolation**: Tables belong directly to their respective module.
- **Auto-generated CRUD**: Extending `MedusaService` provides methods like `listSubscribers()`, `createSubscribers()`, `retrieveSubscriber()`, `deleteSubscribers()`, and `listAndCountSubscribers()` out-of-the-box.
- **Reusability**: Modules can be injected into any workflow or API route across the backend.

### Standard Module Directory Structure
```
src/modules/<module_name>/
├── models/
│   └── <entity>.ts       # Data model (database schema definition)
├── service.ts            # Class extending MedusaService
└── index.ts              # Exports Module definition & key
```

---

## 2. Workflows

### What is a Workflow?
A **Workflow** is Medusa's transactional execution engine for operations that perform data mutations (creating, updating, or deleting records).

Workflows consist of two main parts:
1. **Steps (`createStep`)**: Individual, isolated tasks. Each step contains:
   - **Execute function**: Performs the actual operation (e.g., inserts a row in database).
   - **Compensation function**: Defines rollback logic executed automatically if any subsequent step in the workflow fails.
2. **Workflow (`createWorkflow`)**: Combines multiple steps in sequence into a single transactional process.

### Why use Workflows instead of calling Services directly in API Routes?
In e-commerce, operations often affect multiple tables or external services (e.g., reserving stock, charging a credit card, sending an email). If step 3 fails, steps 1 and 2 must be safely rolled back.

Workflows guarantee:
- **Atomicity / Consistency**: Rollback mechanism restores database state if an error occurs.
- **Traceability**: Execution progress can be logged and audited.
- **Clean API Handlers**: API route handlers only trigger workflows rather than containing complex mutation logic.

---

## 3. Scheduled Jobs

### What is a Job?
A **Scheduled Job** (or Cron Job) is a function configured to execute automatically on a time schedule (e.g., every night at midnight, or every 5 minutes).

Jobs live under `src/jobs/` and are used for:
- Periodic data syncing (e.g., updating exchange rates or inventory levels).
- Cleanup tasks (e.g., deleting abandoned draft carts older than 30 days).
- Automated reporting or batch email notifications.

Example job file:
```typescript
import { MedusaContainer } from "@medusajs/framework/types"

export default async function myCronJob(container: MedusaContainer) {
  const logger = container.resolve("logger")
  logger.info("Executing scheduled background task...")
}

export const config = {
  name: "daily-cleanup-job",
  schedule: "0 0 * * *", // Runs every midnight
}
```

---

## 4. API Routes (Store & Admin)

API Routes in Medusa v2 use a file-based routing system built on top of `src/api/`.

### Directory Structure
- `src/api/store/`: Customer-facing endpoints (Storefront).
  - Accessible under `http://localhost:9000/store/*`.
  - Requires `x-publishable-api-key` header (handled automatically by Medusa JS SDK).
- `src/api/admin/`: Merchant / Admin endpoints (Dashboard).
  - Accessible under `http://localhost:9000/admin/*`.
  - Requires admin authentication (session or bearer token).

### Middlewares & Validation
Medusa uses Zod schemas with `validateAndTransformBody` or `validateAndTransformQuery` to ensure incoming data is valid before hitting route handlers.

File routing convention:
```
src/api/
├── middlewares.ts              # Global/Feature middleware registration
├── store/
│   └── newsletter/
│       ├── middlewares.ts      # Zod validation schema
│       └── route.ts            # POST /store/newsletter handler
└── admin/
    └── newsletter/
        ├── route.ts            # GET /admin/newsletter handler
        └── [id]/
            └── route.ts        # DELETE /admin/newsletter/:id handler
```

---

## 5. Architecture Data Flow

Here is how data flows through Medusa v2 when a user submits an action:

```
[ Storefront Form ]
       │
       │ HTTP POST /store/newsletter
       ▼
[ Store API Middleware ] ---> (Validates request body with Zod schema)
       │
       │ Validated Payload
       ▼
[ API Route Handler (route.ts) ]
       │
       │ Runs createSubscriberWorkflow(req.scope)
       ▼
[ Workflow Step (createSubscriberStep) ]
       │
       │ Resolves "newsletter" Module Service from container
       ▼
[ NewsletterModuleService ] ---> (Executes SQL query via MedusaService)
       │
       ▼
[ PostgreSQL Database Table: newsletter_subscriber ]
```

---

# Part 2: Deep Dive into Newsletter Implementation

## Feature Overview
We implemented a complete end-to-end Newsletter subscription feature with:
1. A **Storefront form** on the homepage allowing visitors to subscribe their email.
2. A **Backend Custom Module & Workflow** storing subscriber emails in PostgreSQL with automatic `created_at` timestamping.
3. **Admin API Routes** and an interactive **Admin Dashboard Table** where store operators can view, search, sort, and delete subscriber records.

---

## Step-by-Step Breakdown of Changes

### 1. Newsletter Custom Module
- **`apps/backend/src/modules/newsletter/models/subscriber.ts`**:
  Defined the `newsletter_subscriber` data model containing `id` and `email`. Medusa automatically provides `created_at`, `updated_at`, and `deleted_at`.
- **`apps/backend/src/modules/newsletter/service.ts`**:
  Created `NewsletterModuleService` extending `MedusaService({ Subscriber })`. This auto-generates database helper methods (`listAndCountSubscribers`, `createSubscribers`, `deleteSubscribers`).
- **`apps/backend/src/modules/newsletter/index.ts`**:
  Exported `NEWSLETTER_MODULE = "newsletter"` and declared the Medusa Module definition.
- **`apps/backend/medusa-config.ts`**:
  Registered `newsletter` under `modules` configuration so Medusa loads the module on server boot.

### 2. Workflows
- **`apps/backend/src/workflows/create-subscriber.ts`**:
  Checks if the email is already registered. If not, inserts it into database. Includes a compensation step to roll back database changes if downstream tasks fail.
- **`apps/backend/src/workflows/delete-subscriber.ts`**:
  Deletes a subscriber by ID with compensation rollback logic to re-create the subscriber record if transaction aborts.

### 3. API Endpoints
- **Store Route (`POST /store/newsletter`)**:
  - `src/api/store/newsletter/middlewares.ts`: Validates that `{ email }` is a valid email format.
  - `src/api/store/newsletter/route.ts`: Executes `createSubscriberWorkflow`.
- **Admin Routes (`GET /admin/newsletter` & `DELETE /admin/newsletter/:id`)**:
  - `src/api/admin/newsletter/route.ts`: Accepts `q` for search query, `limit`, `offset`, and `order` ("asc" / "desc"). Returns subscriber array and total count.
  - `src/api/admin/newsletter/[id]/route.ts`: Accepts `id` in params and executes `deleteSubscriberWorkflow`.

### 4. Admin Dashboard UI
- **`apps/backend/src/admin/lib/client.ts`**:
  Created `fetchAdmin` wrapper with `credentials: "include"` for making authenticated requests to `/admin/*` routes.
- **`apps/backend/src/admin/routes/newslatter/page.tsx`**:
  Built a clean Admin dashboard view using `@medusajs/ui` and `@tanstack/react-query` containing:
  - Header with total subscriber counter badge.
  - Search input filtering by email string.
  - Sort selector (Newest first / Oldest first).
  - Responsive Table displaying **Email Address**, **Joining Date**, and **Delete Action** button.

### 5. Storefront Integration
- **`apps/storefront/src/feature/home/Newsletter.tsx`**:
  - Bound input state to `submitHandler`.
  - Sent payload to `POST /store/newsletter` using `sdk.client.fetch`.
  - Added loading indicator on pill button and success message state.

---

## Database Migrations

When creating a new custom module, Medusa needs to create the corresponding database table in PostgreSQL.

We ran two commands:
1. `pnpm medusa db:generate newsletter`
   - Scanned `models/subscriber.ts` and generated migration file `Migration20260723032639.ts`.
2. `pnpm medusa db:migrate`
   - Executed SQL DDL to create table `newsletter_subscriber` in PostgreSQL.

---

## How to Test the Feature

### 1. Test Subscription from Storefront
1. Open Storefront in browser (`http://localhost:8000/us` or current storefront port).
2. Scroll to the **"First to know. First to wear."** Newsletter section at the bottom.
3. Enter `user@example.com` and click **Subscribe**.
4. You will see the success message: *"Thank you for subscribing! You are now on the VIP list."*

### 2. Manage Subscribers in Admin Dashboard
1. Open Medusa Admin (`http://localhost:9000/app`).
2. Log in with admin credentials.
3. Click **News Letter** in the left navigation sidebar.
4. You will see `user@example.com` displayed in the table along with their exact **Joining Date**.
5. Test searching with the search input box or changing the sort order.
6. Click the trash icon on a subscriber row to delete the subscriber record.
