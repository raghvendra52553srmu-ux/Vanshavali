import type { Metadata } from "next";
import TimelinePageClient from "./TimelinePageClient";

export const metadata: Metadata = {
  title: "Family Timeline",
  description: "Explore 170 years of the Pandey family's history — births, marriages, achievements, and milestones.",
};

export default function TimelinePage() {
  return <TimelinePageClient />;
}
