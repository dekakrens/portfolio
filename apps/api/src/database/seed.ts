import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/portfolio_db';

async function seed() {
  console.log('🌱 Seeding database...');
  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  // 1. Profile
  console.log('👤 Seeding profile...');
  await db.delete(schema.profiles);
  await db.insert(schema.profiles).values({
    fullName: 'Deka Krens',
    headline: 'Senior Full-Stack & IoT Systems Engineer',
    bioShort:
      'Building performant, resilient web applications and edge-connected IoT devices. Specializing in Next.js, NestJS, high-throughput microservices, and embedded computer vision systems.',
    bioLong:
      'With over 6+ years of engineering across web, mobile, and hardware domains, I turn complex technical challenges into elegant, resilient products. From architecting distributed cloud backends to running real-time OCR algorithms on ESP32 microcontrollers, I enjoy building software that bridges the physical and digital worlds.',
    availabilityBadge: 'Open for Select Contracts & Full-Time Roles',
    resumeAssetUrl: '/assets/resume.pdf',
    socialLinks: {
      github: 'https://github.com/dekakrens',
      linkedin: 'https://linkedin.com/in/dekakrens',
      email: 'dekakrens@gmail.com',
      twitter: 'https://twitter.com/dekakrens',
    },
  });

  // 2. Skill Categories & Skills
  console.log('🛠️ Seeding skills...');
  await db.delete(schema.skills);
  await db.delete(schema.skillCategories);

  const [catFrontend] = await db
    .insert(schema.skillCategories)
    .values({ name: 'Frontend Architecture', displayOrder: 1 })
    .returning();

  const [catBackend] = await db
    .insert(schema.skillCategories)
    .values({ name: 'Backend & Cloud Systems', displayOrder: 2 })
    .returning();

  const [catIoT] = await db
    .insert(schema.skillCategories)
    .values({ name: 'Embedded & IoT Systems', displayOrder: 3 })
    .returning();

  const [catDevOps] = await db
    .insert(schema.skillCategories)
    .values({ name: 'DevOps & Tooling', displayOrder: 4 })
    .returning();

  // Skills
  const insertedSkills = await db
    .insert(schema.skills)
    .values([
      // Frontend
      { categoryId: catFrontend.id, name: 'Next.js 15 (App Router)', iconSlug: 'nextjs', displayOrder: 1 },
      { categoryId: catFrontend.id, name: 'React 19 / TypeScript', iconSlug: 'react', displayOrder: 2 },
      { categoryId: catFrontend.id, name: 'Tailwind CSS', iconSlug: 'tailwind', displayOrder: 3 },
      { categoryId: catFrontend.id, name: 'State Management (Zustand/Redux)', iconSlug: 'redux', displayOrder: 4 },

      // Backend
      { categoryId: catBackend.id, name: 'NestJS (Node.js)', iconSlug: 'nestjs', displayOrder: 1 },
      { categoryId: catBackend.id, name: 'PostgreSQL & Drizzle ORM', iconSlug: 'postgresql', displayOrder: 2 },
      { categoryId: catBackend.id, name: 'Python (FastAPI / OpenCV)', iconSlug: 'python', displayOrder: 3 },
      { categoryId: catBackend.id, name: 'REST & GraphQL APIs', iconSlug: 'api', displayOrder: 4 },

      // IoT
      { categoryId: catIoT.id, name: 'ESP32 / ESP32-CAM', iconSlug: 'cpu', displayOrder: 1 },
      { categoryId: catIoT.id, name: 'C++ / PlatformIO', iconSlug: 'cplusplus', displayOrder: 2 },
      { categoryId: catIoT.id, name: 'Computer Vision & OCR', iconSlug: 'eye', displayOrder: 3 },
      { categoryId: catIoT.id, name: 'MQTT / LoRaWAN', iconSlug: 'radio', displayOrder: 4 },

      // DevOps
      { categoryId: catDevOps.id, name: 'Docker & Docker Compose', iconSlug: 'docker', displayOrder: 1 },
      { categoryId: catDevOps.id, name: 'CI/CD Pipelines (GitHub Actions)', iconSlug: 'github', displayOrder: 2 },
      { categoryId: catDevOps.id, name: 'Linux System Administration', iconSlug: 'linux', displayOrder: 3 },
    ])
    .returning();

  const skillMap = new Map(insertedSkills.map((s) => [s.name, s.id]));

  // 3. Projects
  console.log('🚀 Seeding projects & case studies...');
  await db.delete(schema.projectCaseStudies);
  await db.delete(schema.projectTechStacks);
  await db.delete(schema.projects);

  const [p1] = await db
    .insert(schema.projects)
    .values({
      title: 'AI Smart Water Meter with Edge OCR',
      slug: 'ai-smart-water-meter',
      summary:
        'An IoT water utility monitoring solution utilizing ESP32-CAM and a Python/OpenCV computer vision pipeline to digitize mechanical water meters into real-time Home Assistant telemetry and WhatsApp alerts.',
      category: 'IoT & Edge AI',
      thumbnailUrl: '/projects/water-meter.jpg',
      liveDemoUrl: 'https://dekakrens.com/projects/ai-smart-water-meter',
      repoUrl: 'https://github.com/dekakrens/water-meter',
      isFeatured: true,
      displayOrder: 1,
    })
    .returning();

  const [p2] = await db
    .insert(schema.projects)
    .values({
      title: 'Enterprise Inventory & Analytics Portal',
      slug: 'enterprise-inventory-portal',
      summary:
        'A multi-tenant hotel room inventory and asset tracking platform with sub-second analytics, role-based access control (RBAC), and automated multi-lingual exports.',
      category: 'Full-Stack Web',
      thumbnailUrl: '/projects/inventory.jpg',
      liveDemoUrl: 'https://dekakrens.com/projects/enterprise-inventory-portal',
      repoUrl: 'https://github.com/dekakrens/hotel-inventory',
      isFeatured: true,
      displayOrder: 2,
    })
    .returning();

  const [p3] = await db
    .insert(schema.projects)
    .values({
      title: 'LoRaWAN Long-Range Antenna Tuning Suite',
      slug: 'lorawan-antenna-tuning',
      summary:
        'Hardware and software suite for analyzing RF signal attenuation, VSWR measurement, and impedance matching across 915MHz and 868MHz IoT sensor networks.',
      category: 'Hardware & RF',
      thumbnailUrl: '/projects/lora.jpg',
      liveDemoUrl: 'https://dekakrens.com/projects/lorawan-antenna-tuning',
      repoUrl: 'https://github.com/dekakrens/lora-tuning',
      isFeatured: true,
      displayOrder: 3,
    })
    .returning();

  // Attach tech stacks
  const p1Skills = ['ESP32 / ESP32-CAM', 'C++ / PlatformIO', 'Python (FastAPI / OpenCV)', 'Docker & Docker Compose']
    .map((name) => skillMap.get(name))
    .filter(Boolean) as string[];

  for (const sId of p1Skills) {
    await db.insert(schema.projectTechStacks).values({ projectId: p1.id, skillId: sId });
  }

  const p2Skills = ['Next.js 15 (App Router)', 'NestJS (Node.js)', 'PostgreSQL & Drizzle ORM', 'Tailwind CSS']
    .map((name) => skillMap.get(name))
    .filter(Boolean) as string[];

  for (const sId of p2Skills) {
    await db.insert(schema.projectTechStacks).values({ projectId: p2.id, skillId: sId });
  }

  // Case Studies
  await db.insert(schema.projectCaseStudies).values({
    projectId: p1.id,
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
  });

  // 4. Work Experience
  console.log('💼 Seeding work experience...');
  await db.delete(schema.workExperiences);
  await db.insert(schema.workExperiences).values([
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
      displayOrder: 1,
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
      displayOrder: 2,
    },
  ]);

  // 5. Testimonials
  console.log('⭐ Seeding testimonials...');
  await db.delete(schema.testimonials);
  await db.insert(schema.testimonials).values([
    {
      authorName: 'Alex Pratama',
      authorTitle: 'VP of Technology',
      company: 'OmniVentures',
      content:
        'Deka is one of the rare engineers who can seamlessly traverse the entire stack—from low-level C++ firmware on microcontrollers up to modern React and distributed Node.js architectures. His dedication to clean code and reliability is world-class.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      linkedinUrl: 'https://linkedin.com',
      displayOrder: 1,
    },
    {
      authorName: 'Sarah Jenkins',
      authorTitle: 'Head of Product',
      company: 'IoT Nexus',
      content:
        'Working with Deka was a breeze. He delivered our smart sensor monitoring portal ahead of schedule with immaculate attention to detail, comprehensive API documentation, and exceptional UX.',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      linkedinUrl: 'https://linkedin.com',
      displayOrder: 2,
    },
  ]);

  console.log('✅ Seeding completed successfully!');
  await client.end();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
