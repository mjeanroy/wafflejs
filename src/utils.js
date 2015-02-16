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
 * Set of utilities.
 * The goal of this module is to provide a set of static
 * utilities.
 *
 * Keep underscore compatibility as it should remain easy to
 * replace this utility object by underscore or lodash.
 */

var $util = {
  // Check if given object is undefined
  isUndefined: function(obj) {
    return typeof obj === 'undefined';
  },

  // Check if given object is null
  isNull: function(obj) {
    return obj === null;
  },

  // Check if given object is a plain old javascript object
  isObject: function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  },

  // Check if given object is a function
  isFunction: function(obj) {
    return typeof obj === 'function';
  },

  // Check that given object is a DOM element
  isElement: function(obj) {
    return !!(obj && obj.nodeType === 1);
  },

  // Clone array
  clone: function(array) {
    return [].slice.call(array);
  },

  // Apply callback for each item of array
  forEach: function(array, callback, ctx) {
    for (var i = 0, size = array.length; i < size; ++i) {
      callback.call(ctx, array[i], i, array);
    }
  },

  // Map array to a new array using callback results
  map: function(array, callback, ctx) {
    var newArray = [];
    for (var i = 0, size = array.length; i < size; ++i) {
      newArray[i] = callback.call(ctx, array[i], i, array);
    }
    return newArray;
  },

  // Tests whether all elements in the array pass the test
  // implemented by the provided function.
  every: function(array, callback, ctx) {
    for (var i = 0, size = array.length; i < size; ++i) {
      if (!callback.call(ctx, array[i], i, array)) {
        return false;
      }
    }
    return true;
  },

  // Tests whether some element in the array passes the test
  // implemented by the provided function.
  some: function(array, callback, ctx) {
    for (var i = 0, size = array.length; i < size; ++i) {
      if (callback.call(ctx, array[i], i, array)) {
        return true;
      }
    }
    return false;
  },

  // Creates a new array with all elements that pass
  // the test implemented by the provided function.
  filter: function(array, callback, ctx) {
    var newArray = [];
    for (var i = 0, size = array.length; i < size; ++i) {
      if (callback.call(ctx, array[i], i, array)) {
        newArray.push(array[i]);
      }
    }
    return newArray;
  },

  // Applies a function against an accumulator and each value
  // of the array (from left-to-right) has to reduce it to a single value.
  reduce: function(array, callback, initialValue) {
    var nbArgs = arguments.length;
    var step = nbArgs === 3 ? initialValue : array[0];
    var size = array.length;
    var i = nbArgs === 3 ? 0 : 1;

    for (; i < size; ++i) {
      step = callback.call(null, step, array[i], i, array);
    }

    return step;
  },

  // Applies a function against an accumulator and each value
  // of the array (from right-to-left) has to reduce it to a single value.
  reduceRight: function(array, callback, initialValue) {
    var nbArgs = arguments.length;
    var size = array.length - 1;
    var step = nbArgs === 3 ? initialValue : array[size];
    var i = nbArgs === 3 ? size : size - 1;

    for (; i >= 0; --i) {
      step = callback.call(null, step, array[i], i, array);
    }

    return step;
  },

  // Looks through each value in the list, returning the first one that
  // passes a truth test (predicate), or undefined if no value passes the test.
  // The function returns as soon as it finds an acceptable element, and doesn't traverse the entire list.
  find: function(array, callback, ctx) {
    for (var i = 0, size = array.length; i < size; ++i) {
      if (callback.call(ctx, array[i], i, array)) {
        return array[i];
      }
    }
    return undefined;
  }
};
