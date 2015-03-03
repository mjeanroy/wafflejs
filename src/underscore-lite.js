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
/* global __toString */

/**
 * Set of utilities.
 * The goal of this module is to provide a set of static
 * utilities.
 *
 * Keep underscore compatibility as it should remain easy to
 * replace this utility object by underscore or lodash.
 */

// Returns undefined irrespective of the arguments passed to it
_.noop = function() {};

// Check if given object is undefined
_.isUndefined = function(obj) {
  return typeof obj === 'undefined';
};

// Check if given object is a plain old javascript object
_.isObject = function(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};

// Check if given object is an array
_.isArray = Array.isArray || function(obj) {
  return __toString.call(obj) === '[object Array]';
};

  // Check if given object is a string
_.isString = function(obj) {
  return __toString.call(obj) === '[object String]';
};

// Check if given object is a function
_.isFunction = function(obj) {
  return __toString.call(obj) === '[object Function]';
};

// Check if given object is a number (including NaN)
_.isNumber = function(obj) {
  return __toString.call(obj) === '[object Number]';
};

// Check if given object is a date
_.isDate = function(obj) {
  return __toString.call(obj) === '[object Date]';
};

  // Check that given object is a DOM element
_.isElement = function(obj) {
  return !!(obj && obj.nodeType === 1);
};

// Clone array
_.clone = function(array) {
  var newArray = [];
  for (var i = 0, size = array.length; i < size; ++i) {
    newArray[i] = array[i];
  }
  return newArray;
};

// Apply callback for each item of array
_.forEach = function(array, callback, ctx) {
  for (var i = 0, size = array.length; i < size; ++i) {
    callback.call(ctx, array[i], i, array);
  }
};
