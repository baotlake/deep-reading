const withPWA = require('next-pwa')
const caching = require('./cache')
const webpack = require('webpack')
const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const dotenv = require('dotenv').config({
    path: path.join(__dirname, '../../.env.test'),
})

const __DEV__ = process.env.NODE_ENV === 'development'
const ANALYSE = !!process.env.ANALYSE

module.exports = withPWA({
    webpack5: true,
    pageExtensions: ['tsx', 'ts', 'mdx'],
    webpack: (config, options) => {
        config.module.rules.push({
            resourceQuery: /raw/,
            type: 'asset/source',
        })
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    ...dotenv.parsed,
                }
            })
        )
        !__DEV__ && ANALYSE && config.plugins.push(
            new BundleAnalyzerPlugin()
        )
        return config
    },
    target: "serverless",
    pwa: {
        mode: __DEV__ ? 'development' : 'production',
        dest: 'public',
        sw: 'service-worker.js',
        runtimeCaching: caching,
        publicExcludes: ['!noprecache/**/*', '!_redirects'],
    }
})
