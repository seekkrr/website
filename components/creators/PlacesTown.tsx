"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/collabs/SafeImage";
import { CloudinaryIcons } from "@/lib/config/assets";

/*
 * Our places, at the landing site: each listed business becomes a little
 * building in "Bir town" on the meadow (a café, a stay, an adventure spot or a
 * shop, from its categories), and a rail of postcards below shows them all,
 * linking to their pages on /places.
 */

export type TrailPlace = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  categories: string[];
  photo: string | null;
  openCollabs: number;
  verified: boolean;
};

type Kind = "stay" | "food" | "adventure" | "shop";

function kindOf(p: TrailPlace): Kind {
  const c = p.categories.map((x) => x.toLowerCase());
  if (c.some((x) => x.includes("stay") || x.includes("hostel") || x.includes("hotel") || x.includes("homestay"))) return "stay";
  if (c.some((x) => x.includes("food") || x.includes("cafe") || x.includes("café") || x.includes("restaurant"))) return "food";
  if (c.some((x) => x.includes("experience") || x.includes("adventure") || x.includes("trek") || x.includes("workshop"))) return "adventure";
  return "shop";
}

const KIND_TILE: Record<Kind, string> = {
  stay: CloudinaryIcons.sleepingBag,
  food: CloudinaryIcons.coffee,
  adventure: CloudinaryIcons.balloon,
  shop: CloudinaryIcons.backpack,
};
const KIND_BG: Record<Kind, string> = { stay: "bg-theme-blue", food: "bg-theme-yellow", adventure: "bg-theme-orange", shop: "bg-[#7CC36E]" };

const WALLS = ["#8398FF", "#FECD36", "#FF8A5B", "#7CC36E", "#FFFFFF"];
const ROOFS = ["#FF5B25", "#003634", "#8398FF", "#FF5B25", "#FECD36"];

/** A little building for a place, in the site's flat, outlined style. */
export function Building({ kind, tone = 0, className = "" }: { kind: Kind; tone?: number; className?: string }) {
  const wall = WALLS[tone % WALLS.length], roof = ROOFS[tone % ROOFS.length];
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" overflow="visible">
      <ellipse cx="60" cy="116" rx="52" ry="5" fill="#000" opacity="0.15" />
      {kind === "stay" && (
        <>
          <path d="M84 30v-14h10v24" fill="#9AA0A6" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <path d="M18 60 60 22l42 38" fill={roof} stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M24 56h72v58H24Z" fill={wall} stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M33 66h16v14H33ZM71 66h16v14H71Z" fill="#FECD36" stroke="#000" strokeWidth="2.5" />
          <path d="M41 66v14M79 66v14M33 73h16M71 73h16" stroke="#000" strokeWidth="1.6" />
          <path d="M52 88h16v26H52Z" fill="#FF5B25" stroke="#000" strokeWidth="3" />
          <circle cx="64" cy="102" r="1.6" fill="#000" />
        </>
      )}
      {kind === "food" && (
        <>
          <path d="M22 48h76v66H22Z" fill={wall} stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M16 36h88l-6 18H22Z" fill="#fff" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${20 + i * 22} 36h11l-1.5 18H${22 + i * 22}Z`} fill="#FF5B25" />
          ))}
          <path d="M16 36h88l-6 18H22Z" fill="none" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <path d="M30 64h30v24H30Z" fill="#BFE3F5" stroke="#000" strokeWidth="2.5" />
          <path d="M70 76h18v38H70Z" fill="#003634" stroke="#000" strokeWidth="3" />
          <path d="M40 98h12a5 5 0 0 1 0 10H40Z" fill="#fff" stroke="#000" strokeWidth="2" />
          <path d="M44 94c0-3 2-3 2-6M49 94c0-3 2-3 2-6" stroke="#000" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      {kind === "adventure" && (
        <>
          <path d="M92 10v54" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M92 12l22 8-22 8Z" fill="#FECD36" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M14 114 52 40l38 74Z" fill={wall} stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M52 40 64 114H40Z" fill={roof} stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <path d="M52 76l8 38H44Z" fill="#000" opacity="0.85" />
          <path d="M70 114l18-30 18 30Z" fill="#7CC36E" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
        </>
      )}
      {kind === "shop" && (
        <>
          <path d="M20 44h80v70H20Z" fill={wall} stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M14 30h92v16H14Z" fill={roof} stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M30 58h26v22H30Z" fill="#BFE3F5" stroke="#000" strokeWidth="2.5" />
          <path d="M66 70h22v44H66Z" fill="#FF5B25" stroke="#000" strokeWidth="3" />
        </>
      )}
    </svg>
  );
}

