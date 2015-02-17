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

describe('Column', function() {

  it('should initialize with default values', function() {
    var column = new Column({
      id: 'foo'
    });

    expect(column.escape).toBe(true);
    expect(column.sortable).toBe(true);
    expect(column.title).toBe('');
    expect(column.id).toBe('foo');
  });

  it('should initialize with custom values', function() {
    var column = new Column({
      id: 'foo',
      title: 'Foo',
      escape: false,
      sortable: false
    });

    expect(column.escape).toBe(false);
    expect(column.sortable).toBe(false);
    expect(column.title).toBe('Foo');
    expect(column.id).toBe('foo');
  });

  it('should extract value of object', function() {
    var column = new Column({
      id: 'id'
    });

    var object = {
      id: 1
    };

    expect(column.extract(object)).toBe('1');
    expect(column.extract({ id: 0 })).toBe('0');
    expect(column.extract({ })).toBe('');

    expect(column.extract(null)).toBe('');
    expect(column.extract(undefined)).toBe('');
  });

  it('should extract value of object and escape value', function() {
    var column = new Column({
      id: 'name',
      escape: true
    });

    var object = {
      id: 1,
      name: '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>'
    };

    expect(column.extract(object)).toBe('&lt;em onmouseover="this.textContent=\'PWN3D!\'"&gt;click here&lt;/em&gt;');
  });

  it('should extract value of complex object', function() {
    var column = new Column({
      id: 'nested.name',
      escape: true
    });

    var object = {
      id: 1,
      nested: {
        name: 'foo'
      }
    };

    expect(column.extract(object)).toBe('foo');
  });
});