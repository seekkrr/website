import { HeroTripod, EarlyAccess, BuiltForExplorers, WhatYouGet, FreedomSection, TheSeekKrrWay, TravelWithSeekKrr } from "@/components/sections";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-theme-beige">
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
