import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DOMAINS } from '@/data/journeys';
import { ROUTES } from '@/constants/routes';
import { fadeUp, stagger } from '@/utils/motion';

const IMAGES = [
  'https://picsum.photos/seed/career/800/600',
  'https://picsum.photos/seed/medical/800/600',
  'https://picsum.photos/seed/legal/800/600',
  'https://picsum.photos/seed/life/800/600',
  'https://picsum.photos/seed/business/800/600',
];

export function DomainsSection() {
  const navigate = useNavigate();

  return (
    <section id="docs" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Built for high-stakes"
          title="The decisions that actually change your life."
          subtitle="Five domains, one structured way to think through them."
        />

        <motion.div
          variants={stagger(0.06, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {DOMAINS.map((d, i) => (
            <motion.button
              key={d.name}
              variants={fadeUp}
              onClick={() => navigate(ROUTES.CHAT)}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl text-left"
            >
              <div className="absolute inset-0">
                <img
                  src={IMAGES[i]}
                  alt={`${d.name} decisions visual`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#1f86ff]/30 via-transparent to-[#8b6cff]/20 mix-blend-overlay opacity-80" />
              </div>
              <div className="relative h-full flex flex-col justify-between p-5">
                <div className="flex items-center justify-between">
                  <span className="mono text-[10px] uppercase tracking-[0.25em] text-white/70">
                    domain · 0{i + 1}
                  </span>
                  <FiArrowUpRight className="text-white/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">{d.name}</h3>
                  <p className="mt-1 text-xs text-white/70 max-w-[22ch]">{d.blurb}</p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 border border-white/10 rounded-2xl group-hover:border-white/30 transition-colors" />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
