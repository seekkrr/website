"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import cloudinaryLoader from "@/lib/cloudinaryLoader";

const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Become a creator", href: "/creators" },
    { name: "About Us", href: "/about" },
    { name: "Travel Stories", href: "/stories" },
    { name: "Contact Us", href: "/contact" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black transition-all duration-300">
            <div className="mx-auto flex w-full items-center justify-between px-6 md:px-12 lg:px-24 py-4">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 z-50" onClick={() => setIsOpen(false)}>
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
                <nav className="hidden lg:flex items-center gap-8">
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

                {/* Hamburger Toggle (Mobile/Tablet) */}
                <button
                    className="lg:hidden flex items-center justify-center p-2 text-white hover:text-[#FECD38] transition-colors z-50"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden lg:hidden"
                    >
                        <nav className="flex flex-col items-center gap-8 mt-16 w-full px-6">
                            {NAV_LINKS.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-[24px] sm:text-[32px] font-jakarta font-semibold text-white hover:text-[#FECD38] transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[3px] after:bg-[#FECD38] hover:after:w-full after:transition-all overflow-hidden"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>

                        {/* Optional decorative element at the bottom of menu */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute bottom-12 text-[#FECD38] font-handwriting text-[24px]"
                        >
                            Discover Your Next Adventure
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
