"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { PRICING_PLANS } from "@/constants";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { useSonner } from "@/hooks/useSonner";

export default function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { toast } = useSonner();

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
            Simple Pricing
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl sm:text-5xl font-light mb-5"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            A plan for every{" "}
            <span className="text-gradient italic">family</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-base max-w-md mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Start free, upgrade when your family grows. No hidden fees, cancel anytime.
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start"
        >
          {PRICING_PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              variants={scaleIn}
              whileHover={{ y: plan.isPopular ? -2 : -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative rounded-2xl p-7 border"
              style={{
                background: plan.isPopular ? "var(--color-accent)" : "var(--color-card)",
                borderColor: plan.isPopular ? "var(--color-accent)" : "var(--color-border)",
                boxShadow: plan.isPopular ? "var(--shadow-xl)" : "var(--shadow-sm)",
              }}
            >
              {plan.isPopular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "var(--color-highlight)", color: "#fff" }}
                >
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={cn(
                    "text-base font-semibold mb-1",
                    plan.isPopular ? "text-white" : ""
                  )}
                  style={{ color: plan.isPopular ? undefined : "var(--color-text)" }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-xs"
                  style={{ color: plan.isPopular ? "rgba(255,255,255,0.7)" : "var(--color-text-secondary)" }}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-4xl font-bold"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: plan.isPopular ? "white" : "var(--color-text)",
                    }}
                  >
                    {plan.price === 0 ? "Free" : `₹${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span
                      className="text-sm"
                      style={{ color: plan.isPopular ? "rgba(255,255,255,0.6)" : "var(--color-text-secondary)" }}
                    >
                      /{plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: plan.isPopular ? "rgba(255,255,255,0.2)" : "rgba(109,76,65,0.1)",
                      }}
                    >
                      <Check
                        className="w-2.5 h-2.5"
                        style={{
                          color: plan.isPopular ? "white" : "var(--color-accent)",
                        }}
                      />
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: plan.isPopular ? "rgba(255,255,255,0.85)" : "var(--color-text-secondary)" }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.button
                onClick={() => toast(`${plan.name} plan coming soon!`, "We're launching soon.")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                )}
                style={{
                  background: plan.isPopular ? "white" : "var(--color-accent)",
                  color: plan.isPopular ? "var(--color-accent)" : "white",
                }}
              >
                {plan.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-xs mt-8"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          All prices in INR. GST applicable. 30-day money-back guarantee on paid plans.
        </motion.p>
      </div>
    </section>
  );
}
