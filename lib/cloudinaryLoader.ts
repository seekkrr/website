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

    // If the src is already a Cloudinary URL, just return it
    try {
        const url = new URL(src);
        const hostname = url.hostname.toLowerCase();
        if (
            hostname === "cloudinary.com" ||
            hostname.endsWith(".cloudinary.com")
        ) {
            return src;
        }
    } catch {
        // src is likely a relative path; fall through and construct a Cloudinary URL
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
