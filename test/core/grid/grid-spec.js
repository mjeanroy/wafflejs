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

  var oldDocumentMode;

  beforeEach(function() {
    jq = $.fn || $.prototype;

    // Spy ie version
    oldDocumentMode = document.documentMode;
    document.documentMode = undefined;
  });

  afterEach(function() {
    document.documentMode = oldDocumentMode;
  });

  it('should define custom options', function() {
    expect(Grid.options).toEqual(jasmine.objectContaining({
      columns: null,
      data: null,
      sortBy: null,
      async: false,
      scrollable: false,
      sortable: true,
      dnd: false,
      editable: false,
      selection: {
        enable: true,
        checkbox: true,
        multi: false
      },
      view: {
        thead: true,
        tfoot: false
      },
      size: {
        width: null,
        height: null
      },
      events: {
        onInitialized: null,
        onUpdated: null,
        onRendered: null,
        onDataSpliced: null,
        onDataUpdated: null,
        onDataChanged: null,
        onColumnsSpliced: null,
        onColumnsUpdated: null,
        onSelectionChanged: null,
        onFilterUpdated: null,
        onSorted: null,
        onAttached: null,
        onDetached: null
      }
    }));

    var key = Grid.options.key;
    expect(key).toBeDefined();

    // Key is not the same for angular wrapper or others
    if (typeof angular !== 'undefined') {
      expect(key).toBeAFunction();
    } else {
      expect(key).toBe('id');
    }
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

    var defaultOptions = jasmine.util.clone(Grid.options);

    // We should ignore these properties
    delete defaultOptions.columns;
    delete defaultOptions.data;

    expect(grid.options).toEqual(jasmine.objectContaining(defaultOptions));
  });

  it('should create grid with custom options', function() {
    var Model = function(o) {
      this.id = o.id;
    };

    var table = document.createElement('table');
    var onInitialized = jasmine.createSpy('onInitialized');
    var onDataSpliced = jasmine.createSpy('onDataSpliced');

    var grid = new Grid(table, {
      key: 'title',
      model: Model,
      async: true,
      scrollable: true,
      selection: {
        multi: false
      },
      size: {
        width: 100,
        height: 200
      },
      events: {
        onInitialized: onInitialized,
        onDataSpliced: onDataSpliced
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
      scrollable: true,
      selection: {
        enable: true,
        checkbox: true,
        multi: false
      },
      async: true,
      size: {
        width: 100,
        height: 200
      },
      events: {
        onInitialized: onInitialized,
        onUpdated: null,
        onRendered: null,
        onDataSpliced: onDataSpliced,
        onDataUpdated: null,
        onDataChanged: null,
        onColumnsSpliced: null,
        onColumnsUpdated: null,
        onSelectionChanged: null,
        onFilterUpdated: null,
        onSorted: null,
        onAttached: null,
        onDetached: null
      }
    }));
  });

  it('should create grid with custom options', function() {
    var Model = function(o) {
      this.id = o.id;
    };

    var table = document.createElement('table');
    var onInitialized = jasmine.createSpy('onInitialized');
    var onDataSpliced = jasmine.createSpy('onDataSpliced');

    var grid = new Grid(table, {
      key: 'title',
      model: Model,
      async: true,
      scrollable: true,
      selection: {
        multi: false
      },
      size: {
        width: 100,
        height: 200
      },
      events: {
        onInitialized: onInitialized,
        onDataSpliced: onDataSpliced
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
      scrollable: true,
      selection: {
        enable: true,
        checkbox: true,
        multi: false
      },
      async: true,
      size: {
        width: 100,
        height: 200
      },
      events: {
        onInitialized: onInitialized,
        onUpdated: null,
        onRendered: null,
        onDataSpliced: onDataSpliced,
        onDataUpdated: null,
        onDataChanged: null,
        onColumnsSpliced: null,
        onColumnsUpdated: null,
        onSelectionChanged: null,
        onFilterUpdated: null,
        onSorted: null,
        onAttached: null,
        onDetached: null
      }
    }));
  });

  it('should create grid without table element', function() {
    var Model = function(o) {
      this.id = o.id;
    };

    var grid = new Grid({
      key: 'title',
      model: Model,
      async: true,
      scrollable: true,
      selection: {
        multi: false
      },
      size: {
        width: 100,
        height: 200
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
      scrollable: true,
      selection: {
        enable: true,
        checkbox: true,
        multi: false
      },
      async: true,
      size: {
        width: 100,
        height: 200
      },
      events: {
        onInitialized: null,
        onUpdated: null,
        onRendered: null,
        onDataSpliced: null,
        onDataUpdated: null,
        onDataChanged: null,
        onColumnsSpliced: null,
        onColumnsUpdated: null,
        onSelectionChanged: null,
        onFilterUpdated: null,
        onSorted: null,
        onAttached: null,
        onDetached: null
      }
    }));
  });

  it('should create grid using factory', function() {
    var table = document.createElement('table');
    var grid = Grid.create(table);
    expect(grid).toBeInstanceOf(Grid);
  });

  it('should detach grid', function() {
    var table = document.createElement('table');

    var grid = new Grid(table, {
      scrollable: true,
      sortable: true,
      selection: {
        multi: false
      },
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    expect(grid).toBeDefined();
    expect(grid.$table).toBeDefined();
    expect(grid.$tbody).toBeDefined();
    expect(table.className).toContain('waffle-grid');
    expect(table.className).toContain('waffle-fixedheader');
    expect(table.className).toContain('waffle-selectable');

    spyOn(grid, 'dispatchEvent').and.callThrough();
    spyOn(grid, 'clearChanges').and.callThrough();

    spyOn(grid.$data, 'unobserve').and.callThrough();
    spyOn(grid.$columns, 'unobserve').and.callThrough();
    spyOn(grid.$selection, 'unobserve').and.callThrough();

    spyOn(GridDomBinders, 'unbindSort').and.callThrough();
    spyOn(GridDomBinders, 'unbindSelection').and.callThrough();
    spyOn(GridDomBinders, 'unbindEdition').and.callThrough();
    spyOn(GridDomBinders, 'unbindDragDrop').and.callThrough();
    spyOn(GridDomBinders, 'unbindResize').and.callThrough();

    expect(grid.$data.$$observers).not.toBeEmpty();
    expect(grid.$columns.$$observers).not.toBeEmpty();
    expect(grid.$selection.$$observers).not.toBeEmpty();

    var result = grid.detach();

    expect(result).toBe(grid);
    expect(grid.$table).toBeNull();
    expect(grid.$tbody).toBeNull();
    expect(grid.$thead).toBeNull();
    expect(grid.$tfoot).toBeNull();

    expect(table.className).not.toContain('waffle-grid');
    expect(table.className).not.toContain('waffle-fixedheader');
    expect(table.className).not.toContain('waffle-selectable');

    expect(grid.clearChanges).toHaveBeenCalled();
    expect(grid.dispatchEvent).toHaveBeenCalledWith('detached');

    expect(grid.$data.unobserve).toHaveBeenCalledWith(GridDataObserver.on, grid);
    expect(grid.$columns.unobserve).toHaveBeenCalledWith(GridColumnsObserver.on, grid);
    expect(grid.$selection.unobserve).toHaveBeenCalledWith(GridSelectionObserver.on, grid);

    expect(grid.$data.$$observers).toEqual([]);
    expect(grid.$columns.$$observers).toEqual([]);
    expect(grid.$selection.$$observers).toEqual([]);

    expect(GridDomBinders.unbindSort).toHaveBeenCalledWith(grid);
    expect(GridDomBinders.unbindSelection).toHaveBeenCalledWith(grid);
    expect(GridDomBinders.unbindEdition).toHaveBeenCalledWith(grid);
    expect(GridDomBinders.unbindDragDrop).toHaveBeenCalledWith(grid);
    expect(GridDomBinders.unbindResize).toHaveBeenCalledWith(grid);
  });

  it('should re-attach dom node', function() {
    var table1 = document.createElement('table');
    var table2 = document.createElement('table');

    var grid = new Grid(table1, {
      scrollable: true,
      sortable: true,
      dnd: true,
      view: {
        thead: true,
        tfoot: true
      },
      size: {
        width: 100,
        height: 200
      },
      selection: {
        multi: false
      },
      columns: [
        { id: 'bar', editable: true },
        { id: 'foo' }
      ]
    });

    spyOn(grid, 'dispatchEvent').and.callThrough();
    spyOn(grid, 'detach').and.callThrough();
    spyOn(grid, 'render').and.callThrough();
    spyOn(grid, 'resize').and.callThrough();
    spyOn(grid, 'clearChanges').and.callThrough();

    spyOn(grid.$data, 'observe').and.callThrough();
    spyOn(grid.$columns, 'observe').and.callThrough();
    spyOn(grid.$selection, 'observe').and.callThrough();

    spyOn(GridDomBinders, 'bindSort').and.callThrough();
    spyOn(GridDomBinders, 'bindSelection').and.callThrough();
    spyOn(GridDomBinders, 'bindEdition').and.callThrough();
    spyOn(GridDomBinders, 'bindDragDrop').and.callThrough();
    spyOn(GridDomBinders, 'bindResize').and.callThrough();

    var result = grid.attach(table2);

    expect(result).toBe(grid);
    expect(grid.$table).not.toBeNull();
    expect(grid.$table[0]).toBe(table2);
    expect(table2.className).toContain('waffle-grid');
    expect(table2.className).toContain('waffle-fixedheader');
    expect(table2.className).toContain('waffle-selectable');

    expect(grid.$tbody).not.toBeNull();
    expect(grid.$tbody[0]).toBe(table2.getElementsByTagName('tbody')[0]);

    expect(grid.$thead).not.toBeNull();
    expect(grid.$thead[0]).toBe(table2.getElementsByTagName('thead')[0]);

    expect(grid.$tfoot).not.toBeNull();
    expect(grid.$tfoot[0]).toBe(table2.getElementsByTagName('tfoot')[0]);

    expect(grid.render).toHaveBeenCalled();
    expect(grid.resize).toHaveBeenCalled();
    expect(grid.clearChanges).toHaveBeenCalled();

    expect(GridDomBinders.bindSort).toHaveBeenCalledWith(grid);
    expect(GridDomBinders.bindSelection).toHaveBeenCalledWith(grid);
    expect(GridDomBinders.bindEdition).toHaveBeenCalledWith(grid);
    expect(GridDomBinders.bindDragDrop).toHaveBeenCalledWith(grid);
    expect(GridDomBinders.bindResize).toHaveBeenCalledWith(grid);

    expect(grid.$data.observe).toHaveBeenCalledWith(GridDataObserver.on, grid);
    expect(grid.$columns.observe).toHaveBeenCalledWith(GridColumnsObserver.on, grid);
    expect(grid.$selection.observe).toHaveBeenCalledWith(GridSelectionObserver.on, grid);

    expect(grid.$data.$$observers).toHaveLength(1);
    expect(grid.$columns.$$observers).toHaveLength(1);
    expect(grid.$selection.$$observers).toHaveLength(1);

    expect(grid.dispatchEvent).toHaveBeenCalledWith('attached');
  });

  it('should initialize grid and clear changes', function() {
    spyOn(Grid.prototype, 'clearChanges');

    var columns = [
      { id: 'foo', title: 'Foo' },
      { id: 'bar', title: 'Boo' }
    ];

    var table = document.createElement('table');
    var grid = new Grid(table, {
      columns: columns
    });

    expect(grid.clearChanges).toHaveBeenCalled();
  });

  it('should create grid with columns set using html options', function() {
    var table = document.createElement('table');
    table.setAttribute('data-columns', '[{"id": "bar"}, {"id": "foo"}]');

    var grid = new Grid(table, {
      key: 'title',
    });

    expect(grid.options).toBeDefined();
    expect(grid.options.columns).toBeDefined();
    expect(grid.options.columns.length).toBe(2);

    expect(grid.$columns).toBeDefined();
    expect(grid.$columns.length).toBe(2);

    expect(grid.$columns[0]).toEqual(jasmine.objectContaining({
      id: 'bar'
    }));

    expect(grid.$columns[1]).toEqual(jasmine.objectContaining({
      id: 'foo'
    }));
  });

  it('should create grid with columns set using data-waffle html options', function() {
    var table = document.createElement('table');
    table.setAttribute('data-waffle-columns', '[{"id": "bar"}, {"id": "foo"}]');

    var grid = new Grid(table, {
      key: 'title',
    });

    expect(grid.options).toBeDefined();
    expect(grid.options.columns).toBeDefined();
    expect(grid.options.columns.length).toBe(2);

    expect(grid.$columns).toBeDefined();
    expect(grid.$columns.length).toBe(2);

    expect(grid.$columns[0]).toEqual(jasmine.objectContaining({
      id: 'bar'
    }));

    expect(grid.$columns[1]).toEqual(jasmine.objectContaining({
      id: 'foo'
    }));
  });

  it('should create grid with columns set using waffle html options', function() {
    var table = document.createElement('table');
    table.setAttribute('waffle-columns', '[{"id": "bar"}, {"id": "foo"}]');

    var grid = new Grid(table, {
      key: 'title',
    });

    expect(grid.options).toBeDefined();
    expect(grid.options.columns).toBeDefined();
    expect(grid.options.columns.length).toBe(2);

    expect(grid.$columns).toBeDefined();
    expect(grid.$columns.length).toBe(2);

    expect(grid.$columns[0]).toEqual(jasmine.objectContaining({
      id: 'bar'
    }));

    expect(grid.$columns[1]).toEqual(jasmine.objectContaining({
      id: 'foo'
    }));
  });

  it('should initialize grid and set key value using html options', function() {
    var table = document.createElement('table');
    table.setAttribute('data-key', 'title');

    var grid = new Grid(table);

    expect(grid.options).toBeDefined();
    expect(grid.options.key).toBeDefined();
    expect(grid.options.key).toBe('title');
  });

  it('should initialize grid and set scrollable value using html options', function() {
    var table = document.createElement('table');
    table.setAttribute('data-scrollable', 'true');

    var grid = new Grid(table);

    expect(grid.options).toBeDefined();
    expect(grid.options.scrollable).toBeDefined();
    expect(grid.options.scrollable).toBe(true);
  });

  it('should initialize grid and set sortable value using html options', function() {
    var table = document.createElement('table');
    table.setAttribute('data-sortable', 'false');

    var grid = new Grid(table);

    expect(grid.options).toBeDefined();
    expect(grid.options.sortable).toBeDefined();
    expect(grid.options.sortable).toBe(false);
  });

  it('should create grid with size values as numbers', function() {
    var table = document.createElement('table');
    var grid = new Grid(table, {
      size: {
        width: '100px',
        height: '200px'
      }
    });

    expect(grid.options).toEqual(jasmine.objectContaining({
      size: {
        width: '100px',
        height: '200px'
      }
    }));
  });

  it('should create selectable grid', function() {
    var table = document.createElement('table');
    var grid = new Grid(table, {
      selection: {
        multi: true
      }
    });

    expect(table.className).toContain('waffle-selectable');
  });

  it('should not create selectable grid', function() {
    var table = document.createElement('table');
    var grid = new Grid(table, {
      selection: false
    });

    expect(table.className).not.toContain('waffle-selectable');

    table = document.createElement('table');
    grid = new Grid(table, {
      selection: {
        enable: false
      }
    });

    expect(table.className).not.toContain('waffle-selectable');
  });

  it('should not create sortable grid', function() {
    var table = document.createElement('table');
    var grid = new Grid(table, {
      sortable: false,
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    expect(grid.$columns).toVerify(function(column) {
      return !column.sortable;
    });
  });

  it('should add default css to grid', function() {
    var table = document.createElement('table');
    var grid = new Grid(table, {
      size: {
        height: 300
      }
    });

    expect(table.className).toContain('waffle-grid');
  });

  it('should create scrollable grid', function() {
    var table = document.createElement('table');
    var grid = new Grid(table, {
      scrollable: true
    });

    expect(table.className).toContain('waffle-fixedheader');
  });

  it('should create draggable grid', function() {
    var table = document.createElement('table');

    var columns = [
      { id: 'id' },
      { id: 'foo' },
      { id: 'bar' }
    ];

    var grid = new Grid(table, {
      dnd: true
    });

    expect(grid.$columns).toVerify(function(column) {
      return column.draggable;
    });
  });

  it('should create scrollable grid using size', function() {
    var table = document.createElement('table');
    var grid = new Grid(table, {
      size: {
        height: 300
      }
    });

    expect(table.className).toContain('waffle-fixedheader');
  });

  it('should not override draggable flags of columns', function() {
    var table = document.createElement('table');
    var columns = [
      { id: 'id', draggable: false },
      { id: 'foo', draggable: true },
      { id: 'bar' }
    ];

    var grid = new Grid(table, {
      dnd: true,
      columns: columns
    });

    expect(grid.$columns.at(0).draggable).toBeFalse();
    expect(grid.$columns.at(1).draggable).toBeTrue();
    expect(grid.$columns.at(2).draggable).toBeTrue();
  });

  it('should not create scrollable grid', function() {
    var table = document.createElement('table');
    var grid = new Grid(table);
    expect(table.className).not.toContain('waffle-fixedheader');
  });

  it('should retrieve thead, tfoot and tbody element', function() {
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tfoot = document.createElement('tfoot');
    var tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tfoot);
    table.appendChild(tbody);

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: true,
        tfoot: true
      }
    });

    expect(grid.$table).toBeDefined();
    expect(grid.$table[0].childNodes.length).toBe(3);

    expect(grid.$thead).toBeDefined();
    expect(grid.$tfoot).toBeDefined();
    expect(grid.$tbody).toBeDefined();

    expect(grid.$tbody[0]).toBe(tbody);
    expect(grid.$thead[0]).toBe(thead);
    expect(grid.$tfoot[0]).toBe(tfoot);
  });

  it('should create thead, tfoot and tbody element', function() {
    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: true,
        tfoot: true
      }
    });

    expect(grid.$table).toBeDefined();
    expect(grid.$thead).toBeDefined();
    expect(grid.$tfoot).toBeDefined();
    expect(grid.$tbody).toBeDefined();

    expect(grid.$tbody[0]).toBeDOMElement('tbody');
    expect(grid.$thead[0]).toBeDOMElement('thead');
    expect(grid.$tfoot[0]).toBeDOMElement('tfoot');

    var childs = table.childNodes;
    expect(childs.length).toBe(3);
    expect(childs[0]).toBe(grid.$thead[0]);
    expect(childs[1]).toBe(grid.$tbody[0]);
    expect(childs[2]).toBe(grid.$tfoot[0]);
  });

  it('should create only unknown nodes', function() {
    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: true,
        tfoot: true
      }
    });

    expect(grid.$table).toBeDefined();
    expect(grid.$thead).toBeDefined();
    expect(grid.$tfoot).toBeDefined();

    expect(grid.$tbody[0]).toBeDOMElement('tbody');
    expect(grid.$thead[0]).toBeDOMElement('thead');
    expect(grid.$tfoot[0]).toBeDOMElement('tfoot');

    var childs = table.childNodes;
    expect(childs.length).toBe(3);
    expect(childs[0]).toBe(grid.$thead[0]);
    expect(childs[1]).toBe(grid.$tbody[0]);
    expect(childs[2]).toBe(grid.$tfoot[0]);
  });

  it('should create grid with fixed size', function() {
    var table = document.createElement('table');
    var grid = new Grid(table, {
      columns: [
        { id: 'id' },
        { id: 'foo' }
      ],
      size: {
        width: '100px',
        height: '200px'
      }
    });

    expect(grid.options).toEqual(jasmine.objectContaining({
      size: {
        width: '100px',
        height: '200px'
      }
    }));

    expect(grid.$columns[0].computedWidth).toBeANumber();
    expect(grid.$columns[1].computedWidth).toBeANumber();

    var w1 = grid.$columns[0].computedWidth + 'px';
    var w2 = grid.$columns[1].computedWidth + 'px';
    expect(w1).toBe(w2);

    var theads = grid.$thead[0].childNodes[0].childNodes;
    expect(theads[1].style.maxWidth).toBe(w1);
    expect(theads[1].style.minWidth).toBe(w1);
    expect(theads[1].style.width).toBe(w1);

    expect(theads[2].style.maxWidth).toBe(w2);
    expect(theads[2].style.minWidth).toBe(w2);
    expect(theads[2].style.width).toBe(w2);
  });

  it('should create grid with fixed size and compute size with functions', function() {
    var width = jasmine.createSpy('width').and.returnValue('100px');
    var height = jasmine.createSpy('height').and.returnValue('200px');

    var table = document.createElement('table');
    var grid = new Grid(table, {
      columns: [
        { id: 'id' },
        { id: 'foo' }
      ],
      size: {
        width: width,
        height: height
      }
    });

    expect(grid.options).toEqual(jasmine.objectContaining({
      size: {
        width: width,
        height: height
      }
    }));

    expect(grid.$columns[0].computedWidth).toBeANumber();
    expect(grid.$columns[1].computedWidth).toBeANumber();

    var w1 = grid.$columns[0].computedWidth + 'px';
    var w2 = grid.$columns[0].computedWidth + 'px';
    expect(w1).toBe(w2);

    var theads = grid.$thead[0].childNodes[0].childNodes;
    expect(theads[1].style.maxWidth).toBe(w1);
    expect(theads[1].style.minWidth).toBe(w1);
    expect(theads[1].style.width).toBe(w1);

    expect(theads[2].style.maxWidth).toBe(w2);
    expect(theads[2].style.minWidth).toBe(w2);
    expect(theads[2].style.width).toBe(w2);

    expect(width).toHaveBeenCalled();
    expect(height).toHaveBeenCalled();
  });

  it('should create grid with fixed size with percentages', function() {
    var width = jasmine.createSpy('width').and.returnValue('100px');
    var height = jasmine.createSpy('height').and.returnValue('200px');

    var table = document.createElement('table');
    var grid = new Grid(table, {
      columns: [
        { id: 'id', width: '20%' },
        { id: 'foo', width: 'auto' }
      ],
      size: {
        width: width,
        height: height
      }
    });

    expect(grid.options).toEqual(jasmine.objectContaining({
      size: {
        width: width,
        height: height
      }
    }));

    expect(grid.$columns[0].computedWidth).toBeANumber();
    expect(grid.$columns[1].computedWidth).toBeANumber();

    var w1 = grid.$columns[0].computedWidth + 'px';
    var w2 = grid.$columns[1].computedWidth + 'px';
    expect(w1).not.toBe(w2);

    var theads = grid.$thead[0].childNodes[0].childNodes;
    expect(theads[1].style.maxWidth).toBe(w1);
    expect(theads[1].style.minWidth).toBe(w1);
    expect(theads[1].style.width).toBe(w1);

    expect(theads[2].style.maxWidth).toBe(w2);
    expect(theads[2].style.minWidth).toBe(w2);
    expect(theads[2].style.width).toBe(w2);

    expect(width).toHaveBeenCalled();
    expect(height).toHaveBeenCalled();
  });

  it('should create and destroy resizable grid', function() {
    spyOn(jq, 'on').and.callThrough();
    spyOn(jq, 'off').and.callThrough();

    var table = document.createElement('table');
    var grid = new Grid(table, {
      size: {
        width: 100,
        height: 200
      },
      view: {
        thead: true,
        tfoot: true
      }
    });

    spyOn(GridDomBinders, 'unbindResize').and.callThrough();

    expect(grid.$window).toBeDefined();

    var $window = grid.$window;

    grid.destroy();

    expect(GridDomBinders.unbindResize).toHaveBeenCalledWith(grid);
    expect($window.off).toHaveBeenCalledWith('resize', jasmine.any(Function));
    expect(grid.$window).toBeNull();
  });

  it('should bind click on header and body when grid is initialized', function() {
    spyOn(jq, 'on').and.callThrough();

    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: true,
        tfoot: true
      }
    });

    var onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(3);
    expect(onCalls[0].args).toContain('click', Function);
    expect(onCalls[1].args).toContain('click', Function);
    expect(onCalls[2].args).toContain('click', Function);
  });

  it('should bind input on body when grid is initialized if grid is editable and input event is available', function() {
    spyOn(jq, 'on').and.callThrough();
    spyOn($sniffer, 'hasEvent').and.returnValue(true);

    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo', editable: true },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: true,
        tfoot: true
      }
    });

    var onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(4);
    expect(onCalls[0].args).toContain('click', Function);
    expect(onCalls[1].args).toContain('click', Function);
    expect(onCalls[2].args).toContain('input change', Function);
    expect(onCalls[3].args).toContain('click', Function);
  });

  it('should bind input on body when grid is initialized if grid option is editable', function() {
    spyOn(jq, 'on').and.callThrough();
    spyOn($sniffer, 'hasEvent').and.returnValue(true);

    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      editable: true,
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: true,
        tfoot: true
      }
    });

    var onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(4);
    expect(onCalls[0].args).toContain('click', Function);
    expect(onCalls[1].args).toContain('click', Function);
    expect(onCalls[2].args).toContain('input change', Function);
    expect(onCalls[3].args).toContain('click', Function);
  });

  it('should bind keyup and change events on body when grid is initialized if grid is editable and input event is not available', function() {
    spyOn(jq, 'on').and.callThrough();
    spyOn($sniffer, 'hasEvent').and.returnValue(false);

    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo', editable: true },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: true,
        tfoot: true
      }
    });

    expect(grid.$$events).toEqual({
      onClickThead: jasmine.any(Function),
      onClickTfoot: jasmine.any(Function),
      onClickTbody: jasmine.any(Function),
      onInputTbody: jasmine.any(Function)
    });

    var onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(4);
    expect(onCalls[0].args).toContain('click', grid.$$events.onClickThead);
    expect(onCalls[1].args).toContain('click', grid.$$events.onClickTfoot);
    expect(onCalls[2].args).toContain('keyup change', grid.$$events.onInputTbody);
    expect(onCalls[3].args).toContain('click', grid.$$events.onClickTbody);
  });

  it('should bind click on header and footer if grid is not selectable and not sortable', function() {
    spyOn(jq, 'on').and.callThrough();

    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      selection: false,
      sortable: false,
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: true,
        tfoot: true
      }
    });

    expect(jq.on).not.toHaveBeenCalled();
  });

  it('should bind click on header and footer only if grid is not selectable', function() {
    spyOn(jq, 'on').and.callThrough();

    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      selection: false,
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: true,
        tfoot: true
      }
    });

    expect(grid.$$events).toEqual({
      onClickThead: jasmine.any(Function),
      onClickTfoot: jasmine.any(Function)
    });

    var onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(2);
    expect(onCalls[0].args).toContain('click', grid.$$events.onClickThead);
    expect(onCalls[1].args).toContain('click', grid.$$events.onClickTfoot);
  });

  it('should bind drag & drop events', function() {
    spyOn(jq, 'on').and.callThrough();

    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      selection: false,
      sortable: false,
      dnd: true,
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: true,
        tfoot: true
      }
    });

    expect(grid.$$events).toEqual({
      onDragStart: jasmine.any(Function),
      onDragOver: jasmine.any(Function),
      onDragEnd: jasmine.any(Function),
      onDragLeave: jasmine.any(Function),
      onDragEnter: jasmine.any(Function),
      onDragDrop: jasmine.any(Function)
    });

    var onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(6);

    expect(onCalls[0].args).toContain('dragstart', grid.$$events.onDragStart);
    expect(onCalls[1].args).toContain('dragover', grid.$$events.onDragOver);
    expect(onCalls[2].args).toContain('dragend', grid.$$events.onDragEnd);
    expect(onCalls[3].args).toContain('dragleave', grid.$$events.onDragLeave);
    expect(onCalls[4].args).toContain('dragenter', grid.$$events.onDragEnter);
    expect(onCalls[5].args).toContain('drop', grid.$$events.onDragDrop);
  });

  it('should bind drag & drop workaround event for IE <= 9', function() {
    spyOn(jq, 'on').and.callThrough();

    // Spy IE9
    document.documentMode = 9;

    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      selection: false,
      sortable: false,
      dnd: true,
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: true,
        tfoot: true
      }
    });

    expect(grid.$$events).toEqual({
      onDragStart: jasmine.any(Function),
      onDragOver: jasmine.any(Function),
      onDragEnd: jasmine.any(Function),
      onDragLeave: jasmine.any(Function),
      onDragEnter: jasmine.any(Function),
      onDragDrop: jasmine.any(Function),
      onSelectStart: jasmine.any(Function)
    });

    var onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(7);

    expect(onCalls[0].args).toContain('dragstart', grid.$$events.onDragStart);
    expect(onCalls[1].args).toContain('dragover', grid.$$events.onDragOver);
    expect(onCalls[2].args).toContain('dragend', grid.$$events.onDragEnd);
    expect(onCalls[3].args).toContain('dragleave', grid.$$events.onDragLeave);
    expect(onCalls[4].args).toContain('dragenter', grid.$$events.onDragEnter);
    expect(onCalls[5].args).toContain('drop', grid.$$events.onDragDrop);
    expect(onCalls[6].args).toContain('selectstart', grid.$$events.onSelectStart);
  });

  it('should destroy grid', function() {
    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: true,
        tfoot: true
      }
    });

    expect(grid.$table).toBeDefined();
    expect(grid.$thead).toBeDefined();
    expect(grid.$tbody).toBeDefined();
    expect(grid.$data).toBeDefined();
    expect(grid.$selection).toBeDefined();
    expect(grid.$columns).toBeDefined();

    var $data = grid.$data;
    var $selection = grid.$selection;

    spyOn($data, 'unobserve').and.callThrough();
    spyOn($selection, 'unobserve').and.callThrough();

    grid.destroy();

    expect(grid.$table).toBeNull();
    expect(grid.$thead).toBeNull();
    expect(grid.$tbody).toBeNull();
    expect(grid.$data).toBeNull();
    expect(grid.$selection).toBeNull();
    expect(grid.$columns).toBeNull();

    expect($data.unobserve).toHaveBeenCalled();
    expect($selection.unobserve).toHaveBeenCalled();
  });

  it('should destroy without footer', function() {
    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: true,
        tfoot: false
      }
    });

    expect(grid.$tfoot).not.toBeDefined();

    grid.destroy();

    expect(grid.$tfoot).toBeNull();
  });

  it('should destroy without header', function() {
    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: false,
        tfoot: true
      }
    });

    expect(grid.$thead).not.toBeDefined();

    grid.destroy();

    expect(grid.$thead).toBeNull();
  });

  it('should unobserve collections when grid is destroyed', function() {
    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    var $data = grid.$data;
    var $selection = grid.$selection;

    spyOn($data, 'unobserve').and.callThrough();
    spyOn($selection, 'unobserve').and.callThrough();

    grid.destroy();

    expect($data.unobserve).toHaveBeenCalled();
    expect($selection.unobserve).toHaveBeenCalled();
  });

  it('should clear event bus when grid is destroyed', function() {
    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    var $bus = grid.$bus;

    spyOn($bus, 'clear').and.callThrough();

    grid.destroy();

    expect($bus.clear).toHaveBeenCalled();
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
      ],
      view: {
        thead: true,
        tfoot: true
      }
    });

    expect(grid.$table).toBeDefined();
    expect(grid.$thead).toBeDefined();
    expect(grid.$tbody).toBeDefined();
    expect(grid.$data).toBeDefined();
    expect(grid.$selection).toBeDefined();
    expect(grid.$columns).toBeDefined();

    var $table = grid.$table;
    var $thead = grid.$thead;
    var $tbody = grid.$tbody;
    var $tfoot = grid.$tfoot;

    spyOn(GridDomBinders, 'unbindSort');
    spyOn(GridDomBinders, 'unbindEdition');
    spyOn(GridDomBinders, 'unbindSelection');
    spyOn(GridDomBinders, 'unbindResize');
    spyOn(GridDomBinders, 'unbindDragDrop');

    grid.destroy();

    expect(grid.$table).toBeNull();
    expect(grid.$thead).toBeNull();
    expect(grid.$tbody).toBeNull();
    expect(grid.$data).toBeNull();
    expect(grid.$selection).toBeNull();
    expect(grid.$columns).toBeNull();

    expect(GridDomBinders.unbindSort).toHaveBeenCalledWith(grid);
    expect(GridDomBinders.unbindEdition).toHaveBeenCalledWith(grid);
    expect(GridDomBinders.unbindSelection).toHaveBeenCalledWith(grid);
    expect(GridDomBinders.unbindResize).toHaveBeenCalledWith(grid);
    expect(GridDomBinders.unbindDragDrop).toHaveBeenCalledWith(grid);
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

    it('should get rows', function() {
      var rows = grid.rows();

      var expectedRows = [];
      var tbody = grid.$tbody[0];
      var childNodes = tbody.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        expectedRows.push(childNodes[i]);
      }

      expect(rows).toEqual(rows);
    });

    it('should get data collection', function() {
      expect(grid.data()).toBe(grid.$data);
    });

    it('should get selection collection', function() {
      expect(grid.selection()).toBe(grid.$selection);
    });

    it('should get column collection', function() {
      expect(grid.columns()).toBe(grid.$columns);
    });

    it('should resize grid', function() {
      spyOn(GridResizer, 'resize');
      grid.resize();
      expect(GridResizer.resize).toHaveBeenCalled();
    });

    it('should clear changes', function() {
      spyOn(grid.$data, 'clearChanges');
      spyOn(grid.$columns, 'clearChanges');
      spyOn(grid.$selection, 'clearChanges');

      grid.clearChanges();

      expect(grid.$data.clearChanges).toHaveBeenCalled();
      expect(grid.$columns.clearChanges).toHaveBeenCalled();
      expect(grid.$selection.clearChanges).toHaveBeenCalled();
    });

    it('should clear changes without selection', function() {
      spyOn(grid.$data, 'clearChanges');
      spyOn(grid.$columns, 'clearChanges');

      grid.$selection = undefined;

      grid.clearChanges();

      expect(grid.$data.clearChanges).toHaveBeenCalled();
      expect(grid.$columns.clearChanges).toHaveBeenCalled();
    });

    it('should render grid', function() {
      spyOn(grid, 'renderHeader').and.callThrough();
      spyOn(grid, 'renderFooter').and.callThrough();
      spyOn(grid, 'renderBody').and.callThrough();
      spyOn(grid, 'clearChanges').and.callThrough();

      var result = grid.render();

      expect(result).toBe(grid);
      expect(grid.renderHeader).toHaveBeenCalled();
      expect(grid.renderFooter).toHaveBeenCalled();
      expect(grid.renderBody).toHaveBeenCalled();
      expect(grid.clearChanges).toHaveBeenCalled();
    });

    it('should render grid asynchronously', function() {
      spyOn(grid, 'renderHeader').and.callThrough();
      spyOn(grid, 'renderFooter').and.callThrough();
      spyOn(grid, 'renderBody').and.callThrough();
      spyOn(grid, 'clearChanges').and.callThrough();

      var result = grid.render(true);

      expect(result).toBe(grid);
      expect(grid.renderHeader).toHaveBeenCalled();
      expect(grid.renderFooter).toHaveBeenCalled();
      expect(grid.renderBody).toHaveBeenCalledWith(true);
      expect(grid.clearChanges).toHaveBeenCalled();
    });

    it('should check if data is selectable', function() {
      var data1 = {
        id: 1
      };

      var data2 = {
        id: 2
      };

      var fn = jasmine.createSpy('fn').and.callFake(function(data) {
        return data.id === 1;
      });

      grid.options.selection = false;

      expect(grid.isSelectable(data1)).toBe(false);
      expect(grid.isSelectable(data2)).toBe(false);

      grid.options.selection = {
        enable: false
      };

      expect(grid.isSelectable(data1)).toBe(false);
      expect(grid.isSelectable(data2)).toBe(false);

      grid.options.selection = {
        enable: fn
      };

      expect(grid.isSelectable(data1)).toBe(true);
      expect(grid.isSelectable(data2)).toBe(false);
    });

    it('should check if grid is editable', function() {
      grid.options.editable = true;
      grid.$columns.forEach(function(column) {
        column.editable = false;
      });

      expect(grid.isEditable()).toBe(true);

      grid.options.editable = false;
      grid.$columns.forEach(function(column) {
        column.editable = {
          enable: true,
          type: 'text',
          css: null
        };
      });

      expect(grid.isEditable()).toBe(true);

      grid.options.editable = false;
      grid.$columns.forEach(function(column) {
        column.editable = false;
      });

      expect(grid.isEditable()).toBe(false);
    });
  });
});
