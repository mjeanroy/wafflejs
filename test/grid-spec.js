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

  var fixtures;

  beforeEach(function() {
    fixtures = document.createElement('div');
    fixtures.setAttribute('id', 'fixtures');
    document.body.appendChild(fixtures);
    jq = $.fn || $.prototype;

    jasmine.clock().install();
  });

  afterEach(function() {
    fixtures.parentNode.removeChild(fixtures);
    jasmine.clock().uninstall();
  });

  it('should define custom options', function() {
    expect(Grid.options).toEqual({
      key: 'id',
      async: false,
      size: {
        width: null,
        height: null
      },
      events: {
        onInitialized: _.noop,
        onRendered: _.noop,
        onAdded: _.noop,
        onRemoved: _.noop,
        onSorted: _.noop
      }
    });
  });

  it('should create grid using default options', function() {
    var table = document.createElement('table');
    var grid = new Grid(table, {
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    expect(grid.options).toBeDefined();
    expect(grid.options).not.toBe(Grid.options);
    expect(grid.options).toEqual(jasmine.objectContaining(Grid.options));
  });

  it('should create grid with custom options', function() {
    var table = document.createElement('table');
    var onInitialized = jasmine.createSpy('onInitialized');
    var onAdded = jasmine.createSpy('onAdded');

    var grid = new Grid(table, {
      key: 'title',
      async: true,
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
        onSorted: _.noop
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

  it('should call onInitialized after initialization', function() {
    var table = document.createElement('table');
    var onInitialized = jasmine.createSpy('onInitialized');

    var grid = new Grid(table, {
      events: {
        onInitialized: onInitialized
      },
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    expect(onInitialized).toHaveBeenCalledWith();
  });

  it('should call onRendered callbacks after body rendering', function() {
    var table = document.createElement('table');
    var onRendered = jasmine.createSpy('onRendered');

    var grid = new Grid(table, {
      events: {
        onRendered: onRendered
      },
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    expect(onRendered).toHaveBeenCalledWith(grid.$data, []);
  });

  it('should call onAdded callback after data has been pushed', function() {
    var table = document.createElement('table');
    var onAdded = jasmine.createSpy('onAdded');

    var grid = new Grid(table, {
      events: {
        onAdded: onAdded
      },
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    var data = [
      { id: 1, name: 'foo' },
      { id: 2, name: 'bar' }
    ];

    expect(onAdded).not.toHaveBeenCalled();

    grid.data().push(data[0], data[1]);
    jasmine.clock().tick();

    expect(onAdded).toHaveBeenCalledWith(
        [grid.$data[0], grid.$data[1]],
        [grid.$tbody[0].childNodes[0], grid.$tbody[0].childNodes[1]],
        0
    );
  });

  it('should call onRemoved callback after data has been removed', function() {
    var table = document.createElement('table');
    var onRemoved = jasmine.createSpy('onRemoved');

    var data = [
      { id: 1, name: 'foo' },
      { id: 2, name: 'bar' }
    ];

    var grid = new Grid(table, {
      events: {
        onRemoved: onRemoved
      },
      data: data,
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    expect(onRemoved).not.toHaveBeenCalled();

    var nodes = [].slice.call(grid.$tbody[0].childNodes);
    grid.data().pop();
    jasmine.clock().tick();

    expect(onRemoved).toHaveBeenCalledWith(
        [data[1]],
        [nodes[1]],
        1
    );
  });

  it('should call onSorted callback when grid is sorted', function() {
    var table = document.createElement('table');
    var onSorted = jasmine.createSpy('onSorted');
    var grid = new Grid(table, {
      events: {
        onSorted: onSorted
      },
      data: [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' }
      ],
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    expect(onSorted).not.toHaveBeenCalled();
    grid.sortBy('id');
    expect(onSorted).toHaveBeenCalledWith();
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

  it('should observe data collection', function() {
    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    expect(grid.$data.$$observers).toContain(jasmine.objectContaining({
      ctx: grid,
      callback: grid.$$onDataChange
    }));
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

  it('should render column header', function() {
    var columns = [
      { id: 'foo', title: 'Foo' },
      { id: 'bar', title: 'Boo' }
    ];

    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: columns
    });

    var tbody = grid.$tbody[0];
    expect(tbody.childNodes).toHaveLength(0);

    var thead = grid.$thead[0];
    var tr = thead.childNodes;
    expect(tr).toHaveLength(1);
    expect(tr[0]).toBeDOMElement('tr');

    var ths = tr[0].childNodes;
    expect(ths).toHaveLength(2);

    expect(ths).toVerify(function(node) {
      return node.tagName === 'TH';
    });

    expect(ths).toVerify(function(node, idx) {
      return node.innerHTML === columns[idx].title;
    });

    expect(ths).toVerify(function(node, idx) {
      var cssClasses = [
        columns[idx].id,
        'waffle-sortable'
      ];

      return node.className === cssClasses.join(' ');
    });

    expect(ths).toVerify(function(node, idx) {
      return node.getAttribute('data-waffle-id') === columns[idx].id;
    });

    expect(ths).toVerify(function(node, idx) {
      return node.getAttribute('data-waffle-order') === null;
    });

    expect(ths).toVerify(function(node) {
      return node.getAttribute('data-waffle-sortable') === 'true';
    });
  });

  it('should render column header with unsortable column', function() {
    var columns = [
      { id: 'foo', title: 'Foo' },
      { id: 'bar', title: 'Boo', sortable: false }
    ];

    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: columns
    });

    var tbody = grid.$tbody[0];
    expect(tbody.childNodes).toHaveLength(0);

    var thead = grid.$thead[0];
    var tr = thead.childNodes;
    expect(tr).toHaveLength(1);
    expect(tr[0]).toBeDOMElement('tr');

    var ths = tr[0].childNodes;
    expect(ths).toHaveLength(2);

    expect(ths).toVerify(function(node) {
      return node.tagName === 'TH';
    });

    expect(ths).toVerify(function(node, idx) {
      return node.innerHTML === columns[idx].title;
    });

    expect(ths[0].className.split(' ')).toContain('waffle-sortable');
    expect(ths[1].className.split(' ')).not.toContain('waffle-sortable');

    expect(ths[0].getAttribute('data-waffle-sortable')).toBe('true');
    expect(ths[1].getAttribute('data-waffle-sortable')).toBeNull();
  });

  it('should render data', function() {
    var columns = [
      { id: 'id', title: 'Foo' },
      { id: 'name', title: 'Boo' }
    ];

    var data = [
      { id: 1, name: 'foo1 '},
      { id: 2, name: 'foo2 '},
      { id: 3, name: 'foo3 '}
    ];

    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: data,
      columns: columns
    });

    var $tbody = grid.$tbody;
    var trs = $tbody[0].childNodes;
    expect(trs.length).toBe(data.length);

    expect(trs).toVerify(function(node) {
      return node.tagName === 'TR';
    });

    expect(trs).toVerify(function(node, idx) {
      return node.childNodes.length === 2;
    });

    expect(trs).toVerify(function(node, idx) {
      var tds = node.childNodes;
      return tds[0].innerHTML === data[idx].id.toString() &&
             tds[1].innerHTML === data[idx].name.toString();
    });

    expect(trs).toVerify(function(node) {
      var css1 = [columns[0].id, 'waffle-sortable'];
      var css2 = [columns[1].id, 'waffle-sortable'];
      var tds = node.childNodes;
      return tds[0].className === css1.join(' ') &&
             tds[1].className === css2.join(' ');
    });

    expect(trs).toVerify(function(node, idx) {
      var tds = node.childNodes;
      return tds[0].getAttribute('data-waffle-id') === columns[0].id &&
             tds[1].getAttribute('data-waffle-id') === columns[1].id;
    });
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

    it('should refresh grid when data array is reversed', function() {
      grid.data().reverse();
      jasmine.clock().tick();

      expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
        return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
      });
    });

    it('should render data asynchronously', function() {
      var columns = [
        { id: 'id', title: 'Foo' },
        { id: 'name', title: 'Boo' }
      ];

      var data = [];
      for (var i = 0; i < 215; ++i) {
        data.push({
          id: i + 1,
          name: 'foo' + (i + 1)
        });
      }

      var table = document.createElement('table');

      var grid = new Grid(table, {
        data: data,
        columns: columns
      });

      expect(grid.$tbody[0].childNodes.length).toBe(data.length);

      var result = grid.renderBody(true);

      expect(result).toBe(grid);
      expect(grid.$tbody[0].childNodes.length).toBe(0);

      // Trigger first timeout
      jasmine.clock().tick();
      expect(grid.$tbody[0].childNodes.length).toBe(200);

      // Trigger second timeout
      jasmine.clock().tick(10);
      expect(grid.$tbody[0].childNodes.length).toBe(215);
    });

    describe('observe', function() {
      var change;
      var changes;
      var newData;

      beforeEach(function() {
        spyOn(grid, '$$on_splice').and.callThrough();
      });

      describe('add', function() {

        beforeEach(function() {
          change = {
            type: 'splice',
            index: 3,
            addedCount: 1,
            removed: [],
            object: grid.$data
          };

          newData = {
            id: 4,
            firstName: 'foo4',
            lastName: 'bar4'
          };

          changes = [change];
        });

        it('should add row at the end with a splice change', function() {
          grid.$data[3] = newData;
          grid.$data.length = 4;
          change.index = 3;

          grid.$$onDataChange(changes);

          expect(grid.$$on_splice).toHaveBeenCalledWith(change);

          var trs = grid.$tbody[0].childNodes;
          expect(trs.length).toBe(4);
          expect(trs).toVerify(function(tr, idx) {
            return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
          });
        });

        it('should add row at the beginning with a splice change', function() {
          grid.$data[3] = grid.$data[2];
          grid.$data[2] = grid.$data[1];
          grid.$data[1] = grid.$data[0];
          grid.$data[0] = newData;
          grid.$data.length = 4;
          change.index = 0;

          grid.$$onDataChange(changes);

          expect(grid.$$on_splice).toHaveBeenCalledWith(change);

          var trs = grid.$tbody[0].childNodes;
          expect(trs.length).toBe(4);
          expect(trs).toVerify(function(tr, idx) {
            return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
          });
        });

        it('should add row at the middle with a splice change', function() {
          grid.$data[3] = grid.$data[2];
          grid.$data[2] = grid.$data[1];
          grid.$data[1] = newData;
          grid.$data.length = 4;
          change.index = 1;

          grid.$$onDataChange(changes);

          expect(grid.$$on_splice).toHaveBeenCalledWith(change);

          var trs = grid.$tbody[0].childNodes;
          expect(trs.length).toBe(4);
          expect(trs).toVerify(function(tr, idx) {
            return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
          });
        });
      });

      describe('remove', function() {
        beforeEach(function() {
          change = {
            type: 'splice',
            index: 0,
            addedCount: 0,
            removed: [],
            object: grid.$data
          };

          newData = {
            id: 4,
            firstName: 'foo4',
            lastName: 'bar4'
          };

          changes = [change];
        });

        it('should remove first row with a splice change', function() {
          change.index = 0;
          change.removed = [grid.$data[0]];

          grid.$data[0] = grid.$data[1];
          grid.$data[1] = grid.$data[2];

          delete grid.$data[2];
          grid.$data.length = 2;

          grid.$$onDataChange(changes);

          expect(grid.$$on_splice).toHaveBeenCalledWith(change);

          var trs = grid.$tbody[0].childNodes;
          expect(trs.length).toBe(2);
          expect(trs).toVerify(function(tr, idx) {
            return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
          });
        });

        it('should remove last row with a splice change', function() {
          change.index = 2;
          change.removed = [grid.$data[2]];

          delete grid.$data[2];
          grid.$data.length = 2;

          grid.$$onDataChange(changes);

          expect(grid.$$on_splice).toHaveBeenCalledWith(change);

          var trs = grid.$tbody[0].childNodes;
          expect(trs.length).toBe(2);
          expect(trs).toVerify(function(tr, idx) {
            return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
          });
        });

        it('should middle row with a splice change', function() {
          change.index = 1;
          change.removed = [grid.$data[1]];

          grid.$data[1] = grid.$data[2];
          delete grid.$data[2];
          grid.$data.length = 2;

          grid.$$onDataChange(changes);

          expect(grid.$$on_splice).toHaveBeenCalledWith(change);

          var trs = grid.$tbody[0].childNodes;
          expect(trs.length).toBe(2);
          expect(trs).toVerify(function(tr, idx) {
            return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
          });
        });

        it('should remove everything', function() {
          change.index = 0;
          change.removed = [grid.$data[0], grid.$data[1], grid.$data[2]];

          delete grid.$data[0];
          delete grid.$data[1];
          delete grid.$data[2];
          grid.$data.length = 0;

          grid.$$onDataChange(changes);

          expect(grid.$$on_splice).toHaveBeenCalledWith(change);

          var trs = grid.$tbody[0].childNodes;
          expect(trs.length).toBe(0);
        });
      });
    });

    describe('sort', function() {
      it('should not sort grid by default', function() {
        expect(grid.$sortBy).toEqual([]);

        var ths = grid.$thead[0].childNodes[0].childNodes;

        expect(ths).toVerify(function(th) {
          return th.getAttribute('data-waffle-order') === null;
        });

        expect(ths[0].className.split(' ')).not.toContain('waffle-sortable');
        expect(ths[1].className.split(' ')).toContain('waffle-sortable');
        expect(ths[2].className.split(' ')).toContain('waffle-sortable');

        expect(ths).toVerify(function(th) {
          return th.className.split(' ').indexOf('waffle-sortable-asc') < 0;
        });

        expect(ths).toVerify(function(th) {
          return th.className.split(' ').indexOf('waffle-sortable-desc') < 0;
        });

        expect(grid.$data.toArray()).not.toBeSorted(function(o1, o2) {
          return o1.id - o2.id;
        });

        expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
          return tr.childNodes[0].innerHTML === data[idx].id.toString();
        });
      });

      it('should sort grid by default using one field', function() {
        grid = new Grid(table, {
          data: data,
          columns: columns,
          sortBy: 'firstName'
        });

        expect(grid.$sortBy).toEqual(['+firstName']);

        var ths = grid.$thead[0].childNodes[0].childNodes;
        expect(ths[0].getAttribute('data-waffle-order')).toBeNull();
        expect(ths[1].getAttribute('data-waffle-order')).toBe('+');
        expect(ths[2].getAttribute('data-waffle-order')).toBeNull();

        var classes0 = ths[0].className.split(' ');
        expect(classes0).not.toContain('waffle-sortable');
        expect(classes0).not.toContain('waffle-sortable-asc');
        expect(classes0).not.toContain('waffle-sortable-desc');

        var classes1 = ths[1].className.split(' ');
        expect(classes1).toContain('waffle-sortable');
        expect(classes1).toContain('waffle-sortable-asc');
        expect(classes1).not.toContain('waffle-sortable-desc');

        var classes2 = ths[2].className.split(' ');
        expect(classes2).toContain('waffle-sortable');
        expect(classes2).not.toContain('waffle-sortable-asc');
        expect(classes2).not.toContain('waffle-sortable-desc');

        expect(grid.$data.toArray()).toBeSorted(function(o1, o2) {
          return o1.firstName.localeCompare(o2.firstName);
        });

        expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
          return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
        });
      });

      it('should sort grid by default using two fields', function() {
        grid = new Grid(table, {
          data: data,
          columns: columns,
          sortBy: ['firstName', '-lastName']
        });

        expect(grid.$sortBy).toEqual(['+firstName', '-lastName']);

        var ths = grid.$thead[0].childNodes[0].childNodes;
        expect(ths[0].getAttribute('data-waffle-order')).toBeNull();
        expect(ths[1].getAttribute('data-waffle-order')).toBe('+');
        expect(ths[2].getAttribute('data-waffle-order')).toBe('-');

        var classes0 = ths[0].className.split(' ');
        expect(classes0).not.toContain('waffle-sortable');
        expect(classes0).not.toContain('waffle-sortable-asc');
        expect(classes0).not.toContain('waffle-sortable-desc');

        var classes1 = ths[1].className.split(' ');
        expect(classes1).toContain('waffle-sortable');
        expect(classes1).toContain('waffle-sortable-asc');
        expect(classes1).not.toContain('waffle-sortable-desc');

        var classes2 = ths[2].className.split(' ');
        expect(classes2).toContain('waffle-sortable');
        expect(classes2).not.toContain('waffle-sortable-asc');
        expect(classes2).toContain('waffle-sortable-desc');

        expect(grid.$data.toArray()).toBeSorted(function(o1, o2) {
          return (o1.firstName.localeCompare(o2.firstName)) ||
                 (o1.lastName.localeCompare(o2.lastName)) * -1;
        });

        expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
          return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
        });
      });

      it('should sort grid in ascendant order using one field', function() {
        grid.sortBy('id');

        expect(grid.$sortBy).toEqual(['+id']);

        var ths = grid.$thead[0].childNodes[0].childNodes;
        expect(ths[0].getAttribute('data-waffle-order')).toBe('+');
        expect(ths[1].getAttribute('data-waffle-order')).toBeNull();
        expect(ths[2].getAttribute('data-waffle-order')).toBeNull();

        var classes0 = ths[0].className.split(' ');
        expect(classes0).not.toContain('waffle-sortable');
        expect(classes0).toContain('waffle-sortable-asc');
        expect(classes0).not.toContain('waffle-sortable-desc');

        var classes1 = ths[1].className.split(' ');
        expect(classes1).toContain('waffle-sortable');
        expect(classes1).not.toContain('waffle-sortable-asc');
        expect(classes1).not.toContain('waffle-sortable-desc');

        var classes2 = ths[1].className.split(' ');
        expect(classes2).toContain('waffle-sortable');
        expect(classes2).not.toContain('waffle-sortable-asc');
        expect(classes2).not.toContain('waffle-sortable-desc');

        expect(grid.$data.toArray()).toBeSorted(function(o1, o2) {
          return o1.id - o2.id;
        });

        expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
          return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
        });
      });

      it('should sort grid in descendant order using one field', function() {
        grid.sortBy('-id');

        expect(grid.$sortBy).toEqual(['-id']);

        var ths = grid.$thead[0].childNodes[0].childNodes;
        expect(ths[0].getAttribute('data-waffle-order')).toBe('-');
        expect(ths[1].getAttribute('data-waffle-order')).toBeNull();

        var classes0 = ths[0].className.split(' ');
        expect(classes0).not.toContain('waffle-sortable');
        expect(classes0).toContain('waffle-sortable-desc');
        expect(classes0).not.toContain('waffle-sortable-asc');

        var classes1 = ths[1].className.split(' ');
        expect(classes1).toContain('waffle-sortable');
        expect(classes1).not.toContain('waffle-sortable-asc');
        expect(classes1).not.toContain('waffle-sortable-desc');

        expect(grid.$data.toArray()).toBeSorted(function(o1, o2) {
          return (o1.id - o2.id) * -1;
        });

        expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
          return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
        });
      });

      it('should sort grid in ascendant using two fields', function() {
        grid.sortBy(['firstName', '-lastName']);

        expect(grid.$sortBy).toEqual(['+firstName', '-lastName']);

        var ths = grid.$thead[0].childNodes[0].childNodes;
        expect(ths[0].getAttribute('data-waffle-order')).toBeNull();
        expect(ths[1].getAttribute('data-waffle-order')).toBe('+');
        expect(ths[2].getAttribute('data-waffle-order')).toBe('-');

        var classes0 = ths[1].className.split(' ');
        expect(classes0).toContain('waffle-sortable');
        expect(classes0).toContain('waffle-sortable-asc');
        expect(classes0).not.toContain('waffle-sortable-desc');

        var classes1 = ths[2].className.split(' ');
        expect(classes1).toContain('waffle-sortable');
        expect(classes1).toContain('waffle-sortable-desc');
        expect(classes1).not.toContain('waffle-sortable-asc');

        expect(grid.$data.toArray()).toBeSorted(function(o1, o2) {
          return (o1.firstName.localeCompare(o2.firstName)) ||
                 (o1.lastName.localeCompare(o2.lastName) * -1);
        });

        expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
          return tr.childNodes[2].innerHTML === grid.$data[idx].lastName.toString();
        });
      });

      it('should sort data when column header is clicked', function() {
        spyOn(grid, 'sortBy').and.callThrough();

        // Trigger click
        var ths = grid.$thead[0].childNodes[0].childNodes;
        var evt1 = document.createEvent('MouseEvent');
        evt1.initEvent('click', true, true);
        ths[1].dispatchEvent(evt1);

        expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
        expect(grid.$sortBy).toEqual(['+firstName']);

        var ths = grid.$thead[0].childNodes[0].childNodes;
        expect(ths[0].getAttribute('data-waffle-order')).toBeNull();
        expect(ths[1].getAttribute('data-waffle-order')).toBe('+');
        expect(ths[2].getAttribute('data-waffle-order')).toBeNull();

        var classes0 = ths[1].className.split(' ');
        expect(classes0).toContain('waffle-sortable');
        expect(classes0).toContain('waffle-sortable-asc');
        expect(classes0).not.toContain('waffle-sortable-desc');

        var classes1 = ths[2].className.split(' ');
        expect(classes1).toContain('waffle-sortable');
        expect(classes1).not.toContain('waffle-sortable-desc');
        expect(classes1).not.toContain('waffle-sortable-asc');

        grid.sortBy.calls.reset();

        // New click should reverse order
        var evt2 = document.createEvent('MouseEvent');
        evt2.initEvent('click', true, true);
        ths[1].dispatchEvent(evt2);

        // Th should have flag
        expect(grid.sortBy).toHaveBeenCalledWith(['-firstName']);
        expect(grid.$sortBy).toEqual(['-firstName']);

        ths = grid.$thead[0].childNodes[0].childNodes;
        expect(ths[0].getAttribute('data-waffle-order')).toBeNull();
        expect(ths[1].getAttribute('data-waffle-order')).toBe('-');
        expect(ths[2].getAttribute('data-waffle-order')).toBeNull();

        classes0 = ths[1].className.split(' ');
        expect(classes0).toContain('waffle-sortable');
        expect(classes0).not.toContain('waffle-sortable-asc');
        expect(classes0).toContain('waffle-sortable-desc');

        classes1 = ths[2].className.split(' ');
        expect(classes1).toContain('waffle-sortable');
        expect(classes1).not.toContain('waffle-sortable-desc');
        expect(classes1).not.toContain('waffle-sortable-asc'); 
      });

      it('should not sort data when column header is clicked and column is not sortable', function() {
        spyOn(grid, 'sortBy').and.callThrough();

        // Trigger click
        var ths = grid.$thead[0].childNodes[0].childNodes;
        var evt1 = document.createEvent('MouseEvent');
        evt1.initEvent('click', true, true);
        ths[0].dispatchEvent(evt1);

        expect(grid.sortBy).not.toHaveBeenCalled();
        expect(grid.$sortBy).toEqual([]);
      });

      it('should sort data when column header is clicked using two field if shift key is pressed', function() {
        var columns = [
          { id: 'id', title: 'Foo' },
          { id: 'name', title: 'Boo' }
        ];

        var data = [
          { id: 2, name: 'foo2 '},
          { id: 1, name: 'foo1 '},
          { id: 3, name: 'foo3 '}
        ];

        var table = document.createElement('table');
        fixtures.appendChild(table);

        var grid = new Grid(table, {
          data: data,
          columns: columns
        });

        spyOn(grid, 'sortBy').and.callThrough();

        // Trigger click
        var ths = grid.$thead[0].childNodes[0].childNodes;
        var evt1 = document.createEvent('MouseEvent');
        evt1.initEvent('click', true, true);
        ths[0].dispatchEvent(evt1);

        expect(grid.sortBy).toHaveBeenCalledWith(['+id']);
        expect(grid.$sortBy).toEqual(['+id']);

        grid.sortBy.calls.reset();

        // New click should reverse order
        var evt2 = document.createEvent('MouseEvent');
        evt2.initMouseEvent(
            'click',    // type
            true,       // canBubble
            true,       // cancelable,
            window,     // 'view'
            0,          // detail
            0,          // screenX,
            0,          // screenY,
            0,          // clientX,
            0,          // clientY,
            false,      // ctrlKey,
            false,      // altKey,
            true,       // shiftKey,
            false,      // metaKey,
            'left',     // button,
            ths         // relatedTarget
        );

        ths[1].dispatchEvent(evt2);

        expect(grid.sortBy).toHaveBeenCalledWith(['+id', '+name']);
        expect(grid.$sortBy).toEqual(['+id', '+name']);

        grid.sortBy.calls.reset();

        // New click on id should reverse order of id column
        var evt3 = document.createEvent('MouseEvent');
        evt3.initMouseEvent(
            'click',    // type
            true,       // canBubble
            true,       // cancelable,
            window,     // 'view'
            0,          // detail
            0,          // screenX,
            0,          // screenY,
            0,          // clientX,
            0,          // clientY,
            false,      // ctrlKey,
            false,      // altKey,
            true,       // shiftKey,
            false,      // metaKey,
            'left',     // button,
            ths         // relatedTarget
        );

        ths[0].dispatchEvent(evt3);
        expect(grid.sortBy).toHaveBeenCalledWith(['+name', '-id']);
        expect(grid.$sortBy).toEqual(['+name', '-id']);
      });

    });

    describe('selection', function() {
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

      it('should select data when row is clicked', function() {
        spyOn(grid, 'select').and.callThrough();

        // Trigger click
        var trs = grid.$tbody[0].childNodes;
        var evt1 = document.createEvent('MouseEvent');
        evt1.initEvent('click', true, true);
        trs[1].dispatchEvent(evt1);

        var expectedSelection = {1:grid.$data[1]};
        expect(grid.select).toHaveBeenCalledWith(expectedSelection);
        expect(grid.$selection).toEqual(expectedSelection);
        expect(grid.$data[1].$$selected).toBeTrue();

        var trs = grid.$tbody[0].childNodes;
        expect(trs[0].getAttribute('class')).toBeNull();
        expect(trs[1].getAttribute('class')).toBe(CSS_SELECTED);
        expect(trs[2].getAttribute('class')).toBeNull();

        grid.select.calls.reset();

        // New click should toggle selection
        var evt2 = document.createEvent('MouseEvent');
        evt2.initEvent('click', true, true);
        trs[1].dispatchEvent(evt2);

        expect(grid.select).toHaveBeenCalledWith({});
        expect(grid.$selection).toEqual({});
        expect(grid.$data[1].$$selected).toBeFalse();

        trs = grid.$tbody[0].childNodes;
        expect(trs[0].getAttribute('class')).toBeNull();
        expect(trs[1].getAttribute('class')).toBeNull();
        expect(trs[2].getAttribute('class')).toBeNull();
      });

      it('should set $selection and flag corresponding data as selected', function() {
        var trs = grid.$tbody[0].childNodes;
        expect(trs).toVerify(function(tr) {
          return tr.getAttribute('class') == null;
        });
        expect(data).toVerify(function(data) {
          return !data.$$selected;
        });
        expect(grid.$selection).toEqual({});

        var idx = 1;
        var newSelection = {}
        newSelection[idx] = data[idx];

        grid.select(newSelection);

        expect(data[idx].$$selected).toBeTrue();
        expect(trs[idx].getAttribute('class')).toEqual(CSS_SELECTED);
        expect(grid.$selection).toBe(newSelection);
      });

      it('should replace $selection, unflag previously selected data and flag newly selected data', function() {
        var trs = grid.$tbody[0].childNodes;
        var idx = 1;
        var previousSelection = {}
        previousSelection[idx]= data[idx];

        grid.select(previousSelection);

        expect(data[idx].$$selected).toBeTrue();
        expect(trs[idx].getAttribute('class')).toEqual(CSS_SELECTED);
        expect(grid.$selection).toBe(previousSelection);

        var newIdx = 0;
        var newSelection = {}
        newSelection[newIdx] = data[newIdx];

        grid.select(newSelection);

        expect(data[newIdx].$$selected).toBeTrue();
        expect(data[idx].$$selected).toBeFalse();
        expect(trs[newIdx].getAttribute('class')).toEqual(CSS_SELECTED);
        expect(trs[idx].getAttribute('class')).toBeNull();
        expect(grid.$selection).toBe(newSelection);
      });

      it('should replace $selection, unflag unselected data, flag newly selected data and keep still selected data flagged', function() {
        var trs = grid.$tbody[0].childNodes;
        var idx0 = 0;
        var idx1 = 1;
        var idx2 = 2;
        var previousSelection = {}
        previousSelection[idx0] = data[idx0];
        previousSelection[idx1] = data[idx1];

        // [0,1]
        grid.select(previousSelection);

        expect(data[idx0].$$selected).toBeTrue();
        expect(data[idx1].$$selected).toBeTrue();
        expect(data[idx2].$$selected).toBeUndefined();
        expect(trs[idx0].getAttribute('class')).toEqual(CSS_SELECTED);
        expect(trs[idx1].getAttribute('class')).toEqual(CSS_SELECTED);
        expect(trs[idx2].getAttribute('class')).toBeNull();
        expect(grid.$selection).toBe(previousSelection);

        var newSelection = {}
        newSelection[idx1] = data[idx1];
        newSelection[idx2] = data[idx2];

        // => [1,2]
        grid.select(newSelection);

        expect(data[idx0].$$selected).toBeFalse();
        expect(data[idx1].$$selected).toBeTrue();
        expect(data[idx2].$$selected).toBeTrue();
        expect(trs[idx0].getAttribute('class')).toBeNull();
        expect(trs[idx1].getAttribute('class')).toEqual(CSS_SELECTED);
        expect(trs[idx2].getAttribute('class')).toEqual(CSS_SELECTED);
        expect(grid.$selection).toBe(newSelection);
      });

      it('should keep current selection after sort', function() {
        var id1 = 1;
        var id2 = 2;
        var id3 = 3;
        var previousSelection = {}
        previousSelection[1] = grid.$data[1];
        previousSelection[2] = grid.$data[2];

        expect(previousSelection[1].id).toEqual(id1);
        expect(previousSelection[2].id).toEqual(id3);

        // [1,2]
        grid.select(previousSelection);

        // Sort should swap first and second lines. => [0,2]
        grid.sortBy('lastName');

        var trs = grid.$tbody[0].childNodes;

        expect(grid.$data[0].id).toEqual(id1);
        expect(grid.$data[0].$$selected).toBeTrue();
        expect(trs[0].getAttribute('class')).toEqual(CSS_SELECTED);

        expect(grid.$data[1].id).toEqual(id2);
        expect(grid.$data[1].$$selected).toBeUndefined();
        expect(trs[1].getAttribute('class')).toBeNull();

        expect(grid.$data[2].id).toEqual(id3);
        expect(grid.$data[2].$$selected).toBeTrue();
        expect(trs[2].getAttribute('class')).toEqual(CSS_SELECTED);

        expect(grid.$selection).not.toBe(previousSelection);
        expect(_.keys(grid.$selection)).toHaveLength(2);
        expect(grid.$selection[0]).toBe(grid.$data[0]);
        expect(grid.$selection[2]).toBe(grid.$data[2]);
      });
    });
  });
});
