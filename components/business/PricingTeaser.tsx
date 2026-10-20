import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { Reveal } from "@/components/collabs/Reveal";
import { formatInr, type Plan } from "@/lib/collabs";

interface PricingTeaserProps {
  plans: Plan[];
}

const LIFT =
  "transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export function PricingTeaser({ plans }: PricingTeaserProps) {
  const growth = plans.find((p) => p.code === "growth");
  const growthPrice = growth?.price_monthly_inr ?? 1499;
  const trialDays = growth?.trial_days ?? 14;
  const proPrice = plans.find((p) => p.code === "pro")?.price_monthly_inr ?? 3999;

  return (
    <section
      aria-labelledby="pricing-teaser-title"
      className="relative w-full bg-theme-beige px-4 py-10 sm:px-6 md:px-12 md:py-14 lg:px-24"
    >
      <Reveal className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-6 rounded-[24px] border-[3px] border-black bg-theme-yellow p-5 [box-shadow:8px_8px_0_#000] sm:p-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10 xl:rounded-[32px]">
        <div>
          <h2
            id="pricing-teaser-title"
            className="font-jakarta text-[28px] font-extrabold leading-tight tracking-tight text-black sm:text-[36px]"
          >
            Start free. Upgrade when it&apos;s working.
          </h2>
          <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-black/80 sm:text-[16px]">
            Growth adds approval mode, team seats and attribution. Pro unlocks{" "}
            <strong className="font-jakarta">AI creator matching</strong>.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {[`${trialDays}-day Growth trial`, "No card needed", "Cancel any time"].map((point) => (
              <li
                key={point}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 py-1 font-jakarta text-[13px] font-bold"
              >
                <Check className="h-3.5 w-3.5 text-theme-green" strokeWidth={3} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className={`rounded-[16px] border-[3px] border-black bg-white p-2.5 sm:p-4 ${LIFT}`}>
              <p className="font-jakarta text-[13px] font-bold text-black/60">Free</p>
              <p className="font-jakarta text-[18px] font-extrabold leading-tight sm:text-[26px]">{formatInr(0)}</p>
              <p className="text-[11px] text-black/60 sm:text-[12px]">forever</p>
            </div>
            <div className={`relative rounded-[16px] border-[3px] border-black bg-white p-2.5 [box-shadow:4px_4px_0_var(--color-orange-accent)] sm:p-4 ${LIFT}`}>
              <span className="absolute -right-2 -top-3 rotate-6 rounded-full border-2 border-black bg-theme-orange px-2 py-0.5 font-jakarta text-[10px] font-extrabold uppercase text-white sm:text-[11px]">
                Popular
              </span>
              <p className="font-jakarta text-[13px] font-bold text-black/60">Growth</p>
              <p className="font-jakarta text-[18px] font-extrabold leading-tight sm:text-[26px]">{formatInr(growthPrice)}</p>
              <p className="text-[11px] text-black/60 sm:text-[12px]">/month + GST</p>
            </div>
            <div className={`relative rounded-[16px] border-[3px] border-black bg-black p-2.5 text-white [box-shadow:4px_4px_0_var(--color-blue-accent)] sm:p-4 ${LIFT}`}>
              <span className="absolute -right-2 -top-3 inline-flex -rotate-6 items-center gap-1 rounded-full border-2 border-black bg-theme-yellow px-2 py-0.5 font-jakarta text-[10px] font-extrabold uppercase text-black sm:text-[11px]">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                AI Match
              </span>
              <p className="font-jakarta text-[13px] font-bold text-white/70">Pro</p>
              <p className="font-jakarta text-[18px] font-extrabold leading-tight sm:text-[26px]">{formatInr(proPrice)}</p>
              <p className="text-[11px] text-white/70 sm:text-[12px]">/month + GST</p>
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
