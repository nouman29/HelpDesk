import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MagneticButton } from '@/components/animations/MagneticButton';
import { AIOrb } from '@/components/three/AIOrb';
import { HeroBackground } from '@/components/three/HeroBackground';
import { AuroraBlob } from '@/components/animations/AuroraBlob';
import { ROUTES } from '@/constants/routes';
import { fadeUp, blurUp, stagger } from '@/utils/motion';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* 3D ambient background */}
      <HeroBackground className="absolute inset-0 -z-10" />

      {/* Aurora accents */}
      <AuroraBlob className="left-[-180px] top-[8%] opacity-50" color="#1f86ff" size={520} />
      <AuroraBlob className="right-[-200px] top-[40%] opacity-40" color="#8b6cff" size={580} />
      <AuroraBlob className="left-1/2 bottom-[-220px] -translate-x-1/2 opacity-30" color="#3ee8ff" size={680} />

      <div className="mx-auto w-full max-w-7xl px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        {/* LEFT — copy */}
        <motion.div
          variants={stagger(0.1, 0.2)}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-7"
        >
          <motion.div variants={fadeUp}>
            <Badge tone="brand">
              <span className="mono uppercase tracking-[0.18em]">v 1.0 · preview</span>
            </Badge>
          </motion.div>

          <motion.h1
            variants={blurUp}
            className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tight"
          >
            <span className="block text-gradient text-glow">Guided AI</span>
            <span className="block text-gradient text-glow">Decision</span>
            <span className="block text-gradient text-glow">Journeys.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-lg md:text-xl text-secondary leading-relaxed"
          >
            AI that helps you <span className="text-primary">reach decisions</span> — not just conversations.
            Built for the moments where the choice actually matters.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <MagneticButton strength={0.2}>
              <Button
                size="lg"
                rightIcon={<FiArrowRight />}
                onClick={() => navigate(ROUTES.CHAT)}
              >
                Start AI Conversation
              </Button>
            </MagneticButton>

            <MagneticButton strength={0.15}>
              <Button
                size="lg"
                variant="glass"
                leftIcon={<FiPlay />}
                onClick={() => navigate(ROUTES.CHAT)}
              >
                Explore Decision Flow
              </Button>
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* RIGHT — 3D orb + assistant preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-square w-full max-w-[640px] mx-auto"
        >
          <AIOrb className="absolute inset-0" />
          <HeroAssistantCard />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-tertiary"
      >
        <span className="mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="h-9 w-5 rounded-full border border-white/15 grid place-items-start p-1">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-1.5 w-1.5 rounded-full bg-[var(--brand-300)]"
          />
        </div>
      </motion.div>
    </section>
  );
}

function HeroAssistantCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-4 right-2 md:right-0 w-[290px] md:w-[340px] rounded-2xl glass-strong border border-white/10 p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="relative h-2.5 w-2.5">
          <span className="absolute inset-0 rounded-full bg-emerald-400" />
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
        </div>
        <span className="mono text-[10px] uppercase tracking-[0.25em] text-tertiary">AI Assistant · live</span>
      </div>
      <p className="text-[13px] leading-relaxed text-secondary">
        “Let's narrow this. You have <span className="text-primary">9 months runway</span>.
        Two paths remain. I'll stress-test each against your re-entry risk next.”
      </p>
      <div className="mt-3 flex items-center justify-between text-[11px] text-tertiary mono">
        <span>step 03 of 05</span>
        <div className="flex gap-1">
          <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
        </div>
      </div>
    </motion.div>
  );
}
