# Zyphr Website — Conversation History & Implementation Status

**Document Created:** March 25, 2026  
**Project:** Zyphr Company Public Website  
**Repository:** `github.com:Jonie-Jacob/Company_Public_Website.git`  
**Current Branch:** `develop`  
**Latest Commit:** `98c5bff` — `feat(F9): Home Hero Section`

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Conversation History (Compacted)](#2-conversation-history-compacted)
3. [Phase Completion Status](#3-phase-completion-status)
4. [Current Codebase State](#4-current-codebase-state)
5. [Pending / In-Progress Work](#5-pending--in-progress-work)
6. [Technical Decisions & Patterns](#6-technical-decisions--patterns)
7. [Known Issues Resolved](#7-known-issues-resolved)
8. [Git History](#8-git-history)

---

## 1. Project Overview

Zyphr is a company public website built with a "parallax, dark mode, gradient backgrounds with glassmorphism effects, interactive cursor, and microinteractions" design philosophy. The project follows a phased implementation plan (B1 backend, F1–F37 frontend, D1 deployment), with each phase built on a feature branch and merged to `develop` after validation.

### Tech Stack

| Technology | Version / Details |
|---|---|
| Next.js | 16.2.0 (App Router, `src/` directory, Turbopack) |
| React | 19.2.4 |
| Tailwind CSS | 4 (CSS-first config via `@theme inline` in globals.css, no tailwind.config.ts) |
| Framer Motion | Page transitions, scroll animations, cursor springs |
| TypeScript | Strict mode |
| Hosting | AWS (S3 + CloudFront for static, Lambda + API Gateway for backend) |
| DNS | GoDaddy → zyphr.co.in |

### Brand Colors

| Name | Hex |
|---|---|
| Purple | #7B2FBE |
| Ceylon Blue | #2563EB |
| Champagne | #F7E7CE |
| Charcoal | #1A1A2E |
| Near Black | #0F0F1A |

---

## 2. Conversation History (Compacted)

### Session 1: Project Setup & Core Components (Phases B1, F1–F8)

**Phases B1, F1–F8 were completed and merged to `develop`.**

- **B1 — AWS Backend Setup:** Lambda function (`zyphr-contact-form-handler`), API Gateway (`POST /contact`), SES email integration. IAM policies, CORS, honeypot bot detection, rate limiting all configured.
- **F1 — Project Initialization:** Next.js app created with TypeScript, Tailwind, App Router, ESLint. Folder structure established. Dependencies installed (`framer-motion`).
- **F2 — Design System & Globals:** Brand colors, typography (Inter body, Poppins headings), CSS variables, glassmorphism `.glass` class, gradient utilities, z-index tokens all configured in `globals.css` using Tailwind v4 `@theme inline`.
- **F3 — Layout Shell:** Root `layout.tsx` with metadata, `next/font` loading, `PageTransition.tsx` (Framer Motion AnimatePresence wrapper).
- **F4 — Navigation Bar:** `Navbar.tsx` with logo, nav links, "Get In Touch" CTA, mobile hamburger menu, glassmorphism on scroll, active link indicator, `useScrollPosition` hook.
- **F5 — Footer:** `Footer.tsx` with 3-column layout, quick links, services subset, social icons (LinkedIn, X, Instagram, Facebook), copyright bar, logo sparkle Easter egg.
- **F6 — Custom Cursor:** `CustomCursor.tsx` with glowing dot, outer ring, spring physics, 8 trailing glow dots, hover state expansion for interactive elements.
- **F7 — Scroll-to-Top Button:** `ScrollToTop.tsx` floating button, fade-in after 400px scroll, pulse animation, smooth scroll on click. Adjusts position when cookie banner is visible.
- **F8 — Cookie Consent Banner:** `CookieConsent.tsx` with localStorage persistence, Accept/Manage buttons, GA4 conditional loading via `analytics.ts`, slide-up animation, glassmorphism styling.

**Logo Integration:** Zyphr logo SVG integrated into Navbar and Footer as a separate task.

### Session 2: Hero Section & Refinements (Phase F9)

#### F9 — Hero Section Initial Build
Built `HeroSection.tsx` with:
- Full viewport height (`h-screen`) with `-mt-[72px]` to slide under the fixed navbar
- Canvas-based particle animation (floating connected dots)
- Floating gradient orbs (blurred circles with brand colors)
- Large "Z" watermark centered in background
- Glassmorphism overlay panel with headline text
- Two CTA buttons: "Start Your Journey" (primary) and "Explore Our Services" (outlined)
- Animated scroll-down chevron indicator
- Parallax scrolling (particles, orbs, watermark move at different rates)

#### F9 — Visual Refinement Rounds
Multiple rounds of user feedback and fixes:

1. **Particle speed increased** — particles were too slow; base speed bumped to 1.2.
2. **Watermark visibility increased** — opacity changed from 0.03 → 0.12, added text-stroke, glow effect, size set to 35vw.
3. **Temporary 200vh spacer** added to `page.tsx` for scroll/parallax testing (later replaced with placeholder sections).
4. **Header-hero scroll transition** — changed hero to `h-screen` with `-mt-[72px]` so it sits behind the transparent navbar.
5. **Scroll chevron** made larger and brighter for visibility.
6. **Floating orbs** made more visible — opacity 0.1 → 0.3, larger sizes, more vivid brand colors.

#### Performance Tier Auto-Detection
Created performance detection via hooks:
- `useLowEndDevice.ts` — detects low-end devices using `navigator.hardwareConcurrency`, `navigator.deviceMemory`, `devicePixelRatio`, touch detection.
- Integrated into `HeroSection.tsx`:
  - **High tier:** 70 particles, 4 orbs, full parallax
  - **Mid tier:** 35 particles, 2 orbs, reduced parallax
  - **Low tier:** 0 particles, 0 orbs, no parallax
- Integrated into `CustomCursor.tsx`:
  - Low-end devices: cursor completely disabled, default browser cursor restored
  - Uses `useLowEndDevice()`, `useReducedMotion()`, and `useMediaQuery("(pointer: coarse)")`

> **Note:** The original plan mentioned `usePerformanceTier.ts` returning `'high'|'mid'|'low'`, but the actual implementation uses `useLowEndDevice.ts` (boolean) with inline tier logic in the hero component.

#### Navbar Issues — Multiple Fix Rounds

1. **Content jerk on scroll** — The navbar was in document flow; hiding/showing it caused a 72px content shift. **Fixed** by ensuring navbar is `position: fixed` with `z-index: 50`, and `<main>` has `pt-[72px]` to account for the navbar height.

2. **Too much transparency** — Glassmorphism navbar let content show through when scrolled. **Fixed** by switching from semi-transparent glass to near-opaque background (`rgba(15, 15, 26, ...)`) when scrolled.

3. **Abrupt transition** — Background switch was binary (transparent vs opaque) with no smooth transition. User requested a **continuous gradient opacity** that progresses from transparent to opaque as the user scrolls through the hero section.

4. **Continuous opacity implemented** — Replaced binary `isScrolled` toggle with smooth calculation:
   ```
   scrollProgress = Math.min(scrollY / heroHeight, 1)
   bgOpacity = scrollProgress * 0.95
   backgroundColor = rgba(15, 15, 26, ${bgOpacity})
   ```
   Border also fades in progressively (`scrollProgress > 0.05`).

---

## 3. Phase Completion Status

| Phase | Title | Status | Branch | Notes |
|---|---|---|---|---|
| B1 | AWS Backend Setup | ✅ Complete | `feature/B1-backend-contact-api` | Lambda, API Gateway, SES configured |
| F1 | Project Initialization | ✅ Complete | `feature/F1-project-init` | Next.js 16.2, folder structure |
| F2 | Design System & Globals | ✅ Complete | `feature/F2-design-system` | Colors, fonts, glassmorphism, CSS vars |
| F3 | Layout Shell | ✅ Complete | `feature/F3-layout-shell` | Root layout, page transitions |
| F4 | Navigation Bar | ✅ Complete | `feature/F4-navbar` | Desktop + mobile nav, glassmorphism scroll |
| F5 | Footer | ✅ Complete | `feature/F5-footer` | 3-column, social icons, sparkle Easter egg |
| F6 | Custom Cursor | ✅ Complete | `feature/F6-custom-cursor` | Glow dot, ring, trail, hover states |
| F7 | Scroll-to-Top | ✅ Complete | `feature/F7-scroll-to-top` | Float button, pulse animation |
| F8 | Cookie Consent | ✅ Complete | `feature/F8-cookie-consent` | localStorage, GA4 conditional, slide-up |
| — | Logo Integration | ✅ Complete | `feature/logo-integration` | SVG logo in Navbar and Footer |
| F9 | Home — Hero Section | 🔄 In Progress | `feature/F9-home-hero` | Core built, refinements applied, see pending items |
| F10 | Home — About Snapshot | ⬜ Not Started | — | `AboutSnapshot.tsx`, `ScrollReveal.tsx` |
| F11 | Home — Services Overview | ⬜ Not Started | — | `GlassCard.tsx`, service cards grid |
| F12 | Home — Why Choose Zyphr | ⬜ Not Started | — | 6 differentiator items |
| F13 | Home — Leadership Team | ⬜ Not Started | — | 4 profile cards with hover flip |
| F14 | Home — Portfolio Placeholder | ⬜ Not Started | — | Hidden, config flag controlled |
| F15 | Home — CTA Banner | ⬜ Not Started | — | Full-width gradient, glowing CTA |
| F16 | Home — Assembly & Polish | ⬜ Not Started | — | Assemble all home sections |
| F17–F21 | About Page | ⬜ Not Started | — | Hero, story, vision, values, leadership |
| F22–F26 | Services Page | ⬜ Not Started | — | Hero, grid, timeline, CTA |
| F27–F31 | Contact Page | ⬜ Not Started | — | Hero, form, API integration, info |
| F32 | Cookie Policy Page | ⬜ Not Started | — | Content page |
| F33 | SEO & Metadata | ⬜ Not Started | — | Per-page SEO, OG tags, JSON-LD |
| F34 | Page Load Animation | ⬜ Not Started | — | "Z" logo loading screen |
| F35 | Responsive & Cross-Browser | ⬜ Not Started | — | Multi-device, multi-browser testing |
| F36 | Performance Optimization | ⬜ Not Started | — | Lighthouse > 80 target |
| F37 | Final Integration Testing | ⬜ Not Started | — | End-to-end validation |
| D1 | Production Deployment | ⬜ Not Started | — | S3, CloudFront, DNS, CI/CD |

---

## 4. Current Codebase State

### Directory Structure (frontend/src/)

```
src/
├── app/
│   ├── globals.css              ← Tailwind v4 @theme inline, brand colors, z-index tokens
│   ├── layout.tsx               ← Root layout: CustomCursor → Navbar → main(pt-72px) → Footer → ScrollToTop → CookieConsent
│   ├── page.tsx                 ← HeroSection + 3 temporary placeholder sections
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── cookie-policy/page.tsx
│   └── services/page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           ← Fixed navbar, continuous scroll opacity, mobile hamburger
│   │   ├── Footer.tsx           ← 3-column footer, social icons, sparkle Easter egg
│   │   └── PageTransition.tsx   ← Framer Motion AnimatePresence wrapper
│   ├── home/
│   │   └── HeroSection.tsx      ← Canvas particles, orbs, Z watermark, glassmorphism overlay, CTAs, parallax
│   ├── cursor/
│   │   └── CustomCursor.tsx     ← Glow dot + ring + 8 trail dots, disabled on low-end/touch/reduced-motion
│   ├── cookie/
│   │   └── CookieConsent.tsx    ← Bottom banner, localStorage, GA4 conditional
│   ├── ui/
│   │   └── ScrollToTop.tsx      ← Floating button, adjusts for cookie banner
│   ├── about/                   ← Placeholder pages
│   ├── contact/                 ← Placeholder pages
│   └── services/                ← Placeholder pages
├── hooks/
│   ├── useLowEndDevice.ts       ← Hardware detection (cores, memory, DPR, touch)
│   ├── useMediaQuery.ts         ← CSS media query hook
│   ├── useReducedMotion.ts      ← prefers-reduced-motion detection
│   └── useScrollPosition.ts     ← Returns current scrollY
├── lib/
│   ├── analytics.ts             ← GA4 conditional initialization
│   ├── config.ts                ← Feature flags (SHOW_PORTFOLIO = false)
│   ├── constants.ts             ← Services array, team data, nav links
│   └── utils.ts                 ← Utility functions
└── types/
    └── index.ts                 ← Shared TypeScript types
```

### Key Component States

#### Navbar.tsx
- **Position:** Fixed, z-index 50
- **Scroll behavior:** Continuous opacity — `bgOpacity = scrollProgress * 0.95` where `scrollProgress = Math.min(scrollY / heroHeight, 1)`
- **Background:** `rgba(15, 15, 26, ${bgOpacity})` — fully transparent at top, nearly opaque at hero bottom
- **Border:** Fades in after 5% scroll progress
- **Mobile:** Hamburger menu with body scroll lock
- **CTA:** "Get In Touch" with purple gradient + glow shadow

#### HeroSection.tsx
- **Height:** `h-screen` with `-mt-[72px]` (slides under navbar)
- **Background:** Purple → Ceylon Blue gradient
- **Particles:** Canvas-based, 70/35/0 particles by performance tier, baseSpeed 1.2
- **Orbs:** 4/2/0 floating gradient blurs by tier, opacity 0.3, vivid colors
- **Watermark:** "Z" at 35vw, opacity 0.12, text-stroke, glow
- **Text overlay:** Glassmorphism panel with headline "Empowering Dreams. Engineering Reality."
- **CTAs:** "Start Your Journey" (→ /contact), "Explore Our Services" (→ /services)
- **Scroll chevron:** Large animated downward chevron
- **Parallax:** Different scroll speeds for particles, orbs, watermark

#### CustomCursor.tsx
- **Dot:** Small glowing brand accent
- **Ring:** Outer ring with separate spring physics
- **Trail:** 8 trailing dots at 40ms interval
- **Hover:** Expands on interactive elements (links, buttons, cards)
- **Disabled:** On touch devices, low-end devices, or prefers-reduced-motion

#### Layout.tsx
```
<body>
  ├── CustomCursor
  ├── Navbar (fixed, z-50)
  ├── <main> (flex-1, pt-[72px])
  │   └── PageTransition → {children}
  ├── Footer
  ├── ScrollToTop
  └── CookieConsent (z-90)
</body>
```

#### page.tsx (Home)
- `HeroSection` component
- 3 temporary placeholder glassmorphism sections (for scroll/parallax testing)
- Placeholders to be replaced with real sections in phases F10–F15

---

## 5. Pending / In-Progress Work

### Remaining F9 Tasks
1. **Remove temporary placeholder sections** from `page.tsx` (once real sections F10–F15 are built)
2. **Final F9 commit & merge** — the hero phase needs to be finalized and feature branch merged cleanly to develop

### Next Phases (Immediate)
1. **F10 — Home About Snapshot:** Build `AboutSnapshot.tsx` (split layout, text left, visual right, "Who We Are") and `ScrollReveal.tsx` (reusable scroll-triggered animation wrapper)
2. **F11 — Home Services Overview:** Build `GlassCard.tsx` (reusable) and `ServicesOverview.tsx` (8 featured services in 4-col grid)
3. **F12–F16:** Remaining home page sections → full home assembly

### Long-Term Remaining
- Phases F17–F21: About page (5 phases)
- Phases F22–F26: Services page (5 phases)
- Phases F27–F31: Contact page (5 phases)
- Phases F32–F37: Cookie policy, SEO, loading animation, responsive testing, performance, final testing
- Phase D1: Production deployment to AWS

---

## 6. Technical Decisions & Patterns

### React 19 Compatibility
- **useSyncExternalStore pattern** required for custom hooks due to strict ESLint rules (cannot use `setState` in effects, cannot access refs during render)
- All custom hooks (`useScrollPosition`, `useMediaQuery`, `useReducedMotion`, `useLowEndDevice`) follow this pattern

### Tailwind CSS v4
- **No `tailwind.config.ts`** — all theme configuration via `@theme inline` directive in `globals.css`
- Custom colors, spacing, z-index tokens, font families all defined in CSS

### Glassmorphism `.glass` Class
- Defined in `globals.css` with `backdrop-filter`, border, shadow
- **Caveat:** `.glass` class includes `position: relative` — any component needing `position: fixed` must override with inline `style={{ position: 'fixed' }}`

### Custom Cursor
- `cursor: none` applied globally in CSS for the custom cursor effect
- Conditionally disabled for touch/low-end/reduced-motion via component logic (returns `null`)
- When disabled, default browser cursor is shown

### Performance Tiers
- Adaptive rendering based on device capability
- Detection via `useLowEndDevice.ts` hook (checks hardware concurrency, device memory, DPR, touch)
- Hero section particles/orbs/parallax scale down on lower-end devices
- Custom cursor completely disabled on low-end devices

### SSR Safety
- All `window`/`document` access guarded for SSR (Next.js renders on server first)
- `useSyncExternalStore` with server snapshot returning default values
- Canvas operations wrapped in client-side checks

---

## 7. Known Issues Resolved

| Issue | Root Cause | Resolution |
|---|---|---|
| React ESLint errors with `setState` in `useEffect` | React 19 strict rules | Switched to `useSyncExternalStore` pattern |
| `.glass` class breaking `position: fixed` | `.glass` includes `position: relative` | Override with inline `style={{ position: 'fixed' }}` |
| Navbar content jerk on scroll | Navbar in document flow; hide/show shifted content 72px | Made navbar `position: fixed`, `<main>` has `pt-[72px]` |
| Content visible through navbar | Glassmorphism backdrop was too transparent | Changed to near-opaque `rgba(15, 15, 26, ...)` background |
| Navbar transition abrupt | Binary toggle between transparent and opaque states | Implemented continuous opacity based on scroll position |
| Hero particles too slow | Default speed too low | Increased `baseSpeed` to 1.2 |
| Z watermark invisible | Opacity 0.03 was too subtle | Increased to 0.12, added text-stroke and glow |
| Floating orbs barely visible | Opacity 0.1, small sizes, muted colors | Opacity → 0.3, larger sizes, vivid brand colors |
| Scroll chevron hard to see | Too small and dim | Made larger with brighter styling |
| Cookie banner overlapping scroll-to-top | Both positioned bottom-right | ScrollToTop shifts up when cookie banner is visible |
| Cookie banner not sticky | CSS issues | Fixed with inline `style={{ position: 'fixed' }}` |

---

## 8. Git History

```
98c5bff (HEAD -> develop) feat(F9): Home Hero Section
21e9f5b fix: prevent scroll-to-top overlapping cookie banner
a3cc841 fix(cookie): increase banner background opacity for readability
87539d4 fix(scroll-to-top): use inline style for fixed positioning
75c11df fix(cookie): fix banner not sticky and text clipping
f49d826 feat(frontend): Phase F8 — cookie consent banner with GA4 integration
0af659a feat(frontend): Phase F7 — scroll-to-top button + cursor trail effect
022128e feat(frontend): Phase F6 — custom cursor with hover expansion
ea90b08 feat(frontend): integrate logo into Navbar and Footer components
a1f25f1 feat(frontend): Phase F5 — footer with social icons and glass buttons
c252f40 feat(frontend): Phase F4 — responsive navbar with glassmorphism
26d5c1d feat(frontend): Phase F3 — layout shell with page transitions
dbf5692 feat(frontend): Phase F2 — enhanced glassmorphism with 3D thick-glass effect
ceb5413 feat(frontend): Phase F2 — design system & globals
d746e66 feat(frontend): Phase F1 — project initialization
1e2b014 docs: add Backend Deployment Checklist for AWS setup
9d6e2d4 feat(backend): add Lambda contact form handler, IAM policies, and AWS setup guide
0b3e6a0 Update DNS management details in Software Requirements Specification
9f35448 (main) docs: add Business Requirement Plan and Software Requirements Specification
```

### Branch State
- **`main`:** Initial docs only (commit `9f35448`)
- **`develop`:** All phases B1 through F9 merged (HEAD at `98c5bff`)
- **Feature branches:** All exist locally; only `feature/logo-integration` pushed to remote besides `develop`

---

*This document captures the full conversation history and implementation state as of March 25, 2026.*
