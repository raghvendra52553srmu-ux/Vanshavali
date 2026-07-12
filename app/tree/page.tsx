import type { Metadata } from "next";
import TreePageClient from "./TreePageClient";

export const metadata: Metadata = {
  title: "Family Tree",
  description: "Explore the Sharma family tree — 5 generations, 15 members, across 140 years of history.",
};

export default function TreePage() {
  return <TreePageClient />;
}
