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

describe('Event', () => {

  it('should create an event', () => {
    const type = 'foo';
    const target = {};
    const params = null;

    const event = new WaffleEvent(type, target, params);

    expect(event.type).toBe(type);
    expect(event.bubbles).toBeFalse();
    expect(event.cancelable).toBeFalse();
    expect(event.details).toBeNull();

    expect(event.timeStamp).toBeDateCloseToNow();

    expect(event.target).toBe(target);
    expect(event.currentTarget).toBe(target);
    expect(event.srcElement).toBe(target);
  });

  it('should create an event with details', () => {
    const type = 'foo';
    const target = {};
    const params = {
      foo: 'bar'
    };

    const event = new WaffleEvent(type, target, params);

    expect(event.type).toBe(type);
    expect(event.bubbles).toBeFalse();
    expect(event.cancelable).toBeFalse();
    expect(event.details).toEqual(params);

    expect(event.timeStamp).toBeDateCloseToNow();

    expect(event.target).toBe(target);
    expect(event.currentTarget).toBe(target);
    expect(event.srcElement).toBe(target);
  });

  it('should create an event with default functions', () => {
    const type = 'foo';
    const target = {};
    const params = {
      foo: 'bar'
    };

    const event = new WaffleEvent(type, target, params);

    expect(event.preventDefault).toBeAFunction();
    expect(event.stopPropagation).toBeAFunction();
    expect(event.stopImmediatePropagation).toBeAFunction();
  });
});
