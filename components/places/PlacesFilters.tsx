"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import type { BusinessCategory } from "@/lib/collabs";

interface Option {
  value: string;
  label: string;
}

interface PlacesFiltersProps {
  regions: Option[];
  /** Predefined place categories with their sub-categories (API or static fallback). */
  categories: BusinessCategory[];
  current: { region?: string; category?: string; q?: string };
}

/** True when `value` is one of the catalog's categories or sub-categories. */
function inCatalog(categories: BusinessCategory[], value: string) {
  return categories.some((c) => c.name === value || c.sub_categories.includes(value));
}

function buildHref(values: { region?: string; category?: string; q?: string }) {
  const params = new URLSearchParams();
  if (values.q?.trim()) params.set("q", values.q.trim().slice(0, 100));
  if (values.region) params.set("region", values.region);
  if (values.category) params.set("category", values.category);
  const s = params.toString();
  return s ? `/places?${s}` : "/places";
}

/**
 * Directory filters. Works as a plain GET form without JavaScript; with JS it
 * navigates client-side and applies select changes immediately. Filters live
 * in the URL, so every view is shareable.
 */
export function PlacesFilters({ regions, categories, current }: PlacesFiltersProps) {
  const router = useRouter();
  const id = useId();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(current.q ?? "");
  const [region, setRegion] = useState(current.region ?? "");
  const [category, setCategory] = useState(current.category ?? "");

  const go = (next: { region?: string; category?: string; q?: string }) => {
    startTransition(() => router.push(buildHref(next), { scroll: false }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    go({ q, region, category });
  };

  return (
    <form
      method="get"
      action="/places"
      role="search"
      aria-label="Filter places"
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-3 rounded-[24px] border-[3px] border-black bg-white p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[1.4fr_1fr_1fr_auto] xl:rounded-[32px]"
    >
      <div className="relative sm:col-span-2 lg:col-span-1">
        <label htmlFor={`${id}-q`} className="sr-only">
          Search places
        </label>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/50" aria-hidden="true" />
        <input
          id={`${id}-q`}
          name="q"
          type="search"
          value={q}
          maxLength={100}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name"
          className="h-12 w-full rounded-xl border-2 border-black/80 bg-theme-beige pl-11 pr-4 text-[16px] text-black outline-none placeholder:text-black/40 focus:border-black focus-visible:ring-[3px] focus-visible:ring-theme-yellow"
        />
      </div>
      <div>
        <label htmlFor={`${id}-region`} className="sr-only">
          Region
        </label>
        <Select
          id={`${id}-region`}
          name="region"
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            go({ q, region: e.target.value, category });
          }}
        >
          <option value="">All regions</option>
          {regions.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label htmlFor={`${id}-category`} className="sr-only">
          Category
        </label>
        <Select
          id={`${id}-category`}
          name="category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            go({ q, region, category: e.target.value });
          }}
        >
          <option value="">All categories</option>
          {/* Keep an unknown value from the URL selectable rather than silently showing "All". */}
          {category && !inCatalog(categories, category) && <option value={category}>{category}</option>}
          {/* The backend matches a category or a sub-category, so both are valid values. */}
          {categories.map((c) => (
            <optgroup key={c.name} label={c.name}>
              <option value={c.name}>{c.sub_categories.length > 0 ? `All ${c.name}` : c.name}</option>
              {c.sub_categories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </div>
      <Button type="submit" variant="primary" className="h-12 sm:col-span-2 lg:col-span-1" aria-busy={pending}>
        {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Search className="h-5 w-5" aria-hidden="true" />}
        Search
      </Button>
    </form>
  );
}
