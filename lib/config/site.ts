// Partner/Creator Portal (separate app): Google sign-in, the business and creator
// sign-up forms, and the business dashboard. Override per environment with
// NEXT_PUBLIC_PARTNER_PORTAL_URL (inlined at build time); no trailing slash.
const partnerPortalUrl = (
  process.env.NEXT_PUBLIC_PARTNER_PORTAL_URL?.trim() || "https://creator.seekkrr.com"
).replace(/\/+$/, "");

export const siteConfig = {
  name: "SeekKrr",
  company: "SOLOQUEST PRIVATE LIMITED",
  address: "Rajrooppur, Allahabad",
  postalCode: "211011",
  jurisdiction: "Uttar Pradesh, India",
  disputeLocation: "Allahabad, Uttar Pradesh, India",
  email: "support@seekkrr.com",
  phone: "+91 9310785883",
  url: "https://seekkrr.com",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.seekkrr.app",
  appStoreUrl: "https://apps.apple.com/in/app/seekkrr/id6813190942",
  // Backend smart link: iOS -> App Store, Android -> Play Store, desktop -> chooser.
  appDownloadUrl: "https://api.seekkrr.com/api/v2/app",
  partnerPortalUrl,
  appScheme: "seekkrr://",
  termsLastUpdated: "February 23, 2026",
  privacyLastUpdated: "February 9, 2026",
  refundLastUpdated: "April 4, 2026",
  creatorPayoutLink: "/creator-terms",
  creatorTermsLink: "/creator-terms",
  businessTermsLink: "/business-terms",
  tagline: "Discover Your Next Adventure",
  description:
    "SeekKrr is the ultimate quest travel app. Transform your journeys into extraordinary adventures with gamified quests, exploration challenges, and a community of creators.",
  assets: {
    logoTextPath: "/assets/images/SeekKrr_Text.png",
  },
  socials: {
    whatsapp: "https://chat.whatsapp.com/FZxZgnAoDdc2GpiXTW2ZWS",
    instagram: "https://www.instagram.com/seek_krr",
    linkedin: "https://www.linkedin.com/company/seekkrr",
    twitter: "https://x.com/seek_krr",
  },
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
