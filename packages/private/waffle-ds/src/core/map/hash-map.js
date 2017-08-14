/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2017 Mickael Jeanroy
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

import {has} from '@waffle/commons';

const prefix = 'key_';
const keyFactory = (k) => `${prefix}${k}`;

/**
 * Provide a key-value data structure.
 *
 * Operations allowed are:
 *     `put(key, value)`
 *     `get(key)`
 *     `contains(key)`
 *     `remove(key)`
 *     `clear()`
 *
 * Each operation should run in O(1).
 *
 * @constructor
 */
export class HashMap {
  /**
   * Initialize empty map.
   */
  constructor() {
    this._o = {};
  }

  /**
   * Clear map.
   * Running time: O(1).
   *
   * @return {void}
   */
  clear() {
    this._o = {};
  }

  // Put value into map using given key
  // Running time: O(1)
  /**
   * Put value into map using given key.
   * Running time: O(1).
   *
   * @param {string|number} key The entry key.
   * @param {*} value The value.
   * @return {HashMap} The map (for chaining).
   */
  put(key, value) {
    this._o[keyFactory(key)] = value;
    return this;
  }

  /**
   * Get value associated to given key.
   * Running time: O(1).
   *
   * @param {string|number} key The entry key.
   * @return {*} Found value, `undefined` if value is not present.
   */
  get(key) {
    return this._o[keyFactory(key)];
  }

  /**
   * Remove value associated to given key.
   * Running time: O(1).
   *
   * @param {string|number} key Entry key.
   * @return {HashMap} The map (for chaining).
   */
  remove(key) {
    delete this._o[keyFactory(key)];
    return this;
  }

  /**
   * Check if given key is inside the map.
   * Running time: O(1).
   *
   * @param {string|number} key Entry key.
   * @return {boolean} `true` if a value is present for given key, `false` otherwise.
   */
  contains(key) {
    return has(this._o, keyFactory(key));
  }
}
