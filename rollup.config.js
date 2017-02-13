import json from 'rollup-plugin-json';
import babili from 'rollup-plugin-babili';

export default {
	entry: 'src/index.js',
	format: 'umd',
	moduleName: 'makeElement',
	targets: [
		{dest: 'dist/index.js', format: 'umd'},
		{dest: 'dist/index.module.js', format: 'es'},
	],

	plugins: [
		json({preferConst: true}),
		babili({comments: false, sourceMap: true}),
	],
};
