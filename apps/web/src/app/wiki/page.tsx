import React from 'react';
import { Metadata } from 'next';
import { getWikiCategories, getWikiArticles } from '@/lib/wiki-api';
import { WikiDashboard } from '@/components/wiki-dashboard';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Engineering Wiki & Digital Garden | Deny Kurniawan (@dekakrens)',
  description:
    'Living documentation, architectural write-ups, IoT cheatsheets, and production DevOps lessons learned by Deny Kurniawan (@dekakrens).',
  openGraph: {
    title: 'Engineering Wiki & Digital Garden | Deny Kurniawan (@dekakrens)',
    description:
      'Living documentation, architectural write-ups, IoT cheatsheets, and production DevOps lessons learned by Deny Kurniawan (@dekakrens).',
    url: 'https://wiki.dekakrens.com',
  },
  alternates: {
    canonical: 'https://wiki.dekakrens.com',
  },
};

export default async function WikiPage() {
  const [categories, articles] = await Promise.all([
    getWikiCategories(),
    getWikiArticles(),
  ]);

  return <WikiDashboard categories={categories} articles={articles} />;
}
