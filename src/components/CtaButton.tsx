import { getIcon } from '@/lib/icons';
import type { CTA } from '@/lib/types';

interface Props {
  cta: CTA | undefined;
  variant?: 'primary' | 'large' | 'floating';
  className?: string;
}

export default function CtaButton({ cta, variant = 'primary', className = '' }: Props) {
  if (!cta || !cta.is_active) return null;

  const Icon = getIcon(cta.icon);
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2';
  const sizes =
    variant === 'large'
      ? 'px-10 py-5 text-lg'
      : variant === 'floating'
      ? 'px-6 py-4 text-base w-full'
      : 'px-8 py-4 text-base';
  const style = {
    backgroundColor: cta.color,
    color: '#ffffff',
    // ensure readable text
    '--tw-ring-color': cta.color,
  } as React.CSSProperties;

  return (
    <a
      href={cta.url}
      target={cta.open_new_tab ? '_blank' : undefined}
      rel={cta.open_new_tab ? 'noopener noreferrer' : undefined}
      data-cta-key={cta.key}
      className={`${base} ${sizes} ${className}`}
      style={style}
    >
      {Icon && <Icon size={variant === 'large' ? 22 : 18} />}
      <span>{cta.label}</span>
    </a>
  );
}
