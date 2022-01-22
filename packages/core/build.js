const build = require("esbuild").build;

const __DEV__ = process.env.NODE_ENV === "development";

build({
  entryPoints: ["src/index.ts", "src/injection/website.tsx"],
  bundle: true,
  format: "esm",
  outdir: "es",
  watch: __DEV__,
}).catch(() => process.exit(1));

build({
  entryPoints: ["src/injection/website.tsx"],
  bundle: true,
  format: "iife",
  outdir: "es",
  watch: __DEV__,
}).catch(() => process.exit(1));
