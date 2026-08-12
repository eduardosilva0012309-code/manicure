import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/useAuth';
import { useContent } from '@/lib/useContent';
import { useTheme } from '@/lib/useTheme';
import LandingPage from '@/components/LandingPage';
import ConfigEditor from '@/components/admin/ConfigEditor';
import ModulesEditor from '@/components/admin/ModulesEditor';
import TestimonialsEditor from '@/components/admin/TestimonialsEditor';
import FaqEditor from '@/components/admin/FaqEditor';
import OfferEditor from '@/components/admin/OfferEditor';
import AppearanceEditor from '@/components/admin/AppearanceEditor';
import SeoAnalyticsEditor from '@/components/admin/SeoAnalyticsEditor';
import CtaEditor from '@/components/admin/CtaEditor';
import { Layout, Palette, Type, FileText, BarChart3, MessageSquare, BookOpen, Tag, MousePointer, LogOut, Eye, Monitor, Tablet, Smartphone, X } from 'lucide-react';

type Tab = 'content' | 'modules' | 'testimonials' | 'faq' | 'offer' | 'appearance' | 'ctas' | 'seo';

const TABS: { key: Tab; label: string; icon: typeof Layout }[] = [
  { key: 'content', label: 'Conteúdo', icon: Layout },
  { key: 'modules', label: 'Módulos', icon: BookOpen },
  { key: 'testimonials', label: 'Depoimentos', icon: MessageSquare },
  { key: 'faq', label: 'FAQ', icon: FileText },
  { key: 'offer', label: 'Oferta', icon: Tag },
  { key: 'appearance', label: 'Aparência', icon: Palette },
  { key: 'ctas', label: 'Botões (CTAs)', icon: MousePointer },
  { key: 'seo', label: 'SEO & Analytics', icon: BarChart3 },
];

type Device = 'desktop' | 'tablet' | 'mobile';

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const { config, modules, testimonials, faqs, ctas, loading, error, reload } = useContent();
  useTheme(config);
  const [tab, setTab] = useState<Tab>('content');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [device, setDevice] = useState<Device>('desktop');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !config) {
    return <div className="p-8 text-red-600">Erro ao carregar: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 hidden lg:flex flex-col">
        <div className="px-5 py-5 border-b border-gray-50">
          <h1 className="font-bold text-gray-800" style={{ fontFamily: 'var(--font-heading)' }}>Painel</h1>
          <p className="text-xs text-gray-400 mt-0.5">Curso de Manicure</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  tab === t.key ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {t.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-50 space-y-1">
          <button
            onClick={() => setPreviewOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <Eye size={18} /> Visualizar página
          </button>
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <Monitor size={18} /> Abrir página
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <select value={tab} onChange={(e) => setTab(e.target.value as Tab)} className="text-sm font-medium border border-gray-200 rounded-lg px-3 py-2">
          {TABS.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <button onClick={() => setPreviewOpen(true)} className="p-2 rounded-lg hover:bg-gray-100"><Eye size={18} /></button>
          <button onClick={signOut} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><LogOut size={18} /></button>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-14 lg:mt-0 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
            {TABS.find((t) => t.key === tab)?.label}
          </h2>
          {tab === 'content' && <ConfigEditor config={config} onSaved={reload} />}
          {tab === 'modules' && <ModulesEditor modules={modules} onChanged={reload} />}
          {tab === 'testimonials' && <TestimonialsEditor testimonials={testimonials} onChanged={reload} />}
          {tab === 'faq' && <FaqEditor faqs={faqs} onChanged={reload} />}
          {tab === 'offer' && <OfferEditor config={config} onSaved={reload} />}
          {tab === 'appearance' && <AppearanceEditor config={config} onSaved={reload} />}
          {tab === 'ctas' && <CtaEditor ctas={ctas} onChanged={reload} />}
          {tab === 'seo' && <SeoAnalyticsEditor config={config} onSaved={reload} />}
        </div>
      </main>

      {/* Preview modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {(['desktop', 'tablet', 'mobile'] as Device[]).map((d) => {
                  const Icon = d === 'desktop' ? Monitor : d === 'tablet' ? Tablet : Smartphone;
                  return (
                    <button
                      key={d}
                      onClick={() => setDevice(d)}
                      className={`p-2 rounded-lg ${device === d ? 'bg-rose-50 text-rose-600' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      <Icon size={18} />
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <Link to="/" target="_blank" className="text-sm text-rose-600 hover:underline px-3 py-1.5">Abrir em nova aba</Link>
                <button onClick={() => setPreviewOpen(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 flex items-start justify-center p-4">
              <div
                className={`bg-white shadow-lg transition-all duration-300 ${
                  device === 'desktop' ? 'w-full' : device === 'tablet' ? 'w-[768px] max-w-full' : 'w-[390px] max-w-full'
                }`}
              >
                <div className="h-full overflow-y-auto" style={{ maxHeight: 'calc(90vh - 8rem)' }}>
                  <LandingPage config={config} modules={modules} testimonials={testimonials} faqs={faqs} ctas={ctas} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
