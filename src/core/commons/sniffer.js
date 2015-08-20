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

/* global HashMap */
/* exported $sniffer */

/**
 * Simple object used for simple browser detection.
 */

var $sniffer = (function() {
  // This property is available only in IE
  var msie = document.documentMode;
  var cacheEvents = new HashMap();

  // This is a map of events with tagName to use for feature
  // detection.
  var events = {
    'input': 'input'
  };

  return {
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
})();
