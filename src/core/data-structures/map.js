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

/**
 * Provide a key-value data structure.
 *
 * Operations allowed are:
 *     put(key, value)
 *     get(key)
 *     contains(key)
 *     remove(key)
 *     clear()
 *
 * Each operation should run in O(1).
 */

const HashMap = (() => {
  const prefix = 'key_';
  const keyFactory = k => prefix + k;

  return class HashMap {
    constructor() {
      this.$o = {};
    }

    // Clear map
    // Running time: O(1)
    clear() {
      this.$o = {};
    }

    // Put value into map using given key
    // Running time: O(1)
    put(key, value) {
      this.$o[keyFactory(key)] = value;
      return this;
    }

    // Get value associated to given key
    // Running time: O(1)
    get(key) {
      return this.$o[keyFactory(key)];
    }

    // Remove value associated to given key
    // Running time: O(1)
    remove(key) {
      delete this.$o[keyFactory(key)];
      return this;
    }

    // Check if given key is inside the map
    // Running time: O(1)
    contains(key) {
      return _.has(this.$o, keyFactory(key));
    }
  };
})();
