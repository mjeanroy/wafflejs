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

describe('parse', function() {

  var obj;
  var nestedObj;

  beforeEach(function() {
    obj = {
      id: 1,
      foo: function() {
        return 'bar';
      }
    };

    nestedObj = {
      nested: {
        id: 1
      }
    };
  });

  it('should return undefined for undefined object', function() {
    expect($parse('id')(undefined)).toBeUndefined();
  });

  it('should return undefined for null object', function() {
    expect($parse('id')(null)).toBeUndefined();
  });

  it('should return undefined for number object', function() {
    expect($parse('id')(1)).toBeUndefined();
  });

  it('should return undefined for string object', function() {
    expect($parse('id')('foo')).toBeUndefined();
  });

  it('should return undefined for boolean object', function() {
    expect($parse('id')(true)).toBeUndefined();
  });

  it('should return undefined for NaN object', function() {
    expect($parse('id')(NaN)).toBeUndefined();
  });

  it('should return value of attribute of simple object', function() {
    expect($parse('id')(obj)).toBe(1);
  });

  it('should return result of function execution', function() {
    expect($parse('foo()')(obj)).toBe('bar');
    expect($parse('foo( )')(obj)).toBe('bar');
  });

  it('should return value of attribute of nested object', function() {
    expect($parse('nested.id')(nestedObj)).toBe(1);
  });

  it('should return value of attribute of nested object using bracket notation', function() {
    expect($parse('nested["id"]')(nestedObj)).toBe(1);
    expect($parse('nested[\'id\']')(nestedObj)).toBe(1);
  });

  // Internal parse define custom behavior
  if (typeof angular === 'undefined') {
    describe('without angular', function() {
      // Test internal '$normalize' function
      it('should normalize key', function() {
        expect($parse.$normalize('[0]')).toBe('0');
        expect($parse.$normalize('foo')).toBe('foo');
        expect($parse.$normalize('foo.bar')).toBe('foo.bar');
        expect($parse.$normalize('foo[0]')).toBe('foo.0');
        expect($parse.$normalize('foo[\'0\']')).toBe('foo.0');
        expect($parse.$normalize('foo["0"]')).toBe('foo.0');
        expect($parse.$normalize('foo.bar["0"].id')).toBe('foo.bar.0.id');
      });

      // Test internal '$split' function
      it('should split key', function() {
        expect($parse.$split('foo')).toEqual(['foo']);
        expect($parse.$split('foo.bar')).toEqual(['foo', 'bar']);
        expect($parse.$split('foo[0]')).toEqual(['foo', '0']);
        expect($parse.$split('foo[\'0\']')).toEqual(['foo', '0']);
        expect($parse.$split('foo["0"]')).toEqual(['foo', '0']);
        expect($parse.$split('foo.bar["0"].id')).toEqual(['foo', 'bar', '0', 'id']);
      });

      // Internal parser allow array notation as first key
      it('should return value of attribute of simple array', function() {
        expect($parse('[0]')([1, 2, 3])).toBe(1);
        expect($parse('[1]')([1, 2, 3])).toBe(2);
        expect($parse('[2]')([1, 2, 3])).toBe(3);
      });

      // Internal parser allow bracket notation as first key
      it('should return value of attribute of simple object using bracket notation', function() {
        expect($parse('["id"]')(obj)).toBe(1);
        expect($parse('[\'id\']')(obj)).toBe(1);
      });
    });
  }
});
