"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Heart, Shield, Printer, Check } from "lucide-react";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { useSonner } from "@/hooks/useSonner";

export default function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { toast } = useSonner();

  const PLEDGE_ITEMS = [
    {
      id: "free-vault",
      title: "The Free Vault",
      description: "For every family to preserve their roots.",
      icon: Heart,
      badge: "Free Forever",
      isHighlighted: false,
      cta: "Create Your Free Vault",
      features: [
        "Up to 150 family members",
        "Full interactive tree view & zoom",
        "Rich biography & achievement timelines",
        "QR Code & link sharing",
        "Zero advertisements or tracking",
        "Private by default control",
      ],
    },
    {
      id: "open-data",
      title: "Archival Integrity",
      description: "Your family data belongs to you, always.",
      icon: Shield,
      badge: "Open Standards",
      isHighlighted: true,
      cta: "Explore Export Options",
      features: [
        "High-definition printable PDF exports",
        "Standard GEDCOM / Raw JSON formats",
        "Offline vault preservation packages",
        "Self-hostable database files",
        "No vendor lock-in, ever",
        "Encrypted multi-generation vaults",
      ],
    },
    {
      id: "printed-books",
      title: "Printed Legacies",
      description: "Tangible heritage volumes for your home.",
      icon: Printer,
      badge: "Physical Print",
      isHighlighted: false,
      cta: "Order Family Album (Soon)",
      features: [
        "Archival-grade heavy paper printing",
        "Gold-foil embossed hardcover bounding",
        "Custom designed genealogical layout",
        "Perfect for reunions and weddings",
        "Print-on-demand global delivery",
        "Supports free server hosting",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      ref={ref}
      className="py-24 lg:py-32"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Preservation Pledge
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl sm:text-5xl font-light mb-5"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            Preserving history,{" "}
            <span className="text-gradient italic">not selling data.</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-base max-w-xl mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Vanshavali is a digital heirloom. We believe family trees should be free, 
            completely private, and exportable in open archival formats to last for generations.
          </motion.p>
        </motion.div>

        {/* Pledge Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
        >
          {PLEDGE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="vintage-card flex flex-col justify-between h-full"
                style={{
                  borderColor: item.isHighlighted ? "var(--color-accent)" : undefined,
                  boxShadow: item.isHighlighted ? "var(--shadow-xl)" : undefined,
                }}
              >
                {item.isHighlighted && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "var(--color-accent)", color: "#fff" }}
                  >
                    <Sparkles className="w-3 h-3" />
                    Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: item.isHighlighted ? "var(--color-accent)" : "rgba(109, 76, 65, 0.08)",
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{
                          color: item.isHighlighted ? "white" : "var(--color-accent)",
                        }}
                      />
                    </div>
                    <span
                      className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                      style={{
                        background: item.isHighlighted ? "rgba(109,76,65,0.15)" : "var(--color-bg-secondary)",
                        color: "var(--color-accent)",
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3
                    className="text-xl font-light mb-1"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed mb-6" style={{ color: "var(--color-text-secondary)" }}>
                    {item.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background: "rgba(109,76,65,0.08)",
                          }}
                        >
                          <Check className="w-2.5 h-2.5" style={{ color: "var(--color-accent)" }} />
                        </div>
                        <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  onClick={() => {
                    if (item.id === "printed-books") {
                      toast("Archival Printing Coming Soon!", "We are partnering with local hand-binding artisans.");
                    } else if (item.id === "open-data") {
                      toast("Export features are free!", "You can download PDFs and JSON files directly from your dashboard.");
                    } else {
                      window.location.href = "/tree";
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors border"
                  style={{
                    background: item.isHighlighted ? "var(--color-accent)" : "transparent",
                    borderColor: "var(--color-accent)",
                    color: item.isHighlighted ? "white" : "var(--color-accent)",
                  }}
                >
                  {item.cta}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Decorative Divider */}
        <div className="divider-heritage mt-16" />
      </div>
    </section>
  );
}
