import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { HeroBackground } from "@/components/three/HeroBackground";
import { AuroraBlob } from "@/components/animations/AuroraBlob";
import { ROUTES } from "@/constants/routes";
import { slideFromLeft, blurFromLeft, stagger } from "@/utils/motion";
import { isAuthenticated } from "@/features/auth/authStorage";

export function HeroSection() {
  const navigate = useNavigate();
  const [bgReady, setBgReady] = useState(false);

  useEffect(() => {
    const hasRIC =
      typeof window !== "undefined" && "requestIdleCallback" in window;
    let id: number;
    if (hasRIC) {
      id = window.requestIdleCallback(() => setBgReady(true), {
        timeout: 2000,
      });
    } else {
      id = window.setTimeout(() => setBgReady(true), 200);
    }
    return () => {
      if (hasRIC) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  return (
    <section data-theme="dark" className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-36 isolate">
      
      {bgReady && (
        <HeroBackground className="absolute inset-0 -z-30 pointer-events-none" />
      )}

      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        <div
          className="
      absolute left-1/2 top-1/2
      aspect-video
      w-[clamp(900px,135vw,2200px)]
      -translate-x-1/2 -translate-y-1/2

      sm:w-[clamp(1000px,120vw,2200px)]
      md:w-[clamp(1100px,110vw,2200px)]
      lg:w-[clamp(1200px,100vw,2300px)]
      2xl:w-[min(95vw,2400px)]
    "
          style={{
            maskImage:
              "radial-gradient(ellipse 72% 62% at 50% 50%, black 0%, black 38%, rgba(0,0,0,0.85) 48%, rgba(0,0,0,0.35) 60%, transparent 74%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 72% 62% at 50% 50%, black 0%, black 38%, rgba(0,0,0,0.85) 48%, rgba(0,0,0,0.35) 60%, transparent 74%)",
          }}
        >
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            playsInline
          >
            <source src="/hero/helpdesk.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <AuroraBlob
        className="-left-45 top-[8%] opacity-50 -z-10 pointer-events-none"
        color="#1f86ff"
        size={520}
      />
      <AuroraBlob
        className="right-50 top-[40%] opacity-40 -z-10 pointer-events-none"
        color="#8b6cff"
        size={580}
      />
      <AuroraBlob
        className="left-1/2 -bottom-55 -translate-x-1/2 opacity-30 -z-10 pointer-events-none"
        color="#3ee8ff"
        size={680}
      />

      <div className="mx-auto w-full max-w-7xl px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        <motion.div
          variants={stagger(0.1, 0.2)}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-7"
        >
          <motion.h1
            variants={blurFromLeft}
            className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tight"
          >
            <span className="block text-gradient text-glow">Guided AI</span>
            <span className="block text-gradient text-glow">Decision</span>
            <span className="block text-gradient text-glow">Journeys.</span>
          </motion.h1>

          <motion.p
            variants={slideFromLeft}
            className="max-w-xl text-lg md:text-xl text-secondary leading-relaxed"
          >
            Stop drowning in endless AI conversations. Help Desk guides you
            through a visual decision journey and delivers one clear, actionable
            outcome.{" "}
          </motion.p>

          <motion.div
            variants={slideFromLeft}
            className="flex flex-wrap items-center gap-3"
          >
            <MagneticButton strength={0.2}>
              <Button
                size="lg"
                rightIcon={<FiArrowRight />}
                onClick={() =>
                  navigate(isAuthenticated() ? ROUTES.CHAT : ROUTES.LOGIN)
                }
              >
                Start AI Conversation
              </Button>
            </MagneticButton>
          </motion.div>
        </motion.div>

        <div className="relative aspect-square w-full max-w-160 mx-auto">
          <HeroAssistantCard />
        </div>
      </div>
    </section>
  );
}

function HeroAssistantCard() {
  return (
    <div className="absolute bottom-16 -right-5 md:-right-12.5 lg:-right-22.5 w-72.5 md:w-85 rounded-2xl glass-strong border border-white/10 p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] scale-[0.72] origin-bottom-right sm:scale-[0.85] md:scale-100">  
      <div className="flex items-center gap-2 mb-3">
        <div className="relative h-2.5 w-2.5">
          <span className="absolute inset-0 rounded-full bg-emerald-400" />
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
        </div>

        <span className="mono text-[10px] uppercase tracking-[0.25em] text-white">
          AI Assistant
        </span>
      </div>

      <p className="text-[13px] leading-relaxed text-secondary">
        “Based on your answers, I’m narrowing the picture. Your symptoms point
        to <span className="text-primary">3 likely conclusions</span> — a few
        more questions and I’ll rank them by probability and accuracy.”
      </p>
    </div>
  );
}
