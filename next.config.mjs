/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable React Strict Mode in dev to avoid double-render issues with
    // Framer Motion + React Three Fiber. Production builds still run strict checks.
    reactStrictMode: process.env.NODE_ENV === "production",

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
    },
};

export default nextConfig;
