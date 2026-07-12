"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TreePine, MessageCircle, Globe, Mail, Share2, ArrowRight } from "lucide-react";
import { staggerContainer, fadeIn } from "@/lib/animations";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Demo Tree", href: "/#demo" },
    { label: "Family Card", href: "/card" },
    { label: "Timeline", href: "/timeline" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press Kit", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "GDPR", href: "#" },
  ],
};

const socialLinks = [
  { icon: MessageCircle, href: "#", label: "Community" },
  { icon: Globe, href: "#", label: "Website" },
  { icon: Mail, href: "#", label: "Contact" },
  { icon: Share2, href: "#", label: "Share" },
];

export default function Footer() {
  return (
    <footer
      className="relative border-t border-[var(--color-border)] mt-24"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Newsletter */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16 p-8 lg:p-12 rounded-2xl relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, var(--color-accent) 0%, #4a3028 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[var(--color-highlight)] blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <motion.h3
                variants={fadeIn}
                className="text-2xl lg:text-3xl font-light text-white mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Preserve your family&apos;s story.
              </motion.h3>
              <motion.p variants={fadeIn} className="text-white/70 text-sm">
                Join 12,000+ families who trust Vanshavali with their legacy.
              </motion.p>
            </div>
            <motion.form
              variants={fadeIn}
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full lg:w-auto gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-72 px-4 py-2.5 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[var(--color-accent)] text-sm font-semibold whitespace-nowrap"
              >
                Get Early Access <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.form>
          </div>
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                <TreePine className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-lg font-semibold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Vanshavali
              </span>
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
              Preserving Families.<br />Connecting Generations.
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Made with ❤️ in India
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            © 2024 Vanshavali Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-border)] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
