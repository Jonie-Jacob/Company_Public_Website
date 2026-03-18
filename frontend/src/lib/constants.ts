import type { NavLink, Service, TeamMember, SocialLink, ProcessStep, Value } from "@/types";

// --- Navigation ---

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

// --- Social Media ---

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: "LinkedIn", url: "https://linkedin.com/company/zyphr", icon: "linkedin" },
  { platform: "Twitter", url: "https://x.com/zyphr", icon: "twitter" },
  { platform: "Instagram", url: "https://instagram.com/zyphr", icon: "instagram" },
  { platform: "Facebook", url: "https://facebook.com/zyphr", icon: "facebook" },
];

// --- Services ---

export const SERVICES: Service[] = [
  {
    id: "custom-software",
    title: "Custom Software Development",
    description:
      "Bespoke software solutions designed from the ground up to address your unique business challenges. We build systems that fit your workflow — not the other way around.",
    icon: "code",
    featured: true,
  },
  {
    id: "web-mobile-apps",
    title: "Web & Mobile Applications",
    description:
      "Cross-platform and native applications for iOS, Android, and the web — engineered for performance, usability, and scale.",
    icon: "smartphone",
    featured: true,
  },
  {
    id: "cloud-solutions",
    title: "Cloud Solutions",
    description:
      "Architecture, migration, and management of cloud infrastructure on AWS, Azure, GCP, and more. Scalable, secure, and cost-optimized.",
    icon: "cloud",
    featured: true,
  },
  {
    id: "agentic-ai",
    title: "Agentic AI Solutions",
    description:
      "Next-generation software powered by autonomous AI agents that learn, adapt, and make intelligent decisions to streamline your operations.",
    icon: "brain",
    featured: true,
  },
  {
    id: "websites",
    title: "Websites & Web Applications",
    description:
      "From stunning marketing websites to complex web applications — we craft digital experiences that engage, convert, and perform.",
    icon: "globe",
    featured: true,
  },
  {
    id: "api-integration",
    title: "API Development & Integration",
    description:
      "Robust, well-documented APIs and seamless third-party integrations to connect your systems and unlock new capabilities.",
    icon: "plug",
    featured: false,
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design Services",
    description:
      "User-centered design driven by research and empathy. We create interfaces that are intuitive, beautiful, and a joy to use.",
    icon: "palette",
    featured: true,
  },
  {
    id: "saas-development",
    title: "SaaS Product Development",
    description:
      "End-to-end development of subscription-based software products — from MVP to scale-up, with multi-tenancy and billing built in.",
    icon: "layers",
    featured: false,
  },
  {
    id: "ecommerce",
    title: "E-Commerce Solutions",
    description:
      "Feature-rich online stores, marketplaces, and payment integrations that drive sales and deliver seamless shopping experiences.",
    icon: "shopping-cart",
    featured: true,
  },
  {
    id: "devops",
    title: "DevOps & CI/CD",
    description:
      "Automated pipelines, infrastructure as code, and deployment strategies that accelerate delivery and improve reliability.",
    icon: "git-branch",
    featured: false,
  },
  {
    id: "data-analytics",
    title: "Data Analytics & Business Intelligence",
    description:
      "Turn raw data into actionable insights with custom dashboards, reporting tools, and data-driven decision frameworks.",
    icon: "bar-chart",
    featured: false,
  },
  {
    id: "crm-erp",
    title: "CRM / ERP Solutions",
    description:
      "Customer relationship and enterprise resource planning systems tailored to your business processes and growth trajectory.",
    icon: "users",
    featured: false,
  },
  {
    id: "iot",
    title: "IoT Solutions",
    description:
      "Connected device ecosystems — from sensor firmware to cloud dashboards — that bring the physical and digital worlds together.",
    icon: "cpu",
    featured: false,
  },
  {
    id: "legacy-modernization",
    title: "Legacy System Modernization",
    description:
      "Breathe new life into outdated systems. We migrate, refactor, and re-architect legacy software for the modern era.",
    icon: "refresh-cw",
    featured: false,
  },
  {
    id: "digital-transformation",
    title: "Digital Transformation",
    description:
      "A complete digital overhaul — strategy, technology, and change management — to transform how your organization operates.",
    icon: "zap",
    featured: true,
  },
  {
    id: "maintenance-support",
    title: "Maintenance & Support",
    description:
      "Ongoing monitoring, updates, bug fixes, and performance optimization to keep your systems running at their best.",
    icon: "shield",
    featured: false,
  },
];

export const FEATURED_SERVICES = SERVICES.filter((s) => s.featured);

