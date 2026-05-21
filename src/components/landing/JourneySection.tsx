import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  FiMessageCircle,
  FiCheckCircle,
  FiHelpCircle,
  FiLayers,
  FiGitBranch,
  FiTarget,
  FiArrowRight,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { fadeUp, stagger } from '@/utils/motion';

/* ----------------------------- Data ----------------------------- */

interface ProblemCard {
  icon: IconType;
  title: string;
  description: string;
}

const problemCards: ProblemCard[] = [
  {
    icon: FiHelpCircle,
    title: 'Prompt Paralysis',
    description:
      "You stare at a blinking cursor wondering how to phrase the question. The blank box assumes you already know what you're looking for.",
  },
  {
    icon: FiLayers,
    title: 'Information Overload',
    description:
      'Walls of paragraphs, caveats, and bullet lists. You leave with more pages to read than answers to act on.',
  },
  {
    icon: FiGitBranch,
    title: 'Conversation Drift',
    description:
      'Every follow-up nudges the topic sideways. Ten messages later you realize you never resolved the original decision.',
  },
  {
    icon: FiTarget,
    title: 'No Clear Outcome',
    description:
      "You close the tab without a recommendation, a next step, or a 'do this.' Just options. Always more options.",
  },
];

const chaosMessages: { who: 'you' | 'ai'; text: string }[] = [
  { who: 'you', text: 'I have a fever and headache — what should I do?' },
  { who: 'ai',  text: 'There are many possible causes. It could be viral, bacterial, or related to dehydration. You may want to consider…' },
  { who: 'you', text: 'Okay but should I see a doctor?' },
  { who: 'ai',  text: "I'm not a medical professional, but generally if symptoms persist beyond 48–72 hours, it may be advisable to…" },
  { who: 'you', text: 'So… yes or no?' },
  { who: 'ai',  text: 'It depends on a number of factors including age, medical history, severity, and underlying conditions…' },
];

const structuredSteps: { step: string; label: string; status: 'done' | 'active' }[] = [
  { step: '01', label: 'What is your main symptom?',           status: 'done' },
  { step: '02', label: 'How severe is the fever?',             status: 'done' },
  { step: '03', label: 'How long has it lasted?',              status: 'done' },
  { step: '04', label: 'Any existing conditions?',             status: 'done' },
  { step: '05', label: 'Recommendation: see a clinician now',  status: 'active' },
];

/* --------------------------- Section ---------------------------- */

