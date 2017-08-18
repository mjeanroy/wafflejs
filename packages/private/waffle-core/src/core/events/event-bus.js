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

import {isNil, isFunction, isEmpty, forEach, reject} from '@waffle/commons';
import {WaffleEvent} from './event';

// Format event to be case-insenstive.
const formatEventName = (type) => (
  type.toLowerCase()
);

// Wrap try-catch statement into this small function to avoid
// JIT deoptimization.
const tryCatch = (fn) => {
  try {
    fn();
    return null;
  } catch (e) {
    return e;
  }
};

/**
 * Bus of events that can:
 * - Register listener.
 * - Trigger events to notify listeners.
 */
export class EventBus {
  /**
   * Create an empty bus.
   * @constructor
   */
  constructor() {
    this._events = {};
  }

  /**
   * Add new event listener.
   * Event type is case insensitive.
   *
   * @param {string} type Event type.
   * @param {function} listener Listener function.
   * @return {void}
   */
  addEventListener(type, listener) {
    const name = formatEventName(type);
    const events = this._events;
    const listeners = events[name] = events[name] || [];
    listeners.push(listener);
  }

  /**
   * Remove event listener.
   * Event type is case insensitive.
   *
   * @param {string} type Event type.
   * @param {function} listener Listener function.
   * @return {void}
   */
  removeEventListener(type, listener = null) {
    const name = formatEventName(type);
    const listeners = this._events[name];

    if (isEmpty(listeners)) {
      return;
    }

    this._events[name] = reject(listeners, (current) => (
      isNil(listener) || current === listener
    ));
  }

  /**
   * Dispatch new event.
   * Event type is case insensitive.
   * Last parameter will be set to the event details attribute.
   *
   * @param {Object} target Event target.
   * @param {string} type Event type.
   * @param {Object} params Event details.
   * @return {void}
   */
  dispatchEvent(target, type, params) {
    // Format event name
    // Event name should be case insensitive
    const name = formatEventName(type);
    const listeners = this._events[name];
    if (isEmpty(listeners)) {
      return;
    }

    // Create WaffleEvent object
    const args = isFunction(params) ? params.call(target) : params;
    const evt = new WaffleEvent(type, target, args);

    forEach(listeners, (listener) => {
      tryCatch(() => (
        listener.call(target, evt)
      ));
    });
  }

  /**
   * Clear events.
   *
   * @return {void}
   */
  clear() {
    this._events = {};
  }
}
