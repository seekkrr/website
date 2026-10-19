"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { Reveal } from "@/components/collabs/Reveal";
import { trackEvent } from "@/lib/analytics";
import { formatInr, type Plan } from "@/lib/collabs";
import { cn } from "@/lib/utils";
import { FEATURE_ROWS, planHighlights, type Cell } from "./planFeatures";

type Period = "monthly" | "annual";

const POPULAR = "growth";

function ctaFor(plan: Plan): { label: string; href: string } {
  if (plan.custom) return { label: "Talk to us", href: "/contact" };
  if (plan.code === "free") return { label: "Start free", href: "/business/apply?plan=free" };
  if (plan.trial_days > 0)
    return { label: `Start ${plan.trial_days}-day free trial`, href: `/business/apply?plan=${plan.code}` };
  return { label: `Choose ${plan.name}`, href: `/business/apply?plan=${plan.code}` };
}

function PriceBlock({ plan, period }: { plan: Plan; period: Period }) {
  if (plan.custom || plan.price_monthly_inr === null) {
    return (
      <div>
        <p className="font-jakarta text-[36px] font-extrabold leading-none text-black">Custom</p>
        <p className="mt-2 text-[14px] text-black/60">For groups and chains, priced per location</p>
      </div>
    );
  }
  if (plan.price_monthly_inr === 0) {
    return (
      <div>
        <p className="font-jakarta text-[40px] font-extrabold leading-none text-black">{formatInr(0)}</p>
        <p className="mt-2 text-[14px] text-black/60">Free forever, no card</p>
      </div>
    );
  }
  const annual = period === "annual" && plan.price_annual_inr !== null;
  const price = annual ? plan.price_annual_inr! : plan.price_monthly_inr;
  const inclGst = annual ? plan.price_annual_inr_incl_gst : plan.price_monthly_inr_incl_gst;
  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-1.5">
        <span className="font-jakarta text-[40px] font-extrabold leading-none text-black">{formatInr(price)}</span>
        <span className="font-jakarta text-[15px] font-bold text-black/70">/{annual ? "year" : "month"}</span>
        <span className="font-jakarta text-[13px] font-bold text-black/55">+ GST</span>
      </p>
      <p className="mt-2 text-[14px] text-black/60">
        {annual
          ? `Works out to ${formatInr(Math.round(price / 12))}/month`
          : inclGst
            ? `${formatInr(inclGst)} including 18% GST`
            : "Billed monthly"}
      </p>
    </div>
  );
}

function CellView({ cell }: { cell: Cell }) {
  if (cell.kind === "text") return <span className="font-jakarta font-bold">{cell.value}</span>;
  if (cell.value)
    return (
      <span className="inline-flex items-center">
        <Check className="h-5 w-5 text-theme-green" strokeWidth={3} aria-hidden="true" />
        <span className="sr-only">Included</span>
      </span>
    );
  if (cell.label) return <span className="text-[14px] text-black/60">{cell.label}</span>;
  return (
    <span className="inline-flex items-center">
      <Minus className="h-5 w-5 text-black/30" aria-hidden="true" />
      <span className="sr-only">Not included</span>
    </span>
  );
}

interface PricingPlansProps {
  plans: Plan[];
}

