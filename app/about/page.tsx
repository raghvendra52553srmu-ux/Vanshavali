import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the mission and team behind Vanshavali — Preserving Families, Connecting Generations.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
