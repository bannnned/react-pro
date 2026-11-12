const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('node:path');
const webpack = require('webpack');
require('dotenv').config({ path: ['.env.local', '.env'] });

module.exports = (mode) => {
	const production = mode === 'production';
	const MiniCssExtractPlugin = require('mini-css-extract-plugin');

	return {
		mode,
		target: ['web', 'es2020'],
		entry: './src/index.tsx',
		output: {
			path: path.resolve(__dirname, '../dist'),
			filename: production
				? 'assets/[name].[contenthash].js'
				: 'assets/[name].js',
			publicPath: '/',
			clean: true,
		},
		resolve: { extensions: ['.tsx', '.ts', '.js'] },
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: { loader: 'ts-loader', options: { transpileOnly: true } },
				},
				{ test: /\.(svg|png|jpe?g|gif|webp)$/i, type: 'asset/resource' },
				{
					test: /\.css$/,
					use: [
						production ? MiniCssExtractPlugin.loader : 'style-loader',
						'css-loader',
						'postcss-loader',
					],
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({ template: './public/index.html' }),
			new CopyWebpackPlugin({
				patterns: [{ from: 'public/media', to: 'media' }],
			}),
			new webpack.DefinePlugin({
				'process.env.API_URL': JSON.stringify(process.env.API_URL || '/api'),
			}),
			...(production
				? [
						new MiniCssExtractPlugin({
							filename: 'assets/[name].[contenthash].css',
						}),
				  ]
				: []),
		],
	};
};
