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

/* global _ */
/* global $sniffer */
/* exported $events */

const $events = (() => {

  const INPUT_EVT = 'input';
  const CHANGE_EVT = 'change';
  const KEYUP_EVT = 'keyup';
  const SPACE = ' ';

  var defaultEvents = {
    checkbox: CHANGE_EVT,
  };

  const inputEvents = () => {
    const inputEvt = $sniffer.hasEvent(INPUT_EVT) ? INPUT_EVT : KEYUP_EVT;
    return inputEvt + SPACE + CHANGE_EVT;
  };

  return {
    // Get default events for input type.
    $defaults: type => defaultEvents[type] || inputEvents(),

    // Parse events list to produce a string containing only
    // unique events.
    // Each trailing spaces is automatically removed.
    // Running time: 0(n).
    $parse: events => {
      const results = [];
      const map = {};

      let lastChar;
      let pendingEvt = '';

      for (let i = 0, size = events.length; i < size; ++i) {
        const currentChar = events.charAt(i);

        if (currentChar !== SPACE) {
          pendingEvt += currentChar;
        } else if (lastChar && lastChar !== SPACE) {
          if (!_.has(map, pendingEvt)) {
            map[pendingEvt] = true;
            results.push(pendingEvt);
            pendingEvt = '';
          }
        }

        lastChar = currentChar;
      }

      if (pendingEvt && !_.has(map, pendingEvt)) {
        results.push(pendingEvt);
      }

      return results.join(' ');
    }
  };

})();
