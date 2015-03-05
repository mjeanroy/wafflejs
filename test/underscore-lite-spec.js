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

  it('should define noop function that always return undefined', function() {
    expect(_.noop(undefined)).toBeUndefined();
    expect(_.noop(null)).toBeUndefined();
    expect(_.noop(0)).toBeUndefined();
    expect(_.noop('')).toBeUndefined();
    expect(_.noop(NaN)).toBeUndefined();
    expect(_.noop([])).toBeUndefined();
  });

  it('should define identity function that always return undefined', function() {
    expect(_.identity(undefined)).toEqual(undefined);
    expect(_.identity(null)).toEqual(null);
    expect(_.identity(0)).toEqual(0);
    expect(_.identity('')).toEqual('');
    expect(_.identity(NaN)).toEqual(NaN);
    expect(_.identity([])).toEqual([]);
  });

  it('should check if object is undefined', function() {
    expect(_.isUndefined(undefined)).toBe(true);
    expect(_.isUndefined(null)).toBe(false);
    expect(_.isUndefined(0)).toBe(false);
    expect(_.isUndefined('')).toBe(false);
    expect(_.isUndefined(NaN)).toBe(false);
  });

  it('should check if object is a function', function() {
    expect(_.isFunction(null)).toBe(false);
    expect(_.isFunction(undefined)).toBe(false);
    expect(_.isFunction(0)).toBe(false);
    expect(_.isFunction('')).toBe(false);
    expect(_.isFunction(NaN)).toBe(false);

    expect(_.isFunction(function() {})).toBe(true);
  });

  it('should check if object is an object', function() {
    expect(_.isObject({})).toBe(true);
    expect(_.isObject(null)).toBe(false);
    expect(_.isObject(undefined)).toBe(false);
    expect(_.isObject(0)).toBe(false);
    expect(_.isObject('')).toBe(false);
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

    // With angular.js, this is not a string: bug ?
    // expect(_.isString(new String('foo'))).toBe(true);
  });

  it('should check if object is a number', function() {
    expect(_.isNumber(0)).toBe(true);
    expect(_.isNumber(1)).toBe(true);
    expect(_.isNumber(NaN)).toBe(true);

    expect(_.isNumber(false)).toBe(false);
    expect(_.isNumber(Boolean(''))).toBe(false);
    expect(_.isNumber(undefined)).toBe(false);
    expect(_.isNumber(null)).toBe(false);
  });

  it('should check if object is a date', function() {
    expect(_.isDate(new Date())).toBe(true);

    expect(_.isDate(0)).toBe(false);
    expect(_.isDate(1)).toBe(false);
    expect(_.isDate(NaN)).toBe(false);
    expect(_.isDate(false)).toBe(false);
    expect(_.isDate(Boolean(''))).toBe(false);
    expect(_.isDate(undefined)).toBe(false);
    expect(_.isDate(null)).toBe(false);
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
});
