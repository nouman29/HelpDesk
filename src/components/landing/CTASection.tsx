import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/animations/MagneticButton';
import { AuroraBlob } from '@/components/animations/AuroraBlob';
import { ROUTES } from '@/constants/routes';
import { isAuthenticated } from '@/features/auth/authStorage';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] glass-strong border border-white/10 p-10 md:p-20 text-center"
        >
          <AuroraBlob className="left-[10%] top-[-100px]" color="#1f86ff" size={420} />
          <AuroraBlob className="right-[5%] bottom-[-100px]" color="#8b6cff" size={420} />
          <div className="absolute inset-0 opacity-30"
               style={{ backgroundImage: 'radial-gradient(circle at 50% 0, rgba(74,166,255,0.35), transparent 60%)' }} />

          <p className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand-200)]">
            the next decision starts here
          </p>
          <h2 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight">
            <span className="text-gradient">Stop chatting. Start deciding.</span>
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-secondary text-lg">
            Let AI guide you, step by step, through the most important decisions of your life — career, medical, legal, or otherwise.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <MagneticButton>
              <Button
                size="lg"
                rightIcon={<FiArrowRight />}
                onClick={() =>
                  navigate(isAuthenticated() ? ROUTES.CHAT : ROUTES.LOGIN)
                }
              >
                Open AI HelpDesk
              </Button>
            </MagneticButton>
            {!isAuthenticated() && (
              <MagneticButton>
                <Button size="lg" variant="glass" onClick={() => navigate(ROUTES.SIGNUP)}>
                  Create an account
                </Button>
              </MagneticButton>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
