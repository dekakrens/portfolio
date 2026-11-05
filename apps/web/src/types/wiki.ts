export interface WikiCategory {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  articleCount?: number;
}

export interface WikiArticleMeta {
  id: string;
  title: string;
  slug: string;
  summary: string;
  readingTimeMinutes: number;
  publishedAt: string;
  categoryId?: string;
  category?: WikiCategory;
}

export interface WikiArticle extends WikiArticleMeta {
  content: string;
}
