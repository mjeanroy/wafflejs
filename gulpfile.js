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
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var strip = require('gulp-strip-comments');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');

var karma = require('karma').server;

var srcFiles = [
  'src/utils.js',
  'src/dom.js',
  'src/parser.js',
  'src/sanitize.js',
  'src/collection.js',
  'src/jq.js',
  'src/column.js',
  'src/grid.js'
];

var testFiles = srcFiles.concat([
  'node_modules/jasmine-utils/src/jasmine-utils.js',
  'test/**/*.js'
]);

var buildFolder = 'dist';

gulp.task('clean', function() {
  return gulp.src(buildFolder, { read : false })
    .pipe(clean());
});

gulp.task('lint', function() {
  gulp.src("src/**/*.js")
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

gulp.task('concat', ['clean'], function(done) {
  return gulp.src(srcFiles)
    .pipe(concat('waffle.js'))
    .pipe(strip())
    .pipe(wrap({src: 'wrap-template.js'}))
    .pipe(gulp.dest(buildFolder));
});

gulp.task('minify', ['concat'], function(done) {
  return gulp.src(buildFolder + '/waffle.js')
    .pipe(uglify())
    .pipe(rename('waffle.min.js'))
    .pipe(gulp.dest(buildFolder));
});

gulp.task('build', ['clean', 'lint', 'test', 'minify']);

gulp.task('default', ['build']);
