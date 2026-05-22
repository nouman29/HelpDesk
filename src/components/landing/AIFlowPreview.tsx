import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import {
  FiTarget,
  FiZap,
  FiCheckCircle,
} from 'react-icons/fi';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AuroraBlob } from '@/components/animations/AuroraBlob';
import { EASE_OUT_EXPO } from '@/utils/motion';
import { cn } from '@/utils/cn';
import { useTheme } from '@/features/theme/ThemeContext';

/* ---------- Types ---------- */

type NodeType = 'goal' | 'ai' | 'option' | 'final';

const VIEWPORT_REPEAT = { once: false, amount: 0.35 } as const;

const DIAGRAM_WIDTH = 820;
const DIAGRAM_HEIGHT = 700;

/* ---------- FlowNode ---------- */

interface FlowNodeProps {
  label: string;
  type: NodeType;
  icon?: IconType;
  delay?: number;
}

function FlowNode({ label, type, icon: Icon, delay = 0 }: FlowNodeProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const baseByType: Record<NodeType, string> = {
    goal: isLight
      ? 'border-[color:var(--accent-violet)]/50 bg-[color:var(--accent-violet)]/10 hover:border-[color:var(--accent-violet)]/80 hover:bg-[color:var(--accent-violet)]/20 hover:shadow-[0_0_25px_rgba(139,108,255,0.25)]'
      : 'border-[color:var(--accent-violet)]/40 bg-[color:var(--accent-violet)]/10 hover:border-[color:var(--accent-violet)]/70 hover:bg-[color:var(--accent-violet)]/20 hover:shadow-[0_0_25px_rgba(139,108,255,0.3)]',

    ai: isLight
      ? 'border-[color:var(--brand-500)]/40 bg-[color:var(--brand-500)]/10 hover:border-[color:var(--brand-600)] hover:bg-[color:var(--brand-500)]/20 hover:shadow-[0_0_25px_rgba(31,134,255,0.25)]'
      : 'border-[color:var(--brand-400)]/50 bg-[color:var(--brand-500)]/10 hover:border-[color:var(--brand-300)] hover:bg-[color:var(--brand-500)]/20 hover:shadow-[0_0_25px_rgba(31,134,255,0.3)]',

    option: isLight
      ? 'border-slate-300 bg-slate-100 hover:border-[color:var(--brand-400)]/60 hover:bg-[color:var(--brand-50)] hover:shadow-[0_0_20px_rgba(31,134,255,0.15)]'
      : 'border-white/10 bg-white/5 hover:border-[color:var(--accent-cyan)]/40 hover:bg-[color:var(--accent-cyan)]/5 hover:shadow-[0_0_20px_rgba(62,232,255,0.2)]',

    final: isLight
      ? 'border-[color:var(--brand-500)]/70 bg-[color:var(--brand-500)]/10 hover:border-[color:var(--brand-600)] hover:shadow-[0_0_35px_rgba(31,134,255,0.35)] animate-pulse'
      : 'border-[color:var(--accent-cyan)]/60 bg-[color:var(--accent-cyan)]/10 hover:border-[color:var(--accent-cyan)] hover:shadow-[0_0_35px_rgba(62,232,255,0.4)] animate-pulse',
  };

  const iconColorByType: Record<NodeType, string> = {
    goal: 'text-[color:var(--accent-violet)]',
    ai: isLight ? 'text-[color:var(--brand-600)]' : 'text-[color:var(--brand-300)]',
    option: 'text-tertiary',
    final: isLight ? 'text-[color:var(--brand-600)]' : 'text-[color:var(--accent-cyan)]',
  };

  const textColorByType: Record<NodeType, string> = {
    goal: 'text-[color:var(--accent-violet)]',
    ai: isLight ? 'text-[color:var(--brand-700)]' : 'text-[color:var(--brand-200)]',
    option: 'text-secondary',
    final: isLight
      ? 'text-[color:var(--brand-700)] font-bold'
      : 'text-[color:var(--accent-cyan)] font-bold',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT_REPEAT}
      transition={{ delay, duration: 0.5, ease: EASE_OUT_EXPO }}
      whileHover={{ scale: 1.03 }}
      aria-label={label}
      className={cn(
        'relative w-[175px] rounded-2xl border px-4 py-3.5 transition-all duration-200',
        baseByType[type],
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold',
          textColorByType[type],
        )}
      >
        {Icon && <Icon className={cn('h-3.5 w-3.5 shrink-0', iconColorByType[type])} />}
        <span>{label}</span>
      </div>
    </motion.div>
  );
}

/* ---------- Section ---------- */

