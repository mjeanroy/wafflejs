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

describe('Grid Filter', function() {

  var table;
  var grid;
  var tbody;
  var childNodes;
  var oddPredicate;

  beforeEach(function() {
    var columns = [
      { id: 'id', sortable: false },
      { id: 'firstName' },
      { id: 'lastName' }
    ];

    var data = [
      { id: 1, firstName: 'foo1', lastName: 'bar1' },
      { id: 2, firstName: 'foo2', lastName: 'bar2' },
      { id: 3, firstName: 'foo2', lastName: 'bar3' }
    ];

    table = document.createElement('table');
    fixtures.appendChild(table);

    grid = new Grid(table, {
      data: data,
      columns: columns
    });

    tbody = grid.$tbody[0];
    childNodes = tbody.childNodes;

    spyOn(grid, 'dispatchEvent').and.callThrough();
    spyOn(GridFilter, 'applyFilter').and.callThrough();
  });

  beforeEach(function() {
    oddPredicate = jasmine.createSpy('predicate').and.callFake(function(data) {
      return data.id % 2 === 0;
    });
  });

  beforeEach(function() {
    expect(childNodes.length).toBe(3);
  });

  it('should filter grid and remove data that does not pass predicate', function() {
    var result = grid.filter(oddPredicate);

    expect(result).toBe(grid);
    expect(grid.$filter).toBe(oddPredicate);
    expect(GridFilter.applyFilter).toHaveBeenCalledWith(oddPredicate);

    // Check flags
    expect(grid.$data.$$map.get(1)).toEqual({
      idx: 0,
      visible: false
    });

    expect(grid.$data.$$map.get(2)).toEqual({
      idx: 1,
      visible: true
    });

    expect(grid.$data.$$map.get(3)).toEqual({
      idx: 2,
      visible: false
    });

    // Check removed data
    expect(childNodes.length).toBe(1);
    expect(childNodes[0].getAttribute('data-waffle-idx')).toBe('1');
    expect(childNodes[0].childNodes[1].innerHTML).toBe('2');

    expect(grid.dispatchEvent).toHaveBeenCalledWith('filterupdated', {
      predicate: oddPredicate,
      countVisible: 1,
      countFiltered: 2
    });
  });

  it('should filter grid and remove data that does not pass predicate, then display visible rows', function() {
    grid.filter(oddPredicate);

    expect(grid.$filter).toBe(oddPredicate);
    expect(GridFilter.applyFilter).toHaveBeenCalledWith(oddPredicate);

    // Check flags
    expect(grid.$data.$$map.get(1)).toEqual({
      idx: 0,
      visible: false
    });

    expect(grid.$data.$$map.get(2)).toEqual({
      idx: 1,
      visible: true
    });

    expect(grid.$data.$$map.get(3)).toEqual({
      idx: 2,
      visible: false
    });

    // Check removed data
    expect(childNodes.length).toBe(1);
    expect(childNodes[0].getAttribute('data-waffle-idx')).toBe('1');
    expect(childNodes[0].childNodes[1].innerHTML).toBe('2');

    expect(grid.dispatchEvent).toHaveBeenCalledWith('filterupdated', {
      predicate: oddPredicate,
      countVisible: 1,
      countFiltered: 2
    });

    grid.dispatchEvent.calls.reset();

    grid.filter();

    expect(grid.$filter).not.toBeDefined();
    expect(GridFilter.applyFilter).toHaveBeenCalledWith(undefined);

    // Check flags
    expect(grid.$data.$$map.get(1)).toEqual({
      idx: 0,
      visible: true
    });

    expect(grid.$data.$$map.get(2)).toEqual({
      idx: 1,
      visible: true
    });

    expect(grid.$data.$$map.get(3)).toEqual({
      idx: 2,
      visible: true
    });

    // Check visible data
    expect(tbody.childNodes.length).toBe(3);
    expect(tbody.childNodes[0].getAttribute('data-waffle-idx')).toBe('0');
    expect(tbody.childNodes[1].getAttribute('data-waffle-idx')).toBe('1');
    expect(tbody.childNodes[2].getAttribute('data-waffle-idx')).toBe('2');

    expect(tbody.childNodes[0].childNodes[1].innerHTML).toBe('1');
    expect(tbody.childNodes[1].childNodes[1].innerHTML).toBe('2');
    expect(tbody.childNodes[2].childNodes[1].innerHTML).toBe('3');

    expect(grid.dispatchEvent).toHaveBeenCalledWith('filterupdated', {
      predicate: undefined,
      countVisible: 3,
      countFiltered: 0
    });
  });

  it('should filter using a simple value', function() {
    var value = 'foo';
    var predicate = jasmine.createSpy('predicate').and.returnValue(false);
    spyOn($filters, '$create').and.returnValue(predicate);

    grid.filter(value);

    expect(grid.$filter).toBeDefined();
    expect(grid.$filter).toBeAFunction();
    expect(grid.$filter).toBe(predicate);
    expect($filters.$create).toHaveBeenCalledWith(value);
  });

  it('should remove filter', function() {
    grid.filter(oddPredicate);

    expect(grid.$filter).toBe(oddPredicate);
    expect(GridFilter.applyFilter).toHaveBeenCalledWith(oddPredicate);

    // Check flags
    expect(grid.$data.$$map.get(1)).toEqual({
      idx: 0,
      visible: false
    });

    expect(grid.$data.$$map.get(2)).toEqual({
      idx: 1,
      visible: true
    });

    expect(grid.$data.$$map.get(3)).toEqual({
      idx: 2,
      visible: false
    });

    spyOn(grid, 'filter').and.callThrough();

    var result = grid.removeFilter();

    expect(result).toBe(grid);
    expect(grid.filter).toHaveBeenCalledWith(undefined);
    expect(grid.$filter).not.toBeDefined();
    expect(GridFilter.applyFilter).toHaveBeenCalledWith(undefined);
  });

  it('should try to remove filter if filter is alreay undefined', function() {
    expect(grid.$filter).not.toBeDefined();

    spyOn(grid, 'filter').and.callThrough();

    grid.removeFilter();

    expect(grid.filter).not.toHaveBeenCalled();
    expect(grid.$filter).not.toBeDefined();
    expect(GridFilter.applyFilter).not.toHaveBeenCalled();
  });

  it('should check if data is visible', function() {
    var data = grid.$data;

    expect(grid.isVisible(data[0])).toBeTrue();
    expect(grid.isVisible(data[1])).toBeTrue();
    expect(grid.isVisible(data[2])).toBeTrue();

    grid.filter(oddPredicate);

    expect(grid.isVisible(data[0])).toBeFalse();
    expect(grid.isVisible(data[1])).toBeTrue();
    expect(grid.isVisible(data[2])).toBeFalse();
  });

  it('should get visible data', function() {
    var data = grid.$data;
    expect(grid.visibleData()).toEqual([data[0], data[1], data[2]]);

    grid.filter(oddPredicate);
    expect(grid.visibleData()).toEqual([data[1]]);
  });

  describe('on render', function() {
    it('should only render unfiltered data', function() {
      grid.filter(oddPredicate);
      expect(childNodes.length).toBe(1);

      grid.render();
      expect(childNodes.length).toBe(1);
    });

    it('should only render unfiltered data with async rendering', function() {
      grid.filter(oddPredicate);
      expect(childNodes.length).toBe(1);

      spyOn(GridBuilder, 'tbodyRows').and.callThrough();

      grid.render(true);

      expect(GridBuilder.tbodyRows).not.toHaveBeenCalled();
      expect(childNodes.length).toBe(1);

      jasmine.clock().tick();

      expect(GridBuilder.tbodyRows).toHaveBeenCalled();
      expect(childNodes.length).toBe(1);
    });
  });

  describe('on data splice', function() {
    var data;
    var map;

    beforeEach(function() {
      data = grid.$data;
      map = data.$$map;
    });

    it('should not display filtered data when data collection is unshifted', function() {
      grid.filter(oddPredicate);

      // Check flags
      expect(map.get(1)).toEqual({
        idx: 0,
        visible: false
      });

      expect(map.get(2)).toEqual({
        idx: 1,
        visible: true
      });

      expect(map.get(3)).toEqual({
        idx: 2,
        visible: false
      });

      // Check removed data
      expect(childNodes.length).toBe(1);
      expect(childNodes[0].getAttribute('data-waffle-idx')).toBe('1');
      expect(childNodes[0].childNodes[1].innerHTML).toBe('2');

      // Push some data
      data.unshift(
        { id: 4, firstName: 'foo4', lastName: 'bar4' },
        { id: 5, firstName: 'foo5', lastName: 'bar5' },
        { id: 6, firstName: 'foo6', lastName: 'bar5' }
      );

      jasmine.clock().tick();

      expect(childNodes.length).toBe(1 + 2);

      expect(childNodes[0].childNodes[1].innerHTML).toBe('4');
      expect(childNodes[1].childNodes[1].innerHTML).toBe('6');
      expect(childNodes[2].childNodes[1].innerHTML).toBe('2');

      expect(childNodes[0].getAttribute('data-waffle-idx')).toBe('0');
      expect(childNodes[1].getAttribute('data-waffle-idx')).toBe('2');
      expect(childNodes[2].getAttribute('data-waffle-idx')).toBe('4');
    });

    it('should not display filtered data when data collection is pushed', function() {
      grid.filter(oddPredicate);

      // Check flags
      expect(map.get(1)).toEqual({
        idx: 0,
        visible: false
      });

      expect(map.get(2)).toEqual({
        idx: 1,
        visible: true
      });

      expect(map.get(3)).toEqual({
        idx: 2,
        visible: false
      });

      // Check removed data
      expect(childNodes.length).toBe(1);
      expect(childNodes[0].getAttribute('data-waffle-idx')).toBe('1');
      expect(childNodes[0].childNodes[1].innerHTML).toBe('2');

      // Push some data
      data.push(
        { id: 4, firstName: 'foo4', lastName: 'bar4' },
        { id: 5, firstName: 'foo5', lastName: 'bar5' },
        { id: 6, firstName: 'foo6', lastName: 'bar5' }
      );

      jasmine.clock().tick();

      expect(tbody.childNodes.length).toBe(1 + 2);

      expect(childNodes[0].childNodes[1].innerHTML).toBe('2');
      expect(childNodes[1].childNodes[1].innerHTML).toBe('4');
      expect(childNodes[2].childNodes[1].innerHTML).toBe('6');

      expect(childNodes[0].getAttribute('data-waffle-idx')).toBe('1');
      expect(childNodes[1].getAttribute('data-waffle-idx')).toBe('3');
      expect(childNodes[2].getAttribute('data-waffle-idx')).toBe('5');
    });

    it('should not display anything but indexes should be updated', function() {
      grid.filter(oddPredicate);

      // Check flags
      expect(map.get(1)).toEqual({
        idx: 0,
        visible: false
      });

      expect(map.get(2)).toEqual({
        idx: 1,
        visible: true
      });

      expect(map.get(3)).toEqual({
        idx: 2,
        visible: false
      });

      // Check removed data
      expect(childNodes.length).toBe(1);
      expect(childNodes[0].getAttribute('data-waffle-idx')).toBe('1');
      expect(childNodes[0].childNodes[1].innerHTML).toBe('2');

      // Push some data
      data.unshift(
        { id: 5, firstName: 'foo5', lastName: 'bar5' }
      );

      jasmine.clock().tick();

      expect(childNodes.length).toBe(1);
      expect(childNodes[0].childNodes[1].innerHTML).toBe('2');
      expect(childNodes[0].getAttribute('data-waffle-idx')).toBe('2');
    });

    it('should not try to remove filtered row when collection is shifted', function() {
      grid.filter(oddPredicate);

      // Check flags
      expect(map.get(1)).toEqual({
        idx: 0,
        visible: false
      });

      expect(map.get(2)).toEqual({
        idx: 1,
        visible: true
      });

      expect(map.get(3)).toEqual({
        idx: 2,
        visible: false
      });

      // Check removed data
      expect(childNodes.length).toBe(1);
      expect(childNodes[0].getAttribute('data-waffle-idx')).toBe('1');
      expect(childNodes[0].childNodes[1].innerHTML).toBe('2');

      // Push some data
      data.shift();

      jasmine.clock().tick();

      expect(childNodes.length).toBe(1);
      expect(childNodes[0].getAttribute('data-waffle-idx')).toBe('0');
      expect(childNodes[0].childNodes[1].innerHTML).toBe('2');
    });

    it('should not try to remove filtered row when collection is popped', function() {
      grid.filter(oddPredicate);

      // Check flags
      expect(map.get(1)).toEqual({
        idx: 0,
        visible: false
      });

      expect(map.get(2)).toEqual({
        idx: 1,
        visible: true
      });

      expect(map.get(3)).toEqual({
        idx: 2,
        visible: false
      });

      // Check removed data
      expect(childNodes.length).toBe(1);
      expect(childNodes[0].getAttribute('data-waffle-idx')).toBe('1');
      expect(childNodes[0].childNodes[1].innerHTML).toBe('2');

      // Push some data
      data.pop();

      jasmine.clock().tick();

      expect(childNodes.length).toBe(1);
      expect(childNodes[0].getAttribute('data-waffle-idx')).toBe('1');
      expect(childNodes[0].childNodes[1].innerHTML).toBe('2');
    });

    it('should not try to remove filtered row but remove unfiltered row when collection is spliced', function() {
      grid.filter(oddPredicate);

      // Check flags
      expect(map.get(1)).toEqual({
        idx: 0,
        visible: false
      });

      expect(map.get(2)).toEqual({
        idx: 1,
        visible: true
      });

      expect(map.get(3)).toEqual({
        idx: 2,
        visible: false
      });

      // Check removed data
      expect(childNodes.length).toBe(1);
      expect(childNodes[0].getAttribute('data-waffle-idx')).toBe('1');
      expect(childNodes[0].childNodes[1].innerHTML).toBe('2');

      // Push some data
      data.splice(1, 2);

      jasmine.clock().tick();

      expect(childNodes.length).toBe(0);
    });

    it('should not try to add nodes to an empty grid', function() {
      var falsePredicate = jasmine.createSpy('predicate').and.callFake(function(data) {
        return false;
      });

      grid.filter(falsePredicate);

      // Check flags
      expect(map.get(1)).toEqual({
        idx: 0,
        visible: false
      });

      expect(map.get(2)).toEqual({
        idx: 1,
        visible: false
      });

      expect(map.get(3)).toEqual({
        idx: 2,
        visible: false
      });

      // Check removed data
      expect(childNodes.length).toBe(0);

      // Push some data
      data.push({
        id: 4,
        firstName: 'foo4',
        lastName: 'bar4'
      });

      jasmine.clock().tick();

      expect(childNodes.length).toBe(0);
    });
  });

  describe('on data update', function() {
    var data;

    beforeEach(function() {
      data = grid.$data;
    });

    it('should not try to update a filtered row', function() {
      grid.filter(oddPredicate);

      grid.dispatchEvent.calls.reset();
      data.triggerUpdate(0);
      jasmine.clock().tick();

      expect(grid.dispatchEvent).not.toHaveBeenCalled();
    });

    it('should not update row at valid index', function() {
      grid.filter(oddPredicate);

      grid.dispatchEvent.calls.reset();
      data.triggerUpdate(1);
      jasmine.clock().tick();

      expect(grid.dispatchEvent).toHaveBeenCalledWith('dataupdated', {
        index: 1,
        nodeIndex: 0,
        oldNode: childNodes[0],
        newNode: childNodes[0]
      });
    });
  });

  describe('on selection splice', function() {
    var data;
    var selection;

    beforeEach(function() {
      data = grid.$data;
      selection = grid.$selection;
    });

    it('should not try to select row when data collection is unshifted', function() {
      grid.filter(oddPredicate);

      expect(childNodes).toHaveLength(1);
      expect(selection).toBeEmpty();

      selection.push(data[0]);
      jasmine.clock().tick();

      var row = childNodes[0];
      expect(row.className).not.toContain('waffle-selected');

      var td = row.childNodes[0];
      var checkbox = td.childNodes[0];
      expect(checkbox.checked).toBeFalse();
    });

    it('should not try to unchecked row when data collection is unshifted', function() {
      selection.push(data[0]);
      selection.push(data[1]);
      jasmine.clock().tick();

      expect(childNodes[0].className).toContain('waffle-selected');
      expect(childNodes[1].className).toContain('waffle-selected');

      grid.filter(oddPredicate);

      expect(childNodes).toHaveLength(1);
      expect(selection).toHaveLength(2);

      selection.shift();
      jasmine.clock().tick();

      var row = childNodes[0];
      expect(row.className).toContain('waffle-selected');

      var td = row.childNodes[0];
      var checkbox = td.childNodes[0];
      expect(checkbox.checked).toBeTrue();
    });
  });
});
