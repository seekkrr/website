import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /t/ links are tracking redirects. Claim pages (/business/claim/*) stay
        // crawlable on purpose so crawlers can see their `noindex` meta tag.
        disallow: ["/api/", "/t/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
