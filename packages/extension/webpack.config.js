const path = require('path')
const CopyPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
    mode: 'development',
    entry: {
        content: './src/content/index.ts',
        background: './src/background/index.ts',
        popup: './src/pages/Popup',
    },
    output: {
        path: path.join(__dirname, './dist/wrp_chrome'),
        filename: '[name].chunk.js'
    },
    resolve: {
        alias: {},
        extensions: ['.ts', '.tsx', '.js', 'jsx', '.scss']
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
                test: /\.scss/,
                resourceQuery: { not: [/raw/] },
                use: ['css-loader', 'sass-loader'],
            },
            {
                test: /\.scss/,
                resourceQuery: /raw/,
                use: ['raw-loader', 'sass-loader'],
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
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: './src/manifest_firefox.json', to: '../wrp_firefox/manifest.json'},
                {from: './src/manifest.json', to: '../wrp_chrome/manifest.json'},
                {from: './src/logo.png', to: 'logo.png'},
            ]
        }),
        new HtmlWebpackPlugin({
            template: "./src/pages/Popup/popup.html",
            filename: "popup.html",
            chunks: ['popup'],
        }),
    ],
    watchOptions: {
        ignored: ['**/node_modules', '**/dist']
    },
    devtool: 'inline-source-map',
    cache: {
        type: "memory"
    }
};
