import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlus, FiClock, FiCompass, FiSettings, FiHelpCircle, FiUser, FiLogOut,
} from 'react-icons/fi';
import { Logo } from '@/components/ui/Logo';
import { ROUTES } from '@/constants/routes';
import { DUMMY_THREADS } from '@/data/chats';
import { relativeTime } from '@/utils/format';
import { cn } from '@/utils/cn';
import { clearAuth } from '@/features/auth/authStorage';

interface Props {
  activeId?: string;
  onNewJourney: () => void;
  className?: string;
}

export function Sidebar({ activeId, onNewJourney, className }: Props) {
  const navigate = useNavigate();
  const recent = DUMMY_THREADS.slice(0, 6);

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
        className="group relative inline-flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white bg-gradient-to-br from-[#1f86ff] to-[#8b6cff] shadow-[0_10px_30px_-10px_rgba(31,134,255,0.6)] btn-glow"
      >
        <span className="inline-flex items-center gap-2">
          <FiPlus /> New Decision Journey
        </span>
        <span className="mono text-[10px] uppercase tracking-[0.2em] opacity-80">⌘N</span>
      </button>

      <button
        onClick={() => navigate(ROUTES.RECENT_CHATS)}
        className="inline-flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm text-secondary hover:text-primary glass border border-white/5 hover:border-white/15 transition-colors"
      >
        <span className="inline-flex items-center gap-2">
          <FiClock /> Recent Chats
        </span>
        <span className="mono text-[10px] uppercase text-tertiary">all</span>
      </button>

      <div className="flex items-center justify-between mt-2 px-1">
        <span className="mono text-[10px] uppercase tracking-[0.25em] text-tertiary">Recent</span>
        <span className="mono text-[10px] text-tertiary">{recent.length}</span>
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto scroll-thin flex flex-col gap-1 pr-1">
        {recent.map((t) => (
          <button
            key={t.id}
            onClick={() => navigate(ROUTES.CHAT)}
            className={cn(
              'group text-left rounded-lg px-3 py-2.5 transition-all border border-transparent',
              activeId === t.id
                ? 'bg-white/10 border-white/15'
                : 'hover:bg-white/5 hover:border-white/10',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-primary line-clamp-1">{t.title}</span>
              <span className="mono text-[10px] text-tertiary">{relativeTime(t.updatedAt)}</span>
            </div>
            <p className="text-xs text-tertiary line-clamp-1 mt-0.5">{t.preview}</p>
          </button>
        ))}
      </nav>

      <div className="border-t border-white/5 pt-3 flex flex-col gap-1">
        <SidebarItem icon={<FiCompass />} label="Explore Domains" />
        <SidebarItem icon={<FiSettings />} label="Settings" />
        <SidebarItem icon={<FiHelpCircle />} label="Help & Feedback" />
        <SidebarItem
          icon={<FiLogOut />}
          label="Logout"
          onClick={() => {
            clearAuth();
            navigate(ROUTES.LOGIN);
          }}
        />

        <button className="mt-2 flex items-center gap-3 rounded-xl glass border border-white/10 px-3 py-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#1f86ff] to-[#8b6cff] text-white">
            <FiUser size={14} />
          </div>
          <div className="text-left">
            <p className="text-[13px] font-medium text-primary">Person</p>
          </div>
        </button>
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
