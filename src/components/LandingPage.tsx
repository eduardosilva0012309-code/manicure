import { useState, useEffect } from 'react';
import { Star, CheckCircle2, Shield, Award, Clock, PlayCircle, Smartphone, Heart, ChevronDown, Sparkles, Moon, Sun, Instagram, Facebook, Youtube, Music2, Mail, MessageCircle } from 'lucide-react';
import type { SiteConfig, Module, Testimonial, Faq, CTA } from '@/lib/types';
import CtaButton from './CtaButton';
import TestimonialCarousel from './TestimonialCarousel';
import { getIcon } from '@/lib/icons';

interface Props {
  config: SiteConfig;
  modules: Module[];
  testimonials: Testimonial[];
  faqs: Faq[];
  ctas: CTA[];
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function LandingPage({ config, modules, testimonials, faqs, ctas, darkMode = false, onToggleDarkMode }: Props) {
  const heroCta = ctas.find((c) => c.key === 'hero');
  const offerCta = ctas.find((c) => c.key === 'offer');
  const finalCta = ctas.find((c) => c.key === 'final');
  const floatingCta = ctas.find((c) => c.key === 'floating');
  const activeModules = modules.filter((m) => m.is_active);
  const activeFaqs = faqs.filter((f) => f.is_active);
  const customCtas = ctas.filter((c) => c.is_custom && c.is_active);
  const custom = (section: string) => customCtas.filter((cta) => cta.section === section);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark-mode' : ''}`} style={{ background: 'var(--color-background)', color: 'var(--color-text)', transition: 'background-color 300ms ease, color 300ms ease' }}>
      <header className="sticky top-0 z-30 border-b border-rose-100/60 bg-white/85 backdrop-blur-md dark-toggle-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Curso de Manicure</span>
          {config.dark_mode_enabled && onToggleDarkMode && (
            <button type="button" onClick={onToggleDarkMode} aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'} className="inline-flex items-center gap-2 rounded-full border border-rose-100 px-3 py-1.5 text-sm transition hover:bg-rose-50">
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              <span className="hidden sm:inline">{darkMode ? 'Modo claro' : 'Modo escuro'}</span>
            </button>
          )}
        </div>
      </header>
      <Hero config={config} cta={heroCta} customCtas={custom('hero')} />
      <TrustBar customCtas={custom('trust')} />
      <Results testimonials={testimonials} customCtas={custom('results')} />
      <Modules modules={activeModules} customCtas={custom('modules')} />
      <Benefits config={config} customCtas={custom('benefits')} />
      <ForWhom config={config} customCtas={custom('for_whom')} />
      <Objection config={config} customCtas={custom('objection')} />
      <Offer config={config} cta={offerCta} customCtas={custom('offer')} />
      <Guarantee config={config} customCtas={custom('guarantee')} />
      <FaqSection faqs={activeFaqs} customCtas={custom('faq')} />
      <FinalCta config={config} cta={finalCta} customCtas={custom('final')} />
      <Footer config={config} customCtas={custom('footer')} />
      <FloatingCta cta={floatingCta} />
    </div>
  );
}

