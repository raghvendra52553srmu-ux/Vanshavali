import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import DemoTreeSection from "@/components/home/DemoTreeSection";
import PricingSection from "@/components/home/PricingSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Vanshavali — Preserving Families. Connecting Generations.",
  description:
    "Build, share, and preserve your family tree with Vanshavali — the most elegant genealogy platform for Indian families.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <FeaturesSection />
      <DemoTreeSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </>
  );
}
