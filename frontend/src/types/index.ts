export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  featured: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  quote: string;
  bio: string;
  linkedIn?: string;
  image?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  website: string; // honeypot
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface Value {
  title: string;
  description: string;
  icon: string;
}
