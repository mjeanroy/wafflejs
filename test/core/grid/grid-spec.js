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

describe('Grid', () => {

  let jq, oldDocumentMode;

  beforeEach(() => {
    jq = $.fn || $.prototype;

    // Spy ie version
    oldDocumentMode = document.documentMode;
    document.documentMode = undefined;
  });

  afterEach(() =>  document.documentMode = oldDocumentMode);

  it('should define custom options', () => {
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

    const key = Grid.options.key;
    expect(key).toBeDefined();

    // Key is not the same for angular wrapper or others
    if (typeof angular !== 'undefined') {
      expect(key).toBeAFunction();
    } else {
      expect(key).toBe('id');
    }
  });

  it('should create grid using default options', () => {
    const columns = [
      { id: 'foo', title: 'Foo' },
      { id: 'bar', title: 'Boo' }
    ];

    const table = document.createElement('table');
    const grid = new Grid(table, {
      columns: columns
    });

    expect(grid.options).toBeDefined();
    expect(grid.options).not.toBe(Grid.options);

    const defaultOptions = jasmine.util.clone(Grid.options);

    // We should ignore these properties
    delete defaultOptions.columns;
    delete defaultOptions.data;

    expect(grid.options).toEqual(jasmine.objectContaining(defaultOptions));
  });

  it('should create grid with custom options', () => {
    class Model {
      constructor(o) {
        this.id = o.id;
      }
    }

    const table = document.createElement('table');
    const onInitialized = jasmine.createSpy('onInitialized');
    const onDataSpliced = jasmine.createSpy('onDataSpliced');

    const grid = new Grid(table, {
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

  it('should create grid with custom options', () => {
    class Model {
      constructor(o) {
        this.id = o.id;
      }
    }

    const table = document.createElement('table');
    const onInitialized = jasmine.createSpy('onInitialized');
    const onDataSpliced = jasmine.createSpy('onDataSpliced');

    const grid = new Grid(table, {
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

  it('should create grid without table element', () => {
    class Model {
      constructor(o) {
        this.id = o.id;
      }
    }

    const grid = new Grid({
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

  it('should create grid using factory', () => {
    const table = document.createElement('table');
    const grid = Grid.create(table);
    expect(grid).toBeInstanceOf(Grid);
  });

  it('should detach grid', () => {
    const table = document.createElement('table');

    const grid = new Grid(table, {
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

    const result = grid.detach();

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

  it('should re-attach dom node', () => {
    const table1 = document.createElement('table');
    const table2 = document.createElement('table');

    const grid = new Grid(table1, {
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

    const result = grid.attach(table2);

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

  it('should initialize grid and clear changes', () => {
    spyOn(Grid.prototype, 'clearChanges');

    const columns = [
      { id: 'foo', title: 'Foo' },
      { id: 'bar', title: 'Boo' }
    ];

    const table = document.createElement('table');
    const grid = new Grid(table, {
      columns: columns
    });

    expect(grid.clearChanges).toHaveBeenCalled();
  });

  it('should create grid with columns set using html options', () => {
    const table = document.createElement('table');
    table.setAttribute('data-columns', '[{"id": "bar"}, {"id": "foo"}]');

    const grid = new Grid(table, {
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

  it('should create grid with columns set using data-waffle html options', () => {
    const table = document.createElement('table');
    table.setAttribute('data-waffle-columns', '[{"id": "bar"}, {"id": "foo"}]');

    const grid = new Grid(table, {
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

  it('should create grid with columns set using waffle html options', () => {
    const table = document.createElement('table');
    table.setAttribute('waffle-columns', '[{"id": "bar"}, {"id": "foo"}]');

    const grid = new Grid(table, {
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

  it('should initialize grid and set key value using html options', () => {
    const table = document.createElement('table');
    table.setAttribute('data-key', 'title');

    const grid = new Grid(table);

    expect(grid.options).toBeDefined();
    expect(grid.options.key).toBeDefined();
    expect(grid.options.key).toBe('title');
  });

  it('should initialize grid and set scrollable value using html options', () => {
    const table = document.createElement('table');
    table.setAttribute('data-scrollable', 'true');

    const grid = new Grid(table);

    expect(grid.options).toBeDefined();
    expect(grid.options.scrollable).toBeDefined();
    expect(grid.options.scrollable).toBe(true);
  });

  it('should initialize grid and set sortable value using html options', () => {
    const table = document.createElement('table');
    table.setAttribute('data-sortable', 'false');

    const grid = new Grid(table);

    expect(grid.options).toBeDefined();
    expect(grid.options.sortable).toBeDefined();
    expect(grid.options.sortable).toBe(false);
  });

  it('should create grid with size values as numbers', () => {
    const table = document.createElement('table');
    const grid = new Grid(table, {
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

  it('should create selectable grid', () => {
    const table = document.createElement('table');
    const grid = new Grid(table, {
      selection: {
        multi: true
      }
    });

    expect(table.className).toContain('waffle-selectable');
  });

  it('should not create selectable grid', () => {
    const table1 = document.createElement('table');
    const grid1 = new Grid(table1, {
      selection: false
    });

    expect(table1.className).not.toContain('waffle-selectable');

    const table2 = document.createElement('table');
    const grid2 = new Grid(table2, {
      selection: {
        enable: false
      }
    });

    expect(table2.className).not.toContain('waffle-selectable');
  });

  it('should not create sortable grid', () => {
    const table = document.createElement('table');
    const grid = new Grid(table, {
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

  it('should add default css to grid', () => {
    const table = document.createElement('table');
    const grid = new Grid(table, {
      size: {
        height: 300
      }
    });

    expect(table.className).toContain('waffle-grid');
  });

  it('should create scrollable grid', () => {
    const table = document.createElement('table');
    const grid = new Grid(table, {
      scrollable: true
    });

    expect(table.className).toContain('waffle-fixedheader');
  });

  it('should create draggable grid', () => {
    const table = document.createElement('table');

    const columns = [
      { id: 'id' },
      { id: 'foo' },
      { id: 'bar' }
    ];

    const grid = new Grid(table, {
      dnd: true
    });

    expect(grid.$columns).toVerify(function(column) {
      return column.draggable;
    });
  });

  it('should create scrollable grid using size', () => {
    const table = document.createElement('table');
    const grid = new Grid(table, {
      size: {
        height: 300
      }
    });

    expect(table.className).toContain('waffle-fixedheader');
  });

  it('should not override draggable flags of columns', () => {
    const table = document.createElement('table');
    const columns = [
      { id: 'id', draggable: false },
      { id: 'foo', draggable: true },
      { id: 'bar' }
    ];

    const grid = new Grid(table, {
      dnd: true,
      columns: columns
    });

    expect(grid.$columns.at(0).draggable).toBeFalse();
    expect(grid.$columns.at(1).draggable).toBeTrue();
    expect(grid.$columns.at(2).draggable).toBeTrue();
  });

  it('should not create scrollable grid', () => {
    const table = document.createElement('table');
    const grid = new Grid(table);
    expect(table.className).not.toContain('waffle-fixedheader');
  });

  it('should retrieve thead, tfoot and tbody element', () => {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tfoot = document.createElement('tfoot');
    const tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tfoot);
    table.appendChild(tbody);

    const grid = new Grid(table, {
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

  it('should create thead, tfoot and tbody element', () => {
    const table = document.createElement('table');

    const grid = new Grid(table, {
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

    const childs = table.childNodes;
    expect(childs.length).toBe(3);
    expect(childs[0]).toBe(grid.$thead[0]);
    expect(childs[1]).toBe(grid.$tbody[0]);
    expect(childs[2]).toBe(grid.$tfoot[0]);
  });

  it('should create only unknown nodes', () => {
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    const grid = new Grid(table, {
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

    const childs = table.childNodes;
    expect(childs.length).toBe(3);
    expect(childs[0]).toBe(grid.$thead[0]);
    expect(childs[1]).toBe(grid.$tbody[0]);
    expect(childs[2]).toBe(grid.$tfoot[0]);
  });

  it('should create grid with fixed size', () => {
    const table = document.createElement('table');
    const grid = new Grid(table, {
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

    const w1 = grid.$columns[0].computedWidth + 'px';
    const w2 = grid.$columns[1].computedWidth + 'px';
    expect(w1).toBe(w2);

    const theads = grid.$thead[0].childNodes[0].childNodes;
    expect(theads[1].style.maxWidth).toBe(w1);
    expect(theads[1].style.minWidth).toBe(w1);
    expect(theads[1].style.width).toBe(w1);

    expect(theads[2].style.maxWidth).toBe(w2);
    expect(theads[2].style.minWidth).toBe(w2);
    expect(theads[2].style.width).toBe(w2);
  });

  it('should create grid with fixed size and compute size with functions', () => {
    const width = jasmine.createSpy('width').and.returnValue('100px');
    const height = jasmine.createSpy('height').and.returnValue('200px');

    const table = document.createElement('table');
    const grid = new Grid(table, {
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

    const w1 = grid.$columns[0].computedWidth + 'px';
    const w2 = grid.$columns[0].computedWidth + 'px';
    expect(w1).toBe(w2);

    const theads = grid.$thead[0].childNodes[0].childNodes;
    expect(theads[1].style.maxWidth).toBe(w1);
    expect(theads[1].style.minWidth).toBe(w1);
    expect(theads[1].style.width).toBe(w1);

    expect(theads[2].style.maxWidth).toBe(w2);
    expect(theads[2].style.minWidth).toBe(w2);
    expect(theads[2].style.width).toBe(w2);

    expect(width).toHaveBeenCalled();
    expect(height).toHaveBeenCalled();
  });

  it('should create grid with fixed size with percentages', () => {
    const width = jasmine.createSpy('width').and.returnValue('100px');
    const height = jasmine.createSpy('height').and.returnValue('200px');

    const table = document.createElement('table');
    const grid = new Grid(table, {
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

    const w1 = grid.$columns[0].computedWidth + 'px';
    const w2 = grid.$columns[1].computedWidth + 'px';
    expect(w1).not.toBe(w2);

    const theads = grid.$thead[0].childNodes[0].childNodes;
    expect(theads[1].style.maxWidth).toBe(w1);
    expect(theads[1].style.minWidth).toBe(w1);
    expect(theads[1].style.width).toBe(w1);

    expect(theads[2].style.maxWidth).toBe(w2);
    expect(theads[2].style.minWidth).toBe(w2);
    expect(theads[2].style.width).toBe(w2);

    expect(width).toHaveBeenCalled();
    expect(height).toHaveBeenCalled();
  });

  it('should create and destroy resizable grid', () => {
    spyOn(jq, 'on').and.callThrough();
    spyOn(jq, 'off').and.callThrough();

    const table = document.createElement('table');
    const grid = new Grid(table, {
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

    const $window = grid.$window;

    grid.destroy();

    expect(GridDomBinders.unbindResize).toHaveBeenCalledWith(grid);
    expect($window.off).toHaveBeenCalledWith('resize', jasmine.any(Function));
    expect(grid.$window).toBeNull();
  });

  it('should bind click on header and body when grid is initialized', () => {
    spyOn(jq, 'on').and.callThrough();

    const table = document.createElement('table');

    const grid = new Grid(table, {
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

    const onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(3);
    expect(onCalls[0].args).toContain('click', Function);
    expect(onCalls[1].args).toContain('click', Function);
    expect(onCalls[2].args).toContain('click', Function);
  });

  it('should bind input on body when grid is initialized if grid is editable and input event is available', () => {
    spyOn(jq, 'on').and.callThrough();
    spyOn($sniffer, 'hasEvent').and.returnValue(true);

    const table = document.createElement('table');

    const grid = new Grid(table, {
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

    const onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(4);
    expect(onCalls[0].args).toContain('click', Function);
    expect(onCalls[1].args).toContain('click', Function);
    expect(onCalls[2].args).toContain('input change', Function);
    expect(onCalls[3].args).toContain('click', Function);
  });

  it('should bind input on body when grid is initialized if grid option is editable', () => {
    spyOn(jq, 'on').and.callThrough();
    spyOn($sniffer, 'hasEvent').and.returnValue(true);

    const table = document.createElement('table');

    const grid = new Grid(table, {
      data: [],
      editable: true,
      columns: [
        { id: 'foo', title: 'Foo', editable: true },
        { id: 'bar', title: 'Boo' }
      ],
      view: {
        thead: true,
        tfoot: true
      }
    });

    const onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(4);
    expect(onCalls[0].args).toContain('click', Function);
    expect(onCalls[1].args).toContain('click', Function);
    expect(onCalls[2].args).toContain('input change', Function);
    expect(onCalls[3].args).toContain('click', Function);
  });

  it('should bind keyup and change events on body when grid is initialized if grid is editable and input event is not available', () => {
    spyOn(jq, 'on').and.callThrough();
    spyOn($sniffer, 'hasEvent').and.returnValue(false);

    const table = document.createElement('table');

    const grid = new Grid(table, {
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
      onClickThead: {
        events: 'click',
        handler: jasmine.any(Function)
      },
      onClickTfoot: {
        events: 'click',
        handler: jasmine.any(Function)
      },
      onClickTbody: {
        events: 'click',
        handler: jasmine.any(Function)
      },
      onInputTbody: {
        events: 'keyup change',
        handler: jasmine.any(Function)
      }
    });

    const onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(4);
    expect(onCalls[0].args).toContain('click', grid.$$events.onClickThead);
    expect(onCalls[1].args).toContain('click', grid.$$events.onClickTfoot);
    expect(onCalls[2].args).toContain('keyup change', grid.$$events.onInputTbody);
    expect(onCalls[3].args).toContain('click', grid.$$events.onClickTbody);
  });

  it('should bind click on header and footer if grid is not selectable and not sortable', () => {
    spyOn(jq, 'on').and.callThrough();

    const table = document.createElement('table');

    const grid = new Grid(table, {
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

  it('should bind click on header and footer only if grid is not selectable', () => {
    spyOn(jq, 'on').and.callThrough();

    const table = document.createElement('table');

    const grid = new Grid(table, {
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
      onClickThead: {
        events: 'click',
        handler: jasmine.any(Function)
      },
      onClickTfoot: {
        events: 'click',
        handler: jasmine.any(Function)
      }
    });

    const onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(2);
    expect(onCalls[0].args).toContain('click', grid.$$events.onClickThead);
    expect(onCalls[1].args).toContain('click', grid.$$events.onClickTfoot);
  });

  it('should bind drag & drop events', () => {
    spyOn(jq, 'on').and.callThrough();

    const table = document.createElement('table');

    const grid = new Grid(table, {
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
      onDragStart: {
        events: 'dragstart',
        handler: jasmine.any(Function)
      },
      onDragOver: {
        events: 'dragover',
        handler: jasmine.any(Function)
      },
      onDragEnd: {
        events: 'dragend',
        handler: jasmine.any(Function)
      },
      onDragLeave: {
        events: 'dragleave',
        handler: jasmine.any(Function)
      },
      onDragEnter: {
        events: 'dragenter',
        handler: jasmine.any(Function)
      },
      onDragDrop: {
        events: 'drop',
        handler: jasmine.any(Function)
      }
    });

    const onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(6);

    expect(onCalls[0].args).toContain('dragstart', grid.$$events.onDragStart);
    expect(onCalls[1].args).toContain('dragover', grid.$$events.onDragOver);
    expect(onCalls[2].args).toContain('dragend', grid.$$events.onDragEnd);
    expect(onCalls[3].args).toContain('dragleave', grid.$$events.onDragLeave);
    expect(onCalls[4].args).toContain('dragenter', grid.$$events.onDragEnter);
    expect(onCalls[5].args).toContain('drop', grid.$$events.onDragDrop);
  });

  it('should bind drag & drop workaround event for IE <= 9', () => {
    spyOn(jq, 'on').and.callThrough();

    // Spy IE9
    document.documentMode = 9;

    const table = document.createElement('table');

    const grid = new Grid(table, {
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
      onDragStart: {
        events: 'dragstart',
        handler: jasmine.any(Function)
      },
      onDragOver: {
        events: 'dragover',
        handler: jasmine.any(Function)
      },
      onDragEnd: {
        events: 'dragend',
        handler: jasmine.any(Function)
      },
      onDragLeave: {
        events: 'dragleave',
        handler: jasmine.any(Function)
      },
      onDragEnter: {
        events: 'dragenter',
        handler: jasmine.any(Function)
      },
      onDragDrop: {
        events: 'drop',
        handler: jasmine.any(Function)
      },
      onSelectStart: {
        events: 'selectstart',
        handler: jasmine.any(Function)
      }
    });

    const onCalls = jq.on.calls.all();
    expect(onCalls).toHaveLength(7);

    expect(onCalls[0].args).toContain('dragstart', grid.$$events.onDragStart);
    expect(onCalls[1].args).toContain('dragover', grid.$$events.onDragOver);
    expect(onCalls[2].args).toContain('dragend', grid.$$events.onDragEnd);
    expect(onCalls[3].args).toContain('dragleave', grid.$$events.onDragLeave);
    expect(onCalls[4].args).toContain('dragenter', grid.$$events.onDragEnter);
    expect(onCalls[5].args).toContain('drop', grid.$$events.onDragDrop);
    expect(onCalls[6].args).toContain('selectstart', grid.$$events.onSelectStart);
  });

  it('should destroy grid', () => {
    const table = document.createElement('table');

    const grid = new Grid(table, {
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

    const $data = grid.$data;
    const $selection = grid.$selection;

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

  it('should destroy without footer', () => {
    const table = document.createElement('table');

    const grid = new Grid(table, {
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

  it('should destroy without header', () => {
    const table = document.createElement('table');

    const grid = new Grid(table, {
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

  it('should unobserve collections when grid is destroyed', () => {
    const table = document.createElement('table');

    const grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    const $data = grid.$data;
    const $selection = grid.$selection;

    spyOn($data, 'unobserve').and.callThrough();
    spyOn($selection, 'unobserve').and.callThrough();

    grid.destroy();

    expect($data.unobserve).toHaveBeenCalled();
    expect($selection.unobserve).toHaveBeenCalled();
  });

  it('should clear event bus when grid is destroyed', () => {
    const table = document.createElement('table');

    const grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    const $bus = grid.$bus;

    spyOn($bus, 'clear').and.callThrough();

    grid.destroy();

    expect($bus.clear).toHaveBeenCalled();
  });

  it('should unbind events when grid is destroyed', () => {
    spyOn(jq, 'on').and.callThrough();
    spyOn(jq, 'off').and.callThrough();

    const table = document.createElement('table');

    const grid = new Grid(table, {
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

    const $table = grid.$table;
    const $thead = grid.$thead;
    const $tbody = grid.$tbody;
    const $tfoot = grid.$tfoot;

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

  describe('once initialized', () => {
    let columns, data, table, grid;

    beforeEach(() => {
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

    it('should get rows', () => {
      const rows = grid.rows();

      const expectedRows = [];
      const tbody = grid.$tbody[0];
      const childNodes = tbody.childNodes;
      for (let i = 0; i < childNodes.length; i++) {
        expectedRows.push(childNodes[i]);
      }

      expect(rows).toEqual(rows);
    });

    it('should get data collection', () => {
      expect(grid.data()).toBe(grid.$data);
    });

    it('should get selection collection', () => {
      expect(grid.selection()).toBe(grid.$selection);
    });

    it('should get column collection', () => {
      expect(grid.columns()).toBe(grid.$columns);
    });

    it('should get css classes', () => {
      spyOn(grid, 'isSelectable').and.returnValue(false);
      spyOn(grid, 'isScrollable').and.returnValue(false);
      expect(grid.cssClasses()).toEqual(['waffle-grid']);

      grid.isSelectable.and.returnValue(true);
      expect(grid.cssClasses()).toEqual(['waffle-grid', 'waffle-selectable']);

      grid.isScrollable.and.returnValue(true);
      expect(grid.cssClasses()).toEqual(['waffle-grid', 'waffle-selectable', 'waffle-fixedheader']);
    });

    it('should resize grid', () => {
      spyOn(GridResizer, 'resize');
      grid.resize();
      expect(GridResizer.resize).toHaveBeenCalled();
    });

    it('should clear changes', () => {
      spyOn(grid.$data, 'clearChanges');
      spyOn(grid.$columns, 'clearChanges');
      spyOn(grid.$selection, 'clearChanges');

      grid.clearChanges();

      expect(grid.$data.clearChanges).toHaveBeenCalled();
      expect(grid.$columns.clearChanges).toHaveBeenCalled();
      expect(grid.$selection.clearChanges).toHaveBeenCalled();
    });

    it('should clear changes without selection', () => {
      spyOn(grid.$data, 'clearChanges');
      spyOn(grid.$columns, 'clearChanges');

      grid.$selection = undefined;

      grid.clearChanges();

      expect(grid.$data.clearChanges).toHaveBeenCalled();
      expect(grid.$columns.clearChanges).toHaveBeenCalled();
    });

    it('should render grid', () => {
      spyOn(grid, 'renderHeader').and.callThrough();
      spyOn(grid, 'renderFooter').and.callThrough();
      spyOn(grid, 'renderBody').and.callThrough();
      spyOn(grid, 'clearChanges').and.callThrough();

      const result = grid.render();

      expect(result).toBe(grid);
      expect(grid.renderHeader).toHaveBeenCalled();
      expect(grid.renderFooter).toHaveBeenCalled();
      expect(grid.renderBody).toHaveBeenCalled();
      expect(grid.clearChanges).toHaveBeenCalled();
    });

    it('should render grid asynchronously', () => {
      spyOn(grid, 'renderHeader').and.callThrough();
      spyOn(grid, 'renderFooter').and.callThrough();
      spyOn(grid, 'renderBody').and.callThrough();
      spyOn(grid, 'clearChanges').and.callThrough();

      const result = grid.render(true);

      expect(result).toBe(grid);
      expect(grid.renderHeader).toHaveBeenCalled();
      expect(grid.renderFooter).toHaveBeenCalled();
      expect(grid.renderBody).toHaveBeenCalledWith(true);
      expect(grid.clearChanges).toHaveBeenCalled();
    });

    it('should check if data is selectable', () => {
      const data1 = {
        id: 1
      };

      const data2 = {
        id: 2
      };

      const fn = jasmine.createSpy('fn').and.callFake(data => data.id === 1);

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

    it('should check if grid is editable', () => {
      grid.options.editable = true;
      grid.$columns.forEach(column => column.editable = false);

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
