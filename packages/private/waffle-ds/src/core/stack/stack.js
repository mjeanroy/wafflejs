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

import {Node} from './node';

/**
 * Data structure that implements FIFO pattern (first-in-first-out).
 *
 * Operations allowed are:
 *     push(value)
 *     peek()
 *     pop()
 *     isEmpty()
 *
 * Each operation should run in O(1).
 *
 * @class
 */
export class Stack {
  /**
   * Create the stack.
   * @constructor
   */
  constructor() {
    this._root = null;
  }

  /**
   * Push new value onto the stack.
   * Running time: O(1).
   *
   * @param {*} value The value to pish to the stack.
   * @return {void}
   */
  push(value) {
    this._root = new Node(value, this._root);
  }

  /**
   * Peek value from the stack.
   * Running time: O(1).
   *
   * @return {*} The first value pushed to the stack.
   */
  peek() {
    return this._root ? this._root._value : undefined;
  }

  /**
   * Peek value from the stack and remove entry.
   * Running time: O(1).
   *
   * @return {*} The first value pushed to the stack.
   */
  pop() {
    let value;

    if (this._root) {
      value = this._root._value;
      this._root = this._root._next;
    }

    return value;
  }

  /**
   * Check if stack is empty.
   * Running time: O(1).
   *
   * @return {boolean} `true` if the stack is empty, `false` otherwise.
   */
  isEmpty() {
    return !this._root;
  }
}
