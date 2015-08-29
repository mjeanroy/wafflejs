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

/* exported Change */

var Change = (function() {
  var newChange = function(type, removed, added, index, collection) {
    return {
      type: type,
      removed: removed,
      index: index,
      addedCount: added.length,
      object: collection,

      // This field does not exist in API specification, but it is mandatory
      // to parse added elements in an efficient way.
      // See: https://github.com/arv/ecmascript-object-observe/issues/24
      added: added
    };
  };

  return {
    // Create new splice change.
    createSplice: function(removed, added, index, object) {
      return newChange('splice', removed, added, index, object);
    },

    // Create new update change.
    createUpdate: function(index, object) {
      return newChange('update', [], [], index, object);
    }
  };
})();
