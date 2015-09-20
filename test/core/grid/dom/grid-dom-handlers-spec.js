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

describe('Grid Dom Handlers', function() {

  var table, grid, data, columns;
  var onClickTbody, onClickThead, onClickTfoot;

  // Drag & Drop events
  var onDragStart, onDragEnd, onDragOver, onDragEnter, onDragLeave, onDragDrop, onSelectStart;

  var event;

  beforeEach(function() {
    table = document.createElement('table');

    columns = [
      { id: 'id', sortable: false },
      { id: 'firstName' },
      { id: 'lastName' },
      { id: 'admin' },
      { id: 'age' }
    ];

    data = [
      { id: 1, firstName: 'foo1', lastName: 'bar1', admin: false, age: 20 },
      { id: 2, firstName: 'foo2', lastName: 'bar2', admin: false, age: 20 },
      { id: 3, firstName: 'foo3', lastName: 'bar3', admin: false, age: 20 }
    ];

    grid = new Grid(table, {
      data: data,
      columns: columns
    });

    onClickThead = _.bind(GridDomHandlers.onClickThead, grid);
    onClickTfoot = _.bind(GridDomHandlers.onClickTfoot, grid);
    onClickTbody = _.bind(GridDomHandlers.onClickTbody, grid);
    onInputTbody = _.bind(GridDomHandlers.onInputTbody, grid);

    // Drag & Drop
    onDragStart = _.bind(GridDomHandlers.onDragStart, grid);
    onDragEnd = _.bind(GridDomHandlers.onDragEnd, grid);
    onDragOver = _.bind(GridDomHandlers.onDragOver, grid);
    onDragEnter = _.bind(GridDomHandlers.onDragEnter, grid);
    onDragLeave = _.bind(GridDomHandlers.onDragLeave, grid);
    onDragDrop = _.bind(GridDomHandlers.onDragDrop, grid);
    onSelectStart = _.bind(GridDomHandlers.onSelectStart, grid);

    event = jasmine.createSpyObj('event', [
      'preventDefault',
      'stopPropagation',
      'stopImmediatePropagation'
    ]);
  });

  describe('onClickThead', function() {
    beforeEach(function() {
      spyOn(grid, 'sortBy').and.callThrough();
      spyOn(grid, 'select').and.callThrough();
      spyOn(grid, 'deselect').and.callThrough();
    });

    it('should not sort grid if target element is thead', function() {
      event.target = document.createElement('THEAD');

      onClickThead(event);

      expect(grid.sortBy).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();
      expect(grid.select).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should sort grid without shift key', function() {
      event.shiftKey = false;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');

      onClickThead(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['+id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should sort grid without shift key and turn sort in descendant order', function() {
      event.shiftKey = false;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '+');

      onClickThead(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['-id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should sort grid without shift key and turn sort in ascendant order', function() {
      event.shiftKey = false;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '-');

      onClickThead(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['+id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should sort grid with shift key', function() {
      event.shiftKey = true;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');

      onClickThead(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['+id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should sort grid with shift key and turn sort in descendant order', function() {
      event.shiftKey = true;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '+');

      onClickThead(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['-id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should sort grid with shift key and turn sort in ascendant order', function() {
      event.shiftKey = true;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '-');

      onClickThead(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['+id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should add column to current sort', function() {
      var currentComparator = FieldComparator.of(grid, '+foo');
      grid.$comparators = [currentComparator];

      event.shiftKey = true;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '-');

      onClickThead(event);

      expect(grid.sortBy).toHaveBeenCalledWith([currentComparator, '+id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should replace column to current sort in descendant order', function() {
      var idComparator = FieldComparator.of(grid, '+id');
      var fooComparator = FieldComparator.of(grid, '+foo');
      grid.$comparators = [
        idComparator,
        fooComparator
      ];

      event.shiftKey = true;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '+');

      onClickThead(event);

      expect(grid.sortBy).toHaveBeenCalledWith([fooComparator, '-id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should deselect all grid', function() {
      event.target = document.createElement('INPUT');
      event.target.setAttribute('type', 'checkbox');
      event.target.checked = false;
      event.target.indeterminate = false;
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '+');

      onClickThead(event);

      expect(grid.deselect).toHaveBeenCalled();
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.sortBy).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should select all grid', function() {
      event.target = document.createElement('INPUT');
      event.target.setAttribute('type', 'checkbox');
      event.target.checked = true;
      event.target.indeterminate = false;
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '+');

      onClickThead(event);

      expect(grid.select).toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();
      expect(grid.sortBy).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });
  });

  describe('onClickTfoot', function() {
    beforeEach(function() {
      spyOn(grid, 'sortBy').and.callThrough();
      spyOn(grid, 'select').and.callThrough();
      spyOn(grid, 'deselect').and.callThrough();
    });

    it('should not sort grid if target element is thead', function() {
      event.target = document.createElement('THEAD');

      onClickTfoot(event);

      expect(grid.sortBy).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();
      expect(grid.select).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should sort grid without shift key', function() {
      event.shiftKey = false;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');

      onClickTfoot(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['+id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should sort grid without shift key and turn sort in descendant order', function() {
      event.shiftKey = false;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '+');

      onClickTfoot(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['-id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should sort grid without shift key and turn sort in ascendant order', function() {
      event.shiftKey = false;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '-');

      onClickTfoot(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['+id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should sort grid with shift key', function() {
      event.shiftKey = true;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');

      onClickTfoot(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['+id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should sort grid with shift key and turn sort in descendant order', function() {
      event.shiftKey = true;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '+');

      onClickTfoot(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['-id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should sort grid with shift key and turn sort in ascendant order', function() {
      event.shiftKey = true;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '-');

      onClickTfoot(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['+id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should add column to current sort', function() {
      var fooComparator = FieldComparator.of(grid, '+foo');
      grid.$comparators = [fooComparator];

      event.shiftKey = true;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '-');

      onClickTfoot(event);

      expect(grid.sortBy).toHaveBeenCalledWith([fooComparator, '+id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should replace column to current sort in descendant order', function() {
      var idComparator = FieldComparator.of(grid, '+id');
      var fooComparator = FieldComparator.of(grid, '+foo');
      grid.$comparators = [
        idComparator,
        fooComparator
      ];

      event.shiftKey = true;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '+');

      onClickTfoot(event);

      expect(grid.sortBy).toHaveBeenCalledWith([fooComparator, '-id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should not deselect entire grid if grid is not selectable', function() {
      grid.options.selection.enable = false;

      event.target = document.createElement('INPUT');
      event.target.setAttribute('type', 'checkbox');
      event.target.checked = false;
      event.target.indeterminate = false;

      onClickTfoot(event);

      expect(grid.deselect).not.toHaveBeenCalled();
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.sortBy).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should not select entire grid if grid is not selectable', function() {
      grid.options.selection.enable = false;

      event.target = document.createElement('INPUT');
      event.target.setAttribute('type', 'checkbox');
      event.target.checked = true;
      event.target.indeterminate = false;

      onClickTfoot(event);

      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();
      expect(grid.sortBy).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should deselect entire grid', function() {
      event.target = document.createElement('INPUT');
      event.target.setAttribute('type', 'checkbox');
      event.target.checked = false;
      event.target.indeterminate = false;

      onClickTfoot(event);

      expect(grid.deselect).toHaveBeenCalled();
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.sortBy).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should select entire grid', function() {
      event.target = document.createElement('INPUT');
      event.target.setAttribute('type', 'checkbox');
      event.target.checked = true;
      event.target.indeterminate = false;

      onClickTfoot(event);

      expect(grid.select).toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();
      expect(grid.sortBy).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });
  });

  describe('onClickTbody', function() {
    beforeEach(function() {
      spyOn(grid.$selection, 'reset').and.callThrough();
      spyOn(grid.$selection, 'push').and.callThrough();
      spyOn(grid.$selection, 'remove').and.callThrough();
    });

    it('should not select data if target element is tbody', function() {
      event.target = document.createElement('TBODY');

      onClickTbody(event);

      expect(grid.$selection.push).not.toHaveBeenCalled();
      expect(grid.$selection.remove).not.toHaveBeenCalled();
      expect(grid.$selection.reset).not.toHaveBeenCalled();
    });

    it('should not select data if target element is an editable input control', function() {
      var input = document.createElement('INPUT');
      input.setAttribute('data-waffle-id', 10);

      event.target = input;

      onClickTbody(event);

      expect(grid.$selection.push).not.toHaveBeenCalled();
      expect(grid.$selection.remove).not.toHaveBeenCalled();
      expect(grid.$selection.reset).not.toHaveBeenCalled();
    });

    it('should not select data if grid is not selectable', function() {
      grid.options.selection.enable = false;

      event.shiftKey = false;
      event.ctrlKey = false;
      event.target = document.createElement('TR');
      event.target.setAttribute('data-waffle-idx', '0');

      onClickTbody(event);

      expect(grid.$selection.push).not.toHaveBeenCalled();
      expect(grid.$selection.remove).not.toHaveBeenCalled();
      expect(grid.$selection.reset).not.toHaveBeenCalled();
    });

    it('should not select data if grid is selectable but data is not', function() {
      var fn = jasmine.createSpy('fn').and.returnValue(false);

      grid.options.selection.enable = fn;

      event.shiftKey = false;
      event.ctrlKey = false;
      event.target = document.createElement('TR');
      event.target.setAttribute('data-waffle-idx', '0');

      onClickTbody(event);

      expect(fn).toHaveBeenCalledWith(grid.$data[0]);
      expect(grid.$selection.push).not.toHaveBeenCalled();
      expect(grid.$selection.remove).not.toHaveBeenCalled();
      expect(grid.$selection.reset).not.toHaveBeenCalled();
    });

    describe('with single selection', function() {
      beforeEach(function() {
        grid.options.selection.multi = false;
      });

      it('should select data', function() {
        event.shiftKey = false;
        event.ctrlKey = false;
        event.target = document.createElement('TR');
        event.target.setAttribute('data-waffle-idx', '0');

        onClickTbody(event);

        expect(grid.$selection.length).toBe(1);
        expect(grid.$selection[0]).toBe(grid.$data[0]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
      });

      it('should select and deselect data', function() {
        event.shiftKey = false;
        event.ctrlKey = false;
        event.target = document.createElement('TR');
        event.target.setAttribute('data-waffle-idx', '0');

        onClickTbody(event);

        expect(grid.$selection.length).toBe(1);
        expect(grid.$selection[0]).toBe(grid.$data[0]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();

        onClickTbody(event);

        expect(grid.$selection.length).toBe(0);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
      });

      it('should other data', function() {
        event.shiftKey = false;
        event.ctrlKey = false;
        event.target = document.createElement('TR');
        event.target.setAttribute('data-waffle-idx', '0');

        onClickTbody(event);

        expect(grid.$selection.length).toBe(1);
        expect(grid.$selection[0]).toBe(grid.$data[0]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();

        event.target = document.createElement('TR');
        event.target.setAttribute('data-waffle-idx', '1');

        onClickTbody(event);
        expect(grid.$selection.length).toBe(1);
        expect(grid.$selection[0]).toBe(grid.$data[1]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
      });
    });

    describe('with multi selection', function() {
      beforeEach(function() {
        grid.options.selection.multi = true;
      });

      it('should select data', function() {
        event.shiftKey = false;
        event.ctrlKey = false;
        event.target = document.createElement('TR');
        event.target.setAttribute('data-waffle-idx', '0');

        onClickTbody(event);

        expect(grid.$selection.length).toBe(1);
        expect(grid.$selection[0]).toBe(grid.$data[0]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
      });

      it('should select and deselect data', function() {
        event.shiftKey = false;
        event.ctrlKey = false;
        event.target = document.createElement('TR');
        event.target.setAttribute('data-waffle-idx', '0');

        onClickTbody(event);

        expect(grid.$selection.length).toBe(1);
        expect(grid.$selection[0]).toBe(grid.$data[0]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();

        onClickTbody(event);

        expect(grid.$selection.length).toBe(0);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
      });

      it('should select other data', function() {
        event.shiftKey = false;
        event.ctrlKey = false;
        event.target = document.createElement('TR');
        event.target.setAttribute('data-waffle-idx', '0');

        onClickTbody(event);

        expect(grid.$selection.length).toBe(1);
        expect(grid.$selection[0]).toBe(grid.$data[0]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();

        event.target = document.createElement('TR');
        event.target.setAttribute('data-waffle-idx', '1');

        onClickTbody(event);

        expect(grid.$selection.length).toBe(2);
        expect(grid.$selection[0]).toBe(grid.$data[0]);
        expect(grid.$selection[1]).toBe(grid.$data[1]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
      });

      it('should select set of data with shift key', function() {
        event.shiftKey = false;
        event.ctrlKey = false;
        event.target = document.createElement('TR');
        event.target.setAttribute('data-waffle-idx', '0');

        onClickTbody(event);

        expect(grid.$selection.length).toBe(1);
        expect(grid.$selection[0]).toBe(grid.$data[0]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();

        event.shiftKey = true;
        event.ctrlKey = false;
        event.target = document.createElement('TR');
        event.target.setAttribute('data-waffle-idx', '2');

        onClickTbody(event);

        expect(grid.$selection.length).toBe(3);
        expect(grid.$selection[0]).toBe(grid.$data[0]);
        expect(grid.$selection[1]).toBe(grid.$data[1]);
        expect(grid.$selection[2]).toBe(grid.$data[2]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
      });

      it('should select set of selectable data with shift key', function() {
        var fn = jasmine.createSpy('fn').and.callFake(function(data) {
          return data.firstName !== 'foo2';
        });

        grid.options.selection.enable = fn;

        event.shiftKey = false;
        event.ctrlKey = false;
        event.target = document.createElement('TR');
        event.target.setAttribute('data-waffle-idx', '0');

        onClickTbody(event);

        expect(grid.$selection.length).toBe(1);
        expect(grid.$selection[0]).toBe(grid.$data[0]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();

        event.shiftKey = true;
        event.ctrlKey = false;
        event.target = document.createElement('TR');
        event.target.setAttribute('data-waffle-idx', '2');

        onClickTbody(event);

        expect(grid.$selection.length).toBe(2);
        expect(grid.$selection[0]).toBe(grid.$data[0]);
        expect(grid.$selection[1]).toBe(grid.$data[2]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
      });

      it('should set of data with shift key in reverse order', function() {
        event.shiftKey = false;
        event.ctrlKey = false;
        event.target = document.createElement('TR');
        event.target.setAttribute('data-waffle-idx', '2');

        onClickTbody(event);

        expect(grid.$selection.length).toBe(1);
        expect(grid.$selection[0]).toBe(grid.$data[2]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();

        event.shiftKey = true;
        event.ctrlKey = false;
        event.target = document.createElement('TR');
        event.target.setAttribute('data-waffle-idx', '0');

        onClickTbody(event);

        expect(grid.$selection.length).toBe(3);
        expect(grid.$selection[0]).toBe(grid.$data[2]);
        expect(grid.$selection[1]).toBe(grid.$data[0]);
        expect(grid.$selection[2]).toBe(grid.$data[1]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
      });
    });
  });

  describe('onInputTbody', function() {
    var columnFirstName;
    var columnAdmin;
    var columnAge;
    var data0;
    var tr;

    beforeEach(function() {
      data0 = grid.$data.at(0);

      columnFirstName = grid.$columns.at(1);
      columnFirstName.editable = {
        enable: true,
        type: 'text',
        css: null
      };

      columnAdmin = grid.$columns.at(3);
      columnAdmin.editable = {
        enable: true,
        type: 'checkbox',
        css: null
      };

      columnAge = grid.$columns.at(4);
      columnAge.editable = {
        enable: true,
        type: 'number'
      };

      var columns = grid.$columns;
      for (var i = 0, size = columns.length; i < size; ++i) {
        spyOn(columns[i], 'value').and.callThrough();
      }

      tr = document.createElement('TR');
      tr.setAttribute('data-waffle-idx', 0);

      spyOn($doc, 'findParent').and.returnValue(tr);

      spyOn(grid.$data, 'replace').and.callThrough();
      spyOn(grid.$data, 'notifyUpdate').and.callThrough();
      spyOn(grid, 'dispatchEvent').and.callThrough();
    });

    it('should update object value using text type', function() {
      var input = document.createElement('INPUT');
      input.setAttribute('data-waffle-id', 'firstName');
      input.value = 'foo bar';

      event.target = input;

      onInputTbody(event);

      expect($doc.findParent).toHaveBeenCalledWith(input, 'TR');
      expect(columnFirstName.value).toHaveBeenCalledWith(data0, 'foo bar');
      expect(data0.firstName).toBe('foo bar');

      expect(grid.dispatchEvent).toHaveBeenCalledWith('datachanged', {
        index: 0,
        object: data0,
        field: 'firstName',
        oldValue: 'foo1',
        newValue: 'foo bar'
      });

      expect(grid.$data.replace).toHaveBeenCalledWith(data0);
      expect(grid.$data.notifyUpdate).toHaveBeenCalledWith(0);
    });

    it('should update object value using number type', function() {
      var input = document.createElement('INPUT');
      input.setAttribute('data-waffle-id', 'age');
      input.value = '50';

      event.target = input;

      onInputTbody(event);

      expect($doc.findParent).toHaveBeenCalledWith(input, 'TR');
      expect(columnAge.value).toHaveBeenCalledWith(data0, 50);
      expect(data0.age).toBe(50);

      expect(grid.dispatchEvent).toHaveBeenCalledWith('datachanged', {
        index: 0,
        object: data0,
        field: 'age',
        oldValue: 20,
        newValue: 50
      });

      expect(grid.$data.replace).toHaveBeenCalledWith(data0);
      expect(grid.$data.notifyUpdate).toHaveBeenCalledWith(0);
    });

    it('should update object value using checked checkbox', function() {
      var checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');
      checkbox.setAttribute('data-waffle-id', 'admin');
      checkbox.checked = true;

      event.target = checkbox;

      onInputTbody(event);

      expect($doc.findParent).toHaveBeenCalledWith(checkbox, 'TR');
      expect(columnAdmin.value).toHaveBeenCalledWith(data0, true);
      expect(data0.admin).toBe(true);

      expect(grid.dispatchEvent).toHaveBeenCalledWith('datachanged', {
        index: 0,
        object: data0,
        field: 'admin',
        oldValue: false,
        newValue: true
      });

      expect(grid.$data.replace).toHaveBeenCalledWith(data0);
      expect(grid.$data.notifyUpdate).toHaveBeenCalledWith(0);
    });

    it('should update object value using unchecked checkbox', function() {
      data0.admin = true;

      var checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');
      checkbox.setAttribute('data-waffle-id', 'admin');
      checkbox.checked = false;

      event.target = checkbox;

      onInputTbody(event);

      expect($doc.findParent).toHaveBeenCalledWith(checkbox, 'TR');
      expect(columnAdmin.value).toHaveBeenCalledWith(data0, false);
      expect(data0.admin).toBe(false);

      expect(grid.dispatchEvent).toHaveBeenCalledWith('datachanged', {
        index: 0,
        object: data0,
        field: 'admin',
        oldValue: true,
        newValue: false
      });

      expect(grid.$data.replace).toHaveBeenCalledWith(data0);
      expect(grid.$data.notifyUpdate).toHaveBeenCalledWith(0);
    });

    it('should not update object value for input event not related to grid column', function() {
      var input = document.createElement('INPUT');
      input.value = 'foo bar';

      event.target = input;

      onInputTbody(event);

      expect($doc.findParent).not.toHaveBeenCalled();
    });

    it('should not update object value for input event not related to editable column', function() {
      var input = document.createElement('INPUT');
      input.setAttribute('data-waffle-id', 'firstName');
      input.value = 'foo bar';

      columnFirstName.editable = false;

      event.target = input;

      onInputTbody(event);

      expect($doc.findParent).not.toHaveBeenCalled();
      expect(columnFirstName.value).not.toHaveBeenCalled();
      expect(data0.firstName).toBe('foo1');

      expect(grid.$data.replace).not.toHaveBeenCalled();
      expect(grid.$data.notifyUpdate).not.toHaveBeenCalled();
    });

    it('should not update object value for input event not related to editable column using enable attribute', function() {
      var input = document.createElement('INPUT');
      input.setAttribute('data-waffle-id', 'firstName');
      input.value = 'foo bar';

      columnFirstName.editable = {
        enable: false,
        type: 'text',
        css: null
      };

      event.target = input;

      onInputTbody(event);

      expect($doc.findParent).not.toHaveBeenCalled();
      expect(columnFirstName.value).not.toHaveBeenCalled();
      expect(data0.firstName).toBe('foo1');

      expect(grid.$data.replace).not.toHaveBeenCalled();
      expect(grid.$data.notifyUpdate).not.toHaveBeenCalled();
    });

    it('should not update object value for input event not related to grid row', function() {
      var input = document.createElement('INPUT');
      input.setAttribute('data-waffle-id', 'firstName');
      input.value = 'foo bar';

      $doc.findParent.and.returnValue(null);

      event.target = input;

      onInputTbody(event);

      expect($doc.findParent).toHaveBeenCalledWith(input, 'TR');
      expect(columnFirstName.value).not.toHaveBeenCalled();
      expect(data0.firstName).toBe('foo1');

      expect(grid.$data.replace).not.toHaveBeenCalled();
      expect(grid.$data.notifyUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Drag & Drop', function() {
    var th1;

    beforeEach(function() {
      th1 = document.createElement('TH');
      th1.draggable = true;
      th1.setAttribute('data-waffle-id', 'id');

      event.dataTransfer = {
        setData: jasmine.createSpy('setData'),
        getData: jasmine.createSpy('getData'),
        clearData: jasmine.createSpy('clearData')
      };
    });

    it('should start drag effect', function() {
      event.target = th1;

      onDragStart(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(th1.className).toContain('waffle-draggable-drag');
      expect(event.dataTransfer.effectAllowed).toBe('move');
      expect(event.dataTransfer.clearData).toHaveBeenCalled();
      expect(event.dataTransfer.setData).toHaveBeenCalledWith('Text', 'id');
    });

    it('should start drag effect and get dataTransfer object from originalEvent', function() {
      event.target = th1;

      var dataTransfer = event.dataTransfer;

      // With jQuery, dataTransfer object is stored under "originalEvent"
      delete event.dataTransfer;
      event.originalEvent = {
        dataTransfer: dataTransfer
      };

      onDragStart(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(th1.className).toContain('waffle-draggable-drag');
      expect(dataTransfer.effectAllowed).toBe('move');
      expect(dataTransfer.setData).toHaveBeenCalledWith('Text', 'id');
    });

    it('should not start drag effect for non draggable element', function() {
      th1.removeAttribute('draggable');
      event.target = th1;

      onDragStart(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(th1.className).not.toContain('waffle-draggable-drag');
      expect(event.dataTransfer.setData).not.toHaveBeenCalled();
    });

    it('should end drag effect', function() {
      var th2 = document.createElement('TH');
      var th3 = document.createElement('TH');

      th1.className = 'waffle-draggable-over';
      th2.className = 'waffle-draggable-over';
      th3.className = 'waffle-draggable-over';

      spyOn($doc, 'byTagName').and.returnValue([th2, th3]);
      spyOn($doc, 'findParent').and.returnValue(table);

      th1.className = 'waffle-draggable-drag';
      event.target = th1;

      onDragEnd(event);

      expect(event.preventDefault).not.toHaveBeenCalled();

      expect(th1.className).not.toContain('waffle-draggable-drag');
      expect(th1.className).not.toContain('waffle-draggable-over');

      expect($doc.byTagName).toHaveBeenCalledWith('th', grid.$table[0]);
      expect(th2.className).not.toContain('waffle-draggable-over');
      expect(th3.className).not.toContain('waffle-draggable-over');

      expect(event.dataTransfer.clearData).not.toHaveBeenCalled();
    });

    it('should not remove css on end drag effect for non table childs', function() {
      var th2 = document.createElement('TH');
      var th3 = document.createElement('TH');

      th1.className = 'waffle-draggable-over';
      th2.className = 'waffle-draggable-over';
      th3.className = 'waffle-draggable-over';

      spyOn($doc, 'byTagName').and.returnValue([th2, th3]);
      spyOn($doc, 'findParent').and.returnValue(document.createElement('table'));

      th1.className = 'waffle-draggable-drag';
      event.target = th1;

      onDragEnd(event);

      expect(event.preventDefault).not.toHaveBeenCalled();

      expect(th1.className).toContain('waffle-draggable-drag');

      expect($doc.byTagName).toHaveBeenCalledWith('th', grid.$table[0]);
      expect(th2.className).not.toContain('waffle-draggable-drag');
      expect(th3.className).not.toContain('waffle-draggable-drag');

      expect(event.dataTransfer.clearData).not.toHaveBeenCalled();
    });

    it('should end drag effect and get dataTransfer object from originalEvent', function() {
      var th2 = document.createElement('TH');
      var th3 = document.createElement('TH');

      th1.className = 'waffle-draggable-over';
      th2.className = 'waffle-draggable-over';
      th3.className = 'waffle-draggable-over';

      spyOn($doc, 'findParent').and.returnValue(table);
      spyOn($doc, 'byTagName').and.returnValue([th2, th3]);

      th1.className = 'waffle-draggable-drag';
      event.target = th1;

      var dataTransfer = event.dataTransfer;

      // With jQuery, dataTransfer object is stored under "originalEvent"
      delete event.dataTransfer;
      event.originalEvent = {
        dataTransfer: dataTransfer
      };

      onDragEnd(event);

      expect(event.preventDefault).not.toHaveBeenCalled();

      expect(th1.className).not.toContain('waffle-draggable-drag');
      expect(th1.className).not.toContain('waffle-draggable-over');

      expect($doc.byTagName).toHaveBeenCalledWith('th', grid.$table[0]);
      expect(th2.className).not.toContain('waffle-draggable-over');
      expect(th3.className).not.toContain('waffle-draggable-over');

      expect(dataTransfer.clearData).not.toHaveBeenCalled();
    });

    it('should not end drag effect for non draggable elements', function() {
      th1.removeAttribute('draggable');

      spyOn($doc, 'byTagName').and.returnValue([]);

      event.target = th1;

      onDragEnd(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect($doc.byTagName).toHaveBeenCalled();
    });

    it('should drag over element', function() {
      var th2 = document.createElement('TH');
      th2.setAttribute('draggable', true);

      spyOn($doc, 'findParent').and.returnValue(table);

      event.target = th2;

      var result = onDragOver(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(result).toBeFalse();

      expect(event.dataTransfer.dropEffect).toBe('move');
    });

    it('should not drag over element for non table childs element', function() {
      var th2 = document.createElement('TH');
      th2.setAttribute('draggable', true);

      spyOn($doc, 'findParent').and.returnValue(document.createElement('table'));

      event.target = th2;

      var result = onDragOver(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(result).not.toBeFalse();

      expect(event.dataTransfer.dropEffect).not.toBe('move');
    });

    it('should drag over element and get dataTransfer object from originalEvent', function() {
      var dataTransfer = event.dataTransfer;

      // With jQuery, dataTransfer object is stored under "originalEvent"
      delete event.dataTransfer;
      event.originalEvent = {
        dataTransfer: dataTransfer
      };

      var th2 = document.createElement('TH');
      th2.setAttribute('draggable', true);

      spyOn($doc, 'findParent').and.returnValue(table);

      event.target = th2;

      var result = onDragOver(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(result).toBeFalse();

      expect(dataTransfer.dropEffect).toBe('move');
    });

    it('should enter new element', function() {
      var th2 = document.createElement('TH');
      th2.draggable = true;

      spyOn($doc, 'findParent').and.returnValue(table);

      event.target = th2;

      var result = onDragEnter(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(result).toBeFalse();

      expect(th2.className).toContain('waffle-draggable-over');
    });

    it('should enter new element for non table childs', function() {
      var th2 = document.createElement('TH');
      th2.draggable = true;

      spyOn($doc, 'findParent').and.returnValue(document.createElement('table'));

      event.target = th2;

      var result = onDragEnter(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(result).not.toBeFalse();

      expect(th2.className).not.toContain('waffle-draggable-over');
    });

    it('should not enter new element for non draggable element', function() {
      var th2 = document.createElement('TH');
      th2.removeAttribute('draggable');

      spyOn($doc, 'findParent').and.returnValue(table);

      event.target = th2;

      var result = onDragEnter(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(result).not.toBeFalse();

      expect(th2.className).not.toContain('waffle-draggable-over');
      expect($doc.findParent).not.toHaveBeenCalled();
    });

    it('should leave element', function() {
      var th2 = document.createElement('TH');
      th2.draggable = true;
      th2.className = 'waffle-draggable-over';

      spyOn($doc, 'findParent').and.returnValue(table);

      event.target = th2;

      var result = onDragLeave(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(result).toBeFalse();

      expect(th2.className).not.toContain('waffle-draggable-over');
    });

    it('should not leave element for non table childs', function() {
      var th2 = document.createElement('TH');
      th2.draggable = true;
      th2.className = 'waffle-draggable-over';

      spyOn($doc, 'findParent').and.returnValue(document.createElement('table'));

      event.target = th2;

      var result = onDragLeave(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(result).not.toBeFalse();

      expect(th2.className).toContain('waffle-draggable-over');
    });

    it('should drop element', function() {
      var columns = grid.$columns;
      spyOn(columns, 'remove').and.callThrough();
      spyOn(columns, 'add').and.callThrough();
      spyOn(columns, 'indexOf').and.callThrough();

      var oldColumn = columns.at(0);

      var th2 = document.createElement('TH');
      th2.draggable = true;
      th2.setAttribute('data-waffle-id', 'firstName');
      th2.className = 'waffle-draggable-over';

      // Spy dataTransfer object
      event.dataTransfer.getData.and.returnValue('id');

      spyOn($doc, 'findParent').and.returnValue(table);

      event.target = th2;

      onDragDrop(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(th2.className).not.toContain('waffle-draggable-over');

      expect(columns.remove).toHaveBeenCalledWith(0, 1);
      expect(columns.add).toHaveBeenCalledWith([oldColumn], 1);
      expect(event.dataTransfer.getData).toHaveBeenCalledWith('Text');
      expect(event.dataTransfer.clearData).not.toHaveBeenCalled();
    });

    it('should drop element on non table childs', function() {
      var columns = grid.$columns;
      spyOn(columns, 'remove').and.callThrough();
      spyOn(columns, 'add').and.callThrough();
      spyOn(columns, 'indexOf').and.callThrough();

      var oldColumn = columns.at(0);

      var th2 = document.createElement('TH');
      th2.draggable = true;
      th2.setAttribute('data-waffle-id', 'firstName');
      th2.className = 'waffle-draggable-over';

      // Spy dataTransfer object
      event.dataTransfer.getData.and.returnValue('id');

      spyOn($doc, 'findParent').and.returnValue(document.createElement('table'));

      event.target = th2;

      var result = onDragDrop(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(result).not.toBeFalse();

      expect(columns.remove).not.toHaveBeenCalled();
      expect(columns.add).not.toHaveBeenCalled();
      expect(event.dataTransfer.getData).not.toHaveBeenCalled();
    });

    it('should drop element and get dataTransfer object from originalEvent', function() {
      var columns = grid.$columns;
      spyOn(columns, 'remove').and.callThrough();
      spyOn(columns, 'add').and.callThrough();
      spyOn(columns, 'indexOf').and.callThrough();

      var oldColumn = columns.at(0);

      var th2 = document.createElement('TH');
      th2.draggable = true;
      th2.setAttribute('data-waffle-id', 'firstName');
      th2.className = 'waffle-draggable-over';

      // Spy dataTransfer object
      var dataTransfer = event.dataTransfer;
      dataTransfer.getData.and.returnValue('id');

      // With jQuery, dataTransfer object is stored under "originalEvent"
      delete event.dataTransfer;
      event.originalEvent = {
        dataTransfer: dataTransfer
      };

      spyOn($doc, 'findParent').and.returnValue(table);

      event.target = th2;

      onDragDrop(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(th2.className).not.toContain('waffle-draggable-over');

      expect(columns.remove).toHaveBeenCalledWith(0, 1);
      expect(columns.add).toHaveBeenCalledWith([oldColumn], 1);
      expect(dataTransfer.getData).toHaveBeenCalledWith('Text');
      expect(dataTransfer.clearData).not.toHaveBeenCalled();
    });

    it('should drop element on non draggable elements', function() {
      var columns = grid.$columns;
      spyOn(columns, 'remove').and.callThrough();
      spyOn(columns, 'add').and.callThrough();
      spyOn(columns, 'indexOf').and.callThrough();

      var oldColumn = columns.at(0);

      var th2 = document.createElement('TH');
      th2.removeAttribute('draggable');
      th2.setAttribute('data-waffle-id', 'firstName');

      // Spy dataTransfer object
      event.dataTransfer.getData.and.returnValue('id');

      event.target = th2;

      var result = onDragDrop(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(result).not.toBeFalse();

      expect(th2.className).not.toContain('waffle-draggable-over');

      expect(columns.remove).not.toHaveBeenCalled();
      expect(columns.add).not.toHaveBeenCalled();
      expect(event.dataTransfer.getData).not.toHaveBeenCalled();
    });

    it('should not drop element on same element', function() {
      var columns = grid.$columns;
      spyOn(columns, 'remove').and.callThrough();
      spyOn(columns, 'add').and.callThrough();
      spyOn(columns, 'indexOf').and.callThrough();

      var oldColumn = columns.at(0);

      var th2 = document.createElement('TH');
      th2.removeAttribute('draggable');
      th2.setAttribute('data-waffle-id', 'id');

      // Spy dataTransfer object
      event.dataTransfer.getData.and.returnValue('id');

      event.target = th2;

      var result = onDragDrop(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(result).not.toBeFalse();

      expect(th2.className).not.toContain('waffle-draggable-over');

      expect(columns.remove).not.toHaveBeenCalled();
      expect(columns.add).not.toHaveBeenCalled();
      expect(event.dataTransfer.getData).not.toHaveBeenCalled();
    });

    it('should initiate drag&drop on text selection', function() {
      th1.dragDrop = jasmine.createSpy('dragDrop');

      event.target = th1;

      var result = onSelectStart(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(result).toBeFalse();

      expect(th1.dragDrop).toHaveBeenCalled();
    });

    it('should initiate drag&drop on text selection for non draggable elements', function() {
      th1.removeAttribute('draggable');
      th1.dragDrop = jasmine.createSpy('dragDrop');

      event.target = th1;

      var result = onSelectStart(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(result).not.toBeFalse();

      expect(th1.dragDrop).not.toHaveBeenCalled();
    });
  });
});
