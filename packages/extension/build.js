const build = require("esbuild").build;

const path = require("path");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, "../../.env.test"),
});

const __DEV__ = process.env.NODE_ENV === "development";

const define = Object.keys(dotenv.parsed).reduce(
  (p, c) => ({ ...p, ["process.env." + c]: dotenv.parsed[c] }),
  {}
);

build({
  entryPoints: ["src/worker/index.ts"],
  bundle: true,
  format: "esm",
  outfile: "./dist/common/worker.js",
  define: define,
  watch: __DEV__,
}).catch(() => process.exit(1));


