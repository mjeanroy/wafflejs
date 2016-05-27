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

describe('Column', () => {

  beforeEach(() => {
    spyOn($sniffer, 'hasEvent');
    spyOn($events, '$defaults').and.callThrough();
  });

  it('should initialize with default values', () => {
    const column = new Column({
      id: 'foo'
    });

    expect(column.escape).toBe(true);
    expect(column.sortable).toBe(true);
    expect(column.title).toBe('');
    expect(column.id).toBe('foo');
    expect(column.field).toBe('foo');
    expect(column.css).toBe('foo');
    expect(column.width).toBeUndefined();
    expect(column.editable).toBeFalsy();
    expect(column.draggable).toBeFalse();
  });

  it('should not initialize asc property', () => {
    const column = new Column({
      id: 'foo',
      asc: true
    });

    expect(column.asc).toBeNull();
  });

  it('should initialize with a string', () => {
    const column = new Column('foo');

    expect(column.escape).toBe(true);
    expect(column.sortable).toBe(true);
    expect(column.title).toBe('');
    expect(column.id).toBe('foo');
    expect(column.field).toBe('foo');
    expect(column.css).toBe('foo');
    expect(column.width).toBeUndefined();
    expect(column.editable).toBeFalsy();
    expect(column.draggable).toBeFalse();
  });

  it('should initialize with custom values', () => {
    const column = new Column({
      id: 'foo',
      field: 'foo.bar',
      title: 'Foo',
      css: 'foo-bar',
      escape: false,
      sortable: false,
      width: 100,
      draggable: true
    });

    expect(column.escape).toBe(false);
    expect(column.sortable).toBe(false);
    expect(column.title).toBe('Foo');
    expect(column.id).toBe('foo');
    expect(column.field).toBe('foo.bar');
    expect(column.css).toBe('foo-bar');
    expect(column.width).toBe(100);
    expect(column.draggable).toBeTrue();
  });

  it('should return column attributes for thead or tfoot', () => {
    const column = new Column({
      id: 'foo',
      sortable: true
    });

    const attributes = column.attributes(0, true);

    expect(attributes).toEqual({
      'data-waffle-id': 'foo',
      'data-waffle-sortable': true
    });
  });

  it('should return column attributes for tbody', () => {
    const column = new Column({
      id: 'foo',
      sortable: true
    });

    const attributes = column.attributes(0, false);

    expect(attributes).toEqual({
      'data-waffle-id': 'foo'
    });
  });

  it('should return column attributes for thead element and column in ascendant order', () => {
    const column = new Column({
      id: 'foo',
      draggable: true,
      sortable: true
    });

    column.asc = true;

    const attributes = column.attributes(0, true);

    expect(attributes).toEqual({
      'data-waffle-id': 'foo',
      'draggable': true,
      'data-waffle-sortable': true,
      'data-waffle-order': '+'
    });
  });

  it('should return column attributes for thead element and column in descendant order', () => {
    const column = new Column({
      id: 'foo',
      draggable: true,
      sortable: true
    });

    column.asc = false;

    const attributes = column.attributes(0, true);

    expect(attributes).toEqual({
      'data-waffle-id': 'foo',
      'draggable': true,
      'data-waffle-sortable': true,
      'data-waffle-order': '-'
    });
  });

  it('should return column attributes for tbody element and column in ascendant order', () => {
    const column = new Column({
      id: 'foo',
      sortable: true
    });

    column.asc = true;

    const attributes = column.attributes(0, false);

    expect(attributes).toEqual({
      'data-waffle-id': 'foo'
    });
  });

  it('should return column attributes for tbody element and column in descendant order', () => {
    const column = new Column({
      id: 'foo',
      sortable: true
    });

    column.asc = false;

    const attributes = column.attributes(0, false);

    expect(attributes).toEqual({
      'data-waffle-id': 'foo'
    });
  });

  it('should return column attributes for thead element and draggable column', () => {
    const column = new Column({
      id: 'foo',
      draggable: true,
      sortable: false
    });

    const attributes = column.attributes(0, true);

    expect(attributes).toEqual({
      'data-waffle-id': 'foo',
      'draggable': true
    });
  });

  it('should return column attributes for tbody element and draggable column', () => {
    const column = new Column({
      id: 'foo',
      draggable: true,
      sortable: false
    });

    const attributes = column.attributes(0, false);

    expect(attributes).toEqual({
      'data-waffle-id': 'foo'
    });
  });

  it('should create an editable column', () => {
    $sniffer.hasEvent.and.returnValue(true);

    const column = new Column({
      id: 'foo',
      editable: {
        type: 'number',
        css: 'form-control'
      }
    });

    expect(column.editable).toEqual({
      enable: true,
      type: 'number',
      css: 'form-control',
      updateOn: 'input change',
      debounce: 0
    });
  });

  it('should create an editable column with updateOn property', () => {
    $sniffer.hasEvent.and.returnValue(true);

    const column = new Column({
      id: 'foo',
      editable: {
        type: 'number',
        css: 'form-control',
        updateOn: 'focusout'
      }
    });

    expect(column.editable).toEqual({
      enable: true,
      type: 'number',
      css: 'form-control',
      updateOn: 'focusout',
      debounce: 0
    });
  });

  it('should create an editable checkbox column', () => {
    $sniffer.hasEvent.and.returnValue(true);

    const column = new Column({
      id: 'foo',
      editable: {
        type: 'checkbox',
        css: 'form-control'
      }
    });

    expect(column.editable).toEqual({
      enable: true,
      type: 'checkbox',
      css: 'form-control',
      updateOn: 'change',
      debounce: 0
    });
  });

  it('should create an editable column with default value', () => {
    $sniffer.hasEvent.and.returnValue(true);

    const column = new Column({
      id: 'foo',
      editable: true
    });

    expect(column.editable).toEqual({
      enable: true,
      type: 'text',
      css: null,
      updateOn: 'input change',
      debounce: 0
    });
  });

  it('should create an editable column with debounce', () => {
    $sniffer.hasEvent.and.returnValue(true);

    const column = new Column({
      id: 'foo',
      editable: {
        debounce: 100
      }
    });

    expect(column.editable).toEqual({
      enable: true,
      type: 'text',
      css: null,
      updateOn: 'input change',
      debounce: 100
    });
  });

  it('should check if column is editable', () => {
    const c1 = new Column({
      id: 'foo',
      editable: false
    });

    expect(c1.isEditable()).toBe(false);

    const c2 = new Column({
      id: 'foo',
      editable: {
        enable: false
      }
    });

    expect(c2.isEditable()).toBe(false);

    const fn = jasmine.createSpy('fn').and.callFake(data => data.id === 1);

    const c3 = new Column({
      id: 'foo',
      editable: {
        enable: fn
      }
    });

    expect(c3.isEditable()).toBe(true);
    expect(c3.isEditable({ id: 1 })).toBe(true);
    expect(c3.isEditable({ id: 2 })).toBe(false);
  });

  it('should check if event is handled', () => {
    $sniffer.hasEvent.and.returnValue(true);

    const column = new Column({
      id: 'foo',
      editable: {
        type: 'number',
        css: 'form-control',
        updateOn: 'input change'
      }
    });

    expect(column.handleEvent('input')).toBeTrue();
    expect(column.handleEvent('change')).toBeTrue();
    expect(column.handleEvent('click')).toBeFalse();
  });

  it('should check if event is handled and handle exact event', () => {
    $sniffer.hasEvent.and.returnValue(true);

    const column = new Column({
      id: 'foo',
      editable: {
        type: 'number',
        css: 'form-control',
        updateOn: 'input dblclick'
      }
    });

    expect(column.handleEvent('input')).toBeTrue();
    expect(column.handleEvent('click')).toBeFalse();
    expect(column.handleEvent('dblclick')).toBeTrue();
  });

  it('should normalize default css', () => {
    const column = new Column({
      id: 'foo.bar()'
    });

    expect(column.css).toBe('foo-bar');
  });

  it('should initialize column with pre-built renderer', () => {
    const column = new Column({
      id: 'foo',
      renderer: '$lowercase'
    });

    expect(column.$renderer).toEqual([$renderers.$lowercase]);
  });

  it('should initialize column with pre-built renderer as an array of pre-built renderers', () => {
    const column = new Column({
      id: 'foo',
      renderer: ['$lowercase', '$capitalize']
    });

    expect(column.$renderer).toEqual([$renderers.$lowercase, $renderers.$capitalize]);
  });

  it('should initialize column with pre-built renderer as an array of renderers', () => {
    const customRenderer = jasmine.createSpy('customRenderer').and.callFake(value => value + ' FOO');
    const column = new Column({
      id: 'foo',
      renderer: [customRenderer, '$lowercase']
    });

    expect(column.$renderer).toEqual([customRenderer, $renderers.$lowercase]);
  });

  it('should initialize column with pre-built comparator', () => {
    const column = new Column({
      id: 'foo',
      comparator: '$number'
    });

    expect(column.$comparator).toBe($comparators.$number);
  });

  it('should initialize column with custom comparator', () => {
    const comparator = jasmine.createSpy('comparator');

    const column = new Column({
      id: 'foo',
      comparator: comparator
    });

    expect(column.$comparator).toBe(comparator);
  });

  it('should render value of object', () => {
    const column = new Column({
      id: 'id'
    });

    const object = {
      id: 1
    };

    expect(column.render(object)).toBe('1');
    expect(column.render({ id: 0 })).toBe('0');
    expect(column.render({ })).toBe('');

    expect(column.render(null)).toBe('');
    expect(column.render(undefined)).toBe('');
  });

  it('should render value of object and escape value', () => {
    const column = new Column({
      id: 'name',
      escape: true
    });

    const input = '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>';
    const object = {
      id: 1,
      name: input
    };

    const sanitizedInput = $sanitize(input);
    expect(column.render(object)).toBe(sanitizedInput);
  });

  it('should render value of object and do not escape value', () => {
    const column = new Column({
      id: 'name',
      escape: false
    });

    const input = '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>';
    const object = {
      id: 1,
      name: input
    };

    expect(column.render(object)).toBe(input);
  });

  it('should render value of complex object', () => {
    const column = new Column({
      id: 'nested.name',
      escape: true
    });

    const object = {
      id: 1,
      nested: {
        name: 'foo'
      }
    };

    expect(column.render(object)).toBe('foo');
  });

  it('should render value using custom renderer', () => {
    const renderer = jasmine.createSpy('renderer').and.callFake(value => value += 'foo');
    const column = new Column({
      id: 'nested.name',
      escape: true,
      renderer: renderer
    });

    const object = {
      id: 1,
      nested: {
        name: 'foo'
      }
    };

    expect(column.render(object)).toBe('foofoo');
    expect(renderer).toHaveBeenCalledWith('foo', object, 'nested.name');
  });

  it('should render value using array of renderers', () => {
    const renderer = jasmine.createSpy('renderer').and.callFake(value => value += 'foo');
    const column = new Column({
      id: 'nested.name',
      escape: true,
      renderer: [renderer, '$uppercase']
    });

    const object = {
      id: 1,
      nested: {
        name: 'foo'
      }
    };

    expect(column.render(object)).toBe('FOOFOO');
    expect(renderer).toHaveBeenCalledWith('foo', object, 'nested.name');
  });

  it('should render value using custom field', () => {
    const renderer = jasmine.createSpy('renderer').and.callFake(value => value += 'foo');
    const column = new Column({
      id: 'c1',
      field: 'nested.name',
      escape: true,
      renderer: renderer
    });

    const object = {
      id: 1,
      nested: {
        name: 'foo'
      }
    };

    expect(column.render(object)).toBe('foofoo');
    expect(renderer).toHaveBeenCalledWith('foo', object, 'nested.name');
  });

  it('should render value using pre-built renderer', () => {
    const column = new Column({
      id: 'nested.name',
      renderer: '$empty'
    });

    const object = {
      id: 1,
      nested: {
        name: 'foo'
      }
    };

    expect(column.render(object)).toBe('');
  });

  it('should render value using pre-built lowercase renderer', () => {
    const column = new Column({
      id: 'nested.name',
      renderer: '$lowercase'
    });

    const object = {
      id: 1,
      nested: {
        name: 'Foo'
      }
    };

    expect(column.render(object)).toBe('foo');
  });

  it('should render value using pre-built uppercase renderer', () => {
    const column = new Column({
      id: 'nested.name',
      renderer: '$uppercase'
    });

    const object = {
      id: 1,
      nested: {
        name: 'Foo'
      }
    };

    expect(column.render(object)).toBe('FOO');
  });

  it('should get object value', () => {
    const column = new Column({
      id: 'id',
      sortable: false,
      width: 100
    });

    const object = {
      id: 1,
      nested: {
        name: 'Foo'
      }
    };

    expect(column.value()).toBe('');
    expect(column.value(null)).toBe('');
    expect(column.value(undefined)).toBe('');
    expect(column.value(object)).toBe(1);
  });

  it('should set object value', () => {
    const column = new Column({
      id: 'id',
      sortable: false,
      width: 100
    });

    const object = {
      id: 1,
      nested: {
        name: 'Foo'
      }
    };

    const result = column.value(object, 2);

    expect(result).toBe(column);
    expect(object.id).toBe(2);
  });

  it('should get default css classes to apply', () => {
    const column = new Column({
      id: 'id'
    });

    expect(column.cssClasses()).toEqual('id waffle-sortable');
  });

  it('should get default custom css classes to apply', () => {
    const column = new Column({
      id: 'id',
      css: 'foo'
    });

    expect(column.cssClasses()).toEqual('foo waffle-sortable');
  });

  it('should get default custom css classes to apply using function', () => {
    const fn = jasmine.createSpy('fn').and.callFake(() => 'foo');
    const column = new Column({
      id: 'id',
      css: fn
    });

    expect(column.cssClasses()).toEqual('foo waffle-sortable');
    expect(fn).toHaveBeenCalledWith();
  });

  it('should get default custom css classes to apply using function and data', () => {
    const fn = jasmine.createSpy('fn').and.callFake(() => 'foo');
    const data = {
      id: 1
    };

    const column = new Column({
      id: 'id',
      css: fn
    });

    expect(column.cssClasses(0, false, data)).toEqual('foo waffle-sortable');
    expect(fn).toHaveBeenCalledWith(data);
  });

  it('should get default custom css classes to apply using function that return an array', () => {
    const fn = jasmine.createSpy('fn').and.callFake(() => ['foo']);
    const data = {
      id: 1
    };

    const column = new Column({
      id: 'id',
      css: fn
    });

    expect(column.cssClasses(0, false, data)).toEqual('foo waffle-sortable');
    expect(fn).toHaveBeenCalledWith(data);
  });

  it('should get css classes if column is sorted in ascendant order', () => {
    const column = new Column({
      id: 'id'
    });

    column.asc = true;

    const classes = column.cssClasses();

    expect(classes).toContain('waffle-sortable');
    expect(classes).toContain('waffle-sortable-asc');
    expect(classes).not.toContain('waffle-sortable-desc');
  });

  it('should get css classes if column is sorted in descendant order', () => {
    const column = new Column({
      id: 'id'
    });

    column.asc = false;

    const classes = column.cssClasses();

    expect(classes).toContain('waffle-sortable');
    expect(classes).toContain('waffle-sortable-desc');
    expect(classes).not.toContain('waffle-sortable-asc');
  });

  it('should get default css classes to apply if column is not sortable', () => {
    const column = new Column({
      id: 'id',
      sortable: false
    });

    const classes = column.cssClasses();

    expect(classes).not.toContain('waffle-sortable');
    expect(classes).not.toContain('waffle-sortable-asc');
    expect(classes).not.toContain('waffle-sortable-desc');
  });

  it('should get empty object if no styles should be set', () => {
    const column = new Column({
      id: 'id',
      sortable: false
    });

    expect(column.styles()).toBeEmpty();
  });

  it('should get height and width as inline styles if size is defined', () => {
    const column = new Column({
      id: 'id',
      sortable: false,
    });

    column.computedWidth = 100;

    expect(column.styles()).toEqual({
      width: '100px',
      minWidth: '100px',
      maxWidth: '100px',
    });
  });

  it('should get height and width as inline styles if size is defined as strings', () => {
    const column = new Column({
      id: 'id',
      sortable: false,
    });

    column.computedWidth = '100px';

    expect(column.styles()).toEqual({
      width: '100px',
      minWidth: '100px',
      maxWidth: '100px',
    });
  });

  it('should update width of column', () => {
    const column = new Column({
      id: 'id',
      sortable: false,
      width: 100
    });

    expect(column.width).toBe(100);
    column.updateWidth(300);
    expect(column.width).toBe(300);
  });
});