function Hero({ config, cta, customCtas }: { config: SiteConfig; cta?: CTA; customCtas: CTA[] }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24">
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: 'radial-gradient(circle at 70% 20%, var(--color-highlight), transparent 60%)' }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="text-center lg:text-left animate-fade-in-up">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'var(--color-highlight)', color: 'var(--color-primary)' }}
          >
            <Sparkles className="lucide lucide-sparkles" size={14} /> Curso Online Completo
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-5"
            style={{ fontFamily: `var(--font-heading)`, fontWeight: 'var(--font-heading-weight)' as any, color: 'var(--color-text)' }}
          >
            {config.hero_headline}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl mb-8 opacity-80 max-w-xl mx-auto lg:mx-0">
            {config.hero_subheadline}
          </p>
          <div className="flex flex-col items-center lg:items-start gap-3">
            <CtaButton cta={cta} variant="large" />
            <p className="text-sm opacity-60">{config.hero_microcopy}</p>
          </div>
          <CustomCtaSlot ctas={customCtas} />
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 mt-8 text-sm opacity-70">
            <span className="flex items-center gap-1.5"><Clock size={16} /> No seu ritmo</span>
            <span className="flex items-center gap-1.5"><Smartphone size={16} /> Celular ou computador</span>
            <span className="flex items-center gap-1.5"><Award size={16} /> Certificado</span>
          </div>
        </div>
        <div className="relative animate-fade-in">
          {config.hero_image_url ? (
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src={config.hero_image_url}
                alt="Profissional realizando manicure"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute bottom-4 left-4 right-4 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 shadow-lg"
                style={{ background: 'color-mix(in srgb, var(--color-card) 90%, transparent)' }}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2"
                      style={{ background: 'var(--color-highlight)', borderColor: 'var(--color-card)' }}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text)', opacity: 0.7 }}>Alunas aprendendo com o curso</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl aspect-[4/3] flex items-center justify-center" style={{ background: 'var(--color-highlight)' }}>
              <PlayCircle size={64} style={{ color: 'var(--color-primary)' }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TrustBar({ customCtas }: { customCtas: CTA[] }) {
  return (
    <section className="border-y bg-white/50" style={{ borderColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm opacity-60">
        <CustomCtaSlot ctas={customCtas} />
        <span className="flex items-center gap-2"><Shield size={16} /> Compra segura</span>
        <span className="flex items-center gap-2"><CheckCircle2 size={16} /> Acesso imediato</span>
        <span className="flex items-center gap-2"><Clock size={16} /> Estude no seu ritmo</span>
        <span className="flex items-center gap-2"><Smartphone size={16} /> Acesse de qualquer lugar</span>
        <span className="flex items-center gap-2"><Award size={16} /> Certificado incluso</span>
      </div>
    </section>
  );
}

function Results({ testimonials, customCtas }: { testimonials: Testimonial[]; customCtas: CTA[] }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-primary)' }}>Quem já começou</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            Experiências de quem está aprendendo
          </h2>
          <p className="mt-3 opacity-70 max-w-2xl mx-auto">
            Depoimentos ilustrativos de alunas que estão estudando pelo curso.
          </p>
        </div>
        <TestimonialCarousel testimonials={testimonials} />
        <CustomCtaSlot ctas={customCtas} />
      </div>
    </section>
  );
}

function Modules({ modules, customCtas }: { modules: Module[]; customCtas: CTA[] }) {
  return (
    <section className="py-16 sm:py-24 bg-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-2">Conteúdo do curso</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            O que você vai aprender
          </h2>
          <p className="mt-3 opacity-70 max-w-2xl mx-auto">
            Módulos organizados do básico ao avançado, com bônus para você continuar evoluindo.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m, i) => (
            <ModuleCard key={m.id} module={m} index={i} />
          ))}
        </div>
        <CustomCtaSlot ctas={customCtas} />
      </div>
    </section>
  );
}

