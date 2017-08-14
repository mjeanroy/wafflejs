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

import {isElement, isObject, has, keys, forEach, indexBy, filter} from '@waffle/commons';

/**
 * A jQuery Like basic implementation:
 * - Do not support IE < 9.
 * - Do not support `.data` method.
 */
export class JqLite {
  /**
   * The jQLite constructor.
   *
   * @param {*} nodes DOM Nodes.
   * @constructor
   */
  constructor(nodes) {
    if (nodes === window) {
      nodes = [window];
    } else if (isElement(nodes)) {
      nodes = [nodes];
    }

    forEach(nodes, (node, idx) => (
      this[idx] = node
    ));

    this.length = nodes.length;

    // Store internal event listeners binded
    // with addEventListener or attachEvent
    // This will be used to remove event listeners
    this._events = [];
  }

  /**
   * Get the children of each element in the set of matched elements.
   *
   * @return {JqLite} Children.
   */
  children() {
    const children = [];

    forEach(this, (node) => {
      forEach(node.childNodes, (childNode) => {
        if (childNode.nodeType === 1) {
          children.push(childNode);
        }
      });
    });

    return new JqLite(children);
  }

  /**
   * Reduce the set of matched elements to the one at the specified index.
   *
   * @param {number} index Node index.
   * @return {JqLite} The node at given index.
   */
  eq(index) {
    return new JqLite(this[index]);
  }

  /**
   * Attach DOM events to given node(s).
   *
   * @param {string|array<string>} events DOM events.
   * @param {function} callback Listener function.
   * @return {JqLite} `this` (for chaining).
   */
  on(events, callback) {
    const array = events.indexOf(' ') >= 0 ? events.split(' ') : [events];

    for (let i = 0, size = array.length; i < size; ++i) {
      for (let k = 0, ln = this.length; k < ln; ++k) {
        const node = this[k];
        const event = array[i];

        node.addEventListener(event, callback);

        this._events.push({event, callback, node});
      }
    }

    return this;
  }

  /**
   * Detach DOM events.
   *
   * @param {string|array<string>} events DOM Events.
   * @param {function} listener The attached listener function.
   * @return {JqLite} `this` (for chaining).
   */
  off(events, listener) {
    const array = events ?
      (events.indexOf(' ') >= 0 ? events.split(' ') : [events]) :
      [];

    const nbEvents = array.length;
    const newEvents = [];

    for (let i = 0, size = this._events.length; i < size; ++i) {
      const e = this._events[i];

      let found = nbEvents === 0;
      for (let k = 0; k < nbEvents; ++k) {
        const current = array[k];
        if ((!current || e.event === current) && (!listener || e.callback === listener)) {
          found = true;
          break;
        }
      }

      if (!found) {
        newEvents.push(e);
      } else {
        e.node.removeEventListener(e.event, e.callback);
      }
    }

    this._events = newEvents;
  }

  /**
   * Clear node(s).
   *
   * @return {JqLite} `this` (for chaining).
   */
  empty() {
    forEach(this, (node) => {
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    });

    return this;
  }

  /**
   * Append node.
   *
   * @param {DOMNode} childNode Child node to append.
   * @return {JqLite} `this` (for chaining).
   */
  append(childNode) {
    forEach(this, (node, idx, collection) => {
      const clone = idx === (collection.length - 1) ? childNode : childNode.cloneNode(true);
      node.appendChild(clone);
    });

    return this;
  }

  /**
   * Prepend node.
   *
   * @param {DOMNode} childNode Child node to append.
   * @return {JqLite} `this` (for chaining).
   */
  prepend(childNode) {
    forEach(this, (node, idx, collection) => {
      const clone = idx === (collection.length - 1) ? childNode : childNode.cloneNode(true);
      node.insertBefore(clone, node.childNodes[0] || null);
    });

    return this;
  }

  /**
   * Append node after element.
   *
   * @param {DOMNode} childNode Child node to append.
   * @return {JqLite} `this` (for chaining).
   */
  after(childNode) {
    forEach(this, (node, idx, collection) => {
      const clone = idx === (collection.length - 1) ? childNode : childNode.cloneNode(true);
      node.parentNode.insertBefore(clone, node.nextSibling || null);
    });

    return this;
  }

  /**
   * Add inline style.
   *
   * @param {string|object} propertyName The CSS property (or a "properties" object).
   * @param {string} value CSS property value.
   * @return {JqLite} `this` (for chaining).
   */
  css(propertyName, value) {
    let styles;
    let props;

    if (isObject(propertyName)) {
      styles = propertyName;
      props = keys(styles);
    } else {
      styles = {[propertyName]: value};
      props = [propertyName];
    }

    forEach(this, (node) => {
      forEach(props, (propertyName) => (
        node.style[propertyName] = styles[propertyName])
      );
    });

    return this;
  }

  /**
   * Add css class.
   *
   * @param {string|array<string>} css CSS classes to add.
   * @return {JqLite} `this` (for chaining).
   */
  addClass(css) {
    forEach(this, (node) => {
      const actualCss = node.className;
      node.className = (actualCss ? actualCss + ' ' : '') + css;
    });

    return this;
  }

  /**
   * Remove a single class or multiple classes in the set of matched elements.
   *
   * @param {string|array<string>} classes CSS classes to remove.
   * @return {JqLite} `this` (for chaining).
   */
  removeClass(classes) {
    const css = classes.split(' ');
    const map = indexBy(css, (c) => c);

    forEach(this, (node) => {
      const actualClasses = node.className;
      const newClasses = filter(actualClasses.split(' '), (c) => !has(map, c));
      node.className = newClasses.join(' ');
    });

    return this;
  }

  /**
   * Set attribute to value.
   *
   * @param {string} name Attribute name.
   * @param {string} value Attribute value.
   * @return {JqLite} `this` (for chaining).
   */
  attr(name, value) {
    let values = name;
    let props;

    if (arguments.length === 2) {
      values = {[name]: value};
      props = [name];
    } else {
      props = keys(values);
    }

    forEach(this, (node) => {
      forEach(props, (k) => (
        node.setAttribute(k, values[k]))
      );
    });

    return this;
  }

  /**
   * Remove attribute.
   *
   * @param {string} name Attribute name.
   * @return {JqLite} `this` (for chaining).
   */
  removeAttr(name) {
    forEach(this, (node) => (
      node.removeAttribute(name)
    ));

    return this;
  }
}
