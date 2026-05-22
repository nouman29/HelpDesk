import { motion } from 'framer-motion';
import { SiteLayout } from '@/app/layouts/SiteLayout';
import { HeroSection } from '@/components/landing/HeroSection';
import { JourneySection } from '@/components/landing/JourneySection';
import { AIFlowPreview } from '@/components/landing/AIFlowPreview';
import { MarketGapSection } from '@/components/landing/MarketGapSection';
import { pageTransition } from '@/utils/motion';

export default function LandingPage() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <SiteLayout>
        <HeroSection />
        <JourneySection />
        <AIFlowPreview />
        <MarketGapSection />
      </SiteLayout>
    </motion.div>
  );
}
