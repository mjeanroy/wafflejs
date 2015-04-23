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

/* global _ */
/* exported HashMap */

var HashMap = (function() {
  var prefix = 'key_';
  var keyFactory = function(k) {
    return prefix + k;
  };

  var Constructor = function() {
    if (!(this instanceof Constructor)) {
      return new Constructor();
    }

    this.$o = {};
  };

  Constructor.prototype = {
    // Clear map
    clear: function() {
      this.$o = {};
    },

    // Put value into map using given key
    put: function(key, value) {
      this.$o[keyFactory(key)] = value;
      return this;
    },

    // Get value associated to given key
    get: function(key) {
      return this.$o[keyFactory(key)];
    },

    // Remove value associated to given key
    remove: function(key) {
      delete this.$o[keyFactory(key)];
      return this;
    },

    // Check if given key is inside the map
    contains: function(key) {
      return _.has(this.$o, keyFactory(key));
    }
  };

  return Constructor;
})();
