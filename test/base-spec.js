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

// Hooks called before and after each tests

// Create map from entries
const createMap = entries => {
  const map = new HashMap();

  for (const i in entries) {
    if (entries.hasOwnProperty(i)) {
      map.put(i, entries[i]);
    }
  }

  return map;
};

const triggerMouseEvent = (type, relatedTarget, shiftKey, ctrlKey) => {
  const evt = document.createEvent('MouseEvent');

  evt.initMouseEvent(
      type,           // type
      true,           // canBubble
      true,           // cancelable,
      window,         // 'view'
      0,              // detail
      0,              // screenX,
      0,              // screenY,
      0,              // clientX,
      0,              // clientY,
      ctrlKey,        // ctrlKey,
      false,          // altKey,
      shiftKey,       // shiftKey,
      false,          // metaKey,
      'left',         // button,
      relatedTarget   // relatedTarget
  );

  relatedTarget.dispatchEvent(evt);

  return evt;
}

const triggerClick = (relatedTarget, shiftKey, ctrlKey) => (
  triggerMouseEvent('click', relatedTarget, shiftKey, ctrlKey)
);

const triggerDblClick = (relatedTarget, shiftKey, ctrlKey) => (
  triggerMouseEvent('dblclick', relatedTarget, shiftKey, ctrlKey)
);

// == Fixtures
let fixtures;
beforeEach(() => {
  fixtures = document.createElement('div');
  fixtures.setAttribute('id', 'fixtures');
  document.body.appendChild(fixtures);
});

afterEach(() => {
  fixtures.parentNode.removeChild(fixtures);
  fixtures = null;
});

// == setTimeout
beforeEach(() => jasmine.clock().install());
afterEach(() => jasmine.clock().uninstall());

// == Unbind window events
afterEach(() => $(window).off());
