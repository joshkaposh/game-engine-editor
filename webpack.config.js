const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
	entry: "./src/index.tsx",
	mode: "development",

	devServer: {
		static: {
			directory: path.join(__dirname, "public"),
		},
		compress: true,
		port: 3000,
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "public/index.html",
			hash: true,
			filename: "../dist/index.html",
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
				exclude: /node_modules/,
			},
			{
				test: /\.js$/,
				exclude: [/node_modules/, /node_modules\/solid/],
				use: ["babel-loader", "babel-preset-solid"],
			},
			{
				test: /\.(ts|tsx)?$/,
				use: ["babel-loader"],
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js", ".json", ".tsx", ".jsx"],
	},
};
