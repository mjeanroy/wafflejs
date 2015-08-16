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

var Stack = (function() {
  var Node = function(value, next) {
    this.value = value;
    this.next = next || null;
  };

  var Stack = function() {
    this.root = null;
  };

  Stack.prototype = {
    // Push new value onto the stack.
    push: function(value) {
      this.root = new Node(value, this.root);
    },

    // Peek value from the stack.
    peek: function() {
      return this.root ? this.root.value : undefined;
    },

    // Peek value from the stack and remove entry.
    pop: function() {
      var value;

      if (this.root) {
        value = this.root.value;
        this.root = this.root.next;
      }

      return value;
    },

    // Check if stack is empty.
    isEmpty: function() {
      return !this.root;
    }
  };

  return Stack;
})();
