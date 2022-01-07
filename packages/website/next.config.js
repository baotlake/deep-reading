const withPWA = require('next-pwa')
const caching = require('./cache')

module.exports = withPWA({
    webpack5: true,
    pageExtensions: ['tsx', 'ts', 'mdx'],
    webpack: (config, options) => {
        config.module.rules.push({
            resourceQuery: /raw/,
            type: 'asset/source',
        })

        return config
    },
    target: "serverless",
    pwa: {
        mode: 'production',
        dest: 'public',
        sw: 'service-worker.js',
        runtimeCaching: caching,
        publicExcludes: ['!noprecache/**/*', '!_redirects'],
    }
})
