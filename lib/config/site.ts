// Partner/Creator Portal (separate app): Google sign-in, the business and creator
// sign-up forms, and the business dashboard. Override per environment with
// NEXT_PUBLIC_PARTNER_PORTAL_URL (inlined at build time); no trailing slash.
const partnerPortalUrl = (
  process.env.NEXT_PUBLIC_PARTNER_PORTAL_URL?.trim() || "https://creator.seekkrr.com"
).replace(/\/+$/, "");

// The public address of this deployment. It ends up in the page's absolute URLs (link
// previews, canonical, sitemap), and WhatsApp fetches the preview image from the
// og:image URL in the page. So a non-production site must name itself, not production:
// set NEXT_PUBLIC_SITE_URL (inlined at build time, no trailing slash) on dev, for
// example https://dev.seekkrr.com. Production needs nothing.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://seekkrr.com").replace(/\/+$/, "");

export const siteConfig = {
  name: "SeekKrr",
  company: "SOLOQUEST PRIVATE LIMITED",
  address: "Rajrooppur, Allahabad",
  postalCode: "211011",
  jurisdiction: "Uttar Pradesh, India",
  disputeLocation: "Allahabad, Uttar Pradesh, India",
  email: "support@seekkrr.com",
  phone: "+91 9310785883",
  url: siteUrl,
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.seekkrr.app",
  appStoreUrl: "https://apps.apple.com/in/app/seekkrr/id6813190942",
  // The /app page: iOS -> App Store, Android -> Play Store, desktop -> both stores and a QR code.
  appDownloadUrl: "https://seekkrr.com/app",
  partnerPortalUrl,
  appScheme: "seekkrr://",
  termsLastUpdated: "February 23, 2026",
  privacyLastUpdated: "February 9, 2026",
  refundLastUpdated: "April 4, 2026",
  creatorPayoutLink: "/creator-terms",
  creatorTermsLink: "/creator-terms",
  businessTermsLink: "/business-terms",
  // The line used in browser tab titles, link previews and the mobile menu.
  tagline: "Word of Mouth for Businesses, Powered by Creators",
  description:
    "Local cafés, stays and adventures host travel creators, and their stories get people talking. Clear briefs, verified check-ins and no cold DMs.",
  assets: {
    logoTextPath: "/assets/images/SeekKrr_Text.png",
    // The round Seekकर mountain logo (navbar). The browser tab and home-screen
    // icons are app/favicon.ico, app/icon.png and app/apple-icon.png.
    logoIconPath: "/assets/images/logo-round.png",
    logoIconLargePath: "/assets/images/icon-512.png",
    // Link-preview image (1200x630): the round logo on yellow. Bump ?v= whenever the
    // image changes, so WhatsApp and others fetch the new one instead of a cached copy.
    ogImagePath: "/assets/images/og-image.png?v=6",
  },
  socials: {
    whatsapp: "https://chat.whatsapp.com/FZxZgnAoDdc2GpiXTW2ZWS",
    instagram: "https://www.instagram.com/seek_krr",
    linkedin: "https://www.linkedin.com/company/seekkrr",
    twitter: "https://x.com/seek_krr",
  },
};

/**
 * Product switches for features that are hidden for now but coming back.
 * Flip one to true to bring it back everywhere on the site.
 */
export const siteFeatures: Readonly<{
  /** Plans and pricing: /business/pricing, the pricing teaser, plan badges and "free" copy. */
  plans: boolean;
  /** AI creator matching (SeekKrr Match): the explainer section, "AI Match" badges and copy. */
  matchmaking: boolean;
  /** The #collab / #ad / #gifted label on UGC briefs and the builder's label picker. */
  disclosureLabel: boolean;
}> = {
  plans: false,
  matchmaking: false,
  disclosureLabel: false,
};

/** Fixed Partner Portal routes the website hands visitors off to. */
export const portalLinks = {
  /** Business sign-up: Google sign-in, phone, then business details. */
  businessApply: `${partnerPortalUrl}/business/apply`,
  /** Business dashboard for listings that already exist. */
  business: `${partnerPortalUrl}/business`,
  /** Creator sign-up: Google sign-in, then details. */
  creatorApply: `${partnerPortalUrl}/creator/apply`,
} as const;
