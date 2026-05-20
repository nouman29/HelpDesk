import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, leftIcon, rightIcon, error, className, id, ...rest },
  ref,
) {
  const fieldId = id || rest.name;
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={fieldId} className="text-xs uppercase tracking-[0.18em] text-tertiary">
          {label}
        </label>
      )}
      <div
        className={cn(
          'group relative flex items-center gap-3 rounded-xl px-4',
          'glass border border-white/10 transition-all duration-300',
          'focus-within:border-[var(--brand-400)]/60 focus-within:shadow-[0_0_0_4px_rgba(74,166,255,0.10)]',
          error && 'border-rose-400/60',
        )}
      >
        {leftIcon && <span className="text-tertiary group-focus-within:text-[var(--brand-300)] transition-colors">{leftIcon}</span>}
        <input
          ref={ref}
          id={fieldId}
          className={cn(
            'h-12 w-full bg-transparent text-[15px] text-primary placeholder:text-tertiary outline-none',
            className,
          )}
          {...rest}
        />
        {rightIcon && <span className="text-tertiary">{rightIcon}</span>}
      </div>
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  );
});
