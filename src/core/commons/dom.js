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
/* global THEAD */
/* global TFOOT */
/* global TBODY */
/* global $util */
/* exported $doc */

/**
 * Provide simple dom operations (such as element creation, selection by id
 * or by tag name, etc.).
 */

const $doc = (function() {

  const scrollbarWidth = () => {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.width = '100px';
    scrollDiv.style.height = '100px';
    scrollDiv.style.overflow = 'scroll';
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';

    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    return scrollbarWidth;
  };

  const hasher = () => 'body';

  const setAttributes = (node, attributes) => {
    // This should always be set first.
    // Since key order is not guaranteed, force it.
    const type = attributes.type;
    if (type) {
      node.type = type;
    }

    _.forEach(_.keys(attributes), attribute => {
      const value = attributes[attribute];

      switch (attribute) {
        case 'className':
        case 'checked':
        case 'indeterminate':
        case 'value':
          node[attribute] = value;
          break;
        case 'style':
          _.extend(node.style, value);
          break;
        default:
          node.setAttribute(attribute, value);
          break;
      }
    });
  };

  const setChildren = (node, children) => {
    if (_.isString(children)) {
      // Do not worry about xss injection, since this api should be called with:
      // - Escaped values.
      // - Non escaped values, but this option must be explicitely enabled.
      node.innerHTML = children;
    } else if (_.isArray(children)) {
      _.forEach(children, child => node.appendChild(child));
    } else {
      node.appendChild(children);
    }
  };

  const $doc = {
    // Create dom element
    create: (tagName, attributes, children) => {
      const element = document.createElement(tagName);

      if (attributes) {
        setAttributes(element, attributes);
      }

      if (children) {
        setChildren(element, children);
      }

      return element;
    },

    // Find element by its id
    // To have a consistent api, this function will return an array of element.
    // If id does not exist, it will return an empty array.
    byId: id => {
      const node = document.getElementById(id);
      return !!node ? [node] : [];
    },

    // Find element by tags.
    // This function will return an "array like" of dom elements.
    byTagName: (tagName, parentNode)  => (parentNode || document).getElementsByTagName(tagName),

    // Create new empty document fragment
    createFragment: () => document.createDocumentFragment(),

    // Find parent by its tag name.
    // If parent does not exist, null will be returned.
    findParent: (node, parentTagName) => {
      let current = node;

      while (current && current.tagName !== parentTagName) {
        current = current.parentNode;
      }

      return current;
    },

    // Compute scrollbar width
    scrollbarWidth: _.memoize(scrollbarWidth, hasher)
  };

  // Add basic factory for most common tags.
  _.forEach(['tr', 'td', 'th', TBODY, THEAD, TFOOT, 'input', 'select', 'option', 'span'], tagName => {
    $doc[tagName] = (attributes, children) => $doc.create.call(this, tagName, attributes, children);
  });

  // Add basic factory for input types.
  _.forEach(['text', 'checkbox', 'number', 'email', 'url', 'date', 'time', 'datetime'], type => {
    $doc['input' + $util.capitalize(type)] = (attributes, children) => {
      const attrs = _.extend({type: type}, attributes || {});
      return $doc.input(attrs, children);
    };
  });

  return $doc;

})();
