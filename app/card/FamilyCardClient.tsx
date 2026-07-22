"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Share2, Download, QrCode, MapPin, Users, GitBranch, TreePine, Sparkles } from "lucide-react";
import { toPng } from "html-to-image";
import { familyData } from "@/data/family";
import { useSonner } from "@/hooks/useSonner";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";

const LIVING_MEMBERS = familyData.members.filter((m) => m.isAlive);
const CITIES = [...new Set(familyData.members.map((m) => m.city))].slice(0, 5);

export default function FamilyCardClient() {
  const { toast } = useSonner();
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Card link copied!", "Share it with your family.");
  };

  const handleDownload = useCallback(() => {
    if (cardRef.current === null) {
      return;
    }
    toast("Preparing download...", "Please wait.");
    
    toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `family-card-${familyData.familyName.toLowerCase()}.png`;
        link.href = dataUrl;
        link.click();
        toast("Download successful!", "Your family card has been saved.");
      })
      .catch((err) => {
        console.error("Failed to download image", err);
        toast("Download failed", "An error occurred while saving the card.");
      });
  }, [toast]);

  return (
    <div
      className="min-h-screen pt-24 pb-24"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            Family Card
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl font-light mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            Your family&apos;s{" "}
            <span className="text-gradient italic">story in a card</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Share your family legacy beautifully — like Spotify Wrapped, but for generations.
          </motion.p>
        </motion.div>

        {/* THE CARD */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          ref={cardRef}
          className="relative rounded-3xl overflow-hidden mx-auto"
          style={{
            maxWidth: 480,
            background: "linear-gradient(145deg, #3d2218 0%, #6D4C41 40%, #4a3028 70%, #1e110a 100%)",
            boxShadow: "0 40px 80px rgba(28,28,28,0.3), 0 16px 40px rgba(109,76,65,0.3)",
          }}
        >
          {/* Texture overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 20%, rgba(200,169,126,0.8) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(109,76,65,0.8) 0%, transparent 50%)`,
            }}
          />

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, var(--color-highlight) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />

          <div className="relative z-10 p-8">
            {/* Top: Brand + Year */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <TreePine className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white/80 text-xs font-semibold tracking-wider uppercase">
                  Vanshavali
                </span>
              </div>
              <span
                className="text-xs text-white/50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {familyData.established} – 2024
              </span>
            </div>

            {/* Family Name */}
            <div className="mb-8">
              <h2
                className="text-5xl font-light text-white mb-1 leading-none"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                The {familyData.familyName}
              </h2>
              <h2
                className="text-5xl font-light text-white/30 leading-none"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Family
              </h2>
            </div>

            {/* Motto */}
            <div
              className="mb-8 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <p className="text-white/60 text-[10px] uppercase tracking-widest font-semibold mb-1">Motto</p>
              <p className="text-white/90 text-sm italic" style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }}>
                {familyData.motto}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: "Members", value: familyData.members.length, icon: Users },
                { label: "Generations", value: familyData.totalGenerations, icon: GitBranch },
                { label: "Cities", value: CITIES.length, icon: MapPin },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl p-3.5 text-center"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  <Icon className="w-4 h-4 text-white/50 mx-auto mb-1.5" />
                  <div
                    className="text-2xl font-bold text-white mb-0.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {value}
                  </div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Member Avatars */}
            <div className="mb-8">
              <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold mb-3">
                Living Members
              </p>
              <div className="flex flex-wrap gap-2">
                {LIVING_MEMBERS.map((m) => (
                  <div
                    key={m.id}
                    className="relative"
                    style={{ width: 40, height: 40 }}
                    title={m.name}
                  >
                    <div
                      className="w-full h-full rounded-full overflow-hidden"
                      style={{
                        border: "1.5px solid rgba(255,255,255,0.2)",
                        background: "rgba(255,255,255,0.1)",
                      }}
                    >
                      {!imgErrors[m.id] ? (
                        <Image
                          src={m.photo}
                          alt={m.name}
                          width={40}
                          height={40}
                          className="object-cover rounded-full"
                          onError={() =>
                            setImgErrors((prev) => ({ ...prev, [m.id]: true }))
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                          {m.firstName[0]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Origin */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold mb-1">
                  Origin
                </p>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-white/50" />
                  <p className="text-white/80 text-sm">{familyData.origin}</p>
                </div>
              </div>

              {/* QR Placeholder */}
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <QrCode className="w-8 h-8 text-white/40" />
              </div>
            </div>

            {/* Bottom: Sparkle */}
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-white/30" />
              <span className="text-white/30 text-xs">Generated by Vanshavali</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-3 mt-8"
        >
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium border transition-colors"
            style={{
              color: "var(--color-text)",
              borderColor: "var(--color-border)",
              background: "var(--color-card)",
            }}
          >
            <Share2 className="w-4 h-4" />
            Share Card
          </motion.button>
          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "var(--color-accent)" }}
          >
            <Download className="w-4 h-4" />
            Download PNG
          </motion.button>
        </motion.div>

        {/* Info below card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-10 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <p>
            Want to customize your card?{" "}
            <a
              href="/#pricing"
              className="underline transition-colors"
              style={{ color: "var(--color-accent)" }}
            >
              Upgrade to Heritage plan
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
