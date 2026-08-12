import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteConfig } from '@/lib/types';
import { Field, TextInput, TextArea, SaveBar, Card } from '@/components/admin/ui';

interface Props {
  config: SiteConfig;
  onSaved: () => void;
}

export default function ConfigEditor({ config, onSaved }: Props) {
  const [form, setForm] = useState<SiteConfig>(config);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => setForm(config), [config]);

  function set<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setJsonArr(key: 'benefits' | 'for_whom' | 'offer_includes', text: string) {
    const arr = text.split('\n').map((s) => s.trim()).filter(Boolean);
    setForm((f) => ({ ...f, [key]: arr }));
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
      <Card title="Hero — Primeira dobra">
        <div className="space-y-4">
          <Field label="Headline">
            <TextInput value={form.hero_headline} onChange={(e) => set('hero_headline', e.target.value)} />
          </Field>
          <Field label="Subheadline">
            <TextArea rows={2} value={form.hero_subheadline} onChange={(e) => set('hero_subheadline', e.target.value)} />
          </Field>
          <Field label="Microcopy (abaixo do botão)">
            <TextInput value={form.hero_microcopy} onChange={(e) => set('hero_microcopy', e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card title="Benefícios">
        <div className="space-y-4">
          <Field label="Título da seção">
            <TextInput value={form.benefits_title} onChange={(e) => set('benefits_title', e.target.value)} />
          </Field>
          <Field label="Lista de benefícios (um por linha)">
            <TextArea
              rows={7}
              value={form.benefits.join('\n')}
              onChange={(e) => setJsonArr('benefits', e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card title="Para quem é">
        <div className="space-y-4">
          <Field label="Título da seção">
            <TextInput value={form.for_whom_title} onChange={(e) => set('for_whom_title', e.target.value)} />
          </Field>
          <Field label="Lista (um por linha)">
            <TextArea
              rows={5}
              value={form.for_whom.join('\n')}
              onChange={(e) => setJsonArr('for_whom', e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card title="Objeção — E se eu nunca fiz?">
        <div className="space-y-4">
          <Field label="Título">
            <TextInput value={form.objection_title} onChange={(e) => set('objection_title', e.target.value)} />
          </Field>
          <Field label="Texto">
            <TextArea rows={4} value={form.objection_text} onChange={(e) => set('objection_text', e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card title="Garantia">
        <div className="space-y-4">
          <Field label="Título">
            <TextInput value={form.guarantee_title} onChange={(e) => set('guarantee_title', e.target.value)} />
          </Field>
          <Field label="Texto">
            <TextArea rows={4} value={form.guarantee_text} onChange={(e) => set('guarantee_text', e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card title="CTA Final">
        <div className="space-y-4">
          <Field label="Headline">
            <TextInput value={form.final_cta_headline} onChange={(e) => set('final_cta_headline', e.target.value)} />
          </Field>
          <Field label="Texto">
            <TextArea rows={3} value={form.final_cta_text} onChange={(e) => set('final_cta_text', e.target.value)} />
          </Field>
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <SaveBar saving={saving} onSave={save} />
        {msg && <span className={`text-sm ${msg.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>{msg}</span>}
      </div>
    </div>
  );
}
