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

import {Stack} from '../../../src/core/stack/stack';

describe('Stack', () => {
  it('should create a new stack', () => {
    const stack = new Stack();
    expect(stack.isEmpty()).toBeTrue();
    expect(stack.peek()).toBeUndefined();
    expect(stack.pop()).toBeUndefined();
  });

  it('should push value onto the stack', () => {
    const stack = new Stack();

    const v1 = 'foo';
    const v2 = 'bar';

    stack.push(v1);
    expect(stack.peek()).toEqual(v1);

    stack.push(v2);
    expect(stack.peek()).toEqual(v2);
  });

  it('should peek value from the stack', () => {
    const stack = new Stack();

    const v1 = 'foo';
    const v2 = 'bar';

    stack.push(v1);
    expect(stack.peek()).toBe(v1);
    expect(stack.peek()).toBe(v1);

    stack.push(v2);
    expect(stack.peek()).toBe(v2);
    expect(stack.peek()).toBe(v2);
  });

  it('should pop value from the stack', () => {
    const stack = new Stack();

    const v1 = 'foo';
    const v2 = 'bar';

    stack.push(v1);
    stack.push(v2);

    expect(stack.pop()).toBe(v2);
    expect(stack.pop()).toBe(v1);
    expect(stack.pop()).toBeUndefined();
  });

  it('should check if stack is empty', () => {
    const stack = new Stack();
    expect(stack.isEmpty()).toBeTrue();

    stack.push('bar');
    expect(stack.isEmpty()).toBeFalse();

    stack.pop();
    expect(stack.isEmpty()).toBeTrue();
  });
});
