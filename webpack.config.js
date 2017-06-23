const path = require('path');
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.js',
		library: 'makeElement',
		libraryTarget: 'var',
	},

	plugins: [
		new BabiliPlugin(),
	],
};
