import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/collabs/SectionHeading";

export const BUSINESS_FAQ: { id: string; q: string; a: string }[] = [
  {
    id: "pay-creators",
    q: "Do I pay creators?",
    a: "No cash changes hands on SeekKrr today. You offer something you already have, like a meal, a dorm night or a session, and creators make content in return. Your plan is the only thing you pay for, and the Free plan costs nothing.",
  },
  {
    id: "who-redeems",
    q: "Which creators can redeem my collab?",
    a: "Only creators who have opted in to collabs, confirmed they're 18+ and accepted the collab terms. With an Approval collab you see their profile, verified handles and track record before saying yes, and you can limit a collab to verified creators.",
  },
  {
    id: "redeem-code",
    q: "How does the redeem code work?",
    a: "You choose a 4-digit code for each location in the app and can change it whenever you like. When a creator is ready to redeem, a staff member types it on the creator's phone. Easy codes like 1234 or 0000 aren't allowed, and repeated wrong attempts lock out.",
  },
  {
    id: "no-post",
    q: "What if a creator doesn't post?",
    a: "Every brief has a post-within window. If no links arrive, the collab is marked overdue and then a no-show, which lowers that creator's reliability in SeekKrr Match. You can also report or block them.",
  },
  {
    id: "where",
    q: "Where is SeekKrr live?",
    a: "We're piloting collabs in Bir, Himachal Pradesh, and opening more towns region by region. Apply now and we'll switch your listing on as soon as your region launches.",
  },
  {
    id: "team",
    q: "Can my team help run it?",
    a: "Yes. Managers can edit collabs; staff can see the redeem code, scan creator QR codes and approve visits. Only the owner can change billing or the team.",
  },
  {
    id: "gst",
    q: "Do you give GST invoices?",
    a: "Yes. Paid plans are billed through Razorpay with GST-compliant invoices. Add your GSTIN when you apply or later from Billing in the Partner Portal.",
  },
];

interface BusinessFaqProps {
  title?: string;
  items?: { id: string; q: string; a: string }[];
}

export function BusinessFaq({ title = "Questions businesses ask", items = BUSINESS_FAQ }: BusinessFaqProps) {
  const accordionItems: AccordionItem[] = items.map((item) => ({
    id: item.id,
    title: item.q,
    content: <p>{item.a}</p>,
  }));
  return (
    <section
      aria-labelledby="faq-title"
      className="relative w-full bg-theme-beige px-4 py-16 sm:px-6 md:px-12 lg:px-24 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[860px]">
        <SectionHeading id="faq-title" eyebrow="Good to know" title={title} />
        <Accordion items={accordionItems} defaultOpen={[items[0]?.id ?? ""]} />
      </div>
    </section>
  );
}

/** FAQPage structured data for a list of Q&As. */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
