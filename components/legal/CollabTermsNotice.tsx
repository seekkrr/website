import type { TermsVersion } from "@/lib/collabs";

interface CollabTermsNoticeProps {
  title: string;
  points: string[];
  version: TermsVersion | null;
  /** Shown above the list, e.g. "These points summarise…" */
  intro: string;
  footer?: React.ReactNode;
}

/**
 * Plain-language summary of the collab rules plus the current terms version
 * (from GET /api/v2/terms). The app asks for re-acceptance on a version bump.
 */
export function CollabTermsNotice({ title, points, version, intro, footer }: CollabTermsNoticeProps) {
  const external = version?.url && /^https:\/\//i.test(version.url) ? version.url : null;
  return (
    <section
      aria-labelledby="collab-terms-summary"
      className="mb-8 rounded-[24px] border-[3px] border-black bg-theme-beige p-6 [box-shadow:6px_6px_0_var(--color-yellow-accent)] sm:p-8"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="collab-terms-summary" className="font-jakarta text-[22px] font-extrabold text-black sm:text-[26px]">
          {title}
        </h2>
        <span className="rounded-full border-2 border-black bg-white px-3 py-1 font-jakarta text-[13px] font-bold">
          {version ? `Current version ${version.version}` : "Versioned document"}
        </span>
      </div>
      <p className="mb-4 text-[15px] leading-relaxed text-black/75">{intro}</p>
      <ul className="flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed text-black/85 marker:text-theme-green">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <p className="mt-5 text-[14px] leading-relaxed text-black/65">
        Each version is numbered. When we publish a new one, the SeekKrr app (or the Partner Portal) asks you to
        review and accept it before your next collab, and we keep a record of when you accepted.
        {external && (
          <>
            {" "}
            <a href={external} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
              Read the full version {version?.version} document
            </a>
            .
          </>
        )}
      </p>
      {footer}
    </section>
  );
}
