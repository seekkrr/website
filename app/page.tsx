import { Navbar, HeroTripod, EarlyAccess } from "@/components/sections";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#FFFFF3]">
      {/* Hero Section */}
      <HeroTripod />

      {/* Early Access / Tools Section */}
      <EarlyAccess />
    </div>
  );
}
