import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: true,
        port: 3000,
        // Uncomment if you need API proxy
        proxy: {
            "/api": {
                target: "https://api.seekkrr.com",
                changeOrigin: true,
                secure: true,
            },
        },
    },
    build: {
        outDir: "dist",
        sourcemap: false,
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
            format: {
                comments: false,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                    router: ["react-router-dom"],
                },
                entryFileNames: "js/[name]-[hash].js",
                chunkFileNames: "js/[name]-[hash].js",
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split(".");
                    const ext = info[info.length - 1];
                    if (/png|jpe?g|gif|svg|webp/.test(ext)) {
                        return "images/[name]-[hash][extname]";
                    } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
                        return "fonts/[name]-[hash][extname]";
                    } else if (ext === "css") {
                        return "css/[name]-[hash][extname]";
                    }
                    return "[name]-[hash][extname]";
                },
            },
        },
        target: "ES2020",
        cssCodeSplit: true,
        reportCompressedSize: true,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@hooks": path.resolve(__dirname, "./src/hooks"),
            "@utils": path.resolve(__dirname, "./src/utils"),
            "@styles": path.resolve(__dirname, "./src/styles"),
            "@pages": path.resolve(__dirname, "./src/pages"),
            "@assets": path.resolve(__dirname, "./src/assets"),
        },
    },
    optimizeDeps: {
        include: ["react", "react-dom", "react-router-dom"],
    },
});
