import React from 'react';
import { Testimonial } from '@/types/portfolio';
import { Quote } from 'lucide-react';
import { LinkedinIcon } from './icons';

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="testimonials" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
            Social Proof
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4">
            Recommendations &amp; Feedback
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
            What technical leads and product managers say about collaborating with me.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between relative group hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <Quote className="w-8 h-8 text-neutral-200 dark:text-neutral-800 mb-4" />

              <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed italic mb-6">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white text-sm">
                    {t.authorName}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {t.authorTitle} {t.company && `at ${t.company}`}
                  </div>
                </div>

                {t.linkedinUrl && (
                  <a
                    href={t.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    aria-label={`LinkedIn for ${t.authorName}`}
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
