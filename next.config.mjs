/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React Strict Mode to identify potential problems in development
    reactStrictMode: true,

    // Turbopack config (Next.js 16+) — used when running `next dev`
    turbopack: {
        rules: {
            "*.svg": {
                loaders: ["@svgr/webpack"],
                as: "*.js",
            },
        },
    },

    // Webpack config — used when running `next build`
    webpack(config) {
        // SVGR: import SVGs as React components
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ["@svgr/webpack"],
        });

        return config;
    },

    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                // Primary asset CDN (lib/config/assets.ts).
                protocol: "https",
                hostname: "img.seekkrr.com",
                pathname: "/**",
            },
            {
                // Still used by lib/cloudinaryLoader.ts (CreatorSteps).
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
