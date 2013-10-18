// Karma configuration
// Generated on Fri Jul 26 2013 10:26:29 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../..',


    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'components/angular/angular.js',
      'components/angular/angular-touch.js',
      'components/angular/angular-animate.js',
      'components/angular/angular-route.js',
      'components/angular/angular-mocks.js',
      'test/lib/createMockWindow.js',
      'test/lib/testutils.js',
      'test/lib/matchers.js',
      'src/module.js',
      'src/**/*.js',
      'components/angular-scrolly/angular-scrolly.js',
      'components/angular-bootstrap/position.js',
      'test/**/*Spec.js',
      {pattern: 'test/**/*', watched: true, included: false, served: true},
      {pattern: 'components/**/*', watched: true, included: false, served: true}
    ],

    // list of files to exclude
    exclude: [
    ],

    // web server port
    port: 9678,

    preprocessors: {
      'src/directives/*.js': ['inlineTemplate']
    },
    inlineTemplatePreprocessor: {
      base: 'src'
    },

    // cli runner port
    runnerPort: 9100,


    // enable / disable colors in the output (reporters and logs)
    colors: true,

    reporters: ['dots'],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