export function AIFlowPreview() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateScale = () => {
      const wrapperWidth = wrapper.offsetWidth;
      const nextScale = Math.min(wrapperWidth / DIAGRAM_WIDTH, 1);
      setScale(nextScale);
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(wrapper);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section
      id="decision-flow"
      className="relative overflow-hidden py-16 sm:py-24 md:py-32"
    >
      <AuroraBlob
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"
        color="#3ee8ff"
        size={620}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title="Experience the Decision Flow"
          subtitle="A guided AI decision tree — every branch converges on one clear, final outcome."
        />

        <div
          ref={wrapperRef}
          className="relative mx-auto mt-10 w-full max-w-[820px] sm:mt-16"
          style={{
            height: `${DIAGRAM_HEIGHT * scale}px`,
          }}
        >
          <div
            className="absolute left-0 top-0"
            style={{
              width: `${DIAGRAM_WIDTH}px`,
              height: `${DIAGRAM_HEIGHT}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <motion.svg
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 h-full w-full"
              viewBox={`0 0 ${DIAGRAM_WIDTH} ${DIAGRAM_HEIGHT}`}
              preserveAspectRatio="none"
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_REPEAT}
            >
              <motion.line
                x1="410"
                y1="82"
                x2="410"
                y2="150"
                stroke="rgba(62,232,255,0.34)"
                strokeWidth="1.6"
                strokeDasharray="7 4"
                variants={{
                  hidden: { pathLength: 0 },
                  visible: {
                    pathLength: 1,
                    transition: {
                      delay: 0.2,
                      duration: 0.55,
                      ease: EASE_OUT_EXPO,
                    },
                  },
                }}
              />

              <motion.path
                d="M410 225 L410 280 L265 330"
                fill="none"
                stroke="rgba(139,108,255,0.38)"
                strokeWidth="1.6"
                strokeDasharray="7 4"
                variants={{
                  hidden: { pathLength: 0 },
                  visible: {
                    pathLength: 1,
                    transition: {
                      delay: 0.65,
                      duration: 0.75,
                      ease: EASE_OUT_EXPO,
                    },
                  },
                }}
              />

              <motion.path
                d="M410 225 L410 280 L555 330"
                fill="none"
                stroke="rgba(139,108,255,0.38)"
                strokeWidth="1.6"
                strokeDasharray="7 4"
                variants={{
                  hidden: { pathLength: 0 },
                  visible: {
                    pathLength: 1,
                    transition: {
                      delay: 1.25,
                      duration: 0.75,
                      ease: EASE_OUT_EXPO,
                    },
                  },
                }}
              />

              <motion.line
                x1="265"
                y1="388"
                x2="265"
                y2="465"
                stroke="rgba(31,134,255,0.34)"
                strokeWidth="1.6"
                strokeDasharray="7 4"
                variants={{
                  hidden: { pathLength: 0 },
                  visible: {
                    pathLength: 1,
                    transition: {
                      delay: 1.85,
                      duration: 0.65,
                      ease: EASE_OUT_EXPO,
                    },
                  },
                }}
              />

              <motion.line
                x1="555"
                y1="388"
                x2="555"
                y2="465"
                stroke="rgba(31,134,255,0.34)"
                strokeWidth="1.6"
                strokeDasharray="7 4"
                variants={{
                  hidden: { pathLength: 0 },
                  visible: {
                    pathLength: 1,
                    transition: {
                      delay: 2.4,
                      duration: 0.65,
                      ease: EASE_OUT_EXPO,
                    },
                  },
                }}
              />

              <motion.path
                d="M265 525 L410 580"
                fill="none"
                stroke="rgba(62,232,255,0.48)"
                strokeWidth="1.6"
                strokeDasharray="7 4"
                variants={{
                  hidden: { pathLength: 0 },
                  visible: {
                    pathLength: 1,
                    transition: {
                      delay: 2.95,
                      duration: 0.75,
                      ease: EASE_OUT_EXPO,
                    },
                  },
                }}
              />

              <motion.path
                d="M555 525 L410 580"
                fill="none"
                stroke="rgba(62,232,255,0.48)"
                strokeWidth="1.6"
                strokeDasharray="7 4"
                variants={{
                  hidden: { pathLength: 0 },
                  visible: {
                    pathLength: 1,
                    transition: {
                      delay: 3.55,
                      duration: 0.75,
                      ease: EASE_OUT_EXPO,
                    },
                  },
                }}
              />
            </motion.svg>

            <div className="absolute left-1/2 top-[20px] z-10 -translate-x-1/2">
              <FlowNode
                type="goal"
                label="Your Goal"
                icon={FiTarget}
                delay={0.1}
              />
            </div>

            <div className="absolute left-1/2 top-[155px] z-10 -translate-x-1/2">
              <FlowNode
                type="ai"
                label="AI Analysing"
                icon={FiZap}
                delay={0.3}
              />
            </div>

            <div className="absolute left-[32.3%] top-[330px] z-10 -translate-x-1/2">
              <FlowNode
                type="option"
                label="Option A"
                delay={0.5}
              />
            </div>

            <div className="absolute left-[67.7%] top-[330px] z-10 -translate-x-1/2">
              <FlowNode
                type="option"
                label="Option B"
                delay={0.6}
              />
            </div>

            <div className="absolute left-[32.3%] top-[470px] z-10 -translate-x-1/2">
              <FlowNode
                type="option"
                label="Deeper A"
                delay={0.7}
              />
            </div>

            <div className="absolute left-[67.7%] top-[470px] z-10 -translate-x-1/2">
              <FlowNode
                type="option"
                label="Deeper B"
                delay={0.8}
              />
            </div>

            <div className="absolute left-1/2 top-[585px] z-10 -translate-x-1/2">
              <FlowNode
                type="final"
                label="Final Decision"
                icon={FiCheckCircle}
                delay={0.7}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}