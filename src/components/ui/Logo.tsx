import { cn } from '@/utils/cn';

interface Props {
  className?: string;
  withText?: boolean;
}

/** App mark — a stylized "AI" inside a glowing orb. */
export function Logo({ className, withText = true }: Props) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative h-8 w-8 grid place-items-center">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#1f86ff] to-[#8b6cff] opacity-90" />
        <div className="absolute inset-[2px] rounded-[10px] bg-[var(--bg-0)]/70 backdrop-blur" />
        <div className="absolute -inset-1 rounded-2xl bg-[#1f86ff]/30 blur-xl" />
        <svg viewBox="0 0 24 24" className="relative z-10 h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18 9 6l5 12" />
          <path d="M6.5 13.5h5" />
          <path d="M17 6v12" />
        </svg>
      </div>
      {withText && (
        <span className="font-semibold tracking-tight text-primary">
          HelpDesk<span className="text-[var(--brand-400)]">.ai</span>
        </span>
      )}
    </div>
  );
}
