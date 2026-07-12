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
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        whileHover={{ y: -3, scale: 1.02 }}
        onClick={() => onSelect?.(member)}
        className="relative cursor-pointer select-none"
        style={{
          width: 160,
          background: "var(--color-card)",
          borderRadius: 16,
          border: `1.5px solid ${selected ? colors.bg : "var(--color-border)"}`,
          boxShadow: selected
            ? `0 0 0 3px ${colors.ring}, var(--shadow-lg)`
            : isYou
            ? `0 0 0 2px ${colors.ring}, var(--shadow-md)`
            : "var(--shadow-md)",
          padding: "16px 14px 14px",
        }}
      >
        {/* You badge */}
        {isYou && (
          <div
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white whitespace-nowrap"
            style={{ background: colors.bg, letterSpacing: "0.05em" }}
          >
            YOU
          </div>
        )}

        {/* Deceased indicator */}
        {!member.isAlive && (
          <div
            className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full opacity-60"
            style={{ background: "var(--color-text-tertiary)" }}
          />
        )}

        {/* Avatar */}
        <div className="flex flex-col items-center mb-3">
          <div
            className="relative"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: `2px solid ${colors.bg}`,
              overflow: "hidden",
              background: colors.bg + "20",
            }}
          >
            {!imgError ? (
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white text-base font-semibold"
                style={{ background: colors.bg }}
              >
                {initials}
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="text-center mb-2 px-1">
          <p
            className="text-xs font-semibold leading-tight break-words line-clamp-2"
            style={{ color: "var(--color-text)", fontFamily: "var(--font-body)" }}
          >
            {member.firstName}
          </p>
          {member.lastName !== member.firstName && (
            <p
              className="text-[10px] leading-tight break-words mt-0.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {member.lastName}
            </p>
          )}
        </div>

        {/* Years */}
        <div
          className="text-center text-[10px] mb-2.5"
          style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}
        >
          {years}
        </div>

        {/* Info chips */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 justify-center">
            <Briefcase
              className="w-2.5 h-2.5 flex-shrink-0"
              style={{ color: "var(--color-text-tertiary)" }}
            />
            <span
              className="text-[10px] truncate"
              style={{ color: "var(--color-text-secondary)" }}
              title={member.occupation}
            >
              {member.occupation.split(",")[0].split(" ").slice(0, 3).join(" ")}
            </span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <MapPin
              className="w-2.5 h-2.5 flex-shrink-0"
              style={{ color: "var(--color-text-tertiary)" }}
            />
            <span
              className="text-[10px] truncate"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {member.city}
            </span>
          </div>
        </div>

        {/* Generation badge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
          style={{ background: colors.bg, opacity: 0.4 }}
        />
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
