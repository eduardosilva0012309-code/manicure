import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Module } from '@/lib/types';
import { ICON_NAMES, getIcon } from '@/lib/icons';
import { Field, TextInput, TextArea, Select, Toggle, Card } from '@/components/admin/ui';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  modules: Module[];
  onChanged: () => void;
}

export default function ModulesEditor({ modules, onChanged }: Props) {
  const [items, setItems] = useState<Module[]>(modules);
  useEffect(() => setItems(modules), [modules]);

  const update = useMemo(
    () => debounce(async (id: string, patch: Partial<Module>) => {
      setItems((arr) => arr.map((m) => (m.id === id ? { ...m, ...patch } : m)));
      const { error } = await supabase.from('modules').update(patch).eq('id', id);
      if (error) console.error(error);
    }, 400),
    []
  );

  async function add() {
    const { data, error } = await supabase
      .from('modules')
      .insert({
        number: String(items.length + 1).padStart(2, '0'),
        title: 'Novo módulo',
        description: '',
        icon: 'BookOpen',
        sort_order: items.length + 1,
        is_active: true,
      })
      .select()
      .single();
    if (error) return console.error(error);
    setItems((arr) => [...arr, data as Module]);
    onChanged();
  }

  async function remove(id: string) {
    await supabase.from('modules').delete().eq('id', id);
    setItems((arr) => arr.filter((m) => m.id !== id));
    onChanged();
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = items.findIndex((m) => m.id === id);
    const swap = items[idx + dir];
    if (!swap) return;
    await supabase.from('modules').update({ sort_order: swap.sort_order }).eq('id', id);
    await supabase.from('modules').update({ sort_order: items[idx].sort_order }).eq('id', swap.id);
    onChanged();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={add} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition">
          <Plus size={16} /> Novo módulo
        </button>
      </div>
      {items.map((m, i) => {
        const Icon = getIcon(m.icon);
        return (
          <Card key={m.id} title={`Módulo ${m.number}`} actions={
            <div className="flex items-center gap-1">
              <button onClick={() => move(m.id, -1)} disabled={i === 0} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"><ArrowUp size={16} /></button>
              <button onClick={() => move(m.id, 1)} disabled={i === items.length - 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"><ArrowDown size={16} /></button>
              <button onClick={() => remove(m.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
            </div>
          }>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Número">
                <TextInput value={m.number} onChange={(e) => update(m.id, { number: e.target.value })} />
              </Field>
              <Field label="Ícone">
                <Select value={m.icon} onChange={(e) => update(m.id, { icon: e.target.value })}>
                  {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                </Select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Título">
                  <TextInput value={m.title} onChange={(e) => update(m.id, { title: e.target.value })} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Descrição">
                  <TextArea rows={2} value={m.description} onChange={(e) => update(m.id, { description: e.target.value })} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <ImageUploader value={m.image_url} onChange={(url) => update(m.id, { image_url: url })} folder="modules" />
              </div>
              <div className="flex items-center gap-6 sm:col-span-2">
                <Toggle checked={m.is_bonus} onChange={(v) => update(m.id, { is_bonus: v })} label="É bônus" />
                <Toggle checked={m.is_active} onChange={(v) => update(m.id, { is_active: v })} label="Ativo" />
                <span className="flex items-center gap-1.5 text-sm text-gray-500"><Icon size={16} /> Prévia do ícone</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
