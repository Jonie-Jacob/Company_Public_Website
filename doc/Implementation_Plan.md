# ZYPHR — Website Implementation Plan

**Document Version:** 1.0  
**Date:** March 17, 2026  
**Project:** Zyphr Company Public Website  
**Status:** Draft  
**References:**  
- [Business Requirement Plan v1.0](./Business_Requirement_Plan.md)  
- [Software Requirements Specification v1.0](./Software_Requirements_Specification.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Phase Summary](#2-phase-summary)
3. [Backend Phases](#3-backend-phases)
4. [Frontend Phases](#4-frontend-phases)
5. [Deployment Phase](#5-deployment-phase)
6. [Validation Checklist Template](#6-validation-checklist-template)

---

## 1. Overview

### Development Approach

- **Backend** and **Frontend** are developed as independent tracks
- Backend is completed first (or in parallel) so the contact form API is available when the Contact page is built
- Frontend is developed **incrementally** — component by component, page by page
- After **each phase**, the developer validates changes locally in the browser before proceeding
- All work is done on feature branches merged into `develop`

### Branch Workflow Per Phase

```
develop
  └── feature/phase-XX-description
        ├── commit 1
        ├── commit 2
        └── merge → develop (after validation)
```

### Local Development

- Run `npm run dev` (Next.js dev server on `localhost:3000`)
- Validate visually in browser after each phase
- Check console for errors
- Test responsive behavior (desktop, tablet, mobile via browser dev tools)

---

## 2. Phase Summary

### Backend Phases

| Phase | ID | Title | Description |
|-------|----|-------|-------------|
| 1 | B1 | AWS Backend Setup | Lambda function, API Gateway, SES — complete contact form backend |

### Frontend Phases

| Phase | ID | Title | Description |
|-------|----|-------|-------------|
| 1 | F1 | Project Initialization | Next.js project setup, dependencies, configuration, folder structure |
| 2 | F2 | Design System & Globals | Colors, typography, global styles, Tailwind config, CSS variables |
| 3 | F3 | Layout Shell | Root layout, metadata, font loading, page transition wrapper |
| 4 | F4 | Navigation Bar | Desktop nav, mobile hamburger menu, glassmorphism on scroll |
| 5 | F5 | Footer | Footer component with links, social icons, copyright |
| 6 | F6 | Custom Cursor | Interactive cursor with glow, expand on hover, trail effect |
| 7 | F7 | Scroll-to-Top Button | Floating button, scroll detection, pulse animation |
| 8 | F8 | Cookie Consent Banner | Custom banner, localStorage persistence, GA conditional load |
| 9 | F9 | Home — Hero Section | Gradient background, particles, logo watermark, tagline, CTAs, parallax, scroll indicator |
| 10 | F10 | Home — About Snapshot | Split layout, company intro text, scroll-triggered animation |
| 11 | F11 | Home — Services Overview | Service cards grid, glassmorphism cards, hover effects, icons |
| 12 | F12 | Home — Why Choose Zyphr | Differentiator items, scroll-reveal animations |
| 13 | F13 | Home — Leadership Team | 4 profile cards, hover flip/expand, staggered entrance |
| 14 | F14 | Home — Portfolio Placeholder | Hidden section, configuration flag toggle |
| 15 | F15 | Home — CTA Banner | Full-width gradient banner, headline, glowing button |
| 16 | F16 | Home — Assembly & Polish | Assemble all home sections, verify scroll flow, parallax tuning, spacing |
| 17 | F17 | About — Hero Banner | Page hero with parallax background and title |
| 18 | F18 | About — Story, Vision & Mission | Our Story narrative, Vision/Mission glassmorphism cards |
| 19 | F19 | About — Values & Culture | Values grid with icons, company culture section |
| 20 | F20 | About — Leadership Detailed | Expanded bios, larger cards, social links |
| 21 | F21 | About — Assembly & Polish | Full page assembly, scroll flow, animations, spacing |
| 22 | F22 | Services — Hero Banner | Page hero with gradient and code/circuit pattern overlay |
| 23 | F23 | Services — Full Service Grid | All 16 services, expandable/interactive cards, icons |
| 24 | F24 | Services — Our Process Timeline | 6-step timeline, sequential scroll animation |
| 25 | F25 | Services — CTA Section | Quote CTA with button linking to contact |
| 26 | F26 | Services — Assembly & Polish | Full page assembly, scroll flow, animations, spacing |
| 27 | F27 | Contact — Hero Banner | Animated gradient background, inspirational headline |
| 28 | F28 | Contact — Form | Form fields, validation, dropdown menus, submit button, honeypot |
| 29 | F29 | Contact — API Integration | Connect form to Lambda endpoint, loading/success/error states |
| 30 | F30 | Contact — Supplementary Sections | Email display, copy button, social links, inspirational closing |
| 31 | F31 | Contact — Assembly & Polish | Full page assembly, form UX testing, animations |
| 32 | F32 | Cookie Policy Page | Full page with cookie information content |
| 33 | F33 | SEO & Metadata | Per-page titles, meta descriptions, OG tags, Twitter cards, JSON-LD, sitemap.xml, robots.txt, canonical URLs |
| 34 | F34 | Page Load Animation | Initial loading screen with "Z" logo animation, page transition effects |
| 35 | F35 | Responsive & Cross-Browser | Responsive testing, mobile optimizations, animation reduction, reduced-motion support |
| 36 | F36 | Performance Optimization | Image optimization, bundle analysis, Lighthouse audit (target > 80), lazy loading verification |
| 37 | F37 | Final Integration Testing | End-to-end walkthrough, all pages, all interactions, all breakpoints |

---

## 3. Backend Phases

---

### Phase B1: AWS Backend Setup

**Branch:** `feature/B1-backend-contact-api`  
**Goal:** Create a fully functional serverless contact form backend

#### B1.1: AWS SES Configuration

| Task | Details |
|------|---------|
| Verify sender domain | Add zyphr.co.in to SES and verify via DNS (TXT record in GoDaddy) |
| Verify recipient email | Verify the email address that will receive contact form submissions |
| Request production access | Move SES out of sandbox mode (if needed for launch) |
| Test email delivery | Send a test email through SES console |

#### B1.2: AWS Lambda Function

| Task | Details |
|------|---------|
| Create Lambda function | Runtime: Node.js 20, memory: 256 MB, timeout: 10s |
| Function name | `zyphr-contact-form-handler` |
| Environment variables | `RECIPIENT_EMAIL`, `SES_REGION`, `ALLOWED_ORIGIN` |
| IAM role | Create role with `ses:SendEmail` permission only (least privilege) |

**Lambda function logic:**

```
1. Receive POST request body (JSON)
2. Validate required fields: name, email, message
3. Sanitize all input fields (strip HTML, trim whitespace)
4. Validate email format (regex)
5. Check honeypot field (if filled → reject silently as bot)
6. Rate limit check (optional: per-IP via CloudFront headers)
7. Compose email using SES (formatted HTML email)
8. Send email to Zyphr's designated recipients
9. Return success (200) or error (4xx/5xx) JSON response
```

**Email template content:**

```
Subject: New Contact Form Submission — [Name]
Body:
- Full Name: {name}
- Email: {email}
- Company: {company or "Not provided"}
- Service Interested In: {service or "Not specified"}
- Budget Range: {budget or "Not specified"}
- Message: {message}
- Submitted At: {timestamp}
```

#### B1.3: AWS API Gateway

| Task | Details |
|------|---------|
| Create HTTP API | Regional API Gateway |
| Route | `POST /contact` |
| Integration | Connect to Lambda function |
| CORS | Allow origin: `https://zyphr.co.in`, `http://localhost:3000` (dev) |
| Throttling | 10 requests/second, 100 burst |

#### B1.4: Testing

| Test | Expected Result |
|------|-----------------|
| Valid form submission | Email received at recipient address, 200 response |
| Missing required fields | 400 response with field-specific error messages |
| Invalid email format | 400 response with validation error |
| Honeypot filled | 200 response (silent rejection, no email sent) |
| CORS from allowed origin | Request succeeds |
| CORS from disallowed origin | Request blocked |
| Oversized payload | 400 response |

#### B1 — Validation Checkpoint

```
✅ POST to API Gateway endpoint with valid data → email received
✅ Invalid data returns proper error responses
✅ CORS working correctly
✅ Honeypot field blocks bots silently
✅ Email is properly formatted and readable
```

---

## 4. Frontend Phases

---

### Phase F1: Project Initialization

**Branch:** `feature/F1-project-init`  
**Goal:** Set up the Next.js project with all tooling and folder structure

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Create Next.js app | `npx create-next-app@latest` with TypeScript, Tailwind CSS, App Router, ESLint |
| 2 | Install dependencies | `framer-motion` |
| 3 | Configure ESLint | Extend with recommended rules |
| 4 | Configure Prettier | Standard config with Tailwind plugin |
| 5 | Create `.env.local` | `NEXT_PUBLIC_CONTACT_API_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| 6 | Create `.env.example` | Template for required environment variables |
| 7 | Update `.gitignore` | Ensure proper ignores for Next.js |
| 8 | Create folder structure | See below |

#### Folder Structure

```
src/
├── app/
│   ├── layout.tsx              ← Root layout
│   ├── page.tsx                ← Home page
│   ├── about/
│   │   └── page.tsx
│   ├── services/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── cookie-policy/
│   │   └── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── PageTransition.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── GlassCard.tsx
│   │   ├── SectionHeading.tsx
│   │   └── ScrollReveal.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSnapshot.tsx
│   │   ├── ServicesOverview.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── LeadershipTeam.tsx
│   │   ├── PortfolioPlaceholder.tsx
│   │   └── CtaBanner.tsx
│   ├── about/
│   │   ├── AboutHero.tsx
│   │   ├── OurStory.tsx
│   │   ├── VisionMission.tsx
│   │   ├── Values.tsx
│   │   ├── LeadershipDetailed.tsx
│   │   └── Culture.tsx
│   ├── services/
│   │   ├── ServicesHero.tsx
│   │   ├── ServiceGrid.tsx
│   │   ├── ProcessTimeline.tsx
│   │   └── ServicesCta.tsx
│   ├── contact/
│   │   ├── ContactHero.tsx
│   │   ├── ContactForm.tsx
│   │   └── ContactInfo.tsx
│   ├── cursor/
│   │   └── CustomCursor.tsx
│   └── cookie/
│       └── CookieConsent.tsx
├── lib/
│   ├── constants.ts            ← Services list, team data, nav links
│   ├── config.ts               ← Feature flags (e.g., showPortfolio)
│   ├── utils.ts                ← Utility functions
│   └── analytics.ts            ← GA4 initialization logic
├── hooks/
│   ├── useScrollPosition.ts
│   ├── useMediaQuery.ts
│   └── useReducedMotion.ts
├── styles/
│   └── glassmorphism.css       ← Reusable glassmorphism styles
└── types/
    └── index.ts                ← Shared TypeScript types
public/
├── images/
│   └── zyphr-logo.svg         ← Logo file(s)
├── favicon.ico
├── robots.txt
└── sitemap.xml
```

#### Validation Checkpoint

```
✅ `npm run dev` starts without errors
✅ Browser shows default Next.js page at localhost:3000
✅ TypeScript, Tailwind CSS, ESLint all working
✅ Folder structure created
✅ No console errors
```

---

### Phase F2: Design System & Globals

**Branch:** `feature/F2-design-system`  
**Goal:** Establish the visual foundation — colors, fonts, Tailwind config, global styles

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Configure `tailwind.config.ts` | Add custom colors (purple, Ceylon blue, champagne, charcoal, near-black), gradients, glassmorphism utilities, custom font families |
| 2 | Set up `globals.css` | Dark mode base styles, CSS variables for brand colors, gradient backgrounds, smooth scrolling, custom scrollbar styling |
| 3 | Configure fonts | Load brand fonts via `next/font` (Inter or Poppins for headings, Inter for body) |
| 4 | Create `glassmorphism.css` | Reusable `.glass` class with `backdrop-filter`, border, shadow |
| 5 | Create `constants.ts` | Define services array, team members array, nav links, social links |
| 6 | Create `config.ts` | Feature flag: `SHOW_PORTFOLIO = false` |
| 7 | Create base `types/index.ts` | TypeScript types for Service, TeamMember, NavLink, etc. |

#### Tailwind Custom Theme Additions

```
Colors:
  purple:       #6A0DAD
  ceylon-blue:  #0047AB
  champagne:    #F7E7CE
  charcoal:     #1A1A2E
  near-black:   #0F0F1A
  
  Gradient utility presets (via plugin or custom classes)
```

#### Validation Checkpoint

```
✅ Tailwind custom colors render correctly on a test element
✅ Fonts load properly
✅ Dark background applied globally (no white flash)
✅ CSS variables accessible
✅ Glassmorphism class renders frosted glass effect
```

---

### Phase F3: Layout Shell

**Branch:** `feature/F3-layout-shell`  
**Goal:** Create the root layout with metadata, font loading, and page structure

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Implement `layout.tsx` | Root layout with `<html>`, `<body>`, font classes, metadata defaults |
| 2 | Set default metadata | Default title: "Zyphr — Empowering Dreams. Engineering Reality.", default description |
| 3 | Add favicon | Place favicon in `/public` and reference in layout |
| 4 | Create `PageTransition.tsx` | Framer Motion wrapper for page enter/exit animations |
| 5 | Wrap children | Layout → PageTransition → children |

#### Validation Checkpoint

```
✅ All pages render inside the layout shell
✅ Browser tab shows correct title and favicon
✅ Background is dark charcoal, no white flash on load
✅ Page transitions animate smoothly between routes
```

---

### Phase F4: Navigation Bar

**Branch:** `feature/F4-navbar`  
**Goal:** Responsive navigation with glassmorphism scroll effect

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `Navbar.tsx` | Logo (left), nav links (center/right), "Get In Touch" CTA button |
| 2 | Scroll behavior | Detect scroll position; apply glassmorphism background after scrolling past hero |
| 3 | Active link indicator | Highlight current page link |
| 4 | Mobile hamburger | Hamburger icon on < 768px, slide-in animated menu panel |
| 5 | Mobile menu items | Full-screen or side-panel overlay with nav links and CTA |
| 6 | Link hover animation | Underline slides in from left on hover |
| 7 | CTA button style | Glowing accent button (purple/blue gradient with glow) |
| 8 | Create `useScrollPosition` hook | Returns current scroll Y position |

#### Validation Checkpoint

```
✅ Nav bar visible on all pages
✅ Links navigate to correct routes
✅ Glassmorphism activates on scroll (transparent at top → frosted on scroll)
✅ Mobile hamburger menu opens/closes with animation
✅ "Get In Touch" links to /contact
✅ Active page is visually indicated
✅ Hover animations work on nav links and CTA button
```

---

### Phase F5: Footer

**Branch:** `feature/F5-footer`  
**Goal:** Site-wide footer with links, social icons, and copyright

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `Footer.tsx` | Near-black background, Zyphr logo, 3 columns |
| 2 | Quick links column | Home, About, Services, Contact, Cookie Policy |
| 3 | Services column | Subset of key services linking to /services |
| 4 | Social icons | LinkedIn, Twitter/X, Instagram, Facebook — icons with hover animation |
| 5 | Copyright bar | "© 2026 Zyphr Innovation & Technology. All rights reserved." |
| 6 | Logo hover Easter egg | Subtle sparkle on logo hover |
| 7 | Social icon hover | Fill with brand color + gentle bounce |

#### Validation Checkpoint

```
✅ Footer appears on all pages
✅ All quick links navigate correctly
✅ Social icons link to external URLs (new tab)
✅ Social icon hover animation works
✅ Logo sparkle Easter egg works
✅ Responsive layout (stacks on mobile)
```

---

### Phase F6: Custom Cursor

**Branch:** `feature/F6-custom-cursor`  
**Goal:** Interactive custom cursor for desktop users

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `CustomCursor.tsx` | Renders a custom cursor element that follows mouse position |
| 2 | Default state | Small glowing dot in brand accent color |
| 3 | Hover state detection | Expand cursor with glow when hovering links, buttons, cards |
| 4 | Trail effect | Optional subtle trailing glow/particles following cursor |
| 5 | Create `useMediaQuery` hook | Detect touch/mobile devices |
| 6 | Disable on mobile/touch | Do not render custom cursor on touch devices |
| 7 | Hide default cursor | CSS `cursor: none` on `<body>` (desktop only) |

#### Validation Checkpoint

```
✅ Custom cursor renders and follows mouse smoothly (no lag)
✅ Cursor expands on hovering interactive elements
✅ Trail effect is subtle and smooth
✅ Default browser cursor is hidden
✅ No custom cursor on mobile (check via responsive mode)
✅ No performance issues (smooth 60fps)
```

---

### Phase F7: Scroll-to-Top Button

**Branch:** `feature/F7-scroll-to-top`  
**Goal:** Floating scroll-to-top button with animation

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build component | Floating button (bottom-right corner) |
| 2 | Show/hide logic | Appears after scrolling 400px+ down |
| 3 | Animation | Fade-in on appear, gentle pulse while visible |
| 4 | Click behavior | Smooth scroll to top of page |
| 5 | Style | Semi-transparent with accent color, glassmorphism |

#### Validation Checkpoint

```
✅ Button hidden at page top
✅ Button appears after scrolling down
✅ Click scrolls smoothly to top
✅ Pulse animation visible
✅ Works on all pages
```

---

### Phase F8: Cookie Consent Banner

**Branch:** `feature/F8-cookie-consent`  
**Goal:** Custom-built cookie consent banner with localStorage persistence

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `CookieConsent.tsx` | Bottom-positioned banner with text, Accept and Manage buttons |
| 2 | localStorage check | On mount, check if consent already given; if yes, don't show |
| 3 | Accept action | Set localStorage flag, hide banner, load GA4 |
| 4 | Manage action | Show cookie categories (essential only for now), allow accept/decline |
| 5 | Create `analytics.ts` | Function to initialize GA4 only when consent is granted |
| 6 | Banner style | Glassmorphism, non-intrusive, slide-up animation |
| 7 | Link to Cookie Policy | Text includes "Learn more" linking to /cookie-policy |

#### Validation Checkpoint

```
✅ Banner appears on first visit
✅ Banner does NOT appear after accepting (clear localStorage to retest)
✅ Accept stores consent in localStorage
✅ GA4 loads only after acceptance (check network tab)
✅ Manage button shows category options
✅ Banner style matches site aesthetic
✅ "Learn more" links to /cookie-policy
```

---

### Phase F9: Home — Hero Section

**Branch:** `feature/F9-home-hero`  
**Goal:** The hero section — the most visually impactful part of the website

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `HeroSection.tsx` | Full viewport height hero |
| 2 | Gradient background | Deep purple → Ceylon blue gradient |
| 3 | Particle animation | Floating particles/stars using Canvas or CSS |
| 4 | Logo watermark | Large, semi-transparent "Z" logo centered in background, soft glow |
| 5 | Glassmorphism overlay | Subtle frost layer behind text for readability |
| 6 | Headline | "Empowering Dreams. Engineering Reality." — bold, large, with typing or fade-in animation |
| 7 | Sub-headline | Supporting text with fade-in delay |
| 8 | CTA buttons | "Start Your Journey" (primary, glowing) + "Explore Our Services" (outlined) |
| 9 | Scroll indicator | Animated downward chevron at bottom |
| 10 | Parallax | Background particles and logo watermark move at different scroll speeds |
| 11 | Create `useReducedMotion` hook | Respect `prefers-reduced-motion` system setting |

#### Validation Checkpoint

```
✅ Hero spans full viewport height
✅ Gradient renders correctly (purple → blue)
✅ Particles animate smoothly
✅ Logo watermark visible but subtle
✅ Headline animates on load
✅ Both CTA buttons visible and styled correctly
✅ "Start Your Journey" links to /contact
✅ "Explore Our Services" links to /services (or scrolls to services section)
✅ Scroll indicator animates
✅ Parallax effect working on scroll
✅ Visually stunning overall impression
```

---

### Phase F10: Home — About Snapshot

**Branch:** `feature/F10-home-about`  
**Goal:** Brief company introduction with scroll-triggered animation

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `AboutSnapshot.tsx` | Split layout — text left, visual right |
| 2 | Heading | "Who We Are" |
| 3 | Content | 2-3 sentences from mission (per Business Requirement Plan) |
| 4 | Visual element | Abstract animated illustration or gradient shape (crystal/sapphire forming) |
| 5 | CTA link | "Learn More About Us →" → /about |
| 6 | Build `ScrollReveal.tsx` | Reusable wrapper component for scroll-triggered entrance animations |
| 7 | Animations | Text slides in from left, visual fades in from right |

#### Validation Checkpoint

```
✅ Section renders with correct content
✅ Split layout displays properly (text + visual)
✅ Scroll-triggered animation fires when section enters viewport
✅ "Learn More" links to /about
✅ Responsive: stacks vertically on mobile
```

---

### Phase F11: Home — Services Overview

**Branch:** `feature/F11-home-services`  
**Goal:** Visual grid of key services with glassmorphism cards

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `ServicesOverview.tsx` | Responsive grid of service cards (show 8 featured services on home) |
| 2 | Build `GlassCard.tsx` | Reusable glassmorphism card component |
| 3 | Card content | Icon + title + one-line description per service |
| 4 | Card hover effect | Lift, border glow, icon animation |
| 5 | Grid layout | 4 columns desktop, 2 columns tablet, 1 column mobile |
| 6 | Section heading | "What We Do" or "Our Services" |
| 7 | CTA | "View All Services →" → /services |
| 8 | Parallax | Cards appear to float above background on scroll |

#### Validation Checkpoint

```
✅ 8 service cards render in grid
✅ Glassmorphism effect visible (frosted glass)
✅ Hover: card lifts, border glows, icon animates
✅ Icons match service themes
✅ "View All Services" links to /services
✅ Responsive grid adapts correctly at all breakpoints
```

---

### Phase F12: Home — Why Choose Zyphr

**Branch:** `feature/F12-home-why-choose`  
**Goal:** 6 differentiators with scroll-reveal animations

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `WhyChooseUs.tsx` | Feature grid or alternating rows |
| 2 | Content | 6 differentiators from Business Requirement Plan |
| 3 | Icons | Relevant icon per differentiator |
| 4 | Section heading | "Why Zyphr?" |
| 5 | Animations | Each item fades/slides in as user scrolls into view (staggered) |
| 6 | Accent highlights | Purple/champagne color accents on titles or icons |

#### Validation Checkpoint

```
✅ All 6 differentiators display with correct titles and descriptions
✅ Icons render properly
✅ Scroll-reveal animation fires with stagger effect
✅ Responsive layout works
✅ Colors match brand palette
```

---

### Phase F13: Home — Leadership Team

**Branch:** `feature/F13-home-leadership`  
**Goal:** 4 executive profile cards with hover interaction

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `LeadershipTeam.tsx` | Horizontal row of 4 profile cards |
| 2 | Card content | Photo placeholder (initial/avatar), name, title |
| 3 | Hover interaction | Card flips or expands to reveal a quote/philosophy |
| 4 | Section heading | "Meet Our Leadership" |
| 5 | Glass card style | Glassmorphism with gradient border |
| 6 | Entrance animation | Cards slide up sequentially (staggered) on scroll |

#### Validation Checkpoint

```
✅ 4 leadership cards render with correct names and titles
✅ Photo placeholders display (initials or avatar icons)
✅ Hover flip/expand reveals quote
✅ Staggered entrance animation works
✅ Responsive: 2×2 grid on tablet, vertical stack on mobile
```

---

### Phase F14: Home — Portfolio Placeholder

**Branch:** `feature/F14-home-portfolio`  
**Goal:** Hidden portfolio section controlled by a config flag

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `PortfolioPlaceholder.tsx` | Section with placeholder project cards |
| 2 | Config flag | Import `SHOW_PORTFOLIO` from `config.ts` |
| 3 | Conditional render | Render only if `SHOW_PORTFOLIO === true` |
| 4 | Placeholder content | 3-4 placeholder project cards with "Coming Soon" style |
| 5 | Design | Horizontal scrolling cards with cover images and overlay text |

#### Validation Checkpoint

```
✅ With SHOW_PORTFOLIO = false → section is NOT visible on the page
✅ With SHOW_PORTFOLIO = true → section renders with placeholder cards
✅ Set back to false for production
```

---

### Phase F15: Home — CTA Banner

**Branch:** `feature/F15-home-cta`  
**Goal:** Bold call-to-action banner driving visitors to contact

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `CtaBanner.tsx` | Full-width section with gradient background |
| 2 | Background effect | Animated particles or subtle aurora effect |
| 3 | Headline | "Have a Dream? Let's Build It Together." |
| 4 | Sub-text | "No idea is too small, no vision is too bold..." |
| 5 | CTA button | "Contact Us" — large, glowing, animated pulse |
| 6 | Text animation | Fade in on scroll |

#### Validation Checkpoint

```
✅ Banner spans full width with gradient background
✅ Background animation is subtle and smooth
✅ Headline and sub-text display correctly
✅ CTA button links to /contact
✅ Button has glowing pulse animation
✅ Text fades in on scroll
```

---

### Phase F16: Home — Assembly & Polish

**Branch:** `feature/F16-home-assembly`  
**Goal:** Assemble all home sections into the final page and polish

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Assemble `page.tsx` | Import and arrange all sections in correct order |
| 2 | Section order | Hero → About Snapshot → Services → Why Choose → Leadership → (Portfolio hidden) → CTA Banner |
| 3 | Section spacing | Verify consistent vertical padding/margins between sections |
| 4 | Scroll flow | Test full-page scroll experience — parallax, reveals, transitions |
| 5 | Color transitions | Ensure gradient backgrounds flow naturally between sections |
| 6 | Performance check | Verify no jank, smooth 60fps animations |
| 7 | Mobile walkthrough | Complete scroll-through on mobile viewport |

#### Validation Checkpoint

```
✅ All sections render in correct order
✅ Consistent spacing between sections
✅ Parallax scrolling is smooth throughout
✅ All scroll-reveal animations fire at correct times
✅ Color/gradient transitions between sections are seamless
✅ No layout shifts or visual glitches
✅ Full mobile walkthrough looks great
✅ Page load animation (hero entrance) works on refresh
```

---

### Phase F17: About — Hero Banner

**Branch:** `feature/F17-about-hero`  
**Goal:** About page hero section with parallax

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `AboutHero.tsx` | Dark gradient with "Z" watermark |
| 2 | Headline | "The Story Behind the Sapphire" |
| 3 | Sub-headline | "Born from a belief that no idea should be left behind." |
| 4 | Parallax | Background moves at different speed from content |
| 5 | Text animation | Fade-in on page load |

#### Validation Checkpoint

```
✅ Hero renders with gradient and watermark
✅ Text content correct
✅ Parallax effect working
✅ Animation on load
```

---

### Phase F18: About — Story, Vision & Mission

**Branch:** `feature/F18-about-story-vision`  
**Goal:** Our Story narrative and Vision/Mission glassmorphism cards

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `OurStory.tsx` | Full-width narrative section with accent visuals |
| 2 | Story content | Origin story from Business Requirement Plan |
| 3 | Build `VisionMission.tsx` | Two side-by-side glassmorphism cards |
| 4 | Vision card | Telescope/star icon, full vision statement |
| 5 | Mission card | Compass/path icon, full mission statement |
| 6 | Card animation | Rise into view on scroll with subtle glow |

#### Validation Checkpoint

```
✅ Our Story reads well with proper typography
✅ Vision and Mission cards render side by side (stack on mobile)
✅ Glassmorphism effect on cards
✅ Icons display correctly
✅ Scroll animation triggers properly
```

---

### Phase F19: About — Values & Culture

**Branch:** `feature/F19-about-values-culture`  
**Goal:** Company values grid and culture section

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `Values.tsx` | Grid of 6 value cards with icons |
| 2 | Values content | Brilliance, Partnership, Trust, Innovation, Inclusivity, Lasting Impact |
| 3 | Build `Culture.tsx` | Company culture narrative section |
| 4 | Culture content | Working at Zyphr, team values, collaboration |
| 5 | Animations | Staggered card entrance, text fade-in |

#### Validation Checkpoint

```
✅ All 6 values render with icons and descriptions
✅ Culture section reads naturally
✅ Animations work on scroll
✅ Responsive layout
```

---

### Phase F20: About — Leadership Detailed

**Branch:** `feature/F20-about-leadership`  
**Goal:** Expanded leadership section with bios

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `LeadershipDetailed.tsx` | Larger cards or dedicated blocks per leader |
| 2 | Content per person | Photo placeholder, name, title, bio (3-4 sentences), LinkedIn link placeholder |
| 3 | Section heading | "The People Behind Zyphr" |
| 4 | Animation | Staggered entrance |

#### Validation Checkpoint

```
✅ All 4 leaders display with expanded content
✅ Photo placeholders visible
✅ Bio text renders properly
✅ LinkedIn link placeholders present
✅ Staggered animation works
```

---

### Phase F21: About — Assembly & Polish

**Branch:** `feature/F21-about-assembly`  
**Goal:** Assemble and polish the complete About page

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Assemble `about/page.tsx` | Hero → Story → Vision/Mission → Values → Leadership → Culture |
| 2 | Section spacing | Consistent padding and margins |
| 3 | Scroll flow | Test full scroll experience |
| 4 | Mobile walkthrough | Verify responsive layout |

#### Validation Checkpoint

```
✅ All sections in correct order
✅ Smooth scroll experience
✅ Animations fire correctly
✅ Mobile layout works perfectly
✅ Navigation to and from About page works
```

---

### Phase F22: Services — Hero Banner

**Branch:** `feature/F22-services-hero`  
**Goal:** Services page hero

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `ServicesHero.tsx` | Gradient background with code/circuit pattern overlay |
| 2 | Headline | "Solutions That Turn Vision Into Reality" |
| 3 | Sub-headline | "From concept to code to cloud — we've got you covered." |
| 4 | Animation | Text entrance animation |

#### Validation Checkpoint

```
✅ Hero renders with gradient and pattern overlay
✅ Text content correct
✅ Animation works
```

---

### Phase F23: Services — Full Service Grid

**Branch:** `feature/F23-services-grid`  
**Goal:** All 16 services displayed with interactive cards

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `ServiceGrid.tsx` | Responsive grid of all 16 services |
| 2 | Card design | Icon, title, description — glassmorphism card |
| 3 | Interaction | Card click/hover expands to show full description |
| 4 | Data source | Pull from `constants.ts` services array |
| 5 | Grid layout | 3 columns desktop, 2 tablet, 1 mobile |
| 6 | Staggered entrance | Cards animate in on scroll |

#### Validation Checkpoint

```
✅ All 16 services render
✅ Each card has icon, title, and description
✅ Card expansion/hover interaction works
✅ Grid responsive at all breakpoints
✅ Staggered animation works
```

---

### Phase F24: Services — Our Process Timeline

**Branch:** `feature/F24-services-process`  
**Goal:** 6-step visual process timeline

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `ProcessTimeline.tsx` | Horizontal timeline (vertical on mobile) |
| 2 | Steps | Discovery → Design → Develop → Test → Deploy → Support |
| 3 | Step design | Number, icon, title, description, connecting line |
| 4 | Animation | Steps animate sequentially on scroll |
| 5 | Section heading | "Our Process" or "How We Work" |

#### Validation Checkpoint

```
✅ All 6 steps render with correct content
✅ Timeline flows horizontally (desktop) / vertically (mobile)
✅ Connecting lines between steps visible
✅ Sequential scroll animation works
```

---

### Phase F25: Services — CTA Section

**Branch:** `feature/F25-services-cta`  
**Goal:** Quote CTA at bottom of services page

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `ServicesCta.tsx` | Gradient background with headline and button |
| 2 | Headline | "Ready to Bring Your Idea to Life?" |
| 3 | Sub-text | "Tell us about your project — big or small..." |
| 4 | CTA button | "Get a Free Quote" → /contact |

#### Validation Checkpoint

```
✅ CTA section renders with gradient
✅ Button links to /contact
✅ Text content correct
```

---

### Phase F26: Services — Assembly & Polish

**Branch:** `feature/F26-services-assembly`  
**Goal:** Assemble and polish the complete Services page

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Assemble `services/page.tsx` | Hero → Service Grid → Process Timeline → CTA |
| 2 | Section spacing | Consistent padding |
| 3 | Scroll flow | Full page walkthrough |
| 4 | Mobile walkthrough | Responsive verification |

#### Validation Checkpoint

```
✅ All sections in correct order
✅ Smooth scroll experience
✅ All 16 services visible
✅ Process timeline works
✅ CTA links correctly
✅ Mobile layout verified
```

---

### Phase F27: Contact — Hero Banner

**Branch:** `feature/F27-contact-hero`  
**Goal:** Contact page hero

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `ContactHero.tsx` | Animated gradient with particle effects |
| 2 | Headline | "Every Great Journey Starts With a Conversation" |
| 3 | Sub-headline | "No dream is too small. No vision is too bold. We're here to listen." |

#### Validation Checkpoint

```
✅ Hero renders with animated gradient
✅ Text content correct and emotionally engaging
```

---

### Phase F28: Contact — Form

**Branch:** `feature/F28-contact-form`  
**Goal:** Contact form with validation and styling

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `ContactForm.tsx` | Complete form with all fields |
| 2 | Fields | Full Name (required), Email (required), Company (optional), Service dropdown (optional), Budget dropdown (optional), Message textarea (required) |
| 3 | Service dropdown | All 16 services + "Not Sure Yet" + "Other" |
| 4 | Budget dropdown | Ranges: "< $5K", "$5K–$15K", "$15K–$50K", "$50K–$100K", "$100K+", "Let's Discuss" |
| 5 | Honeypot field | Hidden field for bot detection |
| 6 | Client-side validation | Required field checks, email format validation |
| 7 | Error states | Per-field error messages below fields |
| 8 | Focus animation | Border color transition + glow on focus |
| 9 | Submit button | "Let's Build Something Amazing" with hover + loading states |
| 10 | Form styling | Glassmorphism form container, dark input fields with accent borders |

#### Validation Checkpoint

```
✅ All form fields render correctly
✅ Dropdowns contain all options
✅ Required field validation works (submit with empty fields)
✅ Email format validation works
✅ Error messages display below corresponding fields
✅ Focus animation on fields
✅ Honeypot field is hidden (not visible to users)
✅ Submit button hover state works
✅ Form visually matches site design
```

---

### Phase F29: Contact — API Integration

**Branch:** `feature/F29-contact-api-integration`  
**Goal:** Connect the form to the Lambda backend

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Form submission handler | POST form data as JSON to Lambda API endpoint |
| 2 | Loading state | Button transforms to spinner during submission |
| 3 | Success state | Display confirmation message with animation (sparkle/confetti) |
| 4 | Error state | Display error message with retry option |
| 5 | Environment variable | Read API URL from `NEXT_PUBLIC_CONTACT_API_URL` |
| 6 | Request sanitization | Trim inputs before sending |

#### Validation Checkpoint

```
✅ Form submits to Lambda endpoint
✅ Loading spinner shows during submission
✅ Success message displays on 200 response
✅ Error message displays on failure (test by using wrong URL)
✅ Retry button works after error
✅ Email received at Zyphr inbox with correct data
✅ Honeypot submission silently "succeeds" without sending email
```

---

### Phase F30: Contact — Supplementary Sections

**Branch:** `feature/F30-contact-info`  
**Goal:** Email display, social links, and inspirational closing

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `ContactInfo.tsx` | Email display with copy-to-clipboard |
| 2 | Copy button | Copies email to clipboard, shows "Copied!" feedback |
| 3 | Social media links | LinkedIn, Twitter/X, Instagram, Facebook with icons |
| 4 | Social hover | Brand color fill + bounce animation |
| 5 | Inspirational closing | Quote: "The best time to start was yesterday. The next best time is now." with subtle background animation |

#### Validation Checkpoint

```
✅ Email displays correctly
✅ Copy button copies to clipboard and shows feedback
✅ Social links open in new tabs
✅ Social icon hover animation works
✅ Closing quote renders with background animation
```

---

### Phase F31: Contact — Assembly & Polish

**Branch:** `feature/F31-contact-assembly`  
**Goal:** Assemble and polish the complete Contact page

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Assemble `contact/page.tsx` | Hero → Form → Contact Info → Social → Closing |
| 2 | Layout | Form prominence — form should be the visual focus |
| 3 | Spacing | Consistent padding |
| 4 | Full form test | Complete submission flow test |
| 5 | Mobile walkthrough | Form usability on mobile |

#### Validation Checkpoint

```
✅ All sections in correct order
✅ Form is the primary visual focus
✅ Full submission flow works end-to-end
✅ Mobile form is usable and well-laid-out
```

---

### Phase F32: Cookie Policy Page

**Branch:** `feature/F32-cookie-policy`  
**Goal:** Cookie policy content page

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Build `cookie-policy/page.tsx` | Clean, readable layout |
| 2 | Content | Cookie types, what they're used for, how to manage preferences |
| 3 | Tone | Simple, clear language — minimal legal jargon |
| 4 | Style | Dark background, good typography hierarchy |
| 5 | Link back | Link to managing cookies in browser settings |

#### Validation Checkpoint

```
✅ Page renders with all content
✅ Content is readable and well-structured
✅ Navigation to/from page works
✅ Page matches site aesthetic
```

---

### Phase F33: SEO & Metadata

**Branch:** `feature/F33-seo`  
**Goal:** Complete SEO implementation across all pages

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Per-page metadata | Unique `<title>` and `<meta description>` for each page via Next.js `metadata` export |
| 2 | Open Graph tags | `og:title`, `og:description`, `og:image`, `og:url`, `og:type` per page |
| 3 | Twitter Card tags | `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` per page |
| 4 | JSON-LD | Organization schema on home page |
| 5 | Generate `sitemap.xml` | Static sitemap (exclude hidden portfolio page) |
| 6 | Create `robots.txt` | Allow all crawlers, reference sitemap |
| 7 | Canonical URLs | Set on all pages |
| 8 | Portfolio noindex | Add `noindex` meta to portfolio route (when activated) |
| 9 | Verify `<h1>` tags | Exactly one `<h1>` per page |
| 10 | Verify alt text | All images have descriptive alt attributes |
| 11 | Semantic HTML check | Verify `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>` usage |
| 12 | OG image | Create a default social sharing image (Zyphr branding) |

#### Validation Checkpoint

```
✅ View page source — unique title and meta description per page
✅ OG tags present (test with social media preview tools)
✅ Twitter Card tags present
✅ JSON-LD renders in page source (home page)
✅ /sitemap.xml accessible and lists all active pages
✅ /robots.txt accessible and properly configured
✅ Only one <h1> per page
✅ All images have alt text
✅ Semantic HTML elements used throughout
```

---

### Phase F34: Page Load Animation

**Branch:** `feature/F34-page-load-animation`  
**Goal:** Loading screen with "Z" logo animation and page transitions

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Loading screen | Full-screen dark overlay with "Z" logo forming from particles or drawing itself |
| 2 | Timing | 1.5–2 seconds on initial load, then fade away to reveal content |
| 3 | Session check | Only show on first page load (not on every navigation) |
| 4 | Page transitions | Smooth fade/slide between page navigations |
| 5 | Page transition integration | Ensure Framer Motion `AnimatePresence` wraps page content |

#### Validation Checkpoint

```
✅ Loading animation plays on first visit
✅ Logo animation is smooth and brand-aligned
✅ Content is revealed after animation completes
✅ Loading animation does not replay on page navigation
✅ Page-to-page transitions are smooth
✅ No flash of unstyled content
```

---

### Phase F35: Responsive & Cross-Browser

**Branch:** `feature/F35-responsive`  
**Goal:** Verify and fix responsive layout and cross-browser compatibility

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Desktop test | Full walkthrough at 1440px, 1920px |
| 2 | Tablet test | Full walkthrough at 768px, 1024px (portrait + landscape) |
| 3 | Mobile test | Full walkthrough at 375px (iPhone SE), 390px (iPhone 14), 412px (Pixel) |
| 4 | Touch interactions | Verify hover effects degrade gracefully on touch devices |
| 5 | Custom cursor | Confirm disabled on touch/mobile |
| 6 | Animation reduction | Confirm `prefers-reduced-motion` disables/reduces animations |
| 7 | Chrome test | Full walkthrough |
| 8 | Firefox test | Full walkthrough |
| 9 | Safari test | Full walkthrough (check `backdrop-filter` support) |
| 10 | Edge test | Full walkthrough |
| 11 | Fix issues | Resolve any layout, overflow, or interaction issues found |

#### Validation Checkpoint

```
✅ All pages look correct at every breakpoint
✅ No horizontal overflow on any page at any size
✅ Touch interactions work on mobile
✅ Custom cursor disabled on mobile
✅ Reduced motion respected
✅ Works in Chrome, Firefox, Safari, Edge
✅ No glassmorphism rendering issues in any browser
```

---

### Phase F36: Performance Optimization

**Branch:** `feature/F36-performance`  
**Goal:** Optimize for Lighthouse score > 80

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Lighthouse audit | Run Lighthouse on all pages (Performance, SEO, Accessibility, Best Practices) |
| 2 | Image optimization | Verify all images use next/image with WebP/AVIF, proper sizing |
| 3 | Lazy loading | Verify below-the-fold content and images are lazy loaded |
| 4 | Bundle analysis | Run `next build` and analyze bundle sizes |
| 5 | Code splitting | Verify dynamic imports for heavy components (particles, animations) |
| 6 | Font optimization | Verify font loading via next/font (no layout shift) |
| 7 | CSS purge | Verify Tailwind purges unused styles in production |
| 8 | Animation performance | Verify animations use `transform`/`opacity` only (GPU-accelerated) |
| 9 | Skeleton/placeholder | Add loading skeletons for any async content |
| 10 | Cache headers | Verify static assets have proper cache headers for CloudFront |
| 11 | Fix issues | Address any Lighthouse recommendations below target |

#### Lighthouse Targets

| Metric | Target |
|--------|--------|
| Performance | > 80 |
| SEO | > 90 |
| Accessibility | > 80 |
| Best Practices | > 80 |

#### Validation Checkpoint

```
✅ Lighthouse Performance score > 80 on all pages
✅ Lighthouse SEO score > 90 on all pages
✅ FCP < 2.0s
✅ LCP < 3.0s
✅ CLS < 0.1
✅ No render-blocking resources
✅ All images properly optimized
✅ Bundle size is reasonable
```

---

### Phase F37: Final Integration Testing

**Branch:** `feature/F37-final-testing`  
**Goal:** Complete end-to-end validation of the entire website

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Full desktop walkthrough | Navigate every page, click every link, test every interaction |
| 2 | Full mobile walkthrough | Same as above on mobile viewport |
| 3 | Navigation test | All nav links, footer links, CTA buttons, internal links |
| 4 | Contact form test | Full submission, validation errors, success/error states |
| 5 | Cookie consent test | Fresh visit flow, accept, manage, persistence |
| 6 | External links test | Social media links open correctly in new tabs |
| 7 | 404 test | Visit non-existent route — verify graceful handling |
| 8 | SEO final check | Validate sitemap, robots.txt, meta tags |
| 9 | Performance final check | Final Lighthouse audit |
| 10 | Console check | Zero console errors or warnings across all pages |
| 11 | Portfolio hidden check | Confirm portfolio section is not visible |

#### Validation Checkpoint — FINAL

```
✅ All pages render correctly
✅ All links work (no broken links)
✅ Contact form works end-to-end
✅ Cookie consent works correctly
✅ All animations are smooth
✅ All hover effects work
✅ Custom cursor works on desktop
✅ Responsive at all breakpoints
✅ Cross-browser compatible
✅ Lighthouse scores meet targets
✅ Zero console errors
✅ Portfolio is hidden
✅ SEO is complete
✅ Website is ready for deployment
```

---

## 5. Deployment Phase

### Phase D1: Production Deployment

**Branch:** `develop` → merge to `main`  
**Goal:** Deploy the website to production on AWS

#### Tasks

| # | Task | Details |
|---|------|---------|
| 1 | Create S3 bucket | Private bucket for static hosting |
| 2 | Build production | `npm run build` → static output |
| 3 | Upload to S3 | Upload build output to S3 bucket |
| 4 | Create CloudFront distribution | Origin: S3, SSL: ACM certificate, domain: zyphr.co.in |
| 5 | Request ACM certificate | For zyphr.co.in and www.zyphr.co.in — add CNAME record in GoDaddy for validation |
| 6 | Configure GoDaddy DNS | CNAME record for zyphr.co.in → CloudFront distribution domain |
| 7 | CloudFront behaviors | Cache headers per asset type (see SRS caching strategy) |
| 8 | CloudFront security headers | X-Content-Type-Options, X-Frame-Options, HSTS, etc. |
| 9 | Deploy Lambda | Upload function, configure API Gateway, set environment variables |
| 10 | Set production env vars | `ALLOWED_ORIGIN=https://zyphr.co.in` |
| 11 | SES production | Verify domain, request production access if still in sandbox |
| 12 | Test production | Full walkthrough on live URL |
| 13 | GitHub Actions CI/CD | (Optional) Set up automated deploy on push to `main` |
| 14 | Merge to main | Merge `develop` → `main` |

#### Deployment Validation

```
✅ https://zyphr.co.in loads correctly
✅ HTTPS working (no mixed content warnings)
✅ All pages accessible via navigation
✅ Contact form works on production
✅ Email received from production submission
✅ CloudFront caching working
✅ Social media sharing preview works (OG tags)
✅ Google Analytics tracking (after cookie acceptance)
✅ DNS resolves correctly
✅ www.zyphr.co.in redirects to zyphr.co.in (or vice versa)
```

---

## 6. Validation Checklist Template

Use this template after completing each phase before proceeding to the next.

```
Phase: [Phase ID — Phase Name]
Date: [Date]
Branch: [Branch name]

Pre-check:
[ ] Code compiles without errors (npm run build)
[ ] No ESLint errors or warnings
[ ] No TypeScript errors
[ ] No browser console errors

Visual check:
[ ] Component/page renders correctly at 1440px (desktop)
[ ] Component/page renders correctly at 768px (tablet)
[ ] Component/page renders correctly at 375px (mobile)

Interaction check:
[ ] All hover effects working
[ ] All click interactions working
[ ] All animations triggering correctly
[ ] All links navigating correctly

Phase-specific checks:
[ ] [Phase-specific item 1]
[ ] [Phase-specific item 2]
[ ] ...

Merge:
[ ] Committed to feature branch
[ ] Merged to develop
[ ] Verified on develop branch
```

---

*This implementation plan is designed for incremental, validated development. Each phase produces a visible, testable result. No phase should be started until the previous phase passes validation.*

---
