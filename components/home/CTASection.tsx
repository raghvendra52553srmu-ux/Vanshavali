"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TreePine } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden px-8 py-16 lg:px-20 lg:py-24 text-center"
        style={{
          background: "linear-gradient(135deg, #3d2b25 0%, #5d3a30 50%, #4a3028 100%)",
        }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(ellipse, var(--color-highlight) 0%, transparent 70%)" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <TreePine className="w-7 h-7 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Your family&apos;s story
            <br />
            begins today.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            className="text-base text-white/70 mb-10 max-w-lg mx-auto"
          >
            Start free. Build your tree. Preserve what matters most. Join thousands of
            Indian families already using Vanshavali.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/tree">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold"
                style={{ background: "white", color: "var(--color-accent)" }}
              >
                Create Your Tree — It&apos;s Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-medium text-white border border-white/30 hover:border-white/50 transition-colors"
              >
                Learn About Us
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
