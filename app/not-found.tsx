"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TreePine, ArrowLeft } from "lucide-react";
import { scaleIn, fadeInUp, staggerContainer } from "@/lib/animations";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center pt-16 pb-24 px-4"
      style={{ background: "var(--color-bg)" }}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <motion.div
          variants={scaleIn}
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg"
          style={{ background: "var(--color-accent)" }}
        >
          <TreePine className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-8xl md:text-9xl font-light mb-4"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-highlight)" }}
        >
          404
        </motion.h1>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl md:text-3xl font-medium mb-4"
          style={{ color: "var(--color-text)" }}
        >
          A broken branch
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="text-base mb-10 max-w-md mx-auto"
          style={{ color: "var(--color-text-secondary)" }}
        >
          It seems you&apos;ve wandered too far from the family tree. The page you&apos;re looking
          for doesn&apos;t exist or has been moved.
        </motion.p>

        <motion.div variants={fadeInUp}>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-lg"
              style={{ background: "var(--color-accent)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
