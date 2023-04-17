const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    resolve: {
        alias: {
            '@fortawesome/fontawesome-free$': '@fortawesome/fontawesome-free-solid/shakable.es.js',
            components: path.resolve(__dirname, 'src/components/'),
            assets: path.resolve(__dirname, 'src/assets/'),
            modules: path.resolve(__dirname, 'src/modules/'),
            utils: path.resolve(__dirname, 'src/utils/'),
            services: path.resolve(__dirname, 'src/services/'),
            actions: path.resolve(__dirname, 'src/actions/'),
            config: path.resolve(__dirname, 'src/config/'),
            models: path.resolve(__dirname, 'src/models/'),
        },
        extensions: ['.tsx', '.ts', '.js', '.json', '.jsx', '.svg'],
    },
    optimization: {
        minimize: true,
        usedExports: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: true,
                    },
                    ecma: undefined,
                    warnings: false,
                    parse: {},
                    compress: {drop_console: false},
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    module: false,
                    toplevel: false,
                    nameCache: null,
                    ie8: true,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false,
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false,
                        annotation: true,
                    },
                },
            }),
        ],
    },
    devtool: 'none',
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        plugins: [
                            'lodash',
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-transform-runtime",
                            "@babel/plugin-transform-react-jsx",
                        ].filter(Boolean),
                        presets: ["@babel/preset-react",
                            ["@babel/preset-env", {
                                useBuiltIns: "usage",
                                "targets": {
                                    "node": "current"
                                }
                            },
                                "rsuite"
                            ]
                        ]
                    }
                }
            },
            {   test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', "postcss-loader"],
                sideEffects: true
            },
            {
                test: /\.scss$/,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.svg$/,
                loader: 'url-loader'
            },
            {
                test: /\.(png|jpe?g|ico)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            },
            {
                test: /\.(pdf|jpg|png|gif|ico|woff|woff2|eot|ttf)$/,
                use: [
                    {
                        loader: 'url-loader'
                    },
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ].filter(Boolean),
    output: {
        filename: "./assets/js/seerbit.js",
        path: __dirname
    },
}