import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from './useTheme';
import { cn } from '@/utils/cn';

interface Props { className?: string; }

export function ThemeToggle({ className }: Props) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'relative h-9 w-9 shrink-0 rounded-full',
        'glass border border-white/10 hover:border-white/20',
        'transition-colors btn-glow overflow-hidden',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0,   scale: 1 }}
          exit={{ opacity: 0, rotate: 45,    scale: 0.6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 grid place-items-center"
        >
          {isDark
            ? <FiMoon className="text-(--brand-200)" size={15} />
            : <FiSun  className="text-amber-400"  size={15} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
