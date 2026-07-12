"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search, GitBranch, Clock, Share2, Info, Mail,
  Moon, FileDown, Link, X, ArrowRight
} from "lucide-react";
import { COMMAND_ITEMS } from "@/constants";
import { cn } from "@/lib/utils";
import { overlayVariants, scaleIn } from "@/lib/animations";
import { useSonner } from "@/hooks/useSonner";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GitBranch, Clock, Share2, Info, Mail, Moon, FileDown, Link,
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const { toast } = useSonner();

  const filtered = COMMAND_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const executeAction = useCallback(
    (action: string) => {
      if (action.startsWith("/")) {
        router.push(action);
        close();
      } else if (action === "theme-toggle") {
        setTheme(theme === "dark" ? "light" : "dark");
        close();
      } else if (action === "copy-link") {
        navigator.clipboard.writeText(window.location.origin);
        toast("Link copied to clipboard!");
        close();
      } else if (action === "export-pdf") {
        toast("PDF export coming soon!");
        close();
      }
    },
    [router, close, setTheme, theme, toast]
  );

  useEffect(() => {
    const handleOpen = () => open();
    window.addEventListener("open-command-palette", handleOpen);
    return () => window.removeEventListener("open-command-palette", handleOpen);
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? close() : open();
      }
      if (e.key === "Escape") close();
      if (isOpen && e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (isOpen && e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (isOpen && e.key === "Enter" && filtered[selectedIndex]) {
        executeAction(filtered[selectedIndex].action);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, open, close, filtered, selectedIndex, executeAction]);

  let globalIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={close}
          />
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[20vh] px-4">
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
              style={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--color-border)]">
                <Search className="w-4 h-4 text-[var(--color-text-tertiary)] flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Search commands, pages, actions…"
                  className="flex-1 text-sm bg-transparent text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] outline-none"
                />
                <button onClick={close} className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {Object.keys(grouped).length === 0 ? (
                  <div className="py-8 text-center text-sm text-[var(--color-text-tertiary)]">
                    No results for &quot;{query}&quot;
                  </div>
                ) : (
                  Object.entries(grouped).map(([category, items]) => (
                    <div key={category}>
                      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                        {category}
                      </div>
                      {items.map((item) => {
                        const Icon = ICON_MAP[item.icon] || ArrowRight;
                        const isSelected = globalIndex++ === selectedIndex;
                        return (
                          <button
                            key={item.id}
                            onClick={() => executeAction(item.action)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                              isSelected
                                ? "bg-[var(--color-bg-secondary)] text-[var(--color-accent)]"
                                : "hover:bg-[var(--color-bg-secondary)] text-[var(--color-text)]"
                            )}
                          >
                            <div
                              className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                                isSelected
                                  ? "bg-[var(--color-accent)] text-white"
                                  : "bg-[var(--color-border)] text-[var(--color-text-secondary)]"
                              )}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{item.label}</div>
                              {item.description && (
                                <div className="text-xs text-[var(--color-text-tertiary)] truncate">
                                  {item.description}
                                </div>
                              )}
                            </div>
                            {item.shortcut && (
                              <kbd className="text-xs text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)] px-1.5 py-0.5 rounded font-mono whitespace-nowrap">
                                {item.shortcut}
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-[var(--color-border)] px-4 py-2.5 flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
                <span><kbd className="bg-[var(--color-border)] px-1 rounded">↑↓</kbd> navigate</span>
                <span><kbd className="bg-[var(--color-border)] px-1 rounded">↵</kbd> open</span>
                <span><kbd className="bg-[var(--color-border)] px-1 rounded">Esc</kbd> close</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
