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

  // 6. Wiki / Digital Garden
  console.log('🌿 Seeding digital garden wiki...');
  await db.delete(schema.wikiArticles);
  await db.delete(schema.wikiCategories);

  const [wcDevOps] = await db
    .insert(schema.wikiCategories)
    .values({ name: 'DevOps & Systems', slug: 'devops-and-systems', displayOrder: 1 })
    .returning();

  const [wcFrontend] = await db
    .insert(schema.wikiCategories)
    .values({ name: 'Frontend Engineering', slug: 'frontend-engineering', displayOrder: 2 })
    .returning();

  const [wcIoT] = await db
    .insert(schema.wikiCategories)
    .values({ name: 'IoT & Embedded Systems', slug: 'iot-and-embedded-systems', displayOrder: 3 })
    .returning();

  const [wcCloud] = await db
    .insert(schema.wikiCategories)
    .values({ name: 'Architecture & Cloud', slug: 'architecture-and-cloud', displayOrder: 4 })
    .returning();

  await db.insert(schema.wikiArticles).values([
    {
      categoryId: wcDevOps.id,
      title: 'Deploying Next.js 15 Standalone Containers on ARM64 Raspberry Pi',
      slug: 'deploying-nextjs-arm64-raspberry-pi',
      summary:
        'A practical guide to multi-stage Docker builds, memory tuning for 8GB Raspberry Pi, standalone output optimization, and routing through Cloudflare Zero Trust Tunnels.',
      readingTimeMinutes: 6,
      status: 'published',
      publishedAt: new Date('2026-11-01T10:00:00Z'),
      content: `# Deploying Next.js 15 Standalone Containers on ARM64 Raspberry Pi

Hosting modern Next.js 15 (App Router) workloads on edge hardware like an 8GB Raspberry Pi 4 or 5 offers a cost-effective, self-hosted, and ultra-reliable private server setup.

## Why output: "standalone"?

By default, \`next build\` produces a directory that requires the entire \`node_modules\` directory to execute \`next start\`. This can easily blow up Docker container sizes to over **1.2 GB**.

With Next.js Standalone mode:
\`\`\`typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
\`\`\`

Next.js traces all imported node modules and outputs an isolated, self-contained server at \`.next/standalone/server.js\` requiring only ~120 MB container footprint!

---

## Multi-Stage Dockerfile for ARM64

Here is the exact multi-stage Dockerfile used to build for Debian ARM64 on the Raspberry Pi:

\`\`\`dockerfile
FROM node:22-alpine AS base
RUN npm install -g pnpm@11.25.0

FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/package.json
RUN pnpm install --frozen-lockfile --filter web...

COPY apps/web ./apps/web
RUN pnpm --filter web build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
\`\`\`

---

## Routing via Cloudflare Zero Trust Tunnels

Instead of exposing dangerous port-forwarding on your home router, running \`cloudflared\` allows seamless TLS termination and DDoS mitigation:

1. Create a Tunnel in Cloudflare Zero Trust dashboard.
2. Route Public Hostname: \`dekakrens.com\` -> \`http://127.0.0.1:8230\`
3. Route Public Hostname: \`wiki.dekakrens.com\` -> \`http://127.0.0.1:8232\`
4. Traffic is routed securely through Cloudflare's global edge network without open inbound firewall ports.
`,
    },
    {
      categoryId: wcFrontend.id,
      title: 'High-Frequency Telemetry & Geospatial Mapping with Leaflet & WebSockets',
      slug: 'high-frequency-telemetry-leaflet-websockets',
      summary:
        'Architectural patterns for visualizing real-time fleet GPS coordinates in React without memory leaks or UI frame drops.',
      readingTimeMinutes: 7,
      status: 'published',
      publishedAt: new Date('2026-10-25T14:30:00Z'),
      content: `# High-Frequency Telemetry & Geospatial Mapping with Leaflet & WebSockets

Rendering live vehicular fleets or IoT nodes streaming at 10-50 Hz poses unique front-end challenges. If not managed properly, React component re-renders will block the main thread and cause visible map stuttering.

## The Problem: Naive React State Re-renders

If every incoming WebSocket packet updates a React \`useState\`:

\`\`\`typescript
// ❌ Avoid doing this at 50Hz:
socket.on('telemetry', (point) => {
  setVehicles((prev) => ({ ...prev, [point.id]: point }));
});
\`\`\`

React will trigger virtual DOM reconciliation for dozens of map markers multiple times per second, dropping frames to sub-30 FPS.

## The Solution: Leaflet Ref-Based Direct Mutation

Keep map markers outside React's render loop by maintaining a dictionary of native Leaflet \`L.Marker\` instances in a \`useRef\`:

\`\`\`typescript
const markersRef = useRef<Map<string, L.Marker>>(new Map());

useEffect(() => {
  const ws = new WebSocket(TELEMETRY_STREAM_URL);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const existingMarker = markersRef.current.get(data.id);

    if (existingMarker) {
      // Direct smooth coordinate update without React reconciliation
      existingMarker.setLatLng([data.lat, data.lng]);
    } else {
      const newMarker = L.marker([data.lat, data.lng], {
        icon: customVehicleIcon,
      }).addTo(mapInstance);
      markersRef.current.set(data.id, newMarker);
    }
  };

  return () => ws.close();
}, []);
\`\`\`
`,
    },
    {
      categoryId: wcIoT.id,
      title: 'BLE Health Telemetry: ESP32 Wearable Arrhythmia Detection with React Native',
      slug: 'ble-health-telemetry-esp32-react-native',
      summary:
        'Designing an end-to-end biomedical IoT system: BLE GATT characteristics, PPG noise filtering, battery optimization, and real-time mobile alerting.',
      readingTimeMinutes: 8,
      status: 'published',
      publishedAt: new Date('2026-10-18T09:00:00Z'),
      content: `# BLE Health Telemetry: ESP32 Wearable Arrhythmia Detection with React Native

This article covers the engineering principles developed during my Bachelor Thesis at Telkom University (*Catena: Abnormal Heart Rate Monitoring With Real-Time Notification*).

## BLE GATT Architecture

Bluetooth Low Energy relies on the **Generic Attribute Profile (GATT)** hierarchy:

- **Service:** Heart Rate Service (\`0x180D\`)
- **Characteristic:** Heart Rate Measurement (\`0x2A37\`)
- **Properties:** \`NOTIFY\` (allows the microcontroller to push packets without mobile polling)

### Microcontroller Firmware (C++ PlatformIO)

\`\`\`cpp
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define HEART_RATE_SERVICE_UUID "0000180d-0000-1000-8000-00805f9b34fb"
#define HEART_RATE_CHAR_UUID    "00002a37-0000-1000-8000-00805f9b34fb"

BLECharacteristic *pCharacteristic;

void setupBLE() {
  BLEDevice::init("Catena Health Band");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(HEART_RATE_SERVICE_UUID);

  pCharacteristic = pService->createCharacteristic(
    HEART_RATE_CHAR_UUID,
    BLECharacteristic::PROPERTY_NOTIFY
  );

  pCharacteristic->addDescriptor(new BLE2902());
  pService->start();
  pServer->getAdvertising()->start();
}
\`\`\`

---

## Real-Time Mobile Visualization in React Native

Using \`react-native-ble-plx\`, we subscribe to notifications and stream BPM readings to an SVG waveform:

\`\`\`typescript
device.monitorCharacteristicForService(
  HEART_RATE_SERVICE_UUID,
  HEART_RATE_CHAR_UUID,
  (error, characteristic) => {
    if (error) return console.error(error);
    const rawData = Buffer.from(characteristic.value, 'base64');
    const bpm = rawData.readUInt8(1);

    if (bpm > 140 || bpm < 45) {
      triggerEmergencyAlert(bpm);
    }
  }
);
\`\`\`
`,
    },
    {
      categoryId: wcCloud.id,
      title: 'Decoupling Next.js App Router from a Dedicated NestJS API: 100% SEO with Zero Bloat',
      slug: 'decoupling-nextjs-dedicated-nestjs-api',
      summary:
        'How to maintain superior server-side SEO and dynamic Open Graph generation in Next.js while leveraging NestJS and Drizzle ORM for enterprise backend architecture.',
      readingTimeMinutes: 5,
      status: 'published',
      publishedAt: new Date('2026-10-10T11:00:00Z'),
      content: `# Decoupling Next.js App Router from a Dedicated NestJS API: 100% SEO with Zero Bloat

A common question in full-stack architecture is: *Can I build a decoupled NestJS backend with PostgreSQL while maintaining all the search engine advantages of Next.js?*

The answer is **yes, absolutely** — and in fact, it is often superior to putting everything into Next.js Route Handlers.

## How Server Components Preserve 100% SEO

In Next.js 15 App Router, React Server Components (RSC) run strictly on the Node.js server before any HTML reaches the client:

\`\`\`typescript
// apps/web/src/app/projects/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug); // Server-to-server fetch

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
    },
  };
}
\`\`\`

When Googlebot, Bing, or social crawlers request \`/projects/ai-smart-water-meter\`:
1. Next.js fetches data from the NestJS REST API over the private Docker bridge network in < 2ms.
2. Next.js produces fully-rendered HTML with complete \`<meta>\`, OpenGraph, Twitter, and JSON-LD \`<script>\` tags.
3. The crawler receives 100% complete semantic HTML.
`,
    },
  ]);

  // 7. Admin User
  console.log('🔐 Seeding admin user...');
  await db.delete(schema.adminUsers);
  const { scryptSync, randomBytes } = await import('node:crypto');
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(process.env.ADMIN_PASSWORD || 'dekakrens2026!', salt, 64);
  const passwordHash = `${salt}:${derivedKey.toString('hex')}`;

  await db.insert(schema.adminUsers).values({
    email: 'dekakrens@gmail.com',
    passwordHash,
    name: 'Deny Kurniawan',
    role: 'admin',
  });

  console.log('✅ Seeding completed successfully!');
  await client.end();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
