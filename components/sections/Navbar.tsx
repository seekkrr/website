"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronRight, Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

// The logo links home, so "Home" only appears in the compact menu.
const NAV_LINKS = [
    { name: "About", href: "/about" },
    { name: "Stories", href: "/stories" },
    { name: "Places", href: "/places" },
    { name: "Creators", href: "/creators" },
    { name: "Contact", href: "/contact" },
];

const MENU_LINKS = [
    { name: "Home", href: "/" },
    { name: "About us", href: "/about" },
    { name: "Travel stories", href: "/stories" },
    { name: "Places", href: "/places" },
    { name: "Become a creator", href: "/creators" },
    { name: "Contact us", href: "/contact" },
];

const BUSINESS = { name: "For Business", href: "/business" };

function isActive(pathname: string, href: string) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

// Whether the page has scrolled away from the top. Re-renders only when that flips.
const subscribeToScroll = (onChange: () => void) => {
    window.addEventListener("scroll", onChange, { passive: true });
    return () => window.removeEventListener("scroll", onChange);
};
const useScrolled = () =>
    useSyncExternalStore(subscribeToScroll, () => window.scrollY > 8, () => false);

export function Navbar() {
    const pathname = usePathname() ?? "/";
    // The menu remembers the path it was opened on, so any navigation closes it
    // without a state-syncing effect.
    const [openOn, setOpenOn] = useState<string | null>(null);
    const isOpen = openOn === pathname;
    const close = () => setOpenOn(null);
    const reduceMotion = useReducedMotion();
    const panelRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        // Focus moves into the menu when it opens.
        panelRef.current?.querySelector<HTMLElement>("a")?.focus();
        // Escape closes and returns focus to the toggle.
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpenOn(null);
                toggleRef.current?.focus();
            }
        };
        // The compact menu doesn't exist from `lg` up: close it if the viewport grows.
        const desktop = window.matchMedia("(min-width: 1024px)");
        const onDesktop = (e: MediaQueryListEvent) => {
            if (e.matches) setOpenOn(null);
        };
        window.addEventListener("keydown", onKey);
        desktop.addEventListener("change", onDesktop);
        return () => {
            window.removeEventListener("keydown", onKey);
            desktop.removeEventListener("change", onDesktop);
        };
    }, [isOpen]);

    const businessActive = isActive(pathname, BUSINESS.href);
    // No bar at the top of the page; once it scrolls (or the menu opens) a frosted
    // sheet slides in behind the links so they stay readable over the content.
    const solid = useScrolled() || isOpen;

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50"
            onBlur={(e) => {
                // Tabbing out of the open menu (to the page behind it) closes it. A null
                // relatedTarget (click on plain text, window blur) leaves it open.
                const next = e.relatedTarget as Node | null;
                if (isOpen && next && !e.currentTarget.contains(next)) close();
            }}
        >
            {/* the sheet sits on the bar itself, above the menu's dimmed backdrop */}
            <div
                className={cn(
                    "relative z-50 mx-auto flex w-full items-center justify-between gap-6 px-4 sm:px-6 md:px-10 xl:px-24 py-2 sm:py-3",
                    "transition-[background-color,box-shadow,backdrop-filter] duration-300 motion-reduce:transition-none",
                    solid
                        ? "bg-[rgba(253,253,253,0.8)] shadow-[0_1px_0_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150"
                        : "bg-transparent",
                )}
            >
                <Link href="/" onClick={close} className="flex shrink-0 items-center rounded-full" aria-label={`${siteConfig.name} home`}>
                    <div className="relative h-12 w-12 rounded-full sm:h-14 sm:w-14 transition-transform hover:scale-105">
                        <Image
                            src={siteConfig.assets.logoIconPath}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 48px, 56px"
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop */}
                <nav aria-label="Main" className="hidden lg:flex items-center gap-7 xl:gap-9">
                    {NAV_LINKS.map((link) => {
                        const active = isActive(pathname, link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "relative text-[15px] font-jakarta font-medium transition-colors hover:text-black",
                                    "after:absolute after:-bottom-1 after:left-0 after:h-[3px] after:rounded-full after:bg-theme-yellow after:transition-all",
                                    active ? "text-black font-semibold after:w-full" : "text-black/70 after:w-0 hover:after:w-full",
                                )}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                    <Link
                        href={BUSINESS.href}
                        aria-current={businessActive ? "page" : undefined}
                        className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-theme-yellow px-4 py-2 text-[14px] font-jakarta font-bold text-black shadow-[3px_3px_0_0_#000] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[4px_5px_0_0_#000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                        {BUSINESS.name}
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </Link>
                </nav>

                {/* Phones & tablets */}
                <button
                    ref={toggleRef}
                    type="button"
                    className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full text-black transition-colors hover:bg-black/5"
                    onClick={() => setOpenOn(isOpen ? null : pathname)}
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? "site-menu" : undefined}
                >
                    {isOpen ? <X size={26} aria-hidden /> : <Menu size={26} aria-hidden />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.button
                            type="button"
                            aria-label="Close menu"
                            tabIndex={-1}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.2 }}
                            onClick={close}
                            className="lg:hidden fixed inset-0 z-40 cursor-default bg-black/40"
                        />
                        <motion.div
                            id="site-menu"
                            ref={panelRef}
                            data-lenis-prevent
                            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                            transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
                            className="lg:hidden absolute right-3 left-3 sm:left-auto sm:right-6 md:right-10 top-full z-50 mt-2 sm:w-[360px] max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-[24px] border-[3px] border-black bg-theme-beige p-3 shadow-[6px_6px_0_0_#FECD36]"
                        >
                            <nav aria-label="Main" className="flex flex-col">
                                {MENU_LINKS.map((link) => {
                                    const active = isActive(pathname, link.href);
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={close}
                                            aria-current={active ? "page" : undefined}
                                            className={cn(
                                                "flex items-center justify-between rounded-2xl px-4 py-3 text-[17px] font-jakarta font-semibold text-black transition-colors",
                                                active ? "bg-theme-yellow" : "hover:bg-black/5 focus-visible:bg-black/5",
                                            )}
                                        >
                                            {link.name}
                                            <ChevronRight className="h-4 w-4 text-black/40" aria-hidden />
                                        </Link>
                                    );
                                })}
                            </nav>
                            <Link
                                href={BUSINESS.href}
                                onClick={close}
                                aria-current={businessActive ? "page" : undefined}
                                className="mt-3 flex items-center justify-between rounded-2xl bg-black px-4 py-3.5 text-white transition-transform hover:-translate-y-0.5"
                            >
                                <span>
                                    <span className="block text-[17px] font-jakarta font-bold">{BUSINESS.name}</span>
                                    <span className="block text-[13px] text-white/70">List your place and meet travel creators</span>
                                </span>
                                <ArrowUpRight className="h-5 w-5 text-theme-yellow" aria-hidden />
                            </Link>
                            <p className="mt-3 px-4 pb-1 text-center font-handwriting text-[20px] text-theme-green">
                                {siteConfig.tagline}
                            </p>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
