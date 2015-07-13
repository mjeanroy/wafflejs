/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mickael Jeanroy, Cedric Nisio
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

(function(window, document, undefined) {

  (function (factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'underscore'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'), require('underscore'));
    } else {
        // Browser globals
        window.Waffle = factory(jQuery, _);
    }

  }(function ($, _) {

'use strict';
var $json = {
  // Turn a javascript object to a json string
  toJson: function(value) {
    if (!JSON || !JSON.stringify) {
      throw new Error('JSON.stringify is not available in your browser');
    }

    return JSON.stringify(value);
  },

  // Turn a json string to a javascript object
  fromJson: function(value) {
    if (!JSON || !JSON.parse) {
      throw new Error('JSON.parse is not available in your browser');
    }

    return JSON.parse(value);
  }
};
var HashMap = (function() {
  var prefix = 'key_';
  var keyFactory = function(k) {
    return prefix + k;
  };

  var Constructor = function() {
    if (!(this instanceof Constructor)) {
      return new Constructor();
    }

    this.$o = {};
  };

  Constructor.prototype = {
    // Clear map
    clear: function() {
      this.$o = {};
    },

    // Put value into map using given key
    put: function(key, value) {
      this.$o[keyFactory(key)] = value;
      return this;
    },

    // Get value associated to given key
    get: function(key) {
      return this.$o[keyFactory(key)];
    },

    // Remove value associated to given key
    remove: function(key) {
      delete this.$o[keyFactory(key)];
      return this;
    },

    // Check if given key is inside the map
    contains: function(key) {
      return _.has(this.$o, keyFactory(key));
    }
  };

  return Constructor;
})();

var $sniffer = (function() {
  // This property is available only in IE
  var msie = document.documentMode;
  var cacheEvents = new HashMap();

  // This is a map of events with tagName to use for feature
  // detection.
  var events = {
    'input': 'input'
  };

  var o = {
    hasEvent: function(event) {
      // IE9 and IE10 support input event, but it is really
      // buggy, so we disable this feature for these browsers
      if (event === 'input' && msie < 11) {
        return false;
      }

      if (!cacheEvents.contains(event)) {
        var node = document.createElement(events[event] || 'div');
        var support = ('on' + event) in node;
        cacheEvents.put(event, !!support);
        node = null;
      }

      return cacheEvents.get(event);
    }
  };

  return o;
})();
var $parse = (function() {
  var cache = new HashMap();

  // Transform bracket notation to dot notation
  // This is a really simple parser that will turn attribute
  // path to a normalized path
  // Examples:
  //  foo.bar           => foo.bar
  //  foo[0]            => foo.0
  //  foo['id']         => foo.id
  //  foo["id"]         => foo.id
  //  foo.bar[0]['id']  => foo.bar.0.id
  var $normalize = function(key) {
    var results = [];
    var parts = key.split('.');

    var arrayIndex = /(.+?)?(\[(\d+)\])/;
    var bracketSingleQuote = /(.+?)?(\['(.+)'\])/;
    var bracketDoubleQuote = /(.+?)?(\["(.+)"\])/;

    var replacer = function(match, p1, p2, p3) {
      var prefix = p1 ? p1 + '.' : '';
      return prefix + p3;
    };

    for (var i = 0, size = parts.length; i < size; ++i) {
      var part = parts[i].replace(arrayIndex, replacer)
                         .replace(bracketSingleQuote, replacer)
                         .replace(bracketDoubleQuote, replacer);

      // Remove parenthesis if name is a function call
      var openParenthesis = part.indexOf('(');
      if (openParenthesis > 0) {
        part = part.slice(0, openParenthesis);
      }

      results[i] = part;
    }

    return results.join('.');
  };

  // Split key value to an array containing each part of attribute.
  // It should allow anyone to traverse deep objects
  var $split = function(key) {
    return $normalize(key).split('.');
  };

  var ensureObject = function(object) {
    if (object == null) {
      return {};
    }

    if (!_.isObject(object)) {
      throw new Error('Cannot assign to ready property "' + object + '"');
    }

    return object;
  };

  var getter = function(parts, object) {
    var size = parts.length;
    var current = object;

    for (var i = 0; i < size; ++i) {
      if (current == null || !_.isObject(current)) {
        return undefined;
      }

      current = _.result(current, parts[i]);
    }

    return current;
  };

  var setter = function(parts, object, value) {
    var size = parts.length - 1;
    var current = object;
    var result = current;

    for (var i = 0; i < size; ++i) {
      result = _.result(current, parts[i]);
      result = current[parts[i]] = ensureObject(result);
    }

    result[_.last(parts)] = value;
    return value;
  };

  var o = function(key) {
    if (!cache.contains(key)) {
      var parts = $split(key);

      var $getter = function(object) {
        return getter(parts, object);
      };

      $getter.assign = function(object, value) {
        return setter(parts, object, value);
      };

      cache.put(key, $getter);
    }

    return cache.get(key);
  };

  o.$clear = function() {
    cache.clear();
    return o;
  };

  o.assign = function() {

  };

  return o;
})();
var $sanitize = function(input) {
  return _.escape(input);
};

var CSS_PREFIX = 'waffle-';
var CSS_GRID = 'waffle-grid';
var CSS_SORTABLE = CSS_PREFIX + 'sortable';
var CSS_SORTABLE_ASC = CSS_SORTABLE + '-asc';
var CSS_SORTABLE_DESC = CSS_SORTABLE + '-desc';
var CSS_DRAGGABLE = CSS_PREFIX + 'draggable';
var CSS_DRAGGABLE_DRAG = CSS_DRAGGABLE + '-drag';
var CSS_DRAGGABLE_OVER = CSS_DRAGGABLE + '-over';
var CSS_SCROLLABLE = CSS_PREFIX + 'fixedheader';
var CSS_SELECTABLE = CSS_PREFIX + 'selectable';
var CSS_SELECTED = CSS_PREFIX + 'selected';
var CSS_CHECKBOX_CELL = CSS_PREFIX + 'checkbox';

var DATA_PREFIX = 'data-waffle-';
var DATA_WAFFLE_ID = DATA_PREFIX + 'id';
var DATA_WAFFLE_SORTABLE = DATA_PREFIX + 'sortable';
var DATA_WAFFLE_ORDER = DATA_PREFIX + 'order';
var DATA_WAFFLE_IDX = DATA_PREFIX + 'idx';

var CHAR_ORDER_ASC = '+';
var CHAR_ORDER_DESC = '-';

// Save bytes
var TBODY = 'tbody';
var THEAD = 'thead';
var TFOOT = 'tfoot';
var TABLE = 'table';

var $util = {
  // Get version of Internet Explorer
  msie: function() {
    return document.documentMode;
  },

  // Check if string end with given suffix
  endWith: function(value, suffix) {
    return !!value && value.slice(value.length - suffix.length) === suffix;
  },

  // Check if value is a pixel value
  isPx: function(value) {
    return $util.endWith(value, 'px');
  },

  // Check if value is a percentage value
  isPercentage: function(value) {
    return $util.endWith(value, '%');
  },

  // Convert percentage string value to percentage number
  fromPercentage: function(value) {
    return _.isString(value) ? Number(value.replace('%', '')) : value;
  },

  // Translate a value to a valid px notation
  //   toPx(1OO) => '100px'
  //   toPx('100px') => '100px'
  toPx: function(value) {
    return _.isNumber(value) ? value + 'px' : value;
  },

  // Translate a px notation to a valid number
  //   fromPx('100px') => 100
  //   fromPx(100) => 100
  fromPx: function(value) {
    return _.isString(value) ? Number(value.replace('px', '')) : value;
  },

  // Capitalize given string
  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Parse value
  parse: function(json) {
    try {
      return $json.fromJson(json);
    }
    catch (e) {
      // This should probably be a simple value

      if (json === 'false') {
        return false;
      }

      if (json === 'true') {
        return true;
      }

      var nb = Number(json);
      return _.isNaN(nb) ? json : nb;
    }
  },

  // Destroy object by setting null to object own properties.
  // Note that this function will also destroy prototype attribute,
  // so this function must be called when object does not need to
  // be used anymore.
  destroy: function(o) {
    for (var i in o) {
      if (_.has(o, i)) {
        o[i] = null;
      }
    }
  },

  // Turn a camel case string to a spinal case string.
  toSpinalCase: function(str) {
    var result = '';

    for (var i = 0, size = str.length; i < size; ++i) {
      var current = str.charAt(i);
      if (current.toLowerCase() === current) {
        result += current;
      } else {
        result += '-' + current.toLowerCase();
      }
    }

    return result;
  },

  // Execute asynchronous tasks on small chunks of data.
  asyncTask: function(chunks, delay, onIteration, onEnded) {
    var idx = 0;

    var timer = function() {
      if (chunks.length > 0) {
        var current = chunks.shift();
        onIteration(current, idx);
        idx += current.length;

        // Trigger next chunk
        if (chunks.length > 0) {
          setTimeout(timer, delay);
        } else {
          onEnded();
          timer = null;
        }
      }
    };

    setTimeout(timer);
  }
};
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

    // Compute scrollbar width
    scrollbarWidth: _.memoize(scrollbarWidth, hasher)
  };

  _.forEach(['tr', 'td', 'th', TBODY, THEAD, TFOOT, 'input', 'select', 'option', 'span'], function(tagName) {
    o[tagName] = function() {
      return this.create(tagName);
    };
  });

  _.forEach(['text', 'checkbox', 'number', 'email', 'url', 'date', 'time', 'datetime'], function(type) {
    var fnName = 'input' + $util.capitalize(type);
    o[fnName] = function() {
      var input = this.input();
      input.setAttribute('type', type);
      return input;
    };
  });

  return o;

})();

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

    while(newNode.firstChild) {
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

var EventBus = (function() {

  var noop = _.noop;

  var WaffleEvent = function(event, target, params) {
    this.type = event;
    this.bubbles = false;
    this.cancelable = false;
    this.details = params;
    this.timeStamp = _.now();

    this.target = target;
    this.currentTarget = target;
    this.srcElement = target;
  };

  WaffleEvent.prototype = {
    preventDefault: noop,
    stopPropagation: noop,
    stopImmediatePropagation: noop
  };

  var formatEventName = function(type) {
    return type.toLowerCase();
  };

  var Constructor = function() {
    this.$events = {};
  };

  Constructor.prototype = {
    addEventListener: function(type, listener) {
      var name = formatEventName(type);
      var events = this.$events;
      var listeners = events[name] = events[name] || [];
      listeners.push(listener);
    },

    removeEventListener: function(type, listener) {
      var name = formatEventName(type);
      var listeners = this.$events[name];

      if (!listeners || !listeners.length) {
        return;
      }

      this.$events[name] = _.reject(listeners, function(current) {
        return current === listener;
      });
    },

    dispatchEvent: function(grid, type, params) {
      // Format event name
      // Event name should be case insensitive
      type = formatEventName(type);

      var listeners = this.$events[type];
      if (!listeners || !listeners.length) {
        return;
      }

      // Create WaffleEvent object
      var evt = new WaffleEvent(type, grid, _.isFunction(params) ? params.call(grid) : params);

      for (var i = 0, size = listeners.length; i < size; ++i) {
        try {
          listeners[i].call(grid, evt);
        } catch(e) {
          // Do not fail everything if one listener fail...
        }
      }
    },

    // Clear events
    clear: function() {
      this.$events = {};
    }
  };

  return Constructor;

})();

var Observable = (function() {
  var isNotEmpty = function(array) {
    return array && array.length > 0;
  };

  var asyncFn = function() {
    var changes = this.$$changes;
    var observers = this.$$observers;

    if (isNotEmpty(changes) && isNotEmpty(observers)) {
      // Current changes will be executed accross all observers
      // If other changes are added by observers during iteration, then they will
      // be executed asynchronously later
      // Remove changes to be executed and use them for each observers.
      var removed = changes.splice(0, changes.length);

      // Trigger changes for each observer
      _.forEach(observers, function(o) {
        o.callback.call(o.ctx, removed);
      });
    }
  };

  var o = {
    // Add new observer
    observe: function(callback, observer) {
      this.$$observers = this.$$observers || [];
      this.$$observers.push({
        ctx: observer || null,
        callback: callback
      });

      return this;
    },

    // Remove observer
    unobserve: function(callback, observer) {
      if (isNotEmpty(this.$$observers)) {
        if (arguments.length === 0) {
          // Unobserve everything
          this.$$observers = [];
        } else {
          var ctx = observer || null;
          this.$$observers = _.reject(this.$$observers, function(o) {
            return o.ctx === ctx && callback === o.callback;
          });
        }
      }

      return this;
    },

    // Trigger changes
    // Note that callbacks will be called asynchronously
    trigger: function(changes) {
      if (!_.isArray(changes)) {
        changes = [changes];
      }

      // Append new change
      this.$$changes = this.$$changes || [];
      this.$$changes.push.apply(this.$$changes, changes);

      // Trigger asynchronous task
      setTimeout(_.bind(asyncFn, this));

      return this;
    },

    // Get pending changes
    pendingChanges: function() {
      return this.$$changes || [];
    },

    // Clear pending changes
    clearChanges: function() {
      if (this.$$changes) {
        this.$$changes.splice(0, this.$$changes.length);
      }

      return this;
    }
  };

  return o;
})();
var Collection = (function() {

  var ArrayProto = Array.prototype;
  var keepNativeArray = (function() {
    try {
      var obj = {};
      obj[0] = 1;
      return !!ArrayProto.toString.call(obj);
    } catch(error) {
      return false;
    }
  })();

  var callNativeArrayWrapper = function(fn) {
    return function() {
      // Some browsers, including phantomjs 1.x need a real array
      // to be called as the context of Array prototype function (array like
      // object are not permitted)
      // Newer browsers does not need this, so keep it fast for them !
      var array = keepNativeArray ? this : _.toArray(this);
      return ArrayProto[fn].apply(array, arguments);
    };
  };

  var callNativeArrayFn = function(fn, ctx, args) {
    return callNativeArrayWrapper(fn).apply(ctx, args);
  };

  var Constructor = function(data, options) {
    var opts = options || {};

    // We keep an internal map that will store, for each data, an additionnal context
    // object that can be used to keep various information (index in collection,
    // internal state of data etc.).
    // Each entry is indexed by data identifier (value retrieved from $$key).
    this.$$map = new HashMap();

    // Internal data model object.
    // Use Object as a fallback since every object is already an instance of Object !
    this.$$model = opts.model || Object;

    // Key may be an attribute name or an explicit function
    this.$$key = opts.key || 'id';
    if (!_.isFunction(this.$$key)) {
      this.$$key = $parse(this.$$key);
    }

    // Initialize collection
    this.length = 0;
    if (data && data.length) {
      this.push.apply(this, data);
    }
  };

  // == Private functions

  // To Int function
  // See: http://es5.github.io/#x9.4
  var toInt = function(nb) {
    return parseInt(Number(nb) || 0, 10);
  };

  // Create a change object according to Object.observe API
  var TYPE_SPLICE = 'splice';
  var TYPE_UPDATE = 'update';
  var createChange = function(type, removed, index, addedCount, collection) {
    return {
      type: type,
      removed: removed,
      index: index,
      addedCount: addedCount,
      object: collection
    };
  };

  // Unset data at given index.
  var unsetAt = function(collection, idx) {
    delete collection[idx];
  };

  // Unset id entry in internal map of object index.
  var unsetId = function(collection, id) {
    collection.$$map.remove(id);
  };

  // Unset data from collection
  var unset = function(collection, obj) {
    var id = collection.$$key(obj);
    var ctx = collection.$$map.get(id);
    var idx = ctx ? ctx.idx : null;
    if (idx != null) {
      unsetAt(collection, idx);
      unsetId(collection, id);
    }
  };

  // Convert parameter to a model instance.
  var parseModel = function(collection, o) {
    if (!_.isObject(o)) {
      // Only object are allowed inside collection
      throw new Error('Waffle collections are not array, only object are allowed');
    }

    if (o instanceof collection.$$model) {
      // It is already an instance of model object !
      return o;
    }

    // Create new model instance and return it.
    return new collection.$$model(o);
  };

  // Add entry at given index.
  // Internal map is updated to keep track of indexes.
  var put = function(collection, o, i, id) {
    collection[i] = o;
    if (o != null) {
      var ngArgs = arguments.length;
      var dataId = ngArgs === 3 ? collection.$$key(o) : id;
      var dataCtx = collection.$$map.get(dataId) || {};
      dataCtx.idx = i;
      collection.$$map.put(dataId, dataCtx);
    }
  };

  // Replace data in collection and return appropriate change.
  var replace = function(collection, current) {
    var idx =  collection.indexOf(current);
    collection[idx] = current;
    return createChange(TYPE_UPDATE, [], idx, 0, collection);
  };

  // Swap elements at given index
  // Internal map is updated to keep track of indexes.
  var swap = function(collection, i, j) {
    var oj = collection.at(j);
    var oi = collection.at(i);
    put(collection, oi, j);
    put(collection, oj, i);
  };

  // Move all elements of collection to the right.
  // Start index is specified by first parameter.
  // Number of move is specified by second parameter.
  // Size of collection is automatically updated.
  // Exemple:
  //   [0, 1, 2] => shiftRight(0, 2) => [undefined, undefined, 0, 1, 2]
  //   [0, 1, 2] => shiftRight(1, 2) => [0, undefined, undefined, 1, 2]
  //   [0, 1, 2] => shiftRight(2, 2) => [0, 1, undefined, undefined, 2]
  var shiftRight = function(collection, start, size) {
    var absSize = Math.abs(size);

    // Swap elements index by index
    for (var i = collection.length - 1; i >= start; --i) {
      swap(collection, i, i + absSize);
    }

    collection.length += absSize;
  };

  // Move all elements of collection to the left.
  // Start index is specified by first parameter.
  // Number of move is specified by second parameter.
  // Size of collection is automatically updated.
  // Removed elements are returned
  // Exemple:
  //   shiftLeft([0, 1, 2], 0, 2) => [2]
  //   shiftLeft([0, 1, 2], 1, 1) => [0, 2]
  //   shiftLeft([0, 1, 2], 2, 1) => [0, 1]
  var shiftLeft = function(collection, start, size) {
    var absSize = Math.abs(size);
    var oldLength = collection.length;
    var newLength = oldLength - absSize;
    var max = start + absSize;

    var removed = [];

    // Swap elements index by index
    for (var i = max; i < oldLength; ++i) {
      swap(collection, i, i - absSize);
    }

    // Clean last elements of array
    for (var k = newLength; k < oldLength; ++k) {
      var o = collection.at(k);
      removed.unshift(o);
      unset(collection, o);
    }

    collection.length = newLength;

    return removed;
  };

  var merge = function(collection, array) {
    var sortFn = collection.$$sortFn;
    var sizeCollection = collection.length;
    var sizeArray = array.length;
    var newSize = sizeCollection + sizeArray;

    var changes = [], change;
    var j = sizeCollection - 1;
    var k = sizeArray - 1;
    for (var i = newSize - 1; i >= 0; --i) {
      if (j < 0 || sortFn(collection[j], array[k]) < 0) {
        put(collection, array[k--], i);

        // New change occurs
        change = _.first(changes);
        if (!change || change.index !== (i + 1)) {
          change = createChange(TYPE_SPLICE, [], i, 1, collection);
          changes.unshift(change);
        } else {
          change.index = i;
          change.addedCount++;
        }

        if (k < 0) {
          // Array is 100% merged
          break;
        }
      } else {
        put(collection, collection[j--], i);
      }
    }

    // Update collection length
    collection.length = newSize;

    return changes;
  };

  // == Public prototype

  Constructor.prototype = {
    // Get collection options
    options: function() {
      return {
        model: this.$$model,
        key: this.$$key
      };
    },

    // Get element at given index
    // Shortcut to array notation
    at: function(index) {
      return this[index];
    },

    // Get item by its key value
    byKey: function(key) {
      var index = this.indexOf(key);
      return index >= 0 ? this.at(index) : undefined;
    },

    // Get index of data in collection.
    // This function use internal id to check index faster.
    // This function accept data or data identifier as argument.
    indexOf: function(o) {
      var key = _.isObject(o) ? this.$$key(o) : o;
      return this.$$map.contains(key) ? this.$$map.get(key).idx : -1;
    },

    // Check if data object is already inside collection.
    // This function is a shortcut for checking return value of indexOf.
    // This function accept data or data identifier as argument.
    contains: function(o) {
      return this.indexOf(o) >= 0;
    },

    // Returns an index in the array, if an element in the array
    // satisfies the provided testing function. Otherwise -1 is returned.
    findIndex: function(callback, ctx) {
      for (var i = 0, size = this.length; i < size; ++i) {
        if (callback.call(ctx, this.at(i), i, this)) {
          return i;
        }
      }
      return -1;
    },

    // Add new elements at given index
    // This is a shortcut for splice(start, O, models...)
    add: function(models, start) {
      var startIdx = start == null ? this.length : start;
      var args = [startIdx, 0].concat(models);
      this.splice.apply(this, args);
      return this.length;
    },

    // Remove elements of collection
    // If first argument is a number, then this is a shortcut for splice(start, deleteCount).
    // Otherwise, first argument should be a predicate. This predicate will be called for
    // each element, and must return a truthy value to remove that element.
    remove: function(start, deleteCount) {
      // If first argument is a number, then this is a shortcut for splice method
      if (_.isNumber(start)) {
        return this.splice.call(this, start, deleteCount || this.length);
      }

      // If it is an array, then remove everything
      if (_.isArray(start)) {
        var $key = this.$$key;
        var map = _.indexBy(start, $key);
        return this.remove(function(current) {
          return !!map[$key(current)];
        });
      }

      var predicate = start;
      var ctx =  deleteCount;
      var idx = 0;
      var lastChangeIdx = null;
      var changes = [];
      var removed = [];

      for (var i = 0, size = this.length; i < size; ++i) {
        var o = this.at(i);
        var id = this.$$key(o);

        if (predicate.call(ctx, o, i)) {
          // Remove
          unsetAt(this, i);
          unsetId(this, id);

          // Merge with last change or create new change object
          if (lastChangeIdx === (i - 1)) {
            _.last(changes).removed.push(o);
          } else {
            changes.push(createChange(TYPE_SPLICE, [o], i, 0, this));
          }

          removed.push(o);
          lastChangeIdx = i;
        }
        else {
          // Keep
          if (idx !== i) {
            unsetAt(this, i);
            unsetId(this, id);
            put(this, o, idx, id);
          }

          idx++;
        }
      }

      // Update collection length
      this.length -= removed.length;

      if (changes.length > 0) {
        this.trigger(changes);
      }

      return removed;
    },

    // Force an update change.
    // This will force a row update.
    triggerUpdate: function(idx) {
      this.trigger([
        createChange(TYPE_UPDATE, [], idx, 0, this)
      ]);

      return this;
    },

    // Replace data inside collection.
    // Index of data is retrieved from id and data at given index is replaced.
    // Appropriate changes are automatically triggered.
    replace: function(data) {
      var args = [0, 0].concat(data);
      this.splice.apply(this, args);
      return this;
    },

    // Adds one or more elements to the end of the collection
    // and returns the new length of the collection.
    // Semantic is the same as [].push function
    push: function() {
      return this.add.call(this, _.toArray(arguments));
    },

    // adds one or more elements to the beginning of the collection
    // and returns the new length of the collection.
    // Semantic is the same as [].unshift function
    unshift: function() {
      return this.add.call(this, _.toArray(arguments), 0);
    },

    // Removes the last element from the collection
    // and returns that element.
    pop: function() {
      return this.remove(this.length - 1, 1)[0];
    },

    // removes the first element from the collection
    // and returns that element.
    shift: function() {
      return this.remove(0, 1)[0];
    },

    // Toggle data :
    // - If data is already in collection, it will be removed
    // - Otherwise it will be pushed into the collection
    toggle: function(data) {
      var index = this.indexOf(data);

      if (index >= 0) {
        return this.remove(index, 1);
      } else {
        return this.push(data);
      }
    },

    // Clear collection
    clear: function() {
      if (this.length > 0) {
        var array = [];
        for (var i = 0, size = this.length; i < size; ++i) {
          array[i] = this.at(i);
          unsetAt(this, i);
        }

        this.$$map.clear();
        this.length = 0;
        this.trigger(createChange(TYPE_SPLICE, array, 0, 0, this));
      }

      return this;
    },

    // Reset entire collection with new data array
    reset: function(array) {
      var oldSize = this.length;
      var newSize = array.length;

      var sortFn = this.$$sortFn;
      if (sortFn) {
        array.sort(sortFn);
      }

      this.$$map.clear();

      var removed = [];
      var addedCount = array.length;

      for (var i = 0; i < newSize; ++i) {
        if (i < oldSize) {
          removed.push(this.at(i));
        }

        put(this, parseModel(this, array[i]), i);
      }

      for (; i < oldSize; ++i) {
        removed.push(this.at(i));
        unsetAt(this, i);
      }

      this.length = newSize;

      this.trigger([
        createChange(TYPE_SPLICE, removed, 0, addedCount, this)
      ]);

      return this;
    },

    // Check if collection is empty
    isEmpty: function() {
      return this.length === 0;
    },

    // Returns a new collection comprised of the collection on which it is called
    // joined with the collection(s) and/or value(s) provided as arguments.
    concat: function() {
      var newArray = ArrayProto.concat.apply(this.toArray(), arguments);
      return new Constructor(newArray, this.options());
    },

    // returns a shallow copy of a portion of the collection
    // into a new collection object.
    slice: function() {
      var results = callNativeArrayFn('slice', this, arguments);
      return new Constructor(results, this.options());
    },

    // Changes the content of the collection by removing existing
    // elements and/or adding new elements.
    // If collection is sorted, splice will insert new elements
    // in order (collection remains sorted).
    splice: function(start, deleteCount) {
      var sortFn = this.$$sortFn;
      var size = this.length;
      var data = _.rest(arguments, 2);

      // Iterator that will translate object to model elements
      var transformIteratee = function(m) {
        return parseModel(this, m);
      };

      // Data to model transformation.
      // This iteration will also check for undefined / null values.
      var models = _.map(data, transformIteratee, this);

      // Index at which to start changing the array.
      // If greater than the length of the array, actual starting index will
      // be set to the length of the array.
      // If negative, will begin that many elements from the end.
      // See: http://es5.github.io/#x15.4.4.10
      var actualStart = toInt(start);
      if (actualStart >= 0) {
        actualStart = Math.min(size, actualStart);
      } else {
        actualStart = Math.max(size + actualStart, 0);
      }

      // An integer indicating the number of old array elements to remove.
      // If deleteCount is 0, no elements are removed.
      // In this case, you should specify at least one new element.
      // If deleteCount is greater than the number of elements left in the array
      // starting at start, then all of the elements through the end of
      // the array will be deleted.
      // See: http://es5.github.io/#x15.4.4.10
      var actualDeleteCount = Math.min(Math.max(toInt(deleteCount) || 0, 0), size - actualStart);

      // Track removed elements
      var removed = [];

      // First delete elements
      if (actualDeleteCount > 0) {
        for (var i = 0; i < actualDeleteCount; ++i) {
          removed.push(this[i + actualStart]);
        }

        shiftLeft(this, actualStart, actualDeleteCount);
      }

      var changes;

       // We need to split between existing data and new data to add.
      var parts = _.groupBy(models, this.contains, this);
      var existing = parts[true] || [];
      var added = parts[false] || [];
      var addedCount = added.length;
      var existingCount = existing.length;

      // Add new elements
      if (addedCount > 0) {
        if (sortFn) {
          // We need to keep sort: sort added elements and merge everything
          added.sort(sortFn);
          changes = merge(this, added);
        }
        else {
          // Shift and put elements at given indexes
          shiftRight(this, actualStart, addedCount);

          for (var k = 0; k < addedCount; ++k) {
            put(this, added[k], actualStart + k);
          }

          changes = [createChange(TYPE_SPLICE, removed, actualStart, addedCount, this)];
        }
      } else {
        changes = [];
      }

      // Add change for removed elements
      if (removed.length > 0) {
        var change = _.find(changes, function(c) {
          return c.index === actualStart;
        });

        if (change) {
          // Merge change for removed elements with added elements changes
          change.removed = removed;
        } else {
          // Prepend changes with change for removed elements
          changes.unshift(createChange(TYPE_SPLICE, removed, actualStart, 0, this));
        }
      }

      // Replace existing data and trigger changes
      var updateChanges = [];
      if (existingCount > 0) {
        if (sortFn) {
          existing.sort(sortFn);
        }

        for (var x = 0; x < existingCount; ++x) {
          updateChanges.push(replace(this, existing[x]));
        }
      }

      // Trigger update and splice changes
      var allChanges = changes.concat(updateChanges);
      if (allChanges.length > 0) {
        this.trigger(allChanges);
      }

      // An array containing the deleted elements.
      // If only one element is removed, an array of one element is returned.
      // If no elements are removed, an empty array is returned.
      return removed;
    },

    // Reverses collection in place.
    // The first array element becomes the last and the last becomes the first.
    reverse: function() {
      if (this.$$sortFn) {
        // If collection is sorted, reverse is a no-op
        return this;
      }

      var size = this.length;
      var mid = Math.floor(size / 2);

      // Track changes using two arrays to have changes in order
      var changesStart = [];
      var changesEnd = [];

      for (var i = 0, j = size - 1; i < mid; ++i, --j) {
        swap(this, i, j);
        changesStart.push(createChange(TYPE_UPDATE, [], i, 0, this));
        changesEnd.unshift(createChange(TYPE_UPDATE, [], j, 0, this));
      }

      // Trigger changes in order
      var changes = changesStart.concat(changesEnd);
      if (changes.length) {
        this.trigger(changes);
      }

      return this;
    },

    // Split collection into smaller arrays
    // Returned value is an array of smaller arrays.
    split: function(size) {
      var actualSize = size || 20;
      var chunks = [];

      var chunk = [];
      for (var i = 0, length = this.length; i < length; ++i) {
        chunk.push(this.at(i));
        if (chunk.length === actualSize) {
          chunks.push(chunk);
          chunk = [];
        }
      }

      if (chunk.length > 0) {
        chunks.push(chunk);
      }

      return chunks;
    },

    // Custom json representation
    // Need JSON.stringify to be available
    toJSON: function() {
      return JSON.stringify(this.toArray());
    },

    // Sort given collection in place
    // Sorted collection is returned
    sort: function(sortFn) {
      this.$$sortFn = sortFn;
      return this.reset(this.toArray())
                 .clearChanges();
    },

    // Extract property of collection items
    pluck: function(name) {
      var getter = $parse(name);
      return this.map(function(o) {
        return getter(o);
      });
    }
  };

  // Since collection should only contains uniq elements, indexOf and lastIndexOf should
  // be the same.
  Constructor.prototype.lastIndexOf = Constructor.prototype.indexOf;

  // Turn collection to an observable object
  _.extend(Constructor.prototype, Observable);

  // Add underscore functions to Collection prototype
  _.forEach(['size', 'first', 'last', 'initial', 'rest', 'partition', 'forEach', 'map', 'every', 'some', 'reduce', 'reduceRight', 'filter', 'reject', 'find', 'toArray'], function(fn) {
    if (_[fn]) {
      Constructor.prototype[fn] = function() {
        var args = [this].concat(_.toArray(arguments));
        return _[fn].apply(_, args);
      };
    }
  });

  // These functions may allow nested properties
  _.forEach(['countBy', 'groupBy', 'indexBy'], function(fn) {
    Constructor.prototype[fn] = function(callback, ctx) {
      // Support nested property in collection object
      if (_.isString(callback)) {
        var getter = $parse(callback);
        callback = function(o) {
          return getter(o);
        };
      }

      return _[fn].call(_, this, callback, ctx);
    };
  });

  // Add some Array functions to Collection prototype
  _.forEach(['toString', 'toLocaleString', 'join'], function(fn) {
    Constructor.prototype[fn] = callNativeArrayWrapper(fn);
  });

  return Constructor;
})();

var $renderers = (function() {
  // Turn value to a valid string
  var toString = function(value) {
    return (value == null ? '' : value).toString();
  };

  var o = {
    // Simple renderer that just return same value
    $identity: _.identity,

    // Simple renderer that just return an empty value
    // Could be used to renderer a cell with always an empty value
    $empty: function() {
      return '';
    },

    // Render a value as a lower case string
    $lowercase: function(value) {
      return toString(value).toLowerCase();
    },

    // Render a value as an upper case string
    $uppercase: function(value) {
      return toString(value).toUpperCase();
    },

    // Render a value as a capitalized string
    // First character is changed to an uppercase character, other characters remains unchanged
    $capitalize: function(value) {
      return $util.capitalize(toString(value));
    },

    // Get renderer by its name
    // Could be overridden by custom lookup
    $get: function(name) {
      return o[name];
    }
  };

  return o;
})();
var $comparators = {
  // Compare two strings
  $string: function(a, b) {
    var str1 = a == null ? '' : String(a);
    var str2 = b == null ? '' : String(b);
    return str1.localeCompare(str2);
  },

  // Compare two numbers
  $number: function(a, b) {
    var n1 = a == null ? 0 : Number(a);
    var n2 = b == null ? 0 : Number(b);
    return n1 - n2;
  },

  // Compare two booleans
  $boolean: function(a, b) {
    var b1 = a === 'false' ? 0 : (Boolean(a) ? 1 : 0);
    var b2 = b === 'false' ? 0 : (Boolean(b) ? 1 : 0);
    return b1 - b2;
  },

  // Compare two dates
  // Function accept timestamps as arguments
  $date: function(a, b) {
    var t1 = _.isDate(a) ? a.getTime() : new Date(a == null ? 0 : a).getTime();
    var t2 = _.isDate(b) ? b.getTime() : new Date(b == null ? 0 : b).getTime();
    return t1 - t2;
  },

  // Perform an automatic comparison
  // Type of elements will be detected and appropriate comparison will be made
  $auto: function(a, b) {
    if (a === b || (a == null && b == null)) {
      return 0;
    }

    // Try to get most precise type
    // String must be always at last because it is the less precise type
    var value = _.find(['Number', 'Boolean', 'Date', 'String'], function(val) {
      var fn = _['is' + val];
      return fn(a) || fn(b);
    });

    if (value) {
      return $comparators['$' + value.toLowerCase()](a, b);
    }

    // Just do a simple comparison... (strict equality is already checked)
    return a < b ? -1 : 1;
  },

  // Get comparator by its name
  // Can be overridden by custom lookup
  $get: function(name) {
    return $comparators[name];
  }
};

// Create a comparison function using array of comparator
// Comparison function take two object in parameters and iterate
// over comparators to return zero, a negative value or a positive value
// Comparison stop when a comparator return a non-zero value (it means that
// first most precise comparison is used to compute the final result).
var $$createComparisonFunction = function(comparators) {
  if (!_.isArray(comparators)) {
    comparators = [comparators];
  }

  return function(o1, o2) {
    if (o1 === o2 || (o1 == null && o2 == null)) {
      return 0;
    }

    for (var i = 0, size = comparators.length; i < size; ++i) {
      var current = comparators[i];
      var a1 = current.parser(o1);
      var a2 = current.parser(o2);
      var result = current.fn.call($comparators, a1, a2);

      // Return first result that is not zero
      if (result) {
        return current.desc ? result * -1 : result;
      }
    }

    // Each comparator return zero, so compare function must return zero
    return 0;
  };
};
var Column = (function() {

  var CSS_PLACHOLDERS = {
    '.': '-',
    '(': '',
    ')': '',
    '[': '-',
    ']': '-',
    '\'': '',
    '"': ''
  };

  var isUndefined = _.isUndefined;
  var defaultRenderer = '$identity';
  var defaultComparator = '$auto';

  // Save bytes
  var fromPx = $util.fromPx;
  var toPx = $util.toPx;

  var lookup = function(value, dictionary, defaultValue) {
    // If value is a string, search in given dictionary
    if (_.isString(value)) {
      value = dictionary.$get(value);
    }

    // If it is not a function then use default value in dictionary
    if (!_.isFunction(value)) {
      value = dictionary.$get(defaultValue);
    }

    return value;
  };

  var Constructor = function(column) {
    // If a string is given as parameter, then this is a
    // shortcut for column id.
    if (_.isString(column)) {
      column = {
        id: column
      };
    }

    var escape = column.escape;
    var sortable = column.sortable;

    this.id = column.id;
    this.title = column.title || '';
    this.field = column.field || this.id;
    this.css = column.css || '';
    this.escape = isUndefined(escape) ? true : !!escape;
    this.width = column.width;
    this.sortable = isUndefined(sortable) ? true : !!sortable;
    this.draggable = !!column.draggable;
    this.asc = isUndefined(column.asc) ? null : !!column.asc;

    // Editable column
    var editable = column.editable === true ? {} : column.editable;
    if (editable) {
      editable = _.defaults(editable, {
        type: 'text',
        css: null
      });
    }

    this.editable = editable;

    if (!this.css) {
      // Use id as default css.
      // Normalize css format : remove undesirable characters
      for (var i = 0, size = this.id.length; i < size; ++i) {
        var current = this.id.charAt(i);
        var placeholder = CSS_PLACHOLDERS[current];
        this.css += placeholder != null ? placeholder : current;
      }
    }

    // Sanitize input at construction
    if (escape) {
      this.title = $sanitize(this.title);
    }

    // Renderer can be defined as a custom function
    // Or it could be defined a string which is a shortcut to a pre-built renderer
    // If it is not a function, switch to default renderer
    // TODO Is it really a good idea ? Should we allow more flexibility ?
    var columnRenderer = column.renderer || defaultRenderer;
    var renderers = _.isArray(columnRenderer) ? columnRenderer : [columnRenderer];
    this.$renderer = _.map(renderers, function(r) {
      return lookup(r, $renderers, defaultRenderer);
    });

    // Comparator can be defined as a custom function
    // Or it could be defined a string which is a shortcut to a pre-built comparator
    // If it is not a function, switch to default comparator
    this.$comparator = lookup(column.comparator, $comparators, defaultComparator);

    // Parse that will be used to extract data value from plain old javascript object
    this.$parser = $parse(this.field);
  };

  Constructor.prototype = {
    // Get css class to append to each cell
    cssClasses: function() {
      var classes = [this.css];

      if (this.sortable) {
        // Add css to display that column is sortable
        classes.push(CSS_SORTABLE);
      }

      if (this.draggable) {
        classes.push(CSS_DRAGGABLE);
      }

      // Add css to display current sort
      var asc = this.asc;
      if (asc != null) {
        classes.push(asc ? CSS_SORTABLE_ASC : CSS_SORTABLE_DESC);
      }

      return classes.join(' ');
    },

    // Compute attributes to set on each cell
    attributes: function(idx, header) {
      var attributes = {};

      // Set id of column as custom attribute
      attributes[DATA_WAFFLE_ID] = this.id;

      // Set sort information as custom attributes
      if (header) {
        if (this.sortable) {
          attributes[DATA_WAFFLE_SORTABLE] = true;

          var asc = this.asc;
          if (asc != null) {
            attributes[DATA_WAFFLE_ORDER] = asc ? CHAR_ORDER_ASC : CHAR_ORDER_DESC;
          }
        }

        if (this.draggable) {
          attributes.draggable = true;
        }
      }

      return attributes;
    },

    // Compute inline style to set on each cell
    styles: function() {
      var styles = {};

      // Set width as inline style
      var computedWidth = toPx(this.computedWidth);
      if (computedWidth) {
        styles.width = computedWidth;
        styles.maxWidth = computedWidth;
        styles.minWidth = computedWidth;
      }

      return styles;
    },

    // Update column fixed width
    updateWidth: function(width) {
      this.width = fromPx(width);
      return this;
    },

    // Render object using column settings
    render: function(object) {
      // Extract value
      var field = this.field;
      var value = this.value(object);

      // Give extracted value as the first parameter
      // Give object as the second parameter to allow more flexibility
      // Give field to display as the third parameter to allow more flexibility
      // Use '$renderers' as this context, this way renderers can be easy compose
      var rendererValue = _.reduce(this.$renderer, function(val, r) {
        return r.call($renderers, val, object, field);
      }, value);

      // If value is null or undefined, fallback to an empty string
      if (rendererValue == null) {
        return '';
      }

      return this.escape ? $sanitize(rendererValue) : rendererValue;
    },

    // Get or set value of object using column settings (parser).
    value: function(object, value) {
      var parser = this.$parser;

      if (arguments.length === 2) {
        parser.assign(object, value);
        return this;
      } else {
        return object == null ? '' : parser(object);
      }
    }
  };

  return Constructor;
})();

var GridDomHandlers = (function() {

  var THEAD = 'THEAD';
  var TFOOT = 'TFOOT';
  var TBODY = 'TBODY';
  var TH = 'TH';
  var TR = 'TR';
  var INPUT = 'INPUT';

  var isInputCheckbox = function(node) {
    return node.tagName === INPUT && node.getAttribute('type') === 'checkbox';
  };

  var isDraggable = function(node) {
    return !!node.getAttribute('draggable');
  };

  var hasParent = function(node, expectedParent) {
    var parent = $doc.findParent(node, expectedParent.tagName);
    return parent === expectedParent;
  };

  // Data formatter used when editable column cell is updated
  var dataFormatters = {
    number: function(value) {
      return Number(value);
    },
    checkbox: function(value) {
      return !!value;
    }
  };

  var onClickTitle = function(e, tagName) {
    var target = e.target;
    var th = $doc.findParent(e.target, TH);

    // If target is thead it means click was pressed in a th and released in another
    if (target.tagName === tagName) {
      return;
    }

    // Checkbox
    if (this.isSelectable() && isInputCheckbox(target)) {
      if (target.checked) {
        this.select();
      } else {
        this.deselect();
      }
    }

    // Column header
    else if (th && th.getAttribute(DATA_WAFFLE_SORTABLE)) {
      var id = th.getAttribute(DATA_WAFFLE_ID);
      var currentOrder = th.getAttribute(DATA_WAFFLE_ORDER) || CHAR_ORDER_DESC;
      var newOrder = currentOrder === CHAR_ORDER_ASC ? CHAR_ORDER_DESC : CHAR_ORDER_ASC;
      var newPredicate = newOrder + id;

      var newSortBy;

      if (e.shiftKey) {
        var oldPredicate = currentOrder + id;
        newSortBy = _.reject(this.$sortBy, function(predicate) {
          return predicate === oldPredicate;
        });
      } else {
        newSortBy = [];
      }

      newSortBy.push(newPredicate);
      this.sortBy(newSortBy);
    }
  };

  var o = {
    onClickThead: function(e) {
      return onClickTitle.call(this, e, THEAD);
    },

    onClickTfoot: function(e) {
      return onClickTitle.call(this, e, TFOOT);
    },

    onClickTbody: function(e) {
      // If grid is not selectable, ignore event.
      if (!this.isSelectable()) {
        return;
      }

      // If target is tbody it means click was pressed in a tr and released in another
      if (e.target.tagName === TBODY) {
        return;
      }

      var tr = $doc.findParent(e.target, TR);
      var idx = tr.getAttribute(DATA_WAFFLE_IDX);
      var data = this.$data.at(idx);
      var selection = this.$selection;

      if (this.options.selection.multi) {
        if (e.shiftKey) {
          var idxF = parseFloat(idx);
          var selectAnchorF = parseFloat(this.$$selectAnchor);
          var lowerBound = Math.min(idxF, selectAnchorF);
          var upperBound = Math.max(idxF, selectAnchorF);

          var toAdd = [];
          for (var i = lowerBound; i <= upperBound; ++i) {
            var current = this.$data.at(i);
            if (!selection.contains(current)) {
              toAdd.push(current);
            }
          }

          if (toAdd.length > 0) {
            selection.push.apply(selection, toAdd);
          }
        }
        else {
          selection.toggle(data);
          this.$$selectAnchor = idx;
        }
      }
      else {
        var dataIdx = selection.indexOf(data);

        if (dataIdx >= 0) {
          selection.remove(dataIdx, 1);
        }
        else {
          selection.reset([data]);
        }
      }
    },

    // Update grid data when editable column has been updated
    onInputTbody: function(e) {
      var target = e.target;
      var columnId = target.getAttribute(DATA_WAFFLE_ID);
      var column = columnId ? this.$columns.byKey(columnId) : null;

      if (column && column.editable) {
        var tr = $doc.findParent(target, 'TR');
        if (tr) {
          var type = column.editable.type;
          var formatter = dataFormatters[type] || _.identity;
          var idx = Number(tr.getAttribute(DATA_WAFFLE_IDX));

          var data = this.$data;
          var object = data.at(idx);

          var oldValue = column.value(object);
          var newValue = formatter($(target).val());

          if (oldValue !== newValue) {
            column.value(object, newValue);

            // Dispatch events
            this.dispatchEvent('datachanged', {
              index: idx,
              object: object,
              oldValue: oldValue,
              newValue: newValue
            });

            // Another field may have been updated, so
            // we should force an update to refresh the
            // entire row.
            data.triggerUpdate(idx);
          }
        }
      }
    },

    // Triggered when drag event is started
    onDragStart: function(e) {
      var target = e.target;
      var originalEvent = e.originalEvent || e;
      var dataTransfer = originalEvent.dataTransfer;

      if (isDraggable(target)) {
        $(target).addClass(CSS_DRAGGABLE_DRAG);

        dataTransfer.effectAllowed = 'move';
        dataTransfer.clearData();
        dataTransfer.setData('Text', target.getAttribute(DATA_WAFFLE_ID));
      }
    },

    // Triggered when drag event is finished
    onDragEnd: function(e) {
      var target = e.target;
      var table = this.$table[0];

      $($doc.byTagName('th', table)).removeClass(CSS_DRAGGABLE_OVER);

      if (isDraggable(target) && hasParent(target, table)) {
        $(e.target).removeClass(CSS_DRAGGABLE_DRAG);
      }
    },

    // Triggerd when draggable element is over an other element.
    onDragOver: function(e) {
      var target = e.target;
      if (isDraggable(target) && hasParent(target, this.$table[0])) {
        var originalEvent = e.originalEvent || e;
        var dataTransfer = originalEvent.dataTransfer;
        dataTransfer.dropEffect = 'move';

        e.preventDefault();
        return false;
      }
    },

    // Triggerd when draggable element enter inside other element.
    onDragEnter: function(e) {

      var target = e.target;
      if (isDraggable(target) && hasParent(target, this.$table[0])) {
        $(target).addClass(CSS_DRAGGABLE_OVER);

        e.preventDefault();
        return false;
      }
    },

    // Triggerd when draggable element leaves other element.
    onDragLeave: function(e) {
      var target = e.target;
      if (isDraggable(target) && hasParent(target, this.$table[0])) {
        $(target).removeClass(CSS_DRAGGABLE_OVER);

        e.preventDefault();
        return false;
      }
    },

    // Triggerd when draggable element is dropped on other element.
    onDragDrop: function(e) {
      var target = e.target;
      if (isDraggable(target) && hasParent(target, this.$table[0])) {

        var originalEvent = e.originalEvent || e;
        var dataTransfer = originalEvent.dataTransfer;

        var oldId = dataTransfer.getData('Text');
        var newId = target.getAttribute(DATA_WAFFLE_ID);

        if (oldId !== newId) {
          var columns = this.$columns;
          var oldIdx = columns.indexOf(oldId);
          var newIdx = columns.indexOf(newId);
          columns.add(columns.remove(oldIdx, 1), newIdx);

          // Do not forget to remove css class
          $(target).removeClass(CSS_DRAGGABLE_OVER);
        }

        e.preventDefault();
        return false;
      }
    },

    // Event triggered when text selection occurs
    // This is an event for IE <= 9 to handle drag&drop
    // on none link nodes.
    onSelectStart: function(e) {
      var target = e.target;
      if (isDraggable(target)) {
        e.preventDefault();
        target.dragDrop();
        return false;
      }
    }
  };

  return o;

})();

var GridDomBinders = (function() {

  var bind = function(grid, target, events, handlerName) {
    if (!grid.$$events[handlerName]) {
      grid.$$events[handlerName] = _.bind(GridDomHandlers[handlerName], grid);
      grid['$' + target].on(events, grid.$$events[handlerName]);
    }
  };

  var unbind = function(grid, target, events, handlerName) {
    if (grid.$$events[handlerName]) {
      grid['$' + target].off(events, grid.$$events[handlerName]);
      grid.$$events[handlerName] = null;
    }
  };

  var inputEvents = function() {
    var mainEvent = $sniffer.hasEvent('input') ? 'input' : 'keyup';
    return mainEvent += ' change';
  };

  // Save bytes
  var CLICK = 'click';

  var o = {
    bindResize: function(grid) {
      if (!grid.$$events.onResize) {
        var resizeFn = _.bind(grid.resize, grid);
        grid.$$events.onResize = _.debounce(resizeFn, 100);
        $(window).on('resize', grid.$$events.onResize);
      }
    },

    // Bind input events on tbody element
    bindEdition: function(grid) {
      bind(grid, TBODY, inputEvents(), 'onInputTbody');
    },

    // Unbind input events on tbody element
    unbindEdition: function(grid) {
      unbind(grid, TBODY, inputEvents(), 'onInputTbody');
    },

    // Bind selection events (click) on thead, tfoot and tbody elements
    bindSelection: function(grid) {
      bind(grid, THEAD, CLICK, 'onClickThead');
      bind(grid, TFOOT, CLICK, 'onClickTfoot');
      bind(grid, TBODY, CLICK, 'onClickTbody');
    },

    // Bind sort events (click) on thead and tfoot elements.
    bindSort: function(grid) {
      bind(grid, THEAD, CLICK, 'onClickThead');
      bind(grid, TFOOT, CLICK, 'onClickTfoot');
    },

    // Bind drag&drop events on table element.
    bindDragDrop: function(grid) {
      bind(grid, TABLE, 'dragstart', 'onDragStart');
      bind(grid, TABLE, 'dragover', 'onDragOver');
      bind(grid, TABLE, 'dragend', 'onDragEnd');
      bind(grid, TABLE, 'dragleave', 'onDragLeave');
      bind(grid, TABLE, 'dragenter', 'onDragEnter');
      bind(grid, TABLE, 'drop', 'onDragDrop');

      // IE <= 9 need this workaround to handle drag&drop
      if ($util.msie() <= 9) {
        bind(grid, TABLE, 'selectstart', 'onSelectStart');
      }
    }
  };

  return o;

})();

var GridBuilder = (function() {

  var PX = 'px';
  var PERCENT = 'percent';
  var AUTO = 'auto';

  var widthComputer = {};

  widthComputer[PX] = function(col) {
    return $util.fromPx(col.computedWidth);
  };

  widthComputer[PERCENT] = function(col, total) {
    return $util.fromPercentage(col.computedWidth) * total / 100;
  };

  widthComputer[AUTO] = function(col, total, size) {
    return total / size;
  };

  var formatters = {
    checkbox: function(value) {
      return !!value;
    }
  };

  var o = {
    // Compute width for each columns
    computeWidth: function(totalWidth, columns) {
      var remainingSpace = totalWidth;
      var constrainedColumnCount = 0;

      // Split columns into groups:
      // - Group with fixed width.
      // - Group with width that must be computed using percentage of remaining space.
      // - Group with width that should expand to remaining space.
      var groups = columns.groupBy(function(column) {
        var width = column.computedWidth = _.result(column, 'width');

        if (_.isNumber(width) || $util.isPx(width)) {
          return PX;
        }

        if ($util.isPercentage(width)) {
          return PERCENT;
        }

        return AUTO;
      });

      // Now, update widths for each columns
      _.forEach([PX, PERCENT, AUTO], function(group) {
        var cols = groups[group];
        if (cols) {
          var total = remainingSpace;
          var size = cols.length;

          _.forEach(cols, function(col) {
            var computedWidth = widthComputer[group](col, total, size);

            // Update computed width
            col.computedWidth = computedWidth;

            // And update remaining flags
            remainingSpace -= computedWidth;
            constrainedColumnCount++;
          });
        }
      });
    },

    // Create row to append to thead node.
    theadRow: function(grid) {
      var tr = $doc.tr();

      if (grid.hasCheckbox()) {
        tr.appendChild(o.theadCheckboxCell(grid));
      }

      grid.$columns.forEach(function(column, idx) {
        tr.appendChild(o.theadCell(grid, column, idx));
      });

      return tr;
    },

    // Create cell for grid thead node.
    theadCell: function(grid, column, idx) {
      return $($doc.th())
        .addClass(column.cssClasses(idx, true))
        .css(column.styles(idx, true))
        .attr(column.attributes(idx, true))
        .html(column.title)[0];
    },

    // Create cell for grid thead node.
    theadCheckboxCell: function(grid) {
      var selectionLength = grid.$selection.size();
      var dataLength = grid.$data.size();

      var $span = $($doc.span())
        .attr('title', selectionLength)
        .html(selectionLength);

      var $input = $($doc.inputCheckbox())
        .prop('checked', grid.isSelected())
        .prop('indeterminate', selectionLength > 0 && selectionLength !== dataLength);

      return $($doc.th())
        .addClass(CSS_CHECKBOX_CELL)
        .append($span[0])
        .append($input[0])[0];
    },

    // Create row to append to thead node.
    tfootRow: function(grid) {
      var tr = $doc.tr();

      if (grid.hasCheckbox()) {
        tr.appendChild(o.tfootCheckboxCell(grid));
      }

      grid.$columns.forEach(function(column, idx) {
        tr.appendChild(o.tfootCell(grid, column, idx));
      });

      return tr;
    },

    // For now, tfoot cell is the same as the thead cell
    tfootCell: function(grid, column, idx) {
      return o.theadCell(grid, column, idx);
    },

    // Create cell for grid thead node.
    tfootCheckboxCell: function(grid) {
      var cell = o.theadCheckboxCell(grid);

      // Put the span value at the the bottom...
      cell.appendChild(cell.childNodes[0]);

      return cell;
    },

    // Create fragment of rows.
    tbodyRows: function(grid, data, startIdx) {
      var fragment = $doc.createFragment();
      for (var i = 0, size = data.length; i < size; ++i) {
        fragment.appendChild(o.tbodyRow(grid, data[i], startIdx + i));
      }

      return fragment;
    },

    // Create a row for grid tbody node.
    tbodyRow: function(grid, data, idx) {
      var $tr = $($doc.tr());

      // Add index
      $tr.attr(DATA_WAFFLE_IDX, idx);

      // Add id value
      $tr.attr(DATA_WAFFLE_ID, grid.$data.$$key(data));

      // Add css for selected row
      if (grid.isSelectable() && grid.$selection.contains(data)) {
        $tr.addClass(CSS_SELECTED);
      }

      if (grid.hasCheckbox()) {
        $tr[0].appendChild(o.tbodyCheckboxCell(grid, data));
      }

      grid.$columns.forEach(function(column, idx) {
        $tr[0].appendChild(o.tbodyCell(grid, data, column, idx));
      });

      return $tr[0];
    },

    // Create a cell for grid tbody node
    tbodyCell: function(grid, data, column, idx) {
      var $td = $($doc.td())
        .addClass(column.cssClasses(idx, false))
        .css(column.styles(idx, false))
        .attr(column.attributes(idx, false));

      // Check for editable column
      var editable = column.editable;
      if (editable) {
        $td.append(o.tbodyControl(column, data));
      } else {
        $td.html(column.render(data));
      }

      return $td[0];
    },

    // Create a cell for grid tbody node
    tbodyCheckboxCell: function(grid, data) {
      var $checkbox = $($doc.inputCheckbox())
        .prop('checked', grid.isSelected(data));

      return $($doc.td())
        .addClass(CSS_CHECKBOX_CELL)
        .append($checkbox[0])[0];
    },

    // Create control for editable cell
    tbodyControl: function(column, data) {
      var editable = column.editable;

      var control;

      if (editable.type === 'select') {
        control = $doc.select();

        // Append custom options
        if (editable.options) {
          _.forEach(editable.options, function(option) {
            var opt = $doc.option();

            opt.innerHTML = option.label != null ? option.label : '';

            if (option.value != null) {
              opt.value = option.value;
            }

            control.appendChild(opt);
          });
        }
      } else {
        control = $doc.input();
        control.setAttribute('type', editable.type);
      }

      // Add column id to control to simplify parsing
      control.setAttribute(DATA_WAFFLE_ID, column.id);

      // For checkbox inputs, we must set the 'checked' property...
      var prop = editable.type === 'checkbox' ? 'checked' : 'value';
      var formatter = formatters[editable.type] || _.identity;
      control[prop] = formatter(column.value(data));

      // Append custom css
      if (editable.css) {
        control.className = editable.css;
      }

      return control;
    }
  };

  return o;
})();

var GridResizer = (function() {

  var PX = 'px';
  var PERCENT = 'percent';
  var AUTO = 'auto';

  var widthComputer = {};

  widthComputer[PX] = function(newWidth) {
    return $util.fromPx(newWidth);
  };

  widthComputer[PERCENT] = function(newWidth, total) {
    return $util.fromPercentage(newWidth) * total / 100;
  };

  widthComputer[AUTO] = function(newWidth, total, size) {
    return total / size;
  };

  var o = {
    // Resize grid.
    resize: function(grid) {
      o.applySize(grid);
    },

    // Apply new size on the grid.
    applySize: function(grid) {
      var size = grid.options.size;

      // Get table size
      // These properties may be some external functions
      var tableWidth = _.result(size, 'width');
      var tableHeight = _.result(size, 'height');

      // Check if grid has fixed size
      var isFixedWidth = tableWidth && tableWidth !== AUTO;
      var isFixedHeight = tableHeight && tableHeight !== AUTO;

      // Fix table width using inline styles
      if (isFixedWidth) {
        var pxWidth = $util.toPx(tableWidth);
        grid.$table.css({
          width: pxWidth,
          maxWidth: pxWidth,
          minWidth: pxWidth
        });
      }

      // Fix table height using inline styles
      if (isFixedHeight) {
        var pxHeight = $util.toPx(tableHeight);
        grid.$tbody.css({
          maxHeight: pxHeight
        });
      }

      // Compute available space
      var rowWidth = isFixedWidth ? $util.fromPx(tableWidth) : null;

      // Size is not explicitly fixed, try to get width from real dom element
      // This allow size to be defined with css rules
      // At this step, table must have been appended to the dom
      if (!rowWidth) {
        rowWidth = grid.$table[0].offsetWidth;
      }

      // We have to retain scrollbar size
      rowWidth -= $doc.scrollbarWidth();

      // We also have to retain size for checkbox column
      if (grid.hasCheckbox()) {
        rowWidth -= 30;
      }

      // Now, we can update column width
      var columns = grid.$columns;
      var diff = o.computeWidth(rowWidth, columns);

      if (diff.length > 0) {
        // If a pending change is already here for this column, then do not trigger
        // a second one since the first will be enough to update column
        var pendingChanges = _.indexBy(columns.pendingChanges(), function(change) {
          return change.type + '_' + change.index;
        });

        for (var i = 0, ln = diff.length; i < ln; ++i) {
          var index = columns.indexOf(diff[i]);
          if (!_.has(pendingChanges, 'update_' + index)) {
            // We can trigger the update
            columns.triggerUpdate(index);
          }
        }
      }

      return this;
    },

    // Compute width for each columns
    computeWidth: function(totalWidth, columns) {
      var remainingSpace = totalWidth;
      var constrainedColumnCount = 0;

      var mapWidth = new HashMap();

      // Split columns into groups:
      // - Group with fixed width.
      // - Group with width that must be computed using percentage of remaining space.
      // - Group with width that should expand to remaining space.
      var groups = columns.groupBy(function(column) {
        var width = _.result(column, 'width');

        // Track width
        mapWidth.put(column.id, width);

        // Fixed size, set as a number or as a px value
        if (_.isNumber(width) || $util.isPx(width)) {
          return PX;
        }

        // Percentage size, column size will be computed using percentage
        // of available space
        if ($util.isPercentage(width)) {
          return PERCENT;
        }

        // Automatic sizing, column will expand to available space
        return AUTO;
      });

      // Track changes
      var diff = [];

      // Now, update widths for each groups
      _.forEach([PX, PERCENT, AUTO], function(group) {
        var cols = groups[group];
        if (cols) {
          var total = remainingSpace;
          var size = cols.length;

          _.forEach(cols, function(column) {
            var computedWidth = widthComputer[group](mapWidth.get(column.id), total, size);

            // Update computed width
            if (computedWidth !== column.computedWidth) {
              column.computedWidth = computedWidth;
              diff.push(column);
            }

            // And update remaining flags
            remainingSpace -= computedWidth;
            constrainedColumnCount++;
          });
        }
      });

      return diff;
    }
  };

  return o;
})();

var GridDataObserver = {
  // Apply data changes to grid.
  on: function(changes) {
    _.forEach(changes, function(change) {
      var fnName = 'on' + $util.capitalize(change.type);
      GridDataObserver[fnName].call(this, change);
    }, this);

    return this;
  },

  // Update grid on splice change.
  onSplice: function(change) {
    var $tbody = this.$tbody;
    var tbody = $tbody[0];
    var childNodes = tbody.childNodes;
    var index = change.index;
    var addedCount = change.addedCount;
    var collection = change.object;

    var removedNodes;
    var addedNodes;
    var addedData;
    var removedData = change.removed;

    var removedCount = removedData.length;
    if (removedCount > 0) {
      if (index === 0 && removedCount === childNodes.length) {
        removedNodes = _.toArray(childNodes);
        $tbody.empty();
      } else {
        removedNodes = [];
        for (var k = 0; k < removedCount; ++k) {
          removedNodes.push(tbody.removeChild(childNodes[index]));
        }
      }

      // Do not forget to remove previously selected data !
      var $selection = this.$selection;
      if ($selection && $selection.length > 0) {
        $selection.remove(removedData);
      }
    }

    // Append new added data
    if (addedCount > 0) {
      addedNodes = [];
      addedData = [];

      var fragment = $doc.createFragment();

      for (var i = 0; i < addedCount; ++i) {
        var rowIdx = i + index;
        var data = collection.at(rowIdx);
        var tr = GridBuilder.tbodyRow(this, data, rowIdx);

        addedNodes.push(tr);
        addedData.push(data);
        fragment.appendChild(tr);
      }

      if (index > 0) {
        // Add after existing node
        $tbody.children().eq(index - 1).after(fragment);
      } else {
        // Add at the beginning
        $tbody.prepend(fragment);
      }
    }

    if (removedNodes || addedNodes) {
      // We need to update row index
      for (var start = (index + addedCount), length = childNodes.length; start < length; ++start) {
        childNodes[start].setAttribute(DATA_WAFFLE_IDX, start);
      }

      // Trigger events
      this.dispatchEvent('dataspliced', {
        added: addedData || [],
        addedNodes: addedNodes || [],
        removedNodes: removedNodes || [],
        removed: removedData,
        index: index
      });
    }

    return this;
  },

  // Update grid on update change
  onUpdate: function(change) {
    var index = change.index;
    var data = this.$data.at(index);
    var tbody = this.$tbody[0];

    // Create new node representation and merge diff with old node
    var oldNode = tbody.childNodes[index];
    var newNode = GridBuilder.tbodyRow(this, data, index);
    var result = $vdom.mergeNodes(tbody, oldNode, newNode);

    // Trigger event
    this.dispatchEvent('dataupdated', {
      index: index,
      oldNode: oldNode,
      newNode: result
    });

    return this;
  }
};
var GridColumnsObserver = (function() {

  var tdIndexer = function(td) {
    return td.getAttribute(DATA_WAFFLE_ID);
  };

  var removeColumns = function(wrapper, columns) {
    var removedNodes = [];
    var childNodes = wrapper.childNodes;
    for (var i = 0, size = childNodes.length; i < size; ++i) {
      var row = childNodes[i];
      var map = _.indexBy(row.childNodes, tdIndexer);

      for (var k = 0, count = columns.length; k < count; ++k) {
        var childToRemove = map[columns[k].id];
        if (childToRemove) {
          removedNodes.push(row.removeChild(childToRemove));
        }
      }
    }

    return removedNodes;
  };

  var insertBefore = function(parentNode, child, idx) {
    return parentNode.insertBefore(child, parentNode.childNodes[idx] || null);
  };

  // Cell factories, related to parent tag name.
  var cellFactories = {
    tbody: function(column, nodeIndex, idx) {
      return GridBuilder.tbodyCell(this, this.$data.at(idx), column, nodeIndex);
    },
    thead: function(column, nodeIndex) {
      return GridBuilder.theadCell(this, column, nodeIndex);
    },
    tfoot: function(column, nodeIndex) {
      return GridBuilder.tfootCell(this, column, nodeIndex);
    }
  };

  // Cell updater.
  // This function will update cell at given index for
  // each row of given tag name.
  var cellFactory = function(tagName, column, nodeIndex) {
    return function(tr, index) {
      var oldNode = tr.childNodes[nodeIndex];
      var newNode = cellFactories[tagName].call(this, column, nodeIndex, index);
      var result = $vdom.mergeNodes(tr, oldNode, newNode);
      return {
        oldNode: oldNode,
        newNode: result
      };
    };
  };

  // Update column flag according to grid options
  var updateColumn = function(grid, column) {
    // Update draggable flag
    column.draggable = !!column.draggable || !!grid.isDraggable();

    if (!grid.isSortable()) {
      column.sortable = false;
    }
  };

  var o = {
    // Apply columns changes to grid.
    on: function(changes) {
      _.forEach(changes, function(change) {
        var fnName = 'on' + $util.capitalize(change.type);
        o[fnName].call(this, change);
      }, this);

      return this;
    },

    // Update columns on splice change.
    onSplice: function(change) {
      var thead = this.$thead[0];
      var tbody = this.$tbody[0];
      var tfoot = this.$tfoot[0];

      var hasCheckbox = this.hasCheckbox();
      var index = change.index;
      var addedCount = change.addedCount;
      var removedData = change.removed;

      var theadRemovedNodes = [];
      var tbodyRemovedNodes = [];
      var tfootRemovedNodes = [];

      var $data = this.$data;
      var $columns = this.$columns;

      var i, k, idx, tr, dataSize;

      var removedCount = removedData.length;
      

      var hasDiff = removedCount > 0 || addedCount > 0;
      if (hasDiff && this.isResizable()) {
        // Columns have been added or removed, a new resize should be applied
        this.resize();
      }

      if (removedCount > 0) {
        theadRemovedNodes.push.apply(theadRemovedNodes, removeColumns(thead, removedData));
        tfootRemovedNodes.push.apply(tfootRemovedNodes, removeColumns(tfoot, removedData));
        tbodyRemovedNodes.push.apply(tbodyRemovedNodes, removeColumns(tbody, removedData));
      }

      var theadAddedNodes = [];
      var tbodyAddedNodes = [];
      var tfootAddedNodes = [];

      // Insert new columns
      if (addedCount > 0) {
        // Update header & footer
        for (i = 0; i < addedCount; ++i) {
          idx = index + i;

          var column = $columns.at(idx);

          // Update column flags
          updateColumn(this, column);

          var th1 = GridBuilder.theadCell(this, column, idx);
          var th2 = GridBuilder.tfootCell(this, column, idx);

          tr = thead.childNodes[0];
          theadAddedNodes.push(insertBefore(tr, th1, hasCheckbox ? idx + 1 : idx));

          tr = tfoot.childNodes[0];
          tfootAddedNodes.push(insertBefore(tr, th2, hasCheckbox ? idx + 1 : idx));
        }

        // Update body rows
        // It is important to run through tbody nodes (and not data collection), since
        // some data may have been added, and associate change is still pending (so row
        // are not added yet).
        for (k = 0, dataSize = tbody.childNodes.length; k < dataSize; ++k) {
          tr = tbody.childNodes[k];

          // Index current cell
          // If grid has already been rendered due to a previous change,
          // columns may already be here
          var map = _.indexBy(tr.childNodes, tdIndexer);

          // We should retrieve data by its id
          // It is really important to do this way since data may have been unshift
          // or spliced at an arbitrary index, so row index may not be sync with data index
          // at this step (it will be updated by a pending change).
          var dataId = tr.getAttribute(DATA_WAFFLE_ID);
          var data = $data.byKey(dataId);

          for (i = 0; i < addedCount; ++i) {
            idx = index + i;

            var currentColumn = $columns.at(idx);
            var columnId = currentColumn.id;
            if (map[columnId]) {
              // Remove, it will be added right after at the right position
              tr.removeChild(map[columnId]);
            }

            var td = GridBuilder.tbodyCell(this, data, $columns.at(idx), idx);
            tbodyAddedNodes.push(insertBefore(tr, td, hasCheckbox ? idx + 1 : idx));
          }
        }
      }

      if (hasDiff) {
        // Editable column may have been added, or editable columns
        // may have been removed, so we should bind or unbind event.
        var isEditable = this.isEditable();
        if (addedCount > 0 && isEditable) {
          GridDomBinders.bindEdition(this);
        } else if (removedCount > 0 && !isEditable) {
          GridDomBinders.unbindEdition(this);
        }

        this.dispatchEvent('columnsspliced', {
          index: index,

          removedNodes: {
            thead: theadRemovedNodes,
            tbody: tbodyRemovedNodes,
            tfoot: tfootRemovedNodes
          },

          addedNodes: {
            thead: theadAddedNodes,
            tbody: tbodyAddedNodes,
            tfoot: tfootAddedNodes
          }
        });
      }

      return this;
    },

    // Column has been updated
    onUpdate: function(change) {
      var index = change.index;
      var nodeIndex = this.hasCheckbox() ? index + 1 : index;
      var column = this.$columns.at(index);

      // Update column flags
      updateColumn(this, column);

      var iteratee = function(tagName) {
        var acc = [
          [], // Store old nodes
          []  // Store new nodes
        ];

        var childNodes = this['$' + tagName][0].childNodes;
        var factory = cellFactory.call(this, tagName, column, nodeIndex);
        var fn = function(acc, tr, index) {
          var result = factory.call(this, tr, index);
          acc[0].push(result.oldNode);
          acc[1].push(result.newNode);
          return acc;
        };

        return _.reduce(childNodes, fn, acc, this);
      };

      // Iterate for each section
      var results = _.map(['thead', 'tfoot', 'tbody'], iteratee, this);

      // Update editable state
      if (column.editable) {
        GridDomBinders.bindEdition(this);
      } else if (!this.isEditable()) {
        GridDomBinders.unbindEdition(this);
      }

      // Dispatch event
      this.dispatchEvent('columnsupdated', {
        index: index,
        oldNodes: {
          thead: results[0][0],
          tfoot: results[1][0],
          tbody: results[2][0]
        },
        newNodes: {
          thead: results[0][1],
          tfoot: results[1][1],
          tbody: results[2][1]
        }
      });

      return this;
    }
  };

  return o;
})();
var GridSelectionObserver = (function() {
  var findCheckBox = function(row) {
    return row.childNodes[0].childNodes[0];
  };

  var updateCheckbox = function(checkbox, checked) {
    checkbox.checked = checked;
  };

  var o = {
    // Apply data changes to grid.
    on: function(changes) {
      _.forEach(changes, function(change) {
        var fnName = 'on' + $util.capitalize(change.type);
        var fn = GridSelectionObserver[fnName];
        if (fn) {
          fn.call(this, change);
        }
      }, this);

      return this;
    },

    // Update selection
    onSplice: function(change) {
      var $tbody = this.$tbody;
      var $data = this.$data;
      var $selection = change.object;

      var idx, row;

      var tbody = $tbody[0];
      var childNodes = tbody.childNodes;
      var index = change.index;
      var removed = change.removed;
      var addedCount = change.addedCount;

      // Deselection
      var removedCount = removed.length;
      if (removedCount > 0) {
        for (var k = 0; k < removedCount; ++k) {
          idx = $data.indexOf(removed[k]);

          // Data may not be in grid data collection, since this change
          // may have been triggered because data has been removed.
          if (idx >= 0) {
            row = childNodes[idx];

            $(row).removeClass(CSS_SELECTED);
            if (this.hasCheckbox()) {
              updateCheckbox(findCheckBox(row), false);
            }
          }
        }
      }

      // Selection
      if (addedCount > 0) {
        for (var i = 0; i < addedCount; ++i) {
          idx = $data.indexOf($selection.at(index + i));
          row = childNodes[idx];

          $(row).addClass(CSS_SELECTED);
          if (this.hasCheckbox()) {
            updateCheckbox(findCheckBox(row), true);
          }
        }
      }

      if (addedCount > 0 || removedCount > 0) {
        // If no difference with the selection size, no need to manipulate the dom here
        var diff = addedCount - removedCount;
        if (diff && this.hasCheckbox()) {
          var selectionLength = $selection.length;
          var thead = this.$thead[0];
          var tfoot = this.$tfoot[0];

          var theadCell = thead.childNodes[0].childNodes[0];
          var theadSpan = theadCell.childNodes[0];
          var theadCheckbox = theadCell.childNodes[1];

          var tfootCell = tfoot.childNodes[0].childNodes[0];
          var tfootSpan = tfootCell.childNodes[1];
          var tfootCheckbox = tfootCell.childNodes[0];

          tfootSpan.innerHTML = theadSpan.innerHTML = selectionLength;
          tfootSpan.title = theadSpan.title = selectionLength;

          tfootCheckbox.checked = theadCheckbox.checked = this.isSelected();
          tfootCheckbox.indeterminate = theadCheckbox.indeterminate = selectionLength > 0 && $data.length !== selectionLength;
        }

        // Trigger event
        this.dispatchEvent('selectionchanged', function() {
          return {
            selection: this.$selection.toArray()
          };
        });
      }

      return this;
    }
  };

  return o;
})();
var Grid = (function() {

  // Normalize sort predicate
  // This function will return an array of id preprended with sort order
  // For exemple:
  //   parseSort('foo') => ['+foo']
  //   parseSort(['foo', 'bar']) => ['+foo', '+bar']
  //   parseSort(['-foo', 'bar']) => ['-foo', '+bar']
  //   parseSort(['-foo', '+bar']) => ['-foo', '+bar']
  var parseSort = function(ids) {
    var array = ids || [];
    if (!_.isArray(array)) {
      array = [array];
    }

    return _.map(array, function(current) {
      var firstChar = current.charAt(0);
      return firstChar !== CHAR_ORDER_ASC && firstChar !== CHAR_ORDER_DESC ? CHAR_ORDER_ASC + current : current;
    });
  };

  // == Private utilities

  // Get exisiting node or create it and append it to the table.
  var createNode = function(tagName) {
    // Get existing node or create it
    var varName = '$' + tagName;
    var $table = this.$table;

    // Get it...
    this[varName] = $($doc.byTagName(tagName, $table[0]));

    // ... or create it !
    if (!this[varName].length) {
      this[varName] = $($doc[tagName]());
    }

    // Just append at the end of the table
    $table.append(this[varName][0]);
  };

  var callbackWrapper = function(name) {
    var fn = this.options.events[name];
    if (fn) {
      this.addEventListener(name.slice(2), this.options.events[name]);
    }
  };

  var Constructor = function(table, options) {
    if (!(this instanceof Constructor)) {
      return new Constructor(table, options);
    }

    // Initialize main table
    var $table = this.$table = $(table);

    // Initialize options
    var opts = this.options = options = options || {};
    var defaultOptions = Constructor.options;

    // Try to initialize options with default values
    // - If option is already defined, use it (but initialize default values for nested object).
    // - If option is not defined, try to get html value.
    // - If option is still not defined, use default.
    _.forEach(_.keys(defaultOptions), function(optName) {
      var opt = opts[optName];
      var def = defaultOptions[optName];

      // Try to initialize from html
      // If options is already defined, do not try to parse html
      if (_.isUndefined(opt)) {
        var attrName = $util.toSpinalCase(optName);
        var htmlAttr = $table[0].getAttribute(attrName) || $table[0].getAttribute('data-' + attrName);
        if (htmlAttr) {
          opt = opts[optName] = $util.parse(htmlAttr);
        }
      }

      // Initialize default values of nested objects
      if (_.isObject(def) && (_.isObject(opt) || _.isUndefined(opt))) {
        opt = opts[optName] = _.defaults(opt || {}, def);
      }

      // It it is still undefined, use default value
      if (_.isUndefined(opt)) {
        opt = opts[optName] = def;
      }
    });

    // Translate size to valid numbers.
    opts.size = {
      width: opts.size.width,
      height: opts.size.height
    };

    // Force scroll if height is specified.
    opts.scrollable = opts.scrollable || !!opts.size.height;

    // Initialize data
    this.$data = new Collection(opts.data, {
      key: opts.key,
      model: opts.model
    });

    var isSortable = this.isSortable();
    var isDraggable = this.isDraggable();

    if (opts.columns && (!isSortable || isDraggable)) {
      // Force column not to be sortable
      _.forEach(opts.columns, function(column) {
        if (!isSortable) {
          column.sortable = false;
        }

        // Force column to be draggable
        if (isDraggable) {
          column.draggable = true;
        }
      });
    }

    this.$columns = new Collection(opts.columns, {
      key: 'id',
      model: Column
    });

    // Options flags
    var isScrollable = opts.scrollable;
    var isSelectable = this.isSelectable();
    var isEditable = this.isEditable();

    this.$sortBy = [];

    // Add appropriate css to table
    $table.addClass(CSS_GRID);

    if (isSelectable) {
      $table.addClass(CSS_SELECTABLE);
    }

    if (isScrollable) {
      $table.addClass(CSS_SCROLLABLE);
    }

    // Create main nodes
    _.forEach([THEAD, TBODY, TFOOT], createNode, this);

    // Observe collection to update grid accordingly
    this.$data.observe(GridDataObserver.on, this);
    this.$columns.observe(GridColumnsObserver.on, this);

    this.$$events = {};

    // Bind dom handlers only if needed
    if (isSortable) {
      GridDomBinders.bindSort(this);
    }

    // Bind input event if editable columns are updated
    if (isEditable) {
      GridDomBinders.bindEdition(this);
    }

    if (isSelectable) {
      this.$selection = new Collection([], this.$data.options());
      this.$selection.observe(GridSelectionObserver.on, this);

      // Bind selection events
      GridDomBinders.bindSelection(this);
    }

    // Create event bus...
    this.$bus = new EventBus();

    // ... and wrap callbacks to events
    _.forEach(_.keys(opts.events), callbackWrapper, this);

    // If height is specified, we need to set column size.
    if (this.isResizable()) {
      this.resize();

      // Bind resize event to resize grid automatically when window view is resized
      GridDomBinders.bindResize(this);
    }

    this.renderHeader()
        .renderFooter()
        .sortBy(options.sortBy, false)
        .renderBody();

    // Grid is up to date !
    this.$data.clearChanges();
    this.$columns.clearChanges();

    if (isDraggable) {
      GridDomBinders.bindDragDrop(this);
    }

    this.dispatchEvent('initialized');
  };

  // Create new grid
  Constructor.create = function(table, options) {
    return new Constructor(table, options);
  };

  Constructor.prototype = {
    // Get data collection
    data: function() {
      return this.$data;
    },

    // Get columns collection
    columns: function() {
      return this.$columns;
    },

    // Get selection collection
    selection: function() {
      return this.$selection;
    },

    // Check if grid hasat least
    isEditable: function() {
      return this.options.editable || this.$columns.some(function(column) {
        return !!column.editable;
      });
    },

    // Check if grid is sortable
    isSortable: function() {
      return this.options.sortable;
    },

    // Check if grid is selectable
    isSelectable: function() {
      var selection = this.options.selection;
      return selection && selection.enable;
    },

    // Check if grid is resizable
    isResizable: function() {
      var size = this.options.size;
      return !!size.height || !!size.width;
    },

    // Check if grid render checkbox as first column
    hasCheckbox: function() {
      return this.isSelectable() && this.options.selection.checkbox;
    },

    // Without parameter, check if grid is selected.
    // If first parameter is set, check if data is selected.
    isSelected: function(data) {
      if (!this.isSelectable()) {
        return false;
      }

      if (data) {
        return this.$selection.contains(data);
      }

      var s1 = this.$data.length;
      var s2 = this.$selection.length;
      return s1 > 0 && s1 === s2;
    },

    isDraggable: function() {
      return !!this.options.dnd;
    },

    // Render entire grid
    render: function() {
      this.renderHeader()
          .renderFooter()
          .renderBody();

      // Grid is up to date !
      this.$columns.clearChanges();
      this.$data.clearChanges();

      return this;
    },

    // Render entire header of grid
    renderHeader: function() {
      var tr = GridBuilder.theadRow(this);
      this.$thead.empty().append(tr);
      return this;
    },

    // Render entire footer of grid
    renderFooter: function() {
      var tr = GridBuilder.tfootRow(this);
      this.$tfoot.empty().append(tr);
      return this;
    },

    // Render entire body of grid
    // Each row is appended to a fragment in memory
    // This fragment will be appended once to tbody element to avoid unnecessary DOM access
    // If render is asynchronous, data will be split into chunks, each chunks will be appended
    // one by one using setTimeout to let the browser to be refreshed periodically.
    renderBody: function(async) {
      var asyncRender = async == null ? this.options.async : async;
      var grid = this;

      var empty = _.once(function() {
        grid.$tbody.empty();
      });

      var build = function(data, startIdx) {
        var fragment = GridBuilder.tbodyRows(grid, data, startIdx);
        empty();
        grid.$tbody.append(fragment);
      };

      var onEnded = function() {
        grid.$data.clearChanges();

        grid.dispatchEvent('rendered', function() {
          return {
            data: this.$data,
            nodes: _.toArray(this.$tbody[0].childNodes)
          };
        });

        // Free memory
        grid = empty = build = onEnded = null;
      };

      if (asyncRender) {
        $util.asyncTask(this.$data.split(200), 10, build, onEnded);
      } else {
        build(this.$data, 0);
        onEnded();
      }

      return this;
    },

    // Resize grid with new values
    resize: function() {
      GridResizer.resize(this);
      return this;
    },

    // Select everything
    select: function() {
      if (this.$selection.length !== this.$data.length) {
        this.$selection.add(this.$data.toArray());
      }

      return this;
    },

    // Deselect everything
    deselect: function() {
      if (!this.$selection.isEmpty()) {
        this.$selection.clear();
      }

      return this;
    },

    // Sort grid by fields
    // Second parameter is a parameter used internally to disable automatic rendering after sort
    sortBy: function(sortBy, $$render) {
      // Store new sort
      var normalizedSortBy = parseSort(sortBy);

      // Check if sort predicate has changed
      // Compare array instance, or serialized array to string and compare string values (faster than array comparison)
      if (this.$sortBy === normalizedSortBy || this.$sortBy.join() === normalizedSortBy.join()) {
        return this;
      }

      this.$sortBy = normalizedSortBy;

      // Remove order flag
      var $headers = this.$thead.children().eq(0).children();
      var $footers = this.$tfoot.children().eq(0).children();

      $headers.removeClass(CSS_SORTABLE_ASC + ' ' + CSS_SORTABLE_DESC).removeAttr(DATA_WAFFLE_ORDER);
      $footers.removeClass(CSS_SORTABLE_ASC + ' ' + CSS_SORTABLE_DESC).removeAttr(DATA_WAFFLE_ORDER);

      // Create comparators object that will be used to create comparison function
      var $columns = this.$columns;
      var hasCheckbox = this.hasCheckbox();

      var comparators = _.map(this.$sortBy, function(id) {
        var flag = id.charAt(0);
        var columnId = id.substr(1);
        var asc = flag === CHAR_ORDER_ASC;

        var index = $columns.indexOf(columnId);
        var thIndex = hasCheckbox ? index + 1 : index;

        var column;

        if (index >= 0) {
          column = $columns.at(index);
          column.asc = asc;

          // Update order flag
          $headers.eq(thIndex)
                  .addClass(asc ? CSS_SORTABLE_ASC : CSS_SORTABLE_DESC)
                  .attr(DATA_WAFFLE_ORDER, flag);

          $footers.eq(thIndex)
                  .addClass(asc ? CSS_SORTABLE_ASC : CSS_SORTABLE_DESC)
                  .attr(DATA_WAFFLE_ORDER, flag);

        } else {
          column = {};
        }

        return {
          parser: column.$parser || $parse(id),
          fn: column.$comparator || $comparators.$auto,
          desc: !asc
        };
      });

      this.$data.sort($$createComparisonFunction(comparators));

      if ($$render !== false) {
        // Body need to be rendered since data is now sorted
        this.renderBody();
      }

      return this.dispatchEvent('sorted');
    },

    // Trigger events listeners
    // First argument is the name of the event.
    // For lazy evaluation of arguments, second argument is a function that
    // should return event argument. This function will be called if and only if
    // event need to be triggered.
    // If lazy evaluation is needless, just put arguments next to event name.
    dispatchEvent: function(name, argFn) {
      this.$bus.dispatchEvent(this, name, argFn);

      // Trigger events when one of other event is triggered
      // This can be a way to add a single listener to all events
      this.$bus.dispatchEvent(this, 'updated');

      return this;
    },

    addEventListener: function(type, listener) {
      this.$bus.addEventListener(type, listener);
      return this;
    },

    removeEventListener: function(type, listener) {
      this.$bus.removeEventListener(type, listener);
      return this;
    },

    // Destroy datagrid
    destroy: function() {
      // Unbind dom events
      this.$table.off();
      this.$thead.off();
      this.$tfoot.off();
      this.$tbody.off();

      // Unbind resize event
      if (this.$$events.onResize) {
        $(window).off('resize', this.$$events.onResize);
      }

      // Unobserve collection
      this.$data.unobserve();
      this.$columns.unobserve();
      this.$selection.unobserve();

      // Clear event bus
      this.$bus.clear();

      // Clear event listeners
      this.$$events = null;

      // Destroy internal property
      $util.destroy(this);
    }
  };

  // Define default options.
  Constructor.options = {
    // Default identifier for data.
    key: 'id',

    // Data initialization
    data: null,

    // Columns initialization
    columns: null,

    // Default sort
    sortBy: null,

    // Asynchronous rendering, disable by default.
    // Should be used to improve user experience with large dataset.
    async: false,

    // Global scrolling
    // Scrolling is automatically set to true if height is set
    // using size option.
    // If size is not set, scolling is enabled, but column and table
    // size have to be set using css.
    scrollable: false,

    // Global sorting
    // Sort can also be disabled per column
    sortable: true,

    // Global edition
    // This will be updated automatically if some columns are editable.
    // Set this property to true if you want to add some editable columns after initialization
    editable: false,

    // Drag&Drop
    dnd: false,

    // Selection configuration.
    // By default it is enable.
    selection: {
      enable: true,
      checkbox: true,
      multi: false
    },

    // Size of grid, default is to use automatic size.
    size: {
      width: null,
      height: null
    },

    // Set of events.
    events: {
    }
  };

  // Initialize events with noop
  _.forEach(['onInitialized', 'onUpdated', 'onRendered', 'onDataSpliced', 'onDataChanged', 'onDataUpdated', 'onColumnsSpliced', 'onColumnsUpdated', 'onSelectionChanged', 'onSorted'], function(name) {
    Constructor.options.events[name] = null;
  });

  return Constructor;

})();

var Waffle = {
  Grid: Grid,

  // Add new "global" renderer
  addRenderer: function(id, fn) {
    $renderers[id] = fn;
    return Waffle;
  },

  // Add new "global" comparator
  addComparator: function(id, fn) {
    $comparators[id] = fn;
    return Waffle;
  }
};
// Plugin name used to register grid with $.fn.data method
var $PLUGIN_NAME = 'wafflejs';

$.fn.waffle = function(options) {

  var retValue = this;
  var args = [retValue].concat(_.rest(arguments));

  // Initialize plugin
  if (_.isUndefined(options) || _.isObject(options)) {
    this.each(function() {
      var $this = $(this);
      var $waffle = $this.data($PLUGIN_NAME);

      if (!$waffle) {
        $waffle = new Grid(this, options);
        $this.data($PLUGIN_NAME, $waffle);

        // Destroy grid when node is removed
        $this.on('waffleDestroyed', function() {
          var $table = $(this);
          $table.data($PLUGIN_NAME).destroy();
          $table.removeData($PLUGIN_NAME)
                .off();
        });
      }
    });
  }

  // Call method
  else if (_.isString(options)) {
    retValue = $.fn.waffle[options].apply(null, args) || retValue;
  }

  // Chain or return effective result
  return retValue;
};

// Default options
$.fn.waffle.options = {
};

// Add special event to destroy grid when node is removed
$.event.special.waffleDestroyed = {
  add: function(o) {
    if (o.handler) {
      o.handler = _.bind(o.handler, this);
    }
  },
  remove: function(o) {
    if (o.handler) {
      o.handler(o);
    }
  }
};

// Map public functions of grid

var $publicFunctions = _.filter(_.functions(Grid.prototype), function(fn) {
  return fn.charAt(0) !== '$';
});

_.forEach($publicFunctions, function(fn) {
  $.fn.waffle[fn] = function($selection) {
    var args = _.rest(arguments);
    var retValue = [];

    $selection.each(function() {
      var $table = $(this);
      var $grid = $table.data($PLUGIN_NAME);
      if ($grid) {
        var result = $grid[fn].apply($grid, args);
        var chainResult = result instanceof Grid ? $selection : result;

        if (chainResult === $selection) {
          retValue[0] = chainResult;
        } else {
          retValue.push(chainResult);
        }
      }
    });

    return retValue.length === 1 ? retValue[0] : retValue;
  };
});

// Map static waffle methods
_.forEach(_.functions(Waffle), function(prop) {
  $.fn.waffle[prop] = Waffle[prop];
});

// Map options with $.fn.waffle.options
$.fn.waffle.options = Grid.options;

return Waffle;
  }));

})(window, document, void 0);