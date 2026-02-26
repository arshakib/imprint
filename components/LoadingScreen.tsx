/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface LoaderProps {
  onComplete: () => void;
}

// ─── THREAD LINE ─────────────────────────────────────────────────────────────
function ThreadLine({ angle, delay, duration, color = "#C9A84C", opacity = 0.15 }: {
  angle: number; delay: number; duration: number; color?: string; opacity?: number;
}) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 origin-left pointer-events-none"
      style={{
        width: "60vmax",
        height: 1,
        rotate: angle,
        x: "-0%",
        y: "-50%",
        background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        opacity: 0,
      }}
      animate={{
        opacity: [0, opacity, opacity, 0],
        scaleX: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.2, 0.8, 1],
      }}
    />
  );
}

// ─── ORBIT RING ──────────────────────────────────────────────────────────────
function OrbitRing({ radius, duration, delay, color, dotCount = 8 }: {
  radius: number; duration: number; delay: number; color: string; dotCount?: number;
}) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      style={{
        width: radius * 2,
        height: radius * 2,
        x: -radius,
        y: -radius,
        borderRadius: "50%",
        border: `1px solid ${color}20`,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    >
      {Array.from({ length: dotCount }).map((_, i) => {
        const angle = (i / dotCount) * Math.PI * 2;
        const cx = radius + Math.cos(angle) * radius - 3;
        const cy = radius + Math.sin(angle) * radius - 3;
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: cx,
              top: cy,
              background: color,
              opacity: i % 3 === 0 ? 0.9 : 0.2,
              boxShadow: i % 3 === 0 ? `0 0 6px ${color}` : "none",
            }}
          />
        );
      })}
    </motion.div>
  );
}

