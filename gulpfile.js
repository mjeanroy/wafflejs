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
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var server = require('gulp-express');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var strip = require('gulp-strip-comments');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');
var taskListing = require('gulp-task-listing');
var karma = require('karma').server;

var underscoreLite = 'src/utils.js';
var jqLite = 'src/jq-lite.js';
var commonsFiles = [
  'src/constants.js',
  'src/dom.js',
  'src/parser.js',
  'src/sanitize.js',
  'src/collection.js',
  'src/renderers.js',
  'src/column.js',
  'src/grid.js'
];

var files = {
  standalone: [underscoreLite, jqLite].concat(commonsFiles),
  jquery: [underscoreLite].concat(commonsFiles),
  underscore: [jqLite].concat(commonsFiles)
};

var testFiles = files.standalone.concat([
  'node_modules/jasmine-utils/src/jasmine-utils.js',
  'test/**/*.js'
]);

var buildFolder = 'dist';

gulp.task('help', taskListing);

gulp.task('clean', function() {
  return gulp.src(buildFolder, { read : false })
    .pipe(clean());
});

gulp.task('lint', function() {
  return gulp.src("src/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

gulp.task('tdd', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    files: testFiles
  }, done);
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    files: testFiles,
    singleRun: true,
    browsers: ['PhantomJS']
  }, done);
});

var MINIFY_PREFIX = 'minify:';
var CONCAT_PREFIX = 'concat:';
var TARGETS = ['standalone', 'jquery', 'underscore'];

TARGETS.forEach(function(target) {
  var concatTask = CONCAT_PREFIX + target;
  var minifyTask = MINIFY_PREFIX + target;

  gulp.task(concatTask, ['clean', 'lint', 'test'], function(done) {
    return gulp.src(files[target])
      .pipe(concat('waffle-' + target + '.js'))
      .pipe(strip({ block: true }))
      .pipe(wrap({src: 'wrap-template-' + target + '.js'}))
      .pipe(gulp.dest(buildFolder));
  });

  gulp.task(minifyTask, [concatTask], function(done) {
    return gulp.src(buildFolder + '/waffle-' + target + '.js')
      .pipe(uglify())
      .pipe(rename('waffle-' + target + '.min.js'))
      .pipe(gulp.dest(buildFolder));
  });
});

gulp.task('concat', TARGETS.map(function(t) {
  return 'concat:' + t;
}));

gulp.task('minify', TARGETS.map(function(t) {
  return 'minify:' + t;
}));

gulp.task('build', ['clean', 'lint', 'test', 'minify']);
gulp.task('default', ['build']);

gulp.task('server', ['concat'], function () {
  server.run({
    file:'sample-server.js'
  });

  gulp.watch(['src/**/*'], function(event) {
    gulp.run('concat');
    server.notify(event);
  });

  gulp.watch(['sample/**/*'], server.notify);
});
