import { getProfile, getProjects, getSkills, getExperience, getTestimonials } from '@/lib/api';
import { HeroSection } from '@/components/hero-section';
import { ProjectsSection } from '@/components/projects-section';
import { SkillsSection } from '@/components/skills-section';
import { ExperienceSection } from '@/components/experience-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { ContactSection } from '@/components/contact-section';

export default async function HomePage() {
  const [profile, projects, skills, experience, testimonials] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
    getExperience(),
    getTestimonials(),
  ]);

  return (
    <div className="flex flex-col">
      <HeroSection profile={profile} />
      <ProjectsSection projects={projects} />
      <SkillsSection categories={skills} />
      <ExperienceSection experiences={experience} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection />
    </div>
  );
}
