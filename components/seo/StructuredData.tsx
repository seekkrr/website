import { siteConfig } from "@/lib/config/site";

interface BreadcrumbItem {
  name: string;
  item: string;
}

export function StructuredData({
  type = "BreadcrumbList",
  data,
}: {
  type?: string;
  data?: BreadcrumbItem[] | object;
}) {
  let schemaData = data;

  if (type === "BreadcrumbList" && Array.isArray(data)) {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      numberOfItems: data.length,
      itemListElement: (data as BreadcrumbItem[]).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${siteConfig.url}${item.item}`,
      })),
    };
  }

  if (!schemaData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
