import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// -----------------------------------------------------------------------------
// CMS / Profile Domain
// -----------------------------------------------------------------------------
export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull().default('Deka Krens'),
  headline: varchar('headline', { length: 255 }).notNull(),
  bioShort: text('bio_short').notNull(),
  bioLong: text('bio_long'),
  availabilityBadge: varchar('availability_badge', { length: 120 }).default('Open to Opportunities'),
  resumeAssetUrl: varchar('resume_asset_url', { length: 500 }),
  socialLinks: jsonb('social_links').$type<{
    github?: string;
    linkedin?: string;
    email?: string;
    twitter?: string;
  }>().default({}),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// Skills Domain
// -----------------------------------------------------------------------------
export const skillCategories = pgTable('skill_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
});

export const skills = pgTable('skills', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id')
    .references(() => skillCategories.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  iconSlug: varchar('icon_slug', { length: 100 }),
  isFeatured: boolean('is_featured').default(true).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
});

export const skillCategoriesRelations = relations(skillCategories, ({ many }) => ({
  skills: many(skills),
}));

export const skillsRelations = relations(skills, ({ one, many }) => ({
  category: one(skillCategories, {
    fields: [skills.categoryId],
    references: [skillCategories.id],
  }),
  projectTechStacks: many(projectTechStacks),
}));

// -----------------------------------------------------------------------------
// Projects Domain
// -----------------------------------------------------------------------------
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  summary: text('summary').notNull(),
  category: varchar('category', { length: 100 }).notNull().default('Full-Stack'),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  liveDemoUrl: varchar('live_demo_url', { length: 500 }),
  repoUrl: varchar('repo_url', { length: 500 }),
  isFeatured: boolean('is_featured').default(false).notNull(),
  status: varchar('status', { length: 50 }).default('published').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projectTechStacks = pgTable('project_tech_stacks', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
  skillId: uuid('skill_id')
    .references(() => skills.id, { onDelete: 'cascade' })
    .notNull(),
});

export const projectCaseStudies = pgTable('project_case_studies', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),
  overview: text('overview'),
  architecture: text('architecture'),
  challenges: text('challenges'),
  keyFeatures: jsonb('key_features').$type<string[]>().default([]),
  results: text('results'),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  techStacks: many(projectTechStacks),
  caseStudy: one(projectCaseStudies, {
    fields: [projects.id],
    references: [projectCaseStudies.projectId],
  }),
}));

export const projectTechStacksRelations = relations(projectTechStacks, ({ one }) => ({
  project: one(projects, {
    fields: [projectTechStacks.projectId],
    references: [projects.id],
  }),
  skill: one(skills, {
    fields: [projectTechStacks.skillId],
    references: [skills.id],
  }),
}));

// -----------------------------------------------------------------------------
// Experience & Testimonials Domain
// -----------------------------------------------------------------------------
export const workExperiences = pgTable('work_experiences', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  companyUrl: varchar('company_url', { length: 500 }),
  role: varchar('role', { length: 255 }).notNull(),
  location: varchar('location', { length: 150 }).notNull(),
  startDate: varchar('start_date', { length: 50 }).notNull(),
  endDate: varchar('end_date', { length: 50 }).notNull().default('Present'),
  isCurrent: boolean('is_current').default(false).notNull(),
  description: text('description').notNull(),
  highlights: jsonb('highlights').$type<string[]>().default([]),
  displayOrder: integer('display_order').default(0).notNull(),
});

export const testimonials = pgTable('testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorName: varchar('author_name', { length: 255 }).notNull(),
  authorTitle: varchar('author_title', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }),
  content: text('content').notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  linkedinUrl: varchar('linkedin_url', { length: 500 }),
  displayOrder: integer('display_order').default(0).notNull(),
});

// -----------------------------------------------------------------------------
// Contact Inquiries
// -----------------------------------------------------------------------------
export const contactInquiries = pgTable('contact_inquiries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('unread').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// Wiki / Digital Garden Domain
// -----------------------------------------------------------------------------
export const wikiCategories = pgTable('wiki_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  slug: varchar('slug', { length: 150 }).unique().notNull(),
  parentId: uuid('parent_id'),
  displayOrder: integer('display_order').default(0).notNull(),
});

export const wikiArticles = pgTable('wiki_articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id').references(() => wikiCategories.id, {
    onDelete: 'set null',
  }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  summary: text('summary'),
  content: text('content').notNull(),
  status: varchar('status', { length: 50 }).default('published').notNull(),
  readingTimeMinutes: integer('reading_time_minutes').default(5),
  publishedAt: timestamp('published_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
