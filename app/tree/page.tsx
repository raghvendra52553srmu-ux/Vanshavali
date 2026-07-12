import type { Metadata } from "next";
import TreePageClient from "./TreePageClient";

export const metadata: Metadata = {
  title: "Family Tree",
  description: "Explore the Pandey family tree — 6 generations, 95 members, across 170 years of history.",
};

export default function TreePage() {
  return <TreePageClient />;
}
