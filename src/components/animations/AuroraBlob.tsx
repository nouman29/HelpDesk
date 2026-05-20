import { cn } from '@/utils/cn';

interface Props {
  className?: string;
  color?: string;
  size?: number;
}

/** Soft blurred radial blob, used as accent lighting. */
export function AuroraBlob({ className, color = '#1f86ff', size = 480 }: Props) {
  return (
    <div
      aria-hidden
      className={cn('aurora float-slow', className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(closest-side, ${color}, transparent 70%)`,
      }}
    />
  );
}
