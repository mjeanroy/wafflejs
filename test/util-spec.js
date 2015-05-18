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

describe('$util', function() {

  it('should translate a value to a px notation', function() {
    expect($util.toPx(100)).toBe('100px');
    expect($util.toPx('100px')).toBe('100px');
  });

  it('should translate a px notation to a number', function() {
    expect($util.fromPx('100px')).toBe(100);
    expect($util.fromPx(100)).toBe(100);
  });

  it('should call async task', function() {
    var data = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];

    var onIteration = jasmine.createSpy('onIteration');
    var onEnded = jasmine.createSpy('onEnded');

    $util.asyncTask(data, 10, onIteration, onEnded);

    expect(onIteration).not.toHaveBeenCalled();
    expect(onEnded).not.toHaveBeenCalled();

    jasmine.clock().tick();

    expect(onIteration).toHaveBeenCalledWith([1, 2, 3], 0);
    expect(onEnded).not.toHaveBeenCalled();

    onIteration.calls.reset();
    onEnded.calls.reset();

    jasmine.clock().tick(10);

    expect(onIteration).toHaveBeenCalledWith([4, 5, 6], 3);
    expect(onEnded).not.toHaveBeenCalled();

    onIteration.calls.reset();
    onEnded.calls.reset();

    jasmine.clock().tick(10);

    expect(onIteration).toHaveBeenCalledWith([7, 8, 9], 6);
    expect(onEnded).toHaveBeenCalled();
  });
});
