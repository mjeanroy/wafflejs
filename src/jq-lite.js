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

var $ = function(nodes) {
  if (nodes instanceof $) {
  	return nodes;
  }

  if (!(this instanceof $)) {
    return new $(nodes);
  }

  if (_.isElement(nodes)) {
    nodes = [nodes];
  }

  _.forEach(nodes, function(node, idx) {
    this[idx] = node;
  }, this);

  this.length = nodes.length;

  // Store internal event listeners binded
  // with addEventListener or attachEvent
  // This will be used to remove event listeners
  this.$$events = [];
};

$.prototype = {
  $$each: function(fn) {
    for (var i = 0; i < this.length; ++i) {
      fn.call(this, this[i], i, this);
    }

    return this;
  },

  // Bind event
  // This is a cross browser implementation
  $$bind: function(event, callback, node) {
    // Should we support IE < 9 ?
    node.addEventListener(event, callback);

    // Track event
    this.$$events.push({
      event: event,
      callback: callback,
      node: node
    });
  },

  // Bind event
  // This is a cross browser implementation
  $$unbind: function(event, callback, node) {
    // Should we support IE < 9 ?
    node.removeEventListener(event, callback);
  },

  // Attach event
  on: function(event, callback) {
    return this.$$each(function(node) {
      this.$$bind(event, callback, node);
    });
  },

  // Detach events
  off: function() {
    for (var i = 0, size = this.$$events.length; i < size; ++i) {
      var e = this.$$events[i];
      this.$$unbind(e.event, e.callback, e.node);
    }

    this.$$events = [];
  },

  // Clear node
  empty: function() {
    return this.$$each(function(node) {
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    });
  },

  // Remove node from DOM
  remove: function() {
    return this.$$each(function(node) {
      node.parentNode.removeChild(node);
    });
  },

  // Append node
  append: function(childNode) {
    return this.$$each(function(node, idx) {
      var child = idx ? childNode.cloneNode(true) : childNode;
      node.appendChild(child);
    });
  },

  // Add css class
  addClass: function(classes) {
    var css = _.isArray(classes) ? classes.join(' ') : classes;
    return this.$$each(function(node) {
      var actualCss = node.className;
      node.className = (actualCss ? actualCss + ' ' : '') + css;
    });
  },

  // Replace html content
  html: function(html) {
    return this.$$each(function(node) {
      node.innerHTML = html;
    });
  },

  // Set attribute to value
  attr: function(name, value) {
    var values = name;
    var keys;

    if (arguments.length === 2) {
      values = {};
      values[name] = value;
      keys = [name];
    } else {
      keys = _.keys(values);
    }

    return this.$$each(function(node) {
      _.forEach(keys, function(k) {
        node.setAttribute(k, values[k]);
      });
    });
  }
};
