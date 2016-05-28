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

const path = require('path');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const wrap = require('gulp-wrap');
const rename = require('gulp-rename');
const strip = require('gulp-strip-comments');
const esformatter = require('gulp-esformatter');
const babel = require('gulp-babel');

module.exports = options => {
  const files = options.files;
  const targets = Object.keys(files);
  const concatTasks = [];
  const minifyTasks = [];

  const uglifyOptions = {
    mangle: true,
    compress: {
      screw_ie8: false,
      sequences: true,
      dead_code: true,
      drop_debugger: true,
      comparisons: true,
      conditionals: true,
      evaluate: true,
      booleans: true,
      loops: true,
      unused: true,
      hoist_funs: false,
      hoist_vars: false,
      if_return: true,
      join_vars: true,
      cascade: true,
      drop_console: true
    }
  };

  targets.forEach(target => {
    const concatTask = `concat:${target}`;
    const minifyTask = `minify:${target}`;

    concatTasks.push(concatTask);
    minifyTasks.push(minifyTask);

    gulp.task(concatTask, ['test:build'], () => (
      gulp.src(files[target].src)
        .pipe(concat(`waffle-${target}.js`))
        .pipe(strip({ block: true }))
        .pipe(babel())
        .pipe(wrap({ src: `templates/wrap-template-${target}.js` }))
        .pipe(esformatter({indent: {value: '  '}}))
        .pipe(gulp.dest(options.dist))
    ));

    gulp.task(minifyTask, [concatTask], () => (
      gulp.src(path.join(options.dist, `/waffle-${target}.js`))
        .pipe(uglify(uglifyOptions))
        .pipe(rename(`waffle-${target}.min.js`))
        .pipe(gulp.dest(options.dist))
    ));
  });

  // Add task for ie8 polyfills
  gulp.task('ie8', () => (
    gulp.src(path.join(options.src, 'ie8/*'))
      .pipe(gulp.dest(path.join(options.dist, 'ie8')))
      .pipe(uglify(uglifyOptions))
      .pipe(rename('waffle-ie8.min.js'))
      .pipe(gulp.dest(path.join(options.dist, 'ie8')))
  ));

  // Add shortcuts to launch each sub-tasks
  gulp.task('concat', ['test:build'].concat(concatTasks));
  gulp.task('minify', ['test:build', 'ie8'].concat(minifyTasks));
};
