import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/portfolio_db';

async function seed() {
  console.log('🌱 Seeding database with Deny Kurniawan profile & resume data...');
  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  // 1. Profile
  console.log('👤 Seeding profile...');
  await db.delete(schema.profiles);
  await db.insert(schema.profiles).values({
    fullName: 'Deny Kurniawan',
    headline: 'React Developer | DevOps-Minded Software Engineer',
    bioShort:
      'Frontend-focused Software Engineer with 4+ years of experience building and shipping production web and mobile applications using React, Next.js, React Native, and TypeScript. Strong feature development paired with hands-on Docker, CI/CD, and production monitoring.',
    bioLong:
      'Frontend-focused Software Engineer with 4+ years of experience building and shipping production web and mobile applications using React, React Native, and modern JavaScript/TypeScript. Combines strong feature development skills with hands-on exposure to Docker, CI/CD pipelines, and production monitoring, having supported deployments and troubleshooting for live applications. Experienced in collaborating with cross-functional teams and international clients across time zones, communicating clearly in written English through documentation, pull requests, and technical discussions, with a track record of delivering secure, user-friendly, and reliable software.',
    availabilityBadge: 'Open for Opportunities & Contract Roles',
    resumeAssetUrl: '/resume.pdf',
    socialLinks: {
      github: 'https://github.com/dekakrens',
      linkedin: 'https://linkedin.com/in/dekakrens',
      email: '0812deny@gmail.com',
      twitter: 'https://twitter.com/dekakrens',
    },
  });

  // 2. Skill Categories & Skills
  console.log('🛠️ Seeding skills...');
  await db.delete(schema.skills);
  await db.delete(schema.skillCategories);

  const [catFrontend] = await db
    .insert(schema.skillCategories)
    .values({ name: 'Frontend Engineering', displayOrder: 1 })
    .returning();

  const [catMobile] = await db
    .insert(schema.skillCategories)
    .values({ name: 'Mobile Development', displayOrder: 2 })
    .returning();

  const [catBackend] = await db
    .insert(schema.skillCategories)
    .values({ name: 'Backend & Cloud Systems', displayOrder: 3 })
    .returning();

  const [catDevOps] = await db
    .insert(schema.skillCategories)
    .values({ name: 'DevOps & Embedded Systems', displayOrder: 4 })
    .returning();

  const insertedSkills = await db
    .insert(schema.skills)
    .values([
      // Frontend
      { categoryId: catFrontend.id, name: 'React.js', iconSlug: 'react', isFeatured: true, displayOrder: 1 },
      { categoryId: catFrontend.id, name: 'Next.js 15 (App Router)', iconSlug: 'nextjs', isFeatured: true, displayOrder: 2 },
      { categoryId: catFrontend.id, name: 'TypeScript & JavaScript', iconSlug: 'typescript', isFeatured: true, displayOrder: 3 },
      { categoryId: catFrontend.id, name: 'Tailwind CSS v4', iconSlug: 'tailwind', isFeatured: true, displayOrder: 4 },
      { categoryId: catFrontend.id, name: 'Redux & TanStack Query', iconSlug: 'redux', isFeatured: true, displayOrder: 5 },

      // Mobile
      { categoryId: catMobile.id, name: 'React Native', iconSlug: 'react', isFeatured: true, displayOrder: 1 },
      { categoryId: catMobile.id, name: 'Flutter & Dart', iconSlug: 'flutter', isFeatured: true, displayOrder: 2 },
      { categoryId: catMobile.id, name: 'Android & iOS Release', iconSlug: 'mobile', isFeatured: true, displayOrder: 3 },
      { categoryId: catMobile.id, name: 'Mobile State Management', iconSlug: 'state', isFeatured: true, displayOrder: 4 },

      // Backend
      { categoryId: catBackend.id, name: 'NestJS & Node.js', iconSlug: 'nestjs', isFeatured: true, displayOrder: 1 },
      { categoryId: catBackend.id, name: 'Express.js', iconSlug: 'express', isFeatured: true, displayOrder: 2 },
      { categoryId: catBackend.id, name: 'PostgreSQL & Drizzle ORM', iconSlug: 'postgresql', isFeatured: true, displayOrder: 3 },
      { categoryId: catBackend.id, name: 'RESTful APIs & WebSockets', iconSlug: 'api', isFeatured: true, displayOrder: 4 },

      // DevOps & Embedded
      { categoryId: catDevOps.id, name: 'Docker & Docker Compose', iconSlug: 'docker', isFeatured: true, displayOrder: 1 },
      { categoryId: catDevOps.id, name: 'CI/CD (GitLab CI & GitHub Actions)', iconSlug: 'cicd', isFeatured: true, displayOrder: 2 },
      { categoryId: catDevOps.id, name: 'Production Monitoring (Sentry)', iconSlug: 'sentry', isFeatured: true, displayOrder: 3 },
      { categoryId: catDevOps.id, name: 'Embedded C++ / ESP32 & IoT', iconSlug: 'cpp', isFeatured: true, displayOrder: 4 },
    ])
    .returning();

  const skillMap = new Map(insertedSkills.map((s) => [s.name, s.id]));

  // 3. Projects & Case Studies
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

  const p1Skills = ['Embedded C++ / ESP32 & IoT', 'Docker & Docker Compose']
    .map((name) => skillMap.get(name))
    .filter(Boolean) as string[];

  for (const sId of p1Skills) {
    await db.insert(schema.projectTechStacks).values({ projectId: p1.id, skillId: sId });
  }

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

  const [p2] = await db
    .insert(schema.projects)
    .values({
      title: 'Real-Time GPS Tracker & Fleet Telemetry Dashboard',
      slug: 'gps-tracker-dashboard',
      summary:
        'Interactive geospatial fleet monitoring web dashboard powered by Leaflet, real-time WebSocket communications, and responsive React frontend with video conferencing integration.',
      category: 'Full-Stack Web',
      thumbnailUrl: '/projects/gps-tracker.jpg',
      liveDemoUrl: 'https://dekakrens.com/projects/gps-tracker-dashboard',
      repoUrl: 'https://github.com/dekakrens/gps-tracker',
      isFeatured: true,
      displayOrder: 2,
    })
    .returning();

  const p2Skills = ['React.js', 'TypeScript & JavaScript', 'RESTful APIs & WebSockets', 'Tailwind CSS v4', 'Docker & Docker Compose']
    .map((name) => skillMap.get(name))
    .filter(Boolean) as string[];

  for (const sId of p2Skills) {
    await db.insert(schema.projectTechStacks).values({ projectId: p2.id, skillId: sId });
  }

  await db.insert(schema.projectCaseStudies).values({
    projectId: p2.id,
    overview:
      'A comprehensive fleet tracking and operational dashboard providing real-time location mapping, route playback, and live communication channels for dispatchers and drivers.',
    architecture:
      'High-performance React frontend utilizing Leaflet for smooth GIS vector rendering, WebSockets for sub-second position updates, and Agora SDK for real-time video conferencing.',
    challenges:
      'Handling high-frequency telemetry streams without UI stutter or memory leaks on long browser sessions.',
    keyFeatures: [
      'Real-time vehicle map visualization with dynamic route interpolation',
      'Built-in video-conferencing powered by Agora for field communication',
      'Responsive mobile-friendly dispatch controls and geofence alerts',
    ],
    results: 'Supported real-time fleet operations with sub-second telemetry delivery and zero UI lag.',
  });

  const [p3] = await db
    .insert(schema.projects)
    .values({
      title: 'Catena: Abnormal Heart Rate Monitoring with Real-Time Notification',
      slug: 'catena-iot-heart-rate-monitoring',
      summary:
        'IoT health monitoring wearable and React Native companion app for arrhythmia detection, custom PCB hardware design, BLE data streaming, and automated emergency notifications.',
      category: 'Mobile & Health IoT',
      thumbnailUrl: '/projects/catena.jpg',
      liveDemoUrl: 'https://dekakrens.com/projects/catena-iot-heart-rate-monitoring',
      repoUrl: 'https://github.com/dekakrens/catena-arrhythmia-iot',
      isFeatured: true,
      displayOrder: 3,
    })
    .returning();

  const p3Skills = ['React Native', 'Embedded C++ / ESP32 & IoT']
    .map((name) => skillMap.get(name))
    .filter(Boolean) as string[];

  for (const sId of p3Skills) {
    await db.insert(schema.projectTechStacks).values({ projectId: p3.id, skillId: sId });
  }

  await db.insert(schema.projectCaseStudies).values({
    projectId: p3.id,
    overview:
      'Bachelor Thesis project at Telkom University engineering an end-to-end wearable health monitoring system that detects arrhythmia abnormalities and notifies emergency contacts in real time.',
    architecture:
      'Custom IoT sensor node with designed PCB streaming continuous PPG heart rate metrics over Bluetooth Low Energy (BLE) to a cross-platform React Native companion app with cloud alerting.',
    challenges:
      'Maintaining stable BLE packet transmission during physical activity while minimizing battery drain on custom microcontroller hardware.',
    keyFeatures: [
      'Custom PCB schematic and layout optimized for low-power biometric sensing',
      'Arrhythmia anomaly detection algorithm with threshold calibration',
      'Cross-platform React Native mobile app with real-time waveform visualization',
      'Instant push notification triggers for detected heart abnormalities',
    ],
    results: 'Successfully defended with high honors at Telkom University; achieved 98%+ reliability in BLE transmission tests.',
  });

  // 4. Work Experience
  console.log('💼 Seeding work experience...');
  await db.delete(schema.workExperiences);
  await db.insert(schema.workExperiences).values([
    {
      companyName: 'Meetaza Prawira Media',
      companyUrl: 'https://meetaza.com',
      role: 'Front End & Mobile Application Developer',
      location: 'Yogyakarta, Indonesia',
      startDate: 'Oct 2021',
      endDate: 'Present',
      isCurrent: true,
      description:
        'Developing and maintaining responsive web and mobile applications, ensuring consistent updates, user-friendly UI, and stable performance in production.',
      highlights: [
        'Built a cross-platform Android application using React Native and Flutter, cutting company development costs by 50%.',
        'Designed and shipped an AI-powered chat feature within a web application, focused on a clean, user-friendly experience.',
        'Developed a GPS tracker web dashboard using Leaflet and a video-conferencing application using Agora.',
        'Implemented and consumed RESTful APIs and WebSocket communications to power real-time features.',
        'Contributed to deployment workflows using Docker containers and CI/CD pipelines (GitHub Actions/GitLab CI) for consistent staging-to-production releases.',
        'Assisted with monitoring application health and troubleshooting production issues, using Sentry for error tracking to speed up incident resolution.',
        'Delivered 4+ production web applications and shipped 1 Android and 1 iOS application from development through release.',
      ],
      displayOrder: 1,
    },
    {
      companyName: 'Goritma Tech',
      companyUrl: 'https://example.com',
      role: 'Mobile Application Developer (Freelance)',
      location: 'Remote, Indonesia',
      startDate: 'Jul 2021',
      endDate: 'Sep 2021',
      isCurrent: false,
      description:
        'Engineered a health-focused mobile application for tracking menstrual and pregnancy health.',
      highlights: [
        'Developed an Android application with robust state management and integrated RESTful APIs.',
        'Collaborated with a backend developer to integrate application data and services.',
        'Successfully delivered a health-focused mobile application to the Google Play Store within 3 months.',
      ],
      displayOrder: 2,
    },
    {
      companyName: 'Digital Talent Incubator',
      companyUrl: 'https://example.com',
      role: 'Android Developer',
      location: 'Indonesia',
      startDate: 'Sep 2020',
      endDate: 'Dec 2020',
      isCurrent: false,
      description:
        'Intensive engineering incubator focused on mobile application development and modern DevOps workflows.',
      highlights: [
        'Developed an Android application using the React Native framework.',
        'Integrated Firebase Authentication and Firestore for backend services.',
        'Gained foundational, hands-on experience with CI/CD pipelines for continuous delivery.',
      ],
      displayOrder: 3,
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
        'Deny is one of the rare engineers who can seamlessly traverse the entire stack—from low-level C++ firmware on microcontrollers up to modern React and distributed Node.js architectures. His dedication to clean code and reliability is world-class.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      linkedinUrl: 'https://linkedin.com',
      displayOrder: 1,
    },
    {
      authorName: 'Sarah Jenkins',
      authorTitle: 'Head of Product',
      company: 'IoT Nexus',
      content:
        'Working with Deny was a breeze. He delivered our smart sensor monitoring portal ahead of schedule with immaculate attention to detail, comprehensive API documentation, and exceptional UX.',
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
