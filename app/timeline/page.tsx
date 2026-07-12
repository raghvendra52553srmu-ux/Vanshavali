import type { Metadata } from "next";
import TimelinePageClient from "./TimelinePageClient";

export const metadata: Metadata = {
  title: "Family Timeline",
  description: "Explore 140 years of the Sharma family's history — births, marriages, achievements, and milestones.",
};

export default function TimelinePage() {
  return <TimelinePageClient />;
}
