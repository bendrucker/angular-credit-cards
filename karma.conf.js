'use strict'

module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'mocha', 'chai-sinon'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'test/*.js'
    ],
    preprocessors: {
      'test/*.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: [
        'babelify',
        'partialify',
        'browserify-shim'
      ]
    },
    reporters: ['progress'],
    browsers: ['PhantomJS'],
    singleRun: false
  })
}
