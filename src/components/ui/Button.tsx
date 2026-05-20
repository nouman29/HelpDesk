import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'glass';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  to?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'text-white bg-gradient-to-br from-[#1f86ff] via-[#4aa6ff] to-[#8b6cff] shadow-[0_10px_40px_-10px_rgba(31,134,255,0.6)] hover:shadow-[0_18px_50px_-10px_rgba(74,166,255,0.7)]',
  secondary:
    'glass-strong text-primary border border-white/10 hover:border-white/20',
  ghost:
    'bg-transparent text-secondary hover:text-primary',
  glass:
    'glass text-primary hover:bg-white/10',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', to, leftIcon, rightIcon, fullWidth, className, children, onClick, ...rest },
  ref,
) {
  const navigate = useNavigate();

  return (
    <button
      ref={ref}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented && to) navigate(to);
      }}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-full font-medium',
        'transition-all duration-300 will-change-transform active:scale-[0.98]',
        'btn-glow select-none',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {leftIcon && <span className="grid place-items-center">{leftIcon}</span>}
      <span className="relative z-10">{children}</span>
      {rightIcon && <span className="grid place-items-center">{rightIcon}</span>}
    </button>
  );
});
