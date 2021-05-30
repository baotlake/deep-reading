
const webpack = require('webpack')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const pkg = require('./package.json')

const srcDir = './src'
const outputDir = './dist'

module.exports = {
    mode: 'production',
    entry: {
        index: path.join(__dirname, `${srcDir}/index.ts`)
    },
    output: {
        path: path.join(__dirname, `${outputDir}`),
        filename: 'index.js',
        library: pkg.name,
        libraryTarget: 'umd'
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: './report.html'
        })
    ],
    externals: {
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        },
        'react-dom': {
            root: "ReactDOM",
            commonjs2: 'react-dom',
            commonjs: "react-dom",
            amd: 'react-dom'
        },
        redux: {
            root: "Redux",
            commonjs2: "redux",
            commonjs: 'redux',
            amd:"redux"
        },
        'react-router':{
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
            amd: 'react-redux'
        }
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
                    }
                }
            })
        ]
    },
    resolve: {
        alias: {},
        extensions: ['.ts', '.tsx', '.js', '.scss', '.jsx']
    },
    module: {
        rules: [
            {
                test: /(\.tsx?$)/,
                use:[
                    'ts-loader'
                ],
                exclude: /(node_modules)/
            },
            {
                test: /(\.jsx?$)/,
                use:[
                    'babel-loader'
                ],
                exclude: /(node_modules)/
            },
            {
                test: /\.scss/,
                use:[
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    }
}