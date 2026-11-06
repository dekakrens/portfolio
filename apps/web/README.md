# apps/web — Next.js 15 Frontend & Presentation

This is the frontend application for the **Deka Krens Developer Platform**, built with **Next.js 15 (App Router)**, **React 19**, and **Tailwind CSS v4**.

---

## 🏗️ Architecture & Route Groups

The application uses App Router route groups to cleanly separate page layouts:

- `src/app/(portfolio)/`: Landing page (`/`), Hero section with dynamic metric cards, Projects showcase, Skills matrix, Career Journey timeline, Testimonials, and Case Studies (`/projects/[slug]`).
- `src/app/wiki/`: Digital Garden and technical engineering notes (`/wiki` and `/wiki/[slug]`) with dedicated `WikiNavbar` and category navigation.
- `src/app/admin/`: Headless Admin CMS dashboard (`/admin`) with custom sidebar, auth guards, and content management.
- `src/app/api/revalidate/`: On-demand ISR cache invalidation endpoint.

---

## 🚀 Running Locally

```bash
# Run standalone frontend dev server
pnpm dev

# Or from repository root:
pnpm dev:web
```

Frontend runs on [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` if needed:

```bash
PORT=3000
INTERNAL_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
REVALIDATION_SECRET=your_revalidation_secret
```

---

## 📖 Main Documentation

See the root repository documentation for full architecture and deployment manuals:
- [Root README](../../README.md)
- [Architecture Guide](../../docs/ARCHITECTURE.md)
- [CMS Guide](../../docs/CMS_GUIDE.md)
