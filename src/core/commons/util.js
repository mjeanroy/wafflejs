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
/* global $json */
/* exported $util */

/**
 * Set of utilities functions.
 * These functions should remain simple and waffle agnostic.
 */

var $util = {
  // Get version of Internet Explorer
  msie: function() {
    return document.documentMode;
  },

  // Check if string end with given suffix
  endWith: function(value, suffix) {
    return !!value && value.slice(value.length - suffix.length) === suffix;
  },

  // Check if value is a pixel value
  isPx: function(value) {
    return $util.endWith(value, 'px');
  },

  // Check if value is a percentage value
  isPercentage: function(value) {
    return $util.endWith(value, '%');
  },

  // Convert percentage string value to percentage number
  fromPercentage: function(value) {
    return _.isString(value) ? Number(value.replace('%', '')) : value;
  },

  // Translate a value to a valid px notation
  //   toPx(1OO) => '100px'
  //   toPx('100px') => '100px'
  toPx: function(value) {
    return _.isNumber(value) ? value + 'px' : value;
  },

  // Translate a px notation to a valid number
  //   fromPx('100px') => 100
  //   fromPx(100) => 100
  fromPx: function(value) {
    return _.isString(value) ? Number(value.replace('px', '')) : value;
  },

  // Capitalize given string
  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Get the result of given function.
  // If first argument is not a function, then it is automatically
  // returned.
  // Otherwise, function is executed using ctx as context and args as
  // arguments.
  resultWith: function(fn, ctx, args) {
    return _.isFunction(fn) ? fn.apply(ctx, args) : fn;
  },

  // Split array (or array like object) into smaller arrays.
  // Returned value is an array of smaller arrays (a.k.a chunks).
  split: function(array, size) {
    var actualSize = size || 20;
    var chunks = [];

    var chunk = [];
    for (var i = 0, length = array.length; i < length; ++i) {
      chunk.push(array[i]);

      if (chunk.length === actualSize) {
        chunks.push(chunk);
        chunk = [];
      }
    }

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    return chunks;
  },

  // Parse value
  parse: function(json) {
    try {
      return $json.fromJson(json);
    }
    catch (e) {
      // This should probably be a simple value

      if (json === 'false') {
        return false;
      }

      if (json === 'true') {
        return true;
      }

      var nb = Number(json);
      return _.isNaN(nb) ? json : nb;
    }
  },

  // Destroy object by setting null to object own properties.
  // Note that this function will also destroy prototype attribute,
  // so this function must be called when object does not need to
  // be used anymore.
  destroy: function(o) {
    for (var i in o) {
      if (_.has(o, i)) {
        o[i] = null;
      }
    }
  },

  // Turn a camel case string to a spinal case string.
  toSpinalCase: function(str) {
    var result = '';

    for (var i = 0, size = str.length; i < size; ++i) {
      var current = str.charAt(i);
      if (current.toLowerCase() === current) {
        result += current;
      } else {
        result += '-' + current.toLowerCase();
      }
    }

    return result;
  },

  // Execute asynchronous tasks on small chunks of data.
  asyncTask: function(chunks, delay, onIteration, onEnded) {
    var idx = 0;

    var timer = function() {
      if (chunks.length > 0) {
        var current = chunks.shift();
        onIteration(current, idx);
        idx += current.length;

        // Trigger next chunk
        if (chunks.length > 0) {
          setTimeout(timer, delay);
        } else {
          onEnded();
          timer = null;
        }
      }
    };

    setTimeout(timer);
  }
};
