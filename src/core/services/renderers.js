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

/* jshint eqnull:true */
/* global _ */
/* global $util */
/* exported $renderers */

var $renderers = (function() {
  // Turn value to a valid string
  var toString = function(value) {
    return (value == null ? '' : value).toString();
  };

  var o = {
    // Simple renderer that just return same value
    $identity: _.identity,

    // Simple renderer that just return an empty value
    // Could be used to renderer a cell with always an empty value
    $empty: function() {
      return '';
    },

    // Render a value as a lower case string
    $lowercase: function(value) {
      return toString(value).toLowerCase();
    },

    // Render a value as an upper case string
    $uppercase: function(value) {
      return toString(value).toUpperCase();
    },

    // Render a value as a capitalized string
    // First character is changed to an uppercase character, other characters remains unchanged
    $capitalize: function(value) {
      return $util.capitalize(toString(value));
    },

    // Get renderer by its name
    // Could be overridden by custom lookup
    $get: function(name) {
      return o[name];
    }
  };

  return o;
})();
