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
const karma = require('karma');
const jasmine = require('gulp-jasmine');
const Q = require('q');
const gutil = require('gulp-util');
const KarmaServer = karma.Server;

module.exports = options => {
  // Test files builder
  const buildSrc = [
    'waffle.js',
    'node_modules/jasmine-utils/src/jasmine-utils.js',
    'build/test/*-spec.js'
  ];

  gulp.task('test:build', () => gulp.src(buildSrc).pipe(jasmine()));

  const files = options.files;
  const targets = Object.keys(files);
  const karmaConf = path.join(__dirname, '..', '/karma.conf.js');

  const tddTasks = [];
  const testTasks = [];

  const getFiles = target => {
    return []
      .concat(files[target].vendor)  // Vendor libs
      .concat(files[target].src)     // Waffle sources
      .concat(files[target].test);   // Test sources
  };

  // Run karma.
  // Done callback is wrapped into a promise.
  const runKarma = (target, singleRun) => {
    const deferred = Q.defer();
    const onDone = () => deferred.resolve();
    const config = {
      configFile: karmaConf,
      files: getFiles(target)
    };

    if (singleRun) {
      // Continuous integration mode
      config.singleRun = true;
      config.autoWatch = false;
      config.browsers = ['PhantomJS'];
    } else {
      // Dev mode
      config.singleRun = false;
      config.autoWatch = true;
      config.reporters = ['progress'];
    }

    const server = new KarmaServer(config, onDone);
    server.start();
    return deferred.promise;
  };

  targets.forEach(target => {
    const tddTask = `tdd:${target}`;
    const testTask = `test:${target}`;

    tddTasks.push(tddTask);
    testTasks.push(testTask);

    // Create tdd task for each target
    gulp.task(tddTask, ['test:build', 'bower:install'], done => {
      runKarma(target, false).then(done);
    });

    // Create test task for each target
    gulp.task(testTask, ['test:build', 'bower:install'], done => {
      runKarma(target, true).then(done);
    });
  });

  // Run all tdd suite in parallel.
  gulp.task('tdd', ['test:build'].concat(tddTasks));

  // Run all test suite in order.
  gulp.task('test', ['test:build', 'bower:install'], done => {
    const tasks = targets.slice();
    const onIteration = () => {
      if (tasks.length === 0) {
        done();
      } else {
        const target = tasks.shift();
        gutil.log(`Starting '${gutil.colors.cyan(target)}' test suite`);
        runKarma(target, true).then(function() {
          gutil.log(`Finished '${gutil.colors.cyan(target)}' test suite`);
          onIteration();
        });
      }
    };

    onIteration();
  });
};
