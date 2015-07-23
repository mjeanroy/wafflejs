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

(function(window, document, undefined) {

  if (!window.addEventListener) {
    // Polyfill event
    var Event = function(e, element) {
      if (!(this instanceof Event)) {
        return new Event(e, element);
      }

      for (var i in e) {
        this[i] = e[i];
      }

      this.currentTarget =  element;
      this.target = e.srcElement || element;

      this.returnValue = true;
      this.cancelBubble = false;
      this.timeStamp = new Date().getTime();
    };

    Event.prototype = {
      // If this method is called, the default action of the event
      // will not be triggered.
      preventDefault: function() {
        this.returnValue = false;
      },

      // Prevents the event from bubbling up the DOM tree, preventing any parent
      // handlers from being notified of the event.
      stopPropagation: function() {
        this.cancelBubble = true;
      },

      // Keeps the rest of the handlers from being executed and
      // prevents the event from bubbling up the DOM tree.
      stopImmediatePropagation: function() {
        this.cancelBubble = true;
      }
    };

    var findIndex = function(array, callback) {
      for (var i = 0, size = array.length; i < size; ++i) {
        if (callback.call(null, array[i], i)) {
          return i;
        }
      }

      return -1;
    };

    var listenerIterator = function(type, listener) {
      return function(o) {
        return o.type === type && o.listener === listener;
      };
    };

    // Add event listener to element
    var addEventListener = function(type, listener) {
      var element = this;
      var listeners = element.$$listeners = element.$$listeners || [];
      var iterator = listenerIterator(type, listener);

      // Do not attach twice...
      var index = findIndex(listeners, iterator);
      var callback;
      if (index === -1) {
        callback = function(e) {
          var handleEvent = listener;
          var ctx = element;
          if (typeof listener !== 'function') {
            handleEvent = typeof listener.handleEvent === 'function' ? listener.handleEvent : function() {};
            ctx = listener;
          }

          return handleEvent.call(ctx, new Event(e || window.event, element));
        };

        listeners.push({
          type: type,
          listener: listener,
          callback: callback
        });

        element.attachEvent('on' + type, callback);
      }

      // Free memory
      element  = listeners = callback = iterator = null;
    };

    var removeEventListener = function(type, listener) {
      var element = this;
      var listeners = element.$$listeners || [];
      var iterator = listenerIterator(type, listener);

      var o;
      var index = findIndex(listeners, iterator);
      if (index !== -1) {
        o = listeners[index];
        element.detachEvent('on' + type, o.callback);
        listeners.splice(index, 1);
      }

      // Free memory
      element  = listeners = o = iterator = null;
    };

    var apply = function(array) {
      for (var i = 0, size = array.length; i < size; ++i) {
        var o = array[i];
        o.addEventListener = addEventListener;
        o.removeEventListener = removeEventListener;
      }
    };

    // Attach methods
    if ('Element' in window) {
      // IE8
      apply([document, window, Element.prototype]);
    } else {
      // IE7
      apply([document, window]);

      var head = document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      head.insertBefore(style, head.firstChild);
      style.styleSheet.cssText = '*{-ms-event-prototype:expression(!this.addEventListener&&(this.addEventListener=addEventListener)&&(this.removeEventListener=removeEventListener))}';
    }
  }

})(window, document, void 0);
