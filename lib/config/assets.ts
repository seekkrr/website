export const CloudinaryIcons = {
  // We add f_auto,q_auto to the Cloudinary URL path for automatic optimization to WebP/AVIF where applicable.
  // Given the base URL format: https://res.cloudinary.com/seekkrr/image/upload/v...
  // We can inject the transformation string before the version number.

  balloon: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/balloon_wtw4pu.svg"
  ),
  coffee: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/coffee_v35gbd.svg"
  ),
  backpack: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/bagpack_kgex1i.svg"
  ),
  boat: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/boat_xwygu6.svg"
  ),
  sleepingBag: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/tent_xk1gpt.svg"
  ),
  tent: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/sleepbag_zpfawr.svg"
  ),

  // Built for Explorers Icons
  board: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/board_avyzsw.svg"
  ),
  kayake: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/kayake_j8s4xn.svg"
  ),
  compass: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/compass_hhkehx.svg"
  ),
  mountain: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/mountain_vuahx6.svg"
  ),
  lamp: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/lamp_yxmd89.svg"
  ),
  fire: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/fire_mz1p4s.svg"
  ),

  // Freedom Section Icons
  trees: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/trees_wqd6os.svg"
  ),
  sun: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/sun_upedrc.svg"
  ),
  drink: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/drink_jydbdw.svg"
  ),
  guitar: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/guitar_wby5hz.svg"
  ),
  binoculars: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/bino_l7bpod.svg"
  ),
  camera: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/camera_rnwp8z.svg"
  ),

  // The SeekKrr Way Icons
  blackboardDesktop: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/blackboard_desktop_zvhiot.jpg"
  ),
  blackboardMobile: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/blackboard_mobile_huvqqb.jpg"
  ),

  // What You Get Section
  painter: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/painter_atiahu.png"
  ),
  photographer: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/photographer_mrry45.png"
  ),
  phoneMap: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/phone_map_pvn1gd.png"
  ),
  route: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/route_gfbbrj.png"
  ),
  conversation: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/conversation_dldupe.png"
  ),
  seekkrrText: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/seekkrr_text_qczfju.png"
  ),

  // Creator Portal Hero
  creatorHero: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/creator_hero_zclfoo.png"
  ),

  // Creator Portal Steps & Features
  creatorBox1: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/creator_box1_x4vilt.png"
  ),
  creatorBox2: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/creator_box2_fz8zsd.png"
  ),
  creatorBox3: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/creator_box3_xpzynh.png"
  ),
  creatorBox4: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/creator_box4_a4nnz6.png"
  ),
  creatorCheckpoints: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/checkpoints_fqyjwb.png"
  ),
  creatorBaat: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/baat_frari6.png"
  ),
  creatorMilestone: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/friend_milestone_xqwshw.png"
  ),

  // About Page - Team Profiles
  profileSudhanshu: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/sudhanshu_mths0x.png"
  ),
  profileSarthak: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/sarthak_ocbbnb.png"
  ),
  profileRishabh: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/rishabh_ub8zrf.png"
  ),
  profileDeepak: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/Ellipse_1840_ko7tbg.png"
  ),

  // About Page - Letters & Special Content
  dearReaderLetter: enrichCloudinaryUrl(
    "https://img.seekkrr.com/website/seekkrr/dear_reader_co3mu3.png"
  ),
};

/**
 * Ensures a cloudinary URL has optimal delivery parameters applied.
 */
function enrichCloudinaryUrl(url: string, params: string = "f_auto/q_auto") {
  if (url.includes(params)) return url;
  // Inject parameters right after 'upload/'
  return url.replace("/upload/", `/upload/${params}/`);
}
