import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { BareLayout } from '@/app/layouts/BareLayout';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { pageTransition } from '@/utils/motion';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <motion.div variants={pageTransition} initial="initial" animate="enter" exit="exit">
      <BareLayout>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <p className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand-300)]">404</p>
          <h1 className="mt-4 text-6xl md:text-8xl font-semibold tracking-tight">
            <span className="text-gradient">Off the path.</span>
          </h1>
          <p className="mt-4 max-w-md text-secondary">
            That route hasn't been mapped in this decision journey. Let's get you back to clarity.
          </p>
          <div className="mt-8">
            <Button size="lg" leftIcon={<FiArrowLeft />} onClick={() => navigate(ROUTES.LANDING)}>
              Back to HelpDesk
            </Button>
          </div>
        </div>
      </BareLayout>
    </motion.div>
  );
}
