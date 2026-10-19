import { NextResponse, type NextRequest } from "next/server";
import { getPublicBusinesses, recordTrackingClick } from "@/lib/collabs";
import { siteConfig } from "@/lib/config/site";

// Creator tracking links: https://seekkrr.com/t/<code>
// Records the click server-side (so the API sees the visitor's IP/UA, not
// Vercel's), then sends the visitor on:
//   - Android -> Play Store, with the code in the install referrer
//   - iOS     -> App Store
//   - desktop -> the business page on the website (or the directory)
//   - unknown code -> home
// When the app is installed, the OS opens seekkrr.com/t/<code> in the app via
// universal/app links before this handler runs, so mobile visitors who reach
// it most likely need the store.
export const dynamic = "force-dynamic";

const CODE_RE = /^[A-Za-z0-9_-]{3,64}$/;

function platformOf(ua: string): "android" | "ios" | "mobile" | "desktop" {
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && /mobile/i.test(ua))) return "ios";
  if (/mobile/i.test(ua)) return "mobile";
  return "desktop";
}

function storeUrl(platform: ReturnType<typeof platformOf>, code: string) {
  if (platform === "android") {
    const url = new URL(siteConfig.playStoreUrl);
    url.searchParams.set("referrer", `utm_source=seekkrr&utm_medium=creator_link&ref=${code}`);
    return url.toString();
  }
  if (platform === "ios") return siteConfig.appStoreUrl;
  return siteConfig.appDownloadUrl;
}

function clientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip")?.trim() || null;
  return ip ? ip.slice(0, 64) : null;
}

async function businessSlug(businessId: string) {
  if (!businessId) return null;
  const page = await getPublicBusinesses({ page_size: 60 });
  return page?.items.find((b) => b.id === businessId)?.slug ?? null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const redirectTo = (target: string) => NextResponse.redirect(new URL(target, request.url), 302);

  if (!CODE_RE.test(code)) return redirectTo("/");

  const ua = request.headers.get("user-agent") ?? "";
  const platform = platformOf(ua);

  let click: Awaited<ReturnType<typeof recordTrackingClick>>;
  try {
    click = await recordTrackingClick(code, { client_ip: clientIp(request), user_agent: ua.slice(0, 400) || null });
  } catch {
    // API unreachable: don't strand the visitor; the click just isn't counted.
    return redirectTo(platform === "desktop" ? "/places" : storeUrl(platform, code));
  }

  if (!click) return redirectTo("/");
  if (platform !== "desktop") return redirectTo(storeUrl(platform, code));

  const slug = await businessSlug(click.business_id);
  return redirectTo(slug ? `/places/${slug}` : "/places");
}
