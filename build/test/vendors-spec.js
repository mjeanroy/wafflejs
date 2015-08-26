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

describe('vendors', function() {

  var $vendors = require('../vendors');

  describe('jquery', function() {
    var $jquery = $vendors.$jquery;

    it('should have vendors files', function() {
      expect($jquery.src).toEqual([
        'vendors/jquery/dist/jquery.js'
      ]);
    });

    it('should not have test files', function() {
      expect($jquery.test).toBeEmpty();
    });
  });

  describe('underscore', function() {
    var $underscore = $vendors.$underscore;

    it('should have vendors files', function() {
      expect($underscore.src).toEqual([
        'vendors/underscore/underscore.js'
      ]);
    });

    it('should not have test files', function() {
      expect($underscore.test).toBeEmpty();
    });
  });

  describe('angular', function() {
    var $angular = $vendors.$angular;

    it('should have vendors files', function() {
      expect($angular.src).toEqual([
        'vendors/angular/angular.js',
        'vendors/angular-sanitize/angular-sanitize.js'
      ]);
    });

    it('should have test files', function() {
      expect($angular.test).toEqual([
        'vendors/angular-mocks/angular-mocks.js'
      ]);
    });
  });

  describe('react', function() {
    var $react = $vendors.$react;

    it('should have vendors files', function() {
      expect($react.src).toEqual([
        'vendors/es5-shim/es5-shim.js',
        'vendors/react/react-with-addons.js'
      ]);
    });

    it('should not have test files', function() {
      expect($react.test).toBeEmpty();
    });
  });
});
