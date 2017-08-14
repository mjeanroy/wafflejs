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

import {getComparator} from '../../../src/core/comparators/index';

describe('comparators', () => {
  it('should compare two strings', () => {
    const string = getComparator('$string');

    expect(string('foo', 'foo')).toBeZero();
    expect(string('foo', 'bar')).toBePositive();
    expect(string('bar', 'foo')).toBeNegative();
    expect(string(null, '')).toBeZero();
    expect(string(undefined, '')).toBeZero();
    expect(string(null, null)).toBeZero();
    expect(string(undefined, undefined)).toBeZero();
    expect(string(null, undefined)).toBeZero();
  });

  it('should compare two numbers', () => {
    const number = getComparator('$number');

    expect(number(1, 1)).toBeZero();
    expect(number(1, 0)).toBePositive();
    expect(number(0, 1)).toBeNegative();
    expect(number('', 0)).toBeZero();
    expect(number('1', 0)).toBePositive();
    expect(number(null, 0)).toBeZero();
    expect(number(undefined, 0)).toBeZero();
    expect(number(undefined, undefined)).toBeZero();
    expect(number(null, null)).toBeZero();
    expect(number(null, undefined)).toBeZero();
  });

  it('should compare two booleans', () => {
    const boolean = getComparator('$boolean');

    expect(boolean(true, true)).toBeZero();
    expect(boolean(false, false)).toBeZero();
    expect(boolean(true, false)).toBePositive();
    expect(boolean(false, true)).toBeNegative();
    expect(boolean('false', true)).toBeNegative();
    expect(boolean('true', false)).toBePositive();
    expect(boolean(undefined, false)).toBeZero();
    expect(boolean(null, false)).toBeZero();
    expect(boolean(undefined, undefined)).toBeZero();
    expect(boolean(null, null)).toBeZero();
    expect(boolean(undefined, null)).toBeZero();
  });

  it('should compare two dates', () => {
    const date = getComparator('$date');
    const d1 = new Date();
    const d2 = new Date(d1.getTime());

    expect(date(d1, d2)).toBeZero();
    expect(date(d1.getTime(), d2.getTime())).toBeZero();
    expect(date(d1, d2.getTime())).toBeZero();
    expect(date(d1.getTime(), d2)).toBeZero();

    const d3 = new Date(d1.getTime() + 3600);

    expect(date(d1, d3)).toBeNegative();
    expect(date(d3, d1)).toBePositive();

    expect(date(null, null)).toBeZero();
    expect(date(undefined, undefined)).toBeZero();
    expect(date(null, undefined)).toBeZero();
  });

  it('should use automatic comparison with strings', () => {
    const auto = getComparator('$auto');

    expect(auto('foo', 'bar')).toBePositive();
    expect(auto('foo', null)).toBePositive();
    expect(auto('foo', undefined)).toBePositive();
  });

  it('should use automatic comparison with numbers', () => {
    const auto = getComparator('$auto');

    expect(auto(1, 0)).toBePositive();
    expect(auto('1', 0)).toBePositive();
    expect(auto(1, undefined)).toBePositive();
    expect(auto(1, null)).toBePositive();
  });

  it('should use automatic comparison with booleans', () => {
    const auto = getComparator('$auto');

    expect(auto(false, true)).toBeNegative();
    expect(auto('false', true)).toBeNegative();
    expect(auto(false, undefined)).toBeZero();
    expect(auto(false, null)).toBeZero();
  });

  it('should use automatic comparison with null', () => {
    const auto = getComparator('$auto');
    expect(auto(null, null)).toBeZero();
  });

  it('should use automatic comparison with undefined', () => {
    const auto = getComparator('$auto');
    expect(auto(undefined, undefined)).toBeZero();
  });

  it('should use automatic comparison with null and undefined', () => {
    const auto = getComparator('$auto');
    expect(auto(null, undefined)).toBeZero();
  });

  it('should use automatic comparison even with non supported type', () => {
    const auto = getComparator('$auto');
    const o1 = {id: 1};
    const o2 = {id: 2};
    expect(auto(o1, o2)).not.toBeZero();
    expect(auto(o2, o1)).not.toBeZero();
  });
});
