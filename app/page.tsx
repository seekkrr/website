import { Navbar, HeroTripod, EarlyAccess, BuiltForExplorers, FreedomSection, Footer } from "@/components/sections";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#FFFFF3]">
      {/* Hero Section */}
      <HeroTripod />

      {/* Early Access / Tools Section */}
      <EarlyAccess />

      {/* Built For Explorers Section */}
      <BuiltForExplorers />

      {/* Freedom Section */}
      <FreedomSection />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
