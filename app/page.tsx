import { Metadata } from "next";
import { HeroTripod, EarlyAccess, BuiltForExplorers, WhatYouGet, FreedomSection, TheSeekKrrWay, TravelWithSeekKrr } from "@/components/sections";
import { siteConfig } from "@/lib/config/site";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Quest Travel App for Explorers`,
  description:
    "SeekKrr is the premier quest travel app. Transform your journeys into extraordinary adventures with gamified quests, exploration challenges, and a community of creators.",
  keywords: [
    "quest travel app",
    "adventure games",
    "gamified travel experience",
    "travel quest platform",
    "exploration app",
    "experiential travel app",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-theme-beige">
      <StructuredData
        type="SoftwareApplication"
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: siteConfig.name,
          operatingSystem: "Android",
          applicationCategory: "TravelApplication",
          description:
            "SeekKrr is the ultimate quest travel app. Transform your journeys into extraordinary adventures with gamified quests, exploration challenges, and a community of creators.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
          },
          downloadUrl: siteConfig.playStoreUrl,
          installUrl: siteConfig.playStoreUrl,
          featureList:
            "Quest-based travel, Gamified exploration, Creator economy, AR challenges, Community quests",
          screenshot: `${siteConfig.url}/assets/images/og-image.png`,
        }}
      />
      {/* Hero Section */}
      <HeroTripod />

      {/* Early Access / Tools Section */}
      <EarlyAccess />

      {/* The SeekKrr Way Section */}
      <TheSeekKrrWay />

      {/* Built For Explorers Section */}
      <BuiltForExplorers />

      {/* What You Get Section */}
      <WhatYouGet />

      {/* Freedom Section */}
      <FreedomSection />

      {/* Travel With SeekKrr — Bird Orbit */}
      <TravelWithSeekKrr />
    </div>
  );
}
