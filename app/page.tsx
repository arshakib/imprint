/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/refs */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/purity */
"use client";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

// ─── SMOOTH SCROLL ────────────────────────────────────────────────────────────
function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({ top, behavior: "smooth" });
}

// ─── CUSTOM CURSOR (desktop only) ────────────────────────────────────────────
function CustomCursor() {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const trailX = useMotionValue(-200);
  const trailY = useMotionValue(-200);
  const dotX = useSpring(mx, { stiffness: 600, damping: 30 });
  const dotY = useSpring(my, { stiffness: 600, damping: 30 });
  const ringX = useSpring(trailX, { stiffness: 90, damping: 18 });
  const ringY = useSpring(trailY, { stiffness: 90, damping: 18 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Don't show on touch/mobile
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX); my.set(e.clientY);
      trailX.set(e.clientX); trailY.set(e.clientY);
      setVisible(true);
      const t = e.target as HTMLElement;
      setHovering(!!(t.closest("a") || t.closest("button") || t.closest("[data-ch]")));
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  if (isTouchDevice || !visible) return null;
  return (
    <>
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-amber-400"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%", opacity: 0.55,
          width: hovering ? 52 : clicking ? 22 : 38, height: hovering ? 52 : clicking ? 22 : 38,
          transition: "width 0.18s ease, height 0.18s ease",
          boxShadow: hovering ? "0 0 18px rgba(201,168,76,0.55), 0 0 36px rgba(201,168,76,0.2)" : "none" }} />
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%", width: 90, height: 90,
          background: "radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)",
          opacity: hovering ? 1 : 0, transition: "opacity 0.2s ease" }} />
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-amber-400"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%",
          width: clicking ? 16 : hovering ? 5 : 8, height: clicking ? 16 : hovering ? 5 : 8,
          transition: "width 0.12s ease, height 0.12s ease", boxShadow: "0 0 8px rgba(201,168,76,1)" }} />
    </>
  );
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Hangtag", desc: "Premium custom hangtags crafted to reflect your brand identity with precision printing, embossing, and unique finishes.", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", color: "#C9A84C", icon: "🏷️" },
  { id: 2, name: "Care Label", desc: "Durable, compliant care labels with crystal-clear wash and care instructions meeting international garment standards.", img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e74?w=600&q=80", color: "#2E86AB", icon: "🧵" },
  { id: 3, name: "Woven Label", desc: "High-quality woven labels that add texture and prestige to any garment, available in various weave styles and sizes.", img: "https://images.unsplash.com/photo-1521986329282-0436c1f1e212?w=600&q=80", color: "#A23B72", icon: "✨" },
  { id: 4, name: "Rubber Patch", desc: "3D rubber patches with exceptional durability and detail — ideal for streetwear, denim, and sports brands.", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", color: "#F18F01", icon: "🔶" },
  { id: 5, name: "Leather Patch", desc: "Genuine and synthetic leather patches with laser engraving, debossing, and premium edge finishing.", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", color: "#8B4513", icon: "🟫" },
  { id: 6, name: "Poly, Back & Neck Board", desc: "Custom poly bags, back boards, and neck boards that complete your packaging with a professional, branded finish.", img: "https://images.unsplash.com/photo-1585559700398-1385b3a8aeb6?w=600&q=80", color: "#44BBA4", icon: "📦" },
];

const BRANDS = [
  { name: "LIDL", color: "#FFD700" }, { name: "ALDI", color: "#4488cc" },
  { name: "MEXX", color: "#E63946" }, { name: "C&A", color: "#2B9348" },
  { name: "PRIMARK", color: "#7799cc" }, { name: "H&M", color: "#CC0000" },
  { name: "Walmart", color: "#0071CE" }, { name: "Kappa", color: "#dd4444" },
  { name: "George", color: "#88aacc" }, { name: "kik", color: "#FF6B35" },
  { name: "LPP", color: "#C77DFF" }, { name: "next", color: "#aaaaaa" },
  { name: "LAGER", color: "#aa88ff" }, { name: "OVS", color: "#EF233C" },
  { name: "TAKKO", color: "#FF8844" }, { name: "FILA", color: "#ee5555" },
  { name: "Siplec", color: "#44aa88" }, { name: "LC Waikiki", color: "#FF8C00" },
];

const STATS = [
  { value: "18+", label: "Global Brands" },
  { value: "6+", label: "Product Types" },
  { value: "100%", label: "Quality Check" },
  { value: "On-Time", label: "Delivery" },
];

const NAV_LINKS = ["Home", "About", "Products", "Clients", "Contact"];

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
      className="flex items-center gap-3 mb-3 sm:mb-4">
      <div className="w-6 sm:w-8 h-px bg-amber-400 flex-shrink-0" />
      <span className="text-amber-400 text-[10px] sm:text-xs uppercase tracking-widest font-semibold">{label}</span>
    </motion.div>
  );
}

