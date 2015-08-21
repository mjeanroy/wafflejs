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
/* exported WaffleEvent */

/**
 * Event representation.
 * Note that waffle events does not bubbles.
 * TODO Use custom event api if available.
 */

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
