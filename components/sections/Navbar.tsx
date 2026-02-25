"use client";

import Link from "next/link";
import Image from "next/image";
import cloudinaryLoader from "@/lib/cloudinaryLoader";

const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Become a creator", href: "/creators" },
    { name: "About Us", href: "/about" },
    { name: "Travel Stories", href: "/stories" },
    { name: "Contact Us", href: "/contact" },
];

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black py-4 transition-all duration-300">
            <div className="mx-auto flex w-full items-center justify-between px-6 md:px-12 lg:px-24">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3">
                    {/* Text PNG loads with default Next.js optimization from /public */}
                    <div className="relative h-10 w-32 sm:h-12 sm:w-40 transition-transform hover:scale-105">
                        <Image
                            src="/assets/images/SeekKrr_Text.png"
                            alt="SeekKrr"
                            fill
                            sizes="(max-width: 640px) 128px, 160px"
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                    {/* Icon SVG optimized via custom Cloudinary loader */}
                    <div className="relative h-10 w-10 sm:h-12 sm:w-12 transition-transform hover:scale-105">
                        <Image
                            loader={cloudinaryLoader}
                            src="v1772038022/SeekKrr_Logo_mw9777.svg"
                            alt="SeekKrr Logo"
                            fill
                            sizes="(max-width: 640px) 40px, 48px"
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>

                {/* Navigation Links (Desktop) */}
                <nav className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[15px] font-jakarta font-medium text-white/90 hover:text-[#FECD38] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#FECD38] hover:after:w-full after:transition-all"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
