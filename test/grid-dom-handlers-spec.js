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

  var grid, data, columns;
  var onClickTbody, onClickThead, onClickTfoot;
  var event;

  beforeEach(function() {
    var table = document.createElement('table');

    columns = [
      { id: 'id', sortable: false },
      { id: 'firstName' },
      { id: 'lastName' }
    ];

    data = [
      { id: 1, firstName: 'foo1', lastName: 'bar1' },
      { id: 2, firstName: 'foo2', lastName: 'bar2' },
      { id: 3, firstName: 'foo2', lastName: 'bar3' }
    ];

    grid = new Grid(table, {
      data: data,
      columns: columns
    });

    onClickThead = _.bind(GridDomHandlers.onClickThead, grid);
    onClickTfoot = _.bind(GridDomHandlers.onClickTfoot, grid);
    onClickTbody = _.bind(GridDomHandlers.onClickTbody, grid);

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
      grid.$sortBy = ['+foo'];

      event.shiftKey = true;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '-');

      onClickThead(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['+foo', '+id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should replace column to current sort in descendant order', function() {
      grid.$sortBy = ['+id', '+foo'];

      event.shiftKey = true;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '+');

      onClickThead(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['+foo', '-id']);
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
      grid.$sortBy = ['+foo'];

      event.shiftKey = true;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '-');

      onClickTfoot(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['+foo', '+id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should replace column to current sort in descendant order', function() {
      grid.$sortBy = ['+id', '+foo'];

      event.shiftKey = true;
      event.target = document.createElement('TH');
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '+');

      onClickTfoot(event);

      expect(grid.sortBy).toHaveBeenCalledWith(['+foo', '-id']);
      expect(grid.select).not.toHaveBeenCalled();
      expect(grid.deselect).not.toHaveBeenCalled();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('should deselect entire grid', function() {
      event.target = document.createElement('INPUT');
      event.target.setAttribute('type', 'checkbox');
      event.target.checked = false;
      event.target.indeterminate = false;
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '+');

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
      event.target.setAttribute('data-waffle-id', 'id');
      event.target.setAttribute('data-waffle-sortable', 'true');
      event.target.setAttribute('data-waffle-order', '+');

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

    describe('with single selection', function() {
      beforeEach(function() {
        grid.options.selection = {
          multi: false
        };
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
        grid.options.selection = {
          multi: true
        };
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

        expect(grid.$selection.length).toBe(2);
        expect(grid.$selection[0]).toBe(grid.$data[0]);
        expect(grid.$selection[1]).toBe(grid.$data[1]);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
      });

      it('should set of data with shift key', function() {
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
});
