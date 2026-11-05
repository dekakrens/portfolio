'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple, resilient parser for markdown sections
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLanguage = '';
  let keyIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced code block detection
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <CodeBlock
            key={`code-${keyIndex++}`}
            code={codeBuffer.join('\n')}
            language={codeLanguage || 'text'}
          />,
        );
        codeBuffer = [];
        codeLanguage = '';
        inCodeBlock = false;
      } else {
        // Start of code block
        inCodeBlock = true;
        codeLanguage = line.trim().replace('```', '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      const text = line.replace('# ', '').trim();
      elements.push(
        <h1
          key={`h1-${keyIndex++}`}
          id={slugify(text)}
          className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-8 mb-4 tracking-tight scroll-mt-24"
        >
          {text}
        </h1>,
      );
      continue;
    }

    if (line.startsWith('## ')) {
      const text = line.replace('## ', '').trim();
      elements.push(
        <h2
          key={`h2-${keyIndex++}`}
          id={slugify(text)}
          className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-3 tracking-tight border-b border-neutral-200 dark:border-neutral-800 pb-2 scroll-mt-24"
        >
          {text}
        </h2>,
      );
      continue;
    }

    if (line.startsWith('### ')) {
      const text = line.replace('### ', '').trim();
      elements.push(
        <h3
          key={`h3-${keyIndex++}`}
          id={slugify(text)}
          className="text-xl font-semibold text-neutral-900 dark:text-white mt-6 mb-2 tracking-tight scroll-mt-24"
        >
          {text}
        </h3>,
      );
      continue;
    }

    // Horizontal rule
    if (line.trim() === '---') {
      elements.push(
        <hr
          key={`hr-${keyIndex++}`}
          className="my-8 border-neutral-200 dark:border-neutral-800"
        />,
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const text = line.replace('> ', '').trim();
      elements.push(
        <blockquote
          key={`quote-${keyIndex++}`}
          className="border-l-4 border-emerald-500 pl-4 py-1 my-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-r-lg text-neutral-700 dark:text-neutral-300 italic"
        >
          {text}
        </blockquote>,
      );
      continue;
    }

    // Bullet lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = line.substring(2).trim();
      elements.push(
        <li
          key={`li-${keyIndex++}`}
          className="ml-6 list-disc text-neutral-700 dark:text-neutral-300 my-1 leading-relaxed"
        >
          {renderInlineMarkdown(text)}
        </li>,
      );
      continue;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(line)) {
      const text = line.replace(/^\d+\.\s/, '').trim();
      elements.push(
        <li
          key={`oli-${keyIndex++}`}
          className="ml-6 list-decimal text-neutral-700 dark:text-neutral-300 my-1 leading-relaxed"
        >
          {renderInlineMarkdown(text)}
        </li>,
      );
      continue;
    }

    // Empty lines
    if (!line.trim()) {
      continue;
    }

    // Regular paragraphs
    elements.push(
      <p
        key={`p-${keyIndex++}`}
        className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed my-3"
      >
        {renderInlineMarkdown(line)}
      </p>,
    );
  }

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      {elements}
    </article>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-neutral-100 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-950/80 border-b border-neutral-800 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono font-medium lowercase">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed bg-neutral-900 text-neutral-200 m-0">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function renderInlineMarkdown(text: string): React.ReactNode {
  // Inline code `...`
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-neutral-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
