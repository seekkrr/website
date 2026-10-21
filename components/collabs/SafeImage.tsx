import Image from "next/image";
import { cn } from "@/lib/utils";

// Hosts (and path prefixes) allowed by next.config.mjs `images.remotePatterns`.
// Anything else renders as a plain lazy <img>, because next/image throws at
// runtime for unconfigured hosts.
const OPTIMIZABLE: { host: string; pathPrefix: string }[] = [
  { host: "img.seekkrr.com", pathPrefix: "/" },
  { host: "res.cloudinary.com", pathPrefix: "/seekkrr/" },
];

function isOptimizable(src: string) {
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      OPTIMIZABLE.some((o) => url.hostname === o.host && url.pathname.startsWith(o.pathPrefix))
    );
  } catch {
    return false;
  }
}

function isSafeRemote(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return new URL(src).protocol === "https:";
  } catch {
    return false;
  }
}

interface SafeImageProps {
  src: string;
  alt: string;
  /** Sizes hint for next/image; the parent must be `relative` with a size. */
  sizes: string;
  className?: string;
  priority?: boolean;
}

/** Fill-mode image for API-provided URLs. */
export function SafeImage({ src, alt, sizes, className, priority }: SafeImageProps) {
  if (!isSafeRemote(src)) return null;
  if (isOptimizable(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- host not in next.config remotePatterns
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
