"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TreePine, Heart, Globe, Shield } from "lucide-react";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";

export default function AboutPageClient() {
  return (
    <div
      className="min-h-screen pt-24 pb-24"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center mb-20"
        >
          <motion.div
            variants={scaleIn}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg"
            style={{ background: "var(--color-accent)" }}
          >
            <TreePine className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-light mb-6 leading-tight"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            Preserving the past,
            <br />
            <span className="text-gradient italic">for the future.</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            We believe that every family has a story worth telling. Our mission is to
            provide the most elegant, secure, and intuitive platform to document your
            heritage and connect generations.
          </motion.p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden mb-24"
          style={{ height: 400 }}
        >
          <Image
            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop"
            alt="Family heritage"
            fill
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
            <h2
              className="text-3xl sm:text-4xl font-light text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Story
            </h2>
            <p className="text-white/80 max-w-2xl text-sm sm:text-base leading-relaxed">
              Vanshavali was born from a personal need. When our founder tried to digitize
              his 140-year-old family tree, he found only clunky spreadsheets and outdated
              software. He realized that preserving a family&apos;s legacy shouldn&apos;t feel like
              data entry — it should feel like preserving art.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: Heart,
              title: "Built with Care",
              description: "Every feature is designed thoughtfully to treat your family's data with the respect it deserves.",
            },
            {
              icon: Globe,
              title: "For All Families",
              description: "Whether you're mapping 5 members or 500, Vanshavali scales to handle complex relationships.",
            },
            {
              icon: Shield,
              title: "Privacy First",
              description: "Your family data belongs to you. We employ state-of-the-art encryption to keep your legacy safe.",
            },
          ].map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(109,76,65,0.08)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                </div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: "var(--color-text)" }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
