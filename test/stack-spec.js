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

describe('Stack', function() {
  it('should create a new stack', function() {
    var stack = new Stack();
    expect(stack.root).toBeNull();
  });

  it('should push value onto the stack', function() {
    var stack = new Stack();

    stack.push('foo');

    expect(stack.root).toEqual(jasmine.objectContaining({
      value: 'foo',
      next: null
    }));

    stack.push('bar');

    expect(stack.root).toEqual(jasmine.objectContaining({
      value: 'bar',
      next: jasmine.objectContaining({
        value: 'foo',
        next: null
      })
    }));
  });

  it('should peek value from the stack', function() {
    var stack = new Stack();

    stack.push('foo');
    expect(stack.peek()).toBe('foo');
    expect(stack.peek()).toBe('foo');

    stack.push('bar');
    expect(stack.peek()).toBe('bar');
    expect(stack.peek()).toBe('bar');
  });

  it('should pop value from the stack', function() {
    var stack = new Stack();

    stack.push('foo');
    stack.push('bar');

    expect(stack.pop()).toBe('bar');
    expect(stack.pop()).toBe('foo');
    expect(stack.pop()).toBeUndefined();
  });

  it('should check if stack is empty', function() {
    var stack = new Stack();
    expect(stack.isEmpty()).toBeTrue();

    stack.push('bar');
    expect(stack.isEmpty()).toBeFalse();

    stack.pop();
    expect(stack.isEmpty()).toBeTrue();
  });
});
