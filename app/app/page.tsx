import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { StoreBadges } from "@/components/collabs/StoreBadges";
import { siteConfig } from "@/lib/config/site";
import { StoreRedirect } from "./StoreRedirect";

export const metadata: Metadata = {
  title: "Get the app",
  description: `Download ${siteConfig.name} on the App Store or Google Play.`,
  alternates: { canonical: "/app" },
};

// https://seekkrr.com/app — the one link the app shares everywhere. Phones go
// straight to their store; computers see both stores and a QR code to scan.
export const dynamic = "force-dynamic";

export default async function GetAppPage() {
  const ua = (await headers()).get("user-agent") ?? "";
  // iPadOS Safari reports "Macintosh" with a "Mobile" token.
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && /mobile/i.test(ua))) redirect(siteConfig.appStoreUrl);
  if (/android/i.test(ua)) redirect(siteConfig.playStoreUrl);

  return (
    <main className="min-h-screen bg-theme-beige px-6 pb-16 pt-32 font-jakarta">
      <StoreRedirect appStoreUrl={siteConfig.appStoreUrl} playStoreUrl={siteConfig.playStoreUrl} />
      <section className="mx-auto grid max-w-[1000px] items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="inline-block rounded-full border-2 border-black bg-theme-yellow px-4 py-1 text-sm font-bold text-black">
            On iPhone &amp; Android
          </p>
          <h1 className="mt-5 text-[44px] font-extrabold leading-[1.05] text-theme-green md:text-[64px]">
            Get <span className="font-caveat text-[1.15em]">SeekKrr</span>
          </h1>
          <p className="mt-4 max-w-[30rem] text-lg text-black/70">
            Your Local Discovery Engine. Find hidden gems picked by locals, follow quests, and collab with local
            businesses as a creator.
          </p>
          <StoreBadges className="mt-8" />
        </div>

        <div className="rounded-[32px] border-[3px] border-black bg-white p-8 text-center shadow-[10px_10px_0_#FECD36]">
          <Image
            src="/assets/images/seekkrr-app-qr.svg"
            alt="QR code that opens seekkrr.com/app"
            width={240}
            height={240}
            unoptimized
            className="mx-auto h-[220px] w-[220px]"
          />
          <p className="mt-5 text-lg font-bold text-theme-green">Scan with your phone camera</p>
          <p className="mt-1 text-sm text-black/60">It opens the right store for your phone.</p>
        </div>
      </section>
    </main>
  );
}
