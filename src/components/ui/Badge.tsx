import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface Props {
  children: ReactNode;
  className?: string;
  tone?: 'brand' | 'mint' | 'violet' | 'neutral';
}

const TONES: Record<NonNullable<Props['tone']>, string> = {
  brand:   'text-[var(--brand-200)] bg-[var(--brand-500)]/10 border-[var(--brand-500)]/20',
  mint:    'text-[#6cf2c1] bg-[#6cf2c1]/10 border-[#6cf2c1]/20',
  violet:  'text-[#c8b6ff] bg-[#8b6cff]/10 border-[#8b6cff]/20',
  neutral: 'text-secondary bg-white/5 border-white/10',
};

export function Badge({ children, className, tone = 'brand' }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
