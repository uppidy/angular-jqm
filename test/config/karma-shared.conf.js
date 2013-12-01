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
      'bower_components/angular/angular.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'test/lib/createMockWindow.js',
      'test/lib/testutils.js',
      'test/lib/matchers.js',
      'src/module.js',
      'src/**/*.js',
      'bower_components/angular-scrolly/angular-scrolly.js',
      'bower_components/bootstrap/src/position/position.js',
      'test/**/*Spec.js',
      {pattern: 'test/**/*', watched: true, included: false, served: true},
      {pattern: 'bower_components/**/*', watched: true, included: false, served: true}
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
    logLevel: config.LOG_INFO,


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
