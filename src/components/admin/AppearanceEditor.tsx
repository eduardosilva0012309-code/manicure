import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteConfig } from '@/lib/types';
import { FONT_OPTIONS } from '@/lib/useTheme';
import { Field, TextInput, Select, SaveBar, Card, Toggle } from '@/components/admin/ui';
import ImageUploader from '@/components/admin/ImageUploader';

interface Props {
  config: SiteConfig;
  onSaved: () => void;
}

export default function AppearanceEditor({ config, onSaved }: Props) {
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

  const colorFields: { key: keyof SiteConfig; label: string }[] = [
    { key: 'color_primary', label: 'Cor primária' },
    { key: 'color_secondary', label: 'Cor secundária' },
    { key: 'color_button', label: 'Cor dos botões' },
    { key: 'color_button_text', label: 'Cor do texto dos botões' },
    { key: 'color_text', label: 'Cor do texto' },
    { key: 'color_background', label: 'Cor de fundo' },
    { key: 'color_card', label: 'Cor dos cards' },
    { key: 'color_highlight', label: 'Cor dos destaques' },
  ];

  const darkColorFields: { key: keyof SiteConfig; label: string }[] = [
    { key: 'dark_color_background', label: 'Fundo (escuro)' },
    { key: 'dark_color_text', label: 'Texto (escuro)' },
    { key: 'dark_color_card', label: 'Cards (escuro)' },
    { key: 'dark_color_highlight', label: 'Destaques (escuro)' },
  ];

  const socialFields: { key: keyof SiteConfig; label: string; placeholder: string }[] = [
    { key: 'social_instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
    { key: 'social_facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
    { key: 'social_whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/55...' },
    { key: 'social_youtube', label: 'YouTube', placeholder: 'https://youtube.com/@...' },
    { key: 'social_tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
    { key: 'social_email', label: 'E-mail', placeholder: 'contato@exemplo.com' },
  ];

  return (
    <div className="space-y-6">
      <Card title="Cores (modo claro)">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {colorFields.map(({ key, label }) => (
            <Field key={key} label={label}>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form[key] as string}
                  onChange={(e) => set(key, e.target.value as SiteConfig[typeof key])}
                  className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                />
                <TextInput value={form[key] as string} onChange={(e) => set(key, e.target.value as SiteConfig[typeof key])} className="flex-1" />
              </div>
            </Field>
          ))}
        </div>
      </Card>

      <Card title="Modo escuro">
        <div className="mb-4">
          <Toggle
            checked={form.dark_mode_enabled}
            onChange={(v) => set('dark_mode_enabled', v)}
            label="Ativar botão de modo escuro na página"
          />
        </div>
        <p className="text-sm text-gray-500 mb-3">Cores usadas quando o visitante ativa o modo escuro.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {darkColorFields.map(({ key, label }) => (
            <Field key={key} label={label}>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form[key] as string}
                  onChange={(e) => set(key, e.target.value as SiteConfig[typeof key])}
                  className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                />
                <TextInput value={form[key] as string} onChange={(e) => set(key, e.target.value as SiteConfig[typeof key])} className="flex-1" />
              </div>
            </Field>
          ))}
        </div>
      </Card>

      <Card title="Tipografia">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Fonte dos títulos">
            <Select value={form.font_heading} onChange={(e) => set('font_heading', e.target.value)}>
              {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </Select>
          </Field>
          <Field label="Fonte do corpo">
            <Select value={form.font_body} onChange={(e) => set('font_body', e.target.value)}>
              {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </Select>
          </Field>
          <Field label="Tamanho base">
            <TextInput value={form.font_base_size} onChange={(e) => set('font_base_size', e.target.value)} placeholder="16px" />
          </Field>
          <Field label="Peso dos títulos">
            <Select value={form.font_heading_weight} onChange={(e) => set('font_heading_weight', e.target.value)}>
              <option value="400">400 — Regular</option>
              <option value="500">500 — Medium</option>
              <option value="600">600 — Semibold</option>
              <option value="700">700 — Bold</option>
            </Select>
          </Field>
          <Field label="Peso do corpo">
            <Select value={form.font_body_weight} onChange={(e) => set('font_body_weight', e.target.value)}>
              <option value="400">400 — Regular</option>
              <option value="500">500 — Medium</option>
              <option value="600">600 — Semibold</option>
            </Select>
          </Field>
          <Field label="Espaçamento entre letras">
            <TextInput value={form.font_letter_spacing} onChange={(e) => set('font_letter_spacing', e.target.value)} placeholder="0" />
          </Field>
          <Field label="Altura da linha">
            <TextInput value={form.font_line_height} onChange={(e) => set('font_line_height', e.target.value)} placeholder="1.6" />
          </Field>
        </div>
      </Card>

      <Card title="Imagem do Hero">
        <ImageUploader value={form.hero_image_url} onChange={(url) => set('hero_image_url', url)} folder="hero" label="Imagem principal" />
      </Card>

      <Card title="Redes sociais">
        <p className="text-sm text-gray-500 mb-4">Os links preenchidos aparecem como ícones no rodapé da página. Deixe em branco para ocultar.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {socialFields.map(({ key, label, placeholder }) => (
            <Field key={key} label={label}>
              <TextInput
                value={(form[key] as string) ?? ''}
                onChange={(e) => set(key, (e.target.value || null) as SiteConfig[typeof key])}
                placeholder={placeholder}
              />
            </Field>
          ))}
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <SaveBar saving={saving} onSave={save} />
        {msg && <span className={`text-sm ${msg.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>{msg}</span>}
      </div>
    </div>
  );
}
