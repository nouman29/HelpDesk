import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gradientBorder?: boolean;
  hover?: boolean;
  spotlight?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const PAD = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' } as const;

export const GlassCard = forwardRef<HTMLDivElement, Props>(function GlassCard(
  { children, className, gradientBorder, hover, spotlight, padding = 'md', onMouseMove, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        onMouseMove?.(e);
        if (!spotlight) return;
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      className={cn(
        'relative overflow-hidden rounded-2xl glass',
        PAD[padding],
        hover && 'transition-all duration-500 hover:-translate-y-1 hover:border-white/15',
        gradientBorder && 'gradient-border',
        spotlight && 'spotlight',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