// ─── 3D SPOOL ─────────────────────────────────────────────────────────────────
function Spool3D({ progress }: { progress: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)" }}
      />

      {/* SVG spool / thread wheel */}
      <svg viewBox="0 0 100 100" width="100" height="100" style={{ position: "absolute" }}>
        {/* Track circle */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="6" />
        {/* Progress arc */}
        <motion.circle
          cx="50" cy="50" r="38"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 38}`}
          strokeDashoffset={`${2 * Math.PI * 38 * (1 - progress / 100)}`}
          transform="rotate(-90 50 50)"
          style={{ filter: "drop-shadow(0 0 6px rgba(201,168,76,0.8))" }}
        />
        {/* Inner spokes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * 360;
          const rad = (a * Math.PI) / 180;
          const x1 = 50 + 20 * Math.cos(rad);
          const y1 = 50 + 20 * Math.sin(rad);
          const x2 = 50 + 30 * Math.cos(rad);
          const y2 = 50 + 30 * Math.sin(rad);
          return (
            <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(201,168,76,0.35)" strokeWidth="1"
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}
        {/* Center pin */}
        <circle cx="50" cy="50" r="10" fill="rgba(12,16,26,1)" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="4" fill="rgba(201,168,76,0.9)"
          style={{ filter: "drop-shadow(0 0 4px rgba(201,168,76,1))" }} />
        {/* Gradient def */}
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A84C" />
            <stop offset="50%" stopColor="#FFE082" />
            <stop offset="100%" stopColor="#C9A84C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ─── CURTAIN EXIT ─────────────────────────────────────────────────────────────
// Two panels that split open like a fashion runway curtain
function CurtainExit({ isExiting }: { isExiting: boolean }) {
  return (
    <AnimatePresence>
      {isExiting && (
        <>
          {/* Left panel */}
          <motion.div
            className="fixed inset-y-0 left-0 z-[10001]"
            style={{ width: "50%", background: "#080B12", originX: 0 }}
            initial={{ x: 0 }} animate={{ x: "-100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Right panel */}
          <motion.div
            className="fixed inset-y-0 right-0 z-[10001]"
            style={{ width: "50%", background: "#080B12", originX: 1 }}
            initial={{ x: 0 }} animate={{ x: "100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Gold seam line */}
          <motion.div
            className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 z-[10002] w-0.5"
            style={{ background: "linear-gradient(to bottom, transparent, #C9A84C, #FFE082, #C9A84C, transparent)" }}
            initial={{ scaleY: 1, opacity: 1 }}
            animate={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeIn" }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
export default function LoadingScreen({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "complete" | "exiting">("loading");
  const [displayNum, setDisplayNum] = useState(0);
  // Safe viewport width — default 1024, updated client-side only (avoids SSR window error)
  const [vw, setVw] = useState(1024);
  useEffect(() => {
    setVw(window.innerWidth);
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Smooth displayed number
  const motionProgress = useMotionValue(0);
  const springProgress = useSpring(motionProgress, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const unsub = springProgress.on("change", (v) => setDisplayNum(Math.round(v)));
    return unsub;
  }, [springProgress]);

  // Progress timeline: fast → slow → burst to 100
  useEffect(() => {
    const checkpoints = [
      { target: 30, duration: 600 },
      { target: 60, duration: 700 },
      { target: 80, duration: 800 },
      { target: 92, duration: 600 },
      { target: 100, duration: 400 },
    ];

    let current = 0;
    let totalElapsed = 0;

    const run = async () => {
      for (const cp of checkpoints) {
        await new Promise<void>((resolve) => {
          const startVal = current;
          const endVal = cp.target;
          const startTime = Date.now();

          const tick = () => {
            const elapsed = Date.now() - startTime;
            const t = Math.min(elapsed / cp.duration, 1);
            // easeInOutCubic
            const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            const val = Math.round(startVal + (endVal - startVal) * eased);
            current = val;
            setProgress(val);
            motionProgress.set(val);

            if (t < 1) requestAnimationFrame(tick);
            else resolve();
          };
          requestAnimationFrame(tick);
        });
        totalElapsed += cp.duration;
      }

      // Hold at 100% briefly then exit
      await new Promise<void>((r) => setTimeout(r, 600));
      setPhase("complete");
      await new Promise<void>((r) => setTimeout(r, 800));
      setPhase("exiting");
      await new Promise<void>((r) => setTimeout(r, 1000));
      onComplete();
    };

    run();
  }, []);

  const threads = [
    { angle: 0, delay: 0, duration: 3.5 },
    { angle: 30, delay: 0.4, duration: 4 },
    { angle: 60, delay: 0.8, duration: 3.2 },
    { angle: 90, delay: 0.2, duration: 4.5 },
    { angle: 120, delay: 0.6, duration: 3.8 },
    { angle: 150, delay: 1.0, duration: 3.3 },
    { angle: 45, delay: 0.3, duration: 4.2 },
    { angle: 135, delay: 0.9, duration: 3.6 },
    { angle: 15, delay: 1.2, duration: 4.0, color: "#FFE082", opacity: 0.08 },
    { angle: 75, delay: 0.7, duration: 3.9, color: "#FFE082", opacity: 0.08 },
  ];

  return (
    <>
      <AnimatePresence>
        {phase !== "exiting" && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: "#080B12" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* ── Background atmosphere ── */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Radial glow center */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ width: "60vmax", height: "60vmax" }}
                animate={{ scale: [0.8, 1.05, 0.8], opacity: [0.04, 0.10, 0.04] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,1), transparent 60%)" }} />
              </motion.div>

              {/* Grid */}
              <div className="absolute inset-0 opacity-[0.025]"
                style={{ backgroundImage: "linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

              {/* Thread lines */}
              {threads.map((t, i) => <ThreadLine key={i} {...t} />)}

              {/* Corner decorations */}
              {[
                "top-0 left-0",
                "top-0 right-0 rotate-90",
                "bottom-0 right-0 rotate-180",
                "bottom-0 left-0 -rotate-90",
              ].map((pos, i) => (
                <motion.div key={i}
                  className={`absolute w-16 sm:w-24 h-16 sm:h-24 pointer-events-none ${pos}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}>
                  <svg viewBox="0 0 96 96" className="w-full h-full opacity-30">
                    <path d="M0 96 L0 0 L96 0" fill="none" stroke="#C9A84C" strokeWidth="1" />
                    <path d="M0 80 L0 16 L16 0" fill="none" stroke="#C9A84C" strokeWidth="0.5" strokeDasharray="4 4" />
                    <circle cx="0" cy="0" r="4" fill="#C9A84C" opacity="0.8" />
                  </svg>
                </motion.div>
              ))}
            </div>

            {/* ── Orbit rings ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <OrbitRing radius={Math.min(180, vw * 0.28)} duration={12} delay={0} color="#C9A84C" dotCount={12} />
              <OrbitRing radius={Math.min(240, vw * 0.36)} duration={20} delay={2} color="#C9A84C" dotCount={18} />
              <OrbitRing radius={Math.min(130, vw * 0.20)} duration={8} delay={1} color="#FFE082" dotCount={8} />
            </div>

            {/* ── Main content ── */}
            <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 px-6 text-center">

              {/* Spool + progress number */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="relative"
              >
                {/* Spinning spool */}
                <motion.div animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                  <Spool3D progress={progress} />
                </motion.div>

                {/* Center counter */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.span
                    className="font-black tabular-nums select-none"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "clamp(0.85rem, 3vw, 1.1rem)",
                      background: "linear-gradient(135deg, #C9A84C, #FFE082, #C9A84C)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {displayNum}%
                  </motion.span>
                </div>
              </motion.div>

              {/* Logo reveal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-2"
              >
                {/* Logo mark */}
                <div className="flex items-center gap-3 mb-1">
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-slate-900 text-xl sm:text-2xl shadow-2xl"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #FFE082, #C9A84C)" }}
                    animate={{ boxShadow: ["0 0 20px rgba(201,168,76,0.4)", "0 0 40px rgba(201,168,76,0.8)", "0 0 20px rgba(201,168,76,0.4)"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ID
                  </motion.div>
                </div>

                {/* Brand name — letter by letter */}
                <div className="flex items-center gap-px sm:gap-0.5 overflow-hidden">
                  {"IMPRINT".split("").map((char, i) => (
                    <motion.span key={i}
                      initial={{ opacity: 0, y: 16, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ delay: 0.8 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="font-black text-white"
                      style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.4rem, 5vw, 2.2rem)", letterSpacing: "0.18em" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>

                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 1.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2 sm:gap-3 mt-1"
                >
                  <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to right, transparent, #C9A84C)" }} />
                  <span className="text-amber-400/70 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] whitespace-nowrap"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Trimming & Accessories
                  </span>
                  <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to left, transparent, #C9A84C)" }} />
                </motion.div>
              </motion.div>

              {/* Progress bar */}
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="w-full max-w-[240px] sm:max-w-[300px]"
              >
                {/* Bar track */}
                <div className="relative h-0.5 sm:h-[3px] rounded-full overflow-hidden"
                  style={{ background: "rgba(201,168,76,0.12)" }}>
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(to right, #C9A84C, #FFE082, #C9A84C)",
                      boxShadow: "0 0 8px rgba(201,168,76,0.8), 0 0 16px rgba(201,168,76,0.4)",
                    }}
                    transition={{ duration: 0.1 }}
                  />
                  {/* Shimmer sweep */}
                  <motion.div
                    className="absolute inset-y-0 w-12 rounded-full"
                    style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)" }}
                    animate={{ x: ["-48px", "300px"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                  />
                </div>

                {/* Status text */}
                <motion.div
                  className="flex justify-between items-center mt-2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <LoadingStatusText progress={progress} />
                  <span className="text-amber-400/40 text-[9px]"
                    style={{ fontFamily: "'Space Mono', monospace" }}>
                    BD • 2024
                  </span>
                </motion.div>
              </motion.div>

              {/* Complete checkmark */}
              <AnimatePresence>
                {phase === "complete" && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute"
                    style={{ bottom: "calc(50% - 200px)" }}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-slate-900 text-xl font-black"
                      style={{ background: "linear-gradient(135deg, #C9A84C, #FFE082)", boxShadow: "0 0 30px rgba(201,168,76,0.8)" }}>
                      ✓
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Bottom tagline ── */}
            <motion.p
              className="absolute bottom-6 sm:bottom-8 text-slate-600 text-[9px] sm:text-[10px] uppercase tracking-[0.3em]"
              style={{ fontFamily: "'Space Mono', monospace" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              Reliable Garments Trims Partner
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Curtain exit animation */}
      <CurtainExit isExiting={phase === "exiting"} />
    </>
  );
}

// ─── STATUS TEXT ──────────────────────────────────────────────────────────────
function LoadingStatusText({ progress }: { progress: number }) {
  const steps = [
    { at: 0, text: "Initializing..." },
    { at: 25, text: "Loading assets..." },
    { at: 50, text: "Weaving threads..." },
    { at: 75, text: "Crafting labels..." },
    { at: 92, text: "Almost ready..." },
    { at: 100, text: "Welcome!" },
  ];

  const current = steps.reduce((acc, s) => (progress >= s.at ? s : acc), steps[0]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={current.text}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25 }}
        className="text-amber-400/50 text-[9px] sm:text-[10px] uppercase tracking-widest"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        {current.text}
      </motion.span>
    </AnimatePresence>
  );
}