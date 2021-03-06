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

const _ = (function() {

  const ArrayProto = Array.prototype;
  const nativeSlice = ArrayProto.slice;
  const ObjectProto = Object.prototype;
  const nativeKeys = Object.keys;
  const hasOwnProperty = ObjectProto.hasOwnProperty;
  const toString = ObjectProto.toString;
  const nativeBind = Function.prototype.bind;

  // Create initial empty object.
  const _ = {};

  const callbackWrapper = callback => {
    if (_.isString(callback)) {
      return value => value[callback];
    }

    return callback;
  };

  const groupByWrapper = behavior => {
    return (array, callback, ctx) => {
      const result = {};
      const iteratee = callbackWrapper(callback);

      for (let i = 0, size = array.length; i < size; ++i) {
        const key = iteratee.call(ctx, array[i], i, array);
        behavior(result, array[i], key);
      }

      return result;
    };
  };

  // Check if given object is null
  _.isNull = obj => obj === null;

  // Check if given object is a boolean
  _.isBoolean = obj => obj === true || obj === false || toString.call(obj) === '[object Boolean]';

  // Bind a function to an object, meaning that whenever the function is called,
  // the value of this will be the object.
  _.bind = (fn, ctx) => {
    if (nativeBind) {
      return fn.bind(ctx);
    }

    return () => fn.apply(ctx, arguments);
  };

  // Creates a function that returns the same value that is used as the
  // argument of _.constant.
  _.constant = value => () => value;

  // Creates a real Array from the list (anything that can be iterated over).
  // Useful for transmuting the arguments object.
  _.toArray = obj => _.map(obj, value => value);

  // Is the given value NaN? (NaN is the only number which does not equal itself).
  _.isNaN = obj => _.isNumber(obj) && obj !== +obj;

  // Creates a version of the function that can only be called one time.
  // Repeated calls to the modified function will have no effect, returning the value
  // from the original call.
  _.once = fn => {
    let wasCalled = false;
    let returnValue;

    return function() {
      if (!wasCalled) {
        wasCalled = true;
        returnValue = fn.apply(this, arguments);
        fn = null;
      }

      return returnValue;
    };
  };

  // Fill in undefined properties in object with the first value present in the default objects.
  _.defaults = (o1, o2) => {
    _.forEach(_.keys(o2), k => {
      if (_.isUndefined(o1[k])) {
        o1[k] = o2[k];
      }
    });

    return o1;
  };

  // If the value of the named property is a function, then invoke it with
  // the object as context, otherwise return it.
  _.result = (o, prop) => {
    const value = o[prop];
    return _.isFunction(value) ? value.call(o) : value;
  };

  // Check if object has given key
  _.has = (object, key) => hasOwnProperty.call(object, key);

  // Return the number of values in the list.
  _.size = array => array == null ? 0 : array.length;

  // Returns the first element of an array.
  // Passing n will return the first n elements of the array.
  _.first = (array, n) => n == null ? array[0] : nativeSlice.call(array, 0, n);

  // Returns the last element of an array.
  // Passing n will return the last n elements of the array.
  _.last = (array, n) => n == null ? array[array.length - 1] : nativeSlice.call(array, array.length - n, array.length);

  // Returns the rest of the elements in an array.
  // Pass an index to return the values of the array from that index onward.
  _.rest = function(array, index) {
    const start = arguments.length > 1 ? index : 1;
    return nativeSlice.call(array, start, array.length);
  };

  // Returns the rest of the elements in an array.
  // Pass an index to return the values of the array from that index onward.
  _.initial = function(array, index) {
    const length = array.length;
    const end = arguments.length > 1 ? length - index : length - 1;
    return nativeSlice.call(array, 0, end);
  };

  // Return the position of the first occurrence of an item in an array, or -1
  // if the item is not included in the array.
  _.indexOf = (array, item) => {
    for (let i = 0, size = array.length; i < size; ++i) {
      if (array[i] === item) {
        return i;
      }
    }
    return -1;
  };

  // Return the position of the last occurrence of an item in an array, or -1
  // if the item is not included in the array.
  _.lastIndexOf = (array, item) => {
    for (let i = array.length - 1; i >= 0; --i) {
      if (array[i] === item) {
        return i;
      }
    }
    return -1;
  };

  // Check that array contains given item.
  _.contains = (array, item) => _.indexOf(array, item) >= 0;

  // Get all keys of object
  _.keys = object => {
    if (!_.isObject(object)) {
      return [];
    }

    if (nativeKeys) {
      return nativeKeys(object);
    }

    const keys = [];

    for (let key in object) {
      if (_.has(object, key)) {
        keys.push(key);
      }
    }

    return keys;
  };

  // Returns a sorted list of the names of every method in an object.
  _.functions = obj => {
    const names = [];

    for (let key in obj) {
      if (_.isFunction(obj[key])) {
        names.push(key);
      }
    }

    return names.sort();
  };

  // Map array to a new array using callback results
  _.map = (array, callback, ctx) => {
    const newArray = [];
    for (let i = 0, size = array.length; i < size; ++i) {
      newArray[i] = callback.call(ctx, array[i], i, array);
    }
    return newArray;
  };

  // Tests whether all elements in the array pass the test
  // implemented by the provided function.
  _.every = (array, callback, ctx) => {
    for (let i = 0, size = array.length; i < size; ++i) {
      if (!callback.call(ctx, array[i], i, array)) {
        return false;
      }
    }
    return true;
  };

  // Tests whether some element in the array passes the test
  // implemented by the provided function.
  _.some = (array, callback, ctx) => {
    for (let i = 0, size = array.length; i < size; ++i) {
      if (callback.call(ctx, array[i], i, array)) {
        return true;
      }
    }
    return false;
  };

  // Creates a new array with all elements that pass
  // the test implemented by the provided function.
  _.filter = (array, callback, ctx) => {
    const newArray = [];
    for (let i = 0, size = array.length; i < size; ++i) {
      if (callback.call(ctx, array[i], i, array)) {
        newArray.push(array[i]);
      }
    }
    return newArray;
  };

  // Returns the values in list without the elements that the truth test (predicate) passes.
  _.reject = (array, callback, ctx) => {
    const newArray = [];
    for (let i = 0, size = array.length; i < size; ++i) {
      if (!callback.call(ctx, array[i], i, array)) {
        newArray.push(array[i]);
      }
    }
    return newArray;
  };

  // Applies a function against an accumulator and each value
  // of the array (from left-to-right) has to reduce it to a single value.
  _.reduce = function(array, callback, initialValue, ctx) {
    const nbArgs = arguments.length;
    const size = array.length;

    let step = nbArgs >= 3 ? initialValue : array[0];
    let i = nbArgs >= 3 ? 0 : 1;

    for (; i < size; ++i) {
      step = callback.call(ctx, step, array[i], i, array);
    }

    return step;
  };

  // Applies a function against an accumulator and each value
  // of the array (from right-to-left) has to reduce it to a single value.
  _.reduceRight = function(array, callback, initialValue, ctx) {
    const nbArgs = arguments.length;
    const size = array.length - 1;

    let step = nbArgs >= 3 ? initialValue : array[size];
    let i = nbArgs >= 3 ? size : size - 1;

    for (; i >= 0; --i) {
      step = callback.call(ctx, step, array[i], i, array);
    }

    return step;
  };

  // Looks through each value in the list, returning the first one that
  // passes a truth test (predicate), or undefined if no value passes the test.
  // The function returns as soon as it finds an acceptable element, and doesn't traverse the entire list.
  _.find = (array, callback, ctx) => {
    for (let i = 0, size = array.length; i < size; ++i) {
      if (callback.call(ctx, array[i], i, array)) {
        return array[i];
      }
    }
    return undefined;
  };

  // Split a collection into two arrays: one whose elements all
  // satisfy the given predicate, and one whose elements all
  // do not satisfy the predicate.
  _.partition = (array, iteratee) => {
    const pass = [];
    const fail = [];

    for (let i = 0, size = array.length; i < size; ++i) {
      if (iteratee.call(null, array[i], i, array)) {
        pass.push(array[i]);
      } else {
        fail.push(array[i]);
      }
    }

    return [pass, fail];
  };

  // Memoize an expensive function by storing its results.
  _.memoize = (func, hasher) => {
    var memoize = function(key) {
      const cache = memoize.cache;
      const address = hasher ? hasher.apply(this, arguments) : key;
      if (!_.has(cache, address)) {
        cache[address] = func.apply(this, arguments);
      }
      return cache[address];
    };

    memoize.cache = {};

    return memoize;
  };

  // // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = (func, wait, immediate) => {
    var timeout;
    return function() {
      const context = this;
      const args = arguments;

      var later = () => {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };

      var callNow = immediate && !timeout;

      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      timeout = setTimeout(later, wait);

      if (callNow) {
        func.apply(context, args);
      }
    };
  };

  // Wrap the function inside of the wrapper function, passing it
  // as the first argument.
  _.wrap = (fn, wrapper) => {
    return function() {
      const args = _.toArray(arguments);
      const newArgs = [fn].concat(args);
      return wrapper.apply(this, newArgs);
    };
  };

  // Return current timestamp.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  let uid = 0;

  // Generate a unique integer id (unique within the entire client session).
  _.uniqueId = prefix => {
    const id = ++uid + '';
    return prefix ? prefix + id : id;
  };

  // Given a list, and an iteratee function that returns a key for each element in the list (or a property name),
  // returns an object with an index of each item.
  _.indexBy = groupByWrapper((result, value, key) => result[key] = value);

  // Splits a collection into sets, grouped by the result of
  // running each value through iteratee.
  // If iteratee is a string instead of a function, groups by the property
  // named by iteratee on each of the values.
  _.groupBy = groupByWrapper((result, value, key) => (result[key] = result[key] || []).push(value));

  // Sorts a list into groups and returns a count for the number of objects
  // in each group. Similar to groupBy, but instead of returning a list of values,
  // returns a count for the number of values in that group.
  _.countBy = groupByWrapper((result, value, key) => result[key] = (result[key] || 0) + 1);

  return _;

})();
