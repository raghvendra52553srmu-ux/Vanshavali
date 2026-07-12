"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users, UserCircle, Share2, FileUp, FileDown, QrCode,
  Clock, Image, Shield, Lock, GitBranch
} from "lucide-react";
import { FEATURES } from "@/constants";
import { cn } from "@/lib/utils";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>> = {
  Users, UserCircle, Share2, FileUp, FileDown, QrCode,
  Timeline: Clock, Image, Shield, Lock, GitBranch,
};

const BADGE_COLORS: Record<string, string> = {
  Core: "rgba(109, 76, 65, 0.12)",
  Popular: "rgba(200, 169, 126, 0.2)",
  New: "rgba(60, 122, 87, 0.12)",
};

const BADGE_TEXT: Record<string, string> = {
  Core: "var(--color-accent)",
  Popular: "var(--color-highlight)",
  New: "var(--color-success)",
};

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      ref={ref}
      className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="text-center mb-16"
      >
        <motion.p
          variants={fadeInUp}
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Everything you need
        </motion.p>
        <motion.h2
          variants={fadeInUp}
          className="text-4xl sm:text-5xl lg:text-6xl font-light mb-5 leading-tight"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          Built for families,
          <br />
          <span className="text-gradient italic">designed for generations.</span>
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="text-base max-w-xl mx-auto"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Every feature thoughtfully crafted to help you capture, preserve, and share
          the most important story ever told — your family&apos;s.
        </motion.p>
      </motion.div>

      {/* Feature Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
      >
        {FEATURES.map((feature) => {
          const Icon = ICON_MAP[feature.icon] || GitBranch;
          return (
            <FeatureCard key={feature.id} feature={feature} Icon={Icon} />
          );
        })}
      </motion.div>
    </section>
  );
}

function FeatureCard({
  feature,
  Icon,
}: {
  feature: (typeof FEATURES)[number];
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
}) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative p-6 rounded-2xl border cursor-default"
      style={{
        background: "var(--color-card)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(109,76,65,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="flex items-start justify-between mb-4">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(109, 76, 65, 0.08)" }}
        >
          <Icon className="w-5 h-5" strokeWidth={1.5} style={{ color: "var(--color-accent)" } as React.CSSProperties} />
        </motion.div>

        {feature.badge && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: BADGE_COLORS[feature.badge] || "rgba(109,76,65,0.1)",
              color: BADGE_TEXT[feature.badge] || "var(--color-accent)",
            }}
          >
            {feature.badge}
          </span>
        )}
      </div>

      <h3
        className="text-base font-semibold mb-2"
        style={{ color: "var(--color-text)" }}
      >
        {feature.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        {feature.description}
      </p>

      {/* Bottom arrow reveal on hover */}
      <motion.div
        className="mt-4 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: "var(--color-accent)" }}
      >
        Learn more →
      </motion.div>
    </motion.div>
  );
}
