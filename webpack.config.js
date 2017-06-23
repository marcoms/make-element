const path = require('path');
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'make-element.js',
		library: 'makeElement',
		libraryTarget: 'umd',
	},

	plugins: [
		new BabiliPlugin(),
	],
};
