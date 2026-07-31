export default function cloudinaryLoader({
    src,
    width,
    quality,
}: {
    src: string;
    width: number;
    quality?: number;
}) {
    const params = [
        "f_auto",
        "c_limit",
        `w_${width}`,
        `q_${quality || "auto"}`,
    ].join(",");

    // Any absolute URL is already a fully-qualified asset URL — Cloudinary, or the
    // img.seekkrr.com CDN that most assets moved to. Serve it untouched; wrapping it
    // in a Cloudinary transform path produces .../upload/<params>/https:/img.seekkrr.com/...
    // which 404s.
    try {
        const { protocol } = new URL(src);
        if (protocol === "https:" || protocol === "http:") {
            return src;
        }
    } catch {
        // src is a relative path or bare Cloudinary public ID; fall through and build one.
    }

    // Otherwise, construct the URL using the project's cloud name
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
        throw new Error("Cloudinary cloud name is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.");
    }

    // Clean up leading slashes from local paths
    const cleanSrc = src.replace(/^\/+/, "");

    return `https://res.cloudinary.com/${cloudName}/image/upload/${params}/${cleanSrc}`;
}
