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

describe('Grid Selection', () => {

  let columns, data, table, grid, tbody, thead, tfoot;
  let findCheckbox;

  beforeEach(() => {
    findCheckbox = row => row.childNodes[0].childNodes[0];

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

  it('should check if grid is selectable', () => {
    grid = new Grid(table, {
      data: data,
      columns: columns,
      selection: false
    });

    expect(grid.isSelectable()).toBeFalse();
    expect(grid.hasCheckbox()).toBeFalse();

    grid = new Grid(table, {
      data: data,
      columns: columns,
      selection: {
        enable: false
      }
    });

    expect(grid.isSelectable()).toBeFalse();
    expect(grid.hasCheckbox()).toBeFalse();

    grid = new Grid(table, {
      data: data,
      columns: columns,
      selection: {
        enable: true
      }
    });

    expect(grid.isSelectable()).toBeTrue();
    expect(grid.hasCheckbox()).toBeTrue();
  });

  it('should initialize selection collection', () => {
    grid = new Grid(table, {
      data: data,
      columns: columns
    });

    expect(grid.$selection).toBeDefined();
    expect(grid.$selection).toBeEmpty();
    expect(grid.$selection.options()).toEqual(grid.$data.options());
  });

  it('should initialize selection collection even if grid is not selectable', () => {
    grid = new Grid(table, {
      data: data,
      columns: columns,
      selection: {
        enable: false
      }
    });

    expect(grid.$selection).toBeDefined();
    expect(grid.$selection).toBeEmpty();
    expect(grid.$selection.options()).toEqual(grid.$data.options());
  });

  it('should not check if data is selected if grid is not selectable', () => {
    grid = new Grid(table, {
      data: data,
      columns: columns,
      selection: {
        enable: false
      }
    });

    expect(grid.isSelected()).toBeFalse();
    expect(grid.isSelected(grid.$data[0])).toBeFalse();
    expect(grid.isSelected(grid.$data[1])).toBeFalse();
    expect(grid.isSelected(grid.$data[2])).toBeFalse();
  });

  it('should select everything', () => {
    grid = new Grid(table, {
      data: data,
      columns: columns
    });

    expect(grid.$selection.length).toBe(0);

    grid.select();

    expect(grid.$selection.length).toBe(grid.$data.length);
  });

  it('should deselect everything', () => {
    grid = new Grid(table, {
      data: data,
      columns: columns
    });

    expect(grid.$selection.length).toBe(0);

    spyOn(grid.$selection, 'clear').and.callThrough();
    grid.deselect();
    expect(grid.$selection.clear).not.toHaveBeenCalled();

    grid.select();
    expect(grid.$selection.length).toBe(grid.$data.length);

    grid.deselect();
    expect(grid.$selection.length).toBe(0);
    expect(grid.$selection.clear).toHaveBeenCalled();
  });

  it('should select all selectable data', () => {
    const isEven = data => data.id % 2 === 0;
    const fn = jasmine.createSpy('fn').and.callFake(isEven);

    grid = new Grid(table, {
      data: data,
      columns: columns,
      selection: {
        enable: fn
      }
    });

    expect(grid.$selection.length).toBe(0);

    grid.select();

    expect(grid.$selection.length).not.toBeZero();
    expect(grid.$selection.length).not.toBe(grid.$data.length);
    expect(grid.$selection.length).toBe(1);
    expect(grid.$selection).toVerify(isEven);
  });

  it('should check if data is selected', () => {
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

  it('should check if data is selected', () => {
    const fn = jasmine.createSpy('fn').and.callFake(data => data.id % 2 === 0);

    grid = new Grid(table, {
      data: data,
      columns: columns,
      selection: {
        enable: fn
      }
    });

    fn.calls.reset();

    expect(grid.isSelected()).toBeFalse();
    expect(grid.isSelected(grid.$data[0])).toBeFalse();
    expect(grid.isSelected(grid.$data[1])).toBeFalse();
    expect(grid.isSelected(grid.$data[2])).toBeFalse();
    expect(fn).not.toHaveBeenCalled();

    grid.$selection.push(grid.$data[0]);

    expect(grid.isSelected()).toBeTrue();
    expect(grid.isSelected(grid.$data[0])).toBeTrue();
    expect(grid.isSelected(grid.$data[1])).toBeFalse();
    expect(grid.isSelected(grid.$data[2])).toBeFalse();
    expect(fn).toHaveBeenCalled();

    grid.$selection.push(grid.$data[1]);

    expect(grid.isSelected()).toBeTrue();
    expect(grid.isSelected(grid.$data[0])).toBeTrue();
    expect(grid.isSelected(grid.$data[1])).toBeTrue();
    expect(grid.isSelected(grid.$data[2])).toBeFalse();

    grid.$selection.push(grid.$data[2]);

    expect(grid.isSelected()).toBeTrue();
    expect(grid.isSelected(grid.$data[0])).toBeTrue();
    expect(grid.isSelected(grid.$data[1])).toBeTrue();
    expect(grid.isSelected(grid.$data[2])).toBeTrue();
  });

  it('should check that grid has checkbox', () => {
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

  describe('with single selection', () => {
    beforeEach(() => {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        view: {
          thead: true,
          tfoot: true
        }
      });

      tbody = grid.$tbody[0];
      thead = grid.$thead[0];
      tfoot = grid.$tfoot[0];
    });

    it('should select data when row is clicked', () => {
      const row = tbody.childNodes[1];

      triggerClick(row);

      const expectedSelection = [grid.$data[1]];
      expect(grid.$selection.toArray()).toEqual(expectedSelection);

      jasmine.clock().tick();

      const trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).not.toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs[0]).checked).toBeFalse();
      expect(findCheckbox(trs[1]).checked).toBeTrue();
      expect(findCheckbox(trs[2]).checked).toBeFalse();

      const theadSpan = thead.childNodes[0].childNodes[0].childNodes[0];
      const theadCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];
      const tfootSpan = tfoot.childNodes[0].childNodes[0].childNodes[1];
      const tfootCheckbox = tfoot.childNodes[0].childNodes[0].childNodes[0];

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('1');
      expect(theadSpan.getAttribute('title')).toBe('1');
      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeTrue();

      expect(tfootSpan.innerHTML).toBe('1');
      expect(tfootSpan.getAttribute('title')).toBe('1');
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeTrue();

      // New click should toggle selection
      triggerClick(row);

      expect(grid.$selection).toBeEmpty();

      jasmine.clock().tick();

      expect(tbody.childNodes).toVerify(tr => {
        const className = tr.getAttribute('class') || '';
        return className.indexOf(CSS_SELECTED) < 0;
      });

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('0');
      expect(theadSpan.getAttribute('title')).toBe('0');
      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeFalse();

      expect(tfootSpan.innerHTML).toBe('0');
      expect(tfootSpan.getAttribute('title')).toBe('0');
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeFalse();
    });

    it('should replace select data when new row is clicked', () => {
      const row1 = tbody.childNodes[1];
      const row2 = tbody.childNodes[2];

      triggerClick(row1);

      expect(grid.$selection.toArray()).toEqual([grid.$data[1]]);

      jasmine.clock().tick();

      const trs1 = tbody.childNodes;
      expect(trs1[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs1[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs1[2].getAttribute('class')).not.toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs1[0]).checked).toBeFalse();
      expect(findCheckbox(trs1[1]).checked).toBeTrue();
      expect(findCheckbox(trs1[2]).checked).toBeFalse();

      const theadSpan = thead.childNodes[0].childNodes[0].childNodes[0];
      const theadCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];
      const tfootSpan = tfoot.childNodes[0].childNodes[0].childNodes[1];
      const tfootCheckbox = tfoot.childNodes[0].childNodes[0].childNodes[0];

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('1');
      expect(theadSpan.getAttribute('title')).toBe('1');
      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeTrue();

      expect(tfootSpan.innerHTML).toBe('1');
      expect(tfootSpan.getAttribute('title')).toBe('1');
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeTrue();

      // New click should toggle selection
      triggerClick(row2);

      expect(grid.$selection.toArray()).toEqual([grid.$data[2]]);

      jasmine.clock().tick();

      const trs2 = tbody.childNodes;
      expect(trs2[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs2[1].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs2[2].getAttribute('class')).toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs2[0]).checked).toBeFalse();
      expect(findCheckbox(trs2[1]).checked).toBeFalse();
      expect(findCheckbox(trs2[2]).checked).toBeTrue();

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('1');
      expect(theadSpan.getAttribute('title')).toBe('1');
      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeTrue();

      expect(tfootSpan.innerHTML).toBe('1');
      expect(tfootSpan.getAttribute('title')).toBe('1');
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeTrue();
    });

    it('should keep current selection after sort', () => {
      const id1 = 1;
      const id2 = 2;
      const id3 = 3;

      // [1,2]
      grid.$selection.push(grid.$data[1], grid.$data[2]);
      jasmine.clock().tick();

      // Sort should swap first and second lines. => [0,2]
      grid.sortBy('lastName');
      jasmine.clock().tick();

      const trs = tbody.childNodes;

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

      const theadSpan = thead.childNodes[0].childNodes[0].childNodes[0];
      const theadCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];
      const tfootSpan = tfoot.childNodes[0].childNodes[0].childNodes[1];
      const tfootCheckbox = tfoot.childNodes[0].childNodes[0].childNodes[0];

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('2');
      expect(theadSpan.getAttribute('title')).toBe('2');
      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeTrue();

      expect(tfootSpan.innerHTML).toBe('2');
      expect(tfootSpan.getAttribute('title')).toBe('2');
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeTrue();
    });
  });

  describe('with multi selection', () => {
    beforeEach(() => {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        selection: {
          multi: true
        },
        view: {
          thead: true,
          tfoot: true
        }
      });

      tbody = grid.$tbody[0];
      thead = grid.$thead[0];
      tfoot = grid.$tfoot[0];
    });

    it('should select data when row is clicked', () => {
      const row = tbody.childNodes[1];

      triggerClick(row);

      expect(grid.$selection.toArray()).toEqual([grid.$data[1]]);

      jasmine.clock().tick();

      const trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).not.toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs[0]).checked).toBeFalse();
      expect(findCheckbox(trs[1]).checked).toBeTrue();
      expect(findCheckbox(trs[2]).checked).toBeFalse();

      const theadSpan = thead.childNodes[0].childNodes[0].childNodes[0];
      const theadCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];
      const tfootSpan = tfoot.childNodes[0].childNodes[0].childNodes[1];
      const tfootCheckbox = tfoot.childNodes[0].childNodes[0].childNodes[0];

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('1');
      expect(theadSpan.getAttribute('title')).toBe('1');
      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeTrue();

      expect(tfootSpan.innerHTML).toBe('1');
      expect(tfootSpan.getAttribute('title')).toBe('1');
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeTrue();

      // New click should toggle selection
      triggerClick(row);

      expect(grid.$selection).toBeEmpty();

      jasmine.clock().tick();

      expect(tbody.childNodes).toVerify(tr => {
        const className = tr.getAttribute('class') || '';
        return className.indexOf(CSS_SELECTED) < 0;
      });

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('0');
      expect(theadSpan.getAttribute('title')).toBe('0');
      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeFalse();

      expect(tfootSpan.innerHTML).toBe('0');
      expect(tfootSpan.getAttribute('title')).toBe('0');
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeFalse();
    });

    it('should add data to selection when new row is clicked with ctrl key', () => {
      const row1 = tbody.childNodes[1];
      const row2 = tbody.childNodes[2];

      triggerClick(row1);

      expect(grid.$selection.toArray()).toEqual([grid.$data[1]]);

      jasmine.clock().tick();

      const trs1 = tbody.childNodes;
      expect(trs1[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs1[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs1[2].getAttribute('class')).not.toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs1[0]).checked).toBeFalse();
      expect(findCheckbox(trs1[1]).checked).toBeTrue();
      expect(findCheckbox(trs1[2]).checked).toBeFalse();

      const theadSpan = thead.childNodes[0].childNodes[0].childNodes[0];
      const theadCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];
      const tfootSpan = tfoot.childNodes[0].childNodes[0].childNodes[1];
      const tfootCheckbox = tfoot.childNodes[0].childNodes[0].childNodes[0];

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('1');
      expect(theadSpan.getAttribute('title')).toBe('1');
      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeTrue();

      expect(tfootSpan.innerHTML).toBe('1');
      expect(tfootSpan.getAttribute('title')).toBe('1');
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeTrue();

      // New click should toggle selection
      triggerClick(row2, false, true);

      expect(grid.$selection.toArray()).toEqual([grid.$data[1], grid.$data[2]]);

      jasmine.clock().tick();

      const trs2 = tbody.childNodes;
      expect(trs2[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs2[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs2[2].getAttribute('class')).toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs2[0]).checked).toBeFalse();
      expect(findCheckbox(trs2[1]).checked).toBeTrue();
      expect(findCheckbox(trs2[2]).checked).toBeTrue();

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('2');
      expect(theadSpan.getAttribute('title')).toBe('2');
      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeTrue();

      expect(tfootSpan.innerHTML).toBe('2');
      expect(tfootSpan.getAttribute('title')).toBe('2');
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeTrue();
    });

    it('should add set of data to selection when new row is clicked with shift key', () => {
      const row0 = tbody.childNodes[0];
      const row2 = tbody.childNodes[2];

      triggerClick(row0);

      expect(grid.$selection.toArray()).toEqual([grid.$data[0]]);

      jasmine.clock().tick();

      const trs1 = tbody.childNodes;
      expect(trs1[0].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs1[1].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs1[2].getAttribute('class')).not.toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs1[0]).checked).toBeTrue();
      expect(findCheckbox(trs1[1]).checked).toBeFalse();
      expect(findCheckbox(trs1[2]).checked).toBeFalse();

      const theadSpan = thead.childNodes[0].childNodes[0].childNodes[0];
      const theadCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];
      const tfootSpan = tfoot.childNodes[0].childNodes[0].childNodes[1];
      const tfootCheckbox = tfoot.childNodes[0].childNodes[0].childNodes[0];

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('1');
      expect(theadSpan.getAttribute('title')).toBe('1');
      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeTrue();

      expect(tfootSpan.innerHTML).toBe('1');
      expect(tfootSpan.getAttribute('title')).toBe('1');
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeTrue();

      // New click should toggle selection
      triggerClick(row2, true);

      expect(grid.$selection.toArray()).toEqual([grid.$data[0], grid.$data[1], grid.$data[2]]);

      jasmine.clock().tick();

      const trs2 = tbody.childNodes;
      expect(trs2[0].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs2[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs2[2].getAttribute('class')).toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs2[0]).checked).toBeTrue();
      expect(findCheckbox(trs2[1]).checked).toBeTrue();
      expect(findCheckbox(trs2[2]).checked).toBeTrue();

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('3');
      expect(theadSpan.getAttribute('title')).toBe('3');
      expect(theadCheckbox.checked).toBeTrue();
      expect(theadCheckbox.indeterminate).toBeFalse();

      expect(tfootSpan.innerHTML).toBe('3');
      expect(tfootSpan.getAttribute('title')).toBe('3');
      expect(tfootCheckbox.checked).toBeTrue();
      expect(tfootCheckbox.indeterminate).toBeFalse();
    });
  });

  describe('without checkbox', () => {
    beforeEach(() => {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        selection: {
          checkbox: false
        }
      });

      tbody = grid.$tbody[0];
    });

    it('should not try to update checkbox row is clicked', () => {
      const row1 = tbody.childNodes[1];
      const row2 = tbody.childNodes[2];

      triggerClick(row1);

      expect(grid.$selection.toArray()).toEqual([grid.$data[1]]);

      jasmine.clock().tick();

      const trs1 = tbody.childNodes;

      expect(trs1[0].childNodes.length).toBe(3);
      expect(trs1[1].childNodes.length).toBe(3);
      expect(trs1[2].childNodes.length).toBe(3);

      expect(trs1[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs1[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs1[2].getAttribute('class')).not.toContain(CSS_SELECTED);

      // New click should toggle selection
      triggerClick(row2);

      expect(grid.$selection.toArray()).toEqual([grid.$data[2]]);

      jasmine.clock().tick();

      const trs2 = tbody.childNodes;

      expect(trs2[0].childNodes.length).toBe(3);
      expect(trs2[1].childNodes.length).toBe(3);
      expect(trs2[2].childNodes.length).toBe(3);

      expect(trs2[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs2[1].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs2[2].getAttribute('class')).toContain(CSS_SELECTED);
    });
  });

  describe('without footer', () => {
    beforeEach(() => {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        view: {
          thead: true,
          tfoot: false
        }
      });

      tbody = grid.$tbody[0];
      thead = grid.$thead[0];
    });

    it('should select data when row is clicked', () => {
      const row = tbody.childNodes[1];

      triggerClick(row);

      const expectedSelection = [grid.$data[1]];
      expect(grid.$selection.toArray()).toEqual(expectedSelection);

      jasmine.clock().tick();

      const trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).not.toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs[0]).checked).toBeFalse();
      expect(findCheckbox(trs[1]).checked).toBeTrue();
      expect(findCheckbox(trs[2]).checked).toBeFalse();

      const theadSpan = thead.childNodes[0].childNodes[0].childNodes[0];
      const theadCheckbox = thead.childNodes[0].childNodes[0].childNodes[1];

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('1');
      expect(theadSpan.getAttribute('title')).toBe('1');
      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeTrue();

      // New click should toggle selection
      triggerClick(row);

      expect(grid.$selection).toBeEmpty();

      jasmine.clock().tick();

      expect(tbody.childNodes).toVerify(tr => {
        const className = tr.getAttribute('class') || '';
        return className.indexOf(CSS_SELECTED) < 0;
      });

      // Main checkbox should be updated
      expect(theadSpan.innerHTML).toBe('0');
      expect(theadSpan.getAttribute('title')).toBe('0');
      expect(theadCheckbox.checked).toBeFalse();
      expect(theadCheckbox.indeterminate).toBeFalse();
    });
  });

  describe('without header', () => {
    beforeEach(() => {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        view: {
          thead: false,
          tfoot: true
        }
      });

      tbody = grid.$tbody[0];
      tfoot = grid.$tfoot[0];
    });

    it('should select data when row is clicked', () => {
      const row = tbody.childNodes[1];

      triggerClick(row);

      const expectedSelection = [grid.$data[1]];
      expect(grid.$selection.toArray()).toEqual(expectedSelection);

      jasmine.clock().tick();

      const trs = tbody.childNodes;
      expect(trs[0].getAttribute('class')).not.toContain(CSS_SELECTED);
      expect(trs[1].getAttribute('class')).toContain(CSS_SELECTED);
      expect(trs[2].getAttribute('class')).not.toContain(CSS_SELECTED);

      // Check status of checkbox
      expect(findCheckbox(trs[0]).checked).toBeFalse();
      expect(findCheckbox(trs[1]).checked).toBeTrue();
      expect(findCheckbox(trs[2]).checked).toBeFalse();

      const tfootSpan = tfoot.childNodes[0].childNodes[0].childNodes[1];
      const tfootCheckbox = tfoot.childNodes[0].childNodes[0].childNodes[0];

      expect(tfootSpan.innerHTML).toBe('1');
      expect(tfootSpan.getAttribute('title')).toBe('1');
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeTrue();

      // New click should toggle selection
      triggerClick(row);

      expect(grid.$selection).toBeEmpty();

      jasmine.clock().tick();

      expect(tbody.childNodes).toVerify(tr => {
        const className = tr.getAttribute('class') || '';
        return className.indexOf(CSS_SELECTED) < 0;
      });

      expect(tfootSpan.innerHTML).toBe('0');
      expect(tfootSpan.getAttribute('title')).toBe('0');
      expect(tfootCheckbox.checked).toBeFalse();
      expect(tfootCheckbox.indeterminate).toBeFalse();
    });
  });
});
