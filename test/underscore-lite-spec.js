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

describe('_', function() {

  it('should check if object is undefined', function() {
    expect(_.isUndefined(undefined)).toBe(true);
    expect(_.isUndefined(null)).toBe(false);
    expect(_.isUndefined(0)).toBe(false);
    expect(_.isUndefined('')).toBe(false);
    expect(_.isUndefined(NaN)).toBe(false);
  });

  it('should check if object is null', function() {
    expect(_.isNull(null)).toBe(true);
    expect(_.isNull(undefined)).toBe(false);
    expect(_.isNull(0)).toBe(false);
    expect(_.isNull('')).toBe(false);
    expect(_.isNull(NaN)).toBe(false);
  });

  it('should check if object is a function', function() {
    expect(_.isFunction(null)).toBe(false);
    expect(_.isFunction(undefined)).toBe(false);
    expect(_.isFunction(0)).toBe(false);
    expect(_.isFunction('')).toBe(false);
    expect(_.isFunction(NaN)).toBe(false);

    expect(_.isFunction(function() {})).toBe(true);
  });

  it('should check if object is an array', function() {
    expect(_.isArray([])).toBe(true);
    expect(_.isArray(undefined)).toBe(false);
    expect(_.isArray(null)).toBe(false);
    expect(_.isArray(0)).toBe(false);
    expect(_.isArray('')).toBe(false);
    expect(_.isArray(NaN)).toBe(false);
  });

  it('should check if object is a dom element', function() {
    expect(_.isElement(undefined)).toBe(false);
    expect(_.isElement(null)).toBe(false);
    expect(_.isElement(1)).toBe(false);
    expect(_.isElement('foo')).toBe(false);
    expect(_.isElement(true)).toBe(false);

    expect(_.isElement(document.createElement('div'))).toBe(true);
  });

  it('should check if object is a string', function() {
    expect(_.isString(undefined)).toBe(false);
    expect(_.isString(null)).toBe(false);
    expect(_.isString(1)).toBe(false);
    expect(_.isString(true)).toBe(false);

    expect(_.isString('foo')).toBe(true);
    expect(_.isString(String('foo'))).toBe(true);
    expect(_.isString(new String('foo'))).toBe(true);
  });

  it('should clone to new array', function() {
    var array = [1, 2, 3];

    var newArray = _.clone(array);

    expect(array).toEqual([1, 2, 3]);
    expect(newArray).toEqual(array);
    expect(newArray).not.toBe(array);
  });

  it('should apply callback for each array element', function() {
    var callback = jasmine.createSpy('callback');
    var array = [1, 2, 3];

    _.forEach(array, callback);

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

    var results = _.map(array, callback);

    expect(results).toEqual([2, 4, 6]);
    expect(array).toEqual([1, 2, 3]);
    expect(callback).toHaveBeenCalledWith(1, 0, array);
    expect(callback).toHaveBeenCalledWith(2, 1, array);
    expect(callback).toHaveBeenCalledWith(3, 2, array);
  });

  it('should check if every elements of array statisfy callback', function() {
    var callback = jasmine.createSpy('callback').and.callFake(function(value) {
      return value % 2 === 0;
    });

    var array1 = [1, 2, 3];
    var array2 = [2, 4, 6];

    var r1 = _.every(array1, callback);

    expect(r1).toBe(false);
    expect(callback).toHaveBeenCalledWith(1, 0, array1);
    expect(callback).not.toHaveBeenCalledWith(2, 1, array1);
    expect(callback).not.toHaveBeenCalledWith(3, 2, array1);

    var r2 = _.every(array2, callback);

    expect(r2).toBe(true);
    expect(callback).toHaveBeenCalledWith(2, 0, array2);
    expect(callback).toHaveBeenCalledWith(4, 1, array2);
    expect(callback).toHaveBeenCalledWith(6, 2, array2);
  });

  it('should check if some elements of array statisfy callback', function() {
    var callback = jasmine.createSpy('callback').and.callFake(function(value) {
      return value % 2 === 0;
    });

    var array1 = [1, 3, 5];
    var array2 = [2, 4, 6];

    var r1 = _.some(array1, callback);

    expect(r1).toBe(false);
    expect(callback).toHaveBeenCalledWith(1, 0, array1);
    expect(callback).toHaveBeenCalledWith(3, 1, array1);
    expect(callback).toHaveBeenCalledWith(5, 2, array1);

    var r2 = _.some(array2, callback);

    expect(r2).toBe(true);
    expect(callback).toHaveBeenCalledWith(2, 0, array2);
    expect(callback).not.toHaveBeenCalledWith(4, 1, array2);
    expect(callback).not.toHaveBeenCalledWith(6, 2, array2);
  });

  it('should reduce array from left to right to a single value without initial value', function() {
    var callback = jasmine.createSpy('callback').and.callFake(function(previous, value) {
      return previous + value;
    });

    var array = [0, 1, 2, 3, 4];
    var result = _.reduce(array, callback);

    expect(result).toBe(10);

    expect(callback).toHaveBeenCalledWith(0, 1, 1, array);
    expect(callback).toHaveBeenCalledWith(1, 2, 2, array);
    expect(callback).toHaveBeenCalledWith(3, 3, 3, array);
    expect(callback).toHaveBeenCalledWith(6, 4, 4, array);
  });

  it('should reduce array from left to right to a single value with initial value', function() {
    var callback = jasmine.createSpy('callback').and.callFake(function(previous, value) {
      return previous + value;
    });

    var array = [0, 1, 2, 3, 4];
    var result = _.reduce(array, callback, 10);

    expect(result).toBe(20);

    expect(callback).toHaveBeenCalledWith(10, 0, 0, array);
    expect(callback).toHaveBeenCalledWith(10, 1, 1, array);
    expect(callback).toHaveBeenCalledWith(11, 2, 2, array);
    expect(callback).toHaveBeenCalledWith(13, 3, 3, array);
    expect(callback).toHaveBeenCalledWith(16, 4, 4, array);
  });

  it('should reduce array from right to left to a single value without initial value', function() {
    var callback = jasmine.createSpy('callback').and.callFake(function(previous, value) {
      return previous + value;
    });

    var array = [0, 1, 2, 3, 4];
    var result = _.reduceRight(array, callback);

    expect(result).toBe(10);
    expect(callback).toHaveBeenCalledWith(4, 3, 3, array);
    expect(callback).toHaveBeenCalledWith(7, 2, 2, array);
    expect(callback).toHaveBeenCalledWith(9, 1, 1, array);
    expect(callback).toHaveBeenCalledWith(10, 0, 0, array);
  });

  it('should reduce array from right to left to a single value with initial value', function() {
    var callback = jasmine.createSpy('callback').and.callFake(function(previous, value) {
      return previous + value;
    });

    var array = [0, 1, 2, 3, 4];
    var result = _.reduceRight(array, callback, 10);

    expect(result).toBe(20);
    expect(callback).toHaveBeenCalledWith(10, 4, 4, array);
    expect(callback).toHaveBeenCalledWith(14, 3, 3, array);
    expect(callback).toHaveBeenCalledWith(17, 2, 2, array);
    expect(callback).toHaveBeenCalledWith(19, 1, 1, array);
  });

  it('should filter array', function() {
    var callback = jasmine.createSpy('callback').and.callFake(function(value) {
      return value % 2 === 0;
    });

    var array = [1, 2, 3, 4];
    var newArray = _.filter(array, callback, 10);

    expect(newArray).toEqual([2, 4]);
    expect(callback).toHaveBeenCalledWith(1, 0, array);
    expect(callback).toHaveBeenCalledWith(2, 1, array);
    expect(callback).toHaveBeenCalledWith(3, 2, array);
    expect(callback).toHaveBeenCalledWith(4, 3, array);
  });

  it('should find element in array', function() {
    var callback = jasmine.createSpy('callback').and.callFake(function(value) {
      return value % 2 === 0;
    });

    var a1 = [1, 2, 3, 4];
    var a2 = [1, 3, 5];

    var r1 = _.find(a1, callback);
    var r2 = _.find(a2, callback);

    expect(r1).toBe(2);
    expect(r2).toBeUndefined();

    expect(callback).toHaveBeenCalledWith(1, 0, a1);
    expect(callback).toHaveBeenCalledWith(2, 1, a1);
    expect(callback).not.toHaveBeenCalledWith(3, 2, a1);
    expect(callback).not.toHaveBeenCalledWith(4, 3, a1);

    expect(callback).toHaveBeenCalledWith(1, 0, a2);
    expect(callback).toHaveBeenCalledWith(3, 1, a2);
    expect(callback).toHaveBeenCalledWith(5, 2, a2);
  });
});
