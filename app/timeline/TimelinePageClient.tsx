"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Baby, Heart, Trophy, Globe, Star, Calendar } from "lucide-react";
import { timelineEvents } from "@/data/timeline";
import { TimelineEvent } from "@/types/family";

const TYPE_CONFIG: Record<
  TimelineEvent["type"],
  { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; bg: string; label: string }
> = {
  birth: { icon: Baby, color: "#3C7A57", bg: "rgba(60,122,87,0.1)", label: "Birth" },
  death: { icon: Star, color: "#999", bg: "rgba(150,150,150,0.1)", label: "Passed Away" },
  marriage: { icon: Heart, color: "#C84C4C", bg: "rgba(200,76,76,0.1)", label: "Marriage" },
  achievement: { icon: Trophy, color: "#C8A97E", bg: "rgba(200,169,126,0.12)", label: "Achievement" },
  event: { icon: Globe, color: "#6D4C41", bg: "rgba(109,76,65,0.1)", label: "Event" },
  migration: { icon: Globe, color: "#A1887F", bg: "rgba(161,136,127,0.1)", label: "Migration" },
};

function TimelineItem({ event, index, isLeft }: {
  event: TimelineEvent; index: number; isLeft: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const config = TYPE_CONFIG[event.type];
  const Icon = config.icon;

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-6 mb-12 ${
        isLeft ? "flex-row-reverse text-right" : "flex-row"
      } md:!flex-row md:!text-left`}
    >
      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? 30 : -30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex-1 min-w-0"
        style={{ maxWidth: "calc(50% - 40px)" }}
      >
        <div
          className="p-5 rounded-2xl border hover:shadow-md transition-shadow"
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Type Badge */}
          <div className={`flex items-center gap-2 mb-3 ${isLeft ? "justify-end md:justify-start" : ""}`}>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
              style={{ background: config.bg, color: config.color }}
            >
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
            {event.location && (
              <span
                className="text-[10px]"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                {event.location}
              </span>
            )}
          </div>

          <h3
            className="text-base font-semibold mb-2 leading-snug"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)", fontSize: "1.05rem" }}
          >
            {event.title}
          </h3>

          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {event.description}
          </p>

          {event.memberName && (
            <div
              className="mt-3 text-xs"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {event.memberName}
            </div>
          )}
        </div>
      </motion.div>

      {/* Center node */}
      <div className="flex flex-col items-center flex-shrink-0 z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
          className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-md"
          style={{ background: config.bg, borderColor: config.color }}
        >
          <Icon className="w-4 h-4" style={{ color: config.color } as React.CSSProperties} />
        </motion.div>

        {/* Year label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="mt-2 text-xs font-bold text-center"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)", minWidth: 60 }}
        >
          {event.year}
        </motion.div>
      </div>

      {/* Right spacer on mobile */}
      <div className="flex-1 hidden md:block" />
    </div>
  );
}

export default function TimelinePageClient() {
  return (
    <div
      className="min-h-screen pt-24 pb-24"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-6"
            style={{
              background: "rgba(109,76,65,0.08)",
              color: "var(--color-accent)",
            }}
          >
            <Calendar className="w-3 h-3" />
            1882 – 2024
          </div>
          <h1
            className="text-5xl sm:text-6xl font-light mb-4 leading-tight"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            The Sharma Family
            <br />
            <span className="text-gradient italic">through time</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            140 years of births, marriages, achievements, and milestones — every milestone that
            shaped who we are today.
          </p>
        </motion.div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {Object.entries(TYPE_CONFIG).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <span
                key={type}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{
                  background: config.bg,
                  color: config.color,
                  border: `1px solid ${config.color}30`,
                }}
              >
                <Icon className="w-3 h-3" />
                {config.label}
              </span>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center vertical line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
            style={{ background: "var(--color-border)" }}
          />

          {/* Events */}
          <div>
            {timelineEvents.map((event, i) => (
              <TimelineItem
                key={event.id}
                event={event}
                index={i}
                isLeft={i % 2 === 0}
              />
            ))}
          </div>

          {/* End marker */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center mt-4"
          >
            <div
              className="w-4 h-4 rounded-full border-2"
              style={{
                background: "var(--color-accent)",
                borderColor: "var(--color-accent)",
              }}
            />
            <p
              className="text-xs mt-3"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              The story continues…
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
