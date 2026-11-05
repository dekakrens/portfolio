import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { eq, desc, asc, ilike, or, and } from 'drizzle-orm';
import { DRIZZLE_DB, type AppDatabase } from '../database/database.module.js';
import * as schema from '../database/schema.js';

export const FALLBACK_WIKI_CATEGORIES = [
  {
    id: 'wc1',
    name: 'DevOps & Systems',
    slug: 'devops-and-systems',
    displayOrder: 1,
  },
  {
    id: 'wc2',
    name: 'Frontend Engineering',
    slug: 'frontend-engineering',
    displayOrder: 2,
  },
  {
    id: 'wc3',
    name: 'IoT & Embedded Systems',
    slug: 'iot-and-embedded-systems',
    displayOrder: 3,
  },
  {
    id: 'wc4',
    name: 'Architecture & Cloud',
    slug: 'architecture-and-cloud',
    displayOrder: 4,
  },
];

export const FALLBACK_WIKI_ARTICLES = [
  {
    id: 'wa1',
    title: 'Deploying Next.js 15 Standalone Containers on ARM64 Raspberry Pi',
    slug: 'deploying-nextjs-arm64-raspberry-pi',
    summary:
      'A practical guide to multi-stage Docker builds, memory tuning for 8GB Raspberry Pi, standalone output optimization, and routing through Cloudflare Zero Trust Tunnels.',
    readingTimeMinutes: 6,
    categoryId: 'wc1',
    category: {
      id: 'wc1',
      name: 'DevOps & Systems',
      slug: 'devops-and-systems',
    },
    publishedAt: '2026-11-01T10:00:00Z',
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
    id: 'wa2',
    title: 'High-Frequency Telemetry & Geospatial Mapping with Leaflet & WebSockets',
    slug: 'high-frequency-telemetry-leaflet-websockets',
    summary:
      'Architectural patterns for visualizing real-time fleet GPS coordinates in React without memory leaks or UI frame drops.',
    readingTimeMinutes: 7,
    categoryId: 'wc2',
    category: {
      id: 'wc2',
      name: 'Frontend Engineering',
      slug: 'frontend-engineering',
    },
    publishedAt: '2026-10-25T14:30:00Z',
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

---

## Path Smoothing with Linear Interpolation (LERP)

To prevent markers from "teleporting" when GPS packets arrive intermittently, apply a simple requestAnimationFrame interpolation step:

\`\`\`typescript
function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}
\`\`\`
`,
  },
  {
    id: 'wa3',
    title: 'BLE Health Telemetry: ESP32 Wearable Arrhythmia Detection with React Native',
    slug: 'ble-health-telemetry-esp32-react-native',
    summary:
      'Designing an end-to-end biomedical IoT system: BLE GATT characteristics, PPG noise filtering, battery optimization, and real-time mobile alerting.',
    readingTimeMinutes: 8,
    categoryId: 'wc3',
    category: {
      id: 'wc3',
      name: 'IoT & Embedded Systems',
      slug: 'iot-and-embedded-systems',
    },
    publishedAt: '2026-10-18T09:00:00Z',
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

    // Detect arrhythmia thresholds:
    if (bpm > 140 || bpm < 45) {
      triggerEmergencyAlert(bpm);
    }
  }
);
\`\`\`
`,
  },
  {
    id: 'wa4',
    title: 'Decoupling Next.js App Router from a Dedicated NestJS API: 100% SEO with Zero Bloat',
    slug: 'decoupling-nextjs-dedicated-nestjs-api',
    summary:
      'How to maintain superior server-side SEO and dynamic Open Graph generation in Next.js while leveraging NestJS and Drizzle ORM for enterprise backend architecture.',
    readingTimeMinutes: 5,
    categoryId: 'wc4',
    category: {
      id: 'wc4',
      name: 'Architecture & Cloud',
      slug: 'architecture-and-cloud',
    },
    publishedAt: '2026-10-10T11:00:00Z',
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
1. Next.js fetches data from the NestJS REST API (\`portfolio_api:4000/api/v1/projects/...\`) over the private Docker bridge network in < 2ms.
2. Next.js produces fully-rendered HTML with complete \`<meta>\`, OpenGraph, Twitter, and JSON-LD \`<script>\` tags.
3. The crawler receives 100% complete semantic HTML.

---

## Key Architecture Benefits

- **Independent Scaling:** The NestJS API can handle high-throughput IoT telemetry and background jobs without restarting the Next.js frontend cache.
- **Dedicated OpenAPI / Swagger:** Interactive Swagger docs at \`/api/docs\` are automatically generated using NestJS class-validator decorators.
- **Clean Separation of Concerns:** Database connection pools are managed once in NestJS without serverless cold start connection limits.
`,
  },
];

