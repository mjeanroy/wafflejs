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
 * Define libraries to include with Waffle Extensions.
 * Vendors includes:
 * - Source files needed to run extensions.
 * - Optional test files only needed to run unit tests (such as angular-mocks).
 */

var _ = require('underscore');
var config = require('./config');

var vendors = {
  $jquery: {
    src: [
      'jquery/dist/jquery.js'
    ]
  },

  $underscore: {
    src: [
      'underscore/underscore.js'
    ]
  },

  $bare: {
    src: [
      'jquery/dist/jquery.js',
      'underscore/underscore.js'
    ]
  },

  $angular: {
    src: [
      'angular/angular.js',
      'angular-sanitize/angular-sanitize.js'
    ],

    test: [
      'angular-mocks/angular-mocks.js'
    ]
  },

  $react: {
    src: [
      'es5-shim/es5-shim.js',
      'react/react-with-addons.js'
    ]
  }
};

// Prepend source files with vendors path
_.forEach(vendors, function(vendor) {
  vendor.src = _.map(vendor.src, function(src) {
    return config.vendors + src;
  });

  vendor.test = _.map(vendor.test, function(test) {
    return config.vendors + test;
  });
});

// Export vendors files needed to run unit tests.
module.exports = vendors;
