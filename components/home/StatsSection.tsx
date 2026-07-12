"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { STATS } from "@/constants";

function AnimatedNumber({ target, suffix, duration = 2000 }: {
  target: number; suffix: string; duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  const formatted = count >= 1000000
    ? (count / 1000000).toFixed(1) + "M"
    : count >= 1000
    ? (count / 1000).toFixed(1) + "K"
    : count.toString();

  return (
    <span ref={ref} style={{ fontFamily: "var(--font-mono)" }}>
      {formatted}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 border-y border-[var(--color-border)]"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="text-center"
            >
              <div
                className="text-3xl sm:text-4xl font-semibold mb-1"
                style={{ color: "var(--color-accent)" }}
              >
                {inView ? (
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                ) : (
                  <span style={{ fontFamily: "var(--font-mono)" }}>0</span>
                )}
              </div>
              <div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
