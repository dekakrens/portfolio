# Admin CMS User & Developer Guide

The **Deka Krens Admin CMS** provides a self-hosted, headless administration dashboard at `/admin` to control all landing page sections, project case studies, career timelines, and digital garden articles without editing code or redeploying containers.

---

## 1. Accessing the Dashboard

- **URL:** `https://dekakrens.com/admin` (or `http://localhost:3000/admin` locally)
- **Login Route:** `https://dekakrens.com/admin/login`
- **Default Credentials:** Configured via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your environment (defaults to `dekakrens@gmail.com` / `dekakrens2026!`).

> [!NOTE]
> The admin session token is securely stored in `localStorage` and sent via standard `Authorization: Bearer <token>` headers to the NestJS API. If unauthenticated, the dashboard automatically routes visitors to `/admin/login`.

---

## 2. Managing Content Sections

```
/admin
├── /profile       -> Bio, Headline, Status Badge, and 4 Hero Highlight Cards
├── /projects      -> Project Case Studies, URLs, Tech Stacks, and Ordering
├── /wiki          -> Digital Garden Articles with Full Markdown Editor
├── /skills        -> Competency Categories and Technical Skill Chips
├── /experience    -> Career Journey Timeline with Measurable Achievements
├── /testimonials  -> Client Endorsements and Peer Feedbacks
└── /messages      -> Inbound Contact Form Messages & Inquiries
```

---

### A. Profile & Hero Highlight Cards (`/admin/profile`)

Directly manages the introductory hero section of the landing page:
1. **Developer Information**: Full Name, Headline, Short Bio, and Detailed Bio.
2. **Availability Badge**: Text rendered in the animated status pill (e.g. `"Open to Opportunities"` or `"Available for Q2 Projects"`).
3. **Social Links**: GitHub, LinkedIn, Email, and Twitter/X URLs.
4. **Hero Highlight Cards (Below Social Links)**:
   - Configures the **4 key metric cards** displayed under your social links.
   - For each card, customize:
     - **Card Icon:** Choose from a curated icon set (`Layers`, `Cpu`, `Terminal`, `Sparkles`, `Code`, `Award`, `Zap`, `Globe`, `Smartphone`, `ShieldCheck`).
     - **Title:** Primary metric (e.g., `"6+ Years"`, `"Edge & IoT"`, `"99.2%"`).
     - **Subtitle:** Descriptive caption (e.g., `"Full-Stack Experience"`, `"Vision OCR Accuracy"`).
   - Instant live preview and automated on-demand cache revalidation.

---

### B. Skills & Competencies (`/admin/skills`)

Organize technologies into functional categories (e.g. *Frontend & Mobile*, *Backend & Cloud*, *IoT & Embedded Systems*, *DevOps & Tooling*):
- **Categories:** Add, edit, or delete skill categories with custom display ordering.
- **Skill Chips:** Add individual skills with name, optional icon slug, and display priority.
- **Cascading Deletion:** Deleting a category automatically and cleanly cleans up child skill references.

---

### C. Career Journey Timeline (`/admin/experience`)

Presents your professional employment history on the landing page:
- **Company & Role:** Company name, role title, company URL, and physical/remote location.
- **Dates & Current Job:** Start date, end date, and an `"I currently work here"` toggle (which automatically shows `"Present"` with an active indicator badge).
- **Achievements & Bullet Points:** Add, reorder, or remove key accomplishments.

---

### D. Feedbacks & Testimonials (`/admin/testimonials`)

Showcase recommendations and peer quotes:
- **Fields:** Author Name, Title/Role, Company, Testimonial Quote, Avatar Image URL, and LinkedIn Profile URL.
- **Empty State Behavior:** If all testimonials are removed from the database, the testimonials section on the landing page gracefully unmounts without leaving empty UI containers.

---

### E. Projects & Case Studies (`/admin/projects`)

Build in-depth project pages:
- **Core Attributes:** Title, URL slug (e.g., `ai-smart-water-meter`), summary, category, demo URL, and GitHub repository URL.
- **Featured Toggle:** Controls whether the project is elevated to the hero showcase.
- **Case Study Deep-Dive:**
  - **Overview:** Background narrative.
  - **Architecture:** System architecture and pipeline breakdown.
  - **Challenges:** Key engineering hurdles solved.
  - **Key Features:** Dynamic bullet list of capabilities.
  - **Results & Metrics:** Quantifiable production outcomes.

---

### F. Digital Garden & Wiki (`/admin/wiki`)

The built-in publication engine for technical writings:
- **Markdown Editor:** Write articles in standard Markdown with syntax highlighting and live word count.
- **Taxonomy:** Assign articles to Wiki Categories (e.g. *DevOps & Systems*, *Frontend Engineering*, *Edge IoT*).
- **Reading Time:** Automatic or manual reading time calculation in minutes.
- **Publish Status:** Draft or Published state toggles.

---

### G. Inbound Messages (`/admin/messages`)

Review messages sent through the landing page contact form:
- Displays sender name, email address, subject, timestamp, and message body.
- Quick email reply button (`mailto:`) and deletion option.
- Every submission also automatically fires a notification email to your personal inbox via **Resend**.

---

## 3. Instant Cache Revalidation

Every save, update, or deletion in the Admin CMS automatically triggers an internal webhook to the Next.js revalidation endpoint:

```
POST /api/revalidate?secret=<REVALIDATION_SECRET>&tag=<entity_tag>&path=/
```

This invalidates Next.js data caches and purges stale static HTML, ensuring the public site updates within milliseconds without rebuilding Docker images.
