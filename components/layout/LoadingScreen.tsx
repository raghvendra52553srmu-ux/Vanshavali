"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { TreePine } from "lucide-react";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ background: "var(--color-bg)" }}
        >
          {/* Subtle background gradient */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
              style={{ background: "radial-gradient(circle, var(--color-highlight) 0%, transparent 70%)" }}
            />
          </div>

          <div className="relative flex flex-col items-center gap-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "var(--color-accent)" }}
            >
              <TreePine className="w-8 h-8 text-white" />
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-center"
            >
              <h1
                className="text-4xl font-light mb-1"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
              >
                Vanshavali
              </h1>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Preserving Families. Connecting Generations with purvaj.
              </p>
            </motion.div>

            {/* Animated loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-48 h-0.5 rounded-full overflow-hidden"
              style={{ background: "var(--color-border)" }}
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.2,
                  delay: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="h-full w-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--color-accent), var(--color-highlight))" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
