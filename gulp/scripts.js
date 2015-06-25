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
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var rename = require('gulp-rename');
var strip = require('gulp-strip-comments');

module.exports = function(options) {
  var files = options.files;
  var targets = Object.keys(files);
  var concatTasks = [];
  var minifyTasks = [];

  targets.forEach(function(target) {
    var concatTask = 'concat:' + target;
    var minifyTask = 'minify:' + target;

    concatTasks.push(concatTask);
    minifyTasks.push(minifyTask);

    gulp.task(concatTask, ['test:build'], function(done) {
      return gulp.src(files[target].src)
        .pipe(concat('waffle-' + target + '.js'))
        .pipe(strip({ block: true }))
        .pipe(wrap({ src: 'templates/wrap-template-' + target + '.js' }))
        .pipe(gulp.dest(options.dist));
    });

    gulp.task(minifyTask, [concatTask], function(done) {
      return gulp.src(options.dist + '/waffle-' + target + '.js')
        .pipe(uglify())
        .pipe(rename('waffle-' + target + '.min.js'))
        .pipe(gulp.dest(options.dist));
    });
  });

  // Add task for ie8 polyfills
  gulp.task('ie8', function() {
    gulp.src('src/ie8/*')
      .pipe(gulp.dest(options.dist + '/ie8'))
      .pipe(uglify())
      .pipe(rename('waffle-ie8.min.js'))
      .pipe(gulp.dest(options.dist + '/ie8'));
  });

  // Add shortcuts to launch each sub-tasks
  gulp.task('concat', ['test:build'].concat(concatTasks));
  gulp.task('minify', ['test:build', 'ie8'].concat(minifyTasks));
};