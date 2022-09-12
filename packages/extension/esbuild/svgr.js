
// config https://github.com/gregberge/svgr/blob/main/packages/core/src/config.ts
// state https://github.com/gregberge/svgr/blob/main/packages/core/src/state.ts

const svgrPlugin = (config = {}, state = {}) => ({
    name: 'svgr-plugin',
    setup(build) {
        const fs = require('fs')
        const { transform } = require('@svgr/core')

        build.onLoad({ filter: /\.svg$/}, async (args) => {
            const text = await fs.promises.readFile(args.path, 'utf8')
            const contents = await transform(text, { ...config }, { ...state })

            return {
                contents,
                loader: config.typescript ? 'tsx' : 'jsx',
            }
        })
    }
})

module.exports = svgrPlugin