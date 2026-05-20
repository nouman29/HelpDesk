import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowUpRight, FiPlus, FiClock } from 'react-icons/fi';
import { BareLayout } from '@/app/layouts/BareLayout';
import { Sidebar } from '@/components/chat/Sidebar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DUMMY_THREADS } from '@/data/chats';
import { dateBucket, relativeTime } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { pageTransition, fadeUp, stagger } from '@/utils/motion';
import type { ChatThread } from '@/types';

const DOMAIN_BADGE: Record<ChatThread['domain'], string> = {
  career:   'from-sky-500/30 to-blue-700/0',
  medical:  'from-emerald-500/30 to-teal-700/0',
  legal:    'from-violet-500/30 to-fuchsia-700/0',
  life:     'from-rose-500/30 to-pink-700/0',
  business: 'from-amber-400/30 to-orange-700/0',
};

export default function RecentChatsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const grouped = useMemo(() => {
    const filtered = DUMMY_THREADS.filter(
      (t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.preview.toLowerCase().includes(query.toLowerCase()) ||
        t.domain.toLowerCase().includes(query.toLowerCase()),
    );
    const map = new Map<string, ChatThread[]>();
    for (const t of filtered) {
      const key = dateBucket(t.updatedAt);
      const arr = map.get(key) ?? [];
      arr.push(t);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [query]);

  return (
    <motion.div variants={pageTransition} initial="initial" animate="enter" exit="exit">
      <BareLayout>
        <div className="grid h-screen lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <Sidebar onNewJourney={() => navigate(ROUTES.CHAT)} />
          </div>

          <div className="flex flex-col min-w-0 overflow-y-auto scroll-thin">
            {/* Header */}
            <header className="sticky top-0 z-20 glass-strong border-b border-white/5 px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full glass border border-white/10 text-[var(--brand-300)]">
                  <FiClock />
                </div>
                <div>
                  <p className="mono text-[10px] uppercase tracking-[0.25em] text-tertiary">history</p>
                  <h1 className="text-base md:text-lg font-semibold text-primary">Recent Chats</h1>
                </div>
              </div>
              <Button leftIcon={<FiPlus />} onClick={() => navigate(ROUTES.CHAT)}>
                New Decision Journey
              </Button>
            </header>

            <div className="mx-auto w-full max-w-5xl px-6 py-10 flex flex-col gap-10">
              {/* Hero / search */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
                    <span className="text-gradient">Your decision journeys.</span>
                  </h2>
                  <p className="mt-2 text-secondary max-w-2xl">
                    Every journey you've started — grouped by recency, searchable by topic, opened in one tap.
                  </p>
                </div>
                <div className="max-w-xl">
                  <Input
                    name="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search journeys, topics, domains…"
                    leftIcon={<FiSearch />}
                  />
                </div>
              </motion.section>

              {/* Groups */}
              {grouped.length === 0 ? (
                <div className="rounded-2xl glass border border-white/10 py-20 text-center text-tertiary">
                  No journeys match “{query}”.
                </div>
              ) : (
                grouped.map(([bucket, threads]) => (
                  <section key={bucket} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <h3 className="mono text-[11px] uppercase tracking-[0.28em] text-tertiary">{bucket}</h3>
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="mono text-[10px] text-tertiary">{threads.length}</span>
                    </div>

                    <motion.ul
                      variants={stagger(0.05, 0.02)}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.05 }}
                      className="grid sm:grid-cols-2 gap-3"
                    >
                      {threads.map((t) => (
                        <motion.li key={t.id} variants={fadeUp}>
                          <button
                            onClick={() => navigate(ROUTES.CHAT)}
                            className="group relative w-full text-left rounded-2xl glass border border-white/10 hover:border-white/25 p-5 overflow-hidden spotlight transition-all duration-500"
                            onMouseMove={(e) => {
                              const r = e.currentTarget.getBoundingClientRect();
                              e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
                              e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
                            }}
                          >
                            <div className={`pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-gradient-to-br ${DOMAIN_BADGE[t.domain]} blur-3xl opacity-50 group-hover:opacity-90 transition-opacity duration-500`} />
                            <div className="relative flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <span className="mono text-[10px] uppercase tracking-[0.22em] text-tertiary">
                                  {t.domain}
                                </span>
                                <h4 className="mt-1.5 font-semibold text-primary line-clamp-2">{t.title}</h4>
                                <p className="mt-2 text-sm text-secondary line-clamp-2">{t.preview}</p>
                                <p className="mt-3 text-xs text-tertiary">{relativeTime(t.updatedAt)}</p>
                              </div>
                              <FiArrowUpRight className="shrink-0 text-tertiary group-hover:text-[var(--brand-300)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </button>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </section>
                ))
              )}
            </div>
          </div>
        </div>
      </BareLayout>
    </motion.div>
  );
}
