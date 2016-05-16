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

/* jshint newcap: false */

/* global _ */
/* exported $ */

/**
 * Really simple implementation of some jQuery api.
 * This implementation should never be published.
 */

const $ = (() => {

  const JqLite = function(nodes) {
    if (nodes instanceof JqLite) {
      return nodes;
    }

    if (!(this instanceof JqLite)) {
      return new JqLite(nodes);
    }

    if (nodes === window) {
      nodes = [window];
    } else if (_.isElement(nodes)) {
      nodes = [nodes];
    }

    _.forEach(nodes, (node, idx) => this[idx] = node);

    this.length = nodes.length;

    // Store internal event listeners binded
    // with addEventListener or attachEvent
    // This will be used to remove event listeners
    this.$$events = [];
  };

  // Bind event
  const bind = ($o, event, callback, node) => {
    node.addEventListener(event, callback);

    // Track event
    $o.$$events.push({
      event: event,
      callback: callback,
      node: node
    });
  };

  // Unbind event
  const unbind = ($o, event, callback, node) => node.removeEventListener(event, callback);

  // Iterate over all internal elements applying given function
  // and return current context value
  const iterate = ($o, fn) => {
    _.forEach($o, fn, $o);
    return $o;
  };

  JqLite.prototype = {
    // Get the children of each element in the set of matched elements.
    children: function() {
      const children = [];

      iterate(this, node => {
        _.forEach(node.childNodes, childNode => {
          if (childNode.nodeType === 1) {
            children.push(childNode);
          }
        });
      });

      return new JqLite(children);
    },

    // Reduce the set of matched elements to the one at the specified index.
    eq: function(index) {
      return new JqLite(this[index]);
    },

    // Attach event(s)
    on: function(events, callback) {
      const array = events.indexOf(' ') >= 0 ? events.split(' ') : [events];

      for (let i = 0, size = array.length; i < size; ++i) {
        for (let k = 0, ln = this.length; k < ln; ++k) {
          bind(this, array[i], callback, this[k]);
        }
      }

      return this;
    },

    // Detach events
    off: function(events, listener) {
      const array = events ?
        (events.indexOf(' ') >= 0 ? events.split(' ') : [events]) :
        [];

      const nbEvents = array.length;
      const $$events = [];

      for (let i = 0, size = this.$$events.length; i < size; ++i) {
        const e = this.$$events[i];

        let found = nbEvents === 0;
        for (let k = 0; k < nbEvents; ++k) {
          const current = array[k];
          if ((!current || e.event === current) && (!listener || e.callback === listener)) {
            found = true;
            break;
          }
        }

        if (!found) {
          $$events.push(e);
        } else {
          unbind(this, e.event, e.callback, e.node);
        }
      }

      this.$$events = $$events;
    },

    // Clear node
    empty: function() {
      return iterate(this, node => {
        while (node.firstChild) {
          node.removeChild(node.firstChild);
        }
      });
    },

    // Append node
    append: function(childNode) {
      return iterate(this, (node, idx, collection) => {
        const clone = idx === (collection.length - 1) ? childNode : childNode.cloneNode(true);
        node.appendChild(clone);
      });
    },

    // Prepend node
    prepend: function(childNode) {
      return iterate(this, (node, idx, collection) => {
        const clone = idx === (collection.length - 1) ? childNode : childNode.cloneNode(true);
        node.insertBefore(clone, node.childNodes[0]);
      });
    },

    // Append node after element
    after: function(childNode) {
      return iterate(this, (node, idx, collection) => {
        const clone = idx === (collection.length - 1) ? childNode : childNode.cloneNode(true);
        node.parentNode.insertBefore(clone, node.nextSibling);
      });
    },

    // Add inline style
    css: function(propertyName, value) {
      let styles;
      let keys;

      if (_.isObject(propertyName)) {
        styles = propertyName;
        keys = _.keys(styles);
      } else {
        styles = {
          [propertyName]: value
        };

        keys = [propertyName];
      }

      return iterate(this, node => {
        _.forEach(keys, propertyName => node.style[propertyName] = styles[propertyName]);
      });
    },

    // Add css class
    addClass: function(css) {
      return iterate(this, node => {
        const actualCss = node.className;
        node.className = (actualCss ? actualCss + ' ' : '') + css;
      });
    },

    // Remove a single class, multiple classes in the set of matched elements.
    removeClass: function(classes) {
      const css = classes.split(' ');
      const map = _.indexBy(css, c => c);

      return iterate(this, node => {
        const actualClasses = node.className;
        const newClasses = _.filter(actualClasses.split(' '), c => !map[c]);
        node.className = newClasses.join(' ');
      });
    },

    // Set attribute to value
    attr: function(name, value) {
      let values = name;
      let keys;

      if (arguments.length === 2) {
        values = {
          [name]: value
        };

        keys = [name];
      } else {
        keys = _.keys(values);
      }

      return iterate(this, node => {
        _.forEach(keys, k => node.setAttribute(k, values[k]));
      });
    },

    // Remove attribute
    removeAttr: function(name) {
      return iterate(this, node => node.removeAttribute(name));
    }
  };

  return JqLite;
})();
