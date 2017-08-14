/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2017 Mickael Jeanroy
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
const eslint = require('gulp-eslint');
const gutil = require('gulp-util');
const KarmaServer = require('karma').Server;

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const TEST = path.join(ROOT, 'test');

gulp.task('lint', () => {
  return gulp.src([ROOT, SRC, TEST])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', (done) => {
  runKarma('test', () => done());
});

gulp.task('tdd', (done) => {
  runKarma('tdd', () => done());
});

gulp.task('travis', (done) => {
  runKarma('tdd', () => done());
});

gulp.task('saucelab', (done) => {
  runKarma('saucelab', () => done());
});

gulp.task('travis', (done) => {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    gutil.log(gutil.colors.grey('SauceLab environment not set, running classic test suite'));
    runKarma('test', () => done());
  } else {
    runKarma('saucelab', () => done());
  }
});

/**
 * Run test suite with karma.
 *
 * @param {string} mode Running mode (`tdd`, `test`).
 * @param {function} done The done callback.
 * @return {void}
 */
function runKarma(mode, done) {
  const fileName = `karma.${mode}.conf.js`;
  const configFile = path.join(ROOT, fileName);

  const karma = new KarmaServer({configFile}, () => {
    gutil.log(gutil.colors.grey('Calling done callback of Karma'));
    done();
  });

  gutil.log(gutil.colors.grey(`Running karma with configuration: ${fileName}`));
  karma.start();
}
