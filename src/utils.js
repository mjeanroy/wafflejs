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
  }
};
