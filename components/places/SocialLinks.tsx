import { Facebook, Globe, Instagram, Linkedin, Youtube, type LucideIcon } from "lucide-react";
import type { SocialLink } from "@/lib/collabs";

function XGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function detect(link: SocialLink): { label: string; Icon: LucideIcon | typeof XGlyph } {
  const platform = (link.platform ?? "").toLowerCase();
  let host = "";
  try {
    host = new URL(link.url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    host = "";
  }
  if (platform === "instagram" || host.endsWith("instagram.com")) return { label: "Instagram", Icon: Instagram };
  if (platform === "youtube" || host.endsWith("youtube.com") || host === "youtu.be") return { label: "YouTube", Icon: Youtube };
  if (platform === "facebook" || host.endsWith("facebook.com")) return { label: "Facebook", Icon: Facebook };
  if (platform === "linkedin" || host.endsWith("linkedin.com")) return { label: "LinkedIn", Icon: Linkedin };
  if (platform === "x" || platform === "twitter" || host === "x.com" || host.endsWith("twitter.com"))
    return { label: "X", Icon: XGlyph };
  return { label: host || "Website", Icon: Globe };
}

export function SocialLinks({ links, name }: { links: SocialLink[]; name: string }) {
  if (links.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((link) => {
        const { label, Icon } = detect(link);
        return (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3.5 py-2 font-jakarta text-[14px] font-bold text-black transition-colors hover:bg-theme-yellow focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
            >
              <Icon className="h-4 w-4" />
              {label}
              <span className="sr-only"> for {name} (opens in a new tab)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