/** Bir town on the landing meadow: the first few places as buildings with name signs. */
export function TownStrip({ places, go }: { places: TrailPlace[]; go: boolean }) {
  const reduce = useReducedMotion();
  if (!places.length) return null;
  return (
    <div className="flex items-end gap-2 sm:gap-4">
      {places.slice(0, 5).map((p, i) => (
        <motion.div
          key={p.id}
          className={i >= 4 ? "hidden lg:block" : i >= 2 ? "hidden sm:block" : undefined}
          initial={reduce ? false : { opacity: 0, y: 40, scale: 0.6 }}
          animate={go ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 1.4 + i * 0.15 }}
        >
          <Link
            href={`/places/${p.slug}`}
            className="group flex w-[78px] flex-col items-center focus-visible:outline-none sm:w-[112px]"
            aria-label={`${p.name}${p.openCollabs ? `, ${p.openCollabs} collabs open` : ""}`}
          >
            {p.openCollabs > 0 && (
              <span className="mb-1 whitespace-nowrap rounded-full border-2 border-black bg-theme-yellow px-2 py-px font-jakarta text-[9px] font-extrabold uppercase tracking-wide text-black sm:text-[10px]">
                {p.openCollabs} open
              </span>
            )}
            <Building kind={kindOf(p)} tone={i} className="h-auto w-full transition-transform duration-300 group-hover:-translate-y-2 group-focus-visible:-translate-y-2" />
            <span className="-mt-1 w-full truncate rounded-[8px] border-2 border-black bg-white px-1.5 py-0.5 text-center font-jakarta text-[10px] font-bold leading-tight text-black [box-shadow:2px_2px_0_#000] group-hover:bg-theme-yellow group-focus-visible:ring-[3px] group-focus-visible:ring-theme-blue sm:text-[12px]">
              {p.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

/** "Places waiting for you in Bir": a postcard for every place. */
export function PlacesRail({ places }: { places: TrailPlace[] }) {
  const reduce = useReducedMotion();
  if (!places.length) return null;
  return (
    <div className="mx-auto mt-12 w-full max-w-[1240px]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-jakarta text-[14px] font-bold uppercase tracking-[0.14em] text-black/55">You landed in Bir</p>
          <h3 className="font-handwriting text-[40px] font-bold leading-none text-black sm:text-[52px]">Places waiting for you</h3>
        </div>
        <Link
          href="/places"
          className="inline-flex items-center gap-1.5 rounded-full font-jakarta text-[15px] font-bold text-black underline decoration-theme-yellow decoration-[3px] underline-offset-4 hover:decoration-black focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
        >
          See all places <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <ul data-lenis-prevent className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 pt-2 sm:mx-0 sm:px-1">
        {places.map((p, i) => {
          const kind = kindOf(p);
          return (
            <motion.li
              key={p.id}
              className="w-[240px] shrink-0 snap-start sm:w-[270px]"
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 140, damping: 16, delay: (i % 4) * 0.08 }}
            >
              <Link
                href={`/places/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[22px] border-[3px] border-black bg-white transition-transform duration-300 hover:-translate-y-1.5 hover:[box-shadow:7px_7px_0_var(--color-yellow-accent)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue motion-reduce:transition-none"
              >
                <div className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b-[3px] border-black ${KIND_BG[kind]}`}>
                  {p.photo ? (
                    <SafeImage src={p.photo} alt="" sizes="270px" />
                  ) : (
                    <>
                      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/35" aria-hidden="true" />
                      <Building kind={kind} tone={i} className="relative h-[72%] w-auto" />
                      <div className="absolute bottom-2 left-2 h-[46px] w-[46px]" aria-hidden="true">
                        <Image src={KIND_TILE[kind]} alt="" fill className="object-contain" sizes="46px" />
                      </div>
                    </>
                  )}
                  {p.openCollabs > 0 && (
                    <span className="absolute right-2 top-2 rounded-full border-2 border-black bg-white px-2.5 py-0.5 font-jakarta text-[11px] font-extrabold text-black">
                      {p.openCollabs} {p.openCollabs === 1 ? "collab" : "collabs"} open
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <p className="font-jakarta text-[17px] font-extrabold leading-tight text-black">{p.name}</p>
                  {p.tagline && <p className="line-clamp-2 text-[13px] leading-snug text-black/65">{p.tagline}</p>}
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {p.categories.slice(0, 3).map((c) => (
                      <span key={c} className="rounded-full border-2 border-black bg-theme-beige px-2 py-px font-jakarta text-[11px] font-bold text-black">{c}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
