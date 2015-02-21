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

var $doc = {
  // Create dom element
  create: function(tagName) {
    return document.createElement(tagName);
  },

  // Find element by its id
  // To have a consistent api, this function will return an array of element.
  // If id does not exist, it will return an empty array.
  byId: function(id) {
    var node = document.getElementById(id);  
    return !!node ? [node] : [];
  },

  // Find element by tags.
  // This function will return an "array like" of dom elements.
  byTagName: function(tagName, parentNode) {
    return (parentNode || document).getElementsByTagName(tagName);
  },

  // Create new empty document fragment
  createFragment: function() {
    return document.createDocumentFragment();
  }
};

_.forEach(['tr', 'td', 'th', 'tbody', 'thead'], function(tagName) {
  $doc[tagName] = function() {
    return this.create(tagName);
  };
});
