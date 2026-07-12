import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Vanshavali team for support, feedback, or inquiries.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
