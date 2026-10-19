import Link from "next/link";
import { Reveal } from "@/components/collabs/Reveal";

interface CtaStripProps {
  title?: string;
  cta?: string;
  href?: string;
}

/** Black pill call-to-action, matching the "Register Now" strip on /creators. */
export function CtaStrip({
  title = "Ready to host your first creator?",
  cta = "List your business",
  href = "/business/apply",
}: CtaStripProps) {
  return (
    <section className="relative w-full bg-theme-beige px-4 pb-20 pt-6 sm:px-6 md:px-12 lg:px-24">
      <Reveal className="mx-auto flex w-full max-w-fit flex-col items-center justify-center gap-4 rounded-[32px] bg-black px-6 py-6 text-center text-white shadow-2xl sm:flex-row sm:gap-8 sm:rounded-[40px] sm:px-10 sm:py-5 md:px-12">
        <h2 className="font-jakarta text-[20px] font-semibold tracking-tight sm:text-[24px] lg:text-[28px]">
          {title}
        </h2>
        <Link
          href={href}
          className="shrink-0 rounded-[12px] border-[3px] border-black bg-white px-6 py-2.5 font-jakarta text-[16px] font-bold text-black transition-all duration-200 [box-shadow:3px_3px_0_var(--color-blue-accent)] hover:-translate-y-1 hover:[box-shadow:6px_6px_0_var(--color-blue-accent)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-yellow motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:text-[18px]"
        >
          {cta}
        </Link>
      </Reveal>
    </section>
  );
}
