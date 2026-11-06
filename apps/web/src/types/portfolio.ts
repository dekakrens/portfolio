export interface SocialLinks {
  github?: string;
  linkedin?: string;
  email?: string;
  twitter?: string;
}

export interface ProfileHighlight {
  icon?: string;
  title: string;
  subtitle: string;
}

export interface Profile {
  id?: string;
  fullName: string;
  headline: string;
  bioShort: string;
  bioLong?: string;
  availabilityBadge: string;
  resumeAssetUrl?: string;
  socialLinks: SocialLinks;
  highlights?: ProfileHighlight[];
}

export interface Skill {
  name: string;
  iconSlug?: string;
  isFeatured?: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

export interface ProjectCaseStudy {
  overview?: string;
  architecture?: string;
  challenges?: string;
  keyFeatures?: string[];
  results?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  thumbnailUrl?: string;
  liveDemoUrl?: string;
  repoUrl?: string;
  isFeatured: boolean;
  techStack: string[];
  caseStudy?: ProjectCaseStudy;
}

export interface WorkExperience {
  id?: string;
  companyName: string;
  companyUrl?: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  highlights: string[];
}

export interface Testimonial {
  id?: string;
  authorName: string;
  authorTitle: string;
  company?: string;
  content: string;
  avatarUrl?: string;
  linkedinUrl?: string;
}
