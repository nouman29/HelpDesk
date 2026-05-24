import { motion } from 'framer-motion';
import { FiCheckCircle, FiPlus, FiTarget, FiBarChart2 } from 'react-icons/fi';
import type { Conclusion } from '@/services/healthService';
import { fadeUp, stagger } from '@/utils/motion';
import { cn } from '@/utils/cn';

interface Props {
  conclusions: Conclusion[];
  onStartAnother: () => void;
  className?: string;
}

/**
 * Renders the final conclusions returned by `/conclude-chat` (or already
 * present on a restored chat via `/get-chat`). Each conclusion gets a
 * card with title, description, and the two percentage metrics
 * (probability + accuracy). The trailing CTA lets the user kick off a
 * brand-new decision journey.
 */
export function ConclusionsView({ conclusions, onStartAnother, className }: Props) {
  const safe = Array.isArray(conclusions) ? conclusions : [];

  return (
    <motion.section
      variants={stagger(0.08, 0.05)}
      initial="hidden"
      animate="show"
      className={cn('flex flex-col gap-5 pt-6', className)}
    >
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-linear-to-br from-[#1f86ff] to-[#8b6cff] text-white shadow-[0_10px_30px_-10px_rgba(31,134,255,0.6)]">
          <FiCheckCircle />
        </div>
        <div>
          <p className="mono text-[10px] uppercase tracking-[0.28em] text-(--brand-300)">
            assessment complete
          </p>
          <h3 className="text-lg md:text-xl font-semibold text-primary">
            Your guided conclusions
          </h3>
        </div>
      </motion.div>

      {safe.length === 0 ? (
        <motion.div
          variants={fadeUp}
          className="rounded-2xl glass border border-white/10 py-10 text-center text-tertiary text-sm"
        >
          The chat has been concluded but no conclusions were returned.
        </motion.div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {safe.map((c) => (
            <motion.li key={c.id} variants={fadeUp}>
              <article className="group relative h-full rounded-2xl glass border border-white/10 p-5 overflow-hidden hover:border-white/25 transition-all duration-500">
                <div className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-linear-to-br from-sky-500/25 to-blue-700/0 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                <header className="relative flex items-start justify-between gap-3">
                  <h4 className="font-semibold text-primary leading-snug">
                    {c.title}
                  </h4>
                  <span className="mono text-[10px] uppercase tracking-[0.22em] text-tertiary shrink-0">
                    #{c.id}
                  </span>
                </header>

                <p className="relative mt-3 text-sm text-secondary leading-relaxed">
                  {c.description}
                </p>

                <footer className="relative mt-4 flex flex-wrap gap-2">
                  <Metric
                    icon={<FiTarget />}
                    label="probability"
                    value={c.probability_percentage}
                  />
                  <Metric
                    icon={<FiBarChart2 />}
                    label="accuracy"
                    value={c.accuracy_percentage}
                  />
                </footer>
              </article>
            </motion.li>
          ))}
        </ul>
      )}

      <motion.div variants={fadeUp} className="pt-2">
        <button
          onClick={onStartAnother}
          className="group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white bg-linear-to-br from-[#1f86ff] to-[#8b6cff] shadow-[0_10px_30px_-10px_rgba(31,134,255,0.6)] btn-glow"
        >
          <FiPlus />
          <span>Start another decision journey</span>
        </button>
      </motion.div>
    </motion.section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="inline-flex items-center gap-2 rounded-full glass border border-white/10 px-3 py-1.5">
      <span className="text-(--brand-300)">{icon}</span>
      <span className="mono text-[10px] uppercase tracking-[0.22em] text-tertiary">
        {label}
      </span>
      <span className="mono text-[11px] tabular-nums font-medium text-primary">
        {pct}%
      </span>
    </div>
  );
}
