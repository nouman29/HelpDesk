import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp, blurUp, fadeIn, scaleIn } from '@/utils/motion';

const PRESETS = {
  fadeUp,
  blurUp,
  fadeIn,
  scaleIn,
} satisfies Record<string, Variants>;

interface Props {
  children: ReactNode;
  preset?: keyof typeof PRESETS;
  delay?: number;
  once?: boolean;
  amount?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'span';
}

export function Reveal({
  children, preset = 'fadeUp', delay = 0, once = true, amount = 0.3, className, as = 'div',
}: Props) {
  const variants = PRESETS[preset];
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
