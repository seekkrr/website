import type { Metadata } from "next";
import { Suspense } from "react";
import { ApplyFormLoader } from "@/components/apply/ApplyFormLoader";
import { SectionHeading } from "@/components/collabs/SectionHeading";
import { StructuredData } from "@/components/seo/StructuredData";
import { getPlans } from "@/lib/collabs";
import { siteConfig } from "@/lib/config/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "List your business | SeekKrr for Business",
  description:
    "Apply to list your café, stay or adventure on SeekKrr and start hosting travel creators. Takes about 3 minutes; verification within 24–48 hours.",
  alternates: { canonical: "/business/apply" },
};

export default async function ApplyPage() {
  const { plans } = await getPlans();

  return (
    <div className="relative min-h-screen bg-theme-beige px-4 pb-20 pt-32 sm:px-6 md:px-12 lg:px-24">
      <StructuredData
        data={[
          { name: "Home", item: "/" },
          { name: "For Business", item: "/business" },
          { name: "Apply", item: "/business/apply" },
        ]}
      />
      <div className="mx-auto w-full max-w-[760px]">
        <SectionHeading
          as="h1"
          eyebrow="SeekKrr for Business"
          title="List your business"
          intro={
            <>
              About 3 minutes. We verify every listing by hand within 24–48 hours. Questions? Write to{" "}
              <a href={`mailto:${siteConfig.email}`} className="font-semibold underline underline-offset-2">
                {siteConfig.email}
              </a>
              .
            </>
          }
          className="mb-8"
        />
        <Suspense fallback={null}>
          <ApplyFormLoader plans={plans} />
        </Suspense>
      </div>
    </div>
  );
}
