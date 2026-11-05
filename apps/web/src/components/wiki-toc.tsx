'use client';

import React, { useEffect, useState } from 'react';
import { ListOrdered } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function WikiToc({ content }: { content: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const lines = content.split('\n');
    const parsed: TocItem[] = [];

    for (const line of lines) {
      if (line.startsWith('## ')) {
        const text = line.replace('## ', '').trim();
        parsed.push({
          id: slugify(text),
          text,
          level: 2,
        });
      } else if (line.startsWith('### ')) {
        const text = line.replace('### ', '').trim();
        parsed.push({
          id: slugify(text),
          text,
          level: 3,
        });
      }
    }

    setItems(parsed);

    // Scrollspy observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0% -60% 0%' },
    );

    parsed.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [content]);

  if (items.length === 0) return null;

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-28 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          <ListOrdered className="w-3.5 h-3.5" />
          <span>On This Page</span>
        </div>
        <nav className="flex flex-col gap-1.5 text-xs">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`transition-colors py-1 block truncate leading-snug ${
                item.level === 3 ? 'pl-3' : ''
              } ${
                activeId === item.id
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
