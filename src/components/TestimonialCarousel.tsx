import { useState, useRef, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Testimonial } from '@/lib/types';

interface Props {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: Props) {
  const items = testimonials.filter((t) => t.is_active);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const count = items.length;
  const maxIndex = Math.max(0, count - getVisibleCount());

  function getVisibleCount() {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIdx = Math.max(0, count - visibleCount);

  useEffect(() => {
    if (paused || count <= visibleCount) return;
    const timer = setInterval(() => {
      setIndex((i) => (i >= maxIdx ? 0 : i + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, count, visibleCount, maxIdx]);

  useEffect(() => {
    if (index > maxIdx) setIndex(maxIdx);
  }, [maxIdx, index]);

  const go = useCallback(
    (dir: number) => {
      setIndex((i) => Math.max(0, Math.min(maxIdx, i + dir)));
    },
    [maxIdx]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    setPaused(true);
    setDragStart(e.clientX);
    setDragDelta(0);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStart === null) return;
    setDragDelta(e.clientX - dragStart);
  };

  const onPointerUp = () => {
    if (Math.abs(dragDelta) > 60) {
      go(dragDelta > 0 ? -1 : 1);
    }
    setDragStart(null);
    setDragDelta(0);
    setPaused(false);
  };

  if (count === 0) return null;

  const cardWidth = 100 / visibleCount;
  const translate = -(index * cardWidth) - (dragDelta / (trackRef.current?.offsetWidth || 1)) * 100;

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing"
        style={{ transform: `translateX(${translate}%)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="flex-shrink-0 px-3"
            style={{ width: `${cardWidth}%` }}
          >
            <TestimonialCard t={t} />
          </div>
        ))}
      </div>

      {count > visibleCount && (
        <>
          <button
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="Anterior"
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white shadow-lg border border-rose-100 text-rose-700 hover:bg-rose-50 transition disabled:opacity-30 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => go(1)}
            disabled={index >= maxIdx}
            aria-label="Próximo"
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white shadow-lg border border-rose-100 text-rose-700 hover:bg-rose-50 transition disabled:opacity-30 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxIdx + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Ir para slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-8 bg-rose-500' : 'w-2 bg-rose-200 hover:bg-rose-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-rose-50 p-6 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        {t.photo_url ? (
          <img
            src={t.photo_url}
            alt={t.name}
            loading="lazy"
            className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-100"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-semibold text-lg">
            {t.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-800">{t.name}</p>
          <div className="flex gap-0.5 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed flex-grow">"{t.text}"</p>
      {t.result && (
        <p className="mt-4 pt-4 border-t border-rose-50 text-xs text-rose-600 font-medium">
          {t.result}
        </p>
      )}
    </div>
  );
}
