const build = require("esbuild").build;

const __DEV__ = process.env.NODE_ENV === "development";

build({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  format: "esm",
  outdir: "es",
  external: [
    "react",
    "react-dom",
    "@mui",
    "styled-components",
    "@emotion",
    "@wrp/core",
  ],
  watch: __DEV__,
}).catch(() => process.exit(1));
