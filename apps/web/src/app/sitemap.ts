import { MetadataRoute } from 'next';
import { getProjects } from '@/lib/api';
import { getWikiArticles } from '@/lib/wiki-api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dekakrens.com';
  const [projects, articles] = await Promise.all([
    getProjects(),
    getWikiArticles(),
  ]);

  const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const wikiUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/wiki/${a.slug}`,
    lastModified: new Date(a.publishedAt || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/wiki`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...projectUrls,
    ...wikiUrls,
  ];
}
