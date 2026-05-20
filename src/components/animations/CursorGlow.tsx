import { useEffect, useRef } from 'react';

/**
 * Soft, GPU-friendly cursor glow that follows the pointer.
 * Disabled on coarse pointers (mobile / touch).
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;
    const el = ref.current;
    if (!el) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx, y = ty;
    let raf = 0;

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });

    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.transform = `translate3d(${x - 200}px, ${y - 200}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[2] h-[400px] w-[400px] rounded-full"
      style={{
        background:
          'radial-gradient(circle at center, rgba(74,166,255,0.18), rgba(139,108,255,0.10) 30%, transparent 60%)',
        filter: 'blur(20px)',
        mixBlendMode: 'screen',
      }}
    />
  );
}
