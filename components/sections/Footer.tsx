"use client";

import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-black text-white px-6 md:px-12 py-4 md:py-8">
            <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4 border-t border-gray-800 pt-8">

                {/* Left: Branding & Copyright */}
                <div className="flex flex-col items-center md:items-start gap-3">
                    <div className="flex flex-col">
                        <span className="font-jakarta text-[24px] font-bold text-white tracking-tight">SeekKrr</span>
                    </div>
                    <p className="font-jakarta text-gray-400 text-[14px] text-center md:text-left pt-1">
                        2026 <span className="mx-1">|</span> &copy; SoloQuest Pvt. Ltd. <span className="mx-1">|</span> All rights reserved.
                    </p>
                </div>

                {/* Center: Legal Links */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 font-jakarta text-[14px] md:text-[15px]">
                    <Link href="/terms" className="text-gray-300 hover:text-[#FECD38] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#FECD38] hover:after:w-full after:transition-all">
                        Terms and Conditions
                    </Link>
                    <Link href="/privacy" className="text-gray-300 hover:text-[#FECD38] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#FECD38] hover:after:w-full after:transition-all">
                        Privacy Policy
                    </Link>
                </div>

                {/* Right: Social Media Icons */}
                <div className="flex items-center gap-4">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2.5 rounded-full bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:border-transparent transition-all duration-300">
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2.5 rounded-full bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:bg-[#0077B5] hover:border-transparent transition-all duration-300">
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="p-2.5 rounded-full bg-gray-900 border border-gray-800 text-gray-300 hover:text-black hover:bg-white hover:border-transparent transition-all duration-300">
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>
                </div>

            </div>
        </footer>
    );
}
