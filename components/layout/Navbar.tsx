"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { TreePine, Menu, X, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { NAV_ITEMS } from "@/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (current) => {
    const diff = current - lastScrollY.current;
    if (current > 80) {
      setIsScrolled(true);
      if (diff > 6) setIsHidden(true);
      else if (diff < -6) setIsHidden(false);
    } else {
      setIsScrolled(false);
      setIsHidden(false);
    }
    lastScrollY.current = current;
  });

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return pathname === href;
  };

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass shadow-sm border-b border-[var(--color-border)]"
            : "bg-transparent"
        )}
        animate={{ y: isHidden ? -80 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <TreePine className="w-4 h-4 text-white" strokeWidth={2} />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span
                className="text-lg font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
              >
                Vanshavali
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href} active={isActive(item.href)}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Command Palette Trigger */}
            <motion.button
              onClick={() => {
                const event = new CustomEvent("open-command-palette");
                window.dispatchEvent(event);
              }}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent-secondary)] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
              <kbd className="ml-1 text-xs bg-[var(--color-bg-secondary)] px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </kbd>
            </motion.button>

            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, rotate: 15 }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            )}

            {/* CTA */}
            <Link href="/tree">
              <motion.button
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 transition-colors"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                View Tree
              </motion.button>
            </Link>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden border-t border-[var(--color-border)] glass"
              style={{ overflow: "hidden" }}
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <Link href="/tree" onClick={() => setIsMobileOpen(false)}>
                  <button className="mt-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--color-accent)] transition-colors">
                    View Tree
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="relative px-3 py-2 group">
      <span
        className={cn(
          "text-sm font-medium transition-colors",
          active
            ? "text-[var(--color-accent)]"
            : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)]"
        )}
      >
        {children}
      </span>
      <motion.span
        className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-[var(--color-accent)] rounded-full origin-left"
        initial={{ scaleX: active ? 1 : 0 }}
        animate={{ scaleX: active ? 1 : 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
    </Link>
  );
}
