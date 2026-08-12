import { useEffect, useState, useCallback } from 'react';
import { fetchAllContent } from './content';
import type { SiteConfig, Module, Testimonial, Faq, CTA } from './types';

interface ContentState {
  config: SiteConfig | null;
  modules: Module[];
  testimonials: Testimonial[];
  faqs: Faq[];
  ctas: CTA[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useContent(): ContentState {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [ctas, setCtas] = useState<CTA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllContent();
      setConfig(data.config);
      setModules(data.modules);
      setTestimonials(data.testimonials);
      setFaqs(data.faqs);
      setCtas(data.ctas);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar conteúdo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { config, modules, testimonials, faqs, ctas, loading, error, reload: load };
}
