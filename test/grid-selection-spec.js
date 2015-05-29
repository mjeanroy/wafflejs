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

  var columns, data, table, grid, tbody, thead;

  var findCheckbox = function(row) {
    return row.childNodes[0].childNodes[0];
  };

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

  it('should initialize selection collection', function() {
    grid = new Grid(table, {
      data: data,
      columns: columns
    });

    expect(grid.$selection).toBeDefined();
    expect(grid.$selection).toBeEmpty();
    expect(grid.$selection.options()).toEqual(grid.$data.options());
  });

  it('should check if data is selected', function() {
    grid = new Grid(table, {
      data: data,
      columns: columns
    });

    expect(grid.isSelected()).toBeFalse();
    expect(grid.isSelected(grid.$data[0])).toBeFalse();
    expect(grid.isSelected(grid.$data[1])).toBeFalse();
    expect(grid.isSelected(grid.$data[2])).toBeFalse();

    grid.$selection.push(grid.$data[0]);

    expect(grid.isSelected()).toBeFalse();
    expect(grid.isSelected(grid.$data[0])).toBeTrue();
    expect(grid.isSelected(grid.$data[1])).toBeFalse();
    expect(grid.isSelected(grid.$data[2])).toBeFalse();

    grid.$selection.push(grid.$data[1]);

    expect(grid.isSelected()).toBeFalse();
    expect(grid.isSelected(grid.$data[0])).toBeTrue();
    expect(grid.isSelected(grid.$data[1])).toBeTrue();
    expect(grid.isSelected(grid.$data[2])).toBeFalse();

    grid.$selection.push(grid.$data[2]);

    expect(grid.isSelected()).toBeTrue();
    expect(grid.isSelected(grid.$data[0])).toBeTrue();
    expect(grid.isSelected(grid.$data[1])).toBeTrue();
    expect(grid.isSelected(grid.$data[2])).toBeTrue();
  });

  it('should check that grid does has checkbox', function() {
    grid = new Grid(table, {
      data: data,
      columns: columns,
      selection: {
        checkbox: true
      }
    });

    expect(grid.hasCheckbox()).toBeTrue();

    grid = new Grid(table, {
      data: data,
      columns: columns,
      selection: {
        checkbox: false
      }
    });

    expect(grid.hasCheckbox()).toBeFalse();
  });

  describe('with single selection', function() {
    beforeEach(function() {
      grid = new Grid(table, {
        data: data,
        columns: columns
      });

      tbody = grid.$tbody[0];
      thead = grid.$thead[0];
    });

    it('should select data when row is clicked', function() {
      var row = tbody.childNodes[1];

      triggerClick(row);

      var expectedSelection = [grid.$data[1]];
      expect(grid.$selection.toArray()).toEqual(expectedSelection);

      jasmine.clock().tick();

      var trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).not.toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs[0]).checked).toBeFalse();
      expect(findCheckbox(trs[1]).checked).toBeTrue();
      expect(findCheckbox(trs[2]).checked).toBeFalse();

      var span = thead.childNodes[0].childNodes[0].childNodes[0];
      var mainCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('1');
      expect(span.getAttribute('title')).toBe('1');
      expect(mainCheckbox.checked).toBeFalse();

      // New click should toggle selection
      triggerClick(row);

      expect(grid.$selection).toBeEmpty();

      jasmine.clock().tick();

      expect(tbody.childNodes).toVerify(function(tr) {
        var className = tr.getAttribute('class') || '';
        return className.indexOf(CSS_SELECTED) < 0;
      });

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('0');
      expect(span.getAttribute('title')).toBe('0');
      expect(mainCheckbox.checked).toBeFalse();
    });

    it('should replace select data when new row is clicked', function() {
      var row1 = tbody.childNodes[1];
      var row2 = tbody.childNodes[2];

      triggerClick(row1);

      expect(grid.$selection.toArray()).toEqual([grid.$data[1]]);

      jasmine.clock().tick();

      var trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).not.toContain(CSS_SELECTED);

      var span = thead.childNodes[0].childNodes[0].childNodes[0];
      var mainCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];

      // Check status of checkbox
      expect(findCheckbox(trs[0]).checked).toBeFalse();
      expect(findCheckbox(trs[1]).checked).toBeTrue();
      expect(findCheckbox(trs[2]).checked).toBeFalse();

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('1');
      expect(span.getAttribute('title')).toBe('1');
      expect(mainCheckbox.checked).toBeFalse();

      // New click should toggle selection
      triggerClick(row2);

      expect(grid.$selection.toArray()).toEqual([grid.$data[2]]);

      jasmine.clock().tick();

      trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs[0]).checked).toBeFalse();
      expect(findCheckbox(trs[1]).checked).toBeFalse();
      expect(findCheckbox(trs[2]).checked).toBeTrue();

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('1');
      expect(span.getAttribute('title')).toBe('1');
      expect(mainCheckbox.checked).toBeFalse();
    });

    it('should keep current selection after sort', function() {
      var id1 = 1;
      var id2 = 2;
      var id3 = 3;

      // [1,2]
      grid.$selection.push(grid.$data[1], grid.$data[2]);
      jasmine.clock().tick();

      // Sort should swap first and second lines. => [0,2]
      grid.sortBy('lastName');
      jasmine.clock().tick();

      var trs = tbody.childNodes;

      expect(grid.$data[0].id).toEqual(id1);
      expect(trs[0].getAttribute('class')).toContain(CSS_SELECTED);

      expect(grid.$data[1].id).toEqual(id2);
      expect(trs[1].getAttribute('class')).not.toContain(CSS_SELECTED);

      expect(grid.$data[2].id).toEqual(id3);
      expect(trs[2].getAttribute('class')).toContain(CSS_SELECTED);

      expect(grid.$selection).toHaveLength(2);
      expect(grid.$selection[0]).toEqual(grid.$data[0]);
      expect(grid.$selection[1]).toEqual(grid.$data[2]);

      // Check status of checkbox
      expect(findCheckbox(trs[0]).checked).toBeTrue();
      expect(findCheckbox(trs[1]).checked).toBeFalse();
      expect(findCheckbox(trs[2]).checked).toBeTrue();

      var span = thead.childNodes[0].childNodes[0].childNodes[0];
      var mainCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('2');
      expect(span.getAttribute('title')).toBe('2');
      expect(mainCheckbox.checked).toBeFalse();
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
      thead = grid.$thead[0];
    });

    it('should select data when row is clicked', function() {
      var row = tbody.childNodes[1];

      triggerClick(row);

      expect(grid.$selection.toArray()).toEqual([grid.$data[1]]);

      jasmine.clock().tick();

      var trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).not.toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs[0]).checked).toBeFalse();
      expect(findCheckbox(trs[1]).checked).toBeTrue();
      expect(findCheckbox(trs[2]).checked).toBeFalse();

      var span = thead.childNodes[0].childNodes[0].childNodes[0];
      var mainCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('1');
      expect(span.getAttribute('title')).toBe('1');
      expect(mainCheckbox.checked).toBeFalse();

      // New click should toggle selection
      triggerClick(row);

      expect(grid.$selection).toBeEmpty();

      jasmine.clock().tick();

      expect(tbody.childNodes).toVerify(function(tr) {
        var className = tr.getAttribute('class') || '';
        return className.indexOf(CSS_SELECTED) < 0;
      });

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('0');
      expect(span.getAttribute('title')).toBe('0');
      expect(mainCheckbox.checked).toBeFalse();
    });

    it('should add data to selection when new row is clicked with ctrl key', function() {
      var row1 = tbody.childNodes[1];
      var row2 = tbody.childNodes[2];

      triggerClick(row1);

      expect(grid.$selection.toArray()).toEqual([grid.$data[1]]);

      jasmine.clock().tick();

      var trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).not.toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs[0]).checked).toBeFalse();
      expect(findCheckbox(trs[1]).checked).toBeTrue();
      expect(findCheckbox(trs[2]).checked).toBeFalse();

      var span = thead.childNodes[0].childNodes[0].childNodes[0];
      var mainCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('1');
      expect(span.getAttribute('title')).toBe('1');
      expect(mainCheckbox.checked).toBeFalse();

      // New click should toggle selection
      triggerClick(row2, false, true);

      expect(grid.$selection.toArray()).toEqual([grid.$data[1], grid.$data[2]]);

      jasmine.clock().tick();

      trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs[0]).checked).toBeFalse();
      expect(findCheckbox(trs[1]).checked).toBeTrue();
      expect(findCheckbox(trs[2]).checked).toBeTrue();

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('2');
      expect(span.getAttribute('title')).toBe('2');
      expect(mainCheckbox.checked).toBeFalse();
    });

    it('should add set of data to selection when new row is clicked with shift key', function() {
      var row0 = tbody.childNodes[0];
      var row2 = tbody.childNodes[2];

      triggerClick(row0);

      expect(grid.$selection.toArray()).toEqual([grid.$data[0]]);

      jasmine.clock().tick();

      var trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).not.toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs[0]).checked).toBeTrue();
      expect(findCheckbox(trs[1]).checked).toBeFalse();
      expect(findCheckbox(trs[2]).checked).toBeFalse();

      var span = thead.childNodes[0].childNodes[0].childNodes[0];
      var mainCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('1');
      expect(span.getAttribute('title')).toBe('1');
      expect(mainCheckbox.checked).toBeFalse();

      // New click should toggle selection
      triggerClick(row2, true);

      expect(grid.$selection.toArray()).toEqual([grid.$data[0], grid.$data[1], grid.$data[2]]);

      jasmine.clock().tick();

      trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs[0]).checked).toBeTrue();
      expect(findCheckbox(trs[1]).checked).toBeTrue();
      expect(findCheckbox(trs[2]).checked).toBeTrue();

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('3');
      expect(span.getAttribute('title')).toBe('3');
      expect(mainCheckbox.checked).toBeTrue();
    });
  });

  describe('without checkbox', function() {
    beforeEach(function() {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        selection: {
          checkbox: false
        }
      });

      tbody = grid.$tbody[0];
    });

    it('should not update checkbox row is clicked', function() {
      var row1 = tbody.childNodes[1];
      var row2 = tbody.childNodes[2];

      triggerClick(row1);

      expect(grid.$selection.toArray()).toEqual([grid.$data[1]]);

      jasmine.clock().tick();

      var trs = tbody.childNodes;

      expect(trs[0].childNodes.length).toBe(3);
      expect(trs[1].childNodes.length).toBe(3);
      expect(trs[2].childNodes.length).toBe(3);

      expect(trs[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).not.toContain(CSS_SELECTED);

      // New click should toggle selection
      triggerClick(row2);

      expect(grid.$selection.toArray()).toEqual([grid.$data[2]]);

      jasmine.clock().tick();

      trs = tbody.childNodes;

      expect(trs[0].childNodes.length).toBe(3);
      expect(trs[1].childNodes.length).toBe(3);
      expect(trs[2].childNodes.length).toBe(3);

      expect(trs[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).toContain(CSS_SELECTED);
    });
  })
});
