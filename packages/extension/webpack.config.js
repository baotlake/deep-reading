const path = require('path')
const CopyPlugin = require("copy-webpack-plugin")


module.exports = {
    mode: 'development',
    entry: {
        content: './src/content.tsx',
        background: './src/background.ts',
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].chunk.js'
    },
    module: {
        rules: [
            {
                test: /.tsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'ts-loader',
                }
            },
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
                test: [
                    /\.bmp$/, 
                    /\.gif$/, 
                    /\.jpe?g$/, 
                    /\.png$/, 
                    /\.svg$/,
                ],
                loader: 'url-loader'
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './src/manifest.json', to: 'manifest.json' },
                { from: './src/logo.png', to: 'logo.png' },
            ]
        })
    ],
    watchOptions: {
        ignored: ['node_molules/**']
    },
    devtool:'inline-source-map',
    cache: {
        type: "memory"
    }
};