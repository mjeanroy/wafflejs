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
/* global $util */
/* exported $doc */

var $doc = (function() {

  var scrollbarWidth = function() {
    var scrollDiv = document.createElement('div');
    scrollDiv.style.width = '100px';
    scrollDiv.style.height = '100px';
    scrollDiv.style.overflow = 'scroll';
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';

    document.body.appendChild(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    return scrollbarWidth;
  };

  var hasher = function() {
    return 'body';
  };

  var o = {
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
    },

    // Find parent by its tag name.
    // If parent does not exist, null will be returned.
    findParent: function(node, parentTagName) {
      while (node && node.tagName !== parentTagName) {
        node = node.parentNode;
      }
      return node;
    },

    // Merge two nodes.
    // If nodes are text node, html content is replaced
    // Otherwise, for node elements:
    // - Update attributes
    // - Update className
    // - Update childs recursively
    mergeNodes: function(oldNode, newNode) {
      if (oldNode.nodeType === 3) {
        // This is a text node
        if (oldNode.nodeValue !== newNode.nodeValue) {
          oldNode.nodeValue = newNode.nodeValue;
        }
      } else {
        // This is a node element
        o.updateAttributes(oldNode, newNode);
        o.updateClassName(oldNode, newNode);

        var oldChildNodes = oldNode.childNodes;
        var newChildNodes = newNode.childNodes;
        for (var i = 0, nbChilds = oldChildNodes.length; i < nbChilds; ++i) {
          o.mergeNodes(oldChildNodes[i], newChildNodes[i]);
        }
      }
    },

    // Update attributes of old node with attributes of new node
    updateAttributes: function(oldNode, newNode) {
      var oldAttributes = oldNode.attributes;
      var newAttributes = newNode.attributes;

      _.forEach(newAttributes, function(attr, idx) {
        var oldValue = oldAttributes[idx].value;
        var newValue = newAttributes[idx].value;
        if (oldValue !== newValue) {
          oldNode.setAttribute(attr.name, newValue);
        }
      });
    },

    // Update attributes of old node with attributes of new node
    updateClassName: function(oldNode, newNode) {
      var oldClassName = oldNode.className;
      var newClassName = newNode.className;
      if (oldClassName !== newClassName) {
        oldNode.className = newNode.className;
      }
    },

    // Compute scrollbar width
    scrollbarWidth: _.memoize(scrollbarWidth, hasher)
  };

  _.forEach(['tr', 'td', 'th', 'tbody', 'thead','tfoot', 'input', 'select', 'option', 'span'], function(tagName) {
    o[tagName] = function() {
      return this.create(tagName);
    };
  });

  _.forEach(['text', 'checkbox', 'number', 'email', 'url'], function(type) {
    var fnName = 'input' + $util.capitalize(type);
    o[fnName] = function() {
      var input = this.input();
      input.setAttribute('type', type);
      return input;
    };
  });

  return o;

})();
