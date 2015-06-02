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
/* exported EventBus */

var EventBus = (function() {

  var noop = _.noop;

  var WaffleEvent = function(event, target, params) {
    this.type = event;
    this.bubbles = false;
    this.cancelable = false;
    this.details = params;
    this.target = target;
    this.currentTarget = target;
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
