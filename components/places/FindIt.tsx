import { MapPin, Navigation } from "lucide-react";
import { OpenInAppButton } from "@/components/collabs/OpenInAppButton";
import { Reveal } from "@/components/collabs/Reveal";
import { SectionTitle } from "@/components/places/PlaceSections";
import { directionsUrl, formatCoordinates } from "@/components/places/placeData";
import { markerDeepLink, type BusinessPlace } from "@/lib/collabs";

/** A stylised, key-free "map": streets, a river, contour lines and a pin. */
function MapArt({ label, seed }: { label: string; seed: number }) {
  // Nudge the street angle per place so every page's map looks a little different.
  const tilt = (seed % 7) - 3;
  return (
    <div aria-hidden="true" className="relative h-[200px] overflow-hidden border-b-[3px] border-black bg-[#F3F0DC] sm:h-[240px]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 240" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={`map-dots-${seed}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#003634" opacity="0.12" />
          </pattern>
        </defs>
        <rect width="640" height="240" fill={`url(#map-dots-${seed})`} />
        {/* contour lines */}
        <g fill="none" stroke="#003634" strokeOpacity="0.12" strokeWidth="1.5">
          <path d="M-20 60 C 80 20, 160 90, 260 50 S 420 10, 520 40 S 640 80, 680 50" />
          <path d="M-20 82 C 90 44, 170 112, 270 74 S 430 34, 530 64 S 640 104, 680 74" />
          <path d="M-20 104 C 100 68, 180 134, 280 98 S 440 58, 540 88 S 640 128, 680 98" />
        </g>
        {/* parks */}
        <rect x="430" y="150" width="120" height="70" rx="18" fill="#CFE5C8" stroke="#003634" strokeOpacity="0.25" strokeWidth="2" />
        <rect x="40" y="20" width="90" height="60" rx="16" fill="#CFE5C8" stroke="#003634" strokeOpacity="0.25" strokeWidth="2" />
        {/* river */}
        <path
          d="M-20 200 C 90 170, 170 230, 280 196 S 470 150, 660 182"
          fill="none"
          stroke="#8398FF"
          strokeOpacity="0.55"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* streets */}
        <g transform={`rotate(${tilt} 320 120)`} stroke="#ffffff" strokeLinecap="round">
          <g strokeWidth="12">
            <path d="M-40 130 L 680 112" />
            <path d="M220 -20 L 250 260" />
            <path d="M470 -20 L 430 260" />
          </g>
          <g stroke="#000" strokeOpacity="0.14" strokeWidth="2" fill="none">
            <path d="M-40 124 L 680 106" />
            <path d="M-40 136 L 680 118" />
          </g>
          <g strokeWidth="6" strokeOpacity="0.9">
            <path d="M-40 60 L 680 48" />
            <path d="M100 -20 L 120 260" />
            <path d="M580 -20 L 560 260" />
          </g>
        </g>
      </svg>
      {/* pin + label */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-[85%] flex-col items-center">
        <span className="mb-2 max-w-[220px] truncate rounded-full border-2 border-black bg-white px-3 py-1 font-jakarta text-[13px] font-extrabold text-black shadow-[2px_2px_0_#000]">
          {label}
        </span>
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full rounded-br-none border-[3px] border-black bg-theme-orange shadow-[3px_3px_0_#000] [transform:rotate(45deg)]">
          <span className="h-4 w-4 rounded-full border-[3px] border-black bg-white" />
        </span>
        <span className="mt-2 h-2 w-8 rounded-full bg-black/20 blur-[1px]" />
      </div>
    </div>
  );
}

function seedOf(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

function PlaceLocation({ place }: { place: BusinessPlace }) {
  const directions = directionsUrl(place);
  return (
    <article className="overflow-hidden rounded-[24px] border-[3px] border-black bg-white [box-shadow:6px_6px_0_var(--color-blue-accent)] xl:rounded-[32px]">
      <MapArt label={place.title} seed={seedOf(place.id)} />
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="min-w-0">
          <h3 className="font-jakarta text-[20px] font-extrabold leading-tight text-black">{place.title}</h3>
          {(place.address || place.region_name) && (
            <p className="mt-1.5 flex items-start gap-1.5 text-[15px] leading-snug text-black/70">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{[place.address, place.region_name].filter(Boolean).join(" · ")}</span>
            </p>
          )}
          {place.coordinates && (
            <p className="mt-1.5 font-mono text-[12px] tracking-wide text-black/50">
              {formatCoordinates(place.coordinates)}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {directions && (
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-black bg-theme-yellow px-5 py-2 font-jakarta text-[14px] font-bold text-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
            >
              <Navigation className="h-4 w-4" aria-hidden="true" /> Directions
              <span className="sr-only"> to {place.title} (Google Maps, opens in a new tab)</span>
            </a>
          )}
          <OpenInAppButton deepLink={markerDeepLink(place.id)} size="sm">
            Open in app
          </OpenInAppButton>
        </div>
      </div>
    </article>
  );
}

/** "Find it" (one place) or "Locations" (several). */
export function FindIt({ places }: { places: BusinessPlace[] }) {
  if (places.length === 0) return null;
  return (
    <Reveal y={20}>
      <section aria-labelledby="find-it-title">
        <SectionTitle id="find-it-title" kicker="getting there">
          {places.length === 1 ? "Find it" : "Locations"}
        </SectionTitle>
        <ul className="flex flex-col gap-6">
          {places.map((place) => (
            <li key={place.id}>
              <PlaceLocation place={place} />
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}
