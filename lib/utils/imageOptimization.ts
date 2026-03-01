/**
 * Image Optimization Utilities
 * Provides blur placeholder data URLs and optimization configs for images
 */

/**
 * Placeholder blur data URLs for Cloudinary images
 * Generate these once during build and cache for zero-runtime cost
 */
export const imageBlurData = {
  // About page - Team profiles
  profileSudhanshu:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwwUAxUTAwsEGwwHBBcTFBcTFRcUGhscFBoYGRsaIiIiIiIjIyMjIyMjIyP/2wBDAQICAgICAwUDAwwTFBcUEhMTExMTHBscHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHD/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxEAPw",
  profileSarthak:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwwUAxUTAwsEGwwHBBcTFBcTFRcUGhscFBoYGRsaIiIiIiIjIyMjIyMjIyP/2wBDAQICAgICAwUDAwwTFBcUEhMTExMTHBscHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHD/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxEAPw",
  profileRishabh:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwwUAxUTAwsEGwwHBBcTFBcTFRcUGhscFBoYGRsaIiIiIiIjIyMjIyMjIyP/2wBDAQICAgICAwUDAwwTFBcUEhMTExMTHBscHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHD/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxEAPw",
  dearReaderLetter:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwwUAxUTAwsEGwwHBBcTFBcTFRcUGhscFBoYGRsaIiIiIiIjIyMjIyMjIyP/2wBDAQICAgICAwUDAwwTFBcUEhMTExMTHBscHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHD/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxEAPw",

  // Features and sections
  blackboardDesktop:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwwUAxUTAwsEGwwHBBcTFBcTFRcUGhscFBoYGRsaIiIiIiIjIyMjIyMjIyP/2wBDAQICAgICAwUDAwwTFBcUEhMTExMTHBscHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHD/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxEAPw",
  blackboardMobile:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwwUAxUTAwsEGwwHBBcTFBcTFRcUGhscFBoYGRsaIiIiIiIjIyMjIyMjIyP/2wBDAQICAgICAwUDAwwTFBcUEhMTExMTHBscHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHD/wgARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxEAPw",

  // Creator portal
  creatorBox1:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAMUlEQVR42mNkYPj/n4EIwPgUMDIyMv7//x+RkZGBkYGBgYGRgYEISzAyMjIwMjIyMAIBKhwBO8zZ",
  creatorBox2:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAMUlEQVR42mNkYPj/n4EIwPgUMDIyMv7//x+RkZGBkYGBgYGRgYGISzAyMjIwMjIyMAIBKhwBO8zZ",
  creatorBox3:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAMUlEQVR42mNkYPj/n4EIwPgUMDIyMv7//x+RkZGBkYGBgYGRgYGISzAyMjIwMjIyMAIBKhwBO8zZ",
  creatorBox4:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAMUlEQVR42mNkYPj/n4EIwPgUMDIyMv7//x+RkZGBkYGBgYGRgYGISzAyMjIwMjIyMAIBKhwBO8zZ",
} as const;

/**
 * Get blur data URL for an image key
 */
export function getBlurDataURL(key: keyof typeof imageBlurData): string {
  return imageBlurData[key];
}

/**
 * Configuration for optimized next/image components
 */
export const imageOptimizationConfig = {
  // Priority loading for above-fold images
  priority: {
    quality: 85,
    priority: true,
    objectFit: "cover" as const,
  },

  // Lazy loading for below-fold images
  lazy: {
    quality: 80,
    priority: false,
    placeholder: "blur" as const,
    objectFit: "cover" as const,
  },

  // Contain strategy for images that shouldn't be cropped
  contain: {
    quality: 85,
    priority: false,
    placeholder: "blur" as const,
    objectFit: "contain" as const,
  },

  // Hero images - highest quality
  hero: {
    quality: 90,
    priority: true,
    objectFit: "cover" as const,
  },
};

/**
 * Responsive sizes for Next.js Image component
 */
export const imageSizes = {
  sm: "(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw",
  md: "(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 70vw",
  lg: "(max-width: 1024px) 90vw, (max-width: 1280px) 80vw, 70vw",
  xl: "(max-width: 1280px) 90vw, 80vw",
  profile: "(max-width: 768px) 150px, (max-width: 1024px) 160px, 170px",
};

/**
 * Animation timing for image loading transitions
 */
export const imageLoadingAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: "easeOut" },
};
