import type { Metadata } from "next";
import Image from "next/image";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
    title: "About",
    description:
        `Learn about ${siteConfig.name} — the platform connecting explorers with extraordinary quests and unforgettable experiences.`,
};

const SketchUnderline = ({ className }: { className?: string }) => (
    <svg
        className={className}
        width="100%"
        height="13"
        viewBox="0 0 304 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
    >
        <path d="M2.5 7.5C50.5 4.5 150.5 1.5 301.5 5.5" stroke="black" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

import { profiles } from "@/lib/data/profiles";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-theme-beige font-jakarta pt-32 pb-24 px-6 overflow-hidden">
            <AnimatedSection className="max-w-6xl mx-auto">
                <h1 className="text-center text-5xl md:text-6xl font-extrabold text-black mb-16 tracking-tight">
                    About Us
                </h1>

                {/* Mission / Goal Box */}
                <div className="border-[2px] border-black rounded-xl w-full max-w-[860px] mx-auto py-12 px-6 md:px-12 text-center bg-white shadow-sm mb-12">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 text-black tracking-wide">Who are we?</h2>
                    <p className="font-handwriting text-3xl md:text-[2.5rem] mb-12 [text-shadow:2px_2px_0_#FECD36]">
                        Corporates and Solo Travellers
                    </p>

                    <h2 className="text-xl md:text-2xl font-bold mb-6 text-black tracking-wide">Our Goal</h2>

                    <div className="flex flex-col items-center gap-6">
                        <p className="font-handwriting text-3xl md:text-[2.5rem] tracking-wide [text-shadow:2px_2px_0px_#8398FF]">
                            To replace the{" "}
                            <span className="relative inline-block">
                                Fear of Unknown
                                <SketchUnderline className="absolute -bottom-3 left-0 right-0 w-[105%] -ml-[2.5%]" />
                            </span>
                        </p>

                        <p className="font-handwriting text-3xl md:text-[2.5rem] tracking-wide mt-2" style={{ textShadow: "2px 2px 0px #8398FF" }}>
                            with the{" "}
                            <span className="relative inline-block">
                                Thrill of Discovery
                                <SketchUnderline className="absolute -bottom-3 left-0 right-0 w-[105%] -ml-[2.5%]" />
                            </span>
                        </p>
                    </div>
                </div>

                {/* Team Profiles */}
                <div className="w-full max-w-[860px] mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10 md:gap-4 lg:gap-0 mb-12">
                    {profiles.map((profile, i) => (
                        <AnimatedSection
                            key={profile.name}
                            className="flex flex-col items-center"
                            delay={0.1 * (i + 1)}
                        >
                            {/* Profile Image Wrap */}
                            <div className="relative w-[150px] h-[150px] md:w-[160px] md:h-[160px] lg:w-[170px] lg:h-[170px] mb-4 md:mb-5 hover:-translate-y-1 transition-transform duration-300">
                                <Image
                                    src={profile.image}
                                    alt={`${profile.name} Photo`}
                                    fill
                                    sizes="(max-width: 768px) 150px, (max-width: 1024px) 160px, 170px"
                                    className="object-contain"
                                />
                            </div>

                            {/* Info Box */}
                            <div
                                className="border border-black rounded-2xl bg-[#FFFFF3] py-5 px-6 w-[260px] h-auto flex flex-col justify-center items-center"
                                style={{ boxShadow: `4px 4px 0px 0px ${profile.shadowColor}` }}
                            >
                                <h3 className="text-[22px] font-normal mb-2 text-black">{profile.name}</h3>
                                <p className="text-[14px] text-zinc-700 leading-[1.4] font-light text-center">
                                    "{profile.quote}"
                                </p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>

                {/* Dear Reader Letter */}
                <AnimatedSection className="-mt-10 mb-10 max-w-4xl mx-auto flex justify-center" delay={0.4}>
                    <div className="relative w-full max-w-[700px] aspect-[4/3] rounded-lg overflow-hidden flex justify-center items-center group">
                        <Image
                            src="https://res.cloudinary.com/seekkrr/image/upload/v1772307241/dear_reader_co3mu3.png"
                            alt="Letter to the Reader"
                            fill
                            sizes="(max-width: 768px) 100vw, 700px"
                            className="object-contain group-hover:scale-[1.02] transition-transform duration-500 will-change-transform"
                        />
                    </div>
                </AnimatedSection>
            </AnimatedSection>
        </div>
    );
}
