module.exports = (config) => {
	config.set({
		frameworks: ['mocha', 'karma-typescript'],
		browsers: ['ChromeHeadless'],
		singleRun: true,
		concurrency: Infinity,
		reporters: ['mocha'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_WARN,

		files: [
			'src/*.ts',
			'test/*.ts',

			{
				pattern: 'test/*.html',
				watched: false,
				included: false,
				served: true,
			},
		],

		preprocessors: {
			'**/*.ts': ['karma-typescript'],
		},

		karmaTypescriptConfig: {
			compilerOptions: {
				target: 'es6',
				baseUrl: __dirname,
			},
		},
	});
};
