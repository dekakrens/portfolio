'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ProjectEditor } from '@/components/admin/project-editor';

export default function EditProjectPage() {
  const params = useParams();
  const id = params.id as string;

  return <ProjectEditor projectId={id} />;
}
