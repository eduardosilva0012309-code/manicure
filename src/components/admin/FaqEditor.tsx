import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Faq } from '@/lib/types';
import { Field, TextInput, TextArea, Toggle, Card } from '@/components/admin/ui';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  faqs: Faq[];
  onChanged: () => void;
}

export default function FaqEditor({ faqs, onChanged }: Props) {
  const [items, setItems] = useState<Faq[]>(faqs);
  useEffect(() => setItems(faqs), [faqs]);

  async function update(id: string, patch: Partial<Faq>) {
    setItems((arr) => arr.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    await supabase.from('faqs').update(patch).eq('id', id);
    onChanged();
  }

  async function add() {
    const { data, error } = await supabase
      .from('faqs')
      .insert({ question: 'Nova pergunta', answer: '', sort_order: items.length + 1, is_active: true })
      .select()
      .single();
    if (error) return console.error(error);
    setItems((arr) => [...arr, data as Faq]);
    onChanged();
  }

  async function remove(id: string) {
    await supabase.from('faqs').delete().eq('id', id);
    setItems((arr) => arr.filter((f) => f.id !== id));
    onChanged();
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = items.findIndex((f) => f.id === id);
    const swap = items[idx + dir];
    if (!swap) return;
    await supabase.from('faqs').update({ sort_order: swap.sort_order }).eq('id', id);
    await supabase.from('faqs').update({ sort_order: items[idx].sort_order }).eq('id', swap.id);
    onChanged();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={add} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition">
          <Plus size={16} /> Nova pergunta
        </button>
      </div>
      {items.map((f, i) => (
        <Card key={f.id} title={f.question || 'Pergunta'} actions={
          <div className="flex items-center gap-1">
            <button onClick={() => move(f.id, -1)} disabled={i === 0} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"><ArrowUp size={16} /></button>
            <button onClick={() => move(f.id, 1)} disabled={i === items.length - 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"><ArrowDown size={16} /></button>
            <button onClick={() => remove(f.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
          </div>
        }>
          <div className="space-y-4">
            <Field label="Pergunta">
              <TextInput value={f.question} onChange={(e) => update(f.id, { question: e.target.value })} />
            </Field>
            <Field label="Resposta">
              <TextArea rows={3} value={f.answer} onChange={(e) => update(f.id, { answer: e.target.value })} />
            </Field>
            <Toggle checked={f.is_active} onChange={(v) => update(f.id, { is_active: v })} label="Ativo" />
          </div>
        </Card>
      ))}
    </div>
  );
}
