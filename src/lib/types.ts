export interface SiteConfig {
  id: number;
  hero_headline: string;
  hero_subheadline: string;
  hero_microcopy: string;
  hero_image_url: string | null;
  benefits_title: string;
  benefits: string[];
  for_whom_title: string;
  for_whom: string[];
  objection_title: string;
  objection_text: string;
  offer_title: string;
  offer_price: string;
  offer_old_price: string;
  offer_condition: string;
  offer_text: string;
  offer_bonus: string;
  offer_includes: string[];
  guarantee_title: string;
  guarantee_text: string;
  final_cta_headline: string;
  final_cta_text: string;
  color_primary: string;
  color_secondary: string;
  color_button: string;
  color_button_text: string;
  color_text: string;
  color_background: string;
  color_card: string;
  color_highlight: string;
  font_heading: string;
  font_body: string;
  font_base_size: string;
  font_heading_weight: string;
  font_body_weight: string;
  font_letter_spacing: string;
  font_line_height: string;
  seo_title: string;
  seo_description: string;
  seo_og_image: string | null;
  google_analytics: string | null;
  meta_pixel: string | null;
  google_tag_manager: string | null;
  dark_mode_enabled: boolean;
  dark_color_background: string;
  dark_color_text: string;
  dark_color_card: string;
  dark_color_highlight: string;
  social_instagram: string | null;
  social_facebook: string | null;
  social_whatsapp: string | null;
  social_youtube: string | null;
  social_tiktok: string | null;
  social_email: string | null;
  updated_at: string;
}

export interface Module {
  id: string;
  number: string;
  title: string;
  description: string;
  image_url: string | null;
  icon: string;
  is_bonus: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  photo_url: string | null;
  text: string;
  result: string;
  rating: number;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CTA {
  id: string;
  key: string;
  label: string;
  url: string;
  color: string;
  icon: string;
  open_new_tab: boolean;
  is_active: boolean;
  section: string;
  is_custom: boolean;
  created_at: string;
}

export type CTAKey = 'hero' | 'offer' | 'final' | 'floating';
