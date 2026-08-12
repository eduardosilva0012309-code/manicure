import { supabase } from './supabase';
import type { SiteConfig, Module, Testimonial, Faq, CTA } from './types';

export async function fetchSiteConfig(): Promise<SiteConfig | null> {
  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  return data as SiteConfig | null;
}

export async function fetchModules(): Promise<Module[]> {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Module[];
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

export async function fetchFaqs(): Promise<Faq[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Faq[];
}

export async function fetchCtas(): Promise<CTA[]> {
  const { data, error } = await supabase
    .from('ctas')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as CTA[];
}

export async function fetchAllContent() {
  const [config, modules, testimonials, faqs, ctas] = await Promise.all([
    fetchSiteConfig(),
    fetchModules(),
    fetchTestimonials(),
    fetchFaqs(),
    fetchCtas(),
  ]);
  return { config, modules, testimonials, faqs, ctas };
}

export function ctaByKey(ctas: CTA[], key: string): CTA | undefined {
  return ctas.find((c) => c.key === key);
}