// ─── ANIMATED STAT ────────────────────────────────────────────────────────────
function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center px-1">
      <span className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-br from-amber-300 to-amber-600 bg-clip-text text-transparent leading-none">
        {value}
      </span>
      <span className="mt-1.5 text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider text-slate-400 text-center leading-tight">
        {label}
      </span>
    </motion.div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: typeof PRODUCTS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div ref={ref} data-ch
      initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="relative group w-full">
      <motion.div
        animate={{ rotateY: hovered ? 3 : 0, rotateX: hovered ? -3 : 0, scale: hovered ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 h-full"
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}>
        <div className="relative h-44 xs:h-48 sm:h-52 overflow-hidden">
          <motion.img src={product.img} alt={product.name}
            animate={{ scale: hovered ? 1.08 : 1 }} transition={{ duration: 0.6 }}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 30%, ${product.color}22 70%, ${product.color}88 100%)` }} />
          <motion.div animate={{ y: hovered ? -6 : 0, scale: hovered ? 1.15 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-2xl sm:text-3xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg sm:rounded-xl backdrop-blur-md"
            style={{ background: `${product.color}33`, border: `1px solid ${product.color}66` }}>
            {product.icon}
          </motion.div>
        </div>
        <div className="p-4 sm:p-5 lg:p-6">
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1.5 sm:mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}>{product.name}</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{product.desc}</p>
          <motion.div animate={{ width: hovered ? "100%" : "35%" }} transition={{ duration: 0.4 }}
            className="mt-3 sm:mt-4 h-px rounded-full"
            style={{ background: `linear-gradient(to right, ${product.color}, transparent)` }} />
        </div>
        <motion.div animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${product.color}15, transparent 70%)` }} />
      </motion.div>
    </motion.div>
  );
}

