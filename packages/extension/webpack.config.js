const path = require('path')
const CopyPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV
if (!NODE_ENV) {
    console.error('NODE_ENV not set')
    process.exit(1)
}

const __DEV__ = NODE_ENV === 'development'

function createConfig(browser) {
    return {
        mode: __DEV__ ? 'development' : 'production',
        entry: {
            content: './src/content/index.tsx',
            background: './src/background/index.ts',
            popup: './src/pages/Popup',
        },
        output: {
            path: path.join(__dirname, `./dist/${browser}`),
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
                    resourceQuery: {not: [/raw/]},
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
                    resourceQuery: {not: [/raw/]},
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    resourceQuery: /raw/,
                    use: [
                        'raw-loader',
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
            new HtmlWebpackPlugin({
                template: "./src/pages/Popup/popup.html",
                filename: "popup.html",
                chunks: ['popup'],
            }),
            new TerserPlugin({
                terserOptions: {
                    test: /\.js(\?.*)?$/i,
                    parallel: true,
                    terserOptions: {
                        compress: {
                            // drop_console: true,
                            pure_funcs: __DEV__ ? [] : [
                                'console.log',
                                'console.info',
                                'console.warn',
                                'console.error',
                            ]
                        },
                    },
                }
            })
        ],
        watchOptions: {
            ignored: ['**/dist'],
        },
        devtool: __DEV__ ? 'inline-source-map' : false,
        devServer: {
            hot: true,
        },
        cache: {
            type: "memory"
        }
    }
}

const helpConfig = {
    entry: {},
    output: {
        path: path.join(__dirname, './dist/'),
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: './src/manifest/firefox.json', to: './firefox/manifest.json'},
                {from: './src/manifest/chrome.json', to: './chrome/manifest.json'},
                {from: './src/logo_fillet.png', to: './firefox/logo.png'},
                {from: './src/logo_fillet.png', to: './chrome/logo.png'},
                {from: './src/_locales', to: './chrome/_locales'},
                {from: './src/_locales', to: './firefox/_locales'},
                {from: './dist/common', to: './firefox'},
                {from: './dist/common', to: './chrome'},
            ]
        }),
    ]
}
module.exports = [
    createConfig('common'),
    helpConfig
]
