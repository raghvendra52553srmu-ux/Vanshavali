"use client";

import { memo, useState } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Briefcase } from "lucide-react";
import { FamilyMember } from "@/types/family";
import { getYearRange } from "@/lib/utils";

interface FamilyNodeData extends Record<string, unknown> {
  member: FamilyMember;
  isYou?: boolean;
  onSelect?: (member: FamilyMember) => void;
}

export type FamilyNodeType = Node<FamilyNodeData, "familyNode">;

const generationColors: Record<number, { bg: string; ring: string; badge: string }> = {
  1: { bg: "#6D4C41", ring: "rgba(109,76,65,0.3)", badge: "#6D4C41" },
  2: { bg: "#795548", ring: "rgba(121,85,72,0.25)", badge: "#795548" },
  3: { bg: "#A1887F", ring: "rgba(161,136,127,0.25)", badge: "#A1887F" },
  4: { bg: "#C8A97E", ring: "rgba(200,169,126,0.25)", badge: "#C8A97E" },
  5: { bg: "#3C7A57", ring: "rgba(60,122,87,0.3)", badge: "#3C7A57" },
  6: { bg: "#427A8C", ring: "rgba(66,122,140,0.3)", badge: "#427A8C" },
};

const FamilyNode = memo(({ data, selected }: NodeProps<FamilyNodeType>) => {
  const { member, isYou, onSelect } = data;
  const colors = generationColors[member.generation] || generationColors[3];
  const years = getYearRange(member);
  const [imgError, setImgError] = useState(false);

  const initials = member.firstName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: colors.bg,
          border: "2px solid white",
          width: 8,
          height: 8,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        whileHover={{ y: -4, scale: 1.02 }}
        onClick={() => onSelect?.(member)}
        className="relative cursor-pointer select-none overflow-hidden"
        style={{
          width: 170,
          background: "var(--color-card)",
          borderRadius: 20,
          border: `1px solid ${selected ? colors.bg : "var(--color-border)"}`,
          boxShadow: selected
            ? `0 0 0 3px ${colors.ring}, var(--shadow-lg)`
            : isYou
            ? `0 0 0 2px ${colors.ring}, var(--shadow-md)`
            : "0 4px 12px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)",
          padding: "20px 14px 16px",
        }}
      >
        {/* Subtle top accent line */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: colors.bg, opacity: 0.8 }}
        />

        {/* You badge */}
        {isYou && (
          <div
            className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-white tracking-widest uppercase"
            style={{ background: colors.bg }}
          >
            YOU
          </div>
        )}

        {/* Deceased indicator */}
        {!member.isAlive && (
          <div
            className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full opacity-60"
            style={{ background: "var(--color-text-tertiary)" }}
            title="Deceased"
          />
        )}

        {/* Avatar */}
        <div className="flex flex-col items-center mb-3">
          <div
            className="relative"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              padding: 2,
              background: `linear-gradient(135deg, ${colors.bg}40, transparent)`,
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-muted relative">
              {!imgError ? (
                <Image
                  src={member.photo || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white font-medium font-heading text-xl"
                  style={{ background: colors.bg }}
                >
                  {initials}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="text-center mb-2 px-1">
          <p
            className="text-sm font-bold leading-tight break-words line-clamp-2"
            style={{ color: "var(--color-text)", fontFamily: "var(--font-heading)" }}
          >
            {member.firstName}
          </p>
          {member.lastName && member.lastName !== member.firstName && (
            <p
              className="text-xs leading-tight break-words mt-0.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {member.lastName}
            </p>
          )}
        </div>

        {/* Years */}
        <div
          className="text-center text-[11px] mb-3 font-medium opacity-70"
          style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}
        >
          {years}
        </div>

        {/* Info chips */}
        <div className="space-y-1.5">
          {member.occupation && (
            <div className="flex items-center gap-1.5 justify-center">
              <Briefcase
                className="w-3 h-3 flex-shrink-0"
                style={{ color: "var(--color-text-tertiary)" }}
              />
              <span
                className="text-[11px] truncate"
                style={{ color: "var(--color-text-secondary)" }}
                title={member.occupation}
              >
                {member.occupation.split(",")[0].split(" ").slice(0, 3).join(" ")}
              </span>
            </div>
          )}
          {member.city && (
            <div className="flex items-center gap-1.5 justify-center">
              <MapPin
                className="w-3 h-3 flex-shrink-0"
                style={{ color: "var(--color-text-tertiary)" }}
              />
              <span
                className="text-[11px] truncate"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {member.city}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: colors.bg,
          border: "2px solid white",
          width: 8,
          height: 8,
        }}
      />
    </>
  );
});

FamilyNode.displayName = "FamilyNode";
export default FamilyNode;
