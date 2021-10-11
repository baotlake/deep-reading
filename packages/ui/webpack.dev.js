const webpack = require('webpack')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const pkg = require('./package.json')

const srcDir = './src'
const outputDir = './dist'

module.exports = {
    mode: 'development',
    entry: {
        index: path.join(__dirname, `${srcDir}/index.tsx`),
    },
    output: {
        path: path.join(__dirname, `${outputDir}`),
        filename: 'index.js',
        library: pkg.name,
        libraryTarget: 'umd',
        globalObject: 'this',
        // clean: true,
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: './report.html',
        }),
    ],
    externals: [
        {
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react',
            },
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom',
            },
        },
        /@mui/,
    ],
    // devtool: 'inline-source-map',
    optimization: {
        minimize: true,
        minimizer: [
            // new TerserPlugin({
            //     test: /\.js(\?.*)?$/i,
            //     parallel: true,
            //     terserOptions: {
            //         compress: {
            //             drop_console: true
            //         }
            //     }
            // })
        ],
    },
    resolve: {
        alias: {},
        extensions: ['.ts', '.tsx', '.js', '.scss', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /(\.tsx?$)/,
                use: ['ts-loader'],
                exclude: /(node_modules)/,
            },
            {
                test: /(\.jsx?$)/,
                use: ['babel-loader'],
                exclude: /(node_modules)/,
            },
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
        ],
    },
    experiments: {
        // outputModule: true,
        // syncWebAssembly: true,
        // topLevelAwait: true,
        // asyncWebAssembly: true,
        // layers: true,
    },
    // target: ['node', 'web'],
    target: ['web'],
}
