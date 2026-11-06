import React from 'react';
import { Profile } from '@/types/portfolio';
import {
  Mail,
  ArrowRight,
  Download,
  Cpu,
  Layers,
  Terminal,
  Sparkles,
  Code,
  Award,
  Zap,
  Globe,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './icons';

function HighlightIcon({ name, className }: { name?: string; className?: string }) {
  switch (name?.toLowerCase()) {
    case 'cpu':
      return <Cpu className={className} />;
    case 'terminal':
      return <Terminal className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'code':
      return <Code className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'smartphone':
      return <Smartphone className={className} />;
    case 'shieldcheck':
      return <ShieldCheck className={className} />;
    case 'layers':
    default:
      return <Layers className={className} />;
  }
}

function renderHeadline(headline?: string) {
  const text = (headline || 'React Developer & DevOps-Minded Engineer').replace(/&amp;/g, '&').trim();

  // If explicit separator " & " is used
  if (text.includes(' & ')) {
    const idx = text.indexOf(' & ');
    const firstPart = text.slice(0, idx);
    const secondPart = text.slice(idx + 3);
    return (
      <>
        {firstPart} &amp;{' '}
        <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
          {secondPart}
        </span>
      </>
    );
  }

  // If explicit separator " | " is used
  if (text.includes(' | ')) {
    const idx = text.indexOf(' | ');
    const firstPart = text.slice(0, idx);
    const secondPart = text.slice(idx + 3);
    return (
      <>
        {firstPart}{' '}
        <span className="text-neutral-400 dark:text-neutral-500 font-normal">|</span>{' '}
        <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
          {secondPart}
        </span>
      </>
    );
  }

  // If explicit separator " // " is used
  if (text.includes(' // ')) {
    const idx = text.indexOf(' // ');
    const firstPart = text.slice(0, idx);
    const secondPart = text.slice(idx + 4);
    return (
      <>
        {firstPart}{' '}
        <span className="text-neutral-400 dark:text-neutral-500 font-normal">{'//'}</span>{' '}
        <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
          {secondPart}
        </span>
      </>
    );
  }

  // Multi-word headlines: split near the middle so the second half is highlighted with gradient
  const words = text.split(/\s+/);
  if (words.length > 2) {
    const mid = Math.ceil(words.length / 2);
    const firstPart = words.slice(0, mid).join(' ');
    const secondPart = words.slice(mid).join(' ');
    return (
      <>
        {firstPart}{' '}
        <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
          {secondPart}
        </span>
      </>
    );
  }

  // Single or short phrase
  return (
    <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
      {text}
    </span>
  );
}

export function HeroSection({ profile }: { profile: Profile }) {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Subtle fluid background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 blur-[100px] -z-10 rounded-full pointer-events-none animate-fluid-glow" />

      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{profile.availabilityBadge}</span>
        </div>

        {/* Title & Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1] mb-6">
          {renderHeadline(profile.headline)}
        </h1>

        {/* Elevator pitch */}
        <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto mb-10">
          {profile.bioShort}
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
          >
            <span>View Featured Work</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            <span>Get in Touch</span>
          </a>

          {profile.resumeAssetUrl && (
            <a
              href={profile.resumeAssetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm font-medium transition-colors hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span>Resume</span>
            </a>
          )}
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 text-neutral-500 dark:text-neutral-400">
          {profile.socialLinks.github && (
            <a
              href={profile.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
          )}
          {profile.socialLinks.linkedin && (
            <a
              href={profile.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
          )}
          {profile.socialLinks.twitter && (
            <a
              href={profile.socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              aria-label="Twitter Profile"
            >
              <TwitterIcon className="w-5 h-5" />
            </a>
          )}
          {profile.socialLinks.email && (
            <a
              href={`mailto:${profile.socialLinks.email}`}
              className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              aria-label="Direct Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* Quick Highlights Grid */}
        {profile.highlights && profile.highlights.length > 0 && (
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            {profile.highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40 group"
              >
                <HighlightIcon
                  name={item.icon}
                  className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="text-xl font-bold text-neutral-900 dark:text-white">
                  {item.title}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {item.subtitle}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
