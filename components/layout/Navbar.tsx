"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { TreePine, Menu, X, ChevronRight } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { NAV_ITEMS } from "@/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();
  const { data: session, status } = useSession();

  useMotionValueEvent(scrollY, "change", (current) => {
    const diff = current - lastScrollY.current;
    if (current > 50) {
      setIsScrolled(true);
      if (diff > 8) setIsHidden(true);
      else if (diff < -8) setIsHidden(false);
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
          "fixed top-4 left-0 right-0 z-50 transition-all duration-500 mx-4 sm:mx-8 lg:mx-auto max-w-5xl rounded-full",
          isScrolled
            ? "glass-strong shadow-lg border-[var(--color-border)]"
            : "bg-transparent border-transparent shadow-none"
        )}
        style={{ borderWidth: isScrolled ? "1px" : "0px" }}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="px-5 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow-md shadow-[var(--color-accent)]/20"
              whileHover={{ scale: 1.05, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <TreePine className="w-4 h-4 text-white" strokeWidth={2.5} />
            </motion.div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
            >
              Vanshavali
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href} active={isActive(item.href)}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {status === "authenticated" ? (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/dashboard">
                  <motion.button
                    className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-[var(--color-accent)] hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Dashboard
                  </motion.button>
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="px-4 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
                  Log in
                </Link>
                <Link href="/register">
                  <motion.button
                    className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-[var(--color-text)] hover:opacity-90 transition-opacity flex items-center gap-1"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Sign up <ChevronRight className="w-3.5 h-3.5" />
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-24 z-40 md:hidden glass-strong border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              <div className="h-px bg-[var(--color-border)] my-2" />
              
              {status === "authenticated" ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
                    <button className="w-full px-4 py-3 rounded-xl text-base font-medium text-white bg-[var(--color-accent)] transition-colors text-center">
                      Dashboard
                    </button>
                  </Link>
                  <button 
                    onClick={() => { signOut(); setIsMobileOpen(false); }}
                    className="w-full px-4 py-3 rounded-xl text-base font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors text-center"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                    <button className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors text-center">
                      Log in
                    </button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileOpen(false)}>
                    <button className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[var(--color-text)] transition-colors text-center">
                      Sign up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className="relative px-4 py-1.5 rounded-full group transition-colors hover:bg-[var(--color-bg-secondary)]">
      <span
        className={cn(
          "text-sm font-medium transition-colors relative z-10",
          active ? "text-[var(--color-accent)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)]"
        )}
      >
        {children}
      </span>
    </Link>
  );
}
