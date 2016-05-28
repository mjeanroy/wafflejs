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
const git = require('gulp-git');
const bump = require('gulp-bump');
const gulpFilter = require('gulp-filter');
const tag_version = require('gulp-tag-version');

module.exports = options => {
  const basePath = options.basePath;
  const src = [
    path.join(basePath, 'package.json'),
    path.join(basePath, 'bower.json'),
    options.dist
  ];

  const restoreOptions = { restore: true };
  const isPackageJson = file => file.path.indexOf('package.json') >= 0;
  const isDist = file => file.path === options.dist;
  const packageJsonFilter = gulpFilter(isPackageJson, restoreOptions);
  const distFilter = gulpFilter(isDist, restoreOptions);

  ['minor', 'major', 'patch'].forEach(level => {
    gulp.task(`release:${level}`, ['build'], () => (
      gulp.src(src)
        .pipe(bump({type: level}))
        .pipe(gulp.dest('./'))
        .pipe(git.add({ args: '-f' }))
        .pipe(git.commit('release: release version'))
        .pipe(packageJsonFilter)
        .pipe(tag_version())
        .pipe(packageJsonFilter.restore)
        .pipe(distFilter)
        .pipe(git.rm({ args: '-r' }))
        .pipe(git.commit('release: start new release'))
    ));
  });

  gulp.task('release', ['release:minor']);
};
