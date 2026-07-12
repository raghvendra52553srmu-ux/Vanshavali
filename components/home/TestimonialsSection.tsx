"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/constants";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          Loved by families
        </motion.p>
        <motion.h2
          variants={fadeInUp}
          className="text-4xl sm:text-5xl font-light"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          Real families,{" "}
          <span className="text-gradient italic">real stories</span>
        </motion.h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </motion.div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof TESTIMONIALS[number] }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="p-6 rounded-2xl border"
      style={{
        background: "var(--color-card)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: "var(--color-highlight)" }} />
        ))}
      </div>

      {/* Quote */}
      <blockquote
        className="text-sm leading-relaxed mb-5 italic"
        style={{
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-heading)",
          fontSize: "1rem",
        }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className="relative rounded-full overflow-hidden flex-shrink-0"
          style={{ width: 40, height: 40, border: "2px solid var(--color-border)" }}
        >
          {!imgError ? (
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "var(--color-accent)" }}
            >
              {testimonial.name[0]}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
            {testimonial.name}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
            {testimonial.location} · {testimonial.familySize} members
          </p>
        </div>
      </div>
    </motion.div>
  );
}
