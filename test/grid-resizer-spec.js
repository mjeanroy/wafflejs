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

describe('GridResizer', function() {

  var table, grid;

  beforeEach(function() {
    var columns = [
      { id: 'foo', title: 'Foo', width: 100 },
      { id: 'bar', title: 'Boo', sortable: false }
    ];

    var data = [
      { foo: 'foo1', bar: 'bar1' },
      { foo: 'foo2', bar: 'bar2' }
    ];

    table = document.createElement('table');
    fixtures.appendChild(table);

    grid = new Grid(table, {
      data: data,
      columns: columns
    });
  });

  afterEach(function() {
    fixtures.removeChild(table);
    table = null;
  });

  it('should fix table width', function() {
    grid.options.size = {
      width: 300
    };

    GridResizer.applySize(grid);

    expect(grid.$table[0].style.maxWidth).toBe('300px');
    expect(grid.$table[0].style.minWidth).toBe('300px');
    expect(grid.$table[0].style.width).toBe('300px');
  });

  it('should fix table width using function', function() {
    var width = jasmine.createSpy('width').and.returnValue(300);

    grid.options.size = {
      width: width
    };

    GridResizer.applySize(grid);

    expect(width).toHaveBeenCalled();
    expect(grid.$table[0].style.maxWidth).toBe('300px');
    expect(grid.$table[0].style.minWidth).toBe('300px');
    expect(grid.$table[0].style.width).toBe('300px');
  });

  it('should fix tbody height', function() {
    grid.options.size = {
      height: 300
    };

    GridResizer.applySize(grid);

    expect(grid.$tbody[0].style.maxHeight).toBe('300px');
  });

  it('should fix tbody height using function', function() {
    var height = jasmine.createSpy('height').and.returnValue(300);

    grid.options.size = {
      height: height
    };

    GridResizer.applySize(grid);

    expect(height).toHaveBeenCalled();
    expect(grid.$tbody[0].style.maxHeight).toBe('300px');
  });

  it('should update columns size', function() {
    spyOn(GridResizer, 'computeWidth').and.callThrough();
    spyOn(grid, 'hasCheckbox').and.returnValue(false);
    spyOn($doc, 'scrollbarWidth').and.returnValue(10);

    grid.options.size = {
      width: 300
    };

    GridResizer.applySize(grid);

    expect(GridResizer.computeWidth).toHaveBeenCalledWith(290, grid.$columns);
  });

  it('should update columns size and retain checkbox size', function() {
    spyOn(GridResizer, 'computeWidth').and.callThrough();
    spyOn(grid, 'hasCheckbox').and.returnValue(true);
    spyOn($doc, 'scrollbarWidth').and.returnValue(10);

    grid.options.size = {
      width: 300
    };

    GridResizer.applySize(grid);

    expect(GridResizer.computeWidth).toHaveBeenCalledWith(260, grid.$columns);
  });

  it('should compute table size', function() {
    spyOn(GridResizer, 'computeWidth').and.callThrough();
    spyOn(grid, 'hasCheckbox').and.returnValue(true);
    spyOn($doc, 'scrollbarWidth').and.returnValue(10);

    grid.options.size = {
      width: null
    };

    GridResizer.applySize(grid);

    expect(GridResizer.computeWidth).toHaveBeenCalledWith(jasmine.any(Number), grid.$columns);
  });

  it('should trigger update for each diff', function() {
    spyOn(grid.$columns, 'triggerUpdate');
    spyOn(GridResizer, 'computeWidth').and.returnValue([
      grid.$columns.at(0)
    ]);

    spyOn(grid, 'hasCheckbox').and.returnValue(true);
    spyOn($doc, 'scrollbarWidth').and.returnValue(10);

    grid.options.size = {
      width: null
    };

    GridResizer.applySize(grid);

    expect(grid.$columns.triggerUpdate).toHaveBeenCalledWith(0);
  });

  it('should not trigger update if there is a pending change', function() {
    var change = {
      type: 'update',
      removed: [],
      addedCount: 0,
      index: 0,
      object: grid.$columns
    };

    grid.$columns.$$changes = [change];

    spyOn(grid.$columns, 'triggerUpdate');
    spyOn(GridResizer, 'computeWidth').and.returnValue([
      grid.$columns.at(0)
    ]);

    spyOn(grid, 'hasCheckbox').and.returnValue(true);
    spyOn($doc, 'scrollbarWidth').and.returnValue(10);

    grid.options.size = {
      width: null
    };

    GridResizer.applySize(grid);

    expect(grid.$columns.triggerUpdate).not.toHaveBeenCalled();
  });

  it('should compute columns width', function() {
    GridResizer.computeWidth(300, grid.$columns);

    // First column should have size equal to 100
    // Second column should use remaining space, i.e 200
    expect(grid.$columns[0].computedWidth).toBe(100);
    expect(grid.$columns[1].computedWidth).toBe(200);
  });

  it('should compute columns width', function() {
    grid.$columns[0].width = 120;
    grid.$columns[1].width = 180;

    GridResizer.computeWidth(300, grid.$columns);

    // Columns size should not be overridden
    expect(grid.$columns[0].computedWidth).toBe(120);
    expect(grid.$columns[1].computedWidth).toBe(180);
  });

  it('should compute columns width using functions', function() {
    var width1 = jasmine.createSpy('width1').and.returnValue(120);
    var width2 = jasmine.createSpy('width2').and.returnValue(180);

    grid.$columns[0].width = width1;
    grid.$columns[1].width = width2;

    GridResizer.computeWidth(300, grid.$columns);

    // Columns size should not be overridden
    expect(grid.$columns[0].computedWidth).toBe(120);
    expect(grid.$columns[1].computedWidth).toBe(180);

    expect(width1).toHaveBeenCalled();
    expect(width2).toHaveBeenCalled();

    expect(width1.calls.count()).toBe(1);
    expect(width2.calls.count()).toBe(1);
  });

  it('should compute columns width using percentage', function() {
    grid.$columns[0].width = '10%';
    grid.$columns[1].width = 'auto';

    GridResizer.computeWidth(300, grid.$columns);

    // First column should have size equal to 100
    // Second column should use remaining space, i.e 200
    expect(grid.$columns[0].computedWidth).toBe(30);
    expect(grid.$columns[1].computedWidth).toBe(270);
  });

  it('should compute columns width and return changes', function() {
    grid.$columns[0].computedWidth = 30;
    grid.$columns[1].computedWidth = 200;

    grid.$columns[0].width = '10%';
    grid.$columns[1].width = 'auto';

    var result = GridResizer.computeWidth(300, grid.$columns);

    // First column should have size equal to 100
    // Second column should use remaining space, i.e 200
    expect(grid.$columns[0].computedWidth).toBe(30);
    expect(grid.$columns[1].computedWidth).toBe(270);

    expect(result).toEqual([grid.$columns[1]]);
  });
});
