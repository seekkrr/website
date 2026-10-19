import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { Reveal } from "@/components/collabs/Reveal";
import { formatInr, type Plan } from "@/lib/collabs";

interface PricingTeaserProps {
  plans: Plan[];
}

export function PricingTeaser({ plans }: PricingTeaserProps) {
  const free = plans.find((p) => p.code === "free");
  const growth = plans.find((p) => p.code === "growth");
  const growthPrice = growth?.price_monthly_inr ?? 1499;
  const trialDays = growth?.trial_days ?? 14;

  return (
    <section
      aria-labelledby="pricing-teaser-title"
      className="relative w-full bg-theme-beige px-4 py-16 sm:px-6 md:px-12 lg:px-24"
    >
      <Reveal className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-8 rounded-[24px] border-[3px] border-black bg-theme-yellow p-6 [box-shadow:8px_8px_0_#000] sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:gap-12 xl:rounded-[32px]">
        <div>
          <h2
            id="pricing-teaser-title"
            className="font-jakarta text-[30px] font-extrabold leading-tight tracking-tight text-black sm:text-[38px]"
          >
            Start free. Upgrade when it&apos;s working.
          </h2>
          <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-black/80 sm:text-[17px]">
            Free gives you {free?.entitlements.active_collabs ?? 1} active collab and{" "}
            {free?.entitlements.redemptions_per_month ?? 5} redemptions a month. Growth adds
            approval mode, advance visit requests, team seats and SeekKrr Match.
          </p>
          <ul className="mt-5 flex flex-col gap-2">
            {[`${trialDays}-day Growth trial, no card needed`, "Prices shown + GST, with GST invoices", "Cancel any time"].map(
              (point) => (
                <li key={point} className="flex items-center gap-2 font-jakarta text-[15px] font-semibold">
                  <Check className="h-4 w-4 text-theme-green" strokeWidth={3} aria-hidden="true" />
                  {point}
                </li>
              )
            )}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[18px] border-[3px] border-black bg-white p-4">
              <p className="font-jakarta text-[14px] font-bold text-black/60">Free</p>
              <p className="font-jakarta text-[28px] font-extrabold leading-tight">{formatInr(0)}</p>
              <p className="text-[13px] text-black/60">forever</p>
            </div>
            <div className="rounded-[18px] border-[3px] border-black bg-white p-4 [box-shadow:4px_4px_0_var(--color-orange-accent)]">
              <p className="font-jakarta text-[14px] font-bold text-black/60">Growth</p>
              <p className="font-jakarta text-[28px] font-extrabold leading-tight">{formatInr(growthPrice)}</p>
              <p className="text-[13px] text-black/60">/month + GST</p>
            </div>
          </div>
          <Link href="/business/pricing" className={buttonVariants({ variant: "primary", size: "lg", fullWidth: true })}>
            See all plans
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
