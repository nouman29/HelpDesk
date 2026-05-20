import { motion } from 'framer-motion';

/** Lightweight skeleton shown while a route chunk is loading. */
export function RouteFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-0 rounded-full border-t border-[var(--brand-400)] animate-spin" />
          <div className="absolute inset-3 rounded-full bg-[var(--brand-500)]/30 blur-md" />
        </div>
        <p className="mono text-xs tracking-[0.25em] text-[var(--text-3)] uppercase">
          Initializing
        </p>
      </motion.div>
    </div>
  );
}
