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

describe('$parsers', () => {
  it('should return a number value', () => {
    expect($parsers.$format('number', '1')).toBe(1);
    expect($parsers.$format('number', '1.1')).toBe(1.1);
    expect($parsers.$format('number', 1)).toBe(1);
  });

  it('should return a boolean value', () => {
    expect($parsers.$format('checkbox', true)).toBe(true);
    expect($parsers.$format('checkbox', false)).toBe(false);
    expect($parsers.$format('checkbox', null)).toBe(false);
  });

  it('should return a text value', () => {
    expect($parsers.$format('boolean', 'foo')).toBe('foo');
    expect($parsers.$format('boolean', 'true')).toBe('true');
    expect($parsers.$format('boolean', 'false')).toBe('false');
  });

  it('should add a parser', () => {
    expect($parsers.$format('text', 'foo')).toBe('foo');

    const spy = jasmine.createSpy('parser').and.callFake(val => val);

    $parsers.$add('text', spy);
    $parsers.$format('text', 'foo');

    expect(spy).toHaveBeenCalledWith('foo');
  });
});
