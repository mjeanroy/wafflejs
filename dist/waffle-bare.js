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
var $parse = function(key) {
  var parts = $parse.$split(key);
  var size = parts.length;

  return function(object) {
    var current = object;

    for (var i = 0; i < size; ++i) {
      if (current == null || !_.isObject(current)) {
        return undefined;
      }

      current = _.result(current, parts[i]);
    }

    return current;
  };
};

// Transform bracket notation to dot notation
// This is a really simple parser that will turn attribute
// path to a normalized path
// Examples:
//  foo.bar           => foo.bar
//  foo[0]            => foo.0
//  foo['id']         => foo.id
//  foo["id"]         => foo.id
//  foo.bar[0]['id']  => foo.bar.0.id
$parse.$normalize = function(key) {
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
$parse.$split = function(key) {
  return $parse.$normalize(key).split('.');
};

var $sanitize = function(input) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(input));
  return div.innerHTML;
};

var CSS_PREFIX = 'waffle-';
var CSS_SORTABLE = CSS_PREFIX + 'sortable';
var CSS_SORTABLE_ASC = CSS_SORTABLE + '-asc';
var CSS_SORTABLE_DESC = CSS_SORTABLE + '-desc';
var CSS_SCROLLABLE = CSS_PREFIX + 'fixedheader';

var DATA_PREFIX = 'data-waffle-';
var DATA_WAFFLE_ID = DATA_PREFIX + 'id';
var DATA_WAFFLE_SORTABLE = DATA_PREFIX + 'sortable';
var DATA_WAFFLE_ORDER = DATA_PREFIX + 'order';

var CHAR_ORDER_ASC = '+';
var CHAR_ORDER_DESC = '-';

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

    // Compute scrollbar width
    scrollbarWidth: _.memoize(scrollbarWidth, hasher)
  };

  _.forEach(['tr', 'td', 'th', 'tbody', 'thead'], function(tagName) {
    o[tagName] = function() {
      return this.create(tagName);
    };
  });

  return o;

})();

