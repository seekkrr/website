export const CloudinaryIcons = {
    // We add f_auto,q_auto to the Cloudinary URL path for automatic optimization to WebP/AVIF where applicable.
    // Given the base URL format: https://res.cloudinary.com/seekkrr/image/upload/v...
    // We can inject the transformation string before the version number.

    balloon: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772045174/balloon_wtw4pu.svg"),
    coffee: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772045142/coffee_v35gbd.svg"),
    backpack: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772044911/bagpack_kgex1i.svg"),
    boat: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772044912/boat_xwygu6.svg"),
    sleepingBag: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772044911/tent_xk1gpt.svg"),
    tent: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772044911/sleepbag_zpfawr.svg"),
};

/**
 * Ensures a cloudinary URL has optimal delivery parameters applied.
 */
function enrichCloudinaryUrl(url: string, params: string = "f_auto,q_auto") {
    if (url.includes(params)) return url;
    // Inject parameters right after 'upload/'
    return url.replace("/upload/", `/upload/${params}/`);
}
