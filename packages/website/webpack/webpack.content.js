const webpack = require('webpack')
const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        content: path.join(__dirname, '../src/content.ts'),
    },
    output: {
        path: path.join(__dirname, '../public'),
        filename: '[name].js',
        assetModuleFilename: '[hash][ext][query]',
        publicPath: '',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        alias: {},
        extensions: ['.js', '.ts', '.tsx'],
    },
    target: ['web'],
}