function ModuleCard({ module: m, index }: { module: Module; index: number }) {
  const Icon = getIcon(m.icon);
  return (
    <div
      className={`group relative rounded-2xl p-6 border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up ${
        m.is_bonus ? 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200' : 'bg-white border-rose-50'
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {m.is_bonus && (
        <span className="absolute top-4 right-4 text-xs font-bold text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full">
          BÔNUS
        </span>
      )}
      <div className="flex items-start gap-4 mb-3">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white"
          style={{ background: 'var(--color-primary)' }}
        >
          <Icon size={22} />
        </div>
        <div>
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
            {m.is_bonus ? 'Bônus' : `Módulo ${m.number}`}
          </p>
          <h3 className="text-lg font-bold mt-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
            {m.title}
          </h3>
        </div>
      </div>
      {m.description && <p className="text-sm opacity-70 leading-relaxed">{m.description}</p>}
    </div>
  );
}

function Benefits({ config, customCtas }: { config: SiteConfig; customCtas: CTA[] }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-2">Tudo incluso</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {config.benefits_title}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {config.benefits.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl bg-white border border-rose-50 shadow-sm animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CheckCircle2 className="flex-shrink-0 text-rose-500" size={22} />
              <span className="font-medium">{b}</span>
            </div>
          ))}
        </div>
        <CustomCtaSlot ctas={customCtas} />
      </div>
    </section>
  );
}

function ForWhom({ config, customCtas }: { config: SiteConfig; customCtas: CTA[] }) {
  return (
    <section className="py-16 sm:py-24 bg-white/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-2">Público</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {config.for_whom_title}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {config.for_whom.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-6 rounded-2xl bg-white border border-rose-50 shadow-sm hover:shadow-md transition"
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-highlight)', color: 'var(--color-primary)' }}
              >
                <Heart size={18} />
              </div>
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
        <CustomCtaSlot ctas={customCtas} />
      </div>
    </section>
  );
}

function Objection({ config, customCtas }: { config: SiteConfig; customCtas: CTA[] }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl p-8 sm:p-12 text-center"
          style={{ background: 'var(--color-highlight)' }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {config.objection_title}
          </h2>
          <p className="text-base sm:text-lg opacity-80 leading-relaxed max-w-2xl mx-auto">
            {config.objection_text}
          </p>
          <CustomCtaSlot ctas={customCtas} />
        </div>
      </div>
    </section>
  );
}

function Offer({ config, cta, customCtas }: { config: SiteConfig; cta?: CTA; customCtas: CTA[] }) {
  return (
    <section id="oferta" className="py-16 sm:py-24 bg-white/40 scroll-mt-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-rose-100 shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 text-center">
            <p className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-3">Oferta especial</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {config.offer_title}
            </h2>
            <p className="opacity-70 max-w-xl mx-auto mb-6">{config.offer_text}</p>

            <div className="rounded-2xl border border-rose-100 p-6 mb-6 text-left max-w-lg mx-auto">
              <p className="font-semibold mb-3 text-sm uppercase tracking-wider text-rose-500">Incluso no curso:</p>
              <ul className="space-y-2.5">
                {config.offer_includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="flex-shrink-0 text-rose-500 mt-0.5" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              {config.offer_old_price && (
                <p className="text-base opacity-50 line-through">{config.offer_old_price}</p>
              )}
              <p className="text-4xl sm:text-5xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {config.offer_price}
              </p>
              <p className="text-sm opacity-70 mt-2">{config.offer_condition}</p>
            </div>

            <CtaButton cta={cta} variant="large" />
            <CustomCtaSlot ctas={customCtas} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Guarantee({ config, customCtas }: { config: SiteConfig; customCtas: CTA[] }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 mb-6" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
          <Shield size={40} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          {config.guarantee_title}
        </h2>
        <p className="opacity-75 leading-relaxed max-w-xl mx-auto">{config.guarantee_text}</p>
        <CustomCtaSlot ctas={customCtas} />
      </div>
    </section>
  );
}

function FaqSection({ faqs, customCtas }: { faqs: Faq[]; customCtas: CTA[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-16 sm:py-24 bg-white/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-2">Dúvidas</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            Perguntas frequentes
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.id} className="rounded-xl bg-white border border-rose-50 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left font-medium hover:bg-rose-50/30 transition"
              >
                <span>{f.question}</span>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-rose-400 transition-transform ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm opacity-70 leading-relaxed">{f.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <CustomCtaSlot ctas={customCtas} />
      </div>
    </section>
  );
}

function FinalCta({ config, cta, customCtas }: { config: SiteConfig; cta?: CTA; customCtas: CTA[] }) {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
      />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
          {config.final_cta_headline}
        </h2>
        <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">{config.final_cta_text}</p>
        <CtaButton cta={cta} variant="large" />
        <CustomCtaSlot ctas={customCtas} />
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm opacity-80">
          <span className="flex items-center gap-1.5"><Shield size={16} /> Compra segura</span>
          <span className="flex items-center gap-1.5"><Clock size={16} /> Acesso imediato</span>
          <span className="flex items-center gap-1.5"><Award size={16} /> Certificado</span>
        </div>
      </div>
    </section>
  );
}

function Footer({ config, customCtas }: { config: SiteConfig; customCtas: CTA[] }) {
  const socials = [
    { url: config.social_instagram, label: 'Instagram', Icon: Instagram },
    { url: config.social_facebook, label: 'Facebook', Icon: Facebook },
    { url: config.social_whatsapp, label: 'WhatsApp', Icon: MessageCircle },
    { url: config.social_youtube, label: 'YouTube', Icon: Youtube },
    { url: config.social_tiktok, label: 'TikTok', Icon: Music2 },
    { url: config.social_email ? `mailto:${config.social_email}` : null, label: 'E-mail', Icon: Mail },
  ].filter((social) => social.url);

  return (
    <footer className="py-10 text-center text-sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
      <CustomCtaSlot ctas={customCtas} />
      {socials.length > 0 && (
        <div className="flex items-center justify-center gap-3 mb-5">
          {socials.map(({ url, label, Icon }) => (
            <a key={label} href={url ?? '#'} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-9 h-9 rounded-full border border-rose-200 flex items-center justify-center hover:bg-rose-50 transition">
              <Icon size={16} />
            </a>
          ))}
        </div>
      )}
      <p>© {new Date().getFullYear()} Curso de Manicure. Todos os direitos reservados.</p>
    </footer>
  );
}

function CustomCtaSlot({ ctas }: { ctas: CTA[] }) {
  if (ctas.length === 0) return null;
  return <div className="flex flex-wrap justify-center gap-3 mt-6">{ctas.map((cta) => <CtaButton key={cta.id} cta={cta} />)}</div>;
}

function FloatingCta({ cta }: { cta?: CTA }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!cta || !cta.is_active) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 transition-transform duration-300 lg:bottom-4 lg:right-4 lg:left-auto lg:max-w-xs ${
        visible ? 'translate-y-0' : 'translate-y-full lg:translate-y-0 lg:opacity-0 lg:pointer-events-none'
      }`}
    >
      <CtaButton cta={cta} variant="floating" className="shadow-2xl w-full" />
    </div>
  );
}
