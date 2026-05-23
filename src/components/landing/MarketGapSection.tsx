import { motion } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { AuroraBlob } from '@/components/animations/AuroraBlob';
import { slideFromLeft, slideFromRight, stagger, EASE_OUT_EXPO } from '@/utils/motion';
import { cn } from '@/utils/cn';
import { useTheme } from '@/features/theme/ThemeContext';

/* ---------- Data ----------
 *
 * No `@/data/comparison` module exists in this project; the snippet's data
 * is defined inline here so the section stays self-contained. Order of
 * features is shared across every column — flip a boolean in `features`
 * to toggle a check/cross.
 */

const COMPARISON_FEATURES = [
  'Structured decision flow',
  'Multiple-choice guided Q/A',
  'Probability-ranked conclusions',
  'Visual progress tracking',
  'Auto-concludes at threshold',
  'Saved journey history',
  'Domain-aware questioning',
  'No conversation loops',
] as const;

type BadgeTone = 'brand' | 'mint' | 'violet' | 'neutral';

interface Tool {
  name: string;
  badge: string;
  tone: BadgeTone;
  /** Same length / order as COMPARISON_FEATURES. */
  features: boolean[];
  /** If true, the card is rendered with the brand-gradient halo. */
  highlight?: boolean;
}

const COMPARISON_TOOLS: Tool[] = [
  {
    name: 'ChatGPT',
    badge: 'Chat',
    tone: 'mint',
    features: [false, false, false, false, false, true, false, false],
  },
  {
    name: 'Perplexity',
    badge: 'Search',
    tone: 'brand',
    features: [false, false, false, false, false, true, false, false],
  },
  {
    name: 'Claude',
    badge: 'Chat',
    tone: 'violet',
    features: [false, false, false, false, false, true, false, false],
  },
  {
    name: 'AI HelpDesk',
    badge: 'Decisions',
    tone: 'brand',
    highlight: true,
    features: [true, true, true, true, true, true, true, true],
  },
];

const STATS: { value: string; label: string; color: string }[] = [
  { value: '8/8', label: 'Features included',         color: 'text-[color:var(--accent-cyan)]' },
  { value: '1',   label: 'Clear outcome per session', color: 'text-[color:var(--accent-violet)]' },
  { value: '0',   label: 'Endless chat loops',        color: 'text-[color:var(--accent-mint)]' },
];

/* ---------- ComparisonCard ----------
 *
 * Mirrors the snippet's ComparisonCard API but built from project
 * primitives (GlassCard + Badge + brand tokens). Highlighted variant
 * adds a gradientBorder + a soft halo to draw the eye to HelpDesk.
 */

interface ComparisonItem {
  label: string;
  has: boolean;
}

interface ComparisonCardProps {
  title: string;
  badge: string;
  tone: BadgeTone;
  items: ComparisonItem[];
  highlight?: boolean;
  isLight?: boolean;
  side?: 'left' | 'right';
}

function ComparisonCard({ title, badge, tone, items, highlight = false, isLight = false, side = 'left' }: ComparisonCardProps) {
  // Non-highlighted competitor cards are intentionally dimmed and desaturated
  // so the eye locks onto the one HelpDesk card. The highlighted card keeps
  // full saturation, the gradient border, and the halo.
  return (
    <motion.div
      variants={side === 'right' ? slideFromRight : slideFromLeft}
      className={cn(
        'h-full transition-all duration-500',
        !highlight && 'opacity-60 saturate-50 hover:opacity-90 hover:saturate-100',
      )}
    >
      <GlassCard
        hover={highlight}
        spotlight={highlight}
        gradientBorder={highlight}
        padding="md"
        className={cn(
          'h-full flex flex-col gap-4',
          highlight
            ? 'shadow-[0_30px_80px_-30px_rgba(31,134,255,0.45)] border-white/15'
            : 'border-white/5 bg-white/[0.015]',
        )}
      >
        {highlight && (
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-gradient-to-br from-[#1f86ff]/35 to-[#8b6cff]/0 blur-3xl opacity-80"
          />
        )}

        <header className="relative flex items-start justify-between gap-3">
          <h3
            className={cn(
              'text-lg font-semibold leading-tight',
              highlight ? 'text-gradient' : 'text-tertiary',
            )}
          >
            {title}
          </h3>
          <Badge
            tone={highlight ? tone : 'neutral'}
            className={cn(
              'shrink-0',
              highlight && isLight && 'bg-green-900 text-green-100 border-green-800',
            )}
          >
            {badge}
          </Badge>
        </header>

        <ul className="relative flex flex-col gap-2">
          {items.map((it) => (
            <li
              key={it.label}
              className="flex items-start gap-2 text-[13px] leading-snug"
            >
              <span
                className={cn(
                  'grid h-5 w-5 shrink-0 place-items-center rounded-full border',
                  it.has && highlight
                    ? isLight
                      ? 'border-green-600/60 bg-green-600 text-green-100'
                      : 'border-[color:var(--accent-cyan)]/40 bg-[color:var(--accent-cyan)]/10 text-[color:var(--accent-cyan)]'
                    : it.has
                      ? 'border-white/15 bg-white/5 text-secondary'
                      : isLight
                        ? 'border-slate-400/60 bg-red-50/50 text-slate-500'
                        : 'border-white/5 bg-white/2 text-tertiary',
                )}
              >
                {it.has ? <FiCheck size={11} /> : <FiX size={11} />}
              </span>
              <span
                className={cn(
                  it.has
                    ? highlight
                      ? 'text-secondary'
                      : 'text-tertiary'
                    : 'text-tertiary/60 line-through decoration-tertiary/30',
                )}
              >
                {it.label}
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </motion.div>
  );
}

/* ---------- Section ---------- */

export function MarketGapSection() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section
      id="why-helpdesk"
      className="relative py-32 overflow-hidden bg-gradient-to-b from-black/30 to-transparent"
    >
      {/* Background accent — matches the aurora pattern from the other landing sections */}
      <AuroraBlob
        className="right-[-100px] top-1/2 -translate-y-1/2 opacity-30"
        color="#3ee8ff"
        size={420}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Why AI HelpDesk is different"
          subtitle="Every other AI tool gives you a chat. Only AI HelpDesk gives you a destination."
        />

        {/* Cards grid */}
        <motion.div
          variants={stagger(0.08, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {COMPARISON_TOOLS.map((tool, i) => (
            <ComparisonCard
              key={tool.name}
              title={tool.name}
              badge={tool.badge}
              tone={tool.tone}
              highlight={tool.highlight}
              isLight={isLight}
              side={i < 2 ? 'left' : 'right'}
              items={COMPARISON_FEATURES.map((feat, j) => ({
                label: feat,
                has: tool.features[j],
              }))}
            />
          ))}
        </motion.div>

        {/* Bottom stat row */}
        <motion.div
          variants={stagger(0.1, 0.15)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={i % 2 === 0 ? slideFromLeft : slideFromRight}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
              className="text-center"
            >
              <div className={cn('text-3xl md:text-4xl font-black mb-1 tabular-nums', stat.color)}>
                {stat.value}
              </div>
              <div className="mono text-[10px] uppercase tracking-[0.22em] text-tertiary">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
