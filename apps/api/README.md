# apps/api — NestJS 12 Core REST API & CMS Backend

This is the backend service for the **Deka Krens Developer Platform**, built with **NestJS 12**, **Drizzle ORM**, and **PostgreSQL 16**.

---

## 🏗️ Architecture & Modules

The API application consists of modular domain providers:

- `src/auth/`: Native PBKDF2 password hashing with salt and stateless HMAC-SHA256 session tokens.
- `src/portfolio/`: Public endpoints for developer profile, projects, skills, career timeline, and contact submissions.
- `src/wiki/`: Public endpoints for Digital Garden categories and Markdown articles.
- `src/admin/`: Protected CMS management endpoints (`/api/v1/admin/*`) with automatic on-demand Next.js cache revalidation triggers.
- `src/database/`: Drizzle ORM schema, migrations, connection pool, and initial data seeding.
- `src/email/`: Transactional email delivery via Resend.

---

## 🚀 Running Locally

```bash
# Run standalone API server in watch mode
pnpm start:dev

# Or from repository root:
pnpm dev:api
```

API runs on [http://localhost:4000](http://localhost:4000).
Interactive Swagger documentation is available at [http://localhost:4000/api/docs](http://localhost:4000/api/docs).

---

## 🗄️ Database Commands

```bash
# Generate Drizzle migrations
pnpm db:generate

# Push schema directly to database
pnpm db:push

# Run seed script
pnpm db:seed

# Launch interactive Drizzle Studio
pnpm db:studio
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```bash
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio_db
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=dekakrens@gmail.com
ADMIN_PASSWORD=your_password
ADMIN_NAME="Deny Kurniawan"
JWT_SECRET=your_jwt_secret
REVALIDATION_SECRET=your_revalidation_secret
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL="Deny Kurniawan <onboarding@resend.dev>"
RESEND_TO_EMAIL=dekakrens@gmail.com
```

---

## 📖 Main Documentation

See the root repository documentation for full architecture and deployment manuals:
- [Root README](../../README.md)
- [Architecture Guide](../../docs/ARCHITECTURE.md)
- [API Reference](../../docs/API_REFERENCE.md)
- [Deployment Guide](../../docs/DEPLOYMENT.md)
