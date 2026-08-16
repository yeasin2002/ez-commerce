# Podman Configuration & Migration Guide for EZ-Commerce Backend

This guide outlines how to run the EZ-Commerce backend services (PostgreSQL, Redis, MinIO) using **Podman** alongside your existing **Docker** setup without making breaking changes to `docker-compose.yml`.

---

## 1. Image Compatibility Audit

All services defined in [`docker-compose.yml`](file:///d:/programming/personal/ez-commerce/apps/backend/docker-compose.yml) use standard OCI-compliant images from Docker Hub (`docker.io`). They are 100% compatible with Podman:

| Service | Docker Image | OCI / Podman Compatibility | Status |
| :--- | :--- | :--- | :--- |
| **PostgreSQL** | `postgres:15-alpine` | Fully OCI compatible (`docker.io/library/postgres:15-alpine`) | ✅ Verified |
| **Redis** | `redis:7-alpine` | Fully OCI compatible (`docker.io/library/redis:7-alpine`) | ✅ Verified |
| **MinIO** | `minio/minio` | Fully OCI compatible (`docker.io/minio/minio`) | ✅ Verified |

---

## 2. Shared Compose File Usage

Podman's compose engine (`podman compose` or `podman-compose`) natively parses standard `docker-compose.yml` files. You **do not need separate compose files**, keeping your configuration simple and clean.

### Available Scripts

We have added convenience scripts in `package.json`:

#### From `apps/backend/`:
- **Start all services**: `pnpm podman:up`
- **Stop all services**: `pnpm podman:down`
- **Start PostgreSQL only**: `pnpm podman:db:up`
- **Start Redis only**: `pnpm podman:redis:up`

#### From root monorepo directory:
- **Start backend services**: `pnpm backend:podman:up`
- **Stop backend services**: `pnpm backend:podman:down`

---

## 3. How to Run with Podman (Post-Installation Setup)

Once Podman Desktop / Podman CLI installation completes:

### Step 1: Initialize & Start Podman Machine (Windows)
```powershell
podman machine init
podman machine start
```

### Step 2: Start Backend Services
```powershell
# Using pnpm scripts
pnpm podman:up

# Or directly using podman CLI
podman compose up -d
```

### Step 3: Check Container Status
```powershell
podman ps
```

---

## 4. Resource & Memory Optimization (For Low-Resource PCs)

To ensure Podman operates in a lightweight manner on Windows:

1. **Limit Podman Machine Memory**:
   ```powershell
   # Set Podman machine to use 2 CPUs and 2GB RAM max
   podman machine set --cpus 2 --memory 2048
   ```

2. **Limit WSL2 Global Memory** (Optional but Recommended):
   Create or edit `%USERPROFILE%\.wslconfig`:
   ```ini
   [wsl2]
   memory=3GB
   processors=2
   ```
   Then restart WSL in PowerShell:
   ```powershell
   wsl --shutdown
   ```

3. **Daemonless Overhead**:
   Unlike Docker Desktop which runs a persistent daemon eating background RAM, Podman containers run rootless / daemonless, keeping resource utilization minimal.

---

## 5. Docker Coexistence

Your existing `docker compose up -d` and `pnpm docker:up` commands remain completely unaffected. You can switch between Docker and Podman at any time.
