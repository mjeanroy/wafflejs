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
    expect(column.field).toBe('foo');
    expect(column.css).toBe('foo');
  });

  it('should initialize with custom values', function() {
    var column = new Column({
      id: 'foo',
      field: 'foo.bar',
      title: 'Foo',
      css: 'foo-bar',
      escape: false,
      sortable: false
    });

    expect(column.escape).toBe(false);
    expect(column.sortable).toBe(false);
    expect(column.title).toBe('Foo');
    expect(column.id).toBe('foo');
    expect(column.field).toBe('foo.bar');
    expect(column.css).toBe('foo-bar');
  });

  it('should initialize column with pre-built renderer', function() {
    var column = new Column({
      id: 'foo',
      renderer: 'lowercase'
    });

    expect(column.renderer).toEqual([$renderers.lowercase]);
  });

  it('should initialize column with pre-built renderer as an array of pre-built renderers', function() {
    var column = new Column({
      id: 'foo',
      renderer: ['lowercase', 'capitalize']
    });

    expect(column.renderer).toEqual([$renderers.lowercase, $renderers.capitalize]);
  });

  it('should initialize column with pre-built renderer as an array of renderers', function() {
    var customRenderer = jasmine.createSpy('customRenderer').and.callFake(function(value) {
      return value + ' FOO';
    });

    var column = new Column({
      id: 'foo',
      renderer: [customRenderer, 'lowercase']
    });

    expect(column.renderer).toEqual([customRenderer, $renderers.lowercase]);
  });

  it('should initialize column with pre-built comparator', function() {
    var column = new Column({
      id: 'foo',
      comparator: '$number'
    });

    expect(column.comparator).toBe($comparators.$number);
  });

  it('should initialize column with custom comparator', function() {
    var comparator = jasmine.createSpy('comparator');

    var column = new Column({
      id: 'foo',
      comparator: comparator
    });

    expect(column.comparator).toBe(comparator);
  });

  it('should render value of object', function() {
    var column = new Column({
      id: 'id'
    });

    var object = {
      id: 1
    };

    expect(column.render(object)).toBe('1');
    expect(column.render({ id: 0 })).toBe('0');
    expect(column.render({ })).toBe('');

    expect(column.render(null)).toBe('');
    expect(column.render(undefined)).toBe('');
  });

  it('should render value of object and escape value', function() {
    var column = new Column({
      id: 'name',
      escape: true
    });

    var object = {
      id: 1,
      name: '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>'
    };

    expect(column.render(object)).toBe('&lt;em onmouseover="this.textContent=\'PWN3D!\'"&gt;click here&lt;/em&gt;');
  });

  it('should render value of complex object', function() {
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

    expect(column.render(object)).toBe('foo');
  });

  it('should render value using custom renderer', function() {
    var renderer = jasmine.createSpy('renderer').and.callFake(function(value) {
      return value += 'foo';
    });

    var column = new Column({
      id: 'nested.name',
      escape: true,
      renderer: renderer
    });

    var object = {
      id: 1,
      nested: {
        name: 'foo'
      }
    };

    expect(column.render(object)).toBe('foofoo');
    expect(renderer).toHaveBeenCalledWith('foo', object, 'nested.name');
  });

  it('should render value using array of renderers', function() {
    var renderer = jasmine.createSpy('renderer').and.callFake(function(value) {
      return value += 'foo';
    });

    var column = new Column({
      id: 'nested.name',
      escape: true,
      renderer: [renderer, 'uppercase']
    });

    var object = {
      id: 1,
      nested: {
        name: 'foo'
      }
    };

    expect(column.render(object)).toBe('FOOFOO');
    expect(renderer).toHaveBeenCalledWith('foo', object, 'nested.name');
  });

  it('should render value using custom field', function() {
    var renderer = jasmine.createSpy('renderer').and.callFake(function(value) {
      return value += 'foo';
    });

    var column = new Column({
      id: 'c1',
      field: 'nested.name',
      escape: true,
      renderer: renderer
    });

    var object = {
      id: 1,
      nested: {
        name: 'foo'
      }
    };

    expect(column.render(object)).toBe('foofoo');
    expect(renderer).toHaveBeenCalledWith('foo', object, 'nested.name');
  });

  it('should render value using pre-built renderer', function() {
    var column = new Column({
      id: 'nested.name',
      renderer: 'empty'
    });

    var object = {
      id: 1,
      nested: {
        name: 'foo'
      }
    };

    expect(column.render(object)).toBe('');
  });

  it('should render value using pre-built lowercase renderer', function() {
    var column = new Column({
      id: 'nested.name',
      renderer: 'lowercase'
    });

    var object = {
      id: 1,
      nested: {
        name: 'Foo'
      }
    };

    expect(column.render(object)).toBe('foo');
  });

  it('should render value using pre-built uppercase renderer', function() {
    var column = new Column({
      id: 'nested.name',
      renderer: 'uppercase'
    });

    var object = {
      id: 1,
      nested: {
        name: 'Foo'
      }
    };

    expect(column.render(object)).toBe('FOO');
  });

  it('should get default css classes to apply', function() {
    var column = new Column({
      id: 'id'
    });

    expect(column.cssClasses()).toEqual(['id', 'waffle-sortable']);
  });

  it('should get default custom css classes to apply', function() {
    var column = new Column({
      id: 'id',
      css: 'foo'
    });

    expect(column.cssClasses()).toEqual(['foo', 'waffle-sortable']);
  });

  it('should get css classes if column is sorted in ascendant order', function() {
    var column = new Column({
      id: 'id',
      order: '+'
    });

    var classes = column.cssClasses();

    expect(classes).toContain('waffle-sortable');
    expect(classes).toContain('waffle-sortable-asc');
    expect(classes).not.toContain('waffle-sortable-desc');
  });

  it('should get css classes if column is sorted in descendant order', function() {
    var column = new Column({
      id: 'id',
      order: '-'
    });

    var classes = column.cssClasses();

    expect(classes).toContain('waffle-sortable');
    expect(classes).toContain('waffle-sortable-desc');
    expect(classes).not.toContain('waffle-sortable-asc');
  });

  it('should get default css classes to apply if column is not sortable', function() {
    var column = new Column({
      id: 'id',
      sortable: false
    });

    var classes = column.cssClasses();

    expect(classes).not.toContain('waffle-sortable');
    expect(classes).not.toContain('waffle-sortable-asc');
    expect(classes).not.toContain('waffle-sortable-desc');
  });
});
