'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { ExternalLink, BookOpen, X, CheckCircle2, Cpu } from 'lucide-react';
import { GithubIcon } from './icons';

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
              Featured Work
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
              Selected Engineering Projects
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-lg group"
            >
              {/* Card Header with category badge & icon */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
                    <Cpu className="w-3.5 h-3.5" />
                    {project.category}
                  </span>
                  {project.isFeatured && (
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2.5">
                  <Link href={`/projects/${project.slug}`}>
                    {project.title}
                  </Link>
                </h3>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 flex-1">
                  {project.summary}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800 text-sm">
                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Case Study</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        aria-label="View Source Code"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        aria-label="Live Demo Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Case Study Modal */}
        {activeModalProject && activeModalProject.caseStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Close Button */}
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-6 right-6 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                aria-label="Close Case Study"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
                  Technical Case Study
                </span>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  {activeModalProject.title}
                </h3>
              </div>

              {/* Overview */}
              {activeModalProject.caseStudy.overview && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Problem &amp; Overview
                  </h4>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {activeModalProject.caseStudy.overview}
                  </p>
                </div>
              )}

              {/* Architecture */}
              {activeModalProject.caseStudy.architecture && (
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Architecture &amp; Engineering Solution
                  </h4>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {activeModalProject.caseStudy.architecture}
                  </p>
                </div>
              )}

              {/* Challenges */}
              {activeModalProject.caseStudy.challenges && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Key Challenges &amp; Overcoming Them
                  </h4>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {activeModalProject.caseStudy.challenges}
                  </p>
                </div>
              )}

              {/* Key Features */}
              {activeModalProject.caseStudy.keyFeatures && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                    Key Highlights
                  </h4>
                  <ul className="space-y-2">
                    {activeModalProject.caseStudy.keyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Results */}
              {activeModalProject.caseStudy.results && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 text-sm font-medium">
                  <strong>Outcome:</strong> {activeModalProject.caseStudy.results}
                </div>
              )}

              {/* Footer link to dedicated SEO page */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                <Link
                  href={`/projects/${activeModalProject.slug}`}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Open dedicated page for this project &rarr;
                </Link>
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
