module.exports = (config) => {
  config.set({
    frameworks: ['mocha', 'karma-typescript'],
    browsers: ['chromeHeadless'],
    singleRun: true,
    concurrency: Infinity,
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,

    files: [
      'src/*.ts',
    ],

    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },

    karmaTypescriptConfig: {
      compilerOptions: {
        target: 'es6',
      },
    },

    customLaunchers: {
      chromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222',
        ],
      },
    },

  })
};
