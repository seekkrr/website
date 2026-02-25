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

    // If the src already contains cloudinary.com, just return it
    if (src.includes("cloudinary.com")) return src;

    // Otherwise, construct the URL using the project's cloud name
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "seekkrr";

    // Clean up leading slashes from local paths
    const cleanSrc = src.replace(/^\/+/, "");

    return `https://res.cloudinary.com/${cloudName}/image/upload/${params}/${cleanSrc}`;
}
