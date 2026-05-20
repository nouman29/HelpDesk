import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { DECISION_JOURNEY } from '@/data/journeys';
import { ROUTES } from '@/constants/routes';
import { fadeUp, stagger } from '@/utils/motion';

export function JourneySection() {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const lineLength = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="journeys" ref={ref} className="relative py-32">
      <motion.div style={{ y }} className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Introducing"
          title="Guided AI Decision Journeys"
          subtitle="A visual logic path — not a chat scroll. The AI takes you from confusion to commitment in five structured steps."
        />

        <div className="relative mt-24 grid lg:grid-cols-[1fr_1.1fr] gap-16 items-start">
          {/* Animated SVG path */}
          <div className="relative h-[520px] hidden lg:block">
            <svg viewBox="0 0 400 520" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="path-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#1f86ff" />
                  <stop offset="60%"  stopColor="#8b6cff" />
                  <stop offset="100%" stopColor="#3ee8ff" />
                </linearGradient>
                <filter id="path-glow">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Branches */}
              <path d="M200 20 C 250 100, 100 120, 200 200 S 300 300, 200 380 S 100 470, 200 500"
                    stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
              <motion.path
                d="M200 20 C 250 100, 100 120, 200 200 S 300 300, 200 380 S 100 470, 200 500"
                stroke="url(#path-grad)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                style={{ pathLength: lineLength }}
                filter="url(#path-glow)"
              />

              {/* Decision nodes */}
              {[20, 130, 240, 360, 500].map((cy, i) => (
                <g key={i}>
                  <circle cx="200" cy={cy} r="14" fill="rgba(31,134,255,0.15)" />
                  <motion.circle
                    cx="200" cy={cy} r="6" fill="#4aa6ff"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3 }}
                  />
                </g>
              ))}

              {/* Side branches (dashed) */}
              <path d="M200 130 L 60 110"   stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 4" fill="none" />
              <path d="M200 130 L 340 110"  stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 4" fill="none" />
              <path d="M200 240 L 70 270"   stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 4" fill="none" />
              <path d="M200 360 L 340 380"  stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 4" fill="none" />

              {/* Floating "rejected" leaves */}
              <circle cx="60" cy="110" r="4" fill="rgba(255,255,255,0.25)" />
              <circle cx="340" cy="110" r="4" fill="rgba(255,255,255,0.25)" />
              <circle cx="70" cy="270" r="4" fill="rgba(255,255,255,0.25)" />
              <circle cx="340" cy="380" r="4" fill="rgba(255,255,255,0.25)" />
            </svg>
          </div>

          {/* Steps */}
          <motion.div
            variants={stagger(0.1, 0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col gap-4"
          >
            {DECISION_JOURNEY.map((step, idx) => (
              <motion.div key={step.id} variants={fadeUp}>
                <GlassCard hover spotlight className="group">
                  <div className="flex items-start gap-5">
                    <div className="relative shrink-0">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#1f86ff]/30 to-[#8b6cff]/20 border border-white/10">
                        <span className="mono text-sm text-[var(--brand-200)]">0{idx + 1}</span>
                      </div>
                      <div className="absolute -inset-1 rounded-xl bg-[#1f86ff]/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-primary">{step.title}</h3>
                        <span className="mono text-[10px] uppercase tracking-[0.22em] text-tertiary">{step.type}</span>
                      </div>
                      <p className="mt-1.5 text-sm text-secondary leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}

            <motion.div variants={fadeUp} className="pt-4">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<FiArrowRight />}
                onClick={() => navigate(ROUTES.CHAT)}
              >
                Start a journey now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
