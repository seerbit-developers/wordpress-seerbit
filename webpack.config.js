const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/index.js",
	mode: "development",
	resolve: {
		// extensions: ['.mjs', '.mts', '.ts', '.tsx', '.js', '.jsx','json'],
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
				test: /\.(woff(2)?|ttf|eot|ico)(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts/'
					}
				}]
			},
			{
				test: /\.(pdf|jpg|png|gif|ico)$/,
				use: [
					{
						loader: 'url-loader'
					},
				]
			}
		]
		// rules: [
		// 	{
		// 		test: /\.(js|jsx|tsx|ts)$/,
		// 		exclude: /node_modules/,
		// 		use: {
		// 			loader: "babel-loader",
		// 			options: {
		// 				presets: [["env", "react"]],
		// 				plugins: ["transform-class-properties"]
		// 			}
		// 		}
		// 	},
		// 	{   test: /\.html$/,
		// 		use: [
		// 			{
		// 				loader: "html-loader"
		// 			}
		// 		]
		// 	},
		// 	{
		// 		test: /\.css$/,
		// 		use: ['style-loader', 'css-loader', "postcss-loader"],
		// 		sideEffects: true
		// 	},
		// 	{
		// 		test: /\.scss$/,
		// 		use: [
		// 			// Creates `style` nodes from JS strings
		// 			'style-loader',
		// 			// Translates CSS into CommonJS
		// 			'css-loader',
		// 			// Compiles Sass to CSS
		// 			'sass-loader',
		// 		],
		// 	},
		// 	{
		// 		test: /\.svg$/,
		// 		loader: 'url-loader'
		// 	},
		//
		// 	{
		// 		test: /\.(woff(2)?|ttf|eot|ico)(\?v=\d+\.\d+\.\d+)?$/,
		// 		use: [{
		// 			loader: 'file-loader',
		// 			options: {
		// 				name: '[name].[ext]',
		// 				outputPath: 'fonts/'
		// 			}
		// 		}]
		// 	},
		// 	{
		// 		test: /\.(pdf|jpg|png|gif|ico)$/,
		// 		use: [
		// 			{
		// 				loader: 'url-loader'
		// 			},
		// 		]
		// 	}
		// 	// {
		// 	//     test: /\.(scss)$/,
		// 	//     use: [{
		// 	//         loader: 'style-loader',
		// 	//     }],
		// 	//     sideEffects: true
		// 	// }
		// ]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin()
	],
	output: {
		filename: "./assets/js/seerbit.js",
		path: __dirname
	},
};