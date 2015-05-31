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

  var columns, data, table, grid, $data;

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

    $selection = grid.$selection;

    spyOn(GridSelectionObserver, 'onSplice').and.callThrough();
    spyOn(grid, 'trigger').and.callThrough();
  });

  it('should call onSplice for a "splice" change', function() {
    var changes = [
      { type: 'splice', removed: [], index: 0, addedCount: 0, object: data }
    ];

    GridSelectionObserver.on(grid, changes);

    expect(GridSelectionObserver.onSplice).toHaveBeenCalledWith(grid, changes[0]);
  });

  it('should not call onUpdate for an "update" change', function() {
    var changes = [
      { type: 'update', removed: [], index: 0, addedCount: 0, object: data }
    ];

    GridSelectionObserver.on(grid, changes);
  });

  it('should call all changes', function() {
    var changes = [
      { type: 'splice', removed: [], index: 0, addedCount: 0, object: data },
      { type: 'update', removed: [], index: 0, addedCount: 0, object: data }
    ];

    GridSelectionObserver.on(grid, changes);

    expect(GridSelectionObserver.onSplice).toHaveBeenCalledWith(grid, changes[0]);
  });

  describe('with splice change', function() {
    it('should select data', function() {
      var d0 = grid.$data[0];

      $selection.push(d0);
      jasmine.clock().tick();

      var tbody = grid.$tbody[0];
      var childNodes = tbody.childNodes;
      expect(childNodes[0].className).toContain('waffle-selected');
      expect(childNodes[1].className).not.toContain('waffle-selected');
      expect(childNodes[2].className).not.toContain('waffle-selected');

      var thead = grid.$thead[0];
      var span = thead.childNodes[0].childNodes[0].childNodes[0];
      var mainCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('1');
      expect(span.getAttribute('title')).toBe('1');

      expect(mainCheckbox.checked).toBeFalse();
      expect(mainCheckbox.indeterminate).toBeTrue();
    });

    it('should select multiple data', function() {
      var d1 = grid.$data[1];
      var d2 = grid.$data[2];

      $selection.push(d1, d2);
      jasmine.clock().tick();

      var tbody = grid.$tbody[0];
      var childNodes = tbody.childNodes;
      expect(childNodes[0].className).not.toContain('waffle-selected');
      expect(childNodes[1].className).toContain('waffle-selected');
      expect(childNodes[2].className).toContain('waffle-selected');

      var thead = grid.$thead[0];
      var span = thead.childNodes[0].childNodes[0].childNodes[0];
      var mainCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('2');
      expect(span.getAttribute('title')).toBe('2');
      expect(mainCheckbox.checked).toBeFalse();
      expect(mainCheckbox.indeterminate).toBeTrue();
    });

    it('should unselect multiple data', function() {
      var d1 = grid.$data[1];
      var d2 = grid.$data[2];

      $selection.push(d1, d2);
      jasmine.clock().tick();

      var tbody = grid.$tbody[0];
      var thead = grid.$thead[0];
      var span = thead.childNodes[0].childNodes[0].childNodes[0];
      var mainCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];

      var childNodes = tbody.childNodes;
      expect(childNodes[0].className).not.toContain('waffle-selected');
      expect(childNodes[1].className).toContain('waffle-selected');
      expect(childNodes[2].className).toContain('waffle-selected');

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('2');
      expect(span.getAttribute('title')).toBe('2');
      expect(mainCheckbox.checked).toBeFalse();
      expect(mainCheckbox.indeterminate).toBeTrue();

      $selection.pop();
      jasmine.clock().tick();

      expect(childNodes[0].className).not.toContain('waffle-selected');
      expect(childNodes[1].className).toContain('waffle-selected');
      expect(childNodes[2].className).not.toContain('waffle-selected');

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('1');
      expect(span.getAttribute('title')).toBe('1');
      expect(mainCheckbox.checked).toBeFalse();
      expect(mainCheckbox.indeterminate).toBeTrue();

      $selection.pop();
      jasmine.clock().tick();

      expect(childNodes[0].className).not.toContain('waffle-selected');
      expect(childNodes[1].className).not.toContain('waffle-selected');
      expect(childNodes[2].className).not.toContain('waffle-selected');

      // Main checkbox should be updated
      expect(span.innerHTML).toBe('0');
      expect(span.getAttribute('title')).toBe('0');
      expect(mainCheckbox.checked).toBeFalse();
      expect(mainCheckbox.indeterminate).toBeFalse();
    });
  });
});
