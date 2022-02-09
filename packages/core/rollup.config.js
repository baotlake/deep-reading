// import typescript from "@rollup/plugin-typescript"
import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

import path from "path";
import dotenv from "dotenv";

const env = dotenv.config({
  path: path.join(__dirname, "../../.env.test"),
}).parsed;

const define = Object.keys(env).reduce(
  (p, a) => ({ ...p, ["process.env." + a]: env[a] }),
  {}
);

const config = {
  input: ["./src/index.ts", "./src/App/index.tsx"],
  output: {
    dir: "./es",
    format: "es",
    preserveModules: true,
    preserveModulesRoot: "./src",
  },
  plugins: [typescript()],
};

const injectionConfig = {
  input: {
    "injection/website": "./src/injection/website.tsx",
  },
  output: {
    dir: "./es",
    format: "es",
    preserveModulesRoot: "./src",
  },
  plugins: [
    typescript(),
    commonjs(),
    nodeResolve(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      ...define,
    }),
  ],
};

export default [config, injectionConfig];
