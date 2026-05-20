import { motion } from 'framer-motion';
import { DECISION_JOURNEY } from '@/data/journeys';
import { cn } from '@/utils/cn';

interface Props { active: number; }

/**
 * Compact horizontal map of the 5-step decision journey,
 * shown above the chat so the user always knows where they are.
 */
export function JourneyMap({ active }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-3">
      <div className="rounded-2xl glass border border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          {DECISION_JOURNEY.map((step, i) => {
            const isActive = i === active;
            const isDone   = i <  active;
            return (
              <div key={step.id} className="flex items-center gap-2 flex-1 min-w-0">
                <motion.div
                  initial={false}
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  className={cn(
                    'relative shrink-0 grid h-6 w-6 place-items-center rounded-full text-[10px] mono',
                    isDone   && 'bg-[var(--brand-500)] text-white',
                    isActive && 'bg-white text-[var(--bg-0)] shadow-[0_0_22px_rgba(74,166,255,0.6)]',
                    !isDone && !isActive && 'bg-white/10 text-tertiary',
                  )}
                >
                  {i + 1}
                </motion.div>
                <span className={cn(
                  'truncate text-xs',
                  isActive ? 'text-primary font-medium' : 'text-tertiary',
                )}>
                  {step.title}
                </span>
                {i < DECISION_JOURNEY.length - 1 && (
                  <div className="flex-1 h-px bg-white/10 mx-1 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-[var(--brand-400)]"
                      initial={false}
                      animate={{ width: isDone ? '100%' : '0%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
