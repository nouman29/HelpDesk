import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin animated progress bar fixed to the top of the viewport. */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    mass: 0.2,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left"
      style={{
        scaleX,
        background:
          'linear-gradient(90deg, #1f86ff, #8b6cff, #3ee8ff)',
        boxShadow: '0 0 14px rgba(74,166,255,0.5)',
      }}
    />
  );
}
