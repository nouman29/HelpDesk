import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';

export function ShowcaseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [8, -6]);
  const scale  = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.96]);

  return (
    <section id="pricing" ref={ref} className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The workspace"
          title="An interface tuned for clarity."
          subtitle="Every surface is glass. Every interaction has weight."
        />

        <motion.div
          style={{ rotate, scale }}
          className="mt-24 mx-auto max-w-5xl"
        >
          <GlassCard gradientBorder padding="none" className="overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="mono ml-3 text-[10px] uppercase tracking-[0.22em] text-tertiary">
                helpdesk.ai / journey / career-pivot-001
              </span>
            </div>
            <div className="grid grid-cols-[200px_1fr] min-h-[420px]">
              <aside className="border-r border-white/10 p-4 flex flex-col gap-2">
                {['New Journey', 'Career Pivot', 'Migraine Tree', 'SaaS Contract', 'Relocation'].map((label, i) => (
                  <div
                    key={label}
                    className={`rounded-lg px-3 py-2 text-xs ${i === 1 ? 'bg-white/10 text-primary' : 'text-secondary'} hover:bg-white/5 cursor-default`}
                  >
                    {label}
                  </div>
                ))}
              </aside>
              <div className="p-6 flex flex-col gap-4">
                <Bubble role="ai">
                  Three options remain: industry research engineer, frontier-lab applied research, PhD pivot.
                </Bubble>
                <Bubble role="user">
                  I have 9 months of runway. PhD feels out.
                </Bubble>
                <Bubble role="ai">
                  Eliminating PhD path. Stress-testing the remaining two for re-entry risk and salary recovery.
                </Bubble>
                <Bubble role="ai" thinking />
                <div className="mt-auto rounded-xl glass border border-white/10 p-3 flex items-center justify-between">
                  <span className="text-xs text-tertiary">Step 03 / 05 · Stress-test</span>
                  <div className="flex gap-1">
                    <span className="h-1 w-12 rounded-full bg-[var(--brand-500)]" />
                    <span className="h-1 w-12 rounded-full bg-[var(--brand-500)]" />
                    <span className="h-1 w-12 rounded-full bg-[var(--brand-500)] animate-pulse" />
                    <span className="h-1 w-12 rounded-full bg-white/10" />
                    <span className="h-1 w-12 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

function Bubble({ role, children, thinking }: { role: 'ai' | 'user'; children?: React.ReactNode; thinking?: boolean }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-gradient-to-br from-[#1f86ff] to-[#4aa6ff] text-white'
            : 'glass border border-white/10 text-secondary'
        }`}
      >
        {thinking ? (
          <span className="inline-flex items-center gap-1">
            <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
          </span>
        ) : children}
      </div>
    </div>
  );
}
