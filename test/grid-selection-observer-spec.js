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
    spyOn(grid, 'dispatchEvent').and.callThrough();
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
      var theadSpan = thead.childNodes[0].childNodes[0].childNodes[0];
      var theadCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];

      var tfoot = grid.$tfoot[0];
      var tfootSpan = tfoot.childNodes[0].childNodes[0].childNodes[1];
      var tfootCheckbox = tfoot.childNodes[0].childNodes[0].childNodes[0];

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('1');
      expect(theadSpan.getAttribute('title')).toBe('1');
      expect(tfootSpan.innerHTML).toBe('1');
      expect(tfootSpan.getAttribute('title')).toBe('1');

      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeTrue();
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeTrue();

      expect(grid.dispatchEvent).toHaveBeenCalledWith('selectionchanged', jasmine.any(Function));

      var call = grid.dispatchEvent.calls.mostRecent();
      var evt = call.args[1].call(grid);
      expect(evt).toEqual({
        selection: grid.$selection.toArray()
      });
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
      var theadSpan = thead.childNodes[0].childNodes[0].childNodes[0];
      var theadCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];

      var tfoot = grid.$tfoot[0];
      var tfootSpan = tfoot.childNodes[0].childNodes[0].childNodes[1];
      var tfootCheckbox = tfoot.childNodes[0].childNodes[0].childNodes[0];

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('2');
      expect(theadSpan.getAttribute('title')).toBe('2');
      expect(tfootSpan.innerHTML).toBe('2');
      expect(tfootSpan.getAttribute('title')).toBe('2');

      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeTrue();
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeTrue();

      expect(grid.dispatchEvent).toHaveBeenCalledWith('selectionchanged', jasmine.any(Function));

      var call = grid.dispatchEvent.calls.mostRecent();
      var evt = call.args[1].call(grid);
      expect(evt).toEqual({
        selection: grid.$selection.toArray()
      });
    });

    it('should unselect multiple data', function() {
      var d1 = grid.$data[1];
      var d2 = grid.$data[2];

      $selection.push(d1, d2);
      jasmine.clock().tick();

      var tbody = grid.$tbody[0];
      var thead = grid.$thead[0];
      var tfoot = grid.$tbody[0];

      var childNodes = tbody.childNodes;
      expect(childNodes[0].className).not.toContain('waffle-selected');
      expect(childNodes[1].className).toContain('waffle-selected');
      expect(childNodes[2].className).toContain('waffle-selected');

      // Main checkbox should be updated
      var thead = grid.$thead[0];
      var theadSpan = thead.childNodes[0].childNodes[0].childNodes[0];
      var theadCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];

      var tfoot = grid.$tfoot[0];
      var tfootSpan = tfoot.childNodes[0].childNodes[0].childNodes[1];
      var tfootCheckbox = tfoot.childNodes[0].childNodes[0].childNodes[0];

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('2');
      expect(theadSpan.getAttribute('title')).toBe('2');
      expect(tfootSpan.innerHTML).toBe('2');
      expect(tfootSpan.getAttribute('title')).toBe('2');

      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeTrue();
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeTrue();

      $selection.pop();
      jasmine.clock().tick();

      expect(childNodes[0].className).not.toContain('waffle-selected');
      expect(childNodes[1].className).toContain('waffle-selected');
      expect(childNodes[2].className).not.toContain('waffle-selected');

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('1');
      expect(theadSpan.getAttribute('title')).toBe('1');
      expect(tfootSpan.innerHTML).toBe('1');
      expect(tfootSpan.getAttribute('title')).toBe('1');

      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeTrue();
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeTrue();

      $selection.pop();
      jasmine.clock().tick();

      expect(childNodes[0].className).not.toContain('waffle-selected');
      expect(childNodes[1].className).not.toContain('waffle-selected');
      expect(childNodes[2].className).not.toContain('waffle-selected');

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('0');
      expect(theadSpan.getAttribute('title')).toBe('0');
      expect(tfootSpan.innerHTML).toBe('0');
      expect(tfootSpan.getAttribute('title')).toBe('0');

      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeFalse();
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeFalse();

      expect(grid.dispatchEvent).toHaveBeenCalledWith('selectionchanged', jasmine.any(Function));

      var call = grid.dispatchEvent.calls.mostRecent();
      var evt = call.args[1].call(grid);
      expect(evt).toEqual({
        selection: grid.$selection.toArray()
      });
    });

    it('should unselect removed data', function() {
      var d1 = grid.$data[0];
      var d2 = grid.$data[1];

      grid.$selection.push(d1, d2);
      jasmine.clock().tick();

      var tbody = grid.$tbody[0];
      var thead = grid.$thead[0];
      var tfoot = grid.$tbody[0];

      var childNodes = tbody.childNodes;
      expect(childNodes.length).toBe(3);
      expect(childNodes[0].className).toContain('waffle-selected');
      expect(childNodes[1].className).toContain('waffle-selected');
      expect(childNodes[2].className).not.toContain('waffle-selected');

      // Now remove, data !
      grid.$data.shift();
      jasmine.clock().tick();
      jasmine.clock().tick();

      expect(childNodes.length).toBe(2);
      expect(childNodes[0].className).toContain('waffle-selected');
      expect(childNodes[1].className).not.toContain('waffle-selected');

      // Main checkbox should be updated
      var thead = grid.$thead[0];
      var theadSpan = thead.childNodes[0].childNodes[0].childNodes[0];
      var theadCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];

      var tfoot = grid.$tfoot[0];
      var tfootSpan = tfoot.childNodes[0].childNodes[0].childNodes[1];
      var tfootCheckbox = tfoot.childNodes[0].childNodes[0].childNodes[0];

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('1');
      expect(theadSpan.getAttribute('title')).toBe('1');
      expect(tfootSpan.innerHTML).toBe('1');
      expect(tfootSpan.getAttribute('title')).toBe('1');

      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeTrue();
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeTrue();

      expect(grid.dispatchEvent).toHaveBeenCalledWith('selectionchanged', jasmine.any(Function));

      var call = grid.dispatchEvent.calls.mostRecent();
      var evt = call.args[1].call(grid);
      expect(evt).toEqual({
        selection: grid.$selection.toArray()
      });
    });
  });
});
