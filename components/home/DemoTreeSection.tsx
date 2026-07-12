"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ZoomIn, Hand, MousePointer } from "lucide-react";
import dynamic from "next/dynamic";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const FamilyTree = dynamic(() => import("@/components/tree/FamilyTree"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="text-center">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
          style={{ borderColor: "var(--color-accent)" }}
        />
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Loading family tree…
        </p>
      </div>
    </div>
  ),
});

const hints = [
  { icon: ZoomIn, text: "Scroll to zoom" },
  { icon: Hand, text: "Drag to pan" },
  { icon: MousePointer, text: "Click a member to view profile" },
];

export default function DemoTreeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="demo" ref={ref} className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="text-center mb-12"
      >
        <motion.p
          variants={fadeInUp}
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Live Demo
        </motion.p>
        <motion.h2
          variants={fadeInUp}
          className="text-4xl sm:text-5xl font-light mb-5"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          Explore the{" "}
          <span className="text-gradient italic">Pandey family tree</span>
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="text-base max-w-xl mx-auto"
          style={{ color: "var(--color-text-secondary)" }}
        >
          This is a real, interactive tree. Zoom, pan, drag nodes, and click any
          family member to see their full profile.
        </motion.p>

        {/* Hints */}
        <motion.div
          variants={fadeInUp}
          className="flex items-center justify-center gap-6 mt-6 flex-wrap"
        >
          {hints.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              <Icon className="w-3.5 h-3.5" />
              {text}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Tree Canvas */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="relative rounded-2xl overflow-hidden border"
        style={{
          height: 500,
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <FamilyTree compact disableControls={false} />

        {/* Overlay gradient at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{
            background: "linear-gradient(to top, var(--color-bg) 0%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* CTA below */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className="text-center mt-8"
      >
        <Link href="/tree">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white"
            style={{ background: "var(--color-accent)" }}
          >
            Open Full Tree View
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}
