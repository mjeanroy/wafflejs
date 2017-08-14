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
 * Create the `filter` function.
 *
 * @return {function} The `filter` function.
 */
export function filterFactory() {
  /**
   * Creates a new array with all elements that pass the test implemented
   * by the provided function.
   *
   * @param {Array} collection Array (or "array-like" object).
   * @param {function} predicate Predicate function.
   * @param {*} ctx Callback context (i.e value of `this`).
   * @return {void}
   */
  return function filter(collection, predicate, ctx) {
    const newArray = [];

    for (let i = 0, size = collection.length; i < size; ++i) {
      if (predicate.call(ctx, collection[i], i, collection)) {
        newArray.push(collection[i]);
      }
    }

    return newArray;
  };
}
