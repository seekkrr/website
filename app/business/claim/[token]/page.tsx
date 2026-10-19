import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ExternalLink, MapPin, ShieldCheck, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { OpenInAppButton } from "@/components/collabs/OpenInAppButton";
import { SafeImage } from "@/components/collabs/SafeImage";
import { StoreBadges } from "@/components/collabs/StoreBadges";
import { getClaimPreview, type ClaimPreview } from "@/lib/collabs";
import { siteConfig } from "@/lib/config/site";

// One-time, expiring links: always render fresh and keep them out of search.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Claim your business",
  description: "Claim your SeekKrr business listing in the app.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const TOKEN_RE = /^[A-Za-z0-9_-]{8,256}$/;

function formatExpiry(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-theme-beige px-4 pb-20 pt-32 sm:px-6 md:px-12 lg:px-24">
      <div className="mx-auto w-full max-w-[720px]">{children}</div>
    </div>
  );
}

function ExpiredState() {
  return (
    <Shell>
      <div className="rounded-[24px] border-[3px] border-black bg-white px-6 py-10 text-center shadow-[8px_8px_0_var(--color-orange-accent)] sm:px-12">
        <h1 className="mb-4 font-jakarta text-[26px] font-extrabold tracking-tight text-black sm:text-[32px]">
          This claim link has expired or was already used
        </h1>
        <p className="mb-8 text-[16px] leading-relaxed text-black/75">
          Claim links work once and only for a limited time. Ask your SeekKrr contact to send a fresh one,
          or apply to list your business and we&apos;ll get you set up.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/business/apply" className={buttonVariants({ variant: "primary" })}>
            List your business
          </Link>
          <a href={`mailto:${siteConfig.email}?subject=New%20claim%20link`} className={buttonVariants({ variant: "outline" })}>
            Email support
          </a>
        </div>
      </div>
    </Shell>
  );
}

function BusinessPreview({ preview }: { preview: ClaimPreview }) {
  const cover = preview.business.photos[0] ?? preview.business.logo_url;
  return (
    <div className="overflow-hidden rounded-[24px] border-[3px] border-black bg-white [box-shadow:8px_8px_0_var(--color-yellow-accent)] xl:rounded-[32px]">
      <div className="relative aspect-[16/9] border-b-[3px] border-black bg-theme-yellow">
        {cover && <SafeImage src={cover} alt={preview.business.name} sizes="(max-width: 768px) 100vw, 720px" priority />}
      </div>
      <div className="flex flex-col gap-3 p-5 sm:p-7">
        <h2 className="font-jakarta text-[24px] font-extrabold leading-tight text-black sm:text-[28px]">
          {preview.business.name}
        </h2>
        {preview.business.tagline && <p className="text-[16px] text-black/70">{preview.business.tagline}</p>}
        <div className="flex flex-wrap gap-2">
          {preview.business.region_name && (
            <Badge variant="yellow">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {preview.business.region_name}
            </Badge>
          )}
          {preview.business.categories.slice(0, 4).map((c) => (
            <Badge key={c} variant="outline">
              {c}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ClaimPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!TOKEN_RE.test(token)) return <ExpiredState />;

  const preview = await getClaimPreview(token);
  if (!preview) return <ExpiredState />;

  const expires = formatExpiry(preview.expires_at);
  const deepLink = `${siteConfig.appScheme}claim/${encodeURIComponent(token)}`;

  if (preview.already_claimed) {
    return (
      <Shell>
        <div className="mb-8 text-center">
          <h1 className="font-handwriting text-[44px] font-bold leading-none text-black sm:text-[56px]">
            Already claimed
          </h1>
        </div>
        <BusinessPreview preview={preview} />
        <div className="mt-8 rounded-[24px] border-[3px] border-black bg-white p-6 text-center sm:p-8">
          <p className="text-[16px] leading-relaxed text-black/75">
            Someone has already claimed this listing. If that was you, sign in to the app or the Partner
            Portal with the same account. If it wasn&apos;t, email{" "}
            <a href={`mailto:${siteConfig.email}`} className="font-semibold underline underline-offset-2">
              {siteConfig.email}
            </a>{" "}
            and we&apos;ll sort it out.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <OpenInAppButton deepLink={deepLink}>Open SeekKrr</OpenInAppButton>
            <a href={siteConfig.partnerPortalUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline" })}>
              Partner Portal <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-8 text-center">
        <p className="font-jakarta text-[18px] font-medium text-black md:text-[22px]">Your listing is ready</p>
        <h1 className="mt-2 font-handwriting text-[44px] font-bold leading-none text-black sm:text-[60px]">
          Claim your business
        </h1>
      </div>

      <BusinessPreview preview={preview} />

      <div className="mt-8 rounded-[24px] border-[3px] border-black bg-white p-6 sm:p-8 xl:rounded-[32px]">
        <h2 className="font-jakarta text-[20px] font-bold text-black">How claiming works</h2>
        <ol className="mt-4 flex flex-col gap-4">
          <li className="flex items-start gap-3">
            <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-theme-green" aria-hidden="true" />
            <p className="text-[15px] leading-relaxed text-black/80">
              Open this link in the SeekKrr app and sign in, or create a free account.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-theme-green" aria-hidden="true" />
            <p className="text-[15px] leading-relaxed text-black/80">
              {preview.requires_phone_verification ? (
                <>
                  Verify the business phone number in the app
                  {preview.phone_hint ? (
                    <>
                      {" "}
                      (<span className="font-jakarta font-bold">{preview.phone_hint}</span>)
                    </>
                  ) : null}
                  . We&apos;ll text a one-time code to that number.
                </>
              ) : (
                <>Confirm the claim in the app. The listing moves to your account straight away.</>
              )}
            </p>
          </li>
          <li className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-theme-green" aria-hidden="true" />
            <p className="text-[15px] leading-relaxed text-black/80">
              {expires ? (
                <>
                  This link works once and expires on <span className="font-jakarta font-bold">{expires} IST</span>.
                </>
              ) : (
                "This link works once and expires soon."
              )}
            </p>
          </li>
        </ol>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <OpenInAppButton deepLink={deepLink} size="lg">
            Open in the SeekKrr app to claim
          </OpenInAppButton>
        </div>
        <p className="mt-3 text-[13px] text-black/60">
          Claiming needs phone verification, so it happens in the app. Don&apos;t have it yet? Download it
          below, then tap this link again.
        </p>

        <div className="mt-6 border-t-2 border-dashed border-black/15 pt-6">
          <StoreBadges />
          <p className="mt-4 text-[13px] text-black/60">
            After claiming, manage collabs, team and billing from the{" "}
            <a href={siteConfig.partnerPortalUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
              Partner Portal
            </a>
            .
          </p>
        </div>
      </div>
    </Shell>
  );
}
