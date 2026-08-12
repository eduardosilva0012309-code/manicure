import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteConfig } from '@/lib/types';
import { Field, TextInput, TextArea, SaveBar, Card } from '@/components/admin/ui';

interface Props {
  config: SiteConfig;
  onSaved: () => void;
}

export default function OfferEditor({ config, onSaved }: Props) {
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
      <Card title="Oferta">
        <div className="space-y-4">
          <Field label="Nome do curso">
            <TextInput value={form.offer_title} onChange={(e) => set('offer_title', e.target.value)} />
          </Field>
          <Field label="Descrição da oferta">
            <TextArea rows={3} value={form.offer_text} onChange={(e) => set('offer_text', e.target.value)} />
          </Field>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Preço atual">
              <TextInput value={form.offer_price} onChange={(e) => set('offer_price', e.target.value)} />
            </Field>
            <Field label="Preço anterior (riscado)">
              <TextInput value={form.offer_old_price} onChange={(e) => set('offer_old_price', e.target.value)} />
            </Field>
            <Field label="Condição de pagamento">
              <TextInput value={form.offer_condition} onChange={(e) => set('offer_condition', e.target.value)} />
            </Field>
          </div>
          <Field label="Bônus (texto de destaque)">
            <TextInput value={form.offer_bonus} onChange={(e) => set('offer_bonus', e.target.value)} />
          </Field>
          <Field label="Itens inclusos (um por linha)">
            <TextArea
              rows={5}
              value={form.offer_includes.join('\n')}
              onChange={(e) => set('offer_includes', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
            />
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
