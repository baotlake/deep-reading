// import typescript from "@rollup/plugin-typescript"
import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

import path from "path";
import dotenv from "dotenv";

const env =
  dotenv.config({
    path: path.join(__dirname, "../../.env.test"),
  }).parsed || {};

const define = Object.keys(env).reduce(
  (p, a) => ({ ...p, ["process.env." + a]: env[a] }),
  {}
);

const config = {
  input: ["./src/index.ts"],
  output: {
    dir: "./es",
    format: "es",
    preserveModules: true,
    preserveModulesRoot: "./src",
  },
  plugins: [typescript()],
};


export default config;
