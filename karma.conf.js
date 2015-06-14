'use strict'

module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'mocha'],
    files: [
      'test/*.js'
    ],
    preprocessors: {
      'test/*.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: [
        'partialify'
      ]
    },
    reporters: ['progress'],
    browsers: ['PhantomJS'],
    singleRun: false
  })
}
