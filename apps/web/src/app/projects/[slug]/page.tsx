import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug, getProjects } from '@/lib/api';
import { ArrowLeft, ExternalLink, CheckCircle2, Cpu } from 'lucide-react';
import { GithubIcon } from '@/components/icons';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

// -----------------------------------------------------------------------------
// Dynamic SEO Metadata Generation (Executes on Server at Request / Build Time)
// -----------------------------------------------------------------------------
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found | Deny Kurniawan (@dekakrens)',
      description: 'The requested engineering case study could not be found.',
    };
  }

  const title = `${project.title} - Engineering Case Study | Deny Kurniawan`;
  const description = project.summary;
  const canonicalUrl = `https://dekakrens.com/projects/${project.slug}`;
  const ogImageUrl = `https://dekakrens.com/api/og?title=${encodeURIComponent(project.title)}&subtitle=${encodeURIComponent(project.summary.slice(0, 110))}&tag=${encodeURIComponent('Featured Case Study')}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      siteName: 'Deny Kurniawan (@dekakrens) Portfolio',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@dekakrens',
      images: [ogImageUrl],
    },
  };
}

// -----------------------------------------------------------------------------
// Generate Static Params for SSG
// -----------------------------------------------------------------------------
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

// -----------------------------------------------------------------------------
// Page Component (React Server Component)
// -----------------------------------------------------------------------------
export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // JSON-LD Structured Data for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: project.title,
    description: project.summary,
    author: {
      '@type': 'Person',
      name: 'Deny Kurniawan',
      alternateName: 'dekakrens',
      url: 'https://dekakrens.com',
    },
    about: project.category,
    keywords: (project.techStack || []).join(', '),
  };

  return (
    <article className="min-h-screen py-16 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all projects</span>
        </Link>
      </div>

      {/* Header */}
      <header className="mb-12 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
            <Cpu className="w-3.5 h-3.5" />
            {project.category}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Engineering Case Study
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          {project.title}
        </h1>

        <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {project.summary}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {(project.techStack || []).map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 pt-4">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-xs font-medium transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
          )}
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demonstration</span>
            </a>
          )}
        </div>
      </header>

      {/* Case Study Details */}
      {project.caseStudy && (
        <div className="space-y-10 border-t border-neutral-200 dark:border-neutral-800 pt-10">
          {project.caseStudy.overview && (
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Problem Statement &amp; Overview
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm sm:text-base">
                {project.caseStudy.overview}
              </p>
            </section>
          )}

          {project.caseStudy.architecture && (
            <section className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Technical Architecture
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm sm:text-base">
                {project.caseStudy.architecture}
              </p>
            </section>
          )}

          {project.caseStudy.challenges && (
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Engineering Challenges
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm sm:text-base">
                {project.caseStudy.challenges}
              </p>
            </section>
          )}

          {project.caseStudy.keyFeatures && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Key Features &amp; Capabilities
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(project.caseStudy?.keyFeatures || []).map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/40 text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.caseStudy.results && (
            <section className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-300 space-y-2">
              <h2 className="text-lg font-bold">Measurable Results &amp; Impact</h2>
              <p className="text-sm leading-relaxed">{project.caseStudy.results}</p>
            </section>
          )}
        </div>
      )}
    </article>
  );
}
