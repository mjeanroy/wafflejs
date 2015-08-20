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
  });

  it('should check if grid is sortable', function() {
    grid = new Grid(table, {
      data: data,
      columns: columns,
      view: {
        thead: true,
        tfoot: true
      }
    });

    grid.options.sortable = true;
    expect(grid.isSortable()).toBe(true);

    grid.options.sortable = false;
    expect(grid.isSortable()).toBe(false);
  });

  it('should sort grid by default using one field', function() {
    grid = new Grid(table, {
      data: data,
      columns: columns,
      sortBy: 'firstName',
      view: {
        thead: true,
        tfoot: true
      }
    });

    expect(grid.$sortBy).toEqual(['+firstName']);

    var headers = grid.$thead[0].childNodes[0].childNodes;
    expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
    expect(headers[2].getAttribute('data-waffle-order')).toBe('+');
    expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

    expect(headers[1].className).not.toContain('waffle-sortable');
    expect(headers[1].className).not.toContain('waffle-sortable-asc');
    expect(headers[1].className).not.toContain('waffle-sortable-desc');

    expect(headers[2].className).toContain('waffle-sortable');
    expect(headers[2].className).toContain('waffle-sortable-asc');
    expect(headers[2].className).not.toContain('waffle-sortable-desc');

    expect(headers[3].className).toContain('waffle-sortable');
    expect(headers[3].className).not.toContain('waffle-sortable-asc');
    expect(headers[3].className).not.toContain('waffle-sortable-desc');

    var footers = grid.$tfoot[0].childNodes[0].childNodes;
    expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
    expect(footers[2].getAttribute('data-waffle-order')).toBe('+');
    expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

    expect(footers[1].className).not.toContain('waffle-sortable');
    expect(footers[1].className).not.toContain('waffle-sortable-asc');
    expect(footers[1].className).not.toContain('waffle-sortable-desc');

    expect(footers[2].className).toContain('waffle-sortable');
    expect(footers[2].className).toContain('waffle-sortable-asc');
    expect(footers[2].className).not.toContain('waffle-sortable-desc');

    expect(footers[3].className).toContain('waffle-sortable');
    expect(footers[3].className).not.toContain('waffle-sortable-asc');
    expect(footers[3].className).not.toContain('waffle-sortable-desc');

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
      sortBy: ['firstName', '-lastName'],
      view: {
        thead: true,
        tfoot: true
      }
    });

    expect(grid.$sortBy).toEqual(['+firstName', '-lastName']);

    var headers = grid.$thead[0].childNodes[0].childNodes;
    expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
    expect(headers[2].getAttribute('data-waffle-order')).toBe('+');
    expect(headers[3].getAttribute('data-waffle-order')).toBe('-');

    expect(headers[1].className).not.toContain('waffle-sortable');
    expect(headers[1].className).not.toContain('waffle-sortable-asc');
    expect(headers[1].className).not.toContain('waffle-sortable-desc');

    expect(headers[2].className).toContain('waffle-sortable');
    expect(headers[2].className).toContain('waffle-sortable-asc');
    expect(headers[2].className).not.toContain('waffle-sortable-desc');

    expect(headers[3].className).toContain('waffle-sortable');
    expect(headers[3].className).not.toContain('waffle-sortable-asc');
    expect(headers[3].className).toContain('waffle-sortable-desc');

    var footers = grid.$tfoot[0].childNodes[0].childNodes;
    expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
    expect(footers[2].getAttribute('data-waffle-order')).toBe('+');
    expect(footers[3].getAttribute('data-waffle-order')).toBe('-');

    expect(footers[1].className).not.toContain('waffle-sortable');
    expect(footers[1].className).not.toContain('waffle-sortable-asc');
    expect(footers[1].className).not.toContain('waffle-sortable-desc');

    expect(footers[2].className).toContain('waffle-sortable');
    expect(footers[2].className).toContain('waffle-sortable-asc');
    expect(footers[2].className).not.toContain('waffle-sortable-desc');

    expect(footers[3].className).toContain('waffle-sortable');
    expect(footers[3].className).not.toContain('waffle-sortable-asc');
    expect(footers[3].className).toContain('waffle-sortable-desc');

    expect(grid.$data.toArray()).toBeSorted(function(o1, o2) {
      return (o1.firstName.localeCompare(o2.firstName)) ||
             (o1.lastName.localeCompare(o2.lastName)) * -1;
    });

    expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
      return tr.childNodes[1].innerHTML === grid.$data[idx].id.toString();
    });
  });

  describe('once initialized with a footer and a header', function() {
    var headers;
    var footers;

    beforeEach(function() {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        view: {
          thead: true,
          tfoot: true
        }
      });

      headers = grid.$thead[0].childNodes[0].childNodes;
      footers = grid.$tfoot[0].childNodes[0].childNodes;
    });

    it('should not sort grid by default', function() {
      expect(grid.$sortBy).toEqual([]);

      expect(headers).toVerify(function(th) {
        return th.getAttribute('data-waffle-order') === null;
      });

      expect(footers).toVerify(function(th) {
        return th.getAttribute('data-waffle-order') === null;
      });

      // First th is for checkbox

      expect(headers[1].className.split(' ')).not.toContain('waffle-sortable');
      expect(headers[2].className.split(' ')).toContain('waffle-sortable');
      expect(headers[3].className.split(' ')).toContain('waffle-sortable');

      expect(footers[1].className.split(' ')).not.toContain('waffle-sortable');
      expect(footers[2].className.split(' ')).toContain('waffle-sortable');
      expect(footers[3].className.split(' ')).toContain('waffle-sortable');

      expect(headers).toVerify(function(th) {
        return th.className.split(' ').indexOf('waffle-sortable-asc') < 0;
      });

      expect(footers).toVerify(function(th) {
        return th.className.split(' ').indexOf('waffle-sortable-asc') < 0;
      });

      expect(headers).toVerify(function(th) {
        return th.className.split(' ').indexOf('waffle-sortable-desc') < 0;
      });

      expect(footers).toVerify(function(th) {
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

    it('should sort grid in ascendant order using one field', function() {
      grid.sortBy('id');

      expect(grid.$sortBy).toEqual(['+id']);

      expect(headers[1].getAttribute('data-waffle-order')).toBe('+');
      expect(headers[2].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[1].className).toContain('waffle-sortable');
      expect(headers[1].className).toContain('waffle-sortable-asc');
      expect(headers[1].className).not.toContain('waffle-sortable-desc');

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).not.toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');

      expect(footers[1].getAttribute('data-waffle-order')).toBe('+');
      expect(footers[2].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[1].className).toContain('waffle-sortable');
      expect(footers[1].className).toContain('waffle-sortable-asc');
      expect(footers[1].className).not.toContain('waffle-sortable-desc');

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).not.toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');

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

      expect(headers[1].getAttribute('data-waffle-order')).toBe('-');
      expect(headers[2].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[1].className).toContain('waffle-sortable');
      expect(headers[1].className).toContain('waffle-sortable-desc');
      expect(headers[1].className).not.toContain('waffle-sortable-asc');

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).not.toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[1].getAttribute('data-waffle-order')).toBe('-');
      expect(footers[2].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[1].className).toContain('waffle-sortable');
      expect(footers[1].className).toContain('waffle-sortable-desc');
      expect(footers[1].className).not.toContain('waffle-sortable-asc');

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).not.toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

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

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(headers[3].getAttribute('data-waffle-order')).toBe('-');

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(footers[3].getAttribute('data-waffle-order')).toBe('-');

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');

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
      triggerClick(headers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$sortBy).toEqual(['+firstName']);

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');

      grid.sortBy.calls.reset();

      // New click should reverse order
      triggerClick(headers[2]);

      // Th should have flag
      expect(grid.sortBy).toHaveBeenCalledWith(['-firstName']);
      expect(grid.$sortBy).toEqual(['-firstName']);

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('-');
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).not.toContain('waffle-sortable-asc');
      expect(headers[2].className).toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('-');
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).not.toContain('waffle-sortable-asc');
      expect(footers[2].className).toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');
    });

    it('should sort data when column footer is clicked', function() {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(footers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$sortBy).toEqual(['+firstName']);

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');

      grid.sortBy.calls.reset();

      // New click should reverse order
      triggerClick(footers[2]);

      // Th should have flag
      expect(grid.sortBy).toHaveBeenCalledWith(['-firstName']);
      expect(grid.$sortBy).toEqual(['-firstName']);

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('-');
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).not.toContain('waffle-sortable-asc');
      expect(headers[2].className).toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('-');
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).not.toContain('waffle-sortable-asc');
      expect(footers[2].className).toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');
    });

    it('should not sort data when column header is clicked and column is not sortable', function() {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(headers[1]);

      expect(grid.sortBy).not.toHaveBeenCalled();
      expect(grid.$sortBy).toEqual([]);
    });

    it('should not sort data when column footer is clicked and column is not sortable', function() {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(footers[1]);

      expect(grid.sortBy).not.toHaveBeenCalled();
      expect(grid.$sortBy).toEqual([]);
    });

    it('should sort data when column header is clicked using two field if shift key is pressed', function() {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(headers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$sortBy).toEqual(['+firstName']);

      grid.sortBy.calls.reset();

      // New click should reverse order
      triggerClick(headers[3], true, false);
      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName', '+lastName']);
      expect(grid.$sortBy).toEqual(['+firstName', '+lastName']);

      grid.sortBy.calls.reset();

      // New click on id should reverse order of id column
      triggerClick(headers[2], true, false);
      expect(grid.sortBy).toHaveBeenCalledWith(['+lastName', '-firstName']);
      expect(grid.$sortBy).toEqual(['+lastName', '-firstName']);
    });

    it('should sort data when column footer is clicked using two field if shift key is pressed', function() {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(footers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$sortBy).toEqual(['+firstName']);

      grid.sortBy.calls.reset();

      // New click should reverse order
      triggerClick(footers[3], true, false);
      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName', '+lastName']);
      expect(grid.$sortBy).toEqual(['+firstName', '+lastName']);

      grid.sortBy.calls.reset();

      // New click on id should reverse order of id column
      triggerClick(footers[2], true, false);

      expect(grid.sortBy).toHaveBeenCalledWith(['+lastName', '-firstName']);
      expect(grid.$sortBy).toEqual(['+lastName', '-firstName']);
    });
  });

  describe('once initialized without footer', function() {
    var headers;

    beforeEach(function() {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        view: {
          thead: true,
          tfoot: false
        }
      });

      headers = grid.$thead[0].childNodes[0].childNodes;
    });

    it('should not sort grid by default', function() {
      expect(grid.$sortBy).toEqual([]);

      expect(headers).toVerify(function(th) {
        return th.getAttribute('data-waffle-order') === null;
      });

      // First th is for checkbox

      expect(headers[1].className.split(' ')).not.toContain('waffle-sortable');
      expect(headers[2].className.split(' ')).toContain('waffle-sortable');
      expect(headers[3].className.split(' ')).toContain('waffle-sortable');

      expect(headers).toVerify(function(th) {
        return th.className.split(' ').indexOf('waffle-sortable-asc') < 0;
      });

      expect(headers).toVerify(function(th) {
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

    it('should sort grid in ascendant order using one field', function() {
      grid.sortBy('id');

      expect(grid.$sortBy).toEqual(['+id']);

      expect(headers[1].getAttribute('data-waffle-order')).toBe('+');
      expect(headers[2].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[1].className).toContain('waffle-sortable');
      expect(headers[1].className).toContain('waffle-sortable-asc');
      expect(headers[1].className).not.toContain('waffle-sortable-desc');

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).not.toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');

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

      expect(headers[1].getAttribute('data-waffle-order')).toBe('-');
      expect(headers[2].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[1].className).toContain('waffle-sortable');
      expect(headers[1].className).toContain('waffle-sortable-desc');
      expect(headers[1].className).not.toContain('waffle-sortable-asc');

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).not.toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

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

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(headers[3].getAttribute('data-waffle-order')).toBe('-');

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');

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
      triggerClick(headers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$sortBy).toEqual(['+firstName']);

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).toContain('waffle-sortable-asc');
      expect(headers[2].className).not.toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');

      grid.sortBy.calls.reset();

      // New click should reverse order
      triggerClick(headers[2]);

      // Th should have flag
      expect(grid.sortBy).toHaveBeenCalledWith(['-firstName']);
      expect(grid.$sortBy).toEqual(['-firstName']);

      expect(headers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(headers[2].getAttribute('data-waffle-order')).toBe('-');
      expect(headers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(headers[2].className).toContain('waffle-sortable');
      expect(headers[2].className).not.toContain('waffle-sortable-asc');
      expect(headers[2].className).toContain('waffle-sortable-desc');

      expect(headers[3].className).toContain('waffle-sortable');
      expect(headers[3].className).not.toContain('waffle-sortable-desc');
      expect(headers[3].className).not.toContain('waffle-sortable-asc');
    });

    it('should not sort data when column header is clicked and column is not sortable', function() {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(headers[1]);

      expect(grid.sortBy).not.toHaveBeenCalled();
      expect(grid.$sortBy).toEqual([]);
    });

    it('should sort data when column header is clicked using two field if shift key is pressed', function() {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(headers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$sortBy).toEqual(['+firstName']);

      grid.sortBy.calls.reset();

      // New click should reverse order
      triggerClick(headers[3], true, false);
      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName', '+lastName']);
      expect(grid.$sortBy).toEqual(['+firstName', '+lastName']);

      grid.sortBy.calls.reset();

      // New click on id should reverse order of id column
      triggerClick(headers[2], true, false);
      expect(grid.sortBy).toHaveBeenCalledWith(['+lastName', '-firstName']);
      expect(grid.$sortBy).toEqual(['+lastName', '-firstName']);
    });
  });

  describe('once initialized without header', function() {
    var footers;

    beforeEach(function() {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        view: {
          thead: false,
          tfoot: true
        }
      });

      footers = grid.$tfoot[0].childNodes[0].childNodes;
    });

    it('should not sort grid by default', function() {
      expect(grid.$sortBy).toEqual([]);

      expect(footers).toVerify(function(th) {
        return th.getAttribute('data-waffle-order') === null;
      });

      // First th is for checkbox

      expect(footers[1].className.split(' ')).not.toContain('waffle-sortable');
      expect(footers[2].className.split(' ')).toContain('waffle-sortable');
      expect(footers[3].className.split(' ')).toContain('waffle-sortable');

      expect(footers).toVerify(function(th) {
        return th.className.split(' ').indexOf('waffle-sortable-asc') < 0;
      });

      expect(footers).toVerify(function(th) {
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

    it('should sort grid in ascendant order using one field', function() {
      grid.sortBy('id');

      expect(grid.$sortBy).toEqual(['+id']);

      expect(footers[1].getAttribute('data-waffle-order')).toBe('+');
      expect(footers[2].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[1].className).toContain('waffle-sortable');
      expect(footers[1].className).toContain('waffle-sortable-asc');
      expect(footers[1].className).not.toContain('waffle-sortable-desc');

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).not.toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');

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

      expect(footers[1].getAttribute('data-waffle-order')).toBe('-');
      expect(footers[2].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[1].className).toContain('waffle-sortable');
      expect(footers[1].className).toContain('waffle-sortable-desc');
      expect(footers[1].className).not.toContain('waffle-sortable-asc');

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).not.toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

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

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(footers[3].getAttribute('data-waffle-order')).toBe('-');

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');

      expect(grid.$data.toArray()).toBeSorted(function(o1, o2) {
        return (o1.firstName.localeCompare(o2.firstName)) ||
               (o1.lastName.localeCompare(o2.lastName) * -1);
      });

      expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
        return tr.childNodes[3].innerHTML === grid.$data[idx].lastName.toString();
      });
    });

    it('should sort data when column footer is clicked', function() {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(footers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$sortBy).toEqual(['+firstName']);

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('+');
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).toContain('waffle-sortable-asc');
      expect(footers[2].className).not.toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');

      grid.sortBy.calls.reset();

      // New click should reverse order
      triggerClick(footers[2]);

      // Th should have flag
      expect(grid.sortBy).toHaveBeenCalledWith(['-firstName']);
      expect(grid.$sortBy).toEqual(['-firstName']);

      expect(footers[1].getAttribute('data-waffle-order')).toBeNull();
      expect(footers[2].getAttribute('data-waffle-order')).toBe('-');
      expect(footers[3].getAttribute('data-waffle-order')).toBeNull();

      expect(footers[2].className).toContain('waffle-sortable');
      expect(footers[2].className).not.toContain('waffle-sortable-asc');
      expect(footers[2].className).toContain('waffle-sortable-desc');

      expect(footers[3].className).toContain('waffle-sortable');
      expect(footers[3].className).not.toContain('waffle-sortable-desc');
      expect(footers[3].className).not.toContain('waffle-sortable-asc');
    });

    it('should not sort data when column footer is clicked and column is not sortable', function() {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(footers[1]);

      expect(grid.sortBy).not.toHaveBeenCalled();
      expect(grid.$sortBy).toEqual([]);
    });

    it('should sort data when column footer is clicked using two field if shift key is pressed', function() {
      spyOn(grid, 'sortBy').and.callThrough();

      // Trigger click
      triggerClick(footers[2]);

      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName']);
      expect(grid.$sortBy).toEqual(['+firstName']);

      grid.sortBy.calls.reset();

      // New click should reverse order
      triggerClick(footers[3], true, false);
      expect(grid.sortBy).toHaveBeenCalledWith(['+firstName', '+lastName']);
      expect(grid.$sortBy).toEqual(['+firstName', '+lastName']);

      grid.sortBy.calls.reset();

      // New click on id should reverse order of id column
      triggerClick(footers[2], true, false);

      expect(grid.sortBy).toHaveBeenCalledWith(['+lastName', '-firstName']);
      expect(grid.$sortBy).toEqual(['+lastName', '-firstName']);
    });
  });
});
