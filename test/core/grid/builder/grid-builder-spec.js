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

describe('GridBuilder', function() {

  var grid;

  beforeEach(function() {
    var columns = [
      { id: 'foo', title: 'Foo', width: 100 },
      { id: 'bar', title: 'Boo', sortable: false }
    ];

    var data = [
      { foo: 'foo1', bar: 'bar1' },
      { foo: 'foo2', bar: 'bar2' }
    ];

    var table = document.createElement('table');
    grid = new Grid(table, {
      data: data,
      columns: columns,
      key: 'foo'
    });
  });

  it('should compute columns width', function() {
    GridBuilder.computeWidth(300, grid.$columns);

    // First column should have size equal to 100
    // Second column should use remaining space, i.e 200
    expect(grid.$columns[0].computedWidth).toBe(100);
    expect(grid.$columns[1].computedWidth).toBe(200);
  });

  it('should compute columns width', function() {
    grid.$columns[0].width = 120;
    grid.$columns[1].width = 180;

    GridBuilder.computeWidth(300, grid.$columns);

    // Columns size should not be overridden
    expect(grid.$columns[0].computedWidth).toBe(120);
    expect(grid.$columns[1].computedWidth).toBe(180);
  });

  it('should compute columns width using functions', function() {
    var width1 = jasmine.createSpy('width1').and.returnValue(120);
    var width2 = jasmine.createSpy('width2').and.returnValue(180);

    grid.$columns[0].width = width1;
    grid.$columns[1].width = width2;

    GridBuilder.computeWidth(300, grid.$columns);

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

    GridBuilder.computeWidth(300, grid.$columns);

    // First column should have size equal to 100
    // Second column should use remaining space, i.e 200
    expect(grid.$columns[0].computedWidth).toBe(30);
    expect(grid.$columns[1].computedWidth).toBe(270);
  });

  it('should create thead row with checkbox', function() {
    spyOn(GridBuilder, 'theadCell').and.callThrough();

    var tr = GridBuilder.theadRow(grid);

    var columns = grid.columns();
    expect(GridBuilder.theadCell.calls.count()).toBe(2);
    expect(GridBuilder.theadCell).toHaveBeenCalledWith(grid, columns.at(0), 0);
    expect(GridBuilder.theadCell).toHaveBeenCalledWith(grid, columns.at(1), 1);

    expect(tr).toBeDefined();
    expect(tr.tagName).toEqual('TR');

    // 2 columns + 1 column for checkbox
    expect(tr.childNodes.length).toBe(3);

    expect(tr.childNodes).toVerify(function(node) {
      return node.tagName === 'TH';
    });
  });

  it('should create thead row without checkbox', function() {
    spyOn(GridBuilder, 'theadCell').and.callThrough();
    spyOn(grid, 'hasCheckbox').and.returnValue(false);

    var tr = GridBuilder.theadRow(grid);

    var columns = grid.columns();
    expect(GridBuilder.theadCell.calls.count()).toBe(2);
    expect(GridBuilder.theadCell).toHaveBeenCalledWith(grid, columns.at(0), 0);
    expect(GridBuilder.theadCell).toHaveBeenCalledWith(grid, columns.at(1), 1);

    expect(tr).toBeDefined();
    expect(tr.tagName).toEqual('TR');
    expect(tr.childNodes.length).toBe(2);
    expect(tr.childNodes).toVerify(function(node) {
      return node.tagName === 'TH';
    });
  });

  it('should create thead cell', function() {
    var col0 = grid.columns().at(0);
    var col1 = grid.columns().at(1);

    col0.computedWidth = '100px';
    col1.computedWidth = null;

    var th1 = GridBuilder.theadCell(grid, col0, 0);
    var th2 = GridBuilder.theadCell(grid, col1, 1);

    expect(th1).toBeDefined();
    expect(th1.tagName).toEqual('TH');
    expect(th1.className).toContain('foo');
    expect(th1.className).toContain('waffle-sortable');
    expect(th1.getAttribute('data-waffle-id')).toBe('foo');
    expect(th1.style.maxWidth).toBe('100px');
    expect(th1.style.minWidth).toBe('100px');
    expect(th1.style.width).toBe('100px');

    expect(th2).toBeDefined();
    expect(th2.tagName).toEqual('TH');
    expect(th2.className).toContain('bar');
    expect(th2.className).not.toContain('waffle-sortable');
    expect(th2.getAttribute('data-waffle-id')).toBe('bar');
    expect(th2.style.maxWidth).toBeEmpty();
    expect(th2.style.minWidth).toBeEmpty();
  });

  it('should create thead cell for main checkbox with unchecked state', function() {
    var th = GridBuilder.theadCheckboxCell(grid);

    expect(th).toBeDefined();
    expect(th.tagName).toEqual('TH');
    expect(th.className).toContain('waffle-checkbox');
    expect(th.childNodes.length).toBe(2);

    var span = th.childNodes[0];
    expect(span.tagName).toBe('SPAN');
    expect(span.innerHTML).toBe('0');
    expect(span.getAttribute('title')).toBe('0');

    var checkbox = th.childNodes[1];
    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox.getAttribute('type')).toBe('checkbox');
    expect(checkbox.checked).toBe(false);
    expect(checkbox.indeterminate).toBe(false);
  });

  it('should create thead cell for main checkbox with checked state', function() {
    grid.$selection.add(grid.$data.toArray());

    var th = GridBuilder.theadCheckboxCell(grid);

    expect(th).toBeDefined();
    expect(th.tagName).toEqual('TH');
    expect(th.className).toContain('waffle-checkbox');
    expect(th.childNodes.length).toBe(2);

    var span = th.childNodes[0];
    expect(span.tagName).toBe('SPAN');
    expect(span.innerHTML).toBe('2');
    expect(span.getAttribute('title')).toBe('2');

    var checkbox = th.childNodes[1];
    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox.getAttribute('type')).toBe('checkbox');
    expect(checkbox.checked).toBe(true);
    expect(checkbox.indeterminate).toBe(false);
  });

  it('should create thead cell for main checkbox with checked state', function() {
    var fn = jasmine.createSpy('fn').and.callFake(function(data) {
      return data.foo === 'foo1';
    });

    var selectableData = grid.$data.filter(fn);

    grid.options.selection = {
      enable: fn
    };

    grid.$selection.add(selectableData);

    var th = GridBuilder.theadCheckboxCell(grid);

    expect(th).toBeDefined();
    expect(th.tagName).toEqual('TH');
    expect(th.className).toContain('waffle-checkbox');
    expect(th.childNodes.length).toBe(2);

    var span = th.childNodes[0];
    expect(span.tagName).toBe('SPAN');
    expect(span.innerHTML).toBe('1');
    expect(span.getAttribute('title')).toBe('1');

    var checkbox = th.childNodes[1];
    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox.getAttribute('type')).toBe('checkbox');
    expect(checkbox.checked).toBe(true);
    expect(checkbox.indeterminate).toBe(false);
  });

  it('should create thead cell for main checkbox with undeterminate state', function() {
    grid.$selection.push(grid.$data[0]);

    var th = GridBuilder.theadCheckboxCell(grid);

    expect(th).toBeDefined();
    expect(th.tagName).toEqual('TH');
    expect(th.className).toContain('waffle-checkbox');
    expect(th.childNodes.length).toBe(2);

    var span = th.childNodes[0];
    expect(span.tagName).toBe('SPAN');
    expect(span.innerHTML).toBe('1');
    expect(span.getAttribute('title')).toBe('1');

    var checkbox = th.childNodes[1];
    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox.getAttribute('type')).toBe('checkbox');
    expect(checkbox.checked).toBe(false);
    expect(checkbox.indeterminate).toBe(true);
  });

  it('should create tfoot row with checkbox', function() {
    spyOn(GridBuilder, 'tfootCell').and.callThrough();

    var tr = GridBuilder.tfootRow(grid);

    var columns = grid.columns();
    expect(GridBuilder.tfootCell.calls.count()).toBe(2);
    expect(GridBuilder.tfootCell).toHaveBeenCalledWith(grid, columns.at(0), 0);
    expect(GridBuilder.tfootCell).toHaveBeenCalledWith(grid, columns.at(1), 1);

    expect(tr).toBeDefined();
    expect(tr.tagName).toEqual('TR');

    // 2 columns + 1 column for checkbox
    expect(tr.childNodes.length).toBe(3);

    expect(tr.childNodes).toVerify(function(node) {
      return node.tagName === 'TH';
    });
  });

  it('should create tfoot row without checkbox', function() {
    spyOn(GridBuilder, 'tfootCell').and.callThrough();
    spyOn(grid, 'hasCheckbox').and.returnValue(false);

    var tr = GridBuilder.tfootRow(grid);

    var columns = grid.columns();
    expect(GridBuilder.tfootCell.calls.count()).toBe(2);
    expect(GridBuilder.tfootCell).toHaveBeenCalledWith(grid, columns.at(0), 0);
    expect(GridBuilder.tfootCell).toHaveBeenCalledWith(grid, columns.at(1), 1);

    expect(tr).toBeDefined();
    expect(tr.tagName).toEqual('TR');
    expect(tr.childNodes.length).toBe(2);
    expect(tr.childNodes).toVerify(function(node) {
      return node.tagName === 'TH';
    });
  });

  it('should create tfoot cell', function() {
    var col0 = grid.columns().at(0);
    var col1 = grid.columns().at(1);

    col0.computedWidth = '100px';
    col1.computedWidth = null;

    var th1 = GridBuilder.tfootCell(grid, col0, 0);
    var th2 = GridBuilder.theadCell(grid, col1, 1);

    expect(th1).toBeDefined();
    expect(th1.tagName).toEqual('TH');
    expect(th1.className).toContain('foo');
    expect(th1.className).toContain('waffle-sortable');
    expect(th1.getAttribute('data-waffle-id')).toBe('foo');
    expect(th1.style.maxWidth).toBe('100px');
    expect(th1.style.minWidth).toBe('100px');
    expect(th1.style.width).toBe('100px');

    expect(th2).toBeDefined();
    expect(th2.tagName).toEqual('TH');
    expect(th2.className).toContain('bar');
    expect(th2.className).not.toContain('waffle-sortable');
    expect(th2.getAttribute('data-waffle-id')).toBe('bar');
    expect(th2.style.maxWidth).toBeEmpty();
    expect(th2.style.minWidth).toBeEmpty();
  });

  it('should create tfoot cell for main checkbox with unchecked state', function() {
    var th = GridBuilder.tfootCheckboxCell(grid);

    expect(th).toBeDefined();
    expect(th.tagName).toEqual('TH');
    expect(th.className).toContain('waffle-checkbox');
    expect(th.childNodes.length).toBe(2);

    var checkbox = th.childNodes[0];
    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox.getAttribute('type')).toBe('checkbox');
    expect(checkbox.checked).toBe(false);
    expect(checkbox.indeterminate).toBe(false);

    var span = th.childNodes[1];
    expect(span.tagName).toBe('SPAN');
    expect(span.innerHTML).toBe('0');
    expect(span.getAttribute('title')).toBe('0');
  });

  it('should create thead cell for main checkbox with checked state', function() {
    grid.$selection.add(grid.$data.toArray());

    var th = GridBuilder.tfootCheckboxCell(grid);

    expect(th).toBeDefined();
    expect(th.tagName).toEqual('TH');
    expect(th.className).toContain('waffle-checkbox');
    expect(th.childNodes.length).toBe(2);

    var checkbox = th.childNodes[0];
    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox.getAttribute('type')).toBe('checkbox');
    expect(checkbox.checked).toBe(true);
    expect(checkbox.indeterminate).toBe(false);

    var span = th.childNodes[1];
    expect(span.tagName).toBe('SPAN');
    expect(span.innerHTML).toBe('2');
    expect(span.getAttribute('title')).toBe('2');
  });

  it('should create tfoot cell for main checkbox with undeterminate state', function() {
    grid.$selection.push(grid.$data[0]);

    var th = GridBuilder.tfootCheckboxCell(grid);

    expect(th).toBeDefined();
    expect(th.tagName).toEqual('TH');
    expect(th.className).toContain('waffle-checkbox');
    expect(th.childNodes.length).toBe(2);

    var checkbox = th.childNodes[0];
    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox.getAttribute('type')).toBe('checkbox');
    expect(checkbox.checked).toBe(false);
    expect(checkbox.indeterminate).toBe(true);

    var span = th.childNodes[1];
    expect(span.tagName).toBe('SPAN');
    expect(span.innerHTML).toBe('1');
    expect(span.getAttribute('title')).toBe('1');
  });

  it('should create tbody rows', function() {
    spyOn(GridBuilder, 'tbodyRow').and.callThrough();

    var data = [
      { foo: 1, bar: 'hello 1' },
      { foo: 2, bar: 'hello 2'}
    ];

    var fragment = GridBuilder.tbodyRows(grid, data, 0);

    expect(GridBuilder.tbodyRow.calls.count()).toBe(2);
    expect(GridBuilder.tbodyRow).toHaveBeenCalledWith(grid, data[0], 0);
    expect(GridBuilder.tbodyRow).toHaveBeenCalledWith(grid, data[1], 1);

    expect(fragment).toBeDefined();
    expect(fragment.childNodes.length).toBe(2);
    expect(fragment.childNodes).toVerify(function(node) {
      return node.tagName === 'TR';
    });

    expect(fragment.childNodes).toVerify(function(node, idx) {
      return node.getAttribute('data-waffle-idx') === idx.toString();
    });

    expect(fragment.childNodes).toVerify(function(node, idx) {
      return node.getAttribute('data-waffle-id') === data[idx].foo.toString();
    });
  });

  it('should create tbody rows', function() {
    spyOn(GridBuilder, 'tbodyRow').and.callThrough();

    var data = [
      { foo: 1, bar: 'hello 1' },
      { foo: 2, bar: 'hello 2'}
    ];

    var fragment = GridBuilder.tbodyRows(grid, data, 10);

    expect(GridBuilder.tbodyRow.calls.count()).toBe(2);
    expect(GridBuilder.tbodyRow).toHaveBeenCalledWith(grid, data[0], 10);
    expect(GridBuilder.tbodyRow).toHaveBeenCalledWith(grid, data[1], 11);

    expect(fragment).toBeDefined();
    expect(fragment.childNodes.length).toBe(2);
    expect(fragment.childNodes).toVerify(function(node) {
      return node.tagName === 'TR';
    });

    expect(fragment.childNodes).toVerify(function(node, idx) {
      return node.getAttribute('data-waffle-idx') === (10 + idx).toString();
    });
  });

  it('should create tbody row with checkbox', function() {
    spyOn(GridBuilder, 'tbodyCell').and.callThrough();

    var data = {
      foo: 1,
      bar: 'hello world'
    };

    var tr = GridBuilder.tbodyRow(grid, data, 0);

    var columns = grid.columns();
    expect(GridBuilder.tbodyCell.calls.count()).toBe(2);
    expect(GridBuilder.tbodyCell).toHaveBeenCalledWith(grid, data, columns.at(0), 0);
    expect(GridBuilder.tbodyCell).toHaveBeenCalledWith(grid, data, columns.at(1), 1);

    expect(tr).toBeDefined();
    expect(tr.tagName).toEqual('TR');
    expect(tr.className).toContain('waffle-selectable');
    expect(tr.className).not.toContain('waffle-selected');
    expect(tr.getAttribute('data-waffle-idx')).toBe('0');
    expect(tr.getAttribute('data-waffle-cid')).not.toBeNull();

    // 2 columns + 1 column for checkbox
    expect(tr.childNodes.length).toBe(3);

    expect(tr.childNodes).toVerify(function(node) {
      return node.tagName === 'TD';
    });
  });

  it('should create tbody row without checkbox', function() {
    spyOn(GridBuilder, 'tbodyCell').and.callThrough();
    spyOn(grid, 'hasCheckbox').and.returnValue(false);

    var data = {
      foo: 1,
      bar: 'hello world'
    };

    var tr = GridBuilder.tbodyRow(grid, data, 0);

    var columns = grid.columns();
    expect(GridBuilder.tbodyCell.calls.count()).toBe(2);
    expect(GridBuilder.tbodyCell).toHaveBeenCalledWith(grid, data, columns.at(0), 0);
    expect(GridBuilder.tbodyCell).toHaveBeenCalledWith(grid, data, columns.at(1), 1);

    expect(tr).toBeDefined();
    expect(tr.tagName).toEqual('TR');
    expect(tr.getAttribute('data-waffle-idx')).toBe('0');
    expect(tr.getAttribute('data-waffle-cid')).not.toBeNull();
    expect(tr.className).toContain('waffle-selectable');
    expect(tr.className).not.toContain('waffle-selected');
    expect(tr.childNodes.length).toBe(2);
    expect(tr.childNodes).toVerify(function(node) {
      return node.tagName === 'TD';
    });
  });

  it('should not create selectable tbody row', function() {
    spyOn(GridBuilder, 'tbodyCell').and.callThrough();
    spyOn(grid, 'hasCheckbox').and.returnValue(true);
    spyOn(grid, 'isSelectable').and.callFake(function(data) {
      return !data;
    });

    var data = {
      foo: 1,
      bar: 'hello world'
    };

    var tr = GridBuilder.tbodyRow(grid, data, 0);

    var columns = grid.columns();
    expect(GridBuilder.tbodyCell.calls.count()).toBe(2);
    expect(GridBuilder.tbodyCell).toHaveBeenCalledWith(grid, data, columns.at(0), 0);
    expect(GridBuilder.tbodyCell).toHaveBeenCalledWith(grid, data, columns.at(1), 1);

    expect(tr).toBeDefined();
    expect(tr.tagName).toEqual('TR');
    expect(tr.getAttribute('data-waffle-idx')).toBe('0');
    expect(tr.className).not.toContain('waffle-selectable');
    expect(tr.className).not.toContain('waffle-selected');
    expect(tr.childNodes.length).toBe(3);
    expect(tr.childNodes).toVerify(function(node) {
      return node.tagName === 'TD';
    });
  });

  it('should create selected tbody row', function() {
    spyOn(GridBuilder, 'tbodyCell').and.callThrough();
    spyOn(grid, 'hasCheckbox').and.returnValue(true);
    spyOn(grid, 'isSelectable').and.returnValue(true);
    spyOn(grid.$selection, 'contains').and.returnValue(true);

    var data = {
      foo: 1,
      bar: 'hello world'
    };

    var tr = GridBuilder.tbodyRow(grid, data, 0);

    var columns = grid.columns();
    expect(GridBuilder.tbodyCell.calls.count()).toBe(2);
    expect(GridBuilder.tbodyCell).toHaveBeenCalledWith(grid, data, columns.at(0), 0);
    expect(GridBuilder.tbodyCell).toHaveBeenCalledWith(grid, data, columns.at(1), 1);

    expect(tr).toBeDefined();
    expect(tr.tagName).toEqual('TR');
    expect(tr.getAttribute('data-waffle-idx')).toBe('0');
    expect(tr.className).toContain('waffle-selectable');
    expect(tr.className).toContain('waffle-selected');
    expect(tr.childNodes.length).toBe(3);
    expect(tr.childNodes).toVerify(function(node) {
      return node.tagName === 'TD';
    });
  });

  it('should create tbody cell', function() {
    var data = {
      foo: 1,
      bar: 'hello world'
    };

    var col0 = grid.columns().at(0);
    var col1 = grid.columns().at(1);

    spyOn(col0, 'cssClasses').and.callThrough();
    spyOn(col1, 'cssClasses').and.callThrough();

    col0.computedWidth = '100px';
    col1.computedWidth = null;

    var td1 = GridBuilder.tbodyCell(grid, data, col0, 0);
    var td2 = GridBuilder.tbodyCell(grid, data, col1, 1);

    expect(col0.cssClasses).toHaveBeenCalledWith(0, false, data);
    expect(col1.cssClasses).toHaveBeenCalledWith(1, false, data);

    expect(td1).toBeDefined();
    expect(td1.tagName).toEqual('TD');
    expect(td1.className).toContain('foo');
    expect(td1.className).toContain('waffle-sortable');
    expect(td1.getAttribute('data-waffle-id')).toBe('foo');
    expect(td1.style.maxWidth).toBe('100px');
    expect(td1.style.minWidth).toBe('100px');
    expect(td1.style.width).toBe('100px');

    expect(td1).toBeDefined();
    expect(td1.tagName).toEqual('TD');
    expect(td2.className).toContain('bar');
    expect(td2.className).not.toContain('waffle-sortable');
    expect(td2.getAttribute('data-waffle-id')).toBe('bar');
    expect(td2.style.maxWidth).toBeEmpty();
    expect(td2.style.minWidth).toBeEmpty();
  });

  it('should create tbody cell for row checkbox', function() {
    spyOn(grid, 'isSelectable').and.returnValue(true);

    var data = grid.$data[0];
    var td = GridBuilder.tbodyCheckboxCell(grid, data);

    expect(grid.isSelectable).toHaveBeenCalledWith(data);
    expect(td).toBeDefined();
    expect(td.tagName).toEqual('TD');
    expect(td.className).toContain('waffle-checkbox');
    expect(td.childNodes.length).toBe(1);
    expect(td.childNodes[0].tagName).toBe('INPUT');
    expect(td.childNodes[0].getAttribute('type')).toBe('checkbox');
    expect(td.childNodes[0].checked).toBeFalse();
  });

  it('should create tbody cell for row checkbox', function() {
    spyOn(grid, 'isSelectable').and.returnValue(false);

    var data = grid.$data[0];
    var td = GridBuilder.tbodyCheckboxCell(grid, data);

    expect(grid.isSelectable).toHaveBeenCalledWith(data);
    expect(td).toBeDefined();
    expect(td.tagName).toEqual('TD');
    expect(td.className).toContain('waffle-checkbox');
    expect(td.childNodes.length).toBe(0);
  });

  it('should create tbody cell for row checkbox and check data if it is selected', function() {
    var data = {
      foo: 1,
      bar: 'hello world'
    };

    spyOn(grid.$selection, 'contains').and.returnValue(true);

    var td = GridBuilder.tbodyCheckboxCell(grid, data);

    expect(td).toBeDefined();
    expect(td.tagName).toEqual('TD');
    expect(td.className).toContain('waffle-checkbox');
    expect(td.childNodes.length).toBe(1);
    expect(td.childNodes[0].tagName).toBe('INPUT');
    expect(td.childNodes[0].getAttribute('type')).toBe('checkbox');
    expect(td.childNodes[0].checked).toBeTrue();
  });

  it('should create editable tbody cell', function() {
    spyOn(GridBuilder, 'tbodyControl').and.callThrough();

    var column = grid.$columns.at(0);

    column.editable = {
      enable: true,
      type: 'text',
      css: null
    };

    var data = {
      foo: 1,
      bar: 'hello world'
    };

    var td1 = GridBuilder.tbodyCell(grid, data, grid.columns().at(0), 0);

    expect(td1).toBeDefined();
    expect(td1.tagName).toEqual('TD');
    expect(td1.className).toContain('foo');
    expect(td1.className).toContain('waffle-sortable');
    expect(td1.getAttribute('data-waffle-id')).toBe('foo');

    var childNodes = td1.childNodes;
    expect(childNodes.length).toBe(1);
    expect(childNodes[0].tagName).toBe('INPUT');
    expect(childNodes[0].value).toBe('1');

    expect(GridBuilder.tbodyControl).toHaveBeenCalledWith(column, data);
  });

  it('should create editable tbody cell using data condition', function() {
    spyOn(GridBuilder, 'tbodyControl').and.callThrough();

    var column = grid.$columns.at(0);

    var fn = jasmine.createSpy('fn').and.callFake(function(data) {
      return data.foo === 1;
    });

    column.editable = {
      enable: fn,
      type: 'text',
      css: null
    };

    var data1 = {
      foo: 1,
      bar: 'hello world'
    };

    var data2 = {
      foo: 2,
      bar: 'hello world'
    };

    var td1 = GridBuilder.tbodyCell(grid, data1, grid.columns().at(0), 0);
    var td2 = GridBuilder.tbodyCell(grid, data2, grid.columns().at(0), 0);

    expect(td1).toBeDefined();
    expect(td1.tagName).toEqual('TD');
    expect(td1.className).toContain('foo');
    expect(td1.className).toContain('waffle-sortable');
    expect(td1.getAttribute('data-waffle-id')).toBe('foo');

    expect(td2).toBeDefined();
    expect(td2.tagName).toEqual('TD');
    expect(td2.className).toContain('foo');
    expect(td2.className).toContain('waffle-sortable');
    expect(td2.getAttribute('data-waffle-id')).toBe('foo');

    expect(fn).toHaveBeenCalledWith(data1);
    expect(fn).toHaveBeenCalledWith(data2);

    // Should be editable
    var childNodes1 = td1.childNodes;
    expect(childNodes1.length).toBe(1);
    expect(childNodes1[0].tagName).toBe('INPUT');
    expect(childNodes1[0].value).toBe('1');

    // Should not be editable
    var childNodes2 = td2.childNodes;
    expect(childNodes2.length).toBe(1);
    expect(childNodes2[0].tagName).not.toBe('INPUT');
    expect(childNodes2[0].nodeValue).toBe('2');
  });

  it('should create editable control for tbody cell', function() {
    var data = {
      foo: 1,
      bar: 'hello world'
    };

    var column = grid.$columns.at(0);

    column.editable = {
      type: 'text'
    };

    var control = GridBuilder.tbodyControl(column, data);

    expect(control).toBeDefined();
    expect(control.tagName).toEqual('INPUT');
    expect(control.getAttribute('type')).toBe('text');
    expect(control.getAttribute('data-waffle-id')).toBe('foo');
    expect(control.className).toBeEmpty();
    expect(control.value).toBe('1');
  });

  it('should create editable control for checkbox input', function() {
    var data = {
      foo: true,
      bar: 'hello world'
    };

    var column = grid.$columns.at(0);

    column.editable = {
      type: 'checkbox'
    };

    var control = GridBuilder.tbodyControl(column, data);

    expect(control).toBeDefined();
    expect(control.tagName).toEqual('INPUT');
    expect(control.getAttribute('type')).toBe('checkbox');
    expect(control.getAttribute('data-waffle-id')).toBe('foo');
    expect(control.className).toBeEmpty();
    expect(control.checked).toBe(true);
  });

  it('should create editable control for checkbox input and convert to truthy/falsy value', function() {
    var data = {
      bar: 'hello world'
    };

    var column = grid.$columns.at(0);

    column.editable = {
      type: 'checkbox'
    };

    var control = GridBuilder.tbodyControl(column, data);

    expect(control).toBeDefined();
    expect(control.tagName).toEqual('INPUT');
    expect(control.getAttribute('type')).toBe('checkbox');
    expect(control.getAttribute('data-waffle-id')).toBe('foo');
    expect(control.className).toBeEmpty();
    expect(control.checked).toBe(false);
  });

  it('should create editable control for tbody cell with css classes', function() {
    var data = {
      foo: 1,
      bar: 'hello world'
    };

    var column = grid.$columns.at(0);

    column.editable = {
      type: 'text',
      css: 'foo bar'
    };

    var control = GridBuilder.tbodyControl(column, data);

    expect(control).toBeDefined();
    expect(control.tagName).toEqual('INPUT');
    expect(control.getAttribute('type')).toBe('text');
    expect(control.getAttribute('data-waffle-id')).toBe('foo');
    expect(control.value).toBe('1');
    expect(control.className).toBe('foo bar');
  });

  it('should create editable control for tbody cell with select element', function() {
    var data = {
      foo: 1,
      bar: 'hello world'
    };

    var column = grid.$columns.at(0);

    column.editable = {
      type: 'select',
      options: [
        { label: 'foo' }
      ]
    };

    var control = GridBuilder.tbodyControl(column, data);

    expect(control).toBeDefined();
    expect(control.tagName).toEqual('SELECT');
    expect(control.getAttribute('data-waffle-id')).toBe('foo');

    expect(control.childNodes.length).toBe(1);
    expect(control.childNodes[0].tagName).toBe('OPTION');
    expect(control.childNodes[0].value).toBe('foo');
    expect(control.childNodes[0].innerHTML).toBe('foo');
  });

  it('should create editable control for tbody cell with select element with label and value', function() {
    var data = {
      foo: 1,
      bar: 'hello world'
    };

    var column = grid.$columns.at(0);

    column.editable = {
      type: 'select',
      options: [
        { label: 'foo', value: 'bar' }
      ]
    };

    var control = GridBuilder.tbodyControl(column, data);

    expect(control).toBeDefined();
    expect(control.tagName).toEqual('SELECT');
    expect(control.getAttribute('data-waffle-id')).toBe('foo');

    expect(control.childNodes.length).toBe(1);
    expect(control.childNodes[0].tagName).toBe('OPTION');
    expect(control.childNodes[0].value).toBe('bar');
    expect(control.childNodes[0].innerHTML).toBe('foo');
  });

  it('should create editable control for tbody cell with select element with empty label', function() {
    var data = {
      foo: 1,
      bar: 'hello world'
    };

    var column = grid.$columns.at(0);

    column.editable = {
      type: 'select',
      options: [
        { value: 'bar' }
      ]
    };

    var control = GridBuilder.tbodyControl(column, data);

    expect(control).toBeDefined();
    expect(control.tagName).toEqual('SELECT');
    expect(control.getAttribute('data-waffle-id')).toBe('foo');

    expect(control.childNodes.length).toBe(1);
    expect(control.childNodes[0].tagName).toBe('OPTION');
    expect(control.childNodes[0].value).toBe('bar');
    expect(control.childNodes[0].innerHTML).toBe('');
  });
});
