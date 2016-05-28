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
const gutil = require('gulp-util');
const prettyBytes = require('pretty-bytes');
const gzipSize = require('gzip-size');
const through = require('through2');
const pad = require('pad');

module.exports = options => {
  const blue = gutil.colors.blue;
  const magenta = gutil.colors.magenta;
  const green = gutil.colors.green;
  const gray = gutil.colors.gray;

  const log = (filename, size, gzipFileSize) => {
    const fName = pad(filename, 30);
    const fSize = pad(prettyBytes(size), 10);
    const fGzipSize = pad(prettyBytes(gzipFileSize), 10);
    gutil.log(`${blue(fName)} ${magenta(fSize)} -- ${green(fGzipSize)} ${gray(' (gzipped)')}`);
  }

  const run = () => {
    return through.obj((file, enc, cb) => {
      if (file.isNull()) {
        cb(null, file);
        return;
      }

      if (file.isStream()) {
        cb(new gutil.PluginError('gulp-size', 'Streaming not supported'));
        return;
      }

      log(file.relative, file.contents.length, gzipSize.sync(file.contents));
      cb(null, file);
    });
  }

  gulp.task('size', ['less', 'minify', 'vulcanize'], () => (
    gulp.src(path.join(options.dist, '**/*')).pipe(run())
  ));
};
