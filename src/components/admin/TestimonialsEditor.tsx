import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Testimonial } from '@/lib/types';
import { Field, TextInput, TextArea, Toggle, Card } from '@/components/admin/ui';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, Trash2, ArrowUp, ArrowDown, Star } from 'lucide-react';

interface Props {
  testimonials: Testimonial[];
  onChanged: () => void;
}

export default function TestimonialsEditor({ testimonials, onChanged }: Props) {
  const [items, setItems] = useState<Testimonial[]>(testimonials);
  useEffect(() => setItems(testimonials), [testimonials]);

  async function update(id: string, patch: Partial<Testimonial>) {
    setItems((arr) => arr.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    await supabase.from('testimonials').update(patch).eq('id', id);
    onChanged();
  }

  async function add() {
    const { data, error } = await supabase
      .from('testimonials')
      .insert({ name: 'Nova aluna', text: '', result: '', rating: 5, sort_order: items.length + 1, is_active: true })
      .select()
      .single();
    if (error) return console.error(error);
    setItems((arr) => [...arr, data as Testimonial]);
    onChanged();
  }

  async function remove(id: string) {
    await supabase.from('testimonials').delete().eq('id', id);
    setItems((arr) => arr.filter((t) => t.id !== id));
    onChanged();
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = items.findIndex((t) => t.id === id);
    const swap = items[idx + dir];
    if (!swap) return;
    await supabase.from('testimonials').update({ sort_order: swap.sort_order }).eq('id', id);
    await supabase.from('testimonials').update({ sort_order: items[idx].sort_order }).eq('id', swap.id);
    onChanged();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={add} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition">
          <Plus size={16} /> Novo depoimento
        </button>
      </div>
      <p className="text-xs text-gray-400">Use depoimentos reais ou deixe claro que são ilustrativos. Não invente resultados financeiros.</p>
      {items.map((t, i) => (
        <Card key={t.id} title={t.name} actions={
          <div className="flex items-center gap-1">
            <button onClick={() => move(t.id, -1)} disabled={i === 0} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"><ArrowUp size={16} /></button>
            <button onClick={() => move(t.id, 1)} disabled={i === items.length - 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"><ArrowDown size={16} /></button>
            <button onClick={() => remove(t.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
          </div>
        }>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nome">
              <TextInput value={t.name} onChange={(e) => update(t.id, { name: e.target.value })} />
            </Field>
            <Field label="Avaliação (1-5)">
              <div className="flex items-center gap-1 pt-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => update(t.id, { rating: n })}>
                    <Star size={20} className={n <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                  </button>
                ))}
              </div>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Depoimento">
                <TextArea rows={2} value={t.text} onChange={(e) => update(t.id, { text: e.target.value })} />
              </Field>
            </div>
            <Field label="Resultado/Experiência relatada">
              <TextInput value={t.result} onChange={(e) => update(t.id, { result: e.target.value })} />
            </Field>
            <ImageUploader value={t.photo_url} onChange={(url) => update(t.id, { photo_url: url })} folder="testimonials" label="Foto" />
            <div className="flex items-center gap-6 sm:col-span-2">
              <Toggle checked={t.is_featured} onChange={(v) => update(t.id, { is_featured: v })} label="Destaque" />
              <Toggle checked={t.is_active} onChange={(v) => update(t.id, { is_active: v })} label="Ativo" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
