import { NextResponse, type NextRequest } from "next/server";

// Place links the app shares: https://seekkrr.com/m/<place-name>-<id>
// (and /markers/<id>, which earlier builds shared).
//
// With the app installed the OS opens the place in the app -- iOS universal
// links via public/.well-known/apple-app-site-association, Android App Links
// via public/.well-known/assetlinks.json -- and this handler never runs.
// Everyone else used to land on a 404; send them to /app, which forwards a
// phone to its own store and shows a computer both stores and a QR code.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await params;
  return NextResponse.redirect(new URL("/app", request.url), 302);
}
