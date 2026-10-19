"use client";

import { useEffect, useRef } from "react";
import { Check, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { StoreBadges } from "@/components/collabs/StoreBadges";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

interface ApplySuccessProps {
  businessName?: string;
  email?: string;
  hasCollab?: boolean;
  onStartAnother?: () => void;
}

export function ApplySuccess({ businessName, email, hasCollab, onStartAnother }: ApplySuccessProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const timeline = [
    {
      title: "Application received",
      body: email
        ? `We'll write to ${email} as soon as you're verified.`
        : "We'll email you as soon as you're verified.",
      done: true,
    },
    {
      title: "Verification in 24–48 hours",
      body: "We check your place and socials, and may call the number you gave us to confirm it's really you.",
    },
    {
      title: "Download the app and set your redeem code",
      body: "Sign in with the same email, open the Business hub from your profile and choose the 4-digit code your staff will use.",
    },
    {
      title: "Post your first collab",
      body: hasCollab
        ? "Your collab idea from the builder is saved with your application. Publish it from the app or the Partner Portal."
        : "Publish it from the app or the Partner Portal, where you'll also find requests, redemptions and content.",
    },
  ];

  return (
    <div className="rounded-[24px] border-[3px] border-black bg-white p-6 [box-shadow:8px_8px_0_var(--color-yellow-accent)] sm:p-10 xl:rounded-[32px]">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-black bg-theme-yellow">
          <Check className="h-8 w-8" strokeWidth={3} aria-hidden="true" />
        </span>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-handwriting text-[44px] font-bold leading-none text-black outline-none sm:text-[56px]"
        >
          You&apos;re on the map!
        </h2>
        <p className="mt-3 max-w-[520px] text-[16px] leading-relaxed text-black/75 sm:text-[17px]">
          {businessName ? (
            <>
              Thanks for applying with <strong className="font-jakarta">{businessName}</strong>.
            </>
          ) : (
            "Thanks for applying."
          )}{" "}
          Here&apos;s what happens next.
        </p>
      </div>

      <ol className="relative mx-auto flex max-w-[560px] flex-col gap-6">
        {timeline.map((item, index) => (
          <li key={item.title} className="relative flex gap-4">
            {index < timeline.length - 1 && (
              <span aria-hidden="true" className="absolute left-[19px] top-10 h-[calc(100%-8px)] w-[3px] bg-black/15" />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-black font-jakarta text-[16px] font-extrabold",
                item.done ? "bg-theme-green text-theme-beige" : "bg-theme-beige text-black"
              )}
            >
              {item.done ? <Check className="h-5 w-5" strokeWidth={3} /> : index + 1}
            </span>
            <div className="pt-1.5">
              <h3 className="font-jakarta text-[17px] font-bold text-black">{item.title}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-black/70">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-10 flex max-w-[560px] flex-col items-center gap-5 border-t-2 border-dashed border-black/20 pt-8">
        <p className="font-jakarta text-[16px] font-bold">Get the SeekKrr app</p>
        <StoreBadges align="center" />
        <a
          href={siteConfig.partnerPortalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "md" })}
        >
          Open the Partner Portal
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
        {onStartAnother && (
          <button
            type="button"
            onClick={onStartAnother}
            className="text-[14px] font-medium text-black/60 underline underline-offset-4 hover:text-black"
          >
            Apply for another business
          </button>
        )}
      </div>
    </div>
  );
}
