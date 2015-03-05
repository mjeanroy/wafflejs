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
  });

  afterEach(function() {
    fixtures.parentNode.removeChild(fixtures);
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

  it('should bind click on header when grid is initialized', function() {
    spyOn($.fn || $.prototype, 'on').and.callThrough();

    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    expect(grid.$thead.on).toHaveBeenCalledWith('click', jasmine.any(Function));
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
    expect(grid.$columns).toBeDefined();

    grid.destroy();

    expect(grid.$table).toBeNull();
    expect(grid.$thead).toBeNull();
    expect(grid.$tbody).toBeNull();
    expect(grid.$data).toBeNull();
    expect(grid.$columns).toBeNull();
  });

  it('should unbind events when grid is destroyed', function() {
    spyOn($.fn || $.prototype, 'on').and.callThrough();
    spyOn($.fn || $.prototype, 'off').and.callThrough();

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
    expect(grid.$columns).toBeDefined();

    expect(grid.$thead.on).toHaveBeenCalledOnceWith('click', jasmine.any(Function));
    expect(grid.$thead.off).not.toHaveBeenCalled();

    var $thead = grid.$thead;
    $thead.on.calls.reset();

    grid.destroy();

    expect(grid.$table).toBeNull();
    expect(grid.$thead).toBeNull();
    expect(grid.$tbody).toBeNull();
    expect(grid.$data).toBeNull();
    expect(grid.$columns).toBeNull();

    expect($thead.on).not.toHaveBeenCalled();
    expect($thead.off).toHaveBeenCalledOnce();
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
      return node.getAttribute('data-waffle-idx') === idx.toString();
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

    expect(trs).toVerify(function(node, idx) {
      var tds = node.childNodes;
      return tds[0].getAttribute('data-waffle-idx') === idx.toString() &&
             tds[1].getAttribute('data-waffle-idx') === idx.toString();
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
  });
});
