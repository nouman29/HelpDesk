import { motion } from 'framer-motion';
import { Badge } from './Badge';
import { fadeUp, stagger } from '@/utils/motion';
import { cn } from '@/utils/cn';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow, title, subtitle, align = 'center', className,
}: Props) {
  return (
    <motion.div
      variants={stagger(0.08, 0.05)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && (
        <motion.div variants={fadeUp}>
          <Badge tone="brand">{eyebrow}</Badge>
        </motion.div>
      )}
      <motion.h2
        variants={fadeUp}
        className="max-w-3xl text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight"
      >
        <span className="text-gradient">{title}</span>
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className={cn(
            'max-w-2xl text-base md:text-lg text-secondary leading-relaxed',
            align === 'center' && 'text-center',
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