export function JourneySection() {
  const ref = useRef<HTMLDivElement>(null);
  // Scroll-driven animation: tie SVG line growth + a subtle parallax to the
  // section's scroll position, the same pattern the previous JourneySection
  // used.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const lineLength = useTransform(scrollYProgress, [0.1, 0.75], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="journeys" ref={ref} className="relative py-32">
      <motion.div style={{ y }} className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The Problem"
          title="The Problem With AI Today"
          subtitle="Modern AI tools give you conversations. What you actually need are conclusions."
        />

        {/* Comparison columns with an animated connector between them */}
        <motion.div
          variants={stagger(0.12, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 grid lg:grid-cols-[1fr_96px_1fr] gap-6 lg:gap-4 items-stretch"
        >
          {/* --- Traditional AI Chat (chaotic) --- */}
          <motion.div variants={fadeUp} className="h-full">
            <GlassCard
              hover
              spotlight
              padding="md"
              className="relative h-full flex flex-col border-rose-400/40"
              style={{
                boxShadow:
                  '0 0 0 1px rgba(244,63,94,0.25), 0 18px 60px -20px rgba(244,63,94,0.45)',
              }}
            >
              {/* red overlay */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500/12 via-rose-500/4 to-transparent"
              />
              <div className="relative flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-500/15 border border-rose-400/30 text-rose-300">
                  <FiMessageCircle size={16} />
                </div>
                <div>
                  <p className="mono text-[10px] uppercase tracking-[0.25em] text-tertiary">
                    Traditional AI Chat
                  </p>
                  <h3 className="mt-0.5 text-lg font-semibold text-primary">
                    Endless. Unfocused. No Outcome.
                  </h3>
                </div>
              </div>

              <div className="relative mt-4 flex flex-col gap-2">
                {chaosMessages.map((m, i) => (
                  <ChaosBubble key={i} who={m.who} text={m.text} />
                ))}
              </div>

              {/* Bottom fade-out — softens the last bubble into the card bg */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-2xl bg-gradient-to-t from-[var(--bg-1)] via-[var(--bg-1)]/60 to-transparent"
              />
            </GlassCard>
          </motion.div>

          {/* --- Animated connector (scroll-driven SVG) --- */}
          <motion.div
            variants={fadeUp}
            className="hidden lg:flex h-full items-stretch justify-center"
            aria-hidden
          >
            <ScrollConnector lineLength={lineLength} />
          </motion.div>

          {/* --- Help Desk AI (structured) --- */}
          <motion.div variants={fadeUp} className="h-full">
            <GlassCard
              hover
              spotlight
              padding="md"
              className="relative h-full flex flex-col justify-between border-emerald-400/40"
              style={{
                boxShadow:
                  '0 0 0 1px rgba(16,185,129,0.25), 0 18px 60px -20px rgba(16,185,129,0.45)',
              }}
            >
              {/* green overlay */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/12 via-emerald-500/4 to-transparent"
              />
              <div className="relative flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                  <FiCheckCircle size={16} />
                </div>
                <div>
                  <p className="mono text-[10px] uppercase tracking-[0.25em] text-tertiary">
                    Help Desk AI
                  </p>
                  <h3 className="mt-0.5 text-lg font-semibold text-primary">
                    Structured. Guided. Resolved.
                  </h3>
                </div>
              </div>

              <div className="relative mt-6 flex flex-col gap-9">
                {structuredSteps.map((s, i) => (
                  <StructuredStep key={i} step={s.step} label={s.label} status={s.status} />
                ))}
              </div>

              {/* Bottom fade-out — softens the last step into the card bg */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-2xl bg-gradient-to-t from-[var(--bg-1)] via-[var(--bg-1)]/60 to-transparent"
              />
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Problem cards grid — horizontal-row style */}
        <motion.div
          variants={stagger(0.08, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid sm:grid-cols-2 gap-6"
        >
          {problemCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} variants={fadeUp}>
                <GlassCard hover spotlight padding="sm" className="group">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#1f86ff]/25 to-[#8b6cff]/20 border border-white/10 text-[var(--brand-300)] group-hover:text-[var(--brand-200)] transition-colors">
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-[15px] font-semibold text-primary leading-tight">
                          {card.title}
                        </h4>
                        <FiArrowRight
                          size={13}
                          className="shrink-0 text-tertiary group-hover:text-[var(--brand-300)] group-hover:translate-x-0.5 transition-all"
                        />
                      </div>
                      <p className="mt-0.5 text-[13px] text-secondary leading-snug">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* --------------------- Scroll connector SVG --------------------- */

interface ScrollConnectorProps {
  // MotionValue<number> from useTransform; left untyped to avoid importing
  // the generic just for one prop. Framer accepts it directly via style.
  lineLength: ReturnType<typeof useTransform<number, number>>;
}

/**
 * Vertical animated bridge between the two comparison cards. The gradient
 * line "draws" itself as the section scrolls into view, and the decision
 * nodes pulse with staggered delays — the same motion language the
 * previous JourneySection used, repurposed as a divider.
 */
function ScrollConnector({ lineLength }: ScrollConnectorProps) {
  return (
    <svg
      viewBox="0 0 80 520"
      preserveAspectRatio="none"
      className="h-full w-[80px]"
    >
      <defs>
        <linearGradient id="journey-connector-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ff7ab8" stopOpacity="0.85" />
          <stop offset="45%"  stopColor="#8b6cff" />
          {/* Fade out at the bottom end of the line */}
          <stop offset="85%"  stopColor="#3ee8ff" stopOpacity="1" />
          <stop offset="100%" stopColor="#3ee8ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="journey-connector-track" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="85%"  stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="journey-connector-glow">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Track (static, subtle — also fades out at the bottom) */}
      <path
        d="M40 10 C 64 110, 16 200, 40 290 S 64 410, 40 510"
        stroke="url(#journey-connector-track)"
        strokeWidth="2"
        fill="none"
      />
      {/* Animated path that grows with scroll progress and fades at the end */}
      <motion.path
        d="M40 10 C 64 110, 16 200, 40 290 S 64 410, 40 510"
        stroke="url(#journey-connector-grad)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        style={{ pathLength: lineLength }}
        filter="url(#journey-connector-glow)"
      />
    </svg>
  );
}

/* ------------------------- Subcomponents ------------------------- */

function ChaosBubble({ who, text }: { who: 'you' | 'ai'; text: string }) {
  const isYou = who === 'you';
  return (
    <div className={`flex w-full ${isYou ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed',
          isYou
            ? 'bg-gradient-to-br from-[#1f86ff]/80 to-[#4aa6ff]/70 text-white'
            : 'glass border border-white/10 text-secondary',
        ].join(' ')}
      >
        {text}
      </div>
    </div>
  );
}

function StructuredStep({
  step,
  label,
  status,
}: {
  step: string;
  label: string;
  status: 'done' | 'active';
}) {
  const isActive = status === 'active';
  return (
    <div
      className={[
        'flex items-center gap-3 rounded-xl border transition-colors',
        isActive
          ? 'bg-emerald-500/8 border-emerald-400/30 px-4 py-3.5 shadow-[0_0_30px_-10px_rgba(16,185,129,0.45)]'
          : 'glass border-white/10 px-3 py-2.5',
      ].join(' ')}
    >
      <div
        className={[
          'grid h-7 w-7 shrink-0 place-items-center rounded-lg mono text-[10px]',
          isActive
            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30'
            : 'bg-white/5 text-tertiary border border-white/10',
        ].join(' ')}
      >
        {isActive ? <FiCheckCircle size={12} /> : step}
      </div>
      <p
        className={[
          'text-[13px] leading-snug',
          isActive ? 'text-primary font-medium' : 'text-secondary',
        ].join(' ')}
      >
        {label}
      </p>
      {!isActive && (
        <FiCheckCircle
          size={12}
          className="ml-auto shrink-0 text-emerald-300/70"
          aria-hidden
        />
      )}
    </div>
  );
}
