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

describe('Grid Sort', function() {

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

  it('should not sort grid by default', function() {
    expect(grid.$sortBy).toEqual([]);

    var ths = grid.$thead[0].childNodes[0].childNodes;

    expect(ths).toVerify(function(th) {
      return th.getAttribute('data-waffle-order') === null;
    });

    // First th is for checkbox
    expect(ths[1].className.split(' ')).not.toContain('waffle-sortable');
    expect(ths[2].className.split(' ')).toContain('waffle-sortable');
    expect(ths[3].className.split(' ')).toContain('waffle-sortable');

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
      // First td is for checkbox
      return tr.childNodes[1].innerHTML === data[idx].id.toString();
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
    expect(ths[1].getAttribute('data-waffle-order')).toBeNull();
    expect(ths[2].getAttribute('data-waffle-order')).toBe('+');
    expect(ths[3].getAttribute('data-waffle-order')).toBeNull();

    var classes0 = ths[1].className.split(' ');
    expect(classes0).not.toContain('waffle-sortable');
    expect(classes0).not.toContain('waffle-sortable-asc');
    expect(classes0).not.toContain('waffle-sortable-desc');

    var classes1 = ths[2].className.split(' ');
    expect(classes1).toContain('waffle-sortable');
    expect(classes1).toContain('waffle-sortable-asc');
    expect(classes1).not.toContain('waffle-sortable-desc');

    var classes2 = ths[3].className.split(' ');
    expect(classes2).toContain('waffle-sortable');
    expect(classes2).not.toContain('waffle-sortable-asc');
    expect(classes2).not.toContain('waffle-sortable-desc');

    expect(grid.$data.toArray()).toBeSorted(function(o1, o2) {
      return o1.firstName.localeCompare(o2.firstName);
    });

    expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
      return tr.childNodes[1].innerHTML === grid.$data[idx].id.toString();
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
    expect(ths[1].getAttribute('data-waffle-order')).toBeNull();
    expect(ths[2].getAttribute('data-waffle-order')).toBe('+');
    expect(ths[3].getAttribute('data-waffle-order')).toBe('-');

    var classes0 = ths[1].className.split(' ');
    expect(classes0).not.toContain('waffle-sortable');
    expect(classes0).not.toContain('waffle-sortable-asc');
    expect(classes0).not.toContain('waffle-sortable-desc');

    var classes1 = ths[2].className.split(' ');
    expect(classes1).toContain('waffle-sortable');
    expect(classes1).toContain('waffle-sortable-asc');
    expect(classes1).not.toContain('waffle-sortable-desc');

    var classes2 = ths[3].className.split(' ');
    expect(classes2).toContain('waffle-sortable');
    expect(classes2).not.toContain('waffle-sortable-asc');
    expect(classes2).toContain('waffle-sortable-desc');

    expect(grid.$data.toArray()).toBeSorted(function(o1, o2) {
      return (o1.firstName.localeCompare(o2.firstName)) ||
             (o1.lastName.localeCompare(o2.lastName)) * -1;
    });

    expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
      return tr.childNodes[1].innerHTML === grid.$data[idx].id.toString();
    });
  });

  it('should sort grid in ascendant order using one field', function() {
    grid.sortBy('id');

    expect(grid.$sortBy).toEqual(['+id']);

    var ths = grid.$thead[0].childNodes[0].childNodes;
    expect(ths[1].getAttribute('data-waffle-order')).toBe('+');
    expect(ths[2].getAttribute('data-waffle-order')).toBeNull();
    expect(ths[3].getAttribute('data-waffle-order')).toBeNull();

    var classes0 = ths[1].className.split(' ');
    expect(classes0).not.toContain('waffle-sortable');
    expect(classes0).toContain('waffle-sortable-asc');
    expect(classes0).not.toContain('waffle-sortable-desc');

    var classes1 = ths[2].className.split(' ');
    expect(classes1).toContain('waffle-sortable');
    expect(classes1).not.toContain('waffle-sortable-asc');
    expect(classes1).not.toContain('waffle-sortable-desc');

    var classes2 = ths[3].className.split(' ');
    expect(classes2).toContain('waffle-sortable');
    expect(classes2).not.toContain('waffle-sortable-asc');
    expect(classes2).not.toContain('waffle-sortable-desc');

    expect(grid.$data.toArray()).toBeSorted(function(o1, o2) {
      return o1.id - o2.id;
    });

    expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
      return tr.childNodes[1].innerHTML === grid.$data[idx].id.toString();
    });
  });

  it('should sort grid in descendant order using one field', function() {
    grid.sortBy('-id');

    expect(grid.$sortBy).toEqual(['-id']);

    var ths = grid.$thead[0].childNodes[0].childNodes;
    expect(ths[1].getAttribute('data-waffle-order')).toBe('-');
    expect(ths[2].getAttribute('data-waffle-order')).toBeNull();

    var classes0 = ths[1].className.split(' ');
    expect(classes0).not.toContain('waffle-sortable');
    expect(classes0).toContain('waffle-sortable-desc');
    expect(classes0).not.toContain('waffle-sortable-asc');

    var classes1 = ths[2].className.split(' ');
    expect(classes1).toContain('waffle-sortable');
    expect(classes1).not.toContain('waffle-sortable-asc');
    expect(classes1).not.toContain('waffle-sortable-desc');

    expect(grid.$data.toArray()).toBeSorted(function(o1, o2) {
      return (o1.id - o2.id) * -1;
    });

    expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
      return tr.childNodes[1].innerHTML === grid.$data[idx].id.toString();
    });
  });

  it('should sort grid in ascendant using two fields', function() {
    grid.sortBy(['firstName', '-lastName']);

    expect(grid.$sortBy).toEqual(['+firstName', '-lastName']);

    var ths = grid.$thead[0].childNodes[0].childNodes;
    expect(ths[1].getAttribute('data-waffle-order')).toBeNull();
    expect(ths[2].getAttribute('data-waffle-order')).toBe('+');
    expect(ths[3].getAttribute('data-waffle-order')).toBe('-');

    var classes0 = ths[2].className.split(' ');
    expect(classes0).toContain('waffle-sortable');
    expect(classes0).toContain('waffle-sortable-asc');
    expect(classes0).not.toContain('waffle-sortable-desc');

    var classes1 = ths[3].className.split(' ');
    expect(classes1).toContain('waffle-sortable');
    expect(classes1).toContain('waffle-sortable-desc');
    expect(classes1).not.toContain('waffle-sortable-asc');

    expect(grid.$data.toArray()).toBeSorted(function(o1, o2) {
      return (o1.firstName.localeCompare(o2.firstName)) ||
             (o1.lastName.localeCompare(o2.lastName) * -1);
    });

    expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
      return tr.childNodes[3].innerHTML === grid.$data[idx].lastName.toString();
    });
  });

  it('should sort data when column header is clicked', function() {
    spyOn(grid, 'sortBy').and.callThrough();

    // Trigger click
    var ths = grid.$thead[0].childNodes[0].childNodes;
    triggerClick(ths[2]);

    expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
    expect(grid.$sortBy).toEqual(['+firstName']);

    var ths = grid.$thead[0].childNodes[0].childNodes;
    expect(ths[1].getAttribute('data-waffle-order')).toBeNull();
    expect(ths[2].getAttribute('data-waffle-order')).toBe('+');
    expect(ths[3].getAttribute('data-waffle-order')).toBeNull();

    var classes0 = ths[2].className.split(' ');
    expect(classes0).toContain('waffle-sortable');
    expect(classes0).toContain('waffle-sortable-asc');
    expect(classes0).not.toContain('waffle-sortable-desc');

    var classes1 = ths[3].className.split(' ');
    expect(classes1).toContain('waffle-sortable');
    expect(classes1).not.toContain('waffle-sortable-desc');
    expect(classes1).not.toContain('waffle-sortable-asc');

    grid.sortBy.calls.reset();

    // New click should reverse order
    triggerClick(ths[2]);

    // Th should have flag
    expect(grid.sortBy).toHaveBeenCalledWith(['-firstName']);
    expect(grid.$sortBy).toEqual(['-firstName']);

    ths = grid.$thead[0].childNodes[0].childNodes;
    expect(ths[1].getAttribute('data-waffle-order')).toBeNull();
    expect(ths[2].getAttribute('data-waffle-order')).toBe('-');
    expect(ths[3].getAttribute('data-waffle-order')).toBeNull();

    classes0 = ths[2].className.split(' ');
    expect(classes0).toContain('waffle-sortable');
    expect(classes0).not.toContain('waffle-sortable-asc');
    expect(classes0).toContain('waffle-sortable-desc');

    classes1 = ths[3].className.split(' ');
    expect(classes1).toContain('waffle-sortable');
    expect(classes1).not.toContain('waffle-sortable-desc');
    expect(classes1).not.toContain('waffle-sortable-asc'); 
  });

  it('should not sort data when column header is clicked and column is not sortable', function() {
    spyOn(grid, 'sortBy').and.callThrough();

    // Trigger click
    var ths = grid.$thead[0].childNodes[0].childNodes;
    triggerClick(ths[1]);

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
    triggerClick(ths[1]);

    expect(grid.sortBy).toHaveBeenCalledWith(['+id']);
    expect(grid.$sortBy).toEqual(['+id']);

    grid.sortBy.calls.reset();

    // New click should reverse order
    triggerClick(ths[2], true, false);
    expect(grid.sortBy).toHaveBeenCalledWith(['+id', '+name']);
    expect(grid.$sortBy).toEqual(['+id', '+name']);

    grid.sortBy.calls.reset();

    // New click on id should reverse order of id column
    triggerClick(ths[1], true, false);
    expect(grid.sortBy).toHaveBeenCalledWith(['+name', '-id']);
    expect(grid.$sortBy).toEqual(['+name', '-id']);
  });
});
