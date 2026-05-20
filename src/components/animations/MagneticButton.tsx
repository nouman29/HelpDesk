import type { ReactNode } from 'react';
import { useMagneticHover } from '@/hooks/useMagneticHover';
import { cn } from '@/utils/cn';

interface Props {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/** Wrap any element to give it a subtle "magnetic" pull on hover. */
export function MagneticButton({ children, className, strength = 0.18 }: Props) {
  const ref = useMagneticHover<HTMLDivElement>(strength);
  return (
    <div
      ref={ref}
      className={cn('inline-block will-change-transform transition-transform duration-300 ease-out', className)}
    >
      {children}
    </div>
  );
}
