import { motion } from 'framer-motion';
import { SiteLayout } from '@/app/layouts/SiteLayout';
import { HeroSection } from '@/components/landing/HeroSection';
import { JourneySection } from '@/components/landing/JourneySection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { DomainsSection } from '@/components/landing/DomainsSection';
import { ShowcaseSection } from '@/components/landing/ShowcaseSection';
import { CTASection } from '@/components/landing/CTASection';
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
        <ProblemSection />
        <FeaturesSection />
        <DomainsSection />
        <ShowcaseSection />
        <CTASection />
      </SiteLayout>
    </motion.div>
  );
}
