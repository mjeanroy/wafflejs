/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mickael Jeanroy, Cedric Nisio
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

var del = require('del');

var gulp = require('gulp');
var concat = require('gulp-concat');
var server = require('gulp-express');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var rename = require('gulp-rename');
var strip = require('gulp-strip-comments');
var taskListing = require('gulp-task-listing');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');

var karma = require('karma').server;

var files = require('./waffle-files');

var BUILD_FOLDER = 'dist';

gulp.task('help', taskListing);

gulp.task('clean', function(done) {
  del(BUILD_FOLDER, done);
});

gulp.task('lint', function() {
  return gulp.src("src/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

var minifyPrefix = 'minify:';
var concatPrefix = 'concat:';
var tddPrefix = 'tdd:';
var testPrefix = 'test:';
var targets = Object.keys(files);

targets.forEach(function(target) {
  var concatTask = concatPrefix + target;
  var minifyTask = minifyPrefix + target;
  var tddTask = tddPrefix + target;
  var testTask = testPrefix + target;
  var karmaFiles = []
    .concat(files[target].vendor)  // Vendor libs
    .concat(files[target].src)     // Waffle sources
    .concat(files[target].test);   // Test sources

  // Create tdd task for each target
  gulp.task(tddTask, function(done) {
    karma.start({
      configFile: __dirname + '/karma.conf.js',
      files: karmaFiles
    }, done);
  });

  // Create test task for each target
  gulp.task(testTask, function(done) {
    karma.start({
      configFile: __dirname + '/karma.conf.js',
      files: karmaFiles,
      singleRun: true,
      browsers: ['PhantomJS']
    }, function() {
      done();
    });
  });

  // Create concat task for each target
  gulp.task(concatTask, function(done) {
    return gulp.src(files[target].src)
      .pipe(concat('waffle-' + target + '.js'))
      .pipe(strip({ block: true }))
      .pipe(wrap({src: 'templates/wrap-template-' + target + '.js'}))
      .pipe(gulp.dest(BUILD_FOLDER));
  });

  // Create minify task for each target
  gulp.task(minifyTask, [concatTask], function(done) {
    return gulp.src(BUILD_FOLDER + '/waffle-' + target + '.js')
      .pipe(uglify())
      .pipe(rename('waffle-' + target + '.min.js'))
      .pipe(gulp.dest(BUILD_FOLDER));
  });
});

gulp.task('concat', targets.map(function(t) { return 'concat:' + t; }));
gulp.task('minify', targets.map(function(t) { return 'minify:' + t; }));
gulp.task('tdd', targets.map(function(t) { return 'tdd:' + t; }));
gulp.task('test', targets.map(function(t) { return 'test:' + t; }));

gulp.task('less', function() {
  return gulp.src(__dirname + '/src/less/*.less')
    .pipe(less())
    .pipe(gulp.dest(BUILD_FOLDER));
});

gulp.task('build', ['lint', 'test', 'less', 'minify']);
gulp.task('default', ['build']);

gulp.task('server', ['concat', 'less'], function () {
  server.run(['sample-server.js']);

  gulp.watch(['src/**/*.js'], ['concat']);
  gulp.watch(['src/less/*.less'], ['less']);
  gulp.watch(['dist/**/*'], server.notify);
  gulp.watch(['sample/**/*'], server.notify);
});
