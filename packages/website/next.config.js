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
    pageExtensions: ['tsx', 'ts', 'mdx'],
    webpack: (config, options) => {
        config.module.rules.push({
            resourceQuery: /raw/,
            type: 'asset/source',
        })
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    LOOKUP_API: process.env.LOOKUP_API,
                    TRANSLATE_API: process.env.TRANSLATE_API,
                    SHANGHAI_PROXY_API: process.env.SHANGHAI_PROXY_API,
                    TOKYO_PROXY_API: process.env.TOKYO_PROXY_API,
                    // ...process.env,
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
