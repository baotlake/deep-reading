const build = require("esbuild").build;
const path = require("path");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, "../../.env.test"),
});
const svgrPlugin = require('./esbuild/svgr')

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
  entryPoints: {
    'service.worker': './src/worker/service.worker.ts',
    'background': './src/pages/background',
    'content': './src/content/index.tsx',
    'popup': './src/pages/popup/index.tsx',
    'content-frame': './src/pages/content-frame/index.ts',
    'global': './src/style/global.css',
  },
  bundle: true,
  format: "esm",
  outdir: "./dist/" + output,
  define: define,
  watch: __DEV__ ? {
    onRebuild(err, result) {
      if (!err) {
        console.log('watch build succeded: ', result)
      }
    }
  } : false,
  plugins: [
    svgrPlugin(),
  ]
}).catch(() => process.exit(1));
