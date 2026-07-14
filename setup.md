# Walkthrough - Local Environment Setup and Verification

I have completed the local environment setup by starting the PostgreSQL database container, running database migrations, creating an admin user, configuring the backend and storefront environment variables, and starting the local servers.

## Work Accomplished

1. **Started PostgreSQL Container**:
   - Pulled the `postgres` official Docker image.
   - Launched the container named `medusa-postgres` with database `medusa-backend`, trusting local connections (no password requirement for local dev).
   - Container IP address: `172.17.0.2`
   - Port Mapping: `5432:5432` on localhost.

2. **Configured Backend**:
   - Created the [backend .env file](file:///d:/programming/personal/ez-commerce/apps/backend/.env) from the template.
   - Set the `DATABASE_URL` to `postgres://postgres@127.0.0.1:5432/medusa-backend`.

3. **Database Migration & Seeding**:
   - Ran `pnpm medusa db:migrate` which executed the database migrations and seeded the database with initial products, regions, and shipping profiles.

4. **Created Admin User**:
   - Created a new admin user with credentials:
     - **Email**: `admin@test.com`
     - **Password**: `supersecret`

5. **Configured Storefront**:
   - Queried the database to retrieve the seeded publishable API key: `pk_1c61eae02e644124cef154025375f8427f553e49b7b027d478e40bdb46c87816`.
   - Created the [storefront .env.local file](file:///d:/programming/personal/ez-commerce/apps/storefront/.env.local) with the retrieved publishable key and backend URL `http://localhost:9000`.

6. **Started Servers**:
   - Executed `pnpm dev` which successfully brought up all three services:
     - **Next.js Web App**: `http://localhost:3000`
     - **Next.js Storefront App**: `http://localhost:8000`
     - **Medusa Backend Server**: `http://localhost:9000` (Admin panel at `http://localhost:9000/app`)

---

## Verification Results

All three local servers are successfully running in the background. Here are the logs confirming their active states:

- **Next.js Web App**:
  ```
  apps/web dev: ▲ Next.js 16.2.10 (Turbopack)
  apps/web dev: - Local:         http://localhost:3000
  apps/web dev: ✓ Ready in 491ms
  ```

- **Next.js Storefront**:
  ```
  apps/storefront dev:    - Local:        http://localhost:8000
  apps/storefront dev:    - Environments: .env.local
  apps/storefront dev:  ✓ Ready in 6.7s
  ```

- **Medusa Backend**:
  ```
  apps/backend dev: ✔ Server is ready on port: 9000 – 11921ms
  apps/backend dev: info:    Admin URL → http://localhost:9000/app
  ```
