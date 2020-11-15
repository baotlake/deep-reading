const path = require('path');


module.exports = {
    entry: {
        content: './content.js',
    },
    output: {
        path: path.resolve(__dirname),
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
    watchOptions: {
        ignored:['node_molules/**']
    },
    cache: {
        type: "filesystem",
        cacheDirectory: path.resolve(__dirname, '.temp_cache'),
        version: '11/2/10/37/2',
    }
};