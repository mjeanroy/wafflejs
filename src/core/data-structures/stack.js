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

/* exported Stack */

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
 */

const Stack = (() => {
  class Node {
    constructor(value, next) {
      this.value = value;
      this.next = next || null;
    }
  }

  return class Stack {
    constructor() {
      this.root = null;
    }

    // Push new value onto the stack.
    // Running time: O(1)
    push(value) {
      this.root = new Node(value, this.root);
    }

    // Peek value from the stack.
    // Running time: O(1)
    peek() {
      return this.root ? this.root.value : undefined;
    }

    // Peek value from the stack and remove entry.
    // Running time: O(1)
    pop() {
      let value;

      if (this.root) {
        value = this.root.value;
        this.root = this.root.next;
      }

      return value;
    }

    // Check if stack is empty.
    // Running time: O(1)
    isEmpty() {
      return !this.root;
    }
  };
})();
