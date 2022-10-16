const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const dotenv = require('dotenv').config({
    path: path.join(__dirname, '../../.env.test'),
})

const NODE_ENV = process.env.NODE_ENV
const BROWSER = process.env.BROWSER

const __DEV__ = NODE_ENV === 'development'

const platform =
    BROWSER == 'chrome'
        ? 'chrome'
        : BROWSER == 'chrome_v3'
        ? 'chrome_v3'
        : BROWSER == 'firefox'
        ? 'firefox'
        : BROWSER == 'firefox_v3'
        ? 'firefox_v3'
        : 'chrome_v3'

const NO_SOURCE_MAP = process.env.NO_SOURCE_MAP

console.log('target', platform)

const config = {
    mode: __DEV__ ? 'development' : 'production',
    entry: {
        worker: './src/worker/service.worker.ts',
        background: './src/pages/background',
        content: './src/content/index.tsx',
        popup: './src/pages/popup',
        options: './src/pages/options',
        index: './src/pages/index',
        'content-frame': './src/pages/content-frame',
        'dev-content': './src/pages/dev-content',
    },
    output: {
        path: path.join(__dirname, `./dist/${platform}`),
        filename: '[name].js',
        publicPath: '/',
    },
    resolve: {
        alias: {},
        extensions: ['.ts', '.tsx', '.js', 'jsx', '.scss'],
    },
    optimization: {},
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/, /\.worker\.ts/],
                include: path.resolve(__dirname, './src'),
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                            transpileOnly: true,
                        },
                    },
                    {
                        loader: 'astroturf/loader',
                    },
                ],
            },
            {
                test: /\.jsx?$/,
                // exclude: [/node_modules/, /\.worker\.ts/],
                exclude: [/node_modules/],
                include: path.resolve(__dirname, './src'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                        sourceMap: true,
                        cacheDirectory: true,
                    },
                },
            },
            // {
            //   test: /\.worker\.ts/,
            //   include: path.resolve(__dirname, "./src"),
            //   use: [
            //     {
            //       loader: "ts-loader",
            //     },
            //     {
            //       loader: "worker-loader",
            //       options: {
            //         filename: "[name].js",
            //       },
            //     },
            //   ],
            // },
            {
                test: /\.scss/,
                resourceQuery: { not: [/raw/] },
                use: ['css-loader', 'sass-loader'],
            },
            {
                test: /\.scss/,
                resourceQuery: /raw/,
                use: ['raw-loader', 'sass-loader'],
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                resourceQuery: { not: [/raw/] },
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                    },
                ],
            },
            {
                test: /\.css$/,
                resourceQuery: /raw/,
                use: ['raw-loader'],
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
                resourceQuery: { not: [/svgr/] },
                type: 'asset/resource',
            },
            {
                test: /\.svg$/,
                resourceQuery: /svgr/,
                include: path.resolve(__dirname, './src'),
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            svgoConfig: {
                                plugins: [
                                    {
                                        name: 'removeViewBox',
                                        active: false,
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                ...(dotenv.parsed || {}),
            },
            __DEV__: JSON.stringify(__DEV__),
        }),
        new ForkTsCheckerWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/pages/popup/index.html',
            filename: 'popup.html',
            chunks: ['popup'],
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/options/index.html',
            filename: 'options.html',
            chunks: ['options'],
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/index/index.html',
            filename: 'index.html',
            chunks: ['index'],
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/content-frame/index.html',
            filename: 'content-frame.html',
            chunks: ['content-frame'],
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/dev-content/index.html',
            filename: 'dev-content.html',
            chunks: ['dev-content'],
        }),
        new CopyPlugin({
            patterns: [
                { from: './res/share', to: './' },
                { from: './res/' + platform, to: './' },
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
                                  'console.log',
                                  'console.debug',
                                  'console.info',
                                  'console.warn',
                                  'console.error',
                              ],
                          },
                      },
                  }),
              ]),
    ],
    watchOptions: {
        ignored: ['**/node_modules', '**/dist'],
        poll: 1000,
    },
    devtool: __DEV__ & !NO_SOURCE_MAP ? 'inline-source-map' : false,
    // devServer: {
    //   hot: true,
    // },
    // cache: {
    //   type: "filesystem",
    //   version: "22",
    // },
}

module.exports = config
