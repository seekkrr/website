"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { SafeImage } from "@/components/collabs/SafeImage";
import { searchPlaces, type MarkerSearchResult } from "@/lib/collabs";
import { cn } from "@/lib/utils";

export interface SelectedPlace {
  id: string;
  title: string;
  address: string;
  region_id: string;
}

interface PlaceSearchProps {
  inputId: string;
  selected: SelectedPlace | null;
  onSelect: (place: SelectedPlace | null) => void;
  error?: string;
}

type Status = "idle" | "loading" | "done" | "error";

const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;

/** Combobox that searches approved SeekKrr places by name or address. */
export function PlaceSearch({ inputId, selected, onSelect, error }: PlaceSearchProps) {
  const listId = useId();
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MarkerSearchResult[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controller = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      controller.current?.abort();
    },
    []
  );

  const runSearch = (q: string) => {
    controller.current?.abort();
    const ac = new AbortController();
    controller.current = ac;
    setStatus("loading");
    searchPlaces(q, ac.signal)
      .then((items) => {
        if (ac.signal.aborted) return;
        setResults(items);
        setStatus("done");
        setActive(items.length ? 0 : -1);
      })
      .catch((err: unknown) => {
        if (ac.signal.aborted || (err instanceof DOMException && err.name === "AbortError")) return;
        setResults([]);
        setStatus("error");
      });
  };

  const onChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    if (timer.current) clearTimeout(timer.current);
    if (value.trim().length < MIN_CHARS) {
      controller.current?.abort();
      setResults([]);
      setStatus("idle");
      return;
    }
    timer.current = setTimeout(() => runSearch(value.trim()), DEBOUNCE_MS);
  };

  const choose = (place: MarkerSearchResult) => {
    onSelect({
      id: place.id,
      title: place.title,
      address: [place.address, place.region_name].filter(Boolean).join(" · "),
      region_id: place.region_id ?? "",
    });
    setOpen(false);
    setQuery("");
    setResults([]);
    setStatus("idle");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (results.length ? (i + 1) % results.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : -1));
    } else if (e.key === "Enter") {
      if (open && active >= 0 && results[active]) {
        e.preventDefault();
        choose(results[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  if (selected) {
    return (
      <div className="flex items-start justify-between gap-3 rounded-xl border-[3px] border-black bg-theme-yellow/40 p-4">
        <div className="flex min-w-0 items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-theme-green" aria-hidden="true" />
          <div className="min-w-0">
            <p className="font-jakarta text-[16px] font-bold text-black">{selected.title}</p>
            {selected.address && <p className="text-[14px] text-black/70">{selected.address}</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="shrink-0 rounded-full border-2 border-black bg-white px-3 py-1 font-jakarta text-[13px] font-bold hover:bg-theme-beige focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
        >
          Change
        </button>
      </div>
    );
  }

  const showList = open && query.trim().length >= MIN_CHARS && status !== "idle";
  const describedBy = [error ? errorId : null, hintId].filter(Boolean).join(" ");

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/50" aria-hidden="true" />
        <input
          id={inputId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && active >= 0 ? `${listId}-opt-${active}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          value={query}
          placeholder="Search by name or street, e.g. Garden Café Bir"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className={cn(
            "h-12 w-full rounded-xl border-2 border-black/80 bg-theme-beige pl-11 pr-11 text-[16px] text-black outline-none transition-[border-color,box-shadow] placeholder:text-black/40",
            "focus:border-black focus-visible:ring-[3px] focus-visible:ring-theme-yellow",
            error && "border-red-600"
          )}
        />
        {status === "loading" && (
          <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-black/50" aria-hidden="true" />
        )}
        {status !== "loading" && query && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-black/60 hover:bg-black/5 hover:text-black"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <p id={hintId} className="mt-1.5 text-[13px] text-black/60">
        Already on the SeekKrr map? Claim it so creators find you instantly.
      </p>
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-[13px] font-medium text-red-700">
          {error}
        </p>
      )}

      <div aria-live="polite" className="sr-only">
        {status === "done" && showList
          ? results.length
            ? `${results.length} places found`
            : "No places found"
          : ""}
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Matching places"
          data-lenis-prevent
          className="absolute left-0 right-0 top-[52px] z-30 max-h-[320px] overflow-y-auto overscroll-contain rounded-xl border-[3px] border-black bg-white p-1.5 shadow-[6px_6px_0_var(--color-yellow-accent)]"
        >
          {status === "loading" && results.length === 0 && (
            <li className="px-3 py-3 text-[14px] text-black/60" role="presentation">
              Searching places…
            </li>
          )}
          {status === "error" && (
            <li className="px-3 py-3 text-[14px] text-red-700" role="presentation">
              Search isn&apos;t responding right now. Paste a Google Maps link instead.
            </li>
          )}
          {status === "done" && results.length === 0 && (
            <li className="px-3 py-3 text-[14px] text-black/70" role="presentation">
              No SeekKrr places match &ldquo;{query.trim()}&rdquo;. Switch to &ldquo;Paste a Google
              Maps link&rdquo; and we&apos;ll add you to the map.
            </li>
          )}
          {results.map((place, index) => (
            <li
              key={place.id}
              id={`${listId}-opt-${index}`}
              role="option"
              aria-selected={index === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(place)}
              onMouseEnter={() => setActive(index)}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2",
                index === active ? "bg-theme-yellow/50" : "hover:bg-theme-beige"
              )}
            >
              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 border-black bg-theme-yellow">
                {place.image ? (
                  <SafeImage src={place.image} alt="" sizes="44px" />
                ) : (
                  <MapPin className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-jakarta text-[15px] font-bold text-black">{place.title}</span>
                <span className="block truncate text-[13px] text-black/60">
                  {[place.address, place.region_name].filter(Boolean).join(" · ") || place.categories.join(", ")}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
