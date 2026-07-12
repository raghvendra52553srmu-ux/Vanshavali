"use client";

import { motion } from "framer-motion";
import { TreePine, Download, Share2, Users } from "lucide-react";
import dynamic from "next/dynamic";
import { familyData } from "@/data/family";
import { useSonner } from "@/hooks/useSonner";

const FamilyTree = dynamic(() => import("@/components/tree/FamilyTree"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="text-center">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4"
          style={{ borderColor: "var(--color-accent)" }}
        />
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Building your family tree…
        </p>
      </div>
    </div>
  ),
});

export default function TreePageClient() {
  const { toast } = useSonner();
  const totalMembers = familyData.members.length;
  const aliveMembers = familyData.members.filter((m) => m.isAlive).length;

  return (
    <div
      className="flex flex-col"
      style={{ height: "100vh", background: "var(--color-bg)" }}
    >
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b mt-16"
        style={{
          background: "var(--color-card)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Family Info */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--color-accent)" }}
          >
            <TreePine className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1
              className="text-sm font-semibold"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
            >
              {familyData.familyName} Family Tree
            </h1>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}
            >
              est. {familyData.established} · {familyData.origin}
            </p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-4 text-xs mr-2">
            <div className="flex items-center gap-1.5" style={{ color: "var(--color-text-secondary)" }}>
              <Users className="w-3.5 h-3.5" />
              <span style={{ fontFamily: "var(--font-mono)" }}>
                {totalMembers} members
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--color-success)" }}
              />
              <span style={{ color: "var(--color-text-secondary)" }}>
                {aliveMembers} living
              </span>
            </div>
          </div>
          <motion.button
            onClick={() => toast("PDF export coming soon!")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
            style={{
              color: "var(--color-text-secondary)",
              borderColor: "var(--color-border)",
            }}
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </motion.button>
          <motion.button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast("Link copied!", "Share this tree with your family.");
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
            style={{ background: "var(--color-accent)" }}
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </motion.button>
        </div>
      </motion.div>

      {/* Tree Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <FamilyTree />
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex-shrink-0 flex items-center gap-4 px-4 py-2.5 border-t flex-wrap"
        style={{
          background: "var(--color-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <span className="text-xs font-semibold mr-1" style={{ color: "var(--color-text-tertiary)" }}>
          Legend:
        </span>
        {[
          { label: "Gen 1 (Patriarchs)", color: "#6D4C41" },
          { label: "Gen 2 (Grandparents)", color: "#795548" },
          { label: "Gen 3 (Parents)", color: "#A1887F" },
          { label: "Gen 4 (Your Generation)", color: "#C8A97E" },
          { label: "Gen 5 (You)", color: "#3C7A57" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{label}</span>
          </div>
        ))}
        <div className="ml-auto text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          Click any node to view profile · Drag to rearrange
        </div>
      </motion.div>
    </div>
  );
}
