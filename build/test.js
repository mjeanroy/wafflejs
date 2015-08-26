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

/**
 * Build arrays of test files.
 * Each source file is associated with a test file.
 * By convention, a source file "src/foo.js" will be
 * mapped to "test/foo-spec.js".
 * Some test files can be added that does not respect this convention.
 *
 * Exported module will be an object:
 * - Key is the target waffle build (prefixed with '$').
 * - Value is an array of test files to execute.
 */

var _ = require('underscore');
var config = require('./config');
var core = require('./core');

var prependTestPath = function(src) {
    return config.test + src;
};

var toTestFile = function(src) {
  return src.replace(config.src, '')
            .replace('.js', '*-spec.js');
};

// Add custom test files.
var add = {
  $jquery: [
    'core/jq-lite/jq-lite-spec.js'
  ],

  $underscore: [
    'core/underscore-lite/underscore-lite-spec.js',
    'core/underscore-lite/underscore-base-lite-spec.js'
  ],

  $bare: [
    'core/jq-lite/jq-lite-spec.js',
    'core/underscore-lite/underscore-lite-spec.js',
    'core/underscore-lite/underscore-base-lite-spec.js'
  ],

  $angular: [
    'core/jq-lite/jq-lite-spec.js',
    'core/underscore-lite/underscore-lite-spec.js',
    'core/commons/parser-spec.js'
  ]
};

var $tests = _.mapObject(core, function(value, key) {
  var testFiles = _.map(value, toTestFile);

  var others = add[key];
  if (others) {
    testFiles = testFiles.concat(others);
  }

  return _.map(testFiles, prependTestPath);
});

module.exports = $tests;
