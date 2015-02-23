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

describe('comparators', function() {

  beforeEach(function() {
  	jasmine.spyAll($comparators);
  })

  it('should compare two strings', function() {
    expect($comparators.$string('foo', 'foo')).toBeZero();
    expect($comparators.$string('foo', 'bar')).toBePositive();
    expect($comparators.$string('bar', 'foo')).toBeNegative();
    expect($comparators.$string(null, '')).toBeZero();
    expect($comparators.$string(undefined, '')).toBeZero();
    expect($comparators.$string(null, null)).toBeZero();
    expect($comparators.$string(undefined, undefined)).toBeZero();
    expect($comparators.$string(null, undefined)).toBeZero();
  });

  it('should compare two numbers', function() {
    expect($comparators.$number(1, 1)).toBeZero();
    expect($comparators.$number(1, 0)).toBePositive();
    expect($comparators.$number(0, 1)).toBeNegative();
    expect($comparators.$number('', 0)).toBeZero();
    expect($comparators.$number('1', 0)).toBePositive();
    expect($comparators.$number(null, 0)).toBeZero();
    expect($comparators.$number(undefined, 0)).toBeZero();
    expect($comparators.$number(undefined, undefined)).toBeZero();
    expect($comparators.$number(null, null)).toBeZero();
    expect($comparators.$number(null, undefined)).toBeZero();
  });

  it('should compare two booleans', function() {
    expect($comparators.$boolean(true, true)).toBeZero();
    expect($comparators.$boolean(false, false)).toBeZero();
    expect($comparators.$boolean(true, false)).toBePositive();
    expect($comparators.$boolean(false, true)).toBeNegative();
    expect($comparators.$boolean('false', true)).toBeNegative();
    expect($comparators.$boolean('true', false)).toBePositive();
    expect($comparators.$boolean(undefined, false)).toBeZero();
    expect($comparators.$boolean(null, false)).toBeZero();
    expect($comparators.$boolean(undefined, undefined)).toBeZero();
    expect($comparators.$boolean(null, null)).toBeZero();
    expect($comparators.$boolean(undefined, null)).toBeZero();
  });

  it('should compare two dates', function() {
    var d1 = new Date();
    var d2 = new Date(d1.getTime());

    expect($comparators.$date(d1, d2)).toBeZero();
    expect($comparators.$date(d1.getTime(), d2.getTime())).toBeZero();
    expect($comparators.$date(d1, d2.getTime())).toBeZero();
    expect($comparators.$date(d1.getTime(), d2)).toBeZero();

    var d3 = new Date(d1.getTime() + 3600);

    expect($comparators.$date(d1, d3)).toBeNegative();
    expect($comparators.$date(d3, d1)).toBePositive();

    expect($comparators.$date(null, null)).toBeZero();
    expect($comparators.$date(undefined, undefined)).toBeZero();
    expect($comparators.$date(null, undefined)).toBeZero();
  });

  it('should use automatic comparison with strings', function() {
    expect($comparators.$auto('foo', 'bar')).toBePositive();
    expect($comparators.$string).toHaveBeenCalled();
    $comparators.$string.calls.reset();

    expect($comparators.$auto('foo', null)).toBePositive();
    expect($comparators.$string).toHaveBeenCalled();
    $comparators.$string.calls.reset();

    expect($comparators.$auto('foo', undefined)).toBePositive();
    expect($comparators.$string).toHaveBeenCalled();
    $comparators.$string.calls.reset();
  });

  it('should use automatic comparison with numbers', function() {
    expect($comparators.$auto(1, 0)).toBePositive();
    expect($comparators.$number).toHaveBeenCalled();
    $comparators.$number.calls.reset();

    expect($comparators.$auto('1', 0)).toBePositive();
    expect($comparators.$number).toHaveBeenCalled();
    $comparators.$number.calls.reset();

    expect($comparators.$auto(1, undefined)).toBePositive();
    expect($comparators.$number).toHaveBeenCalled();
    $comparators.$number.calls.reset();

    expect($comparators.$auto(1, null)).toBePositive();
    expect($comparators.$number).toHaveBeenCalled();
    $comparators.$number.calls.reset();
  });

  it('should use automatic comparison with booleans', function() {
    expect($comparators.$auto(false, true)).toBeNegative();
    expect($comparators.$boolean).toHaveBeenCalled();
    $comparators.$boolean.calls.reset();

    expect($comparators.$auto('false', true)).toBeNegative();
    expect($comparators.$boolean).toHaveBeenCalled();
    $comparators.$boolean.calls.reset();

    expect($comparators.$auto(false, undefined)).toBeZero();
    expect($comparators.$boolean).toHaveBeenCalled();
    $comparators.$boolean.calls.reset();

    expect($comparators.$auto(false, null)).toBeZero();
    expect($comparators.$boolean).toHaveBeenCalled();
    $comparators.$boolean.calls.reset();
  });

  it('should use automatic comparison with null', function() {
    expect($comparators.$auto(null, null)).toBeZero();
  });

  it('should use automatic comparison with undefined', function() {
    expect($comparators.$auto(undefined, undefined)).toBeZero();
  });

  it('should use automatic comparison with null and undefined', function() {
    expect($comparators.$auto(null, undefined)).toBeZero();
  });
});