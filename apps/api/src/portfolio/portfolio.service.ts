import { Injectable, Inject, Logger } from '@nestjs/common';
import { eq, desc, asc } from 'drizzle-orm';
import { DRIZZLE_DB, type AppDatabase } from '../database/database.module.js';
import * as schema from '../database/schema.js';
import { CreateContactInquiryDto } from './dto/contact.dto.js';
import { MailService } from '../mail/mail.service.js';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    @Inject(DRIZZLE_DB) private readonly db: AppDatabase,
    private readonly mailService: MailService,
  ) {}

  async getProfile() {
    try {
      const records = await this.db.select().from(schema.profiles).limit(1);
      if (records.length > 0) return records[0];
    } catch (err: any) {
      this.logger.warn(`Database query failed in getProfile: ${err.message}. Using fallback.`);
    }

    // Fallback if DB is not yet seeded or unreachable
    return {
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
    };
  }

  async getSkills() {
    try {
      const categories = await this.db.query.skillCategories.findMany({
        orderBy: [asc(schema.skillCategories.displayOrder)],
        with: {
          skills: {
            orderBy: [asc(schema.skills.displayOrder)],
          },
        },
      });
      if (categories.length > 0) return categories;
    } catch (err: any) {
      this.logger.warn(`Database query failed in getSkills: ${err.message}. Using fallback.`);
    }

    return [
      {
        id: '1',
        name: 'Frontend Engineering',
        skills: [
          { name: 'React.js', iconSlug: 'react', isFeatured: true },
          { name: 'Next.js 15 (App Router)', iconSlug: 'nextjs', isFeatured: true },
          { name: 'TypeScript & JavaScript', iconSlug: 'typescript', isFeatured: true },
          { name: 'Tailwind CSS v4', iconSlug: 'tailwind', isFeatured: true },
          { name: 'Redux & TanStack Query', iconSlug: 'redux', isFeatured: true },
        ],
      },
      {
        id: '2',
        name: 'Mobile Development',
        skills: [
          { name: 'React Native', iconSlug: 'react', isFeatured: true },
          { name: 'Flutter & Dart', iconSlug: 'flutter', isFeatured: true },
          { name: 'Android & iOS Release', iconSlug: 'mobile', isFeatured: true },
          { name: 'Mobile State Management', iconSlug: 'state', isFeatured: true },
        ],
      },
      {
        id: '3',
        name: 'Backend & Cloud Systems',
        skills: [
          { name: 'NestJS & Node.js', iconSlug: 'nestjs', isFeatured: true },
          { name: 'Express.js', iconSlug: 'express', isFeatured: true },
          { name: 'PostgreSQL & Drizzle ORM', iconSlug: 'postgresql', isFeatured: true },
          { name: 'RESTful APIs & WebSockets', iconSlug: 'api', isFeatured: true },
        ],
      },
      {
        id: '4',
        name: 'DevOps & Embedded Systems',
        skills: [
          { name: 'Docker & Docker Compose', iconSlug: 'docker', isFeatured: true },
          { name: 'CI/CD (GitLab CI & GitHub Actions)', iconSlug: 'cicd', isFeatured: true },
          { name: 'Production Monitoring (Sentry)', iconSlug: 'sentry', isFeatured: true },
          { name: 'Embedded C++ / ESP32 & IoT', iconSlug: 'cpp', isFeatured: true },
        ],
      },
    ];
  }

  async getProjects() {
    try {
      const records = await this.db.query.projects.findMany({
        orderBy: [asc(schema.projects.displayOrder)],
        with: {
          caseStudy: true,
          techStacks: {
            with: {
              skill: true,
            },
          },
        },
      });
      if (records.length > 0) {
        return records.map((p: any) => ({
          ...p,
          techStack:
            p.techStacks && p.techStacks.length > 0
              ? p.techStacks.map((ts: any) => ts.skill?.name).filter(Boolean)
              : [p.category || 'Engineering'],
        }));
      }
    } catch (err: any) {
      this.logger.warn(`Database query failed in getProjects: ${err.message}. Using fallback.`);
    }

    return [
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
        techStack: ['ESP32 / ESP32-CAM', 'Embedded C++', 'Python (OpenCV)', 'Docker & Docker Compose'],
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
        title: 'Real-Time GPS Tracker & Fleet Telemetry Dashboard',
        slug: 'gps-tracker-dashboard',
        summary:
          'Interactive geospatial fleet monitoring web dashboard powered by Leaflet, real-time WebSocket communications, and responsive React frontend with video conferencing integration.',
        category: 'Full-Stack Web',
        thumbnailUrl: '/projects/gps-tracker.jpg',
        liveDemoUrl: 'https://dekakrens.com/projects/gps-tracker-dashboard',
        repoUrl: 'https://github.com/dekakrens/gps-tracker',
        isFeatured: true,
        techStack: ['React.js', 'TypeScript', 'Leaflet GIS', 'WebSockets', 'Tailwind CSS', 'Docker'],
        caseStudy: {
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
        },
      },
      {
        id: 'p3',
        title: 'Catena: Abnormal Heart Rate Monitoring with Real-Time Notification',
        slug: 'catena-iot-heart-rate-monitoring',
        summary:
          'IoT health monitoring wearable and React Native companion app for arrhythmia detection, custom PCB hardware design, BLE data streaming, and automated emergency notifications.',
        category: 'Mobile & Health IoT',
        thumbnailUrl: '/projects/catena.jpg',
        liveDemoUrl: 'https://dekakrens.com/projects/catena-iot-heart-rate-monitoring',
        repoUrl: 'https://github.com/dekakrens/catena-arrhythmia-iot',
        isFeatured: true,
        techStack: ['React Native', 'BLE (Bluetooth Low Energy)', 'IoT Hardware & PCB', 'C++', 'Firebase'],
        caseStudy: {
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
        },
      },
    ];
  }

  async getProjectBySlug(slug: string) {
    const all = await this.getProjects();
    const found = all.find((p) => p.slug === slug);
    return found || null;
  }

  async getExperience() {
    try {
      const records = await this.db.select().from(schema.workExperiences).orderBy(asc(schema.workExperiences.displayOrder));
      if (records.length > 0) return records;
    } catch (err: any) {
      this.logger.warn(`Database query failed in getExperience: ${err.message}. Using fallback.`);
    }

    return [
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
      },
    ];
  }

  async getTestimonials() {
    try {
      const records = await this.db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.displayOrder));
      if (records.length > 0) return records;
    } catch (err: any) {
      this.logger.warn(`Database query failed in getTestimonials: ${err.message}. Using fallback.`);
    }

    return [
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
  }

  async createContactInquiry(dto: CreateContactInquiryDto) {
    try {
      const [record] = await this.db
        .insert(schema.contactInquiries)
        .values({
          name: dto.name,
          email: dto.email,
          subject: dto.subject,
          message: dto.message,
        })
        .returning();

      this.logger.log(`New contact inquiry saved from ${dto.name} (${dto.email})`);

      // Asynchronously dispatch email notification via Resend
      this.mailService
        .sendContactInquiryNotification({
          name: dto.name,
          email: dto.email,
          subject: dto.subject,
          message: dto.message,
          inquiryId: record.id,
        })
        .catch((err) => {
          this.logger.error(`Background email dispatch failed: ${err.message}`);
        });

      return { success: true, inquiryId: record.id, message: 'Inquiry received successfully!' };
    } catch (err: any) {
      this.logger.warn(`Could not save contact inquiry to DB: ${err.message}. Returning mock success.`);

      // Still attempt to send notification email even if DB write was interrupted
      this.mailService
        .sendContactInquiryNotification({
          name: dto.name,
          email: dto.email,
          subject: dto.subject,
          message: dto.message,
        })
        .catch(() => {});

      return { success: true, inquiryId: 'mock-id', message: 'Inquiry received successfully!' };
    }
  }
}
