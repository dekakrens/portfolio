import React from 'react';
import { WorkExperience } from '@/types/portfolio';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export function ExperienceSection({ experiences }: { experiences: WorkExperience[] }) {
  return (
    <section id="experience" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
            Career Journey
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4">
            Professional Experience
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
            Leading engineering efforts, scaling cloud microservices, and deploying hardware solutions.
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 sm:pl-8 border-l border-neutral-200 dark:border-neutral-800 space-y-12">
          {experiences.map((exp, index) => (
            <div key={index} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-neutral-950 transition-colors ${
                  exp.isCurrent
                    ? 'border-emerald-500 bg-emerald-500/20'
                    : 'border-neutral-400 dark:border-neutral-600'
                }`}
              />

              <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {exp.role}
                    </h3>
                    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{exp.companyName}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {exp.description}
                </p>

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                    {exp.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
