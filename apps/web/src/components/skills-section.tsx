import React from 'react';
import { SkillCategory } from '@/types/portfolio';
import { Layout, Server, Cpu, Wrench } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'Frontend Architecture': <Layout className="w-5 h-5 text-indigo-500" />,
  'Backend & Cloud Systems': <Server className="w-5 h-5 text-emerald-500" />,
  'Embedded & IoT Systems': <Cpu className="w-5 h-5 text-cyan-500" />,
  'DevOps & Tooling': <Wrench className="w-5 h-5 text-amber-500" />,
};

export function SkillsSection({ categories }: { categories: SkillCategory[] }) {
  return (
    <section id="skills" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
            Technical Proficiency
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4">
            Skills & Core Competencies
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
            A battle-tested stack spanning high-performance web frontends, resilient microservices, and edge IoT devices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm flex flex-col"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  {categoryIcons[cat.name] || <Wrench className="w-5 h-5 text-neutral-500" />}
                </div>
                <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                  {cat.name}
                </h3>
              </div>

              <ul className="space-y-2.5 flex-1">
                {cat.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="flex items-center justify-between text-sm py-1 border-b border-neutral-100 dark:border-neutral-800/60 last:border-none"
                  >
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      {skill.name}
                    </span>
                    {skill.isFeatured && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
