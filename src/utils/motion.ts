import type { Variants, Transition } from 'framer-motion';

export const EASE_OUT_EXPO: Transition['ease'] = [0.16, 1, 0.3, 1];
const EASE_IN_OUT: Transition['ease']          = [0.65, 0, 0.35, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
};

export const stagger = (delay = 0.08, initial = 0.1): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: delay, delayChildren: initial },
  },
});

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
};

export const blurFromLeft: Variants = {
  hidden: { opacity: 0, x: -50, filter: 'blur(12px)' },
  show:   { opacity: 1, x: 0,  filter: 'blur(0px)',  transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.4, ease: EASE_IN_OUT } },
};
