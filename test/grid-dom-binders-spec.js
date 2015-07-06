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

describe('Grid Dom Binders', function() {

  var table, columns, data;

  beforeEach(function() {
    table = document.createElement('table');

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
  });

  describe('with headers and footers', function() {
    var grid;

    beforeEach(function() {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        view: {
          thead: true,
          tfoot: true
        }
      });

      // Reset events for tests
      grid.$$events = {};

      spyOn(grid.$thead, 'on');
      spyOn(grid.$tfoot, 'on');
      spyOn(grid.$tbody, 'on');
      spyOn(grid.$table, 'on');

      spyOn(grid.$thead, 'off');
      spyOn(grid.$tfoot, 'off');
      spyOn(grid.$tbody, 'off');
      spyOn(grid.$table, 'off');
    });

    it('should bind resize event', function() {
      var jq = $.fn || $.prototype;
      spyOn(jq, 'on');

      GridDomBinders.bindResize(grid);

      expect(grid.$$events).toEqual({
        onResize: jasmine.any(Function)
      });

      expect(jq.on).toHaveBeenCalledWith('resize', grid.$$events.onResize);

      // It should not bind twice
      jq.on.calls.reset();

      GridDomBinders.bindResize(grid);

      expect(jq.on).not.toHaveBeenCalled();
    });

    it('should bind input events', function() {
      spyOn($sniffer, 'hasEvent').and.returnValue(true);

      GridDomBinders.bindEdition(grid);

      expect(grid.$$events).toEqual({
        onInputTbody: jasmine.any(Function)
      });

      expect(grid.$table.on).not.toHaveBeenCalled();
      expect(grid.$thead.on).not.toHaveBeenCalled();
      expect(grid.$tfoot.on).not.toHaveBeenCalled();
      expect(grid.$tbody.on).toHaveBeenCalledWith('input change', grid.$$events.onInputTbody);

      // It should not bind twice
      grid.$table.on.calls.reset();
      grid.$thead.on.calls.reset();
      grid.$tfoot.on.calls.reset();
      grid.$tbody.on.calls.reset();

      GridDomBinders.bindEdition(grid);

      expect(grid.$tbody.on).not.toHaveBeenCalled();
    });

    it('should bind input events using fallback events', function() {
      spyOn($sniffer, 'hasEvent').and.returnValue(false);

      GridDomBinders.bindEdition(grid);

      expect(grid.$$events).toEqual({
        onInputTbody: jasmine.any(Function)
      });

      expect(grid.$table.on).not.toHaveBeenCalled();
      expect(grid.$thead.on).not.toHaveBeenCalled();
      expect(grid.$tfoot.on).not.toHaveBeenCalled();
      expect(grid.$tbody.on).toHaveBeenCalledWith('keyup change', grid.$$events.onInputTbody);

      // It should not bind twice
      grid.$table.on.calls.reset();
      grid.$thead.on.calls.reset();
      grid.$tfoot.on.calls.reset();
      grid.$tbody.on.calls.reset();

      GridDomBinders.bindEdition(grid);

      expect(grid.$tbody.on).not.toHaveBeenCalled();
    });

    it('should bind selection events', function() {
      GridDomBinders.bindSelection(grid);

      expect(grid.$$events).toEqual({
        onClickThead: jasmine.any(Function),
        onClickTfoot: jasmine.any(Function),
        onClickTbody: jasmine.any(Function)
      });

      expect(grid.$thead.on).toHaveBeenCalledWith('click', grid.$$events.onClickThead);
      expect(grid.$tfoot.on).toHaveBeenCalledWith('click', grid.$$events.onClickTfoot);
      expect(grid.$tbody.on).toHaveBeenCalledWith('click', grid.$$events.onClickTbody);
      expect(grid.$table.on).not.toHaveBeenCalled();

      // It should not bind twice
      grid.$table.on.calls.reset();
      grid.$thead.on.calls.reset();
      grid.$tfoot.on.calls.reset();
      grid.$tbody.on.calls.reset();

      GridDomBinders.bindSelection(grid);

      expect(grid.$thead.on).not.toHaveBeenCalled();
      expect(grid.$tfoot.on).not.toHaveBeenCalled();
      expect(grid.$tbody.on).not.toHaveBeenCalled();
    });

    it('should unbind input events', function() {
      spyOn($sniffer, 'hasEvent').and.returnValue(true);

      GridDomBinders.unbindEdition(grid);

      expect(grid.$$events).toEqual({
      });

      expect(grid.$table.off).not.toHaveBeenCalled();
      expect(grid.$thead.off).not.toHaveBeenCalled();
      expect(grid.$tfoot.off).not.toHaveBeenCalled();
      expect(grid.$tbody.off).not.toHaveBeenCalled();

      // Add event programmatically
      var onInputTbody = jasmine.createSpy('onInputTbody');
      grid.$$events.onInputTbody = onInputTbody;

      GridDomBinders.unbindEdition(grid);

      expect(grid.$table.off).not.toHaveBeenCalled();
      expect(grid.$thead.off).not.toHaveBeenCalled();
      expect(grid.$tfoot.off).not.toHaveBeenCalled();
      expect(grid.$tbody.off).toHaveBeenCalledWith('input change', onInputTbody);
      expect(grid.$$events).toEqual({
        onInputTbody: null
      });
    });

    it('should unbind input events using fallback events', function() {
      spyOn($sniffer, 'hasEvent').and.returnValue(false);

      GridDomBinders.unbindEdition(grid);

      expect(grid.$$events).toEqual({
      });

      expect(grid.$table.off).not.toHaveBeenCalled();
      expect(grid.$thead.off).not.toHaveBeenCalled();
      expect(grid.$tfoot.off).not.toHaveBeenCalled();
      expect(grid.$tbody.off).not.toHaveBeenCalled();

      // Add event programmatically
      var onInputTbody = jasmine.createSpy('onInputTbody');
      grid.$$events.onInputTbody = onInputTbody;

      GridDomBinders.unbindEdition(grid);

      expect(grid.$table.off).not.toHaveBeenCalled();
      expect(grid.$thead.off).not.toHaveBeenCalled();
      expect(grid.$tfoot.off).not.toHaveBeenCalled();
      expect(grid.$tbody.off).toHaveBeenCalledWith('keyup change', onInputTbody);
      expect(grid.$$events).toEqual({
        onInputTbody: null
      });
    });

    it('should bind sort events', function() {
      GridDomBinders.bindSort(grid);

      expect(grid.$$events).toEqual({
        onClickThead: jasmine.any(Function),
        onClickTfoot: jasmine.any(Function)
      });

      expect(grid.$thead.on).toHaveBeenCalledWith('click', grid.$$events.onClickThead);
      expect(grid.$tfoot.on).toHaveBeenCalledWith('click', grid.$$events.onClickTfoot);
      expect(grid.$tbody.on).not.toHaveBeenCalled();
      expect(grid.$table.on).not.toHaveBeenCalled();

      // It should not bind twice
      grid.$table.on.calls.reset();
      grid.$thead.on.calls.reset();
      grid.$tfoot.on.calls.reset();
      grid.$tbody.on.calls.reset();

      GridDomBinders.bindSort(grid);

      expect(grid.$table.on).not.toHaveBeenCalled();
      expect(grid.$thead.on).not.toHaveBeenCalled();
      expect(grid.$tfoot.on).not.toHaveBeenCalled();
      expect(grid.$tbody.on).not.toHaveBeenCalled();
    });

    it('should bind drag & drop events', function() {
      GridDomBinders.bindDragDrop(grid);

      expect(grid.$$events).toEqual({
        onDragStart: jasmine.any(Function),
        onDragOver: jasmine.any(Function),
        onDragEnd: jasmine.any(Function),
        onDragLeave: jasmine.any(Function),
        onDragEnter: jasmine.any(Function),
        onDragDrop: jasmine.any(Function)
      });

      expect(grid.$thead.on).not.toHaveBeenCalled();
      expect(grid.$tfoot.on).not.toHaveBeenCalled();
      expect(grid.$tbody.on).not.toHaveBeenCalled();

      expect(grid.$table.on).toHaveBeenCalledWith('dragstart', grid.$$events.onDragStart);
      expect(grid.$table.on).toHaveBeenCalledWith('dragover', grid.$$events.onDragOver);
      expect(grid.$table.on).toHaveBeenCalledWith('dragend', grid.$$events.onDragEnd);
      expect(grid.$table.on).toHaveBeenCalledWith('dragleave', grid.$$events.onDragLeave);
      expect(grid.$table.on).toHaveBeenCalledWith('dragenter', grid.$$events.onDragEnter);
      expect(grid.$table.on).toHaveBeenCalledWith('drop', grid.$$events.onDragDrop);

      // It should not bind twice
      grid.$table.on.calls.reset();
      grid.$thead.on.calls.reset();
      grid.$tfoot.on.calls.reset();
      grid.$tbody.on.calls.reset();

      GridDomBinders.bindDragDrop(grid);

      expect(grid.$table.on).not.toHaveBeenCalled();
      expect(grid.$thead.on).not.toHaveBeenCalled();
      expect(grid.$tfoot.on).not.toHaveBeenCalled();
      expect(grid.$tbody.on).not.toHaveBeenCalled();
    });
  });

  describe('without footer', function() {
    var grid;

    beforeEach(function() {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        view: {
          thead: true,
          tfoot: false
        }
      });

      // Reset events for tests
      grid.$$events = {};

      spyOn(grid.$thead, 'on');
      spyOn(grid.$tbody, 'on');

      spyOn(grid.$thead, 'off');
      spyOn(grid.$tbody, 'off');
    });

    it('should bind selection events', function() {
      GridDomBinders.bindSelection(grid);

      expect(grid.$$events).toEqual({
        onClickThead: jasmine.any(Function),
        onClickTbody: jasmine.any(Function)
      });

      expect(grid.$thead.on).toHaveBeenCalledWith('click', grid.$$events.onClickThead);
      expect(grid.$tbody.on).toHaveBeenCalledWith('click', grid.$$events.onClickTbody);

      // It should not bind twice
      grid.$thead.on.calls.reset();
      grid.$tbody.on.calls.reset();

      GridDomBinders.bindSelection(grid);

      expect(grid.$thead.on).not.toHaveBeenCalled();
      expect(grid.$tbody.on).not.toHaveBeenCalled();
    });

    it('should bind sort events', function() {
      GridDomBinders.bindSort(grid);

      expect(grid.$$events).toEqual({
        onClickThead: jasmine.any(Function)
      });

      expect(grid.$thead.on).toHaveBeenCalledWith('click', grid.$$events.onClickThead);

      // It should not bind twice
      grid.$thead.on.calls.reset();
      grid.$tbody.on.calls.reset();

      GridDomBinders.bindSort(grid);

      expect(grid.$thead.on).not.toHaveBeenCalled();
    });
  });

  describe('without header', function() {
    var grid;

    beforeEach(function() {
      grid = new Grid(table, {
        data: data,
        columns: columns,
        view: {
          thead: false,
          tfoot: true
        }
      });

      // Reset events for tests
      grid.$$events = {};

      spyOn(grid.$tfoot, 'on');
      spyOn(grid.$tbody, 'on');

      spyOn(grid.$tfoot, 'off');
      spyOn(grid.$tbody, 'off');
    });

    it('should bind selection events', function() {
      GridDomBinders.bindSelection(grid);

      expect(grid.$$events).toEqual({
        onClickTfoot: jasmine.any(Function),
        onClickTbody: jasmine.any(Function)
      });

      expect(grid.$tfoot.on).toHaveBeenCalledWith('click', grid.$$events.onClickTfoot);
      expect(grid.$tbody.on).toHaveBeenCalledWith('click', grid.$$events.onClickTbody);

      // It should not bind twice
      grid.$tfoot.on.calls.reset();
      grid.$tbody.on.calls.reset();

      GridDomBinders.bindSelection(grid);

      expect(grid.$tfoot.on).not.toHaveBeenCalled();
      expect(grid.$tbody.on).not.toHaveBeenCalled();
    });

    it('should bind sort events', function() {
      GridDomBinders.bindSort(grid);

      expect(grid.$$events).toEqual({
        onClickTfoot: jasmine.any(Function)
      });

      expect(grid.$tfoot.on).toHaveBeenCalledWith('click', grid.$$events.onClickTfoot);

      // It should not bind twice
      grid.$tfoot.on.calls.reset();
      grid.$tbody.on.calls.reset();

      GridDomBinders.bindSort(grid);

      expect(grid.$tfoot.on).not.toHaveBeenCalled();
    });
  });
});
