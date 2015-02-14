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

  it('should check if object is undefined', function() {
    expect($util.isUndefined(undefined)).toBe(true);
    expect($util.isUndefined(null)).toBe(false);
    expect($util.isUndefined(0)).toBe(false);
    expect($util.isUndefined('')).toBe(false);
    expect($util.isUndefined(NaN)).toBe(false);
  });

  it('should check if object is null', function() {
    expect($util.isNull(null)).toBe(true);
    expect($util.isNull(undefined)).toBe(false);
    expect($util.isNull(0)).toBe(false);
    expect($util.isNull('')).toBe(false);
    expect($util.isNull(NaN)).toBe(false);
  });

  it('should check if object is a dom element', function() {
    expect($util.isElement(undefined)).toBe(false);
    expect($util.isElement(null)).toBe(false);
    expect($util.isElement(1)).toBe(false);
    expect($util.isElement('foo')).toBe(false);
    expect($util.isElement(true)).toBe(false);

    expect($util.isElement(document.createElement('div'))).toBe(true);
  });

  it('should clone to new array', function() {
    var array = [1, 2, 3];

    var newArray = $util.clone(array);

    expect(array).toEqual([1, 2, 3]);
    expect(newArray).toEqual(array);
    expect(newArray).not.toBe(array);
  });

  it('should apply callback for each array element', function() {
    var callback = jasmine.createSpy('callback');
    var array = [1, 2, 3];

    $util.forEach(array, callback);

    expect(array).toEqual([1, 2, 3]);
    expect(callback).toHaveBeenCalledWith(1, 0, array);
    expect(callback).toHaveBeenCalledWith(2, 1, array);
    expect(callback).toHaveBeenCalledWith(3, 2, array);
  });

  it('should apply callback and return new array with results', function() {
    var callback = jasmine.createSpy('callback').and.callFake(function(value) {
      return value * 2;
    });

    var array = [1, 2, 3];

    var results = $util.map(array, callback);

    expect(results).toEqual([2, 4, 6]);
    expect(array).toEqual([1, 2, 3]);
    expect(callback).toHaveBeenCalledWith(1, 0, array);
    expect(callback).toHaveBeenCalledWith(2, 1, array);
    expect(callback).toHaveBeenCalledWith(3, 2, array);
  });
});