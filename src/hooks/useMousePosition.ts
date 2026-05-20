import { useEffect, useState } from 'react';

export interface MousePoint { x: number; y: number; }

/**
 * Window-scoped mouse position with a normalized `nx`,`ny` in [-1, 1].
 * Used by the hero 3D scene and ambient effects.
 */
export function useMousePosition() {
  const [pos, setPos] = useState<MousePoint & { nx: number; ny: number }>({
    x: 0, y: 0, nx: 0, ny: 0,
  });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      setPos({ x: e.clientX, y: e.clientY, nx, ny });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return pos;
}
