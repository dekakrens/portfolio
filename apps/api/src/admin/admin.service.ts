import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { eq, desc, asc } from 'drizzle-orm';
import { DRIZZLE_DB, type AppDatabase } from '../database/database.module.js';
import * as schema from '../database/schema.js';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly revalidateUrl =
    process.env.REVALIDATE_URL || 'http://portfolio_web:3000/api/revalidate';
  private readonly revalidateSecret =
    process.env.REVALIDATION_SECRET || 'dekakrens_super_secret_revalidate_2026';

  constructor(@Inject(DRIZZLE_DB) private readonly db: AppDatabase) {}

  private async triggerRevalidation(path?: string, tag?: string) {
    try {
      const url = new URL(this.revalidateUrl);
      url.searchParams.set('secret', this.revalidateSecret);
      if (path) url.searchParams.set('path', path);
      if (tag) url.searchParams.set('tag', tag);
      if (!path && !tag) url.searchParams.set('all', 'true');

      fetch(url.toString(), { method: 'POST' }).catch((err) => {
        this.logger.warn(`Background revalidation ping error: ${err.message}`);
      });
    } catch (e: any) {
      this.logger.warn(`Could not trigger revalidation: ${e.message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Dashboard Overview
  // ---------------------------------------------------------------------------
  async getDashboardStats() {
    const [articles, projects, inquiries, skills] = await Promise.all([
      this.db.select({ id: schema.wikiArticles.id }).from(schema.wikiArticles),
      this.db.select({ id: schema.projects.id }).from(schema.projects),
      this.db.select({ id: schema.contactInquiries.id }).from(schema.contactInquiries),
      this.db.select({ id: schema.skills.id }).from(schema.skills),
    ]);

    return {
      totalArticles: articles.length,
      totalProjects: projects.length,
      totalInquiries: inquiries.length,
      totalSkills: skills.length,
    };
  }

  // ---------------------------------------------------------------------------
  // Wiki Articles
  // ---------------------------------------------------------------------------
  async getAllArticles() {
    return this.db.query.wikiArticles.findMany({
      orderBy: [desc(schema.wikiArticles.createdAt)],
      with: {
        category: true,
      },
    });
  }

  async getArticleById(id: string) {
    const article = await this.db.query.wikiArticles.findFirst({
      where: eq(schema.wikiArticles.id, id),
      with: {
        category: true,
      },
    });
    if (!article) throw new NotFoundException(`Article with id '${id}' not found`);
    return article;
  }

  async createArticle(data: {
    title: string;
    slug: string;
    summary?: string;
    content: string;
    categoryId?: string;
    status?: string;
    readingTimeMinutes?: number;
  }) {
    const [record] = await this.db
      .insert(schema.wikiArticles)
      .values({
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        content: data.content,
        categoryId: data.categoryId || null,
        status: data.status || 'published',
        readingTimeMinutes: data.readingTimeMinutes || 5,
        publishedAt: new Date(),
      })
      .returning();

    await this.triggerRevalidation('/wiki', 'wiki');
    return record;
  }

  async updateArticle(
    id: string,
    data: {
      title?: string;
      slug?: string;
      summary?: string;
      content?: string;
      categoryId?: string;
      status?: string;
      readingTimeMinutes?: number;
    },
  ) {
    const [record] = await this.db
      .update(schema.wikiArticles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(schema.wikiArticles.id, id))
      .returning();

    if (!record) throw new NotFoundException(`Article with id '${id}' not found`);

    await this.triggerRevalidation('/wiki', 'wiki');
    if (record.slug) {
      await this.triggerRevalidation(`/wiki/${record.slug}`);
    }
    return record;
  }

  async deleteArticle(id: string) {
    const [deleted] = await this.db
      .delete(schema.wikiArticles)
      .where(eq(schema.wikiArticles.id, id))
      .returning();

    if (!deleted) throw new NotFoundException(`Article with id '${id}' not found`);

    await this.triggerRevalidation('/wiki', 'wiki');
    return { success: true, id };
  }

  async getWikiCategories() {
    return this.db.select().from(schema.wikiCategories).orderBy(asc(schema.wikiCategories.displayOrder));
  }

  // ---------------------------------------------------------------------------
  // Projects & Case Studies
  // ---------------------------------------------------------------------------
  async getAllProjects() {
    const records = await this.db.query.projects.findMany({
      orderBy: [asc(schema.projects.displayOrder)],
      with: {
        caseStudy: true,
        techStacks: {
          with: {
            skill: true,
          },
        },
      },
    });

    return records.map((p) => ({
      ...p,
      techStack:
        p.techStacks && p.techStacks.length > 0
          ? p.techStacks.map((ts) => ts.skill?.name).filter(Boolean)
          : [p.category || 'Engineering'],
    }));
  }

  async getProjectById(id: string) {
    const project = await this.db.query.projects.findFirst({
      where: eq(schema.projects.id, id),
      with: {
        caseStudy: true,
        techStacks: {
          with: {
            skill: true,
          },
        },
      },
    });

    if (!project) throw new NotFoundException(`Project with id '${id}' not found`);

    return {
      ...project,
      techStack:
        project.techStacks && project.techStacks.length > 0
          ? project.techStacks.map((ts) => ts.skill?.name).filter(Boolean)
          : [project.category || 'Engineering'],
    };
  }

  async createProject(data: {
    title: string;
    slug: string;
    summary: string;
    category: string;
    thumbnailUrl?: string;
    liveDemoUrl?: string;
    repoUrl?: string;
    isFeatured?: boolean;
    displayOrder?: number;
    caseStudy?: {
      overview: string;
      architecture: string;
      challenges: string;
      keyFeatures: string[];
      results: string;
    };
  }) {
    const [record] = await this.db
      .insert(schema.projects)
      .values({
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        category: data.category,
        thumbnailUrl: data.thumbnailUrl,
        liveDemoUrl: data.liveDemoUrl,
        repoUrl: data.repoUrl,
        isFeatured: data.isFeatured ?? true,
        displayOrder: data.displayOrder ?? 0,
      })
      .returning();

    if (data.caseStudy) {
      await this.db.insert(schema.projectCaseStudies).values({
        projectId: record.id,
        overview: data.caseStudy.overview,
        architecture: data.caseStudy.architecture,
        challenges: data.caseStudy.challenges,
        keyFeatures: data.caseStudy.keyFeatures,
        results: data.caseStudy.results,
      });
    }

    await this.triggerRevalidation('/', 'projects');
    return this.getProjectById(record.id);
  }

  async updateProject(
    id: string,
    data: {
      title?: string;
      slug?: string;
      summary?: string;
      category?: string;
      thumbnailUrl?: string;
      liveDemoUrl?: string;
      repoUrl?: string;
      isFeatured?: boolean;
      displayOrder?: number;
      caseStudy?: {
        overview: string;
        architecture: string;
        challenges: string;
        keyFeatures: string[];
        results: string;
      };
    },
  ) {
    const [record] = await this.db
      .update(schema.projects)
      .set({
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        category: data.category,
        thumbnailUrl: data.thumbnailUrl,
        liveDemoUrl: data.liveDemoUrl,
        repoUrl: data.repoUrl,
        isFeatured: data.isFeatured,
        displayOrder: data.displayOrder,
        updatedAt: new Date(),
      })
      .where(eq(schema.projects.id, id))
      .returning();

    if (!record) throw new NotFoundException(`Project with id '${id}' not found`);

    if (data.caseStudy) {
      const [existingCs] = await this.db
        .select()
        .from(schema.projectCaseStudies)
        .where(eq(schema.projectCaseStudies.projectId, id))
        .limit(1);

      if (existingCs) {
        await this.db
          .update(schema.projectCaseStudies)
          .set({
            overview: data.caseStudy.overview,
            architecture: data.caseStudy.architecture,
            challenges: data.caseStudy.challenges,
            keyFeatures: data.caseStudy.keyFeatures,
            results: data.caseStudy.results,
          })
          .where(eq(schema.projectCaseStudies.projectId, id));
      } else {
        await this.db.insert(schema.projectCaseStudies).values({
          projectId: id,
          overview: data.caseStudy.overview,
          architecture: data.caseStudy.architecture,
          challenges: data.caseStudy.challenges,
          keyFeatures: data.caseStudy.keyFeatures,
          results: data.caseStudy.results,
        });
      }
    }

    await this.triggerRevalidation('/', 'projects');
    if (record.slug) {
      await this.triggerRevalidation(`/projects/${record.slug}`);
    }

    return this.getProjectById(id);
  }

  async deleteProject(id: string) {
    const [deleted] = await this.db
      .delete(schema.projects)
      .where(eq(schema.projects.id, id))
      .returning();

    if (!deleted) throw new NotFoundException(`Project with id '${id}' not found`);

    await this.triggerRevalidation('/', 'projects');
    return { success: true, id };
  }

  // ---------------------------------------------------------------------------
  // Contact Inquiries
  // ---------------------------------------------------------------------------
  async getAllInquiries() {
    return this.db
      .select()
      .from(schema.contactInquiries)
      .orderBy(desc(schema.contactInquiries.createdAt));
  }

  async deleteInquiry(id: string) {
    const [deleted] = await this.db
      .delete(schema.contactInquiries)
      .where(eq(schema.contactInquiries.id, id))
      .returning();

    if (!deleted) throw new NotFoundException(`Inquiry with id '${id}' not found`);
    return { success: true, id };
  }

  // ---------------------------------------------------------------------------
  // Profile
  // ---------------------------------------------------------------------------
  async getProfile() {
    const [profile] = await this.db.select().from(schema.profiles).limit(1);
    return profile;
  }

  async updateProfile(data: {
    fullName?: string;
    headline?: string;
    bioShort?: string;
    bioLong?: string;
    availabilityBadge?: string;
    resumeAssetUrl?: string;
    socialLinks?: any;
  }) {
    const [profile] = await this.db.select().from(schema.profiles).limit(1);
    if (!profile) throw new NotFoundException('Profile record not found');

    const [updated] = await this.db
      .update(schema.profiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(schema.profiles.id, profile.id))
      .returning();

    await this.triggerRevalidation('/', 'profile');
    return updated;
  }
}
