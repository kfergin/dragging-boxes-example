const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');;

const isProd = process.env.NODE_ENV === 'production';
const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssProd = ExtractTextPlugin.extract({
	fallback: 'style-loader',
	use: ['css-loader', 'sass-loader']
});

module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: {
		index: './index.js'
	},
	output: {
		path: path.resolve(__dirname, 'live'),
		filename: '[name].js'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [
					path.resolve(__dirname, 'src')
				],
				loader: 'babel-loader'
			},
			{
				test: /\.scss$/,
				include: [
					path.resolve(__dirname, 'src')
				],
				use: isProd ? cssProd : cssDev
			}
		]
	},
	devServer: {
		compress: true,
		port: 9000,
		hot: true,
		open: true,
		inline: true,
		openPage: ''
	},
	plugins: [
		new HtmlWebpackPlugin({
            title: 'Dragging Boxes With React-Motion',
            hash: true,
            template: './index.html'
        }),
		new ExtractTextPlugin({
			filename: '[name].css',
			disable: !isProd,
			allChunks: true
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin()
	]
}