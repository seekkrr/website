import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Use a fixed date for static routes to avoid unnecessary re-crawling
  const lastModified = new Date("2026-03-24T00:00:00.000Z");

  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/creators",
    "/stories",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutes];
}
