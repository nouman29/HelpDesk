import { AnimatePresence, motion } from 'framer-motion';

interface Props { active: boolean; }

/**
 * A black, layered cinematic wipe used between Signup → Login.
 * Renders nothing when `active` is false.
 */
export function CinematicWipe({ active }: Props) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="wipe"
          className="fixed inset-0 z-100 pointer-events-none"
          initial="hidden"
          animate="show"
          exit="exit"
        >
          {/* base black */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
            style={{ transformOrigin: '0% 50%' }}
          />
          {/* blue lining */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(110deg, rgba(31,134,255,0.6), rgba(139,108,255,0.4) 50%, transparent 70%)',
              transformOrigin: '0% 50%',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 0.9, 0] }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
          />
          {/* exit wipe (second pass) */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.83, 0, 0.17, 1] }}
            style={{ transformOrigin: '100% 50%' }}
          />

          {/* center spark */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.3, 0.8] }}
            transition={{ duration: 0.8, times: [0, 0.4, 1] }}
          >
            <div className="h-20 w-20 rounded-full bg-(--brand-400)/30 blur-2xl" />
            <div className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-white" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
