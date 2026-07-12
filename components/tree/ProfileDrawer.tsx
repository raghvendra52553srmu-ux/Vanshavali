"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import {
  X, MapPin, Briefcase, GraduationCap, Calendar,
  Users, Heart, Star, Edit3, ChevronRight
} from "lucide-react";
import { FamilyMember } from "@/types/family";
import { familyData } from "@/data/family";
import { formatDate, getAge, getYearRange } from "@/lib/utils";
import { slideInRight, overlayVariants } from "@/lib/animations";

interface ProfileDrawerProps {
  member: FamilyMember | null;
  onClose: () => void;
  onSelectMember?: (member: FamilyMember) => void;
}

export default function ProfileDrawer({ member, onClose, onSelectMember }: ProfileDrawerProps) {
  const [imgError, setImgError] = useState(false);

  const initials = member
    ? member.firstName.split(" ").map((n) => n[0]).join("").slice(0, 2)
    : "";

  const spouse = member?.spouseId
    ? familyData.members.find((m) => m.id === member.spouseId)
    : null;

  const parents = member?.parentIds
    ? familyData.members.filter((m) => member.parentIds.includes(m.id))
    : [];

  const children = member
    ? familyData.members.filter((m) => m.parentIds.includes(member.id))
    : [];

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          key="overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {member && (
        <motion.aside
          key="drawer"
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-96 lg:w-[420px] overflow-y-auto"
          style={{
            background: "var(--color-card)",
            borderLeft: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          {/* Header */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
            style={{
              background: "var(--color-card)",
              borderColor: "var(--color-border)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span
              className="text-sm font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Family Member
            </span>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                style={{
                  color: "var(--color-accent)",
                  borderColor: "var(--color-accent)",
                  background: "rgba(109,76,65,0.05)",
                }}
              >
                <Edit3 className="w-3 h-3" />
                Edit
              </motion.button>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-4"
            >
              <div
                className="relative flex-shrink-0 rounded-2xl overflow-hidden"
                style={{ width: 80, height: 80, border: "2px solid var(--color-border)" }}
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
                    className="w-full h-full flex items-center justify-center text-xl font-semibold text-white"
                    style={{ background: "var(--color-accent)" }}
                  >
                    {initials}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2
                  className="text-xl font-medium leading-tight mb-1 break-words line-clamp-2"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
                >
                  {member.name}
                </h2>
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}
                >
                  {getYearRange(member)}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: member.isAlive
                        ? "rgba(60,122,87,0.1)"
                        : "rgba(100,100,100,0.1)",
                      color: member.isAlive
                        ? "var(--color-success)"
                        : "var(--color-text-tertiary)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{
                      background: member.isAlive ? "var(--color-success)" : "var(--color-text-tertiary)"
                    }} />
                    {member.isAlive ? "Living" : "Passed"}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(109,76,65,0.08)",
                      color: "var(--color-accent)",
                    }}
                  >
                    Generation {member.generation}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2.5"
            >
              <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(member.dateOfBirth)} />
              {member.dateOfDeath && (
                <InfoRow icon={Calendar} label="Date of Death" value={formatDate(member.dateOfDeath)} />
              )}
              <InfoRow icon={Briefcase} label="Occupation" value={member.occupation} />
              <InfoRow icon={MapPin} label="Location" value={`${member.city}, ${member.state}`} />
              <InfoRow icon={GraduationCap} label="Education" value={member.education} />
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SectionTitle>About</SectionTitle>
              <p
                className="text-sm leading-relaxed text-justify"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {member.bio}
              </p>
            </motion.div>

            {/* Achievements */}
            {member.achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <SectionTitle>Achievements</SectionTitle>
                <div className="space-y-2">
                  {member.achievements.map((ach, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Star
                        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                        style={{ color: "var(--color-highlight)" }}
                      />
                      <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                        {ach}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Relationships */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SectionTitle>Family</SectionTitle>
              <div className="space-y-2">
                {parents.length > 0 && (
                  <RelationshipGroup label="Parents" members={parents} onSelectMember={onSelectMember} />
                )}
                {spouse && (
                  <RelationshipGroup label="Spouse" members={[spouse]} onSelectMember={onSelectMember} />
                )}
                {children.length > 0 && (
                  <RelationshipGroup label="Children" members={children} onSelectMember={onSelectMember} />
                )}
              </div>
            </motion.div>

            {/* Hobbies */}
            {member.hobbies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <SectionTitle>Interests</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {member.hobbies.map((hobby) => (
                    <span
                      key={hobby}
                      className="px-2.5 py-1 rounded-lg text-xs"
                      style={{
                        background: "var(--color-bg-secondary)",
                        color: "var(--color-text-secondary)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: "var(--color-text-secondary)" } as React.CSSProperties} />
      </div>
      <div>
        <div
          className="text-[10px] uppercase tracking-wider font-semibold mb-0.5"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {label}
        </div>
        <div className="text-sm" style={{ color: "var(--color-text)" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-xs font-semibold uppercase tracking-wider mb-3"
      style={{ color: "var(--color-text-tertiary)" }}
    >
      {children}
    </h3>
  );
}

function RelationshipGroup({
  label,
  members,
  onSelectMember,
}: {
  label: string;
  members: FamilyMember[];
  onSelectMember?: (member: FamilyMember) => void;
}) {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  return (
    <div>
      <p className="text-xs mb-1.5" style={{ color: "var(--color-text-tertiary)" }}>
        {label}
      </p>
      <div className="space-y-1.5">
        {members.map((m) => (
          <div
            key={m.id}
            onClick={() => onSelectMember?.(m)}
            className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-[var(--color-border)]/50 transition-colors"
            style={{ background: "var(--color-bg-secondary)" }}
          >
            <div
              className="relative flex-shrink-0 rounded-full overflow-hidden"
              style={{
                width: 32,
                height: 32,
                border: "1.5px solid var(--color-border)",
                background: "var(--color-accent)",
              }}
            >
              {!imgErrors[m.id] ? (
                <Image
                  src={m.photo}
                  alt={m.name}
                  fill
                  className="object-cover"
                  onError={() => setImgErrors((prev) => ({ ...prev, [m.id]: true }))}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-[10px] font-bold">
                  {m.firstName[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "var(--color-text)" }}>
                {m.name}
              </p>
              <p className="text-[10px] truncate" style={{ color: "var(--color-text-tertiary)" }}>
                {m.occupation.split(",")[0]}
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--color-text-tertiary)" } as React.CSSProperties} />
          </div>
        ))}
      </div>
    </div>
  );
}
