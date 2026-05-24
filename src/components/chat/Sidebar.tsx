import { useCallback, useEffect, useId, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlus, FiClock, FiLogOut,
} from 'react-icons/fi';
import { Logo } from '@/components/ui/Logo';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';
import {
  clearAuth,
  getActiveChatId,
  getToken,
  saveActiveChatId,
} from '@/features/auth/authStorage';
import { getMyChats, type MyChat } from '@/services/healthService';
import { subscribeChatListRefresh } from '@/features/chat/chatListRefresh';

interface Props {
  activeId?: number;
  onNewJourney: () => void;
  className?: string;
}

const RECENT_LIMIT = 6;

interface CircularProgressProps {
  value: number; // 0–100
  active?: boolean;
}

/**
 * Small circular progress ring with the percentage centered inside.
 * Uses theme tokens + the existing brand gradient so it stays consistent
 * across dark and light themes.
 */
function CircularProgress({ value, active = false }: CircularProgressProps) {
  const size = 34;
  const stroke = 3;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);
  const gradientId = useId().replace(/:/g, '');

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 overflow-visible"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f86ff" />
            <stop offset="100%" stopColor="#8b6cff" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>
      <span
        className={cn(
          'absolute inset-0 grid place-items-center mono text-[9px] font-medium tabular-nums',
          active ? 'text-primary' : 'text-secondary',
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function Sidebar({ activeId, onNewJourney, className }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [chats, setChats] = useState<MyChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Highlight the chat that's currently active (either passed explicitly via
  // prop, or read from the same localStorage key the ChatPage uses).
  const highlightedId = activeId ?? getActiveChatId();

  const fetchChats = useCallback(async (silent = false) => {
    const token = getToken();
    if (!token) {
      setError('Not signed in');
      setLoading(false);
      return;
    }
    if (!silent) setLoading(true);
    try {
      const data = await getMyChats(token);
      setChats(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not load chats.';
      setError(msg);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchChats();
    return subscribeChatListRefresh(() => {
      void fetchChats(true);
    });
  }, [fetchChats]);

  const openChat = (chatId: number) => {
    saveActiveChatId(chatId);
    if (location.pathname === ROUTES.CHAT) {
      // Already on the chat route — force a re-bootstrap so ChatPage's
      // /get-chat restore flow picks up the newly-active chat. The
      // existing ChatPage effect runs only on mount; navigate() alone
      // wouldn't remount it.
      window.location.reload();
    } else {
      navigate(ROUTES.CHAT);
    }
  };

  const recent = chats.slice(0, RECENT_LIMIT);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex flex-col h-full p-4 gap-4 border-r border-white/5 glass',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(ROUTES.LANDING)} className="flex items-center" aria-label="Home">
          <Logo />
        </button>
      </div>

      <button
        onClick={onNewJourney}
        className="group relative inline-flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white bg-linear-to-br from-[#1f86ff] to-[#8b6cff] shadow-[0_10px_30px_-10px_rgba(31,134,255,0.6)] btn-glow"
      >
        <span className="inline-flex items-center gap-2">
          <FiPlus /> New Decision Journey
        </span>
      </button>

      <button
        onClick={() => navigate(ROUTES.RECENT_CHATS)}
        className="inline-flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm text-secondary hover:text-primary glass border border-white/5 hover:border-white/15 transition-colors"
      >
        <span className="inline-flex items-center gap-2">
          <FiClock /> Recent Chats
        </span>
      </button>

      {/* Theme-aware divider — uses the soft border token so it auto-flips
          between dark and light themes (rgba(255,255,255,0.08) in dark,
          rgba(10,20,40,0.08) in light). */}
      <hr className="border-0 h-px bg-(--border-soft) my-1" />

      <div className="flex items-center justify-between mt-2 px-1">
        <span className="mono text-[10px] uppercase tracking-[0.25em] text-tertiary">Recent</span>
        <span className="mono text-[10px] text-tertiary">
          {loading ? '…' : recent.length}
        </span>
      </div>

      <nav
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-thin flex flex-col gap-1 pr-1"
        data-lenis-prevent
      >
        {loading ? (
          <div className="px-3 py-4 text-xs text-tertiary inline-flex items-center gap-1.5">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="ml-2">Loading chats…</span>
          </div>
        ) : error ? (
          <div className="px-3 py-3 text-xs text-rose-300/90">{error}</div>
        ) : recent.length === 0 ? (
          <div className="px-3 py-4 text-xs text-tertiary">No recent chats yet</div>
        ) : (
          recent.map((c) => {
            const pct = Math.max(0, Math.min(100, Math.round(c.completion_percentage)));
            const isActive = highlightedId === c.chat_id;
            return (
              <button
                key={c.chat_id}
                onClick={() => openChat(c.chat_id)}
                className={cn(
                  'group text-left rounded-lg px-3 py-2.5 transition-all border border-transparent',
                  'flex items-center gap-3',
                  isActive
                    ? 'bg-white/10 border-white/15'
                    : 'hover:bg-white/5 hover:border-white/10',
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-primary line-clamp-1">
                    {c.chat_name}
                  </p>
                  <p className="mono text-[10px] uppercase tracking-[0.18em] text-tertiary mt-0.5">
                    {c.total_answered_questions}/{c.total_questions} answered
                  </p>
                </div>
                <CircularProgress value={pct} active={isActive} />
              </button>
            );
          })
        )}
      </nav>

      <div className="border-t border-(--border-soft) pt-3 flex flex-col gap-1">
        <SidebarItem
          icon={<FiLogOut />}
          label="Logout"
          onClick={() => {
            clearAuth();
            navigate(ROUTES.LOGIN);
          }}
        />
      </div>
    </motion.aside>
  );
}

function SidebarItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-white/5 transition-colors"
    >
      <span className="text-tertiary">{icon}</span>
      {label}
    </button>
  );
}
