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
  data?: any;
}) {
  let schemaData = data;

  if (type === "BreadcrumbList" && Array.isArray(data)) {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      numberOfItems: data.length,
      itemListElement: data.map((item: BreadcrumbItem, index: number) => ({
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
