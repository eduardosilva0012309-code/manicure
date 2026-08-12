import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteConfig } from '@/lib/types';
import { Field, TextInput, TextArea, SaveBar, Card } from '@/components/admin/ui';
import ImageUploader from '@/components/admin/ImageUploader';

interface Props {
  config: SiteConfig;
  onSaved: () => void;
}

export default function SeoAnalyticsEditor({ config, onSaved }: Props) {
  const [form, setForm] = useState<SiteConfig>(config);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => setForm(config), [config]);

  function set<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    const { error } = await supabase
      .from('site_config')
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq('id', 1);
    setSaving(false);
    if (error) setMsg('Erro: ' + error.message);
    else {
      setMsg('Salvo com sucesso!');
      onSaved();
    }
  }

  return (
    <div className="space-y-6">
      <Card title="SEO">
        <div className="space-y-4">
          <Field label="SEO Title" hint="Título que aparece na aba do navegador e no Google">
            <TextInput value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} />
          </Field>
          <Field label="Meta Description" hint="Descrição exibida nos resultados de busca">
            <TextArea rows={3} value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)} />
          </Field>
          <ImageUploader value={form.seo_og_image} onChange={(url) => set('seo_og_image', url)} folder="seo" label="Imagem Open Graph (compartilhamento)" />
        </div>
      </Card>

      <Card title="Analytics e Conversão">
        <div className="space-y-4">
          <Field label="Google Analytics (ID)" hint="Ex: G-XXXXXXXXXX">
            <TextInput value={form.google_analytics ?? ''} onChange={(e) => set('google_analytics', e.target.value || null)} placeholder="G-XXXXXXXXXX" />
          </Field>
          <Field label="Meta Pixel (ID)" hint="Ex: 1234567890">
            <TextInput value={form.meta_pixel ?? ''} onChange={(e) => set('meta_pixel', e.target.value || null)} placeholder="1234567890" />
          </Field>
          <Field label="Google Tag Manager (ID)" hint="Ex: GTM-XXXXXXX">
            <TextInput value={form.google_tag_manager ?? ''} onChange={(e) => set('google_tag_manager', e.target.value || null)} placeholder="GTM-XXXXXXX" />
          </Field>
          <p className="text-xs text-gray-400">Os scripts só são carregados na página pública após salvar.</p>
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <SaveBar saving={saving} onSave={save} />
        {msg && <span className={`text-sm ${msg.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>{msg}</span>}
      </div>
    </div>
  );
}
