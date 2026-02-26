/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Both components use browser APIs — must be client-only (ssr: false)
const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), {
  ssr: false,
  loading: () => (
    // Minimal dark placeholder shown on server / before hydration
    <div style={{ position: "fixed", inset: 0, background: "#080B12" }} />
  ),
});

const ImprintPortfolio = dynamic(() => import("@/components/ImprintPortfolio"), {
  ssr: false,
});

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);

  // Only render client components after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLoadComplete = () => {
    setLoaded(true);
    // Small delay so curtain starts before content fades in
    setTimeout(() => setShowPortfolio(true), 200);
  };

  // Server render: plain dark screen (no flicker)
  if (!isMounted) {
    return <div style={{ position: "fixed", inset: 0, background: "#080B12" }} />;
  }

  return (
    <main>
      {/* Loading screen — unmounts after complete */}
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}

      {/* Portfolio — fades in after loader exits */}
      <AnimatePresence>
        {showPortfolio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          >
            <ImprintPortfolio />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}