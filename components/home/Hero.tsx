"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { staggerContainer, fadeInUp, fadeIn, scaleIn } from "@/lib/animations";

// Animated connecting lines background
function ConnectingLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.04]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

// Floating family tree orb
function FloatingOrb({ delay = 0, size = 300, x = "50%", y = "50%", opacity = 0.08 }: {
  delay?: number; size?: number; x?: string; y?: string; opacity?: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, var(--color-highlight) 0%, transparent 70%)`,
        opacity,
      }}
      animate={{
        y: [0, -20, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 6 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// Mini animated tree node
function TreeNode({ x, y, label, delay = 0, size = "md" }: {
  x: number; y: number; label: string; delay?: number; size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: 40, md: 52, lg: 64 };
  const s = sizes[size];

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 15 }}
    >
      {/* Shadow */}
      <ellipse cx={x} cy={y + s / 2 + 4} rx={s / 2 - 2} ry={4} fill="rgba(109,76,65,0.1)" />
      {/* Card */}
      <rect
        x={x - s / 2}
        y={y - s / 2}
        width={s}
        height={s}
        rx={s * 0.2}
        fill="white"
        stroke="rgba(109,76,65,0.2)"
        strokeWidth={1.5}
      />
      {/* Avatar circle */}
      <circle cx={x} cy={y - 6} r={s * 0.22} fill="rgba(109,76,65,0.15)" />
      {/* Name line */}
      <rect x={x - s * 0.3} y={y + s * 0.18} width={s * 0.6} height={s * 0.07} rx={2} fill="rgba(28,28,28,0.2)" />
      <text
        x={x}
        y={y + s * 0.36}
        textAnchor="middle"
        fontSize={s * 0.16}
        fill="rgba(28,28,28,0.4)"
        fontFamily="Manrope, sans-serif"
      >
        {label}
      </text>
    </motion.g>
  );
}

function AnimatedTree() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none select-none">
      <svg width="700" height="500" viewBox="0 0 700 500" className="max-w-full max-h-full">
        {/* Connecting lines */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          stroke="rgba(109,76,65,0.3)"
          strokeWidth={1.5}
          strokeDasharray="6 4"
          fill="none"
        >
          {/* Gen1 → Gen2 */}
          <line x1={350} y1={100} x2={220} y2={210} />
          <line x1={350} y1={100} x2={480} y2={210} />
          {/* Gen2 → Gen3 */}
          <line x1={220} y1={270} x2={160} y2={360} />
          <line x1={220} y1={270} x2={280} y2={360} />
          <line x1={480} y1={270} x2={440} y2={360} />
          <line x1={480} y1={270} x2={540} y2={360} />
          {/* Gen3 → Gen4 */}
          <line x1={160} y1={420} x2={130} y2={470} />
          <line x1={160} y1={420} x2={190} y2={470} />
        </motion.g>

        {/* Gen 1 */}
        <TreeNode x={350} y={80} label="Rudranath" delay={0.2} size="lg" />

        {/* Gen 2 */}
        <TreeNode x={220} y={240} label="Ramhridaya" delay={0.5} size="md" />
        <TreeNode x={480} y={240} label="Ghisiyawan" delay={0.6} size="md" />

        {/* Gen 3 */}
        <TreeNode x={160} y={390} label="Pintu" delay={0.9} size="sm" />
        <TreeNode x={280} y={390} label="Sonu" delay={1.0} size="sm" />
        <TreeNode x={440} y={390} label="Ramprasad" delay={1.1} size="sm" />
        <TreeNode x={540} y={390} label="Ramkrishna" delay={1.2} size="sm" />

        {/* Gen 4 */}
        <TreeNode x={130} y={470} label="Suraj" delay={1.4} size="sm" />
        <TreeNode x={190} y={470} label="Ritik" delay={1.5} size="sm" />
      </svg>
    </div>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <ConnectingLines />
      <FloatingOrb x="20%" y="30%" size={400} delay={0} opacity={0.12} />
      <FloatingOrb x="80%" y="70%" size={300} delay={2} opacity={0.08} />
      <FloatingOrb x="60%" y="20%" size={200} delay={1} opacity={0.06} />

      {/* Animated Tree in background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <AnimatedTree />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-16 pb-20"
      >
        {/* Badge */}
        <motion.div variants={scaleIn} className="inline-flex items-center gap-2 mb-8">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
            style={{
              background: "rgba(109, 76, 65, 0.08)",
              borderColor: "rgba(109, 76, 65, 0.2)",
              color: "var(--color-accent)",
            }}
          >
            <Sparkles className="w-3 h-3" />
            Now in Early Access · Join 12,000+ families
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.05] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          Your family&apos;s story
          <br />
          <span className="text-gradient italic">deserves to be</span>
          <br />
          remembered.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeInUp}
          className="text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Vanshavali is the most elegant way to build, explore, and share your
          family tree — preserving generations of heritage in one beautiful place.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
              style={{ background: "var(--color-accent)" }}
            >
              Create Your Family Tree
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </Link>
          <motion.button
            onClick={() => {
              document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-medium border transition-colors hover:bg-[var(--color-bg-secondary)]"
            style={{
              color: "var(--color-text)",
              borderColor: "var(--color-border)",
            }}
          >
            <Play className="w-3.5 h-3.5" />
            View Live Demo
          </motion.button>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          variants={fadeIn}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {[
            "No credit card required",
            "Free forever plan",
            "GDPR compliant",
            "Made in India 🇮🇳",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[var(--color-accent-secondary)]" />
              {item}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="w-1 h-1.5 rounded-full" style={{ background: "var(--color-accent)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
