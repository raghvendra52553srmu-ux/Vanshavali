import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CommandPalette from "@/components/layout/CommandPalette";
import LoadingScreen from "@/components/layout/LoadingScreen";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Vanshavali — Preserving Families. Connecting Generations.",
    template: "%s | Vanshavali",
  },
  description:
    "Vanshavali is a premium digital platform to build, share, and preserve your family tree. Connect generations, tell your family's story, and create a lasting legacy.",
  keywords: [
    "family tree",
    "genealogy",
    "vanshavali",
    "family history",
    "heritage",
    "Indian genealogy",
    "family legacy",
    "ancestors",
  ],
  authors: [{ name: "Vanshavali Technologies" }],
  creator: "Vanshavali Technologies Pvt. Ltd.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vanshavali.in",
    siteName: "Vanshavali",
    title: "Vanshavali — Preserving Families. Connecting Generations.",
    description:
      "Build, share, and preserve your family tree with Vanshavali. The most elegant way to connect generations.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vanshavali — Family Tree Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vanshavali — Family Tree Platform",
    description:
      "Preserve your family's story. Connect generations with Vanshavali.",
    images: ["/og-image.png"],
    creator: "@vanshavali",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <LoadingScreen />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CommandPalette />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: "var(--font-body)",
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
