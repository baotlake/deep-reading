const webpack = require('webpack')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const pkg = require('./package.json')
const dotenv = require('dotenv').config({
    path: path.join(__dirname, '.env.test'),
})

const srcDir = './src'
const outputDir = './dist'

module.exports = {
    mode: 'production',
    entry: {
        index: path.join(__dirname, `${srcDir}/index.ts`),
        website: {
            import: path.join(__dirname, `${srcDir}/injection/website.ts`),
            filename: "injection/[name].js"
        },
        extension: {
            import: path.join(__dirname, `${srcDir}/injection/extension.ts`),
            filename: "injection/[name].js"
        }
    },
    output: {
        path: path.join(__dirname, `${outputDir}`),
        filename: '[name].js',
        library: pkg.name,
        libraryTarget: 'umd',
        globalObject: 'this',
        clean: true,
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: './report.html',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                LOOKUP_API: process.env.LOOKUP_API,
                TRANSLATE_API: process.env.TRANSLATE_API,
                SHANGHAI_PROXY_API: process.env.SHANGHAI_PROXY_API,
                TOKYO_PROXY_API: process.env.TOKYO_PROXY_API,
                ...dotenv.parsed,
                NODE_ENV: JSON.stringify('production')
            },
        }),
    ],
    externals: {
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
        redux: {
            root: 'Redux',
            commonjs2: 'redux',
            commonjs: 'redux',
            amd: 'redux',
        },
        'react-router': {
            root: 'ReactRouter',
            commonjs2: 'react-router',
            commonjs: 'react-router',
            amd: 'react-router',
        },
        'react-router-dom': {
            root: 'ReactRouterDOM',
            commonjs2: 'react-router-dom',
            commonjs: 'react-router-dom',
            amd: 'react-router-dom',
        },
        'react-redux': {
            root: 'ReactRedux',
            commonjs2: 'react-redux',
            commonjs: 'react-redux',
            amd: 'react-redux',
        },
    },
    // devtool: 'inline-source-map',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                parallel: true,
                terserOptions: {
                    compress: {
                        // drop_console: true
                    },
                },
            }),
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
                use: ['css-loader', 'sass-loader'],
            },
        ],
    },
}

