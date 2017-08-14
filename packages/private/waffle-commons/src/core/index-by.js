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

/**
 * Create the `indexBy` function.
 *
 * @param {function} isString The `isString` function.
 * @return {function} The `indexBy` function.
 */
export function indexByFactory(isString) {
  /**
   * Given a list, and an iteratee function that returns a key for each element in the
   * list (or a property name), returns an object with an index of each item.
   *
   * @param {Array} collection Array (or "array-like" object).
   * @param {string|function} predicate Predicate function.
   * @param {*} ctx Callback context (i.e value of `this`).
   * @return {void}
   */
  return function indexBy(collection, predicate, ctx) {
    const result = {};
    const iteratee = isString(predicate) ? (o) => o[predicate] : predicate;

    for (let i = 0, size = collection.length; i < size; ++i) {
      const value = collection[i];
      const key = iteratee.call(ctx, value, i, collection);
      result[key] = value;
    }

    return result;
  };
}
