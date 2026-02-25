/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable React Strict Mode in dev to avoid double-render issues with
    // Framer Motion + React Three Fiber. Production builds still run strict checks.
    reactStrictMode: process.env.NODE_ENV === "production",

    webpack(config) {
        // SVGR: import SVGs as React components
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ["@svgr/webpack"],
        });

        return config;
    },

    experimental: {
        turbo: {
            rules: {
                "*.svg": {
                    loaders: ["@svgr/webpack"],
                    as: "*.js",
                },
            },
        },
    },

    images: {
        formats: ["image/avif", "image/webp"],
    },
};

export default nextConfig;
