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

import {isArray, isEmpty, isNil, size, forEach, reject} from '@waffle/commons';

/**
 * The observable.
 * @class
 */
export class Observable {
  /**
   * Create the observable.
   * @constructor
   */
  constructor() {
    this._changes = [];
    this._observers = [];
    this._observableTask = null;
  }

  /**
   * Observe the instance.
   *
   * @param {function} callback The listener function.
   * @param {*} observer The observer value.
   * @return {Observable} The instance (for chaining).
   */
  observe(callback, observer = null) {
    this._observers = this._observers || [];
    this._observers.push({
      ctx: observer,
      callback,
    });

    return this;
  }

  /**
   * Remove current observer.
   * Calling this function without arguments remove all observers.
   *
   * @param {function} callback The listener function.
   * @param {*} observer The registered observer.
   * @return {Observable} The instance (for chaining).
   */
  unobserve(callback = null, observer = null) {
    if (!isEmpty(this._observers)) {
      if (isNil(callback) && isNil(observer)) {
        // Unobserve everything
        this._observers = [];
      } else {
        // Reject only specified listeners.
        this._observers = reject(this._observers, (o) => (
          o.ctx === observer && callback === o.callback
        ));
      }
    }

    return this;
  }

  /**
   * Trigger changes.
   * Note that callbacks will be called asynchronously.
   *
   * @param {Object|Array<Object>} changes Change (or array of changes).
   * @return {Observable} The instance (for chaining).
   */
  notify(changes) {
    const arrayOfChanges = isArray(changes) ? changes : [changes];

    // Append new change
    this._changes = this._changes || [];
    this._changes.push(...arrayOfChanges);

    // Clear pending task if one exist.
    if (this._observableTask) {
      clearTimeout(this._observableTask);
    }

    // Trigger asynchronous task
    this._observableTask = setTimeout(() => {
      if (!isEmpty(this._changes) && !isEmpty(this._observers)) {
        // Current changes will be executed accross all observers
        // If other changes are added by observers during iteration, then they will
        // be executed asynchronously later
        // Remove changes to be executed and use them for each observers.
        const removed = this._changes.splice(0, size(this._changes));

        // Trigger changes for each observer
        forEach(this._observers, (o) => (
          o.callback.call(o.ctx, removed))
        );
      }

      // Remove last task
      this._observableTask = null;
    });

    return this;
  }

  /**
   * Get pending changes.
   *
   * @return {Array<Object>} Pending changes.
   */
  pendingChanges() {
    return this._changes || [];
  }

  /**
   * Clear pending changes.
   *
   * @return {Observable} The instance (for chaining).
   */
  clearChanges() {
    if (!isEmpty(this._changes)) {
      this._changes.splice(0, size(this._changes));
    }

    if (!isNil(this._observableTask)) {
      clearTimeout(this._observableTask);
      this._observableTask = null;
    }

    return this;
  }
}
