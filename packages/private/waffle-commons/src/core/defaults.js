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
 * Create a `defaults` function with provided `forEach`, `keys` and `isUndefined`
 * functions.
 *
 * @param {function} forEach The `forEach` function.
 * @param {function} keys The `keys` function.
 * @param {function} isUndefined The `isUndefined` function.
 * @return {function} The `defaults` function.
 */
export function defaultsFactory(forEach, keys, isUndefined) {
  /**
   * Fill in undefined properties in object `o1` with the value present
   * in object `o2`.
   *
   * @param {Object} o1 First object.
   * @param {Object} o2 Second object containing default values.
   * @return {Object} Object `o1` filled with default values.
   */
  return function defaults(o1, o2) {
    forEach(keys(o2), (k) => {
      if (isUndefined(o1[k])) {
        o1[k] = o2[k];
      }
    });

    return o1;
  };
}
