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

    // Built for Explorers Icons
    board: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772129611/board_avyzsw.svg"),
    kayake: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772129609/kayake_j8s4xn.svg"),
    compass: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772129602/compass_hhkehx.svg"),
    mountain: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772129602/mountain_vuahx6.svg"),
    lamp: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772129602/lamp_yxmd89.svg"),
    fire: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772129602/fire_mz1p4s.svg"),

    // Freedom Section Icons
    trees: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772131758/trees_wqd6os.svg"),
    sun: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772131761/sun_upedrc.svg"),
    drink: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772131760/drink_jydbdw.svg"),
    guitar: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772131759/guitar_wby5hz.svg"),
    binoculars: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772131758/bino_l7bpod.svg"),
    camera: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772131758/camera_rnwp8z.svg"),

    // The SeekKrr Way Icons
    blackboardDesktop: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772137812/blackboard_desktop_zvhiot.jpg"),
    blackboardMobile: enrichCloudinaryUrl("https://res.cloudinary.com/seekkrr/image/upload/v1772137811/blackboard_mobile_huvqqb.jpg"),
};

/**
 * Ensures a cloudinary URL has optimal delivery parameters applied.
 */
function enrichCloudinaryUrl(url: string, params: string = "f_auto/q_auto") {
    if (url.includes(params)) return url;
    // Inject parameters right after 'upload/'
    return url.replace("/upload/", `/upload/${params}/`);
}
