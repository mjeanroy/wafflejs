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

    jasmine.spyAll($);
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

  it('should sort data when column header is clicked', function() {
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

    // Check that grid is not sorted
    var tbody = grid.$tbody[0];
    var thead = grid.$thead[0];

    var tr = thead.childNodes[0];
    var ths = tr.childNodes;
    expect(ths).toVerify(function(th) {
      var classes = th.className.split(' ');
      return th.getAttribute('data-waffle-order') === null &&
             classes.indexOf('waffle-sortable') >= 0 &&
             classes.indexOf('waffle-sortable-asc') === -1 &&
             classes.indexOf('waffle-sortable-desc') === -1;
    });

    var trs = tbody.childNodes;
    expect(trs).toVerify(function(node, idx) {
      return node.childNodes[0].innerHTML === data[idx].id.toString();
    });

    expect(grid.$columns.toArray()).toVerify(function(c) {
      return c.asc === null;
    });

    // Data should not be sorted yet
    expect(grid.$data.toArray()).not.toBeSorted(function(o1, o2) {
      return o1.id - o2.id;
    });

    // Trigger click
    var evt1 = document.createEvent('MouseEvent');
    evt1.initEvent('click', true, true);
    ths[0].dispatchEvent(evt1);

    // Th should have flag
    expect(ths[0].getAttribute('data-waffle-order')).toBe('+');

    var classes = ths[0].className.split(' ');
    expect(classes).toContain('waffle-sortable');
    expect(classes).toContain('waffle-sortable-asc');
    expect(classes).not.toContain('waffle-sortable-desc');

    // Data should be sorted
    expect(grid.$data.toArray()).toBeSorted(function(o1, o2) {
      return o1.id - o2.id;
    });

    expect(grid.$columns[0].asc).toBe(true);
    expect(grid.$columns[1].asc).toBeNull();

    // Sort data
    data.sort(function(o1, o2) {
      return o1.id - o2.id
    });

    var trs = tbody.childNodes;
    expect(trs).toVerify(function(node, idx) {
      return node.childNodes[0].innerHTML === data[idx].id.toString();
    });

    // New click should reverse order
    var evt2 = document.createEvent('MouseEvent');
    evt2.initEvent('click', true, true);
    ths[0].dispatchEvent(evt2);

    // Th should have flag
    expect(ths[0].getAttribute('data-waffle-order')).toBe('-');

    classes = ths[0].className.split(' ');
    expect(classes).toContain('waffle-sortable');
    expect(classes).toContain('waffle-sortable-desc');
    expect(classes).not.toContain('waffle-sortable-asc');

    // Data should be sorted
    expect(grid.$data.toArray()).toBeSorted(function(o1, o2) {
      return o2.id - o1.id;
    });

    expect(grid.$columns[0].asc).toBe(false);
    expect(grid.$columns[1].asc).toBeNull();

    // Sort data
    data.sort(function(o1, o2) {
      return o2.id - o1.id
    });

    var trs = tbody.childNodes;
    expect(trs).toVerify(function(node, idx) {
      return node.childNodes[0].innerHTML === data[idx].id.toString();
    });
  });
});