// ─── PARTICLE (desktop only for perf) ────────────────────────────────────────
function Particle({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <motion.div className="absolute rounded-full pointer-events-none hidden sm:block"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: "radial-gradient(circle, rgba(201,168,76,0.5), transparent)" }}
      animate={{ y: [0, -25, 0], opacity: [0.2, 0.7, 0.2], scale: [1, 1.15, 1] }}
      transition={{ duration: 4 + delay, delay, repeat: Infinity, ease: "easeInOut" }} />
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ImprintPortfolio() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -120]);
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [isDesktop, setIsDesktop] = useState(false);

  const particles = useRef(
    Array.from({ length: 16 }, (_, i) => ({
      x: (i * 19 + 5) % 100, y: (i * 27 + 8) % 100,
      size: (i % 4) + 2, delay: (i * 0.35) % 2.5,
    }))
  ).current;

  // Detect desktop for cursor
  useEffect(() => {
    setIsDesktop(!window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Active nav tracking
  useEffect(() => {
    const handler = () => {
      for (const link of [...NAV_LINKS].reverse()) {
        const el = document.getElementById(link.toLowerCase());
        if (el && window.scrollY + 100 >= el.offsetTop) {
          setActiveLink(link.toLowerCase()); break;
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    e.preventDefault();
    setMenuOpen(false);
    smoothScrollTo(link.toLowerCase());
  };

  return (
    <>
      {/* Hide cursor on desktop only */}
      {isDesktop && <style>{`* { cursor: none !important; }`}</style>}
      <CustomCursor />

      <div className="min-h-screen bg-[#080B12] text-white overflow-x-hidden w-full"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Space+Mono:wght@400;700&display=swap');

          *, *::before, *::after { box-sizing: border-box; }
          html { scroll-behavior: smooth; -webkit-tap-highlight-color: transparent; }
          ::-webkit-scrollbar { width: 3px; }
          ::-webkit-scrollbar-track { background: #080B12; }
          ::-webkit-scrollbar-thumb { background: #C9A84C; border-radius: 3px; }

          /* Extra-small screens (below 375px) */
          @media (max-width: 374px) {
            .xs-text-sm { font-size: 0.8rem; }
            .xs-p-3 { padding: 0.75rem; }
          }

          .mesh-bg {
            background:
              radial-gradient(ellipse 80% 50% at 20% 40%, rgba(201,168,76,0.07) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 80% 60%, rgba(46,134,171,0.05) 0%, transparent 60%),
              radial-gradient(ellipse 100% 80% at 50% 0%, rgba(201,168,76,0.03) 0%, transparent 50%);
          }
          .text-gradient {
            background: linear-gradient(135deg, #C9A84C 0%, #FFE082 40%, #C9A84C 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .glow-gold { box-shadow: 0 0 24px rgba(201,168,76,0.3), 0 0 48px rgba(201,168,76,0.1); }
          .glass {
            background: rgba(255,255,255,0.03);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255,255,255,0.07);
          }
          /* Safe area for notch phones */
          .safe-top { padding-top: env(safe-area-inset-top, 0px); }
          .safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
          .safe-x { 
            padding-left: max(1rem, env(safe-area-inset-left));
            padding-right: max(1rem, env(safe-area-inset-right));
          }
          /* Prevent horizontal overflow globally */
          section, footer, nav { max-width: 100vw; overflow-x: hidden; }
          /* Touch targets */
          @media (pointer: coarse) {
            a, button { min-height: 44px; min-width: 44px; }
          }
        `}</style>

        {/* ══════════════════════════════════════════════════════════
            NAV
        ══════════════════════════════════════════════════════════ */}
        <motion.nav
          initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50 glass safe-top"
          style={{ minHeight: 64 }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

            {/* Logo */}
            <a href="#home" onClick={(e) => handleNav(e, "home")}
              className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-h-[44px]">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-900 text-base sm:text-lg shadow-lg flex-shrink-0">
                ID
              </div>
              <div className="hidden xs:block">
                <div className="font-black text-white text-xs sm:text-sm tracking-wider leading-none"
                  style={{ fontFamily: "'Space Mono', monospace" }}>IMPRINT</div>
                <div className="text-amber-400/70 text-[8px] sm:text-[9px] uppercase tracking-widest leading-none mt-0.5">
                  Trimming & Accessories
                </div>
              </div>
            </a>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = activeLink === link.toLowerCase();
                return (
                  <a key={link} href={`#${link.toLowerCase()}`} onClick={(e) => handleNav(e, link)}
                    className="relative text-xs xl:text-sm tracking-wide uppercase transition-colors duration-200 py-2"
                    style={{ color: isActive ? "#C9A84C" : "#94a3b8" }}>
                    {link}
                    <motion.span className="absolute -bottom-0.5 left-0 h-px bg-amber-400 rounded-full"
                      initial={false}
                      animate={{ width: isActive ? "100%" : "0%" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                  </a>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a href="#contact" onClick={(e) => handleNav(e, "contact")}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 transition-all duration-200 shadow-lg glow-gold whitespace-nowrap min-h-[40px]">
                Get Quote
              </a>

              {/* Hamburger — shown below lg */}
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden flex flex-col justify-center items-center w-11 h-11 rounded-lg glass border border-slate-700/50 gap-1.5 flex-shrink-0"
                aria-label={menuOpen ? "Close menu" : "Open menu"}>
                <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
                  className="block w-5 h-0.5 bg-white origin-center" />
                <motion.span animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
                  className="block w-3.5 h-0.5 bg-amber-400 origin-center" />
                <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
                  className="block w-5 h-0.5 bg-white origin-center" />
              </button>
            </div>
          </div>

          {/* ── Mobile / Tablet full-screen menu ── */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="lg:hidden fixed inset-0 top-16 z-40 bg-[#080B12]/98 backdrop-blur-xl safe-bottom"
                style={{ height: "calc(100dvh - 64px)" }}>
                <div className="h-full flex flex-col justify-center items-center gap-2 px-6 pb-8">
                  {NAV_LINKS.map((link, i) => (
                    <motion.a key={link}
                      href={`#${link.toLowerCase()}`} onClick={(e) => handleNav(e, link)}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-center gap-4 w-full max-w-xs py-4 px-6 rounded-2xl transition-colors duration-200 group min-h-[56px]"
                      style={{ background: activeLink === link.toLowerCase() ? "rgba(201,168,76,0.08)" : "transparent",
                               borderLeft: activeLink === link.toLowerCase() ? "2px solid #C9A84C" : "2px solid transparent" }}>
                      <span className="text-2xl font-black" style={{ fontFamily: "'Playfair Display', serif",
                        color: activeLink === link.toLowerCase() ? "#C9A84C" : "#64748b" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xl font-bold tracking-wide" style={{
                        color: activeLink === link.toLowerCase() ? "#C9A84C" : "#e2e8f0" }}>
                        {link}
                      </span>
                    </motion.a>
                  ))}
                  <motion.a href="#contact" onClick={(e) => handleNav(e, "contact")}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: NAV_LINKS.length * 0.07 }}
                    className="mt-4 w-full max-w-xs py-4 text-center rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-black text-base glow-gold min-h-[56px] flex items-center justify-center">
                    Get a Free Quote →
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* ══════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════ */}
        <section id="home" className="relative min-h-[100dvh] min-h-screen flex items-center justify-center overflow-hidden mesh-bg pt-16">
          {/* Particles (hidden on mobile for perf) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p, i) => <Particle key={i} {...p} />)}
          </div>
          {/* Grid bg */}
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{ backgroundImage: "linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          <motion.div style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 text-center w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

            {/* Badge */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass text-amber-400 text-[10px] sm:text-xs uppercase tracking-widest mb-6 sm:mb-8 border border-amber-400/20 max-w-full">
              <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              <span className="truncate">Bangladesh's Trusted Trims Partner</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-black leading-[1.0] mb-4 sm:mb-5"
              style={{ fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.8rem, 10vw, 6rem)" }}>
              <span className="text-white block">Imprint</span>
              <span className="text-gradient lg:text-7xl text-5xl block py-4">Trimming & Accessories</span>
            </motion.h1>

            {/* Sub */}
            <motion.p initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
              Reliable Garments Trims & Accessories Partner <br /> delivering premium, customized trimming solutions that meet international buyer standards.
            </motion.p>

            {/* CTA buttons */}
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.6 }}
              className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
              <a href="#products" onClick={(e) => handleNav(e, "products")}
                className="w-full xs:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold text-sm sm:text-base hover:from-amber-400 hover:to-amber-500 transition-all duration-200 shadow-2xl glow-gold text-center min-h-[48px] flex items-center justify-center">
                Explore Products
              </a>
              <a href="#contact" onClick={(e) => handleNav(e, "contact")}
                className="w-full xs:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl glass text-white font-medium text-sm sm:text-base hover:border-amber-400/40 transition-all duration-200 border border-slate-700 text-center min-h-[48px] flex items-center justify-center">
                Contact Us →
              </a>
            </motion.div>

            {/* Floating product images */}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex justify-center items-end gap-2 xs:gap-3 sm:gap-4">
                {[
                  { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80", rot: -7, yOff: 16, label: "Hangtag" },
                  { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80", rot: 0, yOff: 0, label: "Labels" },
                  { img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80", rot: 7, yOff: 16, label: "Leather" },
                ].map((item, i) => (
                <motion.div
  key={i}
  animate={{ y: [0, -10, 0] }}
  transition={{
    duration: 3 + i,
    delay: i * 0.5,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  style={{
    transform: `rotate(${item.rot}deg) translateY(${item.yOff}px)`,
    width: "clamp(80px, 20vw, 140px)",
    height: "clamp(110px, 28vw, 192px)"
  }}
  className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50"
>
  <img
    src={item.img}
    alt={item.label}
    className="w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />

  <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] xs:text-xs text-amber-300 font-semibold tracking-wide">
    {item.label}
  </div>
</motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Scroll</span>
            <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-amber-400 to-transparent" />
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            STATS
        ══════════════════════════════════════════════════════════ */}
        <section className="py-10 sm:py-14 lg:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 lg:p-10 grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              {STATS.map((s, i) => (
                <div key={i} className={`flex flex-col items-center ${i < 2 ? "lg:border-r" : ""} ${i === 0 ? "border-r" : ""} ${i === 2 ? "border-r lg:border-r" : ""} border-slate-800`}>
                  <AnimatedStat value={s.value} label={s.label} delay={i * 0.15} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            ABOUT
        ══════════════════════════════════════════════════════════ */}
        <section id="about" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(201,168,76,0.07), transparent 70%)" }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Text */}
              <div className="order-2 lg:order-1">
                <SectionLabel label="Who We Are" />
                <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="font-black mb-4 sm:mb-6"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 5vw, 3.5rem)", lineHeight: 1.1 }}>
                  Crafting Identity,<br /><span className="text-gradient">Thread by Thread</span>
                </motion.h2>
                <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.8 }}
                  className="text-slate-400 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                  Imprint Trimming & Accessories is a trusted manufacturer and supplier of garments trims and accessories in Bangladesh. We are committed to delivering high-quality, customized trimming solutions that meet international buyer standards and brand requirements.
                </motion.p>
                <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.25, duration: 0.8 }}
                  className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 sm:mb-10">
                  With strong technical expertise and industry experience, we focus on quality consistency, competitive pricing and on-time delivery. Our goal is to build long-term and transparent business relationships with buyers and buying houses worldwide.
                </motion.p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {["Quality Consistency", "Competitive Pricing", "On-Time Delivery", "International Standards"].map((f, i) => (
                    <motion.span key={f} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }} transition={{ delay: 0.08 * i }}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold border border-amber-400/30 text-amber-300 bg-amber-400/5">
                      ✓ {f}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Image */}
              <motion.div initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.9 }}
                className="order-1 lg:order-2 relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50"
                  style={{ transform: "perspective(1000px) rotateY(-4deg) rotateX(2deg)" }}>
                  <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80"
                    alt="Garments trimming" className="w-full h-56 sm:h-72 lg:h-80 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-transparent" />
                </div>
                {/* Floating cards — hidden on very small screens */}
                <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-6 glass rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-amber-400/20 shadow-2xl hidden xs:flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400 text-lg sm:text-xl flex-shrink-0">🏭</div>
                  <div>
                    <div className="text-white font-bold text-xs sm:text-sm">Bangladesh Based</div>
                    <div className="text-slate-400 text-[10px] sm:text-xs">Motijheel, Dhaka</div>
                  </div>
                </motion.div>
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-3 sm:-top-4 -right-2 sm:-right-4 glass rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-green-400/20 hidden xs:block">
                  <div className="text-green-400 text-[10px] sm:text-xs font-bold whitespace-nowrap">✓ ISO Quality</div>
                  <div className="text-slate-400 text-[10px] sm:text-xs whitespace-nowrap">Certified Standards</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            PRODUCTS
        ══════════════════════════════════════════════════════════ */}
        <section id="products" className="py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14 lg:mb-16">
              <SectionLabel label="Our Products" />
              <motion.h2 initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="font-black" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 6vw, 4rem)" }}>
                Premium <span className="text-gradient">Trims</span><br />& Accessories
              </motion.h2>
            </div>
            {/* Responsive grid: 1 col → 2 col → 3 col */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SHOWCASE GALLERY
        ══════════════════════════════════════════════════════════ */}
        <section className="py-14 sm:py-18 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.10) 0%, rgba(46,134,171,0.07) 50%, rgba(162,59,114,0.07) 100%)" }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* 1 col on mobile, 3 on md+ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80", label: "Fashion Labels" },
                { img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80", label: "Woven Details" },
                { img: "https://images.unsplash.com/photo-1521986329282-0436c1f1e212?w=500&q=80", label: "Brand Identity" },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.65 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-700/50"
                  style={{ height: "clamp(180px, 40vw, 260px)" }}>
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white font-bold text-base sm:text-lg"
                    style={{ fontFamily: "'Playfair Display', serif" }}>{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            CLIENTS / BRANDS
        ══════════════════════════════════════════════════════════ */}
        <section id="clients" className="py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14 lg:mb-16">
              <SectionLabel label="Trusted By" />
              <motion.h2 initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="font-black" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 5.5vw, 3.5rem)" }}>
                We Serve the <span className="text-gradient">World's Best</span><br />Fashion Brands
              </motion.h2>
            </div>

            {/* Row 1 — left to right */}
            <div className="overflow-hidden mb-3 sm:mb-4">
              <motion.div animate={{ x: [0, -1400] }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                className="flex gap-3 sm:gap-4 w-max">
                {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
                  <div key={i} className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 glass rounded-xl border border-slate-700/50 min-w-[90px] sm:min-w-[110px] text-center">
                    <span className="font-black text-xs sm:text-sm text-white tracking-wide"
                      style={{ fontFamily: "'Space Mono', monospace" }}>{brand.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Row 2 — right to left */}
            <div className="overflow-hidden">
              <motion.div animate={{ x: [-1400, 0] }} transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
                className="flex gap-3 sm:gap-4 w-max">
                {[...BRANDS.slice().reverse(), ...BRANDS.slice().reverse(), ...BRANDS.slice().reverse()].map((brand, i) => (
                  <div key={i} className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border min-w-[90px] sm:min-w-[110px] text-center"
                    style={{ background: `${brand.color}12`, borderColor: `${brand.color}28` }}>
                    <span className="font-black text-xs sm:text-sm tracking-wide"
                      style={{ color: brand.color, fontFamily: "'Space Mono', monospace" }}>{brand.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            WHY IMPRINT
        ══════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14 lg:mb-16">
              <SectionLabel label="Why Imprint" />
              <motion.h2 initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="font-black" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 5.5vw, 3.5rem)" }}>
                The <span className="text-gradient">Imprint</span> Difference
              </motion.h2>
            </div>
            {/* 1 → 2 → 4 column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {[
                { icon: "🎯", title: "Precision Craftsmanship", desc: "Every trim is manufactured with meticulous attention to detail and quality control at every stage." },
                { icon: "⚡", title: "On-Time Delivery", desc: "We understand deadlines. Our streamlined production ensures your orders ship when promised." },
                { icon: "💰", title: "Competitive Pricing", desc: "World-class quality at Bangladesh's competitive pricing — maximum value for your investment." },
                { icon: "🤝", title: "Long-Term Partnership", desc: "We build transparent, trust-based relationships with buyers and buying houses globally." },
              ].map((item, i) => (
                <motion.div key={i} data-ch
                  initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.65 }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-slate-700/50 hover:border-amber-400/30 transition-colors duration-300 group">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{item.icon}</div>
                  <h3 className="font-bold text-white mb-2 sm:mb-3 text-base sm:text-lg group-hover:text-amber-300 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            CONTACT
        ══════════════════════════════════════════════════════════ */}
        <section id="contact" className="py-16 sm:py-20 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">

              {/* Info */}
              <div>
                <SectionLabel label="Get In Touch" />
                <motion.h2 initial={{ opacity: 0, x: -25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className="font-black mb-4 sm:mb-6"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 5vw, 3.5rem)", lineHeight: 1.1 }}>
                  Let's Build<br /><span className="text-gradient">Together</span>
                </motion.h2>
                <p className="text-slate-400 text-sm sm:text-base mb-8 sm:mb-10 leading-relaxed max-w-md">
                  Ready to elevate your brand with premium garments trims? Get in touch with our team for a custom quote or to discuss your requirements.
                </p>
                <div className="space-y-4 sm:space-y-5">
                  {[
                    { icon: "📞", label: "Phone", value: "+88 01916-429953", href: "tel:+8801916429953" },
                    { icon: "✉️", label: "Email", value: "imprint389@gmail.com", href: "mailto:imprint389@gmail.com" },
                    { icon: "🌐", label: "Website", value: "www.imprinttrims.com", href: "https://www.imprinttrims.com" },
                    { icon: "📍", label: "Address", value: "153, Arambag (3rd Floor), Motijheel, Dhaka-1000", href: "#" },
                  ].map((item, i) => (
                    <motion.a key={i} href={item.href}
                      initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.09 }}
                      className="flex items-start gap-3 sm:gap-4 group min-h-[44px]">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl glass flex items-center justify-center text-lg sm:text-xl flex-shrink-0 group-hover:border-amber-400/40 transition-colors border border-slate-700">
                        {item.icon}
                      </div>
                      <div className="pt-1 min-w-0">
                        <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-0.5">{item.label}</div>
                        <div className="text-white group-hover:text-amber-300 transition-colors text-xs sm:text-sm font-medium break-all">
                          {item.value}
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Form */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.8 }}
                className="glass rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-8 border border-slate-700/50 w-full">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-5 sm:mb-6">Request a Quote</h3>
                <div className="space-y-3 sm:space-y-4">
                  {/* 2-col grid on wider screens */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { label: "Your Name", placeholder: "Enter your name", type: "text" },
                      { label: "Company", placeholder: "Your company name", type: "text" },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1 block">{field.label}</label>
                        <input type={field.type} placeholder={field.placeholder}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-colors text-xs sm:text-sm min-h-[44px]" />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { label: "Email", placeholder: "your@email.com", type: "email" },
                      { label: "Phone", placeholder: "+880 1234 567890", type: "tel" },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1 block">{field.label}</label>
                        <input type={field.type} placeholder={field.placeholder}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-colors text-xs sm:text-sm min-h-[44px]" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1 block">Message</label>
                    <textarea rows={4} placeholder="Describe your trimming requirements..."
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-colors text-xs sm:text-sm resize-none" />
                  </div>
                  <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold text-sm sm:text-base hover:from-amber-400 hover:to-amber-500 transition-all duration-200 shadow-lg glow-gold min-h-[48px]">
                    Send Inquiry ✓
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════ */}
        <footer className="border-t border-slate-800 py-8 sm:py-10 lg:py-12 safe-bottom">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">

              {/* Brand */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-900 text-base sm:text-lg flex-shrink-0">
                  ID
                </div>
                <div>
                  <div className="font-black text-white text-xs sm:text-sm leading-none"
                    style={{ fontFamily: "'Space Mono', monospace" }}>IMPRINT TRIMMING</div>
                  <div className="text-slate-500 text-[10px] sm:text-xs mt-0.5">Reliable Garments Trims & Accessories Partner</div>
                </div>
              </div>

              {/* Nav — hidden on mobile, wrapped on tablet */}
              <div className="hidden sm:flex flex-wrap items-center justify-center gap-3 sm:gap-5 lg:gap-6 text-xs sm:text-sm text-slate-500">
                {NAV_LINKS.map((link) => (
                  <a key={link} href={`#${link.toLowerCase()}`} onClick={(e) => handleNav(e, link)}
                    className="hover:text-amber-400 transition-colors py-1 min-h-[44px] flex items-center">
                    {link}
                  </a>
                ))}
              </div>

              {/* Copyright */}
              <div className="text-slate-600 text-[10px] sm:text-xs text-center sm:text-right leading-relaxed">
                © {new Date().getFullYear()} Imprint Trimming<br className="sm:hidden" /> & Accessories
              </div>
            </div>

            {/* Mobile footer links */}
            <div className="sm:hidden mt-6 pt-6 border-t border-slate-800/60 flex flex-wrap justify-center gap-x-5 gap-y-2">
              {NAV_LINKS.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} onClick={(e) => handleNav(e, link)}
                  className="text-xs text-slate-500 hover:text-amber-400 transition-colors py-1 min-h-[36px] flex items-center">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}