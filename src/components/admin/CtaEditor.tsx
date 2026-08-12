import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { CTA } from '@/lib/types';
import { ICON_NAMES, getIcon } from '@/lib/icons';
import { Field, TextInput, Select, Toggle, Card } from '@/components/admin/ui';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  ctas: CTA[];
  onChanged: () => void;
}

const CTA_LABELS: Record<string, string> = {
  hero: 'CTA do Hero (primeira dobra)',
  offer: 'CTA da Oferta',
  final: 'CTA Final',
  floating: 'CTA Flutuante (mobile)',
};

const SECTION_OPTIONS = [
  { value: 'hero', label: 'Hero (topo)' },
  { value: 'trust', label: 'Barra de confiança' },
  { value: 'results', label: 'Depoimentos' },
  { value: 'modules', label: 'Módulos' },
  { value: 'benefits', label: 'Benefícios' },
  { value: 'for_whom', label: 'Para quem é' },
  { value: 'objection', label: 'Objeções' },
  { value: 'offer', label: 'Oferta' },
  { value: 'guarantee', label: 'Garantia' },
  { value: 'faq', label: 'FAQ' },
  { value: 'final', label: 'CTA Final' },
  { value: 'footer', label: 'Rodapé' },
];

export default function CtaEditor({ ctas, onChanged }: Props) {
  const [items, setItems] = useState<CTA[]>(ctas);
  const [creating, setCreating] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newSection, setNewSection] = useState('hero');
  useEffect(() => setItems(ctas), [ctas]);

  async function update(id: string, patch: Partial<CTA>) {
    setItems((arr) => arr.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    await supabase.from('ctas').update(patch).eq('id', id);
    onChanged();
  }

  async function createCustom() {
    if (!newLabel.trim()) return;
    const { data, error } = await supabase
      .from('ctas')
      .insert({
        key: 'custom',
        label: newLabel.trim(),
        url: '#',
        color: '#e11d48',
        icon: 'MousePointer',
        open_new_tab: false,
        is_active: true,
        section: newSection,
        is_custom: true,
      })
      .select()
      .single();
    if (!error && data) {
      setNewLabel('');
      setCreating(false);
      onChanged();
    }
  }

  async function removeCustom(id: string) {
    await supabase.from('ctas').delete().eq('id', id);
    setItems((arr) => arr.filter((c) => c.id !== id));
    onChanged();
  }

  const builtIn = items.filter((c) => !c.is_custom);
  const custom = items.filter((c) => c.is_custom);

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Configure cada botão de chamada para ação da página. Você pode editar o texto, o link, a cor e o ícone de todos os botões, e também criar novos botões para colocar em qualquer seção.
      </p>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Botões principais da página</h3>
        <div className="space-y-4">
          {builtIn.map((c) => (
            <CtaCard key={c.id} cta={c} onUpdate={update} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Botões personalizados</h3>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-sm font-medium hover:bg-rose-100 transition"
          >
            <Plus size={16} /> Novo botão
          </button>
        </div>

        {creating && (
          <Card title="Criar novo botão">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Texto do botão">
                <TextInput value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Ex: Falar no WhatsApp" />
              </Field>
              <Field label="Seção onde vai aparecer">
                <Select value={newSection} onChange={(e) => setNewSection(e.target.value)}>
                  {SECTION_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </Select>
              </Field>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={createCustom}
                disabled={!newLabel.trim()}
                className="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition disabled:opacity-50"
              >
                Criar botão
              </button>
              <button onClick={() => setCreating(false)} className="px-4 py-2 rounded-lg text-gray-500 text-sm hover:bg-gray-100 transition">
                Cancelar
              </button>
            </div>
          </Card>
        )}

        <div className="space-y-4 mt-4">
          {custom.length === 0 && !creating && (
            <p className="text-sm text-gray-400 italic">Nenhum botão personalizado ainda. Clique em "Novo botão" para adicionar.</p>
          )}
          {custom.map((c) => (
            <CtaCard key={c.id} cta={c} onUpdate={update} onDelete={removeCustom} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CtaCard({ cta, onUpdate, onDelete }: { cta: CTA; onUpdate: (id: string, patch: Partial<CTA>) => void; onDelete?: (id: string) => void }) {
  const Icon = getIcon(cta.icon);
  const title = cta.is_custom
    ? `Botão personalizado — ${SECTION_OPTIONS.find((s) => s.value === cta.section)?.label ?? cta.section}`
    : CTA_LABELS[cta.key] ?? cta.key;

  return (
    <Card title={title}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Texto do botão">
          <TextInput value={cta.label} onChange={(e) => onUpdate(cta.id, { label: e.target.value })} />
        </Field>
        <Field label="Link / URL">
          <TextInput value={cta.url} onChange={(e) => onUpdate(cta.id, { url: e.target.value })} placeholder="#oferta ou https://..." />
        </Field>
        <Field label="Cor do botão">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={cta.color}
              onChange={(e) => onUpdate(cta.id, { color: e.target.value })}
              className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
            />
            <TextInput value={cta.color} onChange={(e) => onUpdate(cta.id, { color: e.target.value })} className="flex-1" />
          </div>
        </Field>
        <Field label="Ícone">
          <Select value={cta.icon} onChange={(e) => onUpdate(cta.id, { icon: e.target.value })}>
            {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
          </Select>
        </Field>
        {cta.is_custom && (
          <Field label="Seção onde aparece">
            <Select value={cta.section} onChange={(e) => onUpdate(cta.id, { section: e.target.value })}>
              {SECTION_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
          </Field>
        )}
        <div className="flex items-center gap-6 sm:col-span-2 flex-wrap">
          <Toggle checked={cta.open_new_tab} onChange={(v) => onUpdate(cta.id, { open_new_tab: v })} label="Abrir em nova aba" />
          <Toggle checked={cta.is_active} onChange={(v) => onUpdate(cta.id, { is_active: v })} label="Ativo" />
          <span className="flex items-center gap-1.5 text-sm text-gray-500"><Icon size={16} /> Prévia</span>
          {onDelete && (
            <button
              onClick={() => onDelete(cta.id)}
              className="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition ml-auto"
            >
              <Trash2 size={16} /> Excluir
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
