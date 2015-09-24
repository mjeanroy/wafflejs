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

  (function(factory) {

    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory);
    } else if (typeof exports === 'object') {
      // Node/CommonJS
      module.exports = factory();
    } else {
      // Browser globals
      window.Waffle = factory();
    }

  }(function() {

    'use strict';

    var $ = (function() {

      var JqLite = function(nodes) {
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

        _.forEach(nodes, function(node, idx) {
          this[idx] = node;
        }, this);

        this.length = nodes.length;

        // Store internal event listeners binded
        // with addEventListener or attachEvent
        // This will be used to remove event listeners
        this.$$events = [];
      };

      // Bind event
      var bind = function($o, event, callback, node) {
        node.addEventListener(event, callback);

        // Track event
        $o.$$events.push({
          event: event,
          callback: callback,
          node: node
        });
      };

      // Unbind event
      var unbind = function($o, event, callback, node) {
        node.removeEventListener(event, callback);
      };

      // Iterate over all internal elements applying given function
      // and return current context value
      var iterate = function($o, fn) {
        _.forEach($o, fn, $o);
        return $o;
      };

      JqLite.prototype = {
        // Get the children of each element in the set of matched elements.
        children: function() {
          var children = [];

          iterate(this, function(node) {
            _.forEach(node.childNodes, function(childNode) {
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
          var array = events.indexOf(' ') >= 0 ? events.split(' ') : [events];

          for (var i = 0, size = array.length; i < size; ++i) {
            for (var k = 0, ln = this.length; k < ln; ++k) {
              bind(this, array[i], callback, this[k]);
            }
          }

          return this;
        },

        // Detach events
        off: function(events, listener) {
          var array = events ?
            (events.indexOf(' ') >= 0 ? events.split(' ') : [events]) :
            [];

          var nbEvents = array.length;

          var $$events = [];

          for (var i = 0, size = this.$$events.length; i < size; ++i) {
            var e = this.$$events[i];
            var found = nbEvents === 0;

            for (var k = 0; k < nbEvents; ++k) {
              var current = array[k];
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
          return iterate(this, function(node) {
            while (node.firstChild) {
              node.removeChild(node.firstChild);
            }
          });
        },

        // Append node
        append: function(childNode) {
          return iterate(this, function(node, idx, collection) {
            var clone = idx === (collection.length - 1) ? childNode : childNode.cloneNode(true);
            node.appendChild(clone);
          });
        },

        // Prepend node
        prepend: function(childNode) {
          return iterate(this, function(node, idx, collection) {
            var clone = idx === (collection.length - 1) ? childNode : childNode.cloneNode(true);
            node.insertBefore(clone, node.childNodes[0]);
          });
        },

        // Append node after element
        after: function(childNode) {
          return iterate(this, function(node, idx, collection) {
            var clone = idx === (collection.length - 1) ? childNode : childNode.cloneNode(true);
            node.parentNode.insertBefore(clone, node.nextSibling);
          });
        },

        // Add inline style
        css: function(propertyName, value) {
          var styles;
          var keys;

          if (_.isObject(propertyName)) {
            styles = propertyName;
            keys = _.keys(styles);
          } else {
            styles = {};
            styles[propertyName] = value;
            keys = [propertyName];
          }

          return iterate(this, function(node) {
            _.forEach(keys, function(propertyName) {
              node.style[propertyName] = styles[propertyName];
            });
          });
        },

        // Add css class
        addClass: function(css) {
          return iterate(this, function(node) {
            var actualCss = node.className;
            node.className = (actualCss ? actualCss + ' ' : '') + css;
          });
        },

        // Remove a single class, multiple classes in the set of matched elements.
        removeClass: function(classes) {
          var css = classes.split(' ');
          var map = _.indexBy(css, function(c) {
            return c;
          });

          return iterate(this, function(node) {
            var actualClasses = node.className;
            var newClasses = _.filter(actualClasses.split(' '), function(c) {
              return !map[c];
            });

            node.className = newClasses.join(' ');
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

          return iterate(this, function(node) {
            _.forEach(keys, function(k) {
              node.setAttribute(k, values[k]);
            });
          });
        },

        // Remove attribute
        removeAttr: function(name) {
          return iterate(this, function(node) {
            node.removeAttribute(name);
          });
        }
      };

      return JqLite;
    })();

    var _ = (function() {

      var ArrayProto = Array.prototype;
      var nativeSlice = ArrayProto.slice;
      var ObjectProto = Object.prototype;
      var nativeKeys = Object.keys;
      var hasOwnProperty = ObjectProto.hasOwnProperty;
      var toString = ObjectProto.toString;
      var nativeBind = Function.prototype.bind;

      var callbackWrapper = function(callback) {
        if (_.isString(callback)) {
          return function(value) {
            return value[callback];
          };
        }

        return callback;
      };

      var groupByWrapper = function(behavior) {
        return function(array, callback, ctx) {
          var result = {};

          var iteratee = callbackWrapper(callback);

          for (var i = 0, size = array.length; i < size; ++i) {
            var key = iteratee.call(ctx, array[i], i, array);
            behavior(result, array[i], key);
          }

          return result;
        };
      };

      var _ = {};

      // Check if given object is null
      _.isNull = function(obj) {
        return obj === null;
      };

      // Check if given object is a boolean
      _.isBoolean = function(obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
      };

      // Bind a function to an object, meaning that whenever the function is called,
      // the value of this will be the object.
      _.bind = function(fn, ctx) {
        if (nativeBind) {
          return fn.bind(ctx);
        }

        return function() {
          return fn.apply(ctx, arguments);
        };
      };

      // Creates a function that returns the same value that is used as the
      // argument of _.constant.
      _.constant = function(value) {
        return function() {
          return value;
        };
      };

      // Creates a real Array from the list (anything that can be iterated over).
      // Useful for transmuting the arguments object.
      _.toArray = function(obj) {
        return _.map(obj, function(value) {
          return value;
        });
      };

      // Is the given value NaN? (NaN is the only number which does not equal itself).
      _.isNaN = function(obj) {
        return _.isNumber(obj) && obj !== +obj;
      };

      // Creates a version of the function that can only be called one time.
      // Repeated calls to the modified function will have no effect, returning the value
      // from the original call.
      _.once = function(fn) {
        var wasCalled = false;
        var returnValue;

        return function() {
          if (!wasCalled) {
            wasCalled = true;
            returnValue = fn.apply(this, arguments);
            fn = null;
          }

          return returnValue;
        };
      };

      // Fill in undefined properties in object with the first value present in the default objects.
      _.defaults = function(o1, o2) {
        _.forEach(_.keys(o2), function(k) {
          if (_.isUndefined(o1[k])) {
            o1[k] = o2[k];
          }
        });

        return o1;
      };

      // If the value of the named property is a function, then invoke it with
      // the object as context, otherwise return it.
      _.result = function(o, prop) {
        var value = o[prop];
        return _.isFunction(value) ? value.call(o) : value;
      };

      // Check if object has given key
      _.has = function(object, key) {
        return hasOwnProperty.call(object, key);
      };

      // Return the number of values in the list.
      _.size = function(array) {
        if (array == null) {
          return 0;
        }

        return array.length;
      };

      // Returns the first element of an array.
      // Passing n will return the first n elements of the array.
      _.first = function(array, n) {
        if (n == null) {
          return array[0];
        }
        return nativeSlice.call(array, 0, n);
      };

      // Returns the last element of an array.
      // Passing n will return the last n elements of the array.
      _.last = function(array, n) {
        if (n == null) {
          return array[array.length - 1];
        }
        return nativeSlice.call(array, array.length - n, array.length);
      };

      // Returns the rest of the elements in an array.
      // Pass an index to return the values of the array from that index onward.
      _.rest = function(array, index) {
        var start = arguments.length > 1 ? index : 1;
        return nativeSlice.call(array, start, array.length);
      };

      // Returns the rest of the elements in an array.
      // Pass an index to return the values of the array from that index onward.
      _.initial = function(array, index) {
        var length = array.length;
        var end = arguments.length > 1 ? length - index : length - 1;
        return nativeSlice.call(array, 0, end);
      };

      // Return the position of the first occurrence of an item in an array, or -1
      // if the item is not included in the array.
      _.indexOf = function(array, item) {
        for (var i = 0, size = array.length; i < size; ++i) {
          if (array[i] === item) {
            return i;
          }
        }
        return -1;
      };

      // Return the position of the last occurrence of an item in an array, or -1
      // if the item is not included in the array.
      _.lastIndexOf = function(array, item) {
        for (var i = array.length - 1; i >= 0; --i) {
          if (array[i] === item) {
            return i;
          }
        }
        return -1;
      };

      // Check that array contains given item.
      _.contains = function(array, item) {
        return _.indexOf(array, item) >= 0;
      };

      // Get all keys of object
      _.keys = function(object) {
        if (!_.isObject(object)) {
          return [];
        }

        if (nativeKeys) {
          return nativeKeys(object);
        }

        var keys = [];
        for (var key in object) {
          if (_.has(object, key)) {
            keys.push(key);
          }
        }

        return keys;
      };

      // Returns a sorted list of the names of every method in an object.
      _.functions = function(obj) {
        var names = [];
        for (var key in obj) {
          if (_.isFunction(obj[key])) {
            names.push(key);
          }
        }
        return names.sort();
      };

      // Map array to a new array using callback results
      _.map = function(array, callback, ctx) {
        var newArray = [];
        for (var i = 0, size = array.length; i < size; ++i) {
          newArray[i] = callback.call(ctx, array[i], i, array);
        }
        return newArray;
      };

      // Tests whether all elements in the array pass the test
      // implemented by the provided function.
      _.every = function(array, callback, ctx) {
        for (var i = 0, size = array.length; i < size; ++i) {
          if (!callback.call(ctx, array[i], i, array)) {
            return false;
          }
        }
        return true;
      };

      // Tests whether some element in the array passes the test
      // implemented by the provided function.
      _.some = function(array, callback, ctx) {
        for (var i = 0, size = array.length; i < size; ++i) {
          if (callback.call(ctx, array[i], i, array)) {
            return true;
          }
        }
        return false;
      };

      // Creates a new array with all elements that pass
      // the test implemented by the provided function.
      _.filter = function(array, callback, ctx) {
        var newArray = [];
        for (var i = 0, size = array.length; i < size; ++i) {
          if (callback.call(ctx, array[i], i, array)) {
            newArray.push(array[i]);
          }
        }
        return newArray;
      };

      // Returns the values in list without the elements that the truth test (predicate) passes.
      _.reject = function(array, callback, ctx) {
        var newArray = [];
        for (var i = 0, size = array.length; i < size; ++i) {
          if (!callback.call(ctx, array[i], i, array)) {
            newArray.push(array[i]);
          }
        }
        return newArray;
      };

      // Applies a function against an accumulator and each value
      // of the array (from left-to-right) has to reduce it to a single value.
      _.reduce = function(array, callback, initialValue, ctx) {
        var nbArgs = arguments.length;
        var step = nbArgs >= 3 ? initialValue : array[0];
        var size = array.length;
        var i = nbArgs >= 3 ? 0 : 1;

        for (; i < size; ++i) {
          step = callback.call(ctx, step, array[i], i, array);
        }

        return step;
      };

      // Applies a function against an accumulator and each value
      // of the array (from right-to-left) has to reduce it to a single value.
      _.reduceRight = function(array, callback, initialValue, ctx) {
        var nbArgs = arguments.length;
        var size = array.length - 1;
        var step = nbArgs >= 3 ? initialValue : array[size];
        var i = nbArgs >= 3 ? size : size - 1;

        for (; i >= 0; --i) {
          step = callback.call(ctx, step, array[i], i, array);
        }

        return step;
      };

      // Looks through each value in the list, returning the first one that
      // passes a truth test (predicate), or undefined if no value passes the test.
      // The function returns as soon as it finds an acceptable element, and doesn't traverse the entire list.
      _.find = function(array, callback, ctx) {
        for (var i = 0, size = array.length; i < size; ++i) {
          if (callback.call(ctx, array[i], i, array)) {
            return array[i];
          }
        }
        return undefined;
      };

      // Split a collection into two arrays: one whose elements all
      // satisfy the given predicate, and one whose elements all
      // do not satisfy the predicate.
      _.partition = function(array, iteratee) {
        var pass = [];
        var fail = [];

        for (var i = 0, size = array.length; i < size; ++i) {
          if (iteratee.call(null, array[i], i, array)) {
            pass.push(array[i]);
          } else {
            fail.push(array[i]);
          }
        }

        return [pass, fail];
      };

      // Memoize an expensive function by storing its results.
      _.memoize = function(func, hasher) {
        var memoize = function(key) {
          var cache = memoize.cache;
          var address = hasher ? hasher.apply(this, arguments) : key;
          if (!_.has(cache, address)) {
            cache[address] = func.apply(this, arguments);
          }
          return cache[address];
        };

        memoize.cache = {};

        return memoize;
      };

      // // Returns a function, that, as long as it continues to be invoked, will not
      // be triggered. The function will be called after it stops being called for
      // N milliseconds. If `immediate` is passed, trigger the function on the
      // leading edge, instead of the trailing.
      _.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
          var context = this;
          var args = arguments;

          var later = function() {
            timeout = null;
            if (!immediate) {
              func.apply(context, args);
            }
          };

          var callNow = immediate && !timeout;

          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }

          timeout = setTimeout(later, wait);

          if (callNow) {
            func.apply(context, args);
          }
        };
      };

      // Wrap the function inside of the wrapper function, passing it
      // as the first argument.
      _.wrap = function(fn, wrapper) {
        return function() {
          var args = _.toArray(arguments);
          var newArgs = [fn].concat(args);
          return wrapper.apply(this, newArgs);
        };
      };

      // Return current timestamp.
      _.now = Date.now || function() {
          return new Date().getTime();
      };

      var uid = 0;

      // Generate a unique integer id (unique within the entire client session).
      _.uniqueId = function(prefix) {
        var id = ++uid + '';
        return prefix ? prefix + id : id;
      };

      // Given a list, and an iteratee function that returns a key for each element in the list (or a property name),
      // returns an object with an index of each item.
      _.indexBy = groupByWrapper(function(result, value, key) {
        result[key] = value;
      });

      // Splits a collection into sets, grouped by the result of
      // running each value through iteratee.
      // If iteratee is a string instead of a function, groups by the property
      // named by iteratee on each of the values.
      _.groupBy = groupByWrapper(function(result, value, key) {
        (result[key] = result[key] || []).push(value);
      });

      // Sorts a list into groups and returns a count for the number of objects
      // in each group. Similar to groupBy, but instead of returning a list of values,
      // returns a count for the number of values in that group.
      _.countBy = groupByWrapper(function(result, value, key) {
        result[key] = (result[key] || 0) + 1;
      });

      return _;

    })();

    (function() {
      var toString = Object.prototype.toString;

      // Returns undefined irrespective of the arguments passed to it
      _.noop = function() {};

      // Returns the same value that is used as the argument
      _.identity = function(value) {
        return value;
      };

      // Check if given object is undefined
      _.isUndefined = function(obj) {
        return typeof obj === 'undefined';
      };

      // Check if given object is a plain old javascript object
      _.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
      };

      // Check that given object is a DOM element
      _.isElement = function(obj) {
        return !!(obj && obj.nodeType === 1);
      };

      // Clone array or object.
      _.clone = function(o) {
        return _.isArray(o) ? _.map(o, _.identity) : _.extend({}, o);
      };

      // Apply callback for each item of array
      _.forEach = function(array, callback, ctx) {
        for (var i = 0, size = array.length; i < size; ++i) {
          callback.call(ctx, array[i], i, array);
        }
      };

      // Copy all of the properties in the source objects over to the
      // destination object.
      _.extend = function(destination, source) {
        for (var i in source) {
          if (_.has(source, i)) {
            destination[i] = source[i];
          }
        }
        return destination;
      };

      // Generic is<Type> functions
      _.forEach(['String', 'Function', 'Number', 'Date', 'Array'], function(type) {
        _['is' + type] = function(o) {
          return toString.call(o) === '[object ' + type + ']';
        };
      });

      // Optimisation: use native isArray if available
      // http://jsperf.com/isarray-vs-instanceof/22
      if (Array.isArray) {
        _.isArray = Array.isArray;
      }

    })();

    var $json = (function() {
      var createFn = function(fn) {
        return function(value) {
          if (!JSON || !JSON[fn]) {
            throw Error('JSON.' + fn + ' is not available in your browser');
          }

          return JSON[fn](value);
        };
      };

      return {
        toJson: createFn('stringify'),
        fromJson: createFn('parse')
      };
    })();

    var HashMap = (function() {
      var prefix = 'key_';
      var keyFactory = function(k) {
        return prefix + k;
      };

      var HashMap = function() {
        this.$o = {};
      };

      HashMap.prototype = {
        // Clear map
        // Running time: O(1)
        clear: function() {
          this.$o = {};
        },

        // Put value into map using given key
        // Running time: O(1)
        put: function(key, value) {
          this.$o[keyFactory(key)] = value;
          return this;
        },

        // Get value associated to given key
        // Running time: O(1)
        get: function(key) {
          return this.$o[keyFactory(key)];
        },

        // Remove value associated to given key
        // Running time: O(1)
        remove: function(key) {
          delete this.$o[keyFactory(key)]
          ;
          return this;
        },

        // Check if given key is inside the map
        // Running time: O(1)
        contains: function(key) {
          return _.has(this.$o, keyFactory(key));
        }
      };

      return HashMap;
    })();

    var $sniffer = (function() {
      // This property is available only in IE
      var cacheEvents = new HashMap();

      // This is a map of events with tagName to use for feature
      // detection.
      var events = {
        'input': 'input'
      };

      return {
        hasEvent: function(event) {
          // IE <= 11 support input event, but it is really
          // buggy, so we disable this feature for these browsers
          if (event === 'input' && document.documentMode <= 11) {
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
    })();

    var Stack = (function() {
      var Node = function(value, next) {
        this.value = value;
        this.next = next || null;
      };

      var Stack = function() {
        this.root = null;
      };

      Stack.prototype = {
        // Push new value onto the stack.
        // Running time: O(1)
        push: function(value) {
          this.root = new Node(value, this.root);
        },

        // Peek value from the stack.
        // Running time: O(1)
        peek: function() {
          return this.root ? this.root.value : undefined;
        },

        // Peek value from the stack and remove entry.
        // Running time: O(1)
        pop: function() {
          var value;

          if (this.root) {
            value = this.root.value;
            this.root = this.root.next;
          }

          return value;
        },

        // Check if stack is empty.
        // Running time: O(1)
        isEmpty: function() {
          return !this.root;
        }
      };

      return Stack;
    })();

    var $parse = (function() {
      var cache = new HashMap();

      var throwError = function(end) {
        throw Error('Malformed expression: ' + end || 'unexpected end of input');
      };

      var defaultHandler = function(currentChar, current) {
        return current + currentChar;
      };

      var checkEnd = function(openChar) {
        return function(currentChar, current, results, stack) {
          if (stack.pop() !== openChar) {
            throwError();
          }
        };
      };

      var EMPTY_STR = '';
      var DOT = '.';
      var OPEN_BRACKET = '[';
      var OPEN_PARENTHESIS = '(';
      var CLOSE_BRACKET = ']';
      var CLOSE_PARENTHESIS = ')';
      var DOUBLE_QUOTE = '"';
      var SINGLE_QUOTE = '\'';
      var SPACE = ' ';

      var handlers = {};

      // Process dot character.
      // This should indicate a key delimiter.
      handlers[DOT] = function(currentChar, current, results) {
        results.push(current);
        return EMPTY_STR;
      };

      // Process bracket character.
      // This should indicate a key delimiter.
      // Note that open bracket must be closed at the end.
      handlers[OPEN_BRACKET] = function(currentChar, current, results, stack) {
        stack.push(currentChar);
        return handlers[DOT].apply(this, arguments);
      };

      // Process open parenthesis.
      // This should indicate a function call.
      // Note that open parenthesis must be closed at the end.
      handlers[OPEN_PARENTHESIS] = function(currentChar, current, results, stack) {
        stack.push(currentChar);
      };

      // Process double quote.
      // Note that double quote must be closed at the end.
      handlers[DOUBLE_QUOTE] = function(currentChar, current, results, stack) {
        switch (stack.peek()) {
          case currentChar:
            // First case is simple: quote is closed
            stack.pop();
            break;
          case OPEN_BRACKET:
            // Second case is also simple: quote is preceeded by a bracket
            stack.push(currentChar);
            break;
          default:
            // Otherwise, this is a malformed expression
            throwError();
        }
      };

      // Process space.
      // Space is ignored between open and close parenthesis.
      // Space is ignored between open and close bracket (if not inside a key).
      handlers[SPACE] = function(currentChar, current, results, stack) {
        var previous = stack.peek();
        if (previous !== OPEN_PARENTHESIS && previous !== OPEN_BRACKET) {
          return current + currentChar;
        }
      };

      // Process single quote.
      // Behavior should be the same as double quote.
      handlers[SINGLE_QUOTE] = handlers[DOUBLE_QUOTE];

      // Process close tags.
      // This should only check that associated open tag is the last value in
      // stack.
      handlers[CLOSE_BRACKET] = checkEnd(OPEN_BRACKET);
      handlers[CLOSE_PARENTHESIS] = checkEnd(OPEN_PARENTHESIS);

      // This is a really simple parser that will turn attribute
      // path to a normalized path.
      // --
      // Examples:
      //  foo.bar           => foo.bar
      //  foo[0]            => foo.0
      //  foo['id']         => foo.id
      //  foo["id"]         => foo.id
      //  foo.bar[0]['id']  => foo.bar.0.id
      // --
      // Running time: 0(n)
      var $normalize = function(key) {
        var results = [];
        var stack = new Stack();
        var current = '';

        for (var i = 0, size = key.length; i < size; ++i) {
          var currentChar = key.charAt(i);
          var handler = handlers[currentChar] || defaultHandler;

          // Process handler and check result.
          var handlerResult = handler(currentChar, current, results, stack);

          // If returned value is a string, then current part must be updated
          // with the returned value.
          if (_.isString(handlerResult)) {
            current = handlerResult;
          }
        }

        // Stack must be empty at the end, otherwise, expression is not ended.
        // Last part must also not be empty.
        if (!stack.isEmpty() || !current) {
          throwError();
        }

        // Do not forget to push last part
        results.push(current);

        return results;
      };

      var ensureObject = function(object) {
        if (object == null) {
          return {};
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

      return function(key) {
        if (!cache.contains(key)) {
          var parts = $normalize(key);

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
    })();

    var $sanitize = function(input) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(input));
      return div.innerHTML;
    };

    var CSS_PREFIX = 'waffle-';
    var CSS_GRID = CSS_PREFIX + 'grid';
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
    var DATA_WAFFLE_CID = DATA_PREFIX + 'cid';
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

      // Get the result of given function.
      // If first argument is not a function, then it is automatically
      // returned.
      // Otherwise, function is executed using ctx as context and args as
      // arguments.
      resultWith: function(fn, ctx, args) {
        return _.isFunction(fn) ? fn.apply(ctx, args) : fn;
      },

      // Split array (or array like object) into smaller arrays.
      // Returned value is an array of smaller arrays (a.k.a chunks).
      split: function(array, size) {
        var actualSize = size || 20;
        var chunks = [];

        var chunk = [];
        for (var i = 0, length = array.length; i < length; ++i) {
          chunk.push(array[i]);

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

      // Parse value
      parse: function(json) {
        try {
          return $json.fromJson(json);
        } catch (e) {
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

      var setAttributes = function(node, attributes) {
        // This should always be set first.
        // Since key order is not guaranteed, force it.
        var type = attributes.type;
        if (type) {
          node.type = type;
        }

        _.forEach(_.keys(attributes), function(attribute) {
          var value = attributes[attribute];
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

      var setChildren = function(node, children) {
        if (_.isString(children)) {
          // Do not worry about xss injection, since this api should be called with:
          // - Escaped values.
          // - Non escaped values, but this option must be explicitely enabled.
          node.innerHTML = children;
        } else if (_.isArray(children)) {
          _.forEach(children, function(child) {
            node.appendChild(child);
          });
        } else {
          node.appendChild(children);
        }
      };

      var o = {
        // Create dom element
        create: function(tagName, attributes, children) {
          var element = document.createElement(tagName);

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
        o[tagName] = function(attributes, children) {
          return this.create.call(this, tagName, attributes, children);
        };
      });

      _.forEach(['text', 'checkbox', 'number', 'email', 'url', 'date', 'time', 'datetime'], function(type) {
        o['input' + $util.capitalize(type)] = function(attributes, children) {
          var attrs = _.extend({
            type: type
          }, attributes || {});
          return this.input.call(this, attrs, children);
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
              delete oldAttributes[name]
              ;
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

    var WaffleEvent = (function() {
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

      return WaffleEvent;
    })();

    var EventBus = (function() {

      var formatEventName = function(type) {
        return type.toLowerCase();
      };

      var EventBus = function() {
        this.$events = {};
      };

      EventBus.prototype = {
        // Add new event listener.
        // Event type is case insensitive.
        addEventListener: function(type, listener) {
          var name = formatEventName(type);
          var events = this.$events;
          var listeners = events[name] = events[name] || [];
          listeners.push(listener);
        },

        // Remove event listener.
        // Event type is case insensitive.
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

        // Dispatch new event.
        // Event type is case insensitive.
        // Last parameter will be set to the event details attribute.
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
            } catch (e) {
              // Do not fail everything if one listener fail...
            }
          }
        },

        // Clear events
        clear: function() {
          this.$events = {};
        }
      };

      return EventBus;

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

        // Remove last task
        this.$asyncTask = null;
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
        notify: function(changes) {
          if (!_.isArray(changes)) {
            changes = [changes];
          }

          // Append new change
          this.$$changes = this.$$changes || [];
          this.$$changes.push.apply(this.$$changes, changes);

          if (this.$asyncTask) {
            clearTimeout(this.$asyncTask);
          }

          // Trigger asynchronous task
          this.$asyncTask = setTimeout(_.bind(asyncFn, this));

          return this;
        },

        // Get pending changes
        pendingChanges: function() {
          return this.$$changes || [];
        },

        // Clear pending changes
        clearChanges: function() {
          if (this.$$changes) {
            clearTimeout(this.$asyncTask);
            this.$$changes.splice(0, this.$$changes.length);
            this.$asyncTask = null;
          }

          return this;
        }
      };

      return o;
    })();

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

    var $comparators = (function() {

      // Convert an object to a string.
      var toString = function(o) {
        return o == null ? '' : String(o.toString());
      };

      // Convert an object to a number.
      // NaN is automatically converted to zero.
      var toNumber = function(o) {
        return o == null ? 0 : (Number(o) || 0);
      };

      // Convert an object to a boolean integer.
      // A boolean integer is zero for a falsy value, one for a truthy value.
      // String "false" will be converted to a falsy boolean.
      var toBoolean = function(o) {
        return o === 'false' ? 0 : (Boolean(o) ? 1 : 0);
      };

      // Convert an object to a timestamp.
      var toDate = function(o) {
        var d = _.isDate(o) ? o : new Date(toNumber(o));
        return d.getTime();
      };

      // Create a comparison function by using substract operator.
      // First argument is a factory to transform arguments to a mathemical value.
      var toSubstraction = function(factory) {
        return function(a, b) {
          return factory(a) - factory(b);
        };
      };

      var instance = {
        // Compare two strings
        $string: function(a, b) {
          return toString(a).localeCompare(toString(b));
        },

        // Compare two numbers
        $number: toSubstraction(toNumber),

        // Compare two booleans
        $boolean: toSubstraction(toBoolean),

        // Compare two dates
        // Function accept timestamps as arguments
        $date: toSubstraction(toDate),

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
            return instance['$' + value.toLowerCase()](a, b);
          }

          // Just do a simple comparison... (strict equality is already checked)
          return a < b ? -1 : 1;
        },

        // Get comparator by its name
        // Can be overridden by custom lookup
        $get: function(name) {
          return instance[name];
        }
      };

      return instance;
    })();

    var $filters = (function() {
      var toString = function(val) {
        return val == null ? '' : val.toString();
      };

      var $match = function(value, predicate, matcher) {
        var str1 = toString(value);
        var str2 = toString(predicate);
        return matcher(str1, str2);
      };

      // Case-insensitive matching
      var $ciMatching = function(o1, o2) {
        return o1.toLowerCase().indexOf(o2.toLowerCase()) >= 0;
      };

      var $contains = function(value, predicate) {
        return $match(value, predicate, $ciMatching);
      };

      var createPredicateFromValue = function(predicateValue) {
        var newPredicate = function(value) {
          return _.some(_.keys(value), function(prop) {
            var propValue = value[prop];
            return _.isObject(propValue) ?
              newPredicate(propValue) :
              $contains(value[prop], predicateValue);
          });
        };

        return newPredicate;
      };

      var createPredicateFromObject = function(predicateObject) {
        var predicates = _.map(_.keys(predicateObject), function(prop) {
          return function(value) {
            return $contains($parse(prop)(value), predicateObject[prop]);
          };
        });

        return function(value) {
          return _.every(predicates, function(predicate) {
            return predicate(value);
          });
        };
      };

      // Create filter function from a custom predicate
      return {
        $create: function(predicate) {
          if (_.isFunction(predicate)) {
            // If it is already a function, return it.
            return predicate;
          }

          // Get appropriate factory
          var predicateFactory = _.isObject(predicate) ?
            createPredicateFromObject :
            createPredicateFromValue;

          // Create predicate function using factory
          var predicateFn = predicateFactory(predicate);

          // Store original predicate value
          predicateFn.$predicate = predicate;

          return predicateFn;
        }
      };
    })();

    var Collection = (function() {

      var ArrayProto = Array.prototype;
      var keepNativeArray = (function() {
        try {
          var obj = {};
          obj[0] = 1;
          return !!ArrayProto.toString.call(obj);
        } catch (error) {
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

      // Save bytes
      var createSplice = Change.createSplice;
      var createUpdate = Change.createUpdate;

      // Unset data at given index.
      var unsetAt = function(collection, idx) {
        delete collection[idx]
        ;
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

      var throwError = function(message) {
        throw Error(message);
      };

      // Convert parameter to a model instance.
      var parseModel = function(collection, o) {
        if (!_.isObject(o)) {
          // Only object are allowed inside collection
          throwError('Waffle collections are not array, only object are allowed');
        }

        var result;

        if (o instanceof collection.$$model) {
          // It is already an instance of model object !
          result = o;
        } else {
          // Create new model instance and return it.
          result = new collection.$$model(o);
        }

        // Try to get model identitifer
        var id = collection.$$key(result);
        if (id == null) {
          throwError('Collection elements must have an id, you probably missed to specify the id key on initialization ?');
        }

        return result;
      };

      // Iteratee to use to transform object to models
      // Should be used with _.map iteration
      var parseModelIteratee = function(o) {
        return parseModel(this, o);
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

        return o;
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

        var changes = [];
        var change;

        var j = sizeCollection - 1;
        var k = sizeArray - 1;
        for (var i = newSize - 1; i >= 0; --i) {
          if (j < 0 || sortFn(collection[j], array[k]) < 0) {
            var addedElement = put(collection, array[k--], i);

            // New change occurs
            change = _.first(changes);
            if (!change || change.index !== (i + 1)) {
              change = createSplice([], [addedElement], i, collection);
              changes.unshift(change);
            } else {
              change.index = i;
              change.addedCount++;
              change.added.unshift(addedElement);
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

      var isSorted = function(collection, model, idx) {
        var length = collection.length;
        var sortFn = collection.$$sortFn;

        var previous = idx > 0 ? collection[idx - 1] : null;
        if (previous != null && sortFn(previous, model) > 0) {
          return false;
        }

        var next = idx < length ? collection[idx + 1] : null;
        if (next != null && sortFn(model, next) > 0) {
          return false;
        }

        return true;
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

        // Get current context of given data.
        ctx: function(o) {
          var key = _.isObject(o) ? this.$$key(o) : o;
          return this.$$map.contains(key) ? this.$$map.get(key) : null;
        },

        // Get index of data in collection.
        // This function use internal id to check index faster.
        // This function accept data or data identifier as argument.
        indexOf: function(o) {
          var ctx = this.ctx(o);
          return ctx ? ctx.idx : -1;
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

        // Replace data in collection.
        // Data with same id will be replaced by data in parameter.
        replace: function(data) {
          var model = parseModel(this, data);
          var idx = this.indexOf(model);

          // If data does not exist, then it should fail as soon as possible.
          if (idx < 0) {
            throwError('Data to replace is not in collection !');
          }

          // If collection is sorted, data may have to be put at
          // a different index.
          var length = this.length;
          var sortFn = this.$$sortFn;

          if (sortFn && length > 1 && !isSorted(this, model, idx)) {
            this.remove(model);
            this.push(model);
          } else {
            this[idx] = model;
            this.notifyUpdate(idx);
          }

          return this;
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
        // If first argument is:
        // - A number, then this is a shortcut for splice(start, deleteCount).
        // - An array, then all items in array are removed.
        // - An object, then this item is removed.
        // - Otherwise, this should be a predicate. This predicate will be called for
        //   each element, and must return a truthy value to remove that element.
        remove: function(start, deleteCount) {
          // If first argument is a number, then this is a shortcut for splice method.
          if (_.isNumber(start)) {
            return this.splice.call(this, start, deleteCount || this.length);
          }

          // If it is an array, then remove everything in array.
          if (_.isArray(start)) {
            var $key = this.$$key;
            var map = _.indexBy(start, function(o) {
              return $key(o);
            });

            return this.remove(function(current) {
              return !!map[$key(current)];
            });
          }

          // If it is an object, then remove single item.
          if (_.isObject(start) && !_.isFunction(start)) {
            var model = parseModel(this, start);
            var index = this.indexOf(model);
            return index >= 0 ? this.remove(index, 1) : [];
          }

          var predicate = start;
          var ctx = deleteCount;
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
                changes.push(createSplice([o], [], i, this));
              }

              removed.push(o);
              lastChangeIdx = i;
            } else {
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
            this.notify(changes);
          }

          return removed;
        },

        // Force an update change.
        // This will force a row update.
        notifyUpdate: function(idx) {
          return this.notify([createUpdate(idx, this)]);
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
            this.notify(createSplice(array, [], 0, this));
          }

          return this;
        },

        // Reset entire collection with new data array
        reset: function(array) {
          var oldSize = this.length;
          var newSize = array.length;

          // Transform models before anything else
          var models = _.map(array, parseModelIteratee, this);

          var sortFn = this.$$sortFn;
          if (sortFn) {
            models.sort(sortFn);
          }

          this.$$map.clear();

          var removed = [];

          for (var i = 0; i < newSize; ++i) {
            if (i < oldSize) {
              removed.push(this.at(i));
            }

            put(this, models[i], i);
          }

          for (; i < oldSize; ++i) {
            removed.push(this.at(i));
            unsetAt(this, i);
          }

          this.length = newSize;

          this.notify([
            createSplice(removed, models, 0, this)
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

          // Data to model transformation.
          // This iteration will also check for undefined / null values.
          var models = _.map(data, parseModelIteratee, this);

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
            } else {
              // Shift and put elements at given indexes
              shiftRight(this, actualStart, addedCount);

              for (var k = 0; k < addedCount; ++k) {
                put(this, added[k], actualStart + k);
              }

              changes = [createSplice(removed, added, actualStart, this)];
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
              changes.unshift(createSplice(removed, [], actualStart, this));
            }
          }

          // Trigger splice changes
          if (changes.length > 0) {
            this.notify(changes);
          }

          // Replace existing data and trigger changes
          if (existingCount > 0) {
            if (sortFn) {
              existing.sort(sortFn);
            }

            for (var x = 0; x < existingCount; ++x) {
              this.replace(existing[x]);
            }
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
            changesStart.push(createUpdate(i, this));
            changesEnd.unshift(createUpdate(j, this));
          }

          // Trigger changes in order
          var changes = changesStart.concat(changesEnd);
          if (changes.length) {
            this.notify(changes);
          }

          return this;
        },

        // Split collection into smaller arrays
        // Returned value is an array of smaller arrays.
        split: function(size) {
          return $util.split(this, size);
        },

        // Custom json representation
        // Need JSON.stringify to be available
        toJSON: function() {
          return $json.toJson(this.toArray());
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
      var underscoreMethods = [
        'size',
        'first',
        'last',
        'initial',
        'rest',
        'partition',
        'forEach',
        'map',
        'every',
        'some',
        'reduce',
        'reduceRight',
        'filter',
        'reject',
        'find',
        'toArray'
      ];

      _.forEach(underscoreMethods, function(fn) {
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

    var Column = (function() {

      var DEFAULT_EDITABLE = {
        enable: true,
        type: 'text',
        css: null
      };

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
      var resultWith = $util.resultWith;
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

        // On initialization, column is not sorted
        // Use grid 'sortBy' option instead.
        this.asc = null;

        // Editable column
        var editable = column.editable === true ? {} : column.editable;
        if (editable) {
          editable = _.defaults(editable, DEFAULT_EDITABLE);
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
        cssClasses: function(idx, header, data) {
          var args = data ? [data] : [];
          var css = resultWith(this.css, this, args);
          if (_.isArray(css)) {
            css = css.join(' ');
          }

          var classes = [css];

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
          if (header) {
            if (this.sortable) {
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

        // Check if column or given data is editable
        isEditable: function(data) {
          // It may be always false
          if (!this.editable || !this.editable.enable) {
            return false;
          }

          // May be call without argument
          if (!data) {
            return true;
          }

          // If call with an argument, this will be used to check if data
          // is editable or not.
          return resultWith(this.editable.enable, this, [data]);
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

    var GridUtil = (function() {

      var findRow = function(rows, index, def, stopOn) {
        var max = rows.length - 1;
        if (max < 0 || index < 0 || index <= def) {
          return def;
        }

        var currentIndex = Math.min(index, max);
        var dataIndex = index;

        while (currentIndex >= 0 && dataIndex >= index) {
          dataIndex = instance.getDataIndex(rows[currentIndex]);
          if (stopOn(dataIndex, index)) {
            return currentIndex;
          }

          currentIndex--;
        }

        return def;
      };

      var instance = {
        getDataIndex: function(row) {
          return Number(row.getAttribute(DATA_WAFFLE_IDX));
        },

        getRowIndexForDataIndex: function(rows, index) {
          return findRow(rows, index, -1, function(dataIndex, index) {
            return dataIndex === index;
          });
        },

        getPreviousRowIndexForDataIndex: function(rows, index) {
          return findRow(rows, index - 1, -1, function(dataIndex, index) {
            return dataIndex <= index;
          });
        },

        getCheckbox: function(row) {
          return row.childNodes[0].childNodes[0];
        }
      };

      return instance;

    })();

    var GridDomHandlers = (function() {

      var THEAD = 'THEAD';
      var TFOOT = 'TFOOT';
      var TBODY = 'TBODY';
      var TH = 'TH';
      var TR = 'TR';
      var INPUT = 'INPUT';
      var SELECT = 'SELECT';

      var isInputCheckbox = function(node) {
        return node.tagName === INPUT && node.getAttribute('type') === 'checkbox';
      };

      var isEditableControl = function(node) {
        var tagName = node.tagName;
        var isControl = tagName === INPUT || tagName === SELECT;
        return isControl && node.getAttribute(DATA_WAFFLE_ID) != null;
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

      var inputValue = {
        checkbox: 'checked'
      };

      var onClickTitle = function(e, tagName) {
        var target = e.target;
        var th = $doc.findParent(e.target, TH);

        // If target is thead it means click was pressed in a th and released in another
        if (target.tagName === tagName) {
          return;
        }

        if (this.isSelectable() && isInputCheckbox(target)) {
          // Checkbox

          if (target.checked) {
            this.select();
          } else {
            this.deselect();
          }

        } else if (th && th.getAttribute(DATA_WAFFLE_SORTABLE)) {
          // Column header

          var id = th.getAttribute(DATA_WAFFLE_ID);
          var currentOrder = th.getAttribute(DATA_WAFFLE_ORDER) || CHAR_ORDER_DESC;
          var newOrder = currentOrder === CHAR_ORDER_ASC ? CHAR_ORDER_DESC : CHAR_ORDER_ASC;
          var newPredicate = newOrder + id;

          var newSortBy;

          if (e.shiftKey) {
            var oldPredicate = currentOrder + id;
            newSortBy = _.reject(this.$comparators, function(comparator) {
              return comparator.predicate() === oldPredicate;
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

          var target = e.target;

          // If target is tbody it means click was pressed in a tr and released in another.
          // If target is an editable control added by waffle, then we should not update selection, since
          // this is not a real row click event.
          if (target.tagName === TBODY || isEditableControl(target)) {
            return;
          }

          var tr = $doc.findParent(target, TR);
          var idx = tr.getAttribute(DATA_WAFFLE_IDX);
          var $data = this.$data;
          var data = $data.at(idx);

          // If data is not selectable, ignore event
          if (!this.isSelectable(data)) {
            return;
          }

          var selection = this.$selection;

          if (this.options.selection.multi) {
            if (e.shiftKey) {
              var idxF = parseFloat(idx);
              var selectAnchorF = parseFloat(this.$$selectAnchor);
              var lowerBound = Math.min(idxF, selectAnchorF);
              var upperBound = Math.max(idxF, selectAnchorF);

              var toAdd = [];
              for (var i = lowerBound; i <= upperBound; ++i) {
                var current = $data.at(i);
                if (!selection.contains(current) && this.isSelectable(current)) {
                  toAdd.push(current);
                }
              }

              if (toAdd.length > 0) {
                selection.push.apply(selection, toAdd);
              }
            } else {
              selection.toggle(data);
              this.$$selectAnchor = idx;
            }
          } else {
            var dataIdx = selection.indexOf(data);

            if (dataIdx >= 0) {
              selection.remove(dataIdx, 1);
            } else {
              selection.reset([data]);
            }
          }
        },

        // Update grid data when editable column has been updated
        onInputTbody: function(e) {
          var target = e.target;
          var columnId = target.getAttribute(DATA_WAFFLE_ID);
          var column = columnId ? this.$columns.byKey(columnId) : null;

          if (column && column.isEditable()) {
            var tr = $doc.findParent(target, 'TR');
            if (tr) {
              var type = column.editable.type;
              var formatter = dataFormatters[type] || _.identity;
              var inputProp = inputValue[type] || 'value';

              var idx = Number(tr.getAttribute(DATA_WAFFLE_IDX));
              var data = this.$data;
              var object = data.at(idx);

              var oldValue = column.value(object);
              var newValue = formatter(target[inputProp]);

              if (oldValue !== newValue) {
                column.value(object, newValue);

                // Dispatch events
                this.dispatchEvent('datachanged', {
                  index: idx,
                  object: object,
                  field: columnId,
                  oldValue: oldValue,
                  newValue: newValue
                });

                // Another field may have been updated, so
                // we should force an update to refresh the entire row.
                // Replacing data may change the index if collection
                // is sorted.
                data.replace(object);
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
        var el = grid['$' + target];
        if (el && !grid.$$events[handlerName]) {
          grid.$$events[handlerName] = _.bind(GridDomHandlers[handlerName], grid);
          el.on(events, grid.$$events[handlerName]);
        }
      };

      var unbind = function(grid, target, events, handlerName) {
        var el = grid['$' + target];
        if (el && grid.$$events[handlerName]) {
          el.off(events, grid.$$events[handlerName]);
          grid.$$events[handlerName] = null;
        }
      };

      var inputEvents = function() {
        var mainEvent = $sniffer.hasEvent('input') ? 'input' : 'keyup';
        return mainEvent += ' change';
      };

      // Save bytes
      var CLICK = 'click';

      // Create binder/unbinder for events.
      var createDomBinding = function(o, name, fn) {
        o['bind' + name] = function(grid) {
          fn(grid, bind);
        };

        o['unbind' + name] = function(grid) {
          fn(grid, unbind);
        };
      };

      var instance = {
        bindResize: function(grid) {
          if (!grid.$$events.onResize) {
            var resizeFn = _.bind(grid.resize, grid);
            grid.$$events.onResize = _.debounce(resizeFn, 100);
            grid.$window = $(window);
            grid.$window.on('resize', grid.$$events.onResize);
          }
        },

        unbindResize: function(grid) {
          if (grid.$$events.onResize) {
            grid.$window.off('resize', grid.$$events.onResize);
            grid.$window = null;
          }
        }
      };

      // Create bind/unbind functions for edition events.
      createDomBinding(instance, 'Edition', function(grid, factory) {
        factory(grid, TBODY, inputEvents(), 'onInputTbody');
      });

      // Create bind/unbind functions for selection events.
      createDomBinding(instance, 'Selection', function(grid, factory) {
        factory(grid, THEAD, CLICK, 'onClickThead');
        factory(grid, TFOOT, CLICK, 'onClickTfoot');
        factory(grid, TBODY, CLICK, 'onClickTbody');
      });

      // Create bind/unbind functions for sort events.
      createDomBinding(instance, 'Sort', function(grid, factory) {
        factory(grid, THEAD, CLICK, 'onClickThead');
        factory(grid, TFOOT, CLICK, 'onClickTfoot');
      });

      // Create bind/unbind functions for drag&drop events.
      createDomBinding(instance, 'DragDrop', function(grid, factory) {
        factory(grid, TABLE, 'dragstart', 'onDragStart');
        factory(grid, TABLE, 'dragover', 'onDragOver');
        factory(grid, TABLE, 'dragend', 'onDragEnd');
        factory(grid, TABLE, 'dragleave', 'onDragLeave');
        factory(grid, TABLE, 'dragenter', 'onDragEnter');
        factory(grid, TABLE, 'drop', 'onDragDrop');

        // IE <= 9 need this workaround to handle drag&drop
        if ($util.msie() <= 9) {
          factory(grid, TABLE, 'selectstart', 'onSelectStart');
        }
      });

      return instance;

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

      var createCheckboxCell = function(grid, thead) {
        var selectionLength = grid.$selection.size();

        var span = $doc.span({
          title: selectionLength
        }, '' + selectionLength);

        var isSelected = grid.isSelected();
        var input = $doc.inputCheckbox({
          checked: isSelected,
          indeterminate: !isSelected && selectionLength > 0
        });

        var children = thead ? [span, input] : [input, span];
        var attributes = {
          className: CSS_CHECKBOX_CELL
        };

        return $doc.th(attributes, children);
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
          var children = [];

          if (grid.hasCheckbox()) {
            children.push(o.theadCheckboxCell(grid));
          }

          grid.$columns.forEach(function(column, idx) {
            children.push(o.theadCell(grid, column, idx));
          });

          return $doc.tr(null, children);
        },

        // Create cell for grid thead node.
        theadCell: function(grid, column, idx) {
          var attributes = column.attributes(idx, true);
          attributes.className = column.cssClasses(idx, true);
          attributes.style = column.styles(idx, true);
          return $doc.th(attributes, column.title);
        },

        // Create cell for grid thead node.
        theadCheckboxCell: function(grid) {
          return createCheckboxCell(grid, true);
        },

        // Create row to append to thead node.
        tfootRow: function(grid) {
          var children = [];

          if (grid.hasCheckbox()) {
            children.push(o.tfootCheckboxCell(grid));
          }

          grid.$columns.forEach(function(column, idx) {
            children.push(o.tfootCell(grid, column, idx));
          });

          return $doc.tr(null, children);
        },

        // For now, tfoot cell is the same as the thead cell
        tfootCell: function(grid, column, idx) {
          return o.theadCell(grid, column, idx);
        },

        // Create cell for grid thead node.
        tfootCheckboxCell: function(grid) {
          return createCheckboxCell(grid, false);
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
          var attributes = {};
          attributes[DATA_WAFFLE_IDX] = idx;
          attributes[DATA_WAFFLE_ID] = grid.$data.$$key(data);
          attributes[DATA_WAFFLE_CID] = _.uniqueId();

          var children = [];
          var className = '';

          if (grid.isSelectable()) {
            // Add css to show that row is selectable
            if (grid.isSelectable(data)) {
              className += CSS_SELECTABLE;
            }

            // Data may be selected programmatically, but not selectable
            if (grid.$selection.contains(data)) {
              className += ' ' + CSS_SELECTED;
            }

            // Append cell if grid is defined with checkbox
            if (grid.hasCheckbox()) {
              children.push(o.tbodyCheckboxCell(grid, data));
            }
          }

          if (className) {
            attributes.className = className;
          }

          grid.$columns.forEach(function(column, idx) {
            children.push(o.tbodyCell(grid, data, column, idx));
          });

          return $doc.tr(attributes, children);
        },

        // Create a cell for grid tbody node
        tbodyCell: function(grid, data, column, idx) {
          var attributes = column.attributes(idx, false);
          attributes.className = column.cssClasses(idx, false, data);
          attributes.style = column.styles(idx, false);

          var children = column.isEditable(data) ?
            o.tbodyControl(column, data) : column.render(data);

          return $doc.td(attributes, children);
        },

        // Create a cell for grid tbody node
        tbodyCheckboxCell: function(grid, data) {
          var attributes = {
            className: CSS_CHECKBOX_CELL
          };

          var children = grid.isSelectable(data) ?
            $doc.inputCheckbox({
              checked: grid.isSelected(data)
            }) : null;

          return $doc.td(attributes, children);
        },

        // Create control for editable cell
        tbodyControl: function(column, data) {
          var editable = column.editable;

          var control;
          var children = null;
          var attributes = {};

          if (editable.type === 'select') {
            control = 'select';

            // Append custom options
            if (editable.options) {
              children = _.map(editable.options, function(option) {
                var attributes = option.value != null ?
                  {
                    value: option.value
                  } : null;

                var text = option.label != null ? option.label : '';
                return $doc.option(attributes, text);
              });
            }
          } else {
            control = 'input';
            attributes.type = editable.type;
          }

          // Add column id to control to simplify parsing
          attributes[DATA_WAFFLE_ID] = column.id;

          // For checkbox inputs, we must set the 'checked' property...
          var prop = editable.type === 'checkbox' ? 'checked' : 'value';
          var formatter = formatters[editable.type] || _.identity;
          attributes[prop] = formatter(column.value(data));

          // Append custom css
          if (editable.css) {
            attributes.className = editable.css;
          }

          return $doc[control](attributes, children);
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
                columns.notifyUpdate(index);
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

    var GridDataObserver = (function() {
      var readDataIndex = GridUtil.getDataIndex;
      var findPreviousIndex = GridUtil.getPreviousRowIndexForDataIndex;
      var findIndex = GridUtil.getRowIndexForDataIndex;

      var instance = {
        // Apply data changes to grid.
        on: function(changes) {
          _.forEach(changes, function(change) {
            var fnName = 'on' + $util.capitalize(change.type);
            instance[fnName].call(this, change);
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
          var addedData = change.added;
          var removedData = change.removed;
          var startIndex = findPreviousIndex(childNodes, index) + 1;

          var removedCount = removedData.length;
          if (removedCount > 0) {
            var wasCleared = index === 0 && (collection.length - addedCount) === 0;
            if (wasCleared) {
              removedNodes = _.toArray(childNodes);
              $tbody.empty();
            } else {
              removedNodes = [];

              var removedRow = childNodes[startIndex];

              for (var k = 0; k < removedCount && removedRow; ++k) {
                // Remove if and only if row index match
                var currentRemovedIndex = index + k;
                var currentRowIndex = readDataIndex(removedRow);
                if (currentRowIndex === currentRemovedIndex) {
                  removedNodes.push(tbody.removeChild(removedRow));
                  removedRow = childNodes[startIndex];
                }
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

            var fragment = $doc.createFragment();
            var predicate = this.$filter || _.constant(true);

            for (var i = 0; i < addedCount; ++i) {
              var rowIdx = i + index;
              var data = addedData[i];
              var ctx = collection.ctx(data);

              // Update flag
              ctx.visible = predicate(data);

              // Append if and only if data must be visible
              if (ctx.visible) {
                var tr = GridBuilder.tbodyRow(this, data, rowIdx);
                addedNodes.push(tr);
                fragment.appendChild(tr);
              }
            }

            if (addedNodes.length > 0) {
              if (startIndex > 0) {
                // Add after existing node
                $(childNodes[startIndex - 1]).after(fragment);
              } else {
                // Add at the beginning
                $tbody.prepend(fragment);
              }
            }
          }

          if (removedNodes || addedNodes) {
            // We need to update row index
            var diff = addedCount - removedCount;
            var start = index + _.size(addedNodes);

            for (var length = childNodes.length; start < length; ++start) {
              var childNode = childNodes[start];
              var oldIdx = readDataIndex(childNode);
              childNode.setAttribute(DATA_WAFFLE_IDX, oldIdx + diff);
            }

            // Trigger events
            this.dispatchEvent('dataspliced', {
              added: addedData || [],
              addedNodes: addedNodes || [],
              removedNodes: removedNodes || [],
              removed: removedData,
              index: index,
              nodeIndex: startIndex
            });
          }

          return this;
        },

        // Update grid on update change
        onUpdate: function(change) {
          var index = change.index;
          var data = this.$data.at(index);

          // Create new node representation and merge diff with old node
          var tbody = this.$tbody[0];
          var childNodes = tbody.childNodes;
          var nodeIndex = findIndex(childNodes, index);
          if (nodeIndex >= 0) {
            var node = childNodes[nodeIndex];
            var tmpNode = GridBuilder.tbodyRow(this, data, index);
            var cid = node.getAttribute(DATA_WAFFLE_CID);

            // Merge new row into old row (this will update content).
            $vdom.mergeNodes(tbody, node, tmpNode);

            // Do not forget to reset cid, since it may have been updated (important
            // since it may be used by angular module to get associated scope).
            node.setAttribute(DATA_WAFFLE_CID, cid);

            // Trigger event
            this.dispatchEvent('dataupdated', {
              index: index,
              nodeIndex: nodeIndex,
              node: node
            });
          }

          return this;
        }
      };

      return instance;
    })();

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

      var instance = {
        // Apply columns changes to grid.
        on: function(changes) {
          _.forEach(changes, function(change) {
            var fnName = 'on' + $util.capitalize(change.type);
            instance[fnName].call(this, change);
          }, this);

          return this;
        },

        // Update columns on splice change.
        onSplice: function(change) {
          var tbody = this.$tbody[0];
          var thead = this.hasHeader() ? this.$thead[0] : null;
          var tfoot = this.hasFooter() ? this.$tfoot[0] : null;

          var hasCheckbox = this.hasCheckbox();
          var index = change.index;
          var added = change.added;
          var addedCount = change.addedCount;
          var removedData = change.removed;

          var theadRemovedNodes = [];
          var tbodyRemovedNodes = [];
          var tfootRemovedNodes = [];

          var $data = this.$data;
          var $columns = this.$columns;

          var i;
          var k;
          var idx;
          var tr;
          var dataSize;

          var removedCount = removedData.length;

          var hasDiff = removedCount > 0 || addedCount > 0;
          if (hasDiff && this.isResizable()) {
            // Columns have been added or removed, a new resize should be applied
            this.resize();
          }

          if (removedCount > 0) {
            tbodyRemovedNodes.push.apply(tbodyRemovedNodes, removeColumns(tbody, removedData));

            if (thead) {
              theadRemovedNodes.push.apply(theadRemovedNodes, removeColumns(thead, removedData));
            }

            if (tfoot) {
              tfootRemovedNodes.push.apply(tfootRemovedNodes, removeColumns(tfoot, removedData));
            }
          }

          var theadAddedNodes = [];
          var tbodyAddedNodes = [];
          var tfootAddedNodes = [];

          // Insert new columns
          if (addedCount > 0) {
            // Update header & footer
            for (i = 0; i < addedCount; ++i) {
              idx = index + i;

              var column = added[i];

              // Update column flags
              updateColumn(this, column);

              if (thead) {
                var th1 = GridBuilder.theadCell(this, column, idx);
                tr = thead.childNodes[0];
                theadAddedNodes.push(insertBefore(tr, th1, hasCheckbox ? idx + 1 : idx));
              }

              if (tfoot) {
                var th2 = GridBuilder.tfootCell(this, column, idx);
                tr = tfoot.childNodes[0];
                tfootAddedNodes.push(insertBefore(tr, th2, hasCheckbox ? idx + 1 : idx));
              }
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

                var currentColumn = added[i];
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
              [] // Store new nodes
            ];

            var el = this['$' + tagName];

            if (el) {
              var childNodes = el[0].childNodes;
              var factory = cellFactory.call(this, tagName, column, nodeIndex);
              var fn = function(acc, tr, index) {
                var result = factory.call(this, tr, index);
                acc[0].push(result.oldNode);
                acc[1].push(result.newNode);
                return acc;
              };

              acc = _.reduce(childNodes, fn, acc, this);
            }

            return acc;
          };

          // Iterate for each section
          var results = _.map([THEAD, TFOOT, TBODY], iteratee, this);

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

      return instance;
    })();

    var GridSelectionObserver = (function() {
      var findIndex = GridUtil.getRowIndexForDataIndex;
      var findCheckBox = GridUtil.getCheckbox;
      var updateCheckbox = function(checkbox, checked) {
        checkbox.checked = checked;
      };

      var instance = {
        // Apply data changes to grid.
        on: function(changes) {
          _.forEach(changes, function(change) {
            var fnName = 'on' + $util.capitalize(change.type);
            var fn = instance[fnName];
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

          var idx;
          var row;
          var rowIndex;
          var checkbox;

          var tbody = $tbody[0];
          var childNodes = tbody.childNodes;
          var added = change.added;
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
                rowIndex = findIndex(childNodes, idx);
                row = childNodes[rowIndex];

                if (row) {
                  $(row).removeClass(CSS_SELECTED);

                  if (this.hasCheckbox()) {
                    checkbox = findCheckBox(row);
                    if (checkbox) {
                      updateCheckbox(checkbox, false);
                    }
                  }
                }
              }
            }
          }

          // Selection
          if (addedCount > 0) {
            for (var i = 0; i < addedCount; ++i) {
              idx = $data.indexOf(added[i]);
              rowIndex = findIndex(childNodes, idx);
              row = childNodes[rowIndex];

              if (row) {
                $(row).addClass(CSS_SELECTED);

                if (this.hasCheckbox()) {
                  checkbox = findCheckBox(row);
                  if (checkbox) {
                    updateCheckbox(checkbox, true);
                  }
                }
              }
            }
          }

          if (addedCount > 0 || removedCount > 0) {
            // If no difference with the selection size, no need to manipulate the dom here
            var diff = addedCount - removedCount;
            if (diff && this.hasCheckbox()) {
              var selectionLength = $selection.length;
              var isSelected = this.isSelected();
              var isIndeterminate = selectionLength > 0 && $data.length !== selectionLength;

              var thead = this.hasHeader() ? this.$thead[0] : null;
              var tfoot = this.hasFooter() ? this.$tfoot[0] : null;

              if (thead) {
                var theadCell = thead.childNodes[0].childNodes[0];
                var theadSpan = theadCell.childNodes[0];
                var theadCheckbox = theadCell.childNodes[1];

                theadSpan.innerHTML = theadSpan.title = selectionLength;
                theadCheckbox.checked = isSelected;
                theadCheckbox.indeterminate = isIndeterminate;
              }

              if (tfoot) {
                var tfootCell = tfoot.childNodes[0].childNodes[0];
                var tfootSpan = tfootCell.childNodes[1];
                var tfootCheckbox = tfootCell.childNodes[0];

                tfootSpan.innerHTML = tfootSpan.title = selectionLength;
                tfootCheckbox.checked = isSelected;
                tfootCheckbox.indeterminate = isIndeterminate;
              }
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

      return instance;
    })();

    var GridFilter = (function() {

      var o = {
        applyFilter: function(predicate) {
          // Create a function that return always true if first
          // argument is not defined.
          var filterFunction = predicate == null ? _.constant(true) : predicate;

          var filterIteratee = function(accumulator, current, idx) {
            var tbody = this.$tbody[0];
            var rows = tbody.childNodes;
            var ctx = this.$data.ctx(current);
            var wasVisible = _.isUndefined(ctx.visible) ? true : !!ctx.visible;
            var isVisible = !!filterFunction(current);

            var inc = 0;
            var removedRow = null;

            // Update flag
            ctx.visible = isVisible;

            if (wasVisible !== isVisible) {
              var currentRow = rows[ctx.idx - accumulator.nbFiltered];
              if (isVisible) {
                var tr = GridBuilder.tbodyRow(this, current, idx);
                tbody.insertBefore(tr, currentRow);
              } else {
                removedRow = tbody.removeChild(currentRow);
                inc++;
              }
            } else if (!isVisible) {
              inc++;
            }

            accumulator.nbFiltered += inc;

            if (removedRow) {
              accumulator.removed.push(removedRow);
            }

            return accumulator;
          };

          var accumulator = {
            nbFiltered: 0,
            removed: []
          };

          var result = this.$data.reduce(filterIteratee, accumulator, this);

          // Trigger event !
          var nbFiltered = result.nbFiltered;
          var removedNodes = result.removed;

          this.dispatchEvent('filterupdated', {
            predicate: predicate,
            countVisible: this.$data.size() - nbFiltered,
            countFiltered: nbFiltered,
            removedNodes: removedNodes
          });
        }
      };

      return o;
    })();

    var BasicComparator = (function() {
      var throwError = function(fnName) {
        return function() {
          throw 'Function ' + fnName + ' must be implemented';
        };
      };

      var BasicComparator = function() {};

      BasicComparator.prototype = {
        compare: throwError('compare'),

        // Default equals function.
        equals: function(c) {
          return this.predicate() === c.predicate();
        },

        // Get predicate value.
        predicate: function() {
          return this.id;
        }
      };

      return BasicComparator;
    })();

    var FieldComparator = (function() {
      var FieldComparator = function(grid, predicate) {
        var flag = predicate.charAt(0);
        var id = flag === CHAR_ORDER_ASC || flag === CHAR_ORDER_DESC ? predicate.slice(1) : predicate;
        var column = grid.$columns.byKey(id);

        this.id = id;
        this.asc = flag !== CHAR_ORDER_DESC;

        var parser;
        var comparator;
        if (column) {
          parser = column.$parser;
          comparator = column.$comparator;
        }

        this.parser = parser || $parse(id);
        this.comparator = comparator || $comparators.$auto;
      };

      var proto = FieldComparator.prototype = new BasicComparator();

      // Compare object.
      proto.compare = function(o1, o2) {
        if (o1 === o2) {
          return 0;
        }

        var f1 = this.parser(o1);
        var f2 = this.parser(o2);
        var result = this.comparator(f1, f2);
        return this.asc ? result : result * -1;
      };

      // Get predicate representation.
      proto.predicate = function() {
        var prefix = this.asc ? CHAR_ORDER_ASC : CHAR_ORDER_DESC;
        return prefix + this.id;
      };

      // Check if both comparator are equals.
      proto.equals = function(comparator) {
        return this.id === comparator.id &&
          this.asc === comparator.asc &&
          this.comparator === comparator.comparator;
      };

      // Create comparator.
      FieldComparator.of = function(grid, sortBy) {
        return sortBy instanceof FieldComparator ? sortBy : new FieldComparator(grid, sortBy);
      };

      return FieldComparator;
    })();

    var SorterComparator = (function() {
      var SorterComparator = function(grid, predicate) {
        this.id = _.uniqueId();
        this.comparator = predicate;
      };

      var proto = SorterComparator.prototype = new BasicComparator();

      // Compare object.
      proto.compare = function(o1, o2) {
        return o1 === o2 ? 0 : this.comparator(o1, o2);
      };

      // Create comparator.
      SorterComparator.of = function(grid, sortBy) {
        return sortBy instanceof SorterComparator ? sortBy : new SorterComparator(grid, sortBy);
      };

      return SorterComparator;
    })();

    var SortByComparator = (function() {
      var SortByComparator = function(grid, predicate) {
        this.id = _.uniqueId();
        this.parser = predicate;
      };

      var proto = SortByComparator.prototype = new BasicComparator();

      // Compare object.
      proto.compare = function(o1, o2) {
        if (o1 === o2) {
          return 0;
        }

        var f1 = this.parser(o1);
        var f2 = this.parser(o2);
        return $comparators.$auto(f1, f2);
      };

      // Create comparator.
      SortByComparator.of = function(grid, sortBy) {
        return sortBy instanceof SortByComparator ? sortBy : new SortByComparator(grid, sortBy);
      };

      return SortByComparator;
    })();

    var GridComparator = (function() {
      var comparisonFunction = function(o1, o2) {
        if (o1 === o2 || (o1 == null && o2 == null)) {
          return 0;
        }

        var comparators = this.$comparators;

        for (var i = 0, size = comparators.length; i < size; ++i) {
          var current = comparators[i];
          var result = current.compare(o1, o2);

          // Return first result that is not zero
          if (result) {
            return result;
          }
        }

        // Each comparator return zero.
        // Provide a stable sort by using data index.
        var $data = this.$data;
        return $data.indexOf(o1) - $data.indexOf(o2);
      };

      var createComparator = function(grid, comparator) {
        if (comparator instanceof BasicComparator) {
          return comparator;
        }

        if (_.isString(comparator)) {
          return FieldComparator.of(grid, comparator);
        }

        if (_.isFunction(comparator)) {
          var nbArgs = comparator.length;
          return nbArgs <= 1 ?
            SortByComparator.of(grid, comparator) :
            SorterComparator.of(grid, comparator);
        }

        throw 'Cannot create comparator from object: ' + comparator;
      };

      return {
        // Create comparators.
        // Return value will always be an array.
        of: function(grid, comparators) {
          if (!_.isArray(comparators)) {
            comparators = [comparators];
          }

          return _.map(comparators, function(id) {
            var comparator = createComparator(grid, id);

            // Update column.
            // TODO find another way, it should not have side effect.
            var column = grid.$columns.byKey(comparator.id);
            if (column) {
              column.asc = comparator.asc;
            }

            return comparator;
          });
        },

        // Check if both comparators are equals.
        equals: function(comparators1, comparators2) {
          if (comparators1 === comparators2) {
            return true;
          }

          if (comparators1.length !== comparators2.length) {
            return false;
          }

          return _.every(comparators1, function(c, idx) {
            return c.equals(comparators2[idx]);
          });
        },

        // Create comparison function for given grid.
        createComparator: function(grid) {
          return _.bind(comparisonFunction, grid);
        }
      };
    })();

    var Grid = (function() {

      // Save bytes
      var resultWith = $util.resultWith;

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

      var Constructor = function(node, options) {
        if (!(this instanceof Constructor)) {
          return new Constructor(node, options);
        }

        // Grid may be attached to a dom node later.
        if (arguments.length === 0 || (!_.isElement(node) && !(node instanceof $))) {
          options = node;
          node = null;
        }

        // Initialize main table and default options
        var table = node ? $(node)[0] : null;
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
          if (_.isUndefined(opt) && table) {
            var attrName = $util.toSpinalCase(optName);
            var htmlAttr = table.getAttribute('data-waffle-' + attrName) ||
              table.getAttribute('waffle-' + attrName) ||
              table.getAttribute('data-' + attrName) ||
              table.getAttribute(attrName);

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

        var isSortable = this.isSortable();
        var isDraggable = this.isDraggable();

        if (opts.columns && (!isSortable || isDraggable)) {
          // Force column not to be sortable
          _.forEach(opts.columns, function(column) {
            if (!isSortable) {
              column.sortable = false;
            }

            // Force column to be draggable if flag is not set.
            if (isDraggable) {
              column.draggable = column.draggable == null ? true : !!column.draggable;
            }
          });
        }

        // Initialize data
        this.$data = new Collection(opts.data, {
          key: opts.key,
          model: opts.model
        });

        // Initialize columns
        this.$columns = new Collection(opts.columns, {
          key: 'id',
          model: Column
        });

        // Initialize selection.
        this.$selection = new Collection([], this.$data.options());

        // Initialize comparators.
        this.$comparators = new Collection([], {
          key: function(o) {
            return o.id;
          }
        });

        // Create event bus.
        this.$bus = new EventBus();

        // Wrap callbacks to events
        _.forEach(_.keys(opts.events), callbackWrapper, this);

        // Parse sortBy option.
        this.sortBy(options.sortBy, false);

        // Attach dom node if it was specified.
        if (table) {
          this.attach(table);
        }

        this.dispatchEvent('initialized');
      };

      // Create new grid
      Constructor.create = function(table, options) {
        return new Constructor(table, options);
      };

      Constructor.prototype = {
        // Attach table.
        // Note that once initialized, grid options should not be updated, so
        // updating attached table will not use html attributes.
        attach: function(table) {
          // First detach current dom node if it is already attached.
          if (this.$table) {
            this.detach();
          }

          var $table = this.$table = $(table);
          var isSortable = this.isSortable();
          var isDraggable = this.isDraggable();
          var isSelectable = this.isSelectable();
          var isEditable = this.isEditable();

          // Add appropriate css to table
          $table.addClass(this.cssClasses().join(' '));

          // Create main nodes
          var view = [TBODY];

          // Check if we should append table header
          if (this.hasHeader()) {
            view.unshift(THEAD);
          }

          // Check if we should append table footer
          if (this.hasFooter()) {
            view.push(TFOOT);
          }

          _.forEach(view, createNode, this);

          // Observe collection to update grid accordingly
          this.$data.observe(GridDataObserver.on, this);
          this.$columns.observe(GridColumnsObserver.on, this);
          this.$selection.observe(GridSelectionObserver.on, this);

          // Initialize events dictionary.
          this.$$events = {};

          // Bind dom handlers only if needed.
          if (isSortable) {
            GridDomBinders.bindSort(this);
          }

          if (isEditable) {
            GridDomBinders.bindEdition(this);
          }

          if (isSelectable) {
            GridDomBinders.bindSelection(this);
          }

          // If height is specified, we need to set column size.
          // Bind resize event to resize grid automatically when window view is resized
          if (this.isResizable()) {
            this.resize();
            GridDomBinders.bindResize(this);
          }

          this.render();
          this.clearChanges();

          if (isDraggable) {
            GridDomBinders.bindDragDrop(this);
          }

          this.dispatchEvent('attached');

          return this;
        },

        // Detach table:
        // - Unbind dom events.
        // - Remove observers.
        // - Dispatch detach event.
        detach: function() {
          var $table = this.$table;
          if ($table) {
            // Remove waffle classes.
            $table.removeClass(this.cssClasses().join(' '));

            // Unbind dom events.
            GridDomBinders.unbindSort(this);
            GridDomBinders.unbindEdition(this);
            GridDomBinders.unbindSelection(this);
            GridDomBinders.unbindResize(this);
            GridDomBinders.unbindDragDrop(this);

            // Unobserve collections (since observers are only used to update
            // dom nodes).
            this.clearChanges();
            this.$data.unobserve(GridDataObserver.on, this);
            this.$columns.unobserve(GridColumnsObserver.on, this);
            this.$selection.unobserve(GridSelectionObserver.on, this);

            // Dispatch event.
            this.dispatchEvent('detached');

            // Dereference dom nodes.
            this.$table = this.$tbody = this.$thead = this.$tfoot = null;
          }

          return this;
        },

        cssClasses: function() {
          var classes = [CSS_GRID];

          if (this.isSelectable()) {
            classes.push(CSS_SELECTABLE);
          }

          if (this.isScrollable()) {
            classes.push(CSS_SCROLLABLE);
          }

          return classes;
        },

        // Get all rows.
        // An array is returned (not a NodeList).
        rows: function() {
          return _.toArray(this.$tbody[0].childNodes);
        },

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
              return column.isEditable();
            });
        },

        // Check if grid is sortable
        isSortable: function() {
          return this.options.sortable;
        },

        // Check if grid is selectable
        isSelectable: function(data) {
          var selection = this.options.selection;

          // We are sure it is disable
          if (!selection || !selection.enable) {
            return false;
          }

          return data ? resultWith(selection.enable, this, [data]) : true;
        },

        // Check if grid is resizable
        isResizable: function() {
          var size = this.options.size;
          return !!size.height || !!size.width;
        },

        // Check if grid is scrollable.
        isScrollable: function() {
          return this.options.scrollable;
        },

        // Check if grid render checkbox as first column
        hasCheckbox: function() {
          return this.isSelectable() && this.options.selection.checkbox;
        },

        // Check if grid has a table header
        hasHeader: function() {
          return this.options.view.thead;
        },

        // Check if grid has a table footer
        hasFooter: function() {
          return this.options.view.tfoot;
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

          var selectionSize = this.$selection.length;
          if (selectionSize === 0) {
            return false;
          }

          var dataSize = this.$data.length;

          // If some data may not be selectable, then we should check size
          // against all selectable data.
          if (_.isFunction(this.options.selection.enable)) {
            dataSize = this.$data.filter(this.isSelectable, this).length;
          }

          return selectionSize >= dataSize;
        },

        // Check if grid columns should be draggable by default.
        isDraggable: function() {
          return !!this.options.dnd;
        },

        // Check if given is visible (not filtered).
        // If data is visible, then a row should exist.
        isVisible: function(current) {
          var ctx = this.$data.ctx(current);
          return ctx && ctx.visible !== false;
        },

        // Get only visible data.
        // An array will always be returned.
        visibleData: function() {
          var data = this.$data;
          var filter = this.$filter;
          return filter != null ? data.filter(this.isVisible, this) : data.toArray();
        },

        // Render entire grid
        render: function(async) {
          return this.renderHeader()
            .renderFooter()
            .renderBody(async)
            .clearChanges();
        },

        // Render entire header of grid
        renderHeader: function() {
          if (this.hasHeader()) {
            var tr = GridBuilder.theadRow(this);
            this.$thead.empty().append(tr);
          }
          return this;
        },

        // Render entire footer of grid
        renderFooter: function() {
          if (this.hasFooter()) {
            var tr = GridBuilder.tfootRow(this);
            this.$tfoot.empty().append(tr);
          }
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
          var oldNodes = this.rows();

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

            grid.dispatchEvent('rendered', {
              data: grid.data(),
              removedNodes: oldNodes,
              addedNodes: grid.rows()
            });

            // Free memory
            grid = empty = build = onEnded = oldNodes = null;
          };

          // If grid is filtered, then we must only render visible data.
          var dataToRender = this.$filter == null ? this.$data : this.visibleData();
          if (asyncRender) {
            $util.asyncTask($util.split(dataToRender, 200), 10, build, onEnded);
          } else {
            build(dataToRender, 0);
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
            this.$selection.add(this.$data.filter(this.isSelectable, this));
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
          var comparators = sortBy != null ? GridComparator.of(this, sortBy) : [];

          // Check if sort predicate has changed
          // Compare array instance, or serialized array to string and compare string values (faster than array comparison)
          if (GridComparator.equals(this.$comparators, comparators)) {
            return this;
          }

          this.$comparators.reset(comparators);
          this.$data.sort(GridComparator.createComparator(this));

          if (this.$table) {
            var hasHeader = this.hasHeader();
            var hasFooter = this.hasFooter();

            var $headers = hasHeader ? this.$thead.children().eq(0).children() : null;
            var $footers = hasFooter ? this.$tfoot.children().eq(0).children() : null;

            var clearSort = function($items) {
              $items.removeClass(CSS_SORTABLE_ASC + ' ' + CSS_SORTABLE_DESC)
                .removeAttr(DATA_WAFFLE_ORDER);
            };

            var addSort = function($items, index, asc) {
              var flag = asc ? CHAR_ORDER_ASC : CHAR_ORDER_DESC;
              $items.eq(index)
                .addClass(asc ? CSS_SORTABLE_ASC : CSS_SORTABLE_DESC)
                .attr(DATA_WAFFLE_ORDER, flag);
            };

            // Remove order flag

            if ($headers) {
              clearSort($headers);
            }

            if ($footers) {
              clearSort($footers);
            }

            var $columns = this.$columns;
            var hasCheckbox = this.hasCheckbox();

            // Update DOM
            _.forEach(this.$comparators, function(comparator) {
              var columnId = comparator.id;
              var asc = comparator.asc;

              var index = $columns.indexOf(columnId);
              var thIndex = hasCheckbox ? index + 1 : index;

              if (index >= 0) {
                // Update order flag
                if ($headers) {
                  addSort($headers, thIndex, asc);
                }
                if ($footers) {
                  addSort($footers, thIndex, asc);
                }
              }
            });
          }

          if ($$render !== false) {
            // Body need to be rendered since data is now sorted
            this.renderBody();
          }

          return this.dispatchEvent('sorted');
        },

        // Filter data
        filter: function(predicate) {
          // Check if predicate is empty.
          // Note that an empty string should remove filter since everything will match.
          var isEmptyPredicate = predicate == null || predicate === '';
          var newPredicate = isEmptyPredicate ? undefined : predicate;

          var oldFilter = this.$filter;
          var oldPredicate = oldFilter ? oldFilter.$predicate : null;
          var isUpdated = oldPredicate == null || oldPredicate !== newPredicate;

          if (isUpdated) {
            // Store predicate...
            this.$filter = newPredicate == null ? undefined : $filters.$create(newPredicate);

            // ... and apply filter
            GridFilter.applyFilter.call(this, this.$filter);
          }

          // Chain
          return this;
        },

        // This is a shorthand for this.filter(null);
        removeFilter: function() {
          if (this.$filter != null) {
            this.filter(undefined);
          }

          return this;
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

        // Add new event listener.
        // Type of event is case insensitive.
        addEventListener: function(type, listener) {
          this.$bus.addEventListener(type, listener);
          return this;
        },

        // Remove existing event listener.
        // Type of event is case insensitive.
        removeEventListener: function(type, listener) {
          this.$bus.removeEventListener(type, listener);
          return this;
        },

        // Clear all pending changes.
        clearChanges: function() {
          this.$data.clearChanges();
          this.$columns.clearChanges();

          if (this.$selection) {
            this.$selection.clearChanges();
          }

          return this;
        },

        // Destroy datagrid
        destroy: function() {
          this.detach();
          this.$bus.clear();
          this.$$events = null;
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

        // Display view
        // By default, table header is visible, footer is not.
        view: {
          thead: true,
          tfoot: false
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
      var events = [
        'onInitialized',
        'onUpdated',
        'onRendered',
        'onDataSpliced',
        'onDataChanged',
        'onDataUpdated',
        'onColumnsSpliced',
        'onColumnsUpdated',
        'onSelectionChanged',
        'onFilterUpdated',
        'onSorted',
        'onAttached',
        'onDetached'
      ];

      _.forEach(events, function(name) {
        Constructor.options.events[name] = null;
      });

      return Constructor;

    })();

    var Waffle = {
      // Make Grid constructor available.
      // This is deprecated, create function should be used instead.
      // @deprecated
      Grid: Grid,

      // Get default options
      options: Grid.options,

      // Create new grid
      create: Grid.create,

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


    return Waffle;

  }));

})(window, document, void 0);