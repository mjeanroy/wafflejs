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

/**
 * Set of utilities.
 * The goal of this module is to provide a set of static
 * utilities.
 *
 * Keep underscore compatibility as it should remain easy to
 * replace this utility object by underscore or lodash.
 */

(() => {
  const toString = Object.prototype.toString;

  // Returns undefined irrespective of the arguments passed to it
  _.noop = function() {};

  // Returns the same value that is used as the argument
  _.identity = value => value;

  // Check if given object is undefined
  _.isUndefined = obj => typeof obj === 'undefined';

  // Check if given object is a plain old javascript object
  _.isObject = obj => {
    const type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Check that given object is a DOM element
  _.isElement = obj => !!(obj && obj.nodeType === 1);

  // Clone array or object.
  _.clone = o => _.isArray(o) ? _.map(o, _.identity) : _.extend({}, o);

  // Apply callback for each item of array
  _.forEach = (array, callback, ctx) => {
    for (let i = 0, size = array.length; i < size; ++i) {
      callback.call(ctx, array[i], i, array);
    }
  };

  // Copy all of the properties in the source objects over to the
  // destination object.
  _.extend = (destination, source) => {
    for (let i in source) {
      if (_.has(source, i)) {
        destination[i] = source[i];
      }
    }
    return destination;
  };

  // Generic is<Type> functions
  _.forEach(['String', 'Function', 'Number', 'Date', 'Array'], type => {
    _['is' + type] = o => toString.call(o) === '[object ' + type + ']';
  });

  // Optimisation: use native isArray if available
  // http://jsperf.com/isarray-vs-instanceof/22
  if (Array.isArray) {
    _.isArray = Array.isArray;
  }

})();
