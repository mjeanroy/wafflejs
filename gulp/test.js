/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var gulp = require('gulp');
var karma = require('karma').server;
var jasmine = require('gulp-jasmine');

module.exports = function(options) {
  // Test files builder
  gulp.task('test:build', function() {
    return gulp.src([
      'waffle-files.js',
      'node_modules/jasmine-utils/src/jasmine-utils.js',
      'build/waffle-files-spec.js'
    ])
    .pipe(jasmine());
  });

  var files = options.files;
  var targets = Object.keys(files);
  var karmaConf = options.basePath + '/karma.conf.js';

  var tddTasks = [];
  var testTasks = [];

  targets.forEach(function(target) {
    var tddTask = 'tdd:' + target;
    var testTask = 'test:' + target;
    var karmaFiles = []
      .concat(files[target].vendor)  // Vendor libs
      .concat(files[target].src)     // Waffle sources
      .concat(files[target].test);   // Test sources

    tddTasks.push(tddTask);
    testTasks.push(testTask);

    // Create tdd task for each target
    gulp.task(tddTask, ['test:build', 'bower:install'], function(done) {
      karma.start({
        configFile: karmaConf,
        files: karmaFiles,
        reporters: ['progress']
      }, done);
    });

    // Create test task for each target
    gulp.task(testTask, ['test:build', 'bower:install'], function(done) {
      karma.start({
        configFile: karmaConf,
        files: karmaFiles,
        singleRun: true,
        browsers: ['PhantomJS']
      }, function() {
        done();
      });
    });
  });

  gulp.task('tdd', ['test:build'].concat(tddTasks));
  gulp.task('test', ['test:build'].concat(testTasks));
};