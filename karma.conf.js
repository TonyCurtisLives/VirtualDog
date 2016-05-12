module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-route/angular-route.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app/core/core.module.js',
      'app/dogs/idog.js',
      'app/core/config.js',
      'app/core/constants.js',
      'app/objects/dogObject.module.js',
      'app/objects/dogObject.js',
      'app/dogs/dog.module.js',
      'app/dogs/dogController.js',
      'test/*.js',
      'test/**/*Spec.js'
    ],
    plugins : ['karma-jasmine', 'karma-phantomjs-launcher', 'karma-spec-reporter']
 });
};