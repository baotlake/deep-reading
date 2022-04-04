const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, "../../.env.test"),
});

const NODE_ENV = process.env.NODE_ENV;
const BROWSER = process.env.BROWSER;

const __DEV__ = NODE_ENV === "development";

const target =
  BROWSER == "chrome"
    ? "chrome"
    : BROWSER == "chrome_v3"
    ? "chrome_v3"
    : BROWSER == "firefox"
    ? "firefox"
    : BROWSER == "firefox_v3"
    ? "firefox_v3"
    : "chrome_v3";

const config = {
  mode: __DEV__ ? "development" : "production",
  entry: {
    // worker: "./src/worker",
    background: "./src/pages/background",
    content: "./src/content/index.tsx",
    popup: "./src/pages/popup",
    "popup-action": "./src/pages/popup-action",
    "content-frame": "./src/pages/content-frame",
  },
  output: {
    path: path.join(__dirname, `./dist/${target}`),
    filename: "[name].chunk.js",
  },
  resolve: {
    alias: {},
    extensions: [".ts", ".tsx", ".js", "jsx", ".scss"],
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
            sourceMap: true,
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.scss/,
        resourceQuery: { not: [/raw/] },
        use: ["css-loader", "sass-loader"],
      },
      {
        test: /\.scss/,
        resourceQuery: /raw/,
        use: ["raw-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        resourceQuery: { not: [/raw/] },
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.css$/,
        resourceQuery: /raw/,
        use: ["raw-loader"],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        ...(dotenv.parsed || {}),
      },
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/popup/index.html",
      filename: "popup.html",
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/popup-action/index.html",
      filename: "popup-action.html",
      chunks: ["popup-action"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/content-frame/index.html",
      filename: "content-frame.html",
      chunks: ["content-frame"],
    }),
    new CopyPlugin({
      patterns: [
        { from: "./res/share", to: "./" },
        { from: "./res/" + target, to: "./" },
      ],
    }),

    ...(__DEV__
      ? []
      : [
          // new BundleAnalyzerPlugin({
          //   analyzerMode: "static",
          // }),
          new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            parallel: true,
            terserOptions: {
              compress: {
                // drop_console: true,
                pure_funcs: [
                  "console.log",
                  "console.debug",
                  "console.info",
                  "console.warn",
                  "console.error",
                ],
              },
            },
          }),
        ]),
  ],
  watchOptions: {
    ignored: ["**/dist"],
  },
  devtool: __DEV__ ? "inline-source-map" : false,
  devServer: {
    hot: true,
  },
  cache: {
    type: "memory",
  },
};

module.exports = config;
