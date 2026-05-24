import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { ROUTES } from '@/constants/routes';
import { AuthBackground } from './AuthBackground';

interface Props {
  side: 'left' | 'right';
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ side, title, subtitle, children }: Props) {
  return (
    <div className="relative min-h-screen flex">
      <AuthBackground />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 py-6">
        <Link to={ROUTES.LANDING}>
          <Logo />
        </Link>
        <ThemeToggle />
      </header>

      {/* Layout */}
      <div className={`relative z-10 grid w-full lg:grid-cols-2 ${side === 'right' ? '' : ''}`}>
        {/* Form side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className={`flex items-center justify-center px-6 py-24 md:py-28 ${side === 'right' ? 'lg:order-2' : ''}`}
        >
          <div className="w-full max-w-md">
            <p className="mono text-[10px] uppercase tracking-[0.3em] text-(--brand-300)">
              {side === 'left' ? 'Sign up — 01' : 'Sign in — 02'}
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
              <span className="text-gradient">{title}</span>
            </h1>
            <p className="mt-3 text-secondary">{subtitle}</p>
            <div className="mt-10">{children}</div>
          </div>
        </motion.div>

        {/* Visual side */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className={`hidden lg:flex relative items-center justify-center p-12 ${side === 'right' ? 'lg:order-1' : ''}`}
        >
          <AuthVisual side={side} />
        </motion.div>
      </div>
    </div>
  );
}

function AuthVisual({ side }: { side: 'left' | 'right' }) {
  return (
    <div className="relative w-full max-w-lg aspect-square">
      <div className="absolute inset-0 rounded-[40px] overflow-hidden glass-strong border border-white/10">
        <img
          src={`https://picsum.photos/seed/${side === 'left' ? 'auth-signup' : 'auth-login'}/900/900`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-tr from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-br from-[#1f86ff]/30 via-transparent to-[#8b6cff]/30 mix-blend-overlay" />

        {/* HUD lines */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full mix-blend-screen opacity-60">
          <defs>
            <linearGradient id="hud" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4aa6ff" />
              <stop offset="100%" stopColor="#8b6cff" />
            </linearGradient>
          </defs>
          <circle cx="200" cy="200" r="140" stroke="url(#hud)" strokeWidth="1" fill="none" strokeDasharray="2 6" />
          <circle cx="200" cy="200" r="100" stroke="url(#hud)" strokeWidth="1" fill="none" strokeDasharray="2 6" />
          <circle cx="200" cy="200" r="60"  stroke="url(#hud)" strokeWidth="1" fill="none" strokeDasharray="2 6" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="url(#hud)" strokeWidth="1" />
          <line x1="200" y1="0" x2="200" y2="400" stroke="url(#hud)" strokeWidth="1" />
        </svg>

        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="mono text-[10px] uppercase tracking-[0.25em] text-white/60">
            session · {side === 'left' ? 'new' : 'returning'}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white max-w-[22ch]">
            {side === 'left'
              ? 'A decision interface designed for the moments that count.'
              : 'Welcome back. Your journeys are exactly where you left them.'}
          </h3>
        </div>
      </div>
    </div>
  );
}
