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

describe('Change', () => {
  let object;

  beforeEach(() => object = []);

  it('should create update change', () => {
    const index = 1;

    const change = Change.createUpdate(index, object);

    expect(change).toEqual({
      type: 'update',
      index: index,
      object: object,
      removed: [],
      addedCount: 0,
      added: []
    })
  });

  it('should create splice change', () => {
    const index = 1;
    const added = [1, 2, 3];
    const removed = [4, 5];

    const change = Change.createSplice(removed, added, index, object);

    expect(change).toEqual({
      type: 'splice',
      index: index,
      object: object,
      removed: removed,
      addedCount: added.length,
      added: added
    })
  });
});
