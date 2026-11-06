'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ArticleEditor } from '@/components/admin/article-editor';

export default function EditArticlePage() {
  const params = useParams();
  const id = params.id as string;

  return <ArticleEditor articleId={id} />;
}
