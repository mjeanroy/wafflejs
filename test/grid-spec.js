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

describe('Grid', function() {

  beforeEach(function() {
    jq = $.fn || $.prototype;
  });

  it('should define custom options', function() {
    expect(Grid.options).toEqual({
      key: 'id',
      async: false,
      selection: {
        multi: false
      },
      size: {
        width: null,
        height: null
      },
      events: {
        onInitialized: _.noop,
        onRendered: _.noop,
        onAdded: _.noop,
        onRemoved: _.noop,
        onSorted: _.noop,
        onUpdated: _.noop
      }
    });
  });

  it('should create grid using default options', function() {
    var columns = [
      { id: 'foo', title: 'Foo' },
      { id: 'bar', title: 'Boo' }
    ];

    var table = document.createElement('table');
    var grid = new Grid(table, {
      columns: columns
    });

    expect(grid.options).toBeDefined();
    expect(grid.options).not.toBe(Grid.options);
    expect(grid.options).toEqual(jasmine.objectContaining(Grid.options));
  });

  it('should create grid with custom options', function() {
    var Model = function(o) {
      this.id = o.id;
    };

    var table = document.createElement('table');
    var onInitialized = jasmine.createSpy('onInitialized');
    var onAdded = jasmine.createSpy('onAdded');

    var grid = new Grid(table, {
      key: 'title',
      model: Model,
      async: true,
      selection: {
        multi: false
      },
      size: {
        width: 100,
        height: 200
      },
      events: {
        onInitialized: onInitialized,
        onAdded: onAdded
      },
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    expect(grid.options).toBeDefined();
    expect(grid.options).not.toBe(Grid.options);
    expect(grid.options).not.toEqual(jasmine.objectContaining(Grid.options));
    expect(grid.options).toEqual(jasmine.objectContaining({
      key: 'title',
      model: Model,
      selection: {
        multi: false
      },
      async: true,
      size: {
        width: 100,
        height: 200
      },
      events: {
        onInitialized: onInitialized,
        onRendered: _.noop,
        onAdded: onAdded,
        onRemoved: _.noop,
        onSorted: _.noop,
        onUpdated: _.noop
      }
    }));
  });

  it('should create grid with size values as numbers', function() {
    var table = document.createElement('table');
    var onInitialized = jasmine.createSpy('onInitialized');
    var onAdded = jasmine.createSpy('onAdded');

    var grid = new Grid(table, {
      size: {
        width: '100px',
        height: '200px'
      }
    });

    expect(grid.options).toEqual(jasmine.objectContaining({
      size: {
        width: 100,
        height: 200
      }
    }));
  });

  it('should retrieve thead and tbody element', function() {
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    expect(grid.$table).toBeDefined();
    expect(grid.$thead).toBeDefined();
    expect(grid.$tbody).toBeDefined();

    expect(grid.$tbody[0]).toBe(tbody);
    expect(grid.$thead[0]).toBe(thead);
  });

  it('should create thead and tbody element', function() {
    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    expect(grid.$table).toBeDefined();
    expect(grid.$thead).toBeDefined();
    expect(grid.$tbody).toBeDefined();

    expect(grid.$tbody[0]).toBeDOMElement('tbody');
    expect(grid.$thead[0]).toBeDOMElement('thead');

    var childs = table.childNodes;
    expect(childs[0]).toBe(grid.$thead[0]);
    expect(childs[1]).toBe(grid.$tbody[0]);
  });

  it('should bind click on header and body when grid is initialized', function() {
    spyOn(jq, 'on').and.callThrough();

    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    var onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(2);
    expect(onCalls[0].object).toEqual(grid.$thead);
    expect(onCalls[0].args).toContain('click', Function);
    expect(onCalls[1].object).toEqual(grid.$tbody);
    expect(onCalls[1].args).toContain('click', Function);
  });

  it('should destroy grid', function() {
    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    expect(grid.$table).toBeDefined();
    expect(grid.$thead).toBeDefined();
    expect(grid.$tbody).toBeDefined();
    expect(grid.$data).toBeDefined();
    expect(grid.$selection).toBeDefined();
    expect(grid.$columns).toBeDefined();

    grid.destroy();

    expect(grid.$table).toBeNull();
    expect(grid.$thead).toBeNull();
    expect(grid.$tbody).toBeNull();
    expect(grid.$data).toBeNull();
    expect(grid.$selection).toBeNull();
    expect(grid.$columns).toBeNull();
  });

  it('should unbind events when grid is destroyed', function() {
    spyOn(jq, 'on').and.callThrough();
    spyOn(jq, 'off').and.callThrough();

    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    expect(grid.$table).toBeDefined();
    expect(grid.$thead).toBeDefined();
    expect(grid.$tbody).toBeDefined();
    expect(grid.$data).toBeDefined();
    expect(grid.$selection).toBeDefined();
    expect(grid.$columns).toBeDefined();

    var $thead = grid.$thead;
    var $tbody = grid.$tbody;

    var onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(2);
    expect(onCalls[0].object).toEqual($thead);
    expect(onCalls[0].args).toContain('click', Function);
    expect(onCalls[1].object).toEqual($tbody);
    expect(onCalls[1].args).toContain('click', Function);

    jq.on.calls.reset();
    
    expect(jq.off).not.toHaveBeenCalled();

    $thead.on.calls.reset();
    $tbody.on.calls.reset();

    grid.destroy();

    expect(grid.$table).toBeNull();
    expect(grid.$thead).toBeNull();
    expect(grid.$tbody).toBeNull();
    expect(grid.$data).toBeNull();
    expect(grid.$selection).toBeNull();
    expect(grid.$columns).toBeNull();

    expect(jq.on).not.toHaveBeenCalled();

    var offCalls = jq.off.calls.all();
    expect(offCalls).toHaveLength(2);
    expect(offCalls[0].object).toEqual($thead);
    expect(offCalls[1].object).toEqual($tbody);
  });

  describe('once initialized', function() {
    var columns, data, table, grid;

    beforeEach(function() {
      columns = [
        { id: 'id', sortable: false },
        { id: 'firstName' },
        { id: 'lastName' }
      ];

      data = [
        { id: 2, firstName: 'foo2', lastName: 'bar2' },
        { id: 1, firstName: 'foo1', lastName: 'bar1' },
        { id: 3, firstName: 'foo2', lastName: 'bar3' }
      ];

      table = document.createElement('table');
      fixtures.appendChild(table);

      grid = new Grid(table, {
        data: data,
        columns: columns
      });
    });

    it('should get data collection', function() {
      expect(grid.data()).toBe(grid.$data);
    });

    it('should get column collection', function() {
      expect(grid.columns()).toBe(grid.$columns);
    });
  });
});
