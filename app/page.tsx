"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";

// Lazy-load the heavy portfolio to not block loader
const ImprintPortfolio = dynamic(() => import("@/components/ImprintPortfolio"), {
  ssr: false,
});

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const handleLoadComplete = () => {
    setLoaded(true);
    // Small delay so curtain starts before content fades in
    setTimeout(() => setShowPortfolio(true), 200);
  };

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