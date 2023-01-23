const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;

module.exports = {
	entry: "./src/seerbit-merchants.js",
	mode: "development",
	// resolve: {
	// 	alias: {
	// 		components: path.resolve(__dirname, 'src/components/'),
	// 		assets: path.resolve(__dirname, 'src/assets/'),
	// 		modules: path.resolve(__dirname, 'src/modules/'),
	// 		utils: path.resolve(__dirname, 'src/utils/'),
	// 		services: path.resolve(__dirname, 'src/services/'),
	// 		actions: path.resolve(__dirname, 'src/actions/'),
	// 		config: path.resolve(__dirname, 'src/config/'),
	// 		models: path.resolve(__dirname, 'src/models/'),
	// 	},
	// 	extensions: ['.tsx', '.ts', '.js', '.json', '.jsx', '.svg'],
	// },
	module: {
		rules: [
			{
				test:  /\.(js|jsx|tsx|ts)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							plugins: [
								'lodash',
								"transform-class-properties",
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
					},
				],
			},
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
	output: {
		filename: "./dist/bundle.js",
		path: __dirname
	},
};