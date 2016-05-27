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

describe('parse', () => {

  let obj;
  let nestedObj;

  beforeEach(() => {
    obj = {
      id: 1,
      foo: () => 'bar'
    };

    nestedObj = {
      nested: {
        id: 1
      }
    };
  });

  it('should return undefined for undefined object', () => {
    expect($parse('id')(undefined)).toBeUndefined();
  });

  it('should return undefined for null object', () => {
    expect($parse('id')(null)).toBeUndefined();
  });

  it('should return undefined for number object', () => {
    expect($parse('id')(1)).toBeUndefined();
  });

  it('should return undefined for string object', () => {
    expect($parse('id')('foo')).toBeUndefined();
  });

  it('should return undefined for boolean object', () => {
    expect($parse('id')(true)).toBeUndefined();
  });

  it('should return undefined for NaN object', () => {
    expect($parse('id')(NaN)).toBeUndefined();
  });

  it('should return value of attribute of simple object', () => {
    expect($parse('id')(obj)).toBe(1);
  });

  it('should return result of function execution', () => {
    expect($parse('foo()')(obj)).toBe('bar');
    expect($parse('foo( )')(obj)).toBe('bar');
  });

  it('should return value of attribute of nested object', () => {
    expect($parse('nested.id')(nestedObj)).toBe(1);
  });

  it('should return value of attribute of nested object using bracket notation', () => {
    expect($parse('nested["id"]')(nestedObj)).toBe(1);
    expect($parse('nested[\'id\']')(nestedObj)).toBe(1);

    expect($parse('nested[ "id" ]')(nestedObj)).toBe(1);
    expect($parse('nested[ \'id\' ]')(nestedObj)).toBe(1);
  });

  it('should keep key with spaces', () => {
    obj['foo bar'] = 'foo';

    if (typeof angular === 'undefined') {
      // This syntax should be valid...
      expect($parse('foo bar')(obj)).toBe('foo');
    } else {
      // But angular does not handle this
      const exec = () => $parse('foo bar')(obj);
      expect(exec).toThrow();
    }
  });

  it('should throw error if expression is malformed', () => {
    const withoutClosingBracket = () => $parse('nested["id"');
    const withoutClosingParenthesis = () => $parse('nested(');
    const withoutClosingDoubleQuote = () => $parse('nested["id]');
    const withoutClosingSingleQuote = () => $parse('nested[\'id]');
    const withoutClosingQuote = () => $parse('nested["id\']');
    const withLastDot = () => $parse('nested.');

    expect(withoutClosingBracket).toThrow();
    expect(withoutClosingParenthesis).toThrow();
    expect(withoutClosingDoubleQuote).toThrow();
    expect(withoutClosingSingleQuote).toThrow();
    expect(withoutClosingQuote).toThrow();
    expect(withLastDot).toThrow();
  });

  it('should use cache', () => {
    const f1 = $parse('nested["id"]');
    const f2 = $parse('nested["id"]');
    expect(f1).toBe(f2);
  });

  it('should set value on object', () => {
    const o = {};
    const parser = $parse('id');
    const setter = parser.assign;

    setter(o, 'foo');

    expect(o).toEqual({
      id: 'foo'
    });
  });

  it('should set value on nested object', () => {
    const o = {
      nested: {}
    };

    const parser = $parse('nested.id');
    const setter = parser.assign;

    setter(o, 'foo');

    expect(o).toEqual({
      nested: {
        id: 'foo'
      }
    });
  });

  it('should set value on nested object and create nested object if needed', () => {
    const o = {};
    const parser = $parse('nested.id');
    const setter = parser.assign;

    setter(o, 'foo');

    expect(o).toEqual({
      nested: {
        id: 'foo'
      }
    });
  });
});
