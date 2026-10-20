import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small Jakarta line above the handwritten title (e.g. "So your café can"). */
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Optional supporting paragraph under the title. */
  intro?: ReactNode;
  align?: "center" | "left";
  stars?: boolean;
  as?: "h1" | "h2";
  id?: string;
  className?: string;
}

/** Eyebrow + Caveat headline pattern used across the creator page sections. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  stars = false,
  as: Tag = "h2",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-1.5 md:mb-8",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="font-jakarta text-[16px] font-medium text-black md:text-[20px] lg:text-[22px]">
          {eyebrow}
        </p>
      )}
      <div className="relative inline-flex items-start gap-2">
        <Tag
          id={id}
          className="font-handwriting text-[40px] font-bold leading-[0.95] text-black drop-shadow-sm sm:text-[48px] md:text-[56px] lg:text-[64px] text-balance"
        >
          {title}
        </Tag>
        {stars && (
          <Image
            src="/assets/images/Stars.svg"
            alt=""
            aria-hidden="true"
            width={36}
            height={44}
            className="mt-1 hidden h-auto w-7 shrink-0 sm:block md:w-9"
          />
        )}
      </div>
      {intro && (
        <p
          className={cn(
            "mt-1 max-w-[600px] font-sans text-[15px] leading-relaxed text-black/75 md:text-[17px]",
            align === "center" && "mx-auto"
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