var $util = {
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
  }
};
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
    this.$$map = new HashMap();

    var opts = options || {};

    this.$$key = opts.key || 'id';

    // Use Object as a fallback since every object is already an instance of Object !
    this.$$model = opts.model || Object;

    if (!_.isFunction(this.$$key)) {
      this.$$key = $parse(this.$$key);
    }

    this.$$observers = [];
    this.$$changes = [];

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
    var idx = collection.$$map.get(id);
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
  var put = function(collection, o, i) {
    collection[i] = o;
    if (o != null) {
      collection.$$map.put(collection.$$key(o), i);
    }
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

  // Call observer callback
  var callObserver = function(o) {
    o.callback.call(o.ctx, this.$$changes);
  };

  // == Public prototype

  Constructor.prototype = {
    // Get element at given index
    // Shortcut to array notation
    at: function(index) {
      return this[index];
    },

    // Get item by its key value
    byKey: function(key) {
      var index = this.indexByKey(key);
      return index >= 0 ? this.at(index) : undefined;
    },

    // Get index of item by its key
    indexByKey: function(key) {
      return this.$$map.contains(key) ? this.$$map.get(key) : -1;
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
    add: function(start, models) {
      var args = [start, 0].concat(models);
      this.splice.apply(this, args);
      return this.length;
    },

    // Remove elements at given index
    // This is a shortcut for splice(start, deleteCount)
    remove: function(start, deleteCount) {
      return this.splice.call(this, start, deleteCount);
    },

    // Adds one or more elements to the end of the collection
    // and returns the new length of the collection.
    // Semantic is the same as [].push function
    push: function() {
      return this.add.call(this, this.length, _.toArray(arguments));
    },

    // adds one or more elements to the beginning of the collection
    // and returns the new length of the collection.
    // Semantic is the same as [].unshift function
    unshift: function() {
      return this.add.call(this, 0, _.toArray(arguments));
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
      return new Constructor(newArray, {
        key: this.$$key,
        model: this.$$model
      });
    },

    // returns a shallow copy of a portion of the collection
    // into a new collection object.
    slice: function() {
      var results = callNativeArrayFn('slice', this, arguments);
      return new Constructor(results, {
        key: this.$$key,
        model: this.$$model
      });
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
      var iteratee = function(m) {
        return parseModel(this, m);
      };

      var added = _.map(data, iteratee, this);
      var addedCount = added.length;

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

      // Trigger changes
      if (changes && changes.length > 0) {
        this.trigger(changes);
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
      return this.map($parse(name));
    },

    // Add new observer
    observe: function(callback, observer) {
      this.$$observers.push({
        ctx: observer || null,
        callback: callback
      });

      return this;
    },

    // Remove observer
    unobserve: function(callback, observer) {
      if (arguments.length === 0) {
        // Unobserve everything
        this.$$observers = [];
      }
      else {
        var ctx = observer || null;
        this.$$observers = _.reject(this.$$observers, function(o) {
          return o.ctx === ctx && callback === o.callback;
        });
      }

      return this;
    },

    // Trigger changes
    // Note that callbacks will be called asynchronously
    trigger: function(changes) {
      this.$$changes = this.$$changes.concat(changes);

      var collection = this;
      setTimeout(function() {
        if (collection.$$changes.length > 0) {
          _.forEach(collection.$$observers, callObserver, collection);
          collection.$$changes = [];
        }

        // Free memory
        collection = null;
      });

      return this;
    },

    // Clear pending changes
    clearChanges: function() {
      this.$$changes = [];
      return this;
    }
  };

  _.forEach(['indexOf', 'size', 'lastIndexOf', 'first', 'last', 'initial', 'rest', 'partition', 'forEach', 'map', 'every', 'some', 'reduce', 'reduceRight', 'filter', 'reject', 'find', 'toArray'], function(fn) {
    if (_[fn]) {
      Constructor.prototype[fn] = function() {
        var args = [this].concat(_.toArray(arguments));
        return _[fn].apply(_, args);
      };
    }
  });

  _.forEach(['countBy', 'groupBy', 'indexBy'], function(fn) {
    Constructor.prototype[fn] = function(callback, ctx) {
      // Support nested property in collection object
      if (_.isString(callback)) {
        callback = $parse(callback);
      }

      return _[fn].call(_, this, callback, ctx);
    };
  });

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
      var str = toString(value);
      return str.charAt(0).toUpperCase() + str.slice(1);
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
    var t1 = new Date(a == null ? 0 : a).getTime();
    var t2 = new Date(b == null ? 0 : b).getTime();
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
    var escape = column.escape;
    var sortable = column.sortable;

    this.id = column.id;
    this.title = column.title || '';
    this.field = column.field || this.id;
    this.css = column.css || this.id;
    this.escape = isUndefined(escape) ? true : !!escape;
    this.width = fromPx(column.width);
    this.sortable = isUndefined(sortable) ? true : !!sortable;
    this.asc = isUndefined(column.asc) ? null : !!column.asc;

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
      if (header && this.sortable) {
        attributes[DATA_WAFFLE_SORTABLE] = true;

        var asc = this.asc;
        if (asc != null) {
          attributes[DATA_WAFFLE_ORDER] = asc ? CHAR_ORDER_ASC : CHAR_ORDER_DESC;
        }
      }

      return attributes;
    },

    // Compute inline style to set on each cell
    styles: function() {
      var styles = {};

      // Set width as inline style
      var width = toPx(this.width);
      if (width) {
        styles.width = width;
        styles.maxWidth = width;
        styles.minWidth = width;
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
      var value = object == null ? '' : this.$parser(object);

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
    }
  };

  return Constructor;
})();

