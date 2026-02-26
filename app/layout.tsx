import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LenisProvider } from "@/components/animations/LenisProvider";
import { Navbar } from "@/components/sections";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SeekKrr — Discover Your Next Adventure",
    template: "%s | SeekKrr",
  },
  description:
    "SeekKrr connects explorers with extraordinary quests and unforgettable experiences. Discover, create, and share adventures that push your boundaries.",
  keywords: [
    "adventure",
    "quests",
    "exploration",
    "experiences",
    "creators",
    "seekkrr",
  ],
  authors: [{ name: "SeekKrr" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SeekKrr",
    title: "SeekKrr — Discover Your Next Adventure",
    description:
      "Connect with extraordinary quests and unforgettable experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SeekKrr — Discover Your Next Adventure",
    description:
      "Connect with extraordinary quests and unforgettable experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${plusJakarta.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background font-sans antialiased text-white"
        suppressHydrationWarning
      >
        <LenisProvider>
          <Navbar />
          <main className="relative">{children}</main>
        </LenisProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
