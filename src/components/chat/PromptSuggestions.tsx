import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { PROMPT_SUGGESTIONS } from '@/data/chats';
import { fadeUp, stagger } from '@/utils/motion';

interface Props { onPick: (prompt: string) => void; }

export function PromptSuggestions({ onPick }: Props) {
  return (
    <motion.div
      variants={stagger(0.06, 0.05)}
      initial="hidden"
      animate="show"
      className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto"
    >
      {PROMPT_SUGGESTIONS.map((p) => (
        <motion.button
          key={p}
          variants={fadeUp}
          onClick={() => onPick(p)}
          className="group text-left rounded-2xl glass border border-white/10 hover:border-white/25 px-4 py-3.5 transition-all duration-300 spotlight"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
            e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-secondary group-hover:text-primary transition-colors">{p}</p>
            <FiArrowUpRight className="text-tertiary group-hover:text-[var(--brand-300)] transition-colors mt-0.5" />
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}
