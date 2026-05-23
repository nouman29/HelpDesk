import { useEffect, useRef } from "react";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    const el = ref.current;
    if (!el) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let raf = 0;
    let hasMoved = false;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        el.style.opacity = "1";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;

      el.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;

      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[1] h-[600px] w-[600px] rounded-full opacity-0 transition-opacity duration-300"
      style={{
        background:
          "radial-gradient(circle at center, rgba(74,166,255,0.12), rgba(139,108,255,0.06) 28%, transparent 55%)",
        filter: "blur(28px)",
        willChange: "transform, opacity",
      }}
    />
  );
}