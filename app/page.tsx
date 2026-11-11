import { Metadata } from "next";
import { HeroWhisperChain, EarlyAccess, BuiltForExplorers, WhatYouGet, FreedomSection, TheSeekKrrWay, TravelWithSeekKrr } from "@/components/sections";
import { siteConfig } from "@/lib/config/site";
import { StructuredData } from "@/components/seo/StructuredData";
import { PartnerWall } from "@/components/business/PartnerWall";

const description = siteConfig.description;

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description,
  keywords: [
    "word of mouth for businesses",
    "travel creator collabs",
    "UGC for cafés and stays",
    "hidden gems in Bir",
    "Bir Billing cafés and stays",
    "travel app India",
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
          operatingSystem: "Android, iOS",
          applicationCategory: ["TravelApplication"],
          description,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
          },
          downloadUrl: siteConfig.playStoreUrl,
          installUrl: siteConfig.playStoreUrl,
          featureList:
            "Places picked by locals, Map of cafés, stays and adventures, Stories from travel creators, Collabs between creators and local businesses, Reviewed listings",
          screenshot: `${siteConfig.url}/assets/images/og-image.png`,
        }}
      />
      {/* Hero Section: the whisper chain, one creator visit passed along until someone books */}
      <HeroWhisperChain />

      {/* Early Access / Tools Section */}
      <EarlyAccess />

      {/* The SeekKrr Way Section */}
      <TheSeekKrrWay />

      {/* Built For Explorers Section */}
      <BuiltForExplorers />

      {/* What You Get Section */}
      <WhatYouGet />

      {/* Partner wall: featured SeekKrr businesses (hidden when there are none) */}
      <PartnerWall />

      {/* Freedom Section */}
      <FreedomSection />

      {/* Travel With SeekKrr — Bird Orbit */}
      <TravelWithSeekKrr />
    </div>
  );
}
