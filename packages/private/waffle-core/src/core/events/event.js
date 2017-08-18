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

import {now} from '@waffle/commons';

/**
 * Event representation.
 * Note that waffle events does not bubbles.
 * TODO Use custom event api if available.
 *
 * @class
 */
export class WaffleEvent {
  /**
   * Create the event.
   *
   * @param {string} event Event type.
   * @param {Object} target Event target.
   * @param {Object} params Event details.
   */
  constructor(event, target, params) {
    this.type = event;
    this.bubbles = false;
    this.cancelable = false;
    this.details = params;
    this.timeStamp = now();

    this.target = target;
    this.currentTarget = target;
    this.srcElement = target;
  }

  // Nothing to do for now.
  // eslint-disable-next-line
  preventDefault() {
  }

  // Nothing to do for now.
  // eslint-disable-next-line
  stopPropagation() {
  }

  // Nothing to do for now.
  // eslint-disable-next-line
  stopImmediatePropagation() {
  }
}