// --- Leadership Team ---

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "adarsh",
    name: "Adarsh S",
    role: "Chief Executive Officer",
    quote: "Every great achievement begins with the belief that it's possible.",
    bio: "As the CEO of Zyphr, Adarsh leads the company's vision and strategy with an unwavering belief that technology can turn any dream into reality. His leadership is rooted in partnership, innovation, and a commitment to making the impossible possible.",
    linkedIn: "",
  },
  {
    id: "christy",
    name: "Christy Antony",
    role: "Chief Financial Officer",
    quote: "Sustainable growth is built on trust, transparency, and smart decisions.",
    bio: "Christy oversees Zyphr's financial strategy and operations, ensuring sustainable growth while maintaining the agility needed to innovate. Her approach combines fiscal discipline with a deep understanding of technology investments.",
    linkedIn: "",
  },
  {
    id: "advaith",
    name: "Advaith T",
    role: "Chief Marketing Officer",
    quote: "A powerful story told right can change the world.",
    bio: "Advaith drives Zyphr's brand narrative and market presence, crafting compelling stories that connect with audiences worldwide. He believes in the power of authentic communication to build lasting relationships.",
    linkedIn: "",
  },
  {
    id: "jonie",
    name: "Jonie Jacob",
    role: "Chief Technology Officer",
    quote: "Technology is at its best when it makes the impossible feel effortless.",
    bio: "Jonie leads Zyphr's technical vision, architecting solutions that push the boundaries of what's possible. From Agentic AI to cloud-native systems, he ensures Zyphr stays at the cutting edge of innovation.",
    linkedIn: "",
  },
];

// --- Process Steps ---

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery",
    description: "We listen, understand your vision, and define the scope together.",
    icon: "search",
  },
  {
    number: "02",
    title: "Design",
    description: "We craft user experiences and system architectures that align with your goals.",
    icon: "pen-tool",
  },
  {
    number: "03",
    title: "Develop",
    description: "Our engineers bring the design to life with clean, scalable, and secure code.",
    icon: "code",
  },
  {
    number: "04",
    title: "Test",
    description: "Rigorous quality assurance to ensure everything works flawlessly.",
    icon: "check-circle",
  },
  {
    number: "05",
    title: "Deploy",
    description: "Smooth launch to production with zero headaches.",
    icon: "rocket",
  },
  {
    number: "06",
    title: "Support",
    description: "We stay with you — ongoing maintenance, updates, and partnership.",
    icon: "heart",
  },
];

// --- Company Values ---

export const VALUES: Value[] = [
  {
    title: "Brilliance",
    description: "We pursue excellence in every line of code, every design, every interaction.",
    icon: "star",
  },
  {
    title: "Partnership",
    description:
      "We are not just service providers — we are co-creators of your success.",
    icon: "handshake",
  },
  {
    title: "Trust",
    description:
      "Transparency, honesty, and reliability are the foundation of everything we do.",
    icon: "gem",
  },
  {
    title: "Innovation",
    description:
      "We embrace the new, the bold, and the unconventional to push boundaries.",
    icon: "rocket",
  },
  {
    title: "Inclusivity",
    description:
      "Every dream matters. We serve individuals, startups, enterprises, and governments with equal dedication.",
    icon: "globe",
  },
  {
    title: "Lasting Impact",
    description:
      "We build solutions designed to endure, grow, and create real value over time.",
    icon: "infinity",
  },
];

// --- Budget Options ---

export const BUDGET_OPTIONS = [
  "< $5K",
  "$5K – $15K",
  "$15K – $50K",
  "$50K – $100K",
  "$100K+",
  "Let's Discuss",
];

// --- Company Info ---

export const COMPANY = {
  name: "Zyphr",
  tagline: "Empowering Dreams. Engineering Reality.",
  subtitle: "Innovation & Technology",
  email: "contact@zyphr.co.in",
  domain: "zyphr.co.in",
  copyright: `© ${new Date().getFullYear()} Zyphr Innovation & Technology. All rights reserved.`,
  vision:
    "Like an ever-shining sapphire in the vast cyber world, Zyphr aspires to radiate brilliance, trust, and enduring innovation. We envision a future where ideas once set aside as impossible find their path to reality, as we walk hand in hand with our customers — transforming challenges into achievements and dreams into lasting digital legacies.",
  mission:
    "At Zyphr, our mission is to turn the ideas that many consider difficult or impossible into meaningful digital realities. We stand beside our customers at every step of their journey, delivering innovative, reliable, and accessible technology that brings their visions to life with complete satisfaction. Together with our customers, we build solutions that empower dreams, simplify complexity, and create lasting impact.",
};
