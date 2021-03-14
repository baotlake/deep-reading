const path = require('path')
const CopyPlugin = require("copy-webpack-plugin")


module.exports = {
    entry: {
        content: './src/extension/content.js',
        background: './src/extension/background.js',

    },
    output: {
        path: path.join(__dirname, 'ext'),
        filename: '[name].chunk.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                        sourceMap: true,
                        cacheDirectory: true,
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]

            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                }, {
                    loader: 'less-loader',
                }]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
                loader: 'url-loader'
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './src/extension/manifest.json', to: './' },
                { from: './public/logo.png', to: './' },
            ]
        })
    ],
    watchOptions: {
        ignored: ['node_molules/**']
    },
    cache: {
        type: "memory"
    }
};