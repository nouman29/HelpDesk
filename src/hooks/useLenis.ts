import { useEffect } from 'react';
import Lenis from 'lenis';

// Global handle so anything (Navbar, Footer, deep links) can drive
// smooth scrolling without prop-drilling a context.
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Inertial / smooth scrolling. Mounts a single Lenis instance globally
 * and exposes it on `window.__lenis` so callers can do
 *   window.__lenis?.scrollTo('#problem')
 * which keeps Lenis' internal scroll position in sync (native anchor
 * jumps otherwise desync it and "freeze" the wheel).
 */
export function useLenis() {
  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;

    const lenis = new Lenis({
      duration: isCoarse ? 0.9 : 1.4,
      smoothWheel: true,
      lerp: 0.085,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    window.__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Re-sync Lenis when the tab regains focus or the viewport resizes —
    // these are the conditions where the internal cache and the real
    // scroll position can drift.
    const onFocus  = () => lenis.resize();
    const onResize = () => lenis.resize();
    window.addEventListener('focus',  onFocus);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('focus',  onFocus);
      window.removeEventListener('resize', onResize);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
}

/**
 * Smoothly scroll to a section target.
 * `target` can be a CSS selector ('#problem'), 0 (top), or an element.
 */
export function lenisScrollTo(target: string | number | HTMLElement) {
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.2, offset: -80 });
  } else if (typeof target === 'string' && target.startsWith('#')) {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
}
