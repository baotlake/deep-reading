const build = require("esbuild").build;

const path = require("path");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, "../../.env.test"),
});

const __DEV__ = process.env.NODE_ENV === "development";
const BROWSER = process.env.BROWSER;

const output =
  BROWSER == "chrome"
    ? "chrome"
    : BROWSER == "chrome_v3"
    ? "chrome_v3"
    : BROWSER == "firefox"
    ? "firefox"
    : BROWSER == "firefox_v3"
    ? "firefox_v3"
    : "chrome_v3";

const define = Object.keys(dotenv.parsed).reduce(
  (p, c) => ({ ...p, ["process.env." + c]: dotenv.parsed[c] }),
  {}
);

build({
  entryPoints: ["src/worker/index.ts"],
  bundle: true,
  format: "esm",
  outfile: "./dist/" + output + "/worker.js",
  define: define,
  watch: __DEV__,
}).catch(() => process.exit(1));
