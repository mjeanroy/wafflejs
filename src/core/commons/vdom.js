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
/* exported $vdom */

/**
 * Provide functions to merge DOM nodes.
 */

var $vdom = (function() {
  var replaceNode = function(rootNode, oldNode, newNode) {
    return rootNode.replaceChild(newNode, oldNode);
  };

  var updateTextNode = function(oldNode, newNode) {
    if (oldNode.nodeValue !== newNode.nodeValue) {
      oldNode.nodeValue = newNode.nodeValue;
    }
  };

  var replaceContent = function(oldNode, newNode) {
    while (oldNode.firstChild) {
      oldNode.removeChild(oldNode.firstChild);
    }

    while (newNode.firstChild) {
      oldNode.appendChild(newNode.firstChild);
    }
  };

  var mergeNodes = function(oldNode, newNode) {
    o.mergeAttributes(oldNode, newNode);

    var oldChildNodes = oldNode.childNodes;
    var newChildNodes = newNode.childNodes;

    if (oldChildNodes.length !== newChildNodes.length) {
      // We can't merge tree easily, just replace the entire content
      replaceContent(oldNode, newNode);
    } else {
      for (var i = 0, size = oldChildNodes.length; i < size; ++i) {
        o.mergeNodes(oldNode, oldChildNodes[i], newChildNodes[i]);
      }
    }
  };

  var o = {
    // Merge two nodes.
    // If nodes are text node, html content is replaced
    // Otherwise, for node elements:
    // - Update attributes
    // - Update className
    // - Update childs recursively
    mergeNodes: function(rootNode, oldNode, newNode) {
      var oldType = oldNode.nodeType;
      var newType = newNode.nodeType;

      var oldTagName = oldNode.tagName;
      var newTagName = newNode.tagName;

      var result = oldNode;

      if (oldType !== newType || oldTagName !== newTagName) {
        // We can't easily merge two different node, just replace
        // the old one with the new one
        replaceNode(rootNode, oldNode, newNode);
        result = newNode;
      } else if (oldType === 3) {
        // Both are text nodes, we can just update the node value
        updateTextNode(oldNode, newNode);
      } else {
        // Both are same types and same tags, merge both
        mergeNodes(oldNode, newNode);
      }

      return result;
    },

    // Update attributes of old node with attributes of new node
    mergeAttributes: function(oldNode, newNode) {
      var oldAttributes = _.indexBy(oldNode.attributes, 'name');
      var newAttributes = _.indexBy(newNode.attributes, 'name');

      // Update and add new attributes
      _.forEach(_.keys(newAttributes), function(name) {
        var oldAttr = oldAttributes[name] || null;
        var oldValue = oldAttr ? oldAttr.value : null;
        var newValue = newAttributes[name].value;

        if (oldValue !== newValue) {
          oldNode.setAttribute(name, newValue);
        }

        if (oldAttr) {
          delete oldAttributes[name];
        }
      });

      // Remove missing
      _.forEach(_.keys(oldAttributes), function(name) {
        oldNode.removeAttribute(name);
      });
    }
  };

  return o;
})();
