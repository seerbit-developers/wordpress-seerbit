const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

// eslint-disable-next-line max-len
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports =  {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules:[
            {
                "enforce": "pre",
                "test": /\.js$/,
                "loader": "source-map-loader",
                "exclude": [
                    // instead of /\/node_modules\//
                    path.join(process.cwd(), 'node_modules')
                ]
            },
        ]
    },
    devServer: {
        port:3008
    },
    plugins: [
        new ReactRefreshWebpackPlugin(),
        new Dotenv({
            path: './.env.local',
            safe: true,
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            inject: true,
            template: path.resolve(__dirname, 'public', 'index.html'),
        }),
    ],
}
