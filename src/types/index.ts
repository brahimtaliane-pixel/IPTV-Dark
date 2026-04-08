// ============================================================
// IPTV Suisse - Type Definitions
// ============================================================

export interface Plan {
  id: string;
  slug: string;
  duration: number; // months
  price: number; // CHF
  original_price?: number;
  devices: number;
  features: string[];
  payment_link: string;
  is_popular: boolean;
  is_active: boolean;
  name_fr: string;
  name_de: string;
  description_fr: string;
  description_de: string;
  created_at: string;
}

export interface Lead {
  id: string;
  plan_id: string;
  plan_name: string;
  customer_name: string;
  phone: string;
  email: string;
  locale: string;
  status: 'pending' | 'email_sent' | 'clicked' | 'converted';
  payment_link?: string;
  click_count: number;
  payment_clicked_at?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  email_sent_at?: string;
}

export interface FAQ {
  id: string;
  question_fr: string;
  question_de: string;
  answer_fr: string;
  answer_de: string;
  category: string;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text_fr: string;
  text_de: string;
  avatar_url?: string;
  is_featured: boolean;
}

export type Locale = 'fr' | 'de';

export interface NavItem {
  label: string;
  href: string;
}
