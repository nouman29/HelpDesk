import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { fadeUp, stagger } from '@/utils/motion';

interface Props {
  options: string[];
  disabled?: boolean;
  onSelect: (answer: string) => void;
}

/**
 * Renders backend `possible_answers` as a grid of selectable, glass-styled boxes.
 * Each option is its own clickable box that calls `onSelect(value)` with the
 * exact string.
 */
export function AnswerOptions({ options, disabled = false, onSelect }: Props) {
  if (!options || options.length === 0) return null;

  return (
    <motion.div
      variants={stagger(0.05, 0.04)}
      initial="hidden"
      animate="show"
      className="grid sm:grid-cols-2 gap-2.5 w-full"
      role="listbox"
      aria-label="Suggested answers"
    >
      {options.map((option) => (
        <motion.button
          key={option}
          type="button"
          variants={fadeUp}
          disabled={disabled}
          onClick={() => !disabled && onSelect(option)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
            e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
          }}
          className={[
            'group text-left rounded-2xl glass border border-white/10',
            'px-4 py-3 transition-all duration-300 spotlight',
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-[var(--border-glow)] hover:-translate-y-0.5 cursor-pointer',
          ].join(' ')}
          role="option"
          aria-selected={false}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-secondary group-hover:text-primary transition-colors">
              {option}
            </span>
            <FiArrowUpRight
              className="shrink-0 text-tertiary group-hover:text-[var(--brand-300)] transition-colors"
              size={14}
            />
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}