var Grid = (function() {

  // Save bytes
  var toPx = $util.toPx;
  var fromPx = $util.fromPx;

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

  // Call an event listener of given grid.
  // Grid object is returned.
  var call = function(grid, name, argFn) {
    var fn = grid.options.events[name];
    if (fn !== _.noop) {
      fn.apply(grid, (argFn || _.noop).call(grid));
    }
    return grid;
  };

  // Initialize grid:
  //  - Create or retrieve thead element
  //  - Create or retrieve tbody element
  var createNodes = function(grid) {
    var table = grid.$table[0];
    grid.$tbody = $($doc.byTagName('tbody', table));
    grid.$thead = $($doc.byTagName('thead', table));

    if (!grid.$thead.length) {
      var thead = $doc.thead();
      grid.$thead = $(thead);
      grid.$table.append(thead);
    }

    if (!grid.$tbody.length) {
      var tbody = $doc.tbody();
      grid.$tbody = $(tbody);
      grid.$table.append(tbody);
    }

    return grid;
  };

  // Build row and return it
  // Should be a private function
  var renderRow = function(grid, data) {
    var tr = $doc.tr();

    grid.$columns.forEach(function(column, idx) {
      var $node = $($doc.td())
        .addClass(column.cssClasses(idx, false))
        .css(column.styles(idx, false))
        .attr(column.attributes(idx, false))
        .html(column.render(data));

       tr.appendChild($node[0]);
    });

    return tr;
  };

  var Constructor = function(table, options) {
    if (!(this instanceof Constructor)) {
      return new Constructor(table, options);
    }

    // Initialize options with default values
    _.defaults(options.events || {}, Constructor.options.events);
    this.options = _.defaults(options || {}, Constructor.options);

    // Initialize main table
    this.$table = $(table);

    // Initialize data and columns
    this.$data = new Collection(options.data || [], {
      key: options.key
    });

    this.$columns = new Collection(options.columns || [], {
      key: 'id',
      model: Column
    });

    // Extract size
    var size = options.size;
    this.options.size = {
      width: fromPx(size.width),
      height: fromPx(size.height)
    };

    this.$sortBy = [];

    createNodes(this);

    this.$$bind()
        .$$observe()
        .assignWidth()
        .renderHeader()
        .sortBy(options.sortBy, false)
        .renderBody();

    call(this, 'onInitialized');
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

    // Render entire grid
    render: function() {
      return this.renderHeader()
                 .renderBody();
    },

    // Calculate column width
    assignWidth: function() {
      var size = this.options.size;
      var rowWidth = size.width;

      if (size.height) {
        var px = toPx(size.width);
        this.$table.addClass(CSS_SCROLLABLE)
                   .css({
                     width: px,
                     maxWidth: px,
                     minWidth: px
                   });

        this.$tbody.css({
          maxHeight: toPx(size.height)
        });

        rowWidth -= $doc.scrollbarWidth();
      }

      var constrainedWidth = 0;
      var constrainedColumnCount = 0;
      this.$columns.forEach(function(col) {
        var width = col.width;
        if (width) {
          constrainedWidth += width;
          ++constrainedColumnCount;
        }
      });

      var columnCount = this.$columns.length;
      var remainingColumns = columnCount - constrainedColumnCount;
      var flooredCalculatedWidth = 0;
      var remains = 0;
      if (remainingColumns) {
        var calculatedWidthColumn = (rowWidth - constrainedWidth) / remainingColumns;
        flooredCalculatedWidth = Math.floor(calculatedWidthColumn);
        remains = calculatedWidthColumn - flooredCalculatedWidth;
      }

      var offset = 0;
      this.$columns.forEach(function(col) {
        var oldWidth = col.width;
        var newWidth = oldWidth || 0;

        // If size is not explicitly specified, we should compute a size
        // For now, use the same width for every column
        if (!newWidth) {
          offset += remains;
          if (offset >= 1) {
            newWidth = flooredCalculatedWidth + 1;
            offset--;
          } else {
            newWidth = flooredCalculatedWidth;
          }
        }

        // Update size if we detect a change
        if (newWidth !== oldWidth) {
          col.updateWidth(newWidth);
        }
      });

      return this;
    },

    // Render entire header of grid
    renderHeader: function() {
      var tr = $doc.tr();

      this.$columns.forEach(function(column, idx, array) {
        var $node = $($doc.th())
          .addClass(column.cssClasses(idx, true))
          .css(column.styles(idx, true))
          .attr(column.attributes(idx, array, true))
          .html(column.title);

        tr.appendChild($node[0]);
      });

      this.$thead.empty().append(tr);

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

      var buildFragment = function(grid, data) {
        var fragment = $doc.createFragment();
        for (var i = 0, dataSize = data.length; i < dataSize; ++i) {
          var row = renderRow(grid, data[i]);
          fragment.appendChild(row);
        }
        return fragment;
      };

      var onEnded = function(grid) {
        grid.$data.clearChanges();

        call(grid, 'onRendered', function() {
          return [this.$data, _.toArray(this.$tbody[0].childNodes)];
        });

        // Free memory
        grid = buildFragment = onEnded = null;
      };

      if (asyncRender) {
        // Async rendering
        var delay = 10;
        var chunks = this.$data.split(200);
        var timer = function() {
          if (chunks.length > 0) {
            var fragment = buildFragment(grid, chunks.shift());
            grid.$tbody.append(fragment);
            setTimeout(timer, delay);
          } else {
            onEnded(grid);
            timer = chunks = null;
          }
        };

        this.$tbody.empty();
        setTimeout(timer);
      }
      else {
        var fragment = buildFragment(grid, grid.data());
        grid.$tbody.empty().append(fragment);
        onEnded(grid);
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
      var $tr = this.$thead.children().eq(0);
      var $th = $tr.children();
      $th.removeClass(CSS_SORTABLE_ASC + ' ' + CSS_SORTABLE_DESC)
         .removeAttr(DATA_WAFFLE_ORDER);

      // Create comparators object that will be used to create comparison function
      var $columns = this.$columns;
      var comparators = _.map(this.$sortBy, function(id) {
        var flag = id.charAt(0);
        var columnId = id.substr(1);
        var asc = flag === CHAR_ORDER_ASC;

        var index = $columns.indexByKey(columnId);

        var column;

        if (index >= 0) {
          column = $columns.at(index);
          column.asc = asc;

          // Update order flag
          $th.eq(index)
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

      return call(this, 'onSorted');
    },

    // Destroy datagrid
    destroy: function() {
      return this.$$unbind()
                 .$$unobserve()
                 .$$destroy();
    },

    // Destroy internal data
    // Should be a private function
    $$destroy: function() {
      for (var i in this) {
        if (this.hasOwnProperty(i)) {
          this[i] = null;
        }
      }
      return this;
    },

    // Bind user events
    // Should be a private function
    $$bind: function() {
      var that = this;
      this.$thead.on('click', function(e) {
        var th = e.target;
        if (th.getAttribute(DATA_WAFFLE_SORTABLE)) {
          var id = th.getAttribute(DATA_WAFFLE_ID);
          var currentOrder = th.getAttribute(DATA_WAFFLE_ORDER) || CHAR_ORDER_DESC;
          var newOrder = currentOrder === CHAR_ORDER_ASC ? CHAR_ORDER_DESC : CHAR_ORDER_ASC;

          var newPredicate = newOrder + id;

          var newSortBy;

          if (e.shiftKey) {
            newSortBy = that.$sortBy.slice();

            // We need to remove old predicate
            var oldPredicate = currentOrder + id;
            var idx = newSortBy.indexOf(oldPredicate);
            if (idx >= 0) {
              newSortBy.splice(idx, 1);
            }

            // And append new predicate
            newSortBy.push(newPredicate);

          }
          else {
            newSortBy = [newPredicate];
          }

          that.sortBy(newSortBy);
        }
      });
      return this;
    },

    // Unbind user events
    // Should be a private function
    $$unbind: function() {
      this.$thead.off();
      return this;
    },

    // Observe data collection
    $$observe: function() {
      this.$data.observe(this.$$onDataChange, this);
      return this;
    },

    // Delete all observers on data collection
    $$unobserve: function() {
      this.$data.unobserve();
      return this;
    },

    // Listener on changes on data collection
    $$onDataChange: function(changes) {
      _.forEach(changes, function(change) {
        var type = change.type;
        var method = '$$on_' + type;
        this[method](change);
      }, this);

      return this;
    },

    // Data collection has been spliced
    // It means that elements have been added or removed
    $$on_splice: function(change) {
      var index = change.index;
      var addedCount = change.addedCount;
      var collection = change.object;

      var removedCount = change.removed.length;
      if (removedCount > 0) {
        var removedNodes;

        if (index === 0 && removedCount === this.$tbody[0].childNodes.length) {
          removedNodes = _.toArray(this.$tbody[0].childNodes);
          this.$tbody.empty();
        } else {
          removedNodes = [];
          for (var k = 0; k < removedCount; ++k) {
            var removedIndex = k + index;
            var $node = this.$tbody.children().eq(removedIndex);
            removedNodes.push($node[0]);
            $node.remove();
          }
        }

        // Trigger callback
        call(this, 'onRemoved', function() {
          return [change.removed, removedNodes, index];
        });
      }

      // Append new added data
      if (addedCount > 0) {
        var fragment = $doc.createFragment();
        var added = [];
        var addedNodes = [];

        for (var i = 0; i < addedCount; ++i) {
          var rowIdx = i + index;
          var data = collection.at(rowIdx);
          var tr = renderRow(this, data);

          addedNodes.push(tr);
          added.push(data);
          fragment.appendChild(tr);
        }

        if (index > 0) {
          // Add after existing node
          this.$tbody.children()
                     .eq(index - 1)
                     .after(fragment);
        } else {
          // Add at the beginning
          this.$tbody.prepend(fragment);
        }

        // Trigger callback
        call(this, 'onAdded', function() {
          return [added, addedNodes, index];
        });
      }

      return this;
    },

    // Some data have been updated
    // Should be a private function
    $$on_update: function(change) {
      var index = change.index;
      var data = this.$data.at(index);
      var tbody = this.$tbody[0];

      var oldNode = tbody.childNodes[index];
      var newNode = renderRow(this, data);
      tbody.replaceChild(newNode, oldNode);

      return this;
    }
  };

  // Define some default options
  Constructor.options = {
    key: 'id',
    async: false,
    size: {
      width: null,
      height: null
    },
    events: {
    }
  };

  // Initialize events with noop
  _.forEach(['onInitialized', 'onRendered', 'onAdded', 'onRemoved', 'onSorted'], function(name) {
    Constructor.options.events[name] = _.noop;
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
        var opts = $.extend({}, $.fn.waffle.options);
        if (_.isObject(options)) {
          opts = $.extend(opts, options);
        }

        $waffle = new Grid(this, opts);
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