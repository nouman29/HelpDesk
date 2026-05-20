import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiGitBranch, FiCpu, FiTarget, FiShield, FiLayers, FiActivity,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { FEATURE_CARDS } from '@/data/journeys';
import { ROUTES } from '@/constants/routes';
import { fadeUp, stagger } from '@/utils/motion';

const ICONS: Record<string, IconType> = {
  GitBranch: FiGitBranch,
  Sparkles:  FiCpu,
  Target:    FiTarget,
  Shield:    FiShield,
  Brain:     FiActivity,
  Layers:    FiLayers,
};

export function FeaturesSection() {
  const navigate = useNavigate();

  return (
    <section id="product" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="What you get"
          title="A decision interface, not a chat box."
          subtitle="Every piece of the system is engineered for clarity under pressure."
        />

        <motion.div
          variants={stagger(0.06, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURE_CARDS.map((f) => {
            const Icon = ICONS[f.icon] ?? FiCpu;
            return (
              <motion.div key={f.id} variants={fadeUp}>
                <GlassCard
                  hover
                  spotlight
                  className="group h-full cursor-pointer"
                  onClick={() => navigate(ROUTES.CHAT)}
                >
                  <div className={`pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br ${f.accent} blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500`} />
                  <div className="relative">
                    <div className="grid h-11 w-11 place-items-center rounded-xl glass border border-white/10 text-[var(--brand-300)] group-hover:border-[var(--brand-400)]/40 transition-colors">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-primary">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-secondary leading-relaxed">{f.description}</p>
                    <div className="mt-6 flex items-center gap-2 text-xs mono uppercase tracking-[0.22em] text-tertiary group-hover:text-[var(--brand-300)] transition-colors">
                      open in journey →
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
