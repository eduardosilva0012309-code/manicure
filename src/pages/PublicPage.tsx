import { useContent } from '@/lib/useContent';
import { useTheme } from '@/lib/useTheme';
import LandingPage from '@/components/LandingPage';
import { useEffect, useState } from 'react';

export default function PublicPage() {
  const { config, modules, testimonials, faqs, ctas, loading, error } = useContent();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('manicure-dark-mode') === 'true');
  useTheme(config, darkMode);

  useEffect(() => {
    if (config) {
      document.title = config.seo_title;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', config.seo_description);
      else {
        const m = document.createElement('meta');
        m.name = 'description';
        m.content = config.seo_description;
        document.head.appendChild(m);
      }
      if (config.seo_og_image) {
        const og = document.querySelector('meta[property="og:image"]');
        if (og) og.setAttribute('content', config.seo_og_image);
      }
    }
  }, [config]);

  // Analytics injection
  useEffect(() => {
    if (!config) return;
    // GA
    if (config.google_analytics && !document.getElementById('ga-script')) {
      const s = document.createElement('script');
      s.id = 'ga-script';
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${config.google_analytics}`;
      document.head.appendChild(s);
      const i = document.createElement('script');
      i.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${config.google_analytics}');`;
      document.head.appendChild(i);
    }
    // GTM
    if (config.google_tag_manager && !document.getElementById('gtm-script')) {
      const s = document.createElement('script');
      s.id = 'gtm-script';
      s.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${config.google_tag_manager}');`;
      document.head.appendChild(s);
    }
    // Meta Pixel
    if (config.meta_pixel && !document.getElementById('pixel-script')) {
      const s = document.createElement('script');
      s.id = 'pixel-script';
      s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${config.meta_pixel}');fbq('track','PageView');`;
      document.head.appendChild(s);
    }
  }, [config]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background, #faf5f5)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: 'var(--color-primary, #e11d48)' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background, #faf5f5)' }}>
        <div className="text-center max-w-md p-8">
          <p className="font-semibold mb-2" style={{ color: 'var(--color-primary, #e11d48)' }}>Não foi possível carregar a página</p>
          <p className="text-sm" style={{ color: 'var(--color-text, #666)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <LandingPage
      config={config}
      modules={modules}
      testimonials={testimonials}
      faqs={faqs}
      ctas={ctas}
      darkMode={darkMode}
      onToggleDarkMode={() => {
        setDarkMode((value) => {
          const next = !value;
          localStorage.setItem('manicure-dark-mode', String(next));
          return next;
        });
      }}
    />
  );
}
