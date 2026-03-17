# ZYPHR — Software Requirements Specification (SRS)

**Document Version:** 1.0  
**Date:** March 17, 2026  
**Project:** Zyphr Company Public Website  
**Domain:** zyphr.co.in  
**Status:** Draft  
**Reference:** [Business Requirement Plan v1.0](./Business_Requirement_Plan.md)

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Technology Stack](#3-technology-stack)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Page Requirements](#6-page-requirements)
7. [UI/UX Requirements](#7-uiux-requirements)
8. [SEO Requirements](#8-seo-requirements)
9. [Analytics](#9-analytics)
10. [Security Requirements](#10-security-requirements)
11. [Infrastructure & Deployment](#11-infrastructure--deployment)
12. [Browser Compatibility](#12-browser-compatibility)
13. [Accessibility](#13-accessibility)
14. [Version Control & Branching](#14-version-control--branching)
15. [Constraints & Assumptions](#15-constraints--assumptions)

---

## 1. Introduction

### 1.1 Purpose

This document defines the software requirements for the Zyphr public company website (zyphr.co.in). It covers the functional, non-functional, and technical requirements necessary to build, deploy, and maintain the website. A separate implementation plan document will detail the development approach, task breakdown, and timeline.

### 1.2 Scope

The website is a public-facing marketing site for Zyphr Innovation & Technology. It consists of 5 pages at launch (Home, About, Services, Contact, Cookie Policy) with a hidden Portfolio section ready for Phase 2 activation. The site is a static/SSG website with one serverless function for contact form handling.

### 1.3 Definitions & Acronyms

| Term | Definition |
|------|------------|
| SSG | Static Site Generation |
| SSR | Server-Side Rendering |
| CDN | Content Delivery Network |
| OG | Open Graph (social media meta tags) |
| WCAG | Web Content Accessibility Guidelines |
| SPA | Single Page Application |
| ISR | Incremental Static Regeneration |
| CloudFront | AWS CDN service |
| Lambda | AWS serverless compute service |
| SES | AWS Simple Email Service |
| S3 | AWS Simple Storage Service |
| ACM | AWS Certificate Manager |

---

## 2. System Overview

### 2.1 Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Client (Browser)                │
│   Next.js App (SSG) — Dark Mode, Parallax, Effects  │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
                       ▼
              ┌────────────────┐
              │  AWS CloudFront │  ← CDN + SSL
              │    (CDN Edge)   │
              └───────┬────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
   ┌─────────────┐      ┌────────────────┐
   │   AWS S3     │      │  AWS Lambda     │
   │  (Static     │      │  (Contact Form  │
   │   Assets)    │      │   Handler)      │
   └─────────────┘      └───────┬────────┘
                                │
                                ▼
                        ┌──────────────┐
                        │   AWS SES     │
                        │  (Email Send) │
                        └──────────────┘
```

### 2.2 High-Level Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | Next.js (React) with SSG | Pages, UI, animations, interactivity |
| Hosting | AWS S3 + CloudFront | Static file serving via CDN |
| SSL | AWS ACM | HTTPS certificate for zyphr.co.in |
| Contact API | AWS Lambda (Node.js) | Process contact form submissions |
| Email | AWS SES | Send form submission emails to Zyphr |
| DNS | AWS Route 53 (or existing provider) | Domain resolution for zyphr.co.in |
| Analytics | Google Analytics 4 | Traffic and user behavior tracking |
| Image Optimization | Next.js Image + CloudFront | WebP/AVIF delivery, responsive images |

---

## 3. Technology Stack

### 3.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14+ (App Router) | React framework with SSG support |
| **React** | 18+ | UI component library |
| **TypeScript** | 5+ | Type safety |
| **Tailwind CSS** | 3+ | Utility-first CSS framework |
| **Framer Motion** | 11+ | Animations, parallax, microinteractions |
| **next/image** | Built-in | Image optimization and lazy loading |
| **next/font** | Built-in | Font optimization |

### 3.2 Animation & Effects Libraries

| Library | Purpose |
|---------|---------|
| **Framer Motion** | Scroll animations, page transitions, microinteractions |
| **Custom CSS** | Glassmorphism (backdrop-filter), gradients, cursor effects |
| **Canvas / WebGL** (optional) | Particle effects in hero section |

### 3.3 Backend (Serverless)

| Technology | Purpose |
|------------|---------|
| **AWS Lambda** (Node.js 20) | Contact form API endpoint |
| **AWS SES** | Transactional email delivery |
| **AWS API Gateway** | HTTP endpoint for Lambda |

### 3.4 Infrastructure

| Service | Purpose |
|---------|---------|
| **AWS S3** | Static asset hosting (SSG output) |
| **AWS CloudFront** | CDN, edge caching, SSL termination |
| **AWS ACM** | SSL/TLS certificate management |
| **AWS Route 53** | DNS management (if applicable) |

### 3.5 Development Tools

| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **GitHub** | Repository hosting, CI/CD triggers |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Lighthouse CI** | Performance testing |

---

## 4. Functional Requirements

### FR-01: Navigation

| ID | Requirement |
|----|-------------|
| FR-01.1 | The website SHALL display a persistent top navigation bar on all pages |
| FR-01.2 | The navigation bar SHALL contain: Logo (left), menu links (center/right), and "Get In Touch" CTA button |
| FR-01.3 | Menu items SHALL include: Home, About, Services, Contact |
| FR-01.4 | The navigation bar SHALL become a frosted glass style (glassmorphism) on scroll |
| FR-01.5 | On mobile viewports (< 768px), the navigation SHALL collapse into a hamburger menu |
| FR-01.6 | The mobile menu SHALL open with a slide-in animation |
| FR-01.7 | The "Get In Touch" button SHALL link to the Contact page |

### FR-02: Home Page

| ID | Requirement |
|----|-------------|
| FR-02.1 | The hero section SHALL display the tagline "Empowering Dreams. Engineering Reality." with an entrance animation |
| FR-02.2 | The hero background SHALL render a gradient (purple to Ceylon blue) with animated floating particles |
| FR-02.3 | The Zyphr "Z" logo SHALL appear as a semi-transparent watermark in the hero background |
| FR-02.4 | The hero SHALL contain two CTA buttons: "Start Your Journey" and "Explore Our Services" |
| FR-02.5 | An animated scroll-down indicator SHALL be displayed at the bottom of the hero section |
| FR-02.6 | The "About Snapshot" section SHALL display a brief company introduction with scroll-triggered animation |
| FR-02.7 | The services overview SHALL display service cards in a responsive grid with glassmorphism styling |
| FR-02.8 | Service cards SHALL have hover effects (lift, glow, icon animation) |
| FR-02.9 | The "Why Choose Zyphr" section SHALL display 6 differentiators with scroll-reveal animations |
| FR-02.10 | The leadership section SHALL display 4 team member cards with photo placeholders, names, and titles |
| FR-02.11 | Leadership cards SHALL have a hover interaction (flip or expand to show a quote) |
| FR-02.12 | The portfolio section SHALL exist in the DOM but SHALL be hidden (display: none / visibility toggle) |
| FR-02.13 | The CTA banner SHALL display an inspirational headline with a glowing "Contact Us" button |
| FR-02.14 | Parallax scrolling SHALL be applied to the hero background, logo watermark, and service cards |

### FR-03: About Page

| ID | Requirement |
|----|-------------|
| FR-03.1 | The page SHALL include a hero banner with parallax background and page title |
| FR-03.2 | The "Our Story" section SHALL display narrative content about Zyphr's origin |
| FR-03.3 | Vision and Mission SHALL be displayed in two side-by-side glassmorphism cards |
| FR-03.4 | Company values SHALL be displayed as a grid of value cards with icons |
| FR-03.5 | The leadership section SHALL show expanded bios for all 4 executives |
| FR-03.6 | A company culture section SHALL be displayed with descriptive content |

### FR-04: Services Page

| ID | Requirement |
|----|-------------|
| FR-04.1 | The page SHALL display all 16 services in an organized grid or list layout |
| FR-04.2 | Each service SHALL display a title, description, and representative icon |
| FR-04.3 | Service cards SHALL be interactive (expandable or hover-detail) |
| FR-04.4 | The "Our Process" section SHALL display 6 steps in a visual timeline |
| FR-04.5 | Process steps SHALL animate sequentially on scroll |
| FR-04.6 | A CTA section SHALL link to the Contact page with a "Get a Free Quote" message |

### FR-05: Contact Page

| ID | Requirement |
|----|-------------|
| FR-05.1 | The contact form SHALL contain fields: Full Name (required), Email (required), Company (optional), Service dropdown (optional), Budget dropdown (optional), Message textarea (required) |
| FR-05.2 | The service dropdown SHALL include all 16 services plus "Not Sure Yet" and "Other" options |
| FR-05.3 | The budget dropdown SHALL include ranges plus a "Let's Discuss" option |
| FR-05.4 | Form validation SHALL be performed client-side before submission |
| FR-05.5 | Email validation SHALL check for valid email format |
| FR-05.6 | On successful submission, the form SHALL POST data to the AWS Lambda endpoint |
| FR-05.7 | The Lambda function SHALL send the form data as an email to Zyphr's designated email address via AWS SES |
| FR-05.8 | On success, a confirmation message SHALL be displayed with an animation |
| FR-05.9 | On failure, an error message SHALL be displayed with a retry option |
| FR-05.10 | The page SHALL display Zyphr's contact email with a copy-to-clipboard button |
| FR-05.11 | Social media links (LinkedIn, Twitter/X, Instagram, Facebook) SHALL be displayed with icons |
| FR-05.12 | The form submission button SHALL show a loading state during submission |

### FR-06: Cookie Policy Page

| ID | Requirement |
|----|-------------|
| FR-06.1 | The page SHALL display cookie usage information in clear, non-legal language |
| FR-06.2 | The page SHALL describe the types of cookies used |
| FR-06.3 | The page SHALL explain how users can manage their cookie preferences |

### FR-07: Cookie Consent Banner

| ID | Requirement |
|----|-------------|
| FR-07.1 | A cookie consent banner SHALL appear on the user's first visit |
| FR-07.2 | The banner SHALL be positioned at the bottom of the viewport, non-intrusively |
| FR-07.3 | The banner SHALL offer "Accept" and "Manage" options |
| FR-07.4 | User consent preference SHALL be stored in localStorage |
| FR-07.5 | The banner SHALL NOT appear again after the user makes a choice |
| FR-07.6 | Google Analytics SHALL only load AFTER the user accepts cookies |
| FR-07.7 | The cookie consent system SHALL be custom-built (no third-party tool) |

### FR-08: Footer

| ID | Requirement |
|----|-------------|
| FR-08.1 | The footer SHALL appear on all pages |
| FR-08.2 | The footer SHALL contain: Zyphr logo, quick links, service links, social media icons, and copyright text |
| FR-08.3 | Quick links SHALL include: Home, About, Services, Contact, Cookie Policy |
| FR-08.4 | Social icons SHALL link to LinkedIn, Twitter/X, Instagram, and Facebook (opening in new tabs) |
| FR-08.5 | Copyright text: "© 2026 Zyphr Innovation & Technology. All rights reserved." |

---

## 5. Non-Functional Requirements

### NFR-01: Performance

| ID | Requirement |
|----|-------------|
| NFR-01.1 | The website SHALL achieve a Google Lighthouse Performance score of > 80 |
| NFR-01.2 | The website SHALL achieve a Google Lighthouse SEO score of > 90 |
| NFR-01.3 | First Contentful Paint (FCP) SHALL be under 2.0 seconds |
| NFR-01.4 | Largest Contentful Paint (LCP) SHALL be under 3.0 seconds |
| NFR-01.5 | Cumulative Layout Shift (CLS) SHALL be under 0.1 |
| NFR-01.6 | All images SHALL be served in WebP or AVIF format where supported |
| NFR-01.7 | All images SHALL be lazy-loaded except above-the-fold content |
| NFR-01.8 | Static assets SHALL be cached via CloudFront with appropriate cache headers |
| NFR-01.9 | CSS and JavaScript bundles SHALL be minified in production |
| NFR-01.10 | Animations SHALL be hardware-accelerated (transform, opacity) and SHALL NOT cause layout thrashing |
| NFR-01.11 | Animations SHALL be reduced or disabled on mobile devices with `prefers-reduced-motion` |

### NFR-02: Scalability

| ID | Requirement |
|----|-------------|
| NFR-02.1 | The SSG architecture SHALL handle any volume of concurrent visitors via CDN edge caching |
| NFR-02.2 | The Lambda function SHALL auto-scale based on contact form submission volume |

### NFR-03: Reliability

| ID | Requirement |
|----|-------------|
| NFR-03.1 | The website SHALL target 99.9% uptime (AWS S3 + CloudFront SLA) |
| NFR-03.2 | The contact form Lambda SHALL include error handling with user-friendly error messages |
| NFR-03.3 | The website SHALL function (display content) even if JavaScript fails to load (progressive enhancement for core content) |

### NFR-04: Maintainability

| ID | Requirement |
|----|-------------|
| NFR-04.1 | Code SHALL be written in TypeScript for type safety |
| NFR-04.2 | Components SHALL follow a modular, reusable architecture |
| NFR-04.3 | ESLint and Prettier SHALL be configured for code consistency |
| NFR-04.4 | The portfolio section SHALL be toggleable via a configuration flag without code changes |

---

## 6. Page Requirements

### 6.1 Page Inventory

| Page | Route | Type | Status |
|------|-------|------|--------|
| Home | `/` | SSG | Active |
| About | `/about` | SSG | Active |
| Services | `/services` | SSG | Active |
| Contact | `/contact` | SSG + API call | Active |
| Cookie Policy | `/cookie-policy` | SSG | Active |
| Portfolio | `/portfolio` | SSG | Hidden (Phase 2) |

### 6.2 Shared Layout

| Component | Present On |
|-----------|-----------|
| Navigation bar | All pages |
| Footer | All pages |
| Cookie consent banner | All pages (first visit) |
| Custom cursor | All pages (desktop only) |
| Scroll-to-top button | All pages |

---

## 7. UI/UX Requirements

### 7.1 Theme

| ID | Requirement |
|----|-------------|
| UX-01 | The website SHALL use a dark mode theme exclusively (no light mode toggle at launch) |
| UX-02 | Primary background color SHALL be dark charcoal (#1A1A2E) |
| UX-03 | Secondary background color SHALL be near-black (#0F0F1A) |
| UX-04 | Accent colors SHALL include deep purple (#6A0DAD), Ceylon blue (#0047AB), and champagne (#F7E7CE) |
| UX-05 | Gradient backgrounds SHALL transition between purple, blue, and teal tones |

### 7.2 Glassmorphism

| ID | Requirement |
|----|-------------|
| UX-06 | Cards, navigation bar (on scroll), and overlays SHALL use glassmorphism styling |
| UX-07 | Glassmorphism SHALL be implemented using `backdrop-filter: blur()` with semi-transparent backgrounds |
| UX-08 | Glassmorphism elements SHALL have a subtle border (1px semi-transparent white) |

### 7.3 Parallax

| ID | Requirement |
|----|-------------|
| UX-09 | Hero section backgrounds SHALL implement parallax scrolling (background moves slower than content) |
| UX-10 | The logo watermark SHALL move at a different parallax rate than foreground content |
| UX-11 | Parallax effects SHALL be disabled on mobile devices for performance |

### 7.4 Interactive Cursor

| ID | Requirement |
|----|-------------|
| UX-12 | A custom cursor SHALL replace the default cursor on desktop devices |
| UX-13 | The cursor SHALL be a small glowing dot in brand accent colors |
| UX-14 | On hovering interactive elements, the cursor SHALL expand with a glow effect |
| UX-15 | The cursor MAY include a subtle trailing effect |
| UX-16 | The custom cursor SHALL be disabled on touch/mobile devices |

### 7.5 Microinteractions

| ID | Requirement |
|----|-------------|
| UX-17 | Buttons SHALL have hover (scale + glow) and click (press + ripple) animations |
| UX-18 | Cards SHALL lift with increased shadow and border glow on hover |
| UX-19 | Navigation links SHALL have an animated underline on hover |
| UX-20 | Content sections SHALL fade/slide in as they enter the viewport (scroll-triggered) |
| UX-21 | The page load SHALL include a logo animation followed by content fade-in |
| UX-22 | Form fields SHALL have a border color transition and glow on focus |
| UX-23 | The form submit button SHALL transition to a loading spinner during submission |
| UX-24 | Social media icons SHALL fill with brand color and bounce on hover |
| UX-25 | A scroll-to-top button SHALL appear after scrolling and have a pulse animation |

### 7.6 Responsive Design

| ID | Breakpoint | Requirement |
|----|------------|-------------|
| UX-26 | Desktop (≥1200px) | Full layout with all visual effects and animations |
| UX-27 | Tablet (768px–1199px) | Adapted grid, touch-optimized, reduced parallax |
| UX-28 | Mobile (<768px) | Single-column, hamburger nav, minimal animations, no custom cursor |

---

## 8. SEO Requirements

| ID | Requirement |
|----|-------------|
| SEO-01 | Each page SHALL have unique `<title>` and `<meta description>` tags |
| SEO-02 | Open Graph meta tags (og:title, og:description, og:image, og:url) SHALL be set per page |
| SEO-03 | Twitter Card meta tags SHALL be set per page |
| SEO-04 | A `sitemap.xml` SHALL be generated at build time and served at `/sitemap.xml` |
| SEO-05 | A `robots.txt` SHALL be served at `/robots.txt` allowing all crawlers |
| SEO-06 | Structured data (JSON-LD) SHALL be implemented for Organization schema on the home page |
| SEO-07 | All images SHALL have descriptive `alt` attributes |
| SEO-08 | The website SHALL use semantic HTML elements (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`) |
| SEO-09 | Each page SHALL have exactly one `<h1>` tag |
| SEO-10 | Canonical URLs SHALL be set on all pages |
| SEO-11 | The portfolio page (hidden) SHALL include `noindex` meta tag until activated |

---

## 9. Analytics

| ID | Requirement |
|----|-------------|
| AN-01 | Google Analytics 4 (GA4) SHALL be integrated |
| AN-02 | GA4 SHALL only be loaded after the user accepts cookies via the consent banner |
| AN-03 | Page views SHALL be tracked on all pages |
| AN-04 | Contact form submissions SHALL be tracked as a conversion event |
| AN-05 | CTA button clicks SHALL be tracked as events |
| AN-06 | The GA4 measurement ID SHALL be stored as an environment variable, not hardcoded |

---

## 10. Security Requirements

| ID | Requirement |
|----|-------------|
| SEC-01 | The website SHALL be served exclusively over HTTPS via AWS ACM certificate |
| SEC-02 | HTTP requests SHALL be redirected to HTTPS (CloudFront behavior) |
| SEC-03 | The contact form Lambda endpoint SHALL implement rate limiting to prevent abuse |
| SEC-04 | The contact form SHALL include server-side input validation and sanitization |
| SEC-05 | The Lambda endpoint SHALL implement CORS restrictions (allow only zyphr.co.in origin) |
| SEC-06 | All user-provided form data SHALL be sanitized to prevent XSS and injection attacks |
| SEC-07 | Security headers SHALL be configured via CloudFront: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Strict-Transport-Security`, `Content-Security-Policy` |
| SEC-08 | No sensitive data (API keys, credentials) SHALL be exposed in client-side code |
| SEC-09 | AWS Lambda function SHALL use IAM roles with minimum necessary permissions (principle of least privilege) |
| SEC-10 | Form submission data SHALL not be logged or stored beyond email delivery |
| SEC-11 | The contact form SHALL implement basic bot protection (honeypot field) |

---

## 11. Infrastructure & Deployment

### 11.1 AWS Services

| Service | Configuration |
|---------|---------------|
| **S3** | Private bucket, static website hosting via CloudFront |
| **CloudFront** | Distribution with custom domain (zyphr.co.in), SSL via ACM, edge caching |
| **ACM** | SSL/TLS certificate for zyphr.co.in and www.zyphr.co.in |
| **Route 53** | DNS A/AAAA records pointing to CloudFront (if DNS managed by AWS) |
| **Lambda** | Node.js 20 runtime, 128-256 MB memory, 10s timeout |
| **API Gateway** | HTTP API with POST endpoint for contact form |
| **SES** | Verified sender domain (zyphr.co.in), email delivery for contact submissions |

### 11.2 Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| **Development** | Local development | localhost:3000 |
| **Staging** | Pre-production testing | TBD (can use CloudFront alternate distribution or preview URL) |
| **Production** | Live website | https://zyphr.co.in |

### 11.3 Build & Deploy

| Step | Details |
|------|---------|
| Build | `next build` → generates static output (`out/` directory via `next export` or SSG) |
| Deploy | Upload `out/` to S3 → Invalidate CloudFront cache |
| CI/CD | GitHub Actions workflow (triggered on push to `main` branch) |
| Lambda Deploy | Separate deployment (ZIP upload or AWS SAM/CDK) |

### 11.4 CloudFront Caching Strategy

| Asset Type | Cache TTL | Notes |
|------------|-----------|-------|
| HTML pages | 1 hour | Short TTL for content freshness |
| CSS/JS bundles | 1 year | Hashed filenames (cache-busted on deploy) |
| Images | 1 month | Served via next/image optimization |
| Fonts | 1 year | Static assets, rarely change |
| API (Lambda) | No cache | Dynamic responses |

---

## 12. Browser Compatibility

| Browser | Version | Support Level |
|---------|---------|---------------|
| Google Chrome | Latest 2 versions | Full |
| Mozilla Firefox | Latest 2 versions | Full |
| Apple Safari | Latest 2 versions | Full |
| Microsoft Edge | Latest 2 versions | Full |
| Internet Explorer | Any | Not supported |
| Mobile Chrome (Android) | Latest 2 versions | Full |
| Mobile Safari (iOS) | Latest 2 versions | Full |

---

## 13. Accessibility

Basic accessibility requirements for launch:

| ID | Requirement |
|----|-------------|
| A11Y-01 | All interactive elements SHALL be keyboard-navigable |
| A11Y-02 | All images SHALL have meaningful `alt` text |
| A11Y-03 | Color contrast ratio SHALL meet WCAG 2.1 Level AA minimum (4.5:1 for normal text) |
| A11Y-04 | Form inputs SHALL have associated `<label>` elements |
| A11Y-05 | Focus states SHALL be visible on all interactive elements |
| A11Y-06 | The website SHALL respect `prefers-reduced-motion` for users who disable animations |
| A11Y-07 | Semantic HTML elements SHALL be used throughout |
| A11Y-08 | The navigation menu SHALL be operable via keyboard on both desktop and mobile |

---

## 14. Version Control & Branching

### 14.1 Repository

| Detail | Value |
|--------|-------|
| **Platform** | GitHub |
| **Repository** | Company_Public_Website (existing) |

### 14.2 Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code. Deploys to production (zyphr.co.in) |
| `develop` | Active development branch. All feature work merges here first |
| `feature/*` | Individual feature branches (branched from `develop`) |

### 14.3 Workflow

```
feature/xyz  →  develop  →  main (production)
```

1. All development work is done on `feature/*` branches created from `develop`
2. Feature branches are merged into `develop` via pull requests
3. When `develop` is stable and ready for release, it is merged into `main`
4. Pushes to `main` trigger the production CI/CD pipeline

---

## 15. Constraints & Assumptions

### Constraints

| # | Constraint |
|---|-----------|
| 1 | The website is English-only at launch |
| 2 | No CMS — all content is managed through code |
| 3 | No pricing page — all pricing is quote-based via the contact form |
| 4 | No blog, newsletter, careers, or client portal at launch |
| 5 | Portfolio section exists in code but is hidden at launch |
| 6 | Cookie consent is a custom implementation (no third-party tool) |

### Assumptions

| # | Assumption |
|---|-----------|
| 1 | The zyphr.co.in domain is registered and DNS is accessible |
| 2 | An AWS account is available with necessary service access |
| 3 | AWS SES sender domain verification will be completed before launch |
| 4 | Leadership team photos and bios will be provided separately |
| 5 | Social media accounts (LinkedIn, Twitter/X, Instagram, Facebook) are created and URLs are available |
| 6 | A Google Analytics 4 property will be created and measurement ID provided |
| 7 | The actual brand logo image file will be provided in high resolution (SVG preferred) |

---

*This SRS document is a companion to the [Business Requirement Plan](./Business_Requirement_Plan.md). A separate implementation plan document will detail the development phases, task breakdown, and execution approach.*

---
