/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mickael Jeanroy, Cedric Nisio
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

describe('Grid Selection', function() {

  var columns, data, table, grid, tbody;

  beforeEach(function() {
    spyOn(Grid.prototype, 'select').and.callThrough();

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

  describe('with single selection', function() {
    beforeEach(function() {
      grid = new Grid(table, {
        data: data,
        columns: columns
      });

      tbody = grid.$tbody[0];
    });

    it('should select data when row is clicked', function() {
      var row = tbody.childNodes[1];

      triggerClick(row);

      var expectedSelection = {1:grid.$data[1]};
      expect(grid.select).toHaveBeenCalledWith(expectedSelection);
      expect(grid.$selection).toEqual(expectedSelection);
      expect(grid.$data[1].$$selected).toBeTrue();

      var trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).toBeNull();
      expect(trs[1].getAttribute('class')).toBe(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).toBeNull();

      grid.select.calls.reset();

      // New click should toggle selection
      triggerClick(row);

      expect(grid.select).toHaveBeenCalledWith({});
      expect(grid.$selection).toEqual({});
      expect(grid.$data[1].$$selected).toBeFalse();
      expect(tbody.childNodes).toVerify(function(tr) {
        return tr.getAttribute('class') == null;
      });
    });

    it('should replace select data when new row is clicked', function() {
      var row1 = tbody.childNodes[1];
      var row2 = tbody.childNodes[2];

      triggerClick(row1);

      var expectedSelection = {1:grid.$data[1]};
      expect(grid.select).toHaveBeenCalledWith(expectedSelection);
      expect(grid.$selection).toEqual(expectedSelection);
      expect(grid.$data[1].$$selected).toBeTrue();

      var trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).toBeNull();
      expect(trs[1].getAttribute('class')).toBe(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).toBeNull();

      grid.select.calls.reset();

      // New click should toggle selection
      triggerClick(row2);

      var newExpectedSelection = {2:grid.$data[2]};
      expect(grid.select).toHaveBeenCalledWith(newExpectedSelection);
      expect(grid.$selection).toEqual(newExpectedSelection);
      expect(grid.$data[1].$$selected).toBeFalse();
      expect(grid.$data[2].$$selected).toBeTrue();

      trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).toBeNull();
      expect(trs[1].getAttribute('class')).toBeNull();
      expect(trs[2].getAttribute('class')).toBe(CSS_SELECTED);
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
      var trs = tbody.childNodes;
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
      var trs = tbody.childNodes;
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

      var trs = tbody.childNodes;

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

  describe('with multi selection', function() {
    beforeEach(function() {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        selection: {
          multi: true
        }
      });

      tbody = grid.$tbody[0];
    });

    it('should select data when row is clicked', function() {
      var row = tbody.childNodes[1];

      triggerClick(row);

      var expectedSelection = {
        1:grid.$data[1]
      };

      expect(grid.select).toHaveBeenCalledWith(expectedSelection);
      expect(grid.$selection).toEqual(expectedSelection);
      expect(grid.$data[1].$$selected).toBeTrue();

      var trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).toBeNull();
      expect(trs[1].getAttribute('class')).toBe(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).toBeNull();

      grid.select.calls.reset();

      // New click should toggle selection
      triggerClick(row);

      expect(grid.select).toHaveBeenCalledWith({});
      expect(grid.$selection).toEqual({});
      expect(grid.$data[1].$$selected).toBeFalse();
      expect(tbody.childNodes).toVerify(function(tr) {
        return tr.getAttribute('class') == null;
      });
    });

    it('should add data to selection when new row is clicked with ctrl key', function() {
      var row1 = tbody.childNodes[1];
      var row2 = tbody.childNodes[2];

      triggerClick(row1);

      var expectedSelection = {
        1: grid.$data[1]
      };

      expect(grid.select).toHaveBeenCalledWith(expectedSelection);
      expect(grid.$selection).toEqual(expectedSelection);
      expect(grid.$data[1].$$selected).toBeTrue();

      var trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).toBeNull();
      expect(trs[1].getAttribute('class')).toBe(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).toBeNull();

      grid.select.calls.reset();

      // New click should toggle selection
      triggerClick(row2, false, true);

      var newExpectedSelection = {
        1: grid.$data[1],
        2: grid.$data[2]
      };

      expect(grid.select).toHaveBeenCalledWith(newExpectedSelection);
      expect(grid.$selection).toEqual(newExpectedSelection);
      expect(grid.$data[1].$$selected).toBeTrue();
      expect(grid.$data[2].$$selected).toBeTrue();

      trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).toBeNull();
      expect(trs[1].getAttribute('class')).toBe(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).toBe(CSS_SELECTED);
    });

    it('should add set of data to selection when new row is clicked with shift key', function() {
      var row0 = tbody.childNodes[0];
      var row2 = tbody.childNodes[2];

      triggerClick(row0);

      var expectedSelection = {
        0: grid.$data[0]
      };

      expect(grid.select).toHaveBeenCalledWith(expectedSelection);
      expect(grid.$selection).toEqual(expectedSelection);
      expect(grid.$data[0].$$selected).toBeTrue();

      var trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).toBe(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).toBeNull();
      expect(trs[2].getAttribute('class')).toBeNull();

      grid.select.calls.reset();

      // New click should toggle selection
      triggerClick(row2, true);

      var newExpectedSelection = {
        0: grid.$data[0],
        1: grid.$data[1],
        2: grid.$data[2]
      };

      expect(grid.select).toHaveBeenCalledWith(newExpectedSelection);
      expect(grid.$selection).toEqual(newExpectedSelection);
      expect(grid.$data[0].$$selected).toBeTrue();
      expect(grid.$data[1].$$selected).toBeTrue();
      expect(grid.$data[2].$$selected).toBeTrue();

      trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).toBe(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).toBe(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).toBe(CSS_SELECTED);
    });
  });
});