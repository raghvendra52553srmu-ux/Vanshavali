import type { Metadata } from "next";
import FamilyCardClient from "./FamilyCardClient";

export const metadata: Metadata = {
  title: "Family Card",
  description: "Generate and share a beautiful Spotify Wrapped-style card for your family.",
};

export default function CardPage() {
  return <FamilyCardClient />;
}
