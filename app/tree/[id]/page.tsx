import type { Metadata } from "next";
import TreePageClient from "./TreePageClient";

export const metadata: Metadata = {
  title: "Family Tree",
  description: "Explore the Pandey family tree — 6 generations, 95 members, across 170 years of history.",
};

export default async function TreePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TreePageClient treeId={id} />;
}
