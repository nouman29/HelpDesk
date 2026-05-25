import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { ROUTES } from '@/constants/routes';
import { PRIMARY_NAV, isRouteHref } from '@/constants/nav';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { lenisScrollTo } from '@/hooks/useLenis';
import { cn } from '@/utils/cn';
import { clearAuth, isAuthenticated } from '@/features/auth/authStorage';

interface Props { transparent?: boolean; }

export function Navbar({ transparent = true }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [, setAuthVersion] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const authed = isAuthenticated();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'hd:auth_token' || event.key == null) {
        setAuthVersion((version) => version + 1);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate(ROUTES.LOGIN);
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (isRouteHref(href)) {
      e.preventDefault();
      navigate(href);
      return;
    }
    e.preventDefault();
    if (location.pathname !== ROUTES.LANDING) {
      navigate(`${ROUTES.LANDING}${href}`);
      setTimeout(() => lenisScrollTo(href), 350);
      return;
    }
    lenisScrollTo(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className={cn(
          'fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1180px,calc(100%-2rem))]',
          'rounded-full transition-all duration-500',
          (!transparent || scrolled)
            ? 'glass-strong border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]'
            : 'glass border border-white/5',
        )}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <Link to={ROUTES.LANDING} aria-label="AI HelpDesk home" className="flex items-center shrink-0">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {PRIMARY_NAV.map((item, i) => {
              const prev = PRIMARY_NAV[i - 1];
              const needsSeparator =
                prev && !isRouteHref(prev.href) && isRouteHref(item.href);

              const linkClass =
                'link-anim px-3 py-2 text-sm text-secondary hover:text-primary transition-colors';

              const node = isRouteHref(item.href) ? (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={linkClass}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={linkClass}
                >
                  {item.label}
                </a>
              );

              return needsSeparator ? (
                <span key={`group-${item.label}`} className="flex items-center gap-1">
                  <NavSeparator />
                  {node}
                </span>
              ) : (
                node
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle className="hidden sm:inline-flex" />
            <NavSeparator className="hidden sm:inline-block" />
            {authed ? (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<FiLogOut />}
                onClick={handleLogout}
                className="hidden sm:inline-flex"
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.LOGIN)}
                className="hidden sm:inline-flex"
              >
                Sign in
              </Button>
            )}
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden h-9 w-9 grid place-items-center rounded-full glass border border-white/10"
            >
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[min(1180px,calc(100%-2rem))] rounded-2xl glass-strong border border-white/10 p-4"
          >
            <nav className="flex flex-col gap-1">
              {PRIMARY_NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => { setOpen(false); handleNavClick(e, item.href); }}
                  className="rounded-lg px-3 py-2.5 text-sm text-secondary hover:bg-white/5"
                >
                  {item.label}
                </a>
              ))}
              <div className="my-2 h-px bg-white/10" />
              {authed ? (
                <button
                  onClick={() => { setOpen(false); handleLogout(); }}
                  className="rounded-lg px-3 py-2.5 text-sm text-secondary text-left hover:bg-white/5 inline-flex items-center gap-2"
                >
                  <FiLogOut /> Logout
                </button>
              ) : (
                <button
                  onClick={() => { setOpen(false); navigate(ROUTES.LOGIN); }}
                  className="rounded-lg px-3 py-2.5 text-sm text-secondary text-left hover:bg-white/5"
                >
                  Sign in
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavSeparator({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('mx-1 h-5 w-px self-center', className)}
      style={{
        background:
          'linear-gradient(to bottom, transparent, var(--nav-separator) 50%, transparent)',
      }}
    />
  );
}
