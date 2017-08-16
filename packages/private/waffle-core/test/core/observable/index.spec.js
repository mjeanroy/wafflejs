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

import {createSplice, createUpdate, Observable} from '../../../src/core/observable/index';

describe('observable', () => {
  it('should create splice change', () => {
    const object = [0, 4, 5];
    const index = 1;
    const added = [1, 2, 3];
    const removed = [4, 5];

    const change = createSplice(removed, added, index, object);

    expect(change).toEqual({
      type: 'splice',
      index,
      object,
      removed,
      addedCount: added.length,
      added,
    });
  });

  it('should create update change', () => {
    const object = [1, 4, 5];
    const index = 1;

    const change = createUpdate(index, object);

    expect(change).toEqual({
      type: 'update',
      index,
      object,
      removed: [],
      addedCount: 0,
      added: [],
    });
  });

  it('should create observable', () => {
    const object = new Observable();
    expect(object._observers).toEqual([]);
    expect(object._changes).toEqual([]);
    expect(object._observableTask).toBeNull();
  });
});