export function PricingPlans({ plans }: PricingPlansProps) {
  const [period, setPeriod] = useState<Period>("monthly");

  const changePeriod = (next: Period) => {
    setPeriod(next);
    trackEvent("pricing_toggle", { period: next });
  };

  return (
    <>
      <div className="mb-14 flex flex-col items-center gap-3">
        <SegmentedToggle<Period>
          ariaLabel="Billing period"
          value={period}
          onChange={changePeriod}
          options={[
            { value: "monthly", label: "Monthly" },
            {
              value: "annual",
              label: "Annual",
              badge: (
                <Badge variant="yellow" size="sm" className="border-black">
                  2 months free
                </Badge>
              ),
            },
          ]}
        />
        <p className="text-center text-[14px] text-black/60">
          All prices in INR and exclusive of 18% GST. GST invoices for every payment.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        {plans.map((plan, index) => {
          const popular = plan.code === POPULAR;
          const cta = ctaFor(plan);
          return (
            <Reveal as="li" key={plan.code} delay={index * 0.08} className="h-full">
              <div
                className={cn(
                  "relative flex h-full flex-col gap-6 rounded-[24px] border-[3px] border-black p-6 pt-8 xl:rounded-[32px]",
                  popular
                    ? "bg-white [box-shadow:8px_8px_0_var(--color-yellow-accent)]"
                    : "bg-theme-beige"
                )}
              >
                {popular && (
                  <Badge
                    variant="dark"
                    size="lg"
                    className="absolute -top-4 left-6 shadow-[3px_3px_0_var(--color-yellow-accent)]"
                  >
                    Most popular
                  </Badge>
                )}
                {plan.trial_days > 0 && (
                  <div
                    aria-hidden="true"
                    className="absolute -right-3 -top-6 flex h-[84px] w-[84px] rotate-12 items-center justify-center rounded-full border-[3px] border-black bg-theme-orange px-2 text-center font-jakarta text-[13px] font-extrabold leading-tight text-white shadow-[3px_3px_0_#000]"
                  >
                    {plan.trial_days}-day free trial
                  </div>
                )}
                <div>
                  <h3 className="font-jakarta text-[22px] font-extrabold text-black">{plan.name}</h3>
                  {plan.trial_days > 0 && (
                    <p className="sr-only">Includes a {plan.trial_days}-day free trial, no card needed.</p>
                  )}
                </div>
                <PriceBlock plan={plan} period={period} />
                <ul className="flex flex-col gap-2.5">
                  {planHighlights(plan).map((line) => (
                    <li key={line} className="flex items-start gap-2 text-[15px] leading-snug text-black/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-theme-green" strokeWidth={3} aria-hidden="true" />
                      {line}
                    </li>
                  ))}
                </ul>
                <Link
                  href={cta.href}
                  className={cn(
                    "mt-auto",
                    buttonVariants({ variant: popular ? "primary" : "outline", size: "md", fullWidth: true })
                  )}
                >
                  {cta.label}
                </Link>
              </div>
            </Reveal>
          );
        })}
      </ul>

      {/* Comparison: a table from md up, one accordion per plan on phones. */}
      <div className="mt-20">
        <h2 className="mb-8 text-center font-handwriting text-[44px] font-bold leading-none text-black sm:text-[56px]">
          Compare plans
        </h2>

        <div
          data-lenis-prevent
          className="relative hidden overflow-x-auto rounded-[24px] border-[3px] border-black bg-white md:block xl:rounded-[32px]"
        >
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">Feature comparison across SeekKrr for Business plans</caption>
            <thead>
              <tr className="border-b-[3px] border-black bg-theme-yellow">
                <th scope="col" className="px-5 py-4 font-jakarta text-[15px] font-bold">
                  Feature
                </th>
                {plans.map((plan) => (
                  <th key={plan.code} scope="col" className="px-4 py-4 text-center font-jakarta text-[16px] font-extrabold">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURE_ROWS.map((row, i) => (
                <tr key={row.key} className={cn("border-b border-black/10 last:border-0", i % 2 === 1 && "bg-theme-beige/60")}>
                  <th scope="row" className="px-5 py-3.5 text-[15px] font-medium text-black/85">
                    {row.label}
                  </th>
                  {plans.map((plan) => (
                    <td key={plan.code} className="px-4 py-3.5 text-center text-[15px]">
                      <CellView cell={row.render(plan)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          <Accordion
            type="multiple"
            defaultOpen={[POPULAR]}
            items={plans.map((plan) => ({
              id: plan.code,
              title: `${plan.name} · what's included`,
              content: (
                <dl className="divide-y divide-black/10">
                  {FEATURE_ROWS.map((row) => (
                    <div key={row.key} className="flex items-center justify-between gap-4 py-2.5">
                      <dt className="text-[14px] text-black/75">{row.label}</dt>
                      <dd className="shrink-0 text-right text-[14px] text-black">
                        <CellView cell={row.render(plan)} />
                      </dd>
                    </div>
                  ))}
                </dl>
              ),
            }))}
          />
        </div>
      </div>
    </>
  );
}
