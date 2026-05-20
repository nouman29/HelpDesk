import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import { Logo } from '@/components/ui/Logo';
import type { ChatMessage } from '@/types';
import { cn } from '@/utils/cn';

interface Props {
  message: ChatMessage;
  index: number;
}

export function MessageBubble({ message, index }: Props) {
  if (message.role === 'system') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.06 }}
        className="self-center mono text-[10px] uppercase tracking-[0.3em] text-tertiary py-3"
      >
        — {message.content} —
      </motion.div>
    );
  }

  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
      className={cn('flex w-full gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="shrink-0 mt-1">
          <div className="grid h-8 w-8 place-items-center rounded-xl glass border border-white/10">
            <Logo withText={false} />
          </div>
        </div>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-[0_8px_30px_-15px_rgba(0,0,0,0.4)]',
          isUser
            ? 'bg-gradient-to-br from-[#1f86ff] to-[#4aa6ff] text-white'
            : 'glass border border-white/10 text-secondary',
        )}
      >
        {message.thinking ? (
          <span className="inline-flex items-center gap-1.5 py-0.5">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </span>
        ) : (
          message.content
        )}
      </div>
      {isUser && (
        <div className="shrink-0 mt-1">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[#1f86ff] to-[#8b6cff] text-white">
            <FiUser size={14} />
          </div>
        </div>
      )}
    </motion.div>
  );
}
