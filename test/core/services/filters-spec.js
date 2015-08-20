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

describe('filters', function() {

  it('should return predicate if it is already a function', function() {
    var predicate = jasmine.createSpy('predicate');
    var filter = $filters.$create(predicate);
    expect(filter).toBe(predicate);
  });

  it('should return custom predicate if it is not already a function', function() {
    var predicate = 'foo';
    var filter = $filters.$create(predicate);
    expect(filter).not.toBe(predicate);
    expect(filter).toBeAFunction();
  });

  it('should create a function that try to match object with predicate', function() {
    var filter = $filters.$create('foo');

    var o1 = {
      id: 1,
      name: 'foo'
    };

    var o2 = {
      id: 1,
      name: 'bar'
    };

    expect(filter(o1)).toBe(true);
    expect(filter(o2)).toBe(false);
  });

  it('should create a function that try to match nested objects with predicate', function() {
    var filter = $filters.$create('foo');

    var o1 = {
      id: 1,
      nested: {
        name: 'foo'
      }
    };

    var o2 = {
      id: 1,
      nested: {
        name: 'bar'
      }
    };

    expect(filter(o1)).toBe(true);
    expect(filter(o2)).toBe(false);
  });

  it('should create a function that try to match objects with predicate as object', function() {
    var filter = $filters.$create({
      name: 'foo'
    });

    var o1 = {
      id: 1,
      name: 'foo'
    };

    var o2 = {
      id: 1,
      name: 'bar'
    };

    expect(filter(o1)).toBe(true);
    expect(filter(o2)).toBe(false);
  });

  it('should create a function that try to match every objects values with predicate as object', function() {
    var filter = $filters.$create({
      id: 1,
      name: 'foo'
    });

    var o1 = {
      id: 1,
      name: 'foo'
    };

    var o2 = {
      id: 2,
      name: 'foo'
    };

    expect(filter(o1)).toBe(true);
    expect(filter(o2)).toBe(false);
  });
});