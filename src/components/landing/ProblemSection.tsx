import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { PROBLEM_POINTS } from '@/data/journeys';
import { ROUTES } from '@/constants/routes';
import { fadeUp, stagger } from '@/utils/motion';

const FLOATING_PHRASES = [
  'tell me more', 'rephrase', 'sorry',
  'as an AI', 'maybe', "I don't know",
  'try again', 'unclear', 'depends',
  'good question', 'consider',
];

export function ProblemSection() {
  const navigate = useNavigate();

  return (
    <section id="problem" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The problem"
          title="Modern AI gives you everything — and decides nothing."
          subtitle="The chat box is a maze. Users get stuck in conversation loops, drown in tokens, and walk away no closer to a decision."
        />

        <div className="mt-24 grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT — chaos visualization */}
          <div className="relative h-[480px] rounded-3xl glass border border-white/10 overflow-hidden">
            <div className="absolute inset-0 opacity-50"
                 style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,120,184,0.25), transparent 60%), radial-gradient(circle at 70% 70%, rgba(139,108,255,0.25), transparent 60%)' }} />
            {FLOATING_PHRASES.map((phrase, i) => {
              const left = (i * 11.7) % 80 + 5;
              const top  = (i * 7.3)  % 75 + 5;
              const drift = 4 + (i % 4);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -8, 0],
                    rotate: [0, i % 2 === 0 ? 2 : -2, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: i * 0.04 },
                    scale:   { duration: 0.5, delay: i * 0.04 },
                    y:       { duration: drift, ease: 'easeInOut', repeat: Infinity, delay: i * 0.1 },
                    rotate:  { duration: drift, ease: 'easeInOut', repeat: Infinity, delay: i * 0.1 },
                  }}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  className="absolute rounded-full glass border border-white/10 px-3 py-1.5 text-xs text-secondary backdrop-blur"
                >
                  {phrase}
                </motion.div>
              );
            })}

            {/* Tangled lines */}
            <svg viewBox="0 0 480 480" className="absolute inset-0 h-full w-full pointer-events-none opacity-50">
              <defs>
                <linearGradient id="tangle" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%"  stopColor="#ff7ab8" />
                  <stop offset="100%" stopColor="#8b6cff" />
                </linearGradient>
              </defs>
              <path d="M30 50 C 200 0, 280 380, 450 420 S 100 460, 470 80"
                    stroke="url(#tangle)" strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M50 420 C 200 200, 300 50, 460 380"
                    stroke="url(#tangle)" strokeWidth="1.5" fill="none" opacity="0.5" />
              <path d="M80 200 C 240 480, 360 0, 400 240"
                    stroke="url(#tangle)" strokeWidth="1.5" fill="none" opacity="0.4" />
            </svg>

            <div className="absolute inset-x-0 bottom-0 p-4 mono text-[10px] uppercase tracking-[0.25em] text-tertiary flex items-center justify-between">
              <span>chat ui — looping</span>
              <span className="text-rose-300/80">no decision</span>
            </div>
          </div>

          {/* RIGHT — list */}
          <motion.ul
            variants={stagger(0.08, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col gap-3"
          >
            {PROBLEM_POINTS.map((p, i) => (
              <motion.li key={p.title} variants={fadeUp}>
                <div className="group flex items-start gap-4 rounded-2xl p-5 glass border border-white/5 hover:border-white/15 transition-all duration-500">
                  <span className="mono text-xs text-tertiary pt-1">0{i + 1}</span>
                  <div>
                    <h4 className="font-semibold text-primary">{p.title}</h4>
                    <p className="text-sm text-secondary mt-0.5">{p.description}</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Transition strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 rounded-3xl glass-strong border border-white/10 p-8 md:p-12 text-center"
        >
          <p className="mono text-[10px] uppercase tracking-[0.3em] text-tertiary">we replace this with</p>
          <h3 className="mt-3 text-3xl md:text-5xl font-semibold text-gradient">
            One clear path. One clear decision.
          </h3>
          <p className="mt-4 max-w-xl mx-auto text-secondary">
            A guided flow that converges instead of loops — every interaction moves you forward.
          </p>
          <div className="mt-7 flex justify-center">
            <Button size="lg" rightIcon={<FiArrowRight />} onClick={() => navigate(ROUTES.CHAT)}>
              See the difference
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
