import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowUpRight, FiClock, FiPlus, FiMenu } from 'react-icons/fi';
import { BareLayout } from '@/app/layouts/BareLayout';
import { Sidebar } from '@/components/chat/Sidebar';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';
import { pageTransition, fadeUp, stagger } from '@/utils/motion';
import { getMyChats, type MyChat } from '@/services/healthService';
import { getToken, saveActiveChatId } from '@/features/auth/authStorage';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function RecentChatsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [chats, setChats] = useState<MyChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLgUp = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    if (isLgUp) setSidebarOpen(false);
  }, [isLgUp]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const token = getToken();
      if (!token) {
        if (!cancelled) {
          setError('You are not logged in.');
          setLoading(false);
        }
        return;
      }
      try {
        const data = await getMyChats(token);
        if (cancelled) return;
        setChats(Array.isArray(data) ? data : []);
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'Could not load your chats.';
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((c) =>
      (c.chat_name ?? '').toLowerCase().includes(q),
    );
  }, [chats, query]);

  const hasActiveQuery = query.trim().length > 0;

  const openChat = (chatId: number) => {
    saveActiveChatId(chatId);
    navigate(ROUTES.CHAT);
  };

  return (
    <motion.div variants={pageTransition} initial="initial" animate="enter" exit="exit">
      <BareLayout>
        <div className="grid h-screen overflow-hidden lg:grid-cols-[280px_1fr]">
          {isLgUp && (
            <div className="min-h-0 h-screen" data-lenis-prevent>
              <Sidebar onNewJourney={() => navigate(ROUTES.CHAT)} />
            </div>
          )}

          {/* Mobile sidebar drawer */}
          <AnimatePresence>
            {!isLgUp && sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                  className="lg:hidden fixed inset-y-0 left-0 z-50 w-72"
                  data-lenis-prevent
                >
                  <Sidebar
                    onNewJourney={() => {
                      navigate(ROUTES.CHAT);
                      setSidebarOpen(false);
                    }}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div
            className="flex flex-col min-w-0 min-h-0 h-screen overflow-y-auto overscroll-contain scroll-thin"
            data-lenis-prevent
          >
            {/* Header */}
            <header className="sticky top-0 z-20 glass-strong border-b border-white/5 px-4 md:px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open menu"
                  className="lg:hidden shrink-0 grid h-9 w-9 place-items-center rounded-full glass border border-white/10"
                >
                  <FiMenu />
                </button>
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full glass border border-white/10 text-[var(--brand-300)]">
                  <FiClock />
                </div>
                <div>
                  <p className="mono text-[10px] uppercase tracking-[0.25em] text-tertiary">history</p>
                  <h1 className="text-base md:text-lg font-semibold text-primary">Recent Chats</h1>
                </div>
              </div>
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
                    Every journey you've started — searchable by topic, opened in one tap.
                  </p>
                </div>
                <div className="max-w-xl">
                  <Input
                    name="search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your chats by title…"
                    leftIcon={<FiSearch />}
                    autoComplete="off"
                  />
                  {hasActiveQuery && !loading && !error && (
                    <p className="mt-2 mono text-[10px] uppercase tracking-[0.22em] text-tertiary">
                      {filtered.length} of {chats.length} match “{query.trim()}”
                    </p>
                  )}
                </div>
              </motion.section>

              {/* States */}
              {loading ? (
                <div className="rounded-2xl glass border border-white/10 py-20 text-center text-tertiary">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </span>
                  <p className="mt-3 mono text-[10px] uppercase tracking-[0.3em]">loading your chats</p>
                </div>
              ) : error ? (
                <div className="rounded-2xl glass border border-rose-400/30 py-12 px-6 text-center text-rose-300">
                  <p className="text-sm">Couldn't load your chats.</p>
                  <p className="mt-1 text-xs text-tertiary">{error}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-2xl glass border border-white/10 py-16 px-6 text-center">
                  {chats.length === 0 ? (
                    <div className="flex flex-col items-center gap-5">
                      <p className="text-base text-secondary">
                        You don’t have any decision journeys yet.
                      </p>
                      <p className="text-sm text-tertiary max-w-md">
                        Start your first guided journey — we’ll ask a few
                        questions and walk you through to a clear conclusion.
                      </p>
                      <button
                        onClick={() => navigate(ROUTES.CHAT)}
                        className="group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white bg-gradient-to-br from-[#1f86ff] to-[#8b6cff] shadow-[0_10px_30px_-10px_rgba(31,134,255,0.6)] btn-glow"
                      >
                        <FiPlus />
                        <span>Start the chat</span>
                      </button>
                    </div>
                  ) : (
                    <p className="text-tertiary">No chats match “{query}”.</p>
                  )}
                </div>
              ) : (
                <section className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <h3 className="mono text-[11px] uppercase tracking-[0.28em] text-tertiary">
                      your chats
                    </h3>
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="mono text-[10px] text-tertiary">{filtered.length}</span>
                  </div>

                  <motion.ul
                    variants={stagger(0.05, 0.02)}
                    initial="hidden"
                    animate="show"
                    className="grid sm:grid-cols-2 gap-3"
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      {filtered.map((c) => {
                        const pct = Math.max(0, Math.min(100, Math.round(c.completion_percentage)));
                        return (
                          <motion.li
                            key={c.chat_id}
                            variants={fadeUp}
                            layout
                            exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                          >
                            <button
                              onClick={() => openChat(c.chat_id)}
                              className="group relative w-full text-left rounded-2xl glass border border-white/10 hover:border-white/25 p-5 overflow-hidden spotlight transition-all duration-500"
                              onMouseMove={(e) => {
                                const r = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
                                e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
                              }}
                            >
                              <div className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-sky-500/30 to-blue-700/0 blur-3xl opacity-50 group-hover:opacity-90 transition-opacity duration-500" />
                              <div className="relative flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-semibold text-primary line-clamp-2">
                                    {c.chat_name}
                                  </h4>
                                  <p className="mt-2 text-sm text-secondary">
                                    {c.total_answered_questions} of {c.total_questions} questions answered
                                  </p>

                                  {/* Progress bar */}
                                  <div className="mt-3 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-[#1f86ff] to-[#8b6cff] transition-all duration-500"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <p className="mt-2 mono text-[10px] uppercase tracking-[0.22em] text-tertiary">
                                    {pct}% complete
                                  </p>
                                </div>
                                <FiArrowUpRight className="shrink-0 text-tertiary group-hover:text-[var(--brand-300)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </button>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </motion.ul>
                </section>
              )}
            </div>
          </div>
        </div>
      </BareLayout>
    </motion.div>
  );
}
