import { motion } from 'framer-motion';
import { FiMenu, FiDownload } from 'react-icons/fi';
import { ThemeToggle } from '@/features/theme/ThemeToggle';

interface Props {
  title: string;
  step: number;
  totalSteps: number;
  onToggleSidebar: () => void;
  chatId: number | null;
  isDownloading: boolean;
  onDownloadReport: () => void;
}

export function ChatHeader({
  title,
  step,
  totalSteps,
  onToggleSidebar,
  chatId,
  isDownloading,
  onDownloadReport,
}: Props) {
  const canDownload = chatId !== null && !isDownloading;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-white/5 glass-strong"
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="lg:hidden grid h-9 w-9 place-items-center rounded-full glass border border-white/10"
        >
          <FiMenu />
        </button>
        <div className="min-w-0">
          <p className="mono text-[10px] uppercase tracking-[0.25em] text-tertiary">AI HelpDesk</p>
          <h1 className="text-sm md:text-base font-semibold text-primary line-clamp-1">{title}</h1>
          <p className="mono mt-0.5 text-[10px] uppercase tracking-[0.2em] text-tertiary">
            Step {String(step).padStart(2, '0')} of {String(totalSteps).padStart(2, '0')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onDownloadReport}
          disabled={!canDownload}
          aria-label={isDownloading ? 'Generating PDF…' : 'Download report'}
          title={chatId === null ? 'Start a chat to download a report' : 'Download report as PDF'}
          className={[
            'flex items-center gap-1.5 h-9 rounded-full border px-3 text-[11px] font-medium transition-all duration-200',
            canDownload
              ? 'glass border-white/10 text-secondary hover:text-primary hover:border-white/20 hover:bg-white/5 cursor-pointer'
              : 'border-white/5 text-tertiary/40 cursor-not-allowed opacity-50',
          ].join(' ')}
        >
          <FiDownload className={isDownloading ? 'animate-pulse' : ''} size={14} />
          <span className="hidden sm:inline">
            {isDownloading ? 'Generating…' : ' Download Report'}
          </span>
        </button>

        <ThemeToggle />
      </div>
    </motion.header>
  );
}
