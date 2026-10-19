// ESLint 10 only reads flat config, and Next 16 removed `next lint`, so the
// old `.eslintrc.json` + `next lint` combination no longer runs. This is the
// flat-config equivalent of `extends: ["next/core-web-vitals", "next/typescript"]`.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-plugin-react's React auto-detection calls context.getFilename(),
  // which ESLint 10 removed; pinning the version skips that code path.
  { settings: { react: { version: "18.3" } } },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