@Injectable()
export class WikiService {
  private readonly logger = new Logger(WikiService.name);

  constructor(@Inject(DRIZZLE_DB) private readonly db: AppDatabase) {}

  async getCategories() {
    try {
      const records = await this.db.query.wikiCategories.findMany({
        orderBy: [asc(schema.wikiCategories.displayOrder)],
        with: {
          articles: {
            where: eq(schema.wikiArticles.status, 'published'),
            columns: { id: true },
          },
        },
      });

      if (records.length > 0) {
        return records.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          displayOrder: cat.displayOrder,
          articleCount: cat.articles?.length || 0,
        }));
      }
    } catch (err: any) {
      this.logger.warn(`Database query failed in getCategories: ${err.message}. Using fallback.`);
    }

    return FALLBACK_WIKI_CATEGORIES.map((cat) => ({
      ...cat,
      articleCount: FALLBACK_WIKI_ARTICLES.filter((a) => a.categoryId === cat.id).length,
    }));
  }

  async getArticles(categorySlug?: string, query?: string) {
    try {
      const records = await this.db.query.wikiArticles.findMany({
        where: eq(schema.wikiArticles.status, 'published'),
        orderBy: [desc(schema.wikiArticles.publishedAt)],
        with: {
          category: true,
        },
      });

      if (records.length > 0) {
        let results = records;
        if (categorySlug) {
          results = results.filter((a) => a.category?.slug === categorySlug);
        }
        if (query) {
          const q = query.toLowerCase();
          results = results.filter(
            (a) =>
              a.title.toLowerCase().includes(q) ||
              a.summary?.toLowerCase().includes(q) ||
              a.content.toLowerCase().includes(q),
          );
        }

        return results.map((a) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          summary: a.summary,
          readingTimeMinutes: a.readingTimeMinutes,
          publishedAt: a.publishedAt,
          category: a.category,
        }));
      }
    } catch (err: any) {
      this.logger.warn(`Database query failed in getArticles: ${err.message}. Using fallback.`);
    }

    let results = FALLBACK_WIKI_ARTICLES;
    if (categorySlug) {
      results = results.filter((a) => a.category?.slug === categorySlug);
    }
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary?.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q),
      );
    }

    return results.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      readingTimeMinutes: a.readingTimeMinutes,
      publishedAt: a.publishedAt,
      category: a.category,
    }));
  }

  async getArticleBySlug(slug: string) {
    try {
      const article = await this.db.query.wikiArticles.findFirst({
        where: and(
          eq(schema.wikiArticles.slug, slug),
          eq(schema.wikiArticles.status, 'published'),
        ),
        with: {
          category: true,
        },
      });

      if (article) return article;
    } catch (err: any) {
      this.logger.warn(`Database query failed in getArticleBySlug: ${err.message}. Using fallback.`);
    }

    const fallback = FALLBACK_WIKI_ARTICLES.find((a) => a.slug === slug);
    if (!fallback) {
      throw new NotFoundException(`Article with slug '${slug}' not found.`);
    }
    return fallback;
  }

  async searchArticles(term: string) {
    if (!term || term.trim() === '') {
      return [];
    }
    return this.getArticles(undefined, term.trim());
  }
}
