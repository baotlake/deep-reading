import typescript from "rollup-plugin-typescript2";

const config = {
  input: ["./src/index.tsx"],
  output: {
    dir: "./es",
    format: "es",
    preserveModules: true,
    preserveModulesRoot: "./src",
  },
  plugins: [typescript()],
};


export default config