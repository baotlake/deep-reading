module.exports = {
    future: {
        webpack5: true,
    },
    webpack: (config, options) => {
        config.module.rules.push({
            resourceQuery: /raw/,
            type: 'asset/source',
        })

        return config
    },
}
