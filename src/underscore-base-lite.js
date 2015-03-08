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
/* exported _ */

/**
 * Set of utilities.
 * The goal of this module is to provide a set of static
 * utilities.
 *
 * Keep underscore compatibility as it should remain easy to
 * replace this utility object by underscore or lodash.
 */

var __ArrayProto = Array.prototype;
var __slice = __ArrayProto.slice;
var __ObjectProto = Object.prototype;
var __nativeKeys = Object.keys;
var __hasOwnProperty = __ObjectProto.hasOwnProperty;
var __toString = __ObjectProto.toString;
var __nativeBind = Function.prototype.bind;

var _ = {
  // Check if given object is null
  isNull: function(obj) {
    return obj === null;
  },

  // Check if given object is a boolean
  isBoolean: function(obj) {
    return obj === true || obj === false || __toString.call(obj) === '[object Boolean]';
  },

  // Bind a function to an object, meaning that whenever the function is called,
  // the value of this will be the object.
  bind: function(fn, ctx) {
    if (__nativeBind) {
      return fn.bind(ctx);
    }

    return function() {
      return fn.apply(ctx, arguments);
    };
  },

  // Creates a real Array from the list (anything that can be iterated over).
  // Useful for transmuting the arguments object.
  toArray: function(obj) {
    return _.map(obj, function(value) {
      return value;
    });
  },

  // Check if object has given key
  has: function(object, key) {
    return __hasOwnProperty.call(object, key);
  },

  // Returns the first element of an array.
  // Passing n will return the first n elements of the array.
  first: function(array, n) {
    if (n == null) {
      return array[0];
    }
    return __slice.call(array, 0, n);
  },

  // Returns the last element of an array.
  // Passing n will return the last n elements of the array.
  last: function(array, n) {
    if (n == null) {
      return array[array.length - 1];
    }
    return __slice.call(array, array.length - n, array.length);
  },

  // Return the position of the first occurrence of an item in an array, or -1
  // if the item is not included in the array.
  indexOf: function(array, item) {
    for (var i = 0, size = array.length; i < size; ++i) {
      if (array[i] === item) {
        return i;
      }
    }
    return -1;
  },

  // Return the position of the last occurrence of an item in an array, or -1
  // if the item is not included in the array.
  lastIndexOf: function(array, item) {
    for (var i = array.length - 1; i >= 0; --i) {
      if (array[i] === item) {
        return i;
      }
    }
    return -1;
  },

  // Get all keys of object
  keys: function(object) {
    if (!_.isObject(object)) {
      return [];
    }

    if (__nativeKeys) {
      return __nativeKeys(object);
    }

    var keys = [];
    for (var key in object) {
      if (_.has(object, key)) {
        keys.push(key);
      }
    }

    return keys;
  },

  // Returns a sorted list of the names of every method in an object.
  functions: function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) {
        names.push(key);
      }
    }
    return names.sort();
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

  // Returns the values in list without the elements that the truth test (predicate) passes. 
  reject: function(array, callback, ctx) {
    var newArray = [];
    for (var i = 0, size = array.length; i < size; ++i) {
      if (!callback.call(ctx, array[i], i, array)) {
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
  },

  // Given a list, and an iteratee function that returns a key for each element in the list (or a property name),
  // returns an object with an index of each item.
  indexBy: function(array, callback, ctx) {
    var result = {};
    for (var i = 0, size = array.length; i < size; ++i) {
      var current = array[i];
      var key = callback.call(ctx, current, i, array);
      result[key] = current;
    }
    return result;
  }
};
