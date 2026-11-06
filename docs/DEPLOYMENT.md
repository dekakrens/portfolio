# Production Deployment & DevOps Guide

This guide details the steps required to deploy, host, and maintain the **Deka Krens Developer Platform** in production.

---

## 1. Hosting Architecture Overview

The system is configured for containerized self-hosting on Linux (ARM64 Raspberry Pi 5 / x86_64 VPS) with secure edge ingress provided by **Cloudflare Zero Trust Tunnels**:

```mermaid
flowchart LR
    Cloudflare["Cloudflare Edge (HTTPS)"]
    Tunnel["cloudflared Daemon (Host)"]
    WebContainer["portfolio_web (:8230 -> :3000)"]
    APIContainer["portfolio_api (:8231 -> :4000)"]
    DBContainer["portfolio_postgres (:5432)"]

    Cloudflare -->|Encrypted Tunnel| Tunnel
    Tunnel -->|dekakrens.com| WebContainer
    Tunnel -->|api.dekakrens.com| APIContainer
    Tunnel -->|wiki.dekakrens.com (301)| WebContainer
    WebContainer -->|Internal Bridge Network| APIContainer
    APIContainer -->|Internal Bridge Network| DBContainer
```

### Production Port Allocations

| Container | Internal Port | Host Port | Ingress Domain | Description |
| :--- | :--- | :--- | :--- | :--- |
| `portfolio_web` | `3000` | `8230` | `dekakrens.com` | Next.js 15 App Router Frontend |
| `portfolio_api` | `4000` | `8231` | `api.dekakrens.com` | NestJS 12 REST API & CMS Backend |
| `portfolio_postgres` | `5432` | *(None - isolated)* | N/A | PostgreSQL 16 Alpine Data Store |

---

## 2. Environment Configuration

Create or verify the production environment file (`.env` or passed via `docker-compose.prod.yml`):

### API Environment (`apps/api/.env` / `docker-compose.prod.yml`)

```bash
# Server & Database
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@portfolio_postgres:5432/portfolio_db
FRONTEND_URL=https://dekakrens.com

# Admin Authentication
ADMIN_EMAIL=dekakrens@gmail.com
ADMIN_PASSWORD=your_secure_password_here
ADMIN_NAME="Deny Kurniawan"
JWT_SECRET=your_cryptographic_random_salt_here

# ISR Cache Invalidation
REVALIDATION_SECRET=your_secure_revalidation_secret_here

# Email Notifications (Resend)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL="Deny Kurniawan <onboarding@resend.dev>"
RESEND_TO_EMAIL=dekakrens@gmail.com
```

### Frontend Environment (`apps/web/.env` / `docker-compose.prod.yml`)

```bash
PORT=3000
INTERNAL_API_URL=http://portfolio_api:4000/api/v1
NEXT_PUBLIC_API_URL=https://api.dekakrens.com/api/v1
REVALIDATION_SECRET=your_secure_revalidation_secret_here
```

---

## 3. Docker Compose Production Deployment

The project contains a production-ready compose configuration in [`docker-compose.prod.yml`](file:///Volumes/Lexar/portfolio/docker-compose.prod.yml).

### Starting the Production Stack

```bash
# Build and launch all services in the background
docker compose -f docker-compose.prod.yml up -d --build
```

### Checking Container Health

```bash
docker compose -f docker-compose.prod.yml ps
```

Expected output:
```text
NAME                 STATUS                   PORTS
portfolio_postgres   Up (healthy)             5432/tcp
portfolio_api        Up                       0.0.0.0:8231->4000/tcp
portfolio_web        Up                       0.0.0.0:8230->3000/tcp
```

### Inspecting Live Logs

```bash
# Follow logs for the Next.js frontend
docker logs -f portfolio_web

# Follow logs for the NestJS API
docker logs -f portfolio_api

# Follow logs for PostgreSQL
docker logs -f portfolio_postgres
```

---

## 4. Cloudflare Zero Trust Tunnel Configuration

To expose the services safely without forwarding ports or exposing your IP address to the public internet:

1. Install `cloudflared` on your server:
   ```bash
   sudo apt-get install cloudflared
   ```
2. Authenticate and configure your tunnel ingress rules in `/etc/cloudflared/config.yml`:

```yaml
tunnel: <YOUR-TUNNEL-UUID>
credentials-file: /etc/cloudflared/<YOUR-TUNNEL-UUID>.json

ingress:
  # Next.js Frontend (Portfolio & Wiki & Admin UI)
  - hostname: dekakrens.com
    service: http://localhost:8230

  # Legacy Wiki Subdomain (Redirects to dekakrens.com/wiki)
  - hostname: wiki.dekakrens.com
    service: http://localhost:8230

  # NestJS Core REST API
  - hostname: api.dekakrens.com
    service: http://localhost:8231

  # Catch-all 404 rule (required by Cloudflare)
  - service: http_status:404
```

3. Start or reload the tunnel daemon:
   ```bash
   sudo systemctl restart cloudflared
   ```

---

## 5. Continuous Updates & Redeployment Workflow

When shipping code changes from your local repository to the production server:

```bash
# 1. Sync updated files to production server
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude 'dist' ./ pi@192.168.1.50:/home/pi/portfolio/

# 2. SSH into production server
ssh pi@192.168.1.50

# 3. Navigate and rebuild the modified container
cd /home/pi/portfolio
docker compose -f docker-compose.prod.yml up -d --build portfolio_web portfolio_api
```

---

## 6. Database Backups & Restores

### Backing Up PostgreSQL

```bash
docker exec -t portfolio_postgres pg_dump -U postgres portfolio_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restoring from Backup

```bash
cat backup_file.sql | docker exec -i portfolio_postgres psql -U postgres -d portfolio_db
```
