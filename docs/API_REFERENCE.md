# REST API Reference & Specification

The **Deka Krens Backend API** is powered by NestJS 12. Interactive OpenAPI/Swagger documentation is available at `/api/docs` (e.g., `https://api.dekakrens.com/api/docs` or `http://localhost:4000/api/docs`).

All endpoints are prefixed with `/api/v1`.

---

## 1. Public Portfolio Endpoints

These endpoints power the public showcase and are consumed by the Next.js server during static generation and server-side rendering.

### `GET /api/v1/profile`
Returns the public developer profile, social links, headline, and the 4 hero highlight cards.

**Response Example (`200 OK`):**
```json
{
  "id": "e63a8a3a-2114-4fb0-a7d1-0f473c4d7202",
  "fullName": "Deny Kurniawan",
  "headline": "Lead Frontend & IoT Systems Engineer",
  "bioShort": "Passionate about building resilient web applications...",
  "bioLong": "Full-stack engineer with deep expertise...",
  "availabilityBadge": "Available for Projects",
  "resumeAssetUrl": "/Deny_Kurniawan_Resume.pdf",
  "socialLinks": {
    "github": "https://github.com/dekakrens",
    "linkedin": "https://linkedin.com/in/dekakrens",
    "email": "dekakrens@gmail.com"
  },
  "highlights": [
    { "icon": "Layers", "title": "6+ Years", "subtitle": "Full-Stack Experience" },
    { "icon": "Cpu", "title": "Edge & IoT", "subtitle": "ESP32 / OpenCV / LoRa" },
    { "icon": "Terminal", "title": "Enterprise", "subtitle": "NestJS & Drizzle ORM" },
    { "icon": "Sparkles", "title": "99.2%", "subtitle": "Vision OCR Accuracy" }
  ]
}
```

---

### `GET /api/v1/projects`
Returns an array of published projects including category, live demo URLs, repository URLs, and associated technology badges.

### `GET /api/v1/projects/:slug`
Fetches a single project by unique slug along with its complete architectural case study.

---

### `GET /api/v1/skills`
Returns skills grouped hierarchically by category for the landing page skills matrix.

**Response Example (`200 OK`):**
```json
[
  {
    "id": "c1f78df2-...",
    "name": "Frontend & Mobile",
    "displayOrder": 1,
    "skills": [
      { "id": "...", "name": "React 19", "iconSlug": "react", "isFeatured": true },
      { "id": "...", "name": "Next.js 15", "iconSlug": "nextjs", "isFeatured": true }
    ]
  }
]
```

---

### `GET /api/v1/experience`
Returns work experiences in chronological order.

### `GET /api/v1/testimonials`
Returns peer and client testimonials. Returns empty array `[]` if none exist.

### `POST /api/v1/contact`
Receives contact form submissions. Automatically triggers a notification email via Resend to the portfolio owner.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Project Collaboration Inquiry",
  "message": "Hi Deny, I saw your water meter project..."
}
```

---

## 2. Digital Garden & Wiki Endpoints

### `GET /api/v1/wiki/categories`
Returns all wiki categories with article count indicators.

### `GET /api/v1/wiki/articles`
Returns published digital garden articles with reading time and publish dates.

### `GET /api/v1/wiki/articles/:slug`
Returns a specific technical article and its full Markdown body.

---

## 3. Authentication Endpoints

### `POST /api/v1/auth/login`
Authenticates the admin user and returns a cryptographically signed HMAC token.

**Request Body:**
```json
{
  "email": "dekakrens@gmail.com",
  "password": "your_password"
}
```

**Response (`200 OK`):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "dekakrens@gmail.com",
    "name": "Deny Kurniawan",
    "role": "admin"
  }
}
```

### `GET /api/v1/auth/me`
Validates the active session token passed in the `Authorization: Bearer <token>` header.

---

## 4. Admin CMS Endpoints (Protected)

All routes require `Authorization: Bearer <token>`.

### Dashboard Overview
- `GET /api/v1/admin/stats` - Total counts of projects, articles, skills, and unread inquiries.

### Profile & Hero Highlight Cards
- `GET /api/v1/admin/profile` - Fetch profile for editing.
- `PUT /api/v1/admin/profile` - Update bio, social links, and the 4 hero highlight cards.

### Projects Management
- `GET /api/v1/admin/projects` - List all projects.
- `GET /api/v1/admin/projects/:id` - Fetch project by ID.
- `POST /api/v1/admin/projects` - Create new project.
- `PUT /api/v1/admin/projects/:id` - Update existing project.
- `DELETE /api/v1/admin/projects/:id` - Delete project.

### Skills & Competencies Management
- `GET /api/v1/admin/skills` - List all categories with nested skills.
- `POST /api/v1/admin/skills/categories` - Create skill category.
- `PUT /api/v1/admin/skills/categories/:id` - Update skill category.
- `DELETE /api/v1/admin/skills/categories/:id` - Delete skill category.
- `POST /api/v1/admin/skills` - Create skill chip.
- `PUT /api/v1/admin/skills/:id` - Update skill chip.
- `DELETE /api/v1/admin/skills/:id` - Delete skill chip.

### Career Journey Timeline
- `GET /api/v1/admin/experience` - List all work experiences.
- `POST /api/v1/admin/experience` - Create work experience.
- `PUT /api/v1/admin/experience/:id` - Update work experience.
- `DELETE /api/v1/admin/experience/:id` - Delete work experience.

### Feedbacks & Testimonials
- `GET /api/v1/admin/testimonials` - List all testimonials.
- `POST /api/v1/admin/testimonials` - Create testimonial.
- `PUT /api/v1/admin/testimonials/:id` - Update testimonial.
- `DELETE /api/v1/admin/testimonials/:id` - Delete testimonial.

### Digital Garden / Wiki Management
- `GET /api/v1/admin/wiki/articles` - List all articles.
- `GET /api/v1/admin/wiki/articles/:id` - Fetch article by ID.
- `POST /api/v1/admin/wiki/articles` - Create markdown article.
- `PUT /api/v1/admin/wiki/articles/:id` - Update markdown article.
- `DELETE /api/v1/admin/wiki/articles/:id` - Delete article.
- `GET /api/v1/admin/wiki/categories` - List wiki categories.

### Inquiries & Messages
- `GET /api/v1/admin/inquiries` - View inbound messages.
- `DELETE /api/v1/admin/inquiries/:id` - Delete message.

---

## 5. Next.js On-Demand Revalidation Endpoint

### `POST /api/revalidate`
Endpoint hosted by `apps/web` to purge Next.js server-side cache tags and paths on demand.

**Query Parameters:**
- `secret`: Must match `REVALIDATION_SECRET`.
- `tag`: (Optional) Cache tag to purge (e.g., `profile`, `projects`, `skills`, `wiki`).
- `path`: (Optional) Exact route path to purge (e.g., `/`, `/wiki`).
