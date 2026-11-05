import {
  Profile,
  SkillCategory,
  Project,
  WorkExperience,
  Testimonial,
} from '@/types/portfolio';

const API_BASE_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000/api/v1';

async function fetchWithFallback<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
      next: { revalidate: 60, tags: [endpoint.replace('/', '')] },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[API] Endpoint ${endpoint} returned status ${res.status}. Using fallback.`);
      return fallback;
    }
    return (await res.json()) as T;
  } catch (error: any) {
    // Graceful fallback for offline dev, initial builds, or when API is spinning up
    return fallback;
  }
}

// -----------------------------------------------------------------------------
// Fallback Mock Data (mirrors Drizzle DB seeds)
// -----------------------------------------------------------------------------
export const FALLBACK_PROFILE: Profile = {
  fullName: 'Deny Kurniawan',
  headline: 'Senior Full-Stack & IoT Systems Engineer',
  bioShort:
    'Building performant, resilient web applications and edge-connected IoT devices. Specializing in Next.js, NestJS, high-throughput microservices, and embedded computer vision systems.',
  bioLong:
    'With over 6+ years of engineering across web, mobile, and hardware domains, I turn complex technical challenges into elegant, resilient products. From architecting distributed cloud backends to running real-time OCR algorithms on ESP32 microcontrollers, I enjoy building software that bridges the physical and digital worlds.',
  availabilityBadge: 'Open for Select Contracts & Full-Time Roles',
  resumeAssetUrl: '/resume.pdf',
  socialLinks: {
    github: 'https://github.com/dekakrens',
    linkedin: 'https://linkedin.com/in/dekakrens',
    email: 'dekakrens@gmail.com',
    twitter: 'https://twitter.com/dekakrens',
  },
};

export const FALLBACK_SKILLS: SkillCategory[] = [
  {
    id: '1',
    name: 'Frontend Architecture',
    skills: [
      { name: 'Next.js 15 (App Router)', isFeatured: true },
      { name: 'React 19 / TypeScript', isFeatured: true },
      { name: 'Tailwind CSS v4', isFeatured: true },
      { name: 'State Management (Zustand/Redux)', isFeatured: true },
    ],
  },
  {
    id: '2',
    name: 'Backend & Cloud Systems',
    skills: [
      { name: 'NestJS (Node.js)', isFeatured: true },
      { name: 'PostgreSQL & Drizzle ORM', isFeatured: true },
      { name: 'Python (FastAPI / OpenCV)', isFeatured: true },
      { name: 'REST & GraphQL APIs', isFeatured: true },
    ],
  },
  {
    id: '3',
    name: 'Embedded & IoT Systems',
    skills: [
      { name: 'ESP32 / ESP32-CAM', isFeatured: true },
      { name: 'C++ / PlatformIO', isFeatured: true },
      { name: 'Computer Vision & OCR', isFeatured: true },
      { name: 'MQTT / LoRaWAN', isFeatured: true },
    ],
  },
  {
    id: '4',
    name: 'DevOps & Tooling',
    skills: [
      { name: 'Docker & Docker Compose', isFeatured: true },
      { name: 'CI/CD Pipelines (GitHub Actions)', isFeatured: true },
      { name: 'Linux System Administration', isFeatured: true },
    ],
  },
];

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'AI Smart Water Meter with Edge OCR',
    slug: 'ai-smart-water-meter',
    summary:
      'An IoT water utility monitoring solution utilizing ESP32-CAM and a Python/OpenCV computer vision pipeline to digitize mechanical water meters into real-time Home Assistant telemetry and WhatsApp alerts.',
    category: 'IoT & Edge AI',
    thumbnailUrl: '/projects/water-meter.jpg',
    liveDemoUrl: 'https://dekakrens.com/projects/ai-smart-water-meter',
    repoUrl: 'https://github.com/dekakrens/water-meter',
    isFeatured: true,
    techStack: ['ESP32 / ESP32-CAM', 'C++ / PlatformIO', 'Python (FastAPI / OpenCV)', 'Docker & Docker Compose'],
    caseStudy: {
      overview:
        'Mechanical water meters are difficult and tedious to read manually. This project created an autonomous battery-efficient camera attachment that wakes up, illuminates the dial with flash, captures high-res images, and streams them for contour isolation and OCR.',
      architecture:
        'ESP32-CAM firmware written in C++ over PlatformIO with deep sleep power management. Backend microservice running FastAPI, OpenCV contour thresholding, and Tesseract OCR with automatic Home Assistant MQTT publish and WuzAPI WhatsApp reporting.',
      challenges:
        'Mitigating lens glare from glass reflections and water droplets on the dial face using adaptive OpenCV thresholding, ROI calibration, and perspective rectification.',
      keyFeatures: [
        'Sub-5 second wake-capture-sleep lifecycle for multi-month battery life',
        'Adaptive ROI contour bounding to isolate individual rolling counter wheels',
        'Seamless bi-directional integration with Home Assistant and WhatsApp API',
        'Onboard calibration web tool for zero-code ROI coordinate tuning',
      ],
      results: 'Achieved 99.2% OCR digit accuracy across 500+ real-world captures in low-light utility enclosures.',
    },
  },
  {
    id: 'p2',
    title: 'Enterprise Inventory & Analytics Portal',
    slug: 'enterprise-inventory-portal',
    summary:
      'A multi-tenant hotel room inventory and asset tracking platform with sub-second analytics, role-based access control (RBAC), and automated multi-lingual exports.',
    category: 'Full-Stack Web',
    thumbnailUrl: '/projects/inventory.jpg',
    liveDemoUrl: 'https://dekakrens.com/projects/enterprise-inventory-portal',
    repoUrl: 'https://github.com/dekakrens/hotel-inventory',
    isFeatured: true,
    techStack: ['Next.js 15 (App Router)', 'NestJS (Node.js)', 'PostgreSQL & Drizzle ORM', 'Tailwind CSS'],
    caseStudy: {
      overview:
        'Hotel operations teams require instant, accurate asset allocation and tracking across dozens of dynamic room tiers.',
      architecture:
        'Next.js 15 frontend utilizing React Server Components for instant page transitions paired with a NestJS backend and indexed PostgreSQL.',
      challenges:
        'Supporting instantaneous dynamic CSV/PDF report generation with multilingual locale strings without locking backend threads.',
      keyFeatures: [
        'Granular Role-Based Access Control (RBAC)',
        'Real-time inventory checkout metrics and alert badges',
        'Multilingual locale support (English & Indonesian)',
      ],
      results: 'Streamlined housekeeping room turnaround time by 30% across multiple properties.',
    },
  },
  {
    id: 'p3',
    title: 'LoRaWAN Long-Range Antenna Tuning Suite',
    slug: 'lorawan-antenna-tuning',
    summary:
      'Hardware and software suite for analyzing RF signal attenuation, VSWR measurement, and impedance matching across 915MHz and 868MHz IoT sensor networks.',
    category: 'Hardware & RF',
    thumbnailUrl: '/projects/lora.jpg',
    liveDemoUrl: 'https://dekakrens.com/projects/lorawan-antenna-tuning',
    repoUrl: 'https://github.com/dekakrens/lora-tuning',
    isFeatured: true,
    techStack: ['Embedded C++', 'LoRaWAN', 'RF Vector Network Analysis', 'Python'],
    caseStudy: {
      overview:
        'Custom hardware diagnostic firmware and PC interface to evaluate antenna impedance curves and optimize transmission range in dense urban foliage.',
      architecture: 'Standalone embedded tester streaming Smith chart data points over USB/Serial to Python visualizer.',
      challenges: 'Compensating for ambient noise and non-standard coax cable losses.',
      keyFeatures: [
        'Frequency sweep from 800MHz to 1000MHz',
        'Automatic Return Loss (RL) and Voltage Standing Wave Ratio (VSWR) calculation',
      ],
      results: 'Improved LoRa node transmission range by over 40% in field testing.',
    },
  },
];

export const FALLBACK_EXPERIENCE: WorkExperience[] = [
  {
    companyName: 'Tech Innovators Co.',
    companyUrl: 'https://example.com',
    role: 'Lead Full-Stack & Systems Engineer',
    location: 'Remote / Jakarta, Indonesia',
    startDate: '2023',
    endDate: 'Present',
    isCurrent: true,
    description:
      'Architecting distributed web services, IoT telemetry ingestion pipelines, and modern web dashboards with strict performance budgets and sub-second SLAs.',
    highlights: [
      'Spearheaded migration of legacy monolith to NestJS microservices and Next.js App Router frontends.',
      'Reduced database query latency by 45% with indexed Drizzle ORM schemas and Redis caching.',
      'Mentored junior engineers and instituted CI/CD test automation practices across engineering teams.',
    ],
  },
  {
    companyName: 'Digital Solutions Lab',
    companyUrl: 'https://example.com',
    role: 'Full-Stack Developer',
    location: 'Denpasar, Bali',
    startDate: '2021',
    endDate: '2023',
    isCurrent: false,
    description:
      'Developed SaaS web portals, responsive mobile applications, and internal automation utilities for client projects.',
    highlights: [
      'Built real-time websocket reporting dashboards handling 10,000+ daily events.',
      'Engineered responsive web applications with automated Lighthouse score optimization > 95.',
    ],
  },
];

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    authorName: 'Alex Pratama',
    authorTitle: 'VP of Technology',
    company: 'OmniVentures',
    content:
      'Deny is one of the rare engineers who can seamlessly traverse the entire stack—from low-level C++ firmware on microcontrollers up to modern React and distributed Node.js architectures. His dedication to clean code and reliability is world-class.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    linkedinUrl: 'https://linkedin.com',
  },
  {
    authorName: 'Sarah Jenkins',
    authorTitle: 'Head of Product',
    company: 'IoT Nexus',
    content:
      'Working with Deny was a breeze. He delivered our smart sensor monitoring portal ahead of schedule with immaculate attention to detail, comprehensive API documentation, and exceptional UX.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    linkedinUrl: 'https://linkedin.com',
  },
];

// -----------------------------------------------------------------------------
// API Fetchers
// -----------------------------------------------------------------------------
export async function getProfile(): Promise<Profile> {
  return fetchWithFallback<Profile>('/profile', FALLBACK_PROFILE);
}

export async function getSkills(): Promise<SkillCategory[]> {
  return fetchWithFallback<SkillCategory[]>('/skills', FALLBACK_SKILLS);
}

export async function getProjects(): Promise<Project[]> {
  return fetchWithFallback<Project[]>('/projects', FALLBACK_PROJECTS);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const allProjects = await getProjects();
  const direct = await fetchWithFallback<Project | null>(`/projects/${slug}`, null);
  if (direct) return direct;
  return allProjects.find((p) => p.slug === slug) || null;
}

export async function getExperience(): Promise<WorkExperience[]> {
  return fetchWithFallback<WorkExperience[]>('/experience', FALLBACK_EXPERIENCE);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return fetchWithFallback<Testimonial[]>('/testimonials', FALLBACK_TESTIMONIALS);
}
