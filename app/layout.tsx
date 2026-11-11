import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LenisProvider } from "@/components/animations/LenisProvider";
import { ScrollToTop } from "@/components/animations/ScrollToTop";
import { Navbar, Footer } from "@/components/sections";
import { siteConfig } from "@/lib/config/site";
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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "SeekKrr",
    "word of mouth for businesses",
    "travel creator collabs",
    "UGC for cafés and stays",
    "local business marketing",
    "travel creators India",
    "hidden gems in Bir",
    "creator economy travel",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.company,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.assets.ogImagePath,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    site: "@seek_krr",
    creator: "@seek_krr",
    images: [siteConfig.assets.ogImagePath],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
};

export const viewport: Viewport = {
  // Phone browsers tint their address bar this colour: the page's own, so the
  // open navbar runs straight up into it.
  themeColor: "#FDFDFD",
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
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        <LenisProvider>
          <ScrollToTop />
          <Navbar />
          <main className="relative">{children}</main>
          <Footer />
        </LenisProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: siteConfig.name,
                  url: siteConfig.url,
                  logo: `${siteConfig.url}${siteConfig.assets.logoIconLargePath}`,
                  sameAs: Object.values(siteConfig.socials),
                  contactPoint: {
                    "@type": "ContactPoint",
                    email: siteConfig.email,
                    contactType: "customer service",
                  },
                },
                {
                  "@type": "WebSite",
                  name: siteConfig.name,
                  url: siteConfig.url,
                },
                {
                  "@type": "MobileApplication",
                  name: siteConfig.name,
                  operatingSystem: "ANDROID",
                  applicationCategory: "TravelApplication",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "INR",
                  },
                  installUrl: siteConfig.playStoreUrl,
                },
              ],
            }),
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
