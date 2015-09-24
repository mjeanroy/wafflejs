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
      { id: 'firstName', editable: true },
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
        onInputTbody: {
          events: 'input change',
          handler: jasmine.any(Function)
        }
      });

      expect(grid.$table.on).not.toHaveBeenCalled();
      expect(grid.$thead.on).not.toHaveBeenCalled();
      expect(grid.$tfoot.on).not.toHaveBeenCalled();
      expect(grid.$tbody.on).toHaveBeenCalledWith('input change', grid.$$events.onInputTbody.handler);

      // It should not bind twice
      grid.$table.on.calls.reset();
      grid.$thead.on.calls.reset();
      grid.$tfoot.on.calls.reset();
      grid.$tbody.on.calls.reset();

      GridDomBinders.bindEdition(grid);

      expect(grid.$tbody.on).not.toHaveBeenCalled();
    });

    it('should unbind input events', function() {
      spyOn($sniffer, 'hasEvent').and.returnValue(true);

      GridDomBinders.bindEdition(grid);

      var onInputTbody = grid.$$events.onInputTbody.handler;

      GridDomBinders.unbindEdition(grid);

      expect(grid.$table.off).not.toHaveBeenCalled();
      expect(grid.$thead.off).not.toHaveBeenCalled();
      expect(grid.$tfoot.off).not.toHaveBeenCalled();
      expect(grid.$tbody.off).toHaveBeenCalledWith('input change', onInputTbody);
      expect(grid.$$events.onInputTbody).toBeNull();
    });

    it('should bind selection events', function() {
      GridDomBinders.bindSelection(grid);

      expect(grid.$$events).toEqual({
        onClickThead: {
          events: 'click',
          handler: jasmine.any(Function)
        },
        onClickTfoot: {
          events: 'click',
          handler: jasmine.any(Function)
        },
        onClickTbody: {
          events: 'click',
          handler: jasmine.any(Function)
        }
      });

      expect(grid.$thead.on).toHaveBeenCalledWith('click', grid.$$events.onClickThead.handler);
      expect(grid.$tfoot.on).toHaveBeenCalledWith('click', grid.$$events.onClickTfoot.handler);
      expect(grid.$tbody.on).toHaveBeenCalledWith('click', grid.$$events.onClickTbody.handler);
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

    it('should unbind selection events', function() {
      GridDomBinders.bindSelection(grid);

      var onClickThead = grid.$$events.onClickThead.handler;
      var onClickTfoot = grid.$$events.onClickTfoot.handler;
      var onClickTbody = grid.$$events.onClickTbody.handler;

      GridDomBinders.unbindSelection(grid);

      expect(grid.$thead.off).toHaveBeenCalledWith('click', onClickThead);
      expect(grid.$tfoot.off).toHaveBeenCalledWith('click', onClickTfoot);
      expect(grid.$tbody.off).toHaveBeenCalledWith('click', onClickTbody);
      expect(grid.$table.off).not.toHaveBeenCalled();

      expect(grid.$$events.onClickThead).toBeNull();
      expect(grid.$$events.onClickTfoot).toBeNull();
      expect(grid.$$events.onClickTbody).toBeNull();
    });

    it('should bind sort events', function() {
      GridDomBinders.bindSort(grid);

      expect(grid.$$events).toEqual({
        onClickThead: {
          events: 'click',
          handler: jasmine.any(Function)
        },
        onClickTfoot: {
          events: 'click',
          handler: jasmine.any(Function)
        }
      });

      expect(grid.$thead.on).toHaveBeenCalledWith('click', grid.$$events.onClickThead.handler);
      expect(grid.$tfoot.on).toHaveBeenCalledWith('click', grid.$$events.onClickTfoot.handler);
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

    it('should unbind sort events', function() {
      GridDomBinders.bindSort(grid);

      var onClickThead = grid.$$events.onClickThead.handler;
      var onClickTfoot = grid.$$events.onClickTfoot.handler;

      GridDomBinders.unbindSort(grid);

      expect(grid.$thead.off).toHaveBeenCalledWith('click', onClickThead);
      expect(grid.$tfoot.off).toHaveBeenCalledWith('click', onClickTfoot);
      expect(grid.$tbody.off).not.toHaveBeenCalled();
      expect(grid.$table.off).not.toHaveBeenCalled();
      expect(grid.$$events.onClickThead).toBeNull();
      expect(grid.$$events.onClickTfoot).toBeNull();
    });

    it('should bind drag & drop events', function() {
      GridDomBinders.bindDragDrop(grid);

      expect(grid.$$events).toEqual({
        onDragStart: {
          events: 'dragstart',
          handler: jasmine.any(Function)
        },
        onDragOver: {
          events: 'dragover',
          handler: jasmine.any(Function)
        },
        onDragEnd: {
          events: 'dragend',
          handler: jasmine.any(Function)
        },
        onDragLeave: {
          events: 'dragleave',
          handler: jasmine.any(Function)
        },
        onDragEnter: {
          events: 'dragenter',
          handler: jasmine.any(Function)
        },
        onDragDrop: {
          events: 'drop',
          handler: jasmine.any(Function)
        }
      });

      expect(grid.$thead.on).not.toHaveBeenCalled();
      expect(grid.$tfoot.on).not.toHaveBeenCalled();
      expect(grid.$tbody.on).not.toHaveBeenCalled();

      expect(grid.$table.on).toHaveBeenCalledWith('dragstart', grid.$$events.onDragStart.handler);
      expect(grid.$table.on).toHaveBeenCalledWith('dragover', grid.$$events.onDragOver.handler);
      expect(grid.$table.on).toHaveBeenCalledWith('dragend', grid.$$events.onDragEnd.handler);
      expect(grid.$table.on).toHaveBeenCalledWith('dragleave', grid.$$events.onDragLeave.handler);
      expect(grid.$table.on).toHaveBeenCalledWith('dragenter', grid.$$events.onDragEnter.handler);
      expect(grid.$table.on).toHaveBeenCalledWith('drop', grid.$$events.onDragDrop.handler);

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

    it('should unbind drag & drop events', function() {
      GridDomBinders.bindDragDrop(grid);

      var onDragStart = grid.$$events.onDragStart.handler;
      var onDragOver = grid.$$events.onDragOver.handler;
      var onDragEnd = grid.$$events.onDragEnd.handler;
      var onDragLeave = grid.$$events.onDragLeave.handler;
      var onDragEnter = grid.$$events.onDragEnter.handler;
      var onDragDrop = grid.$$events.onDragDrop.handler;

      GridDomBinders.unbindDragDrop(grid);

      expect(grid.$table.off).toHaveBeenCalledWith('dragstart', onDragStart);
      expect(grid.$table.off).toHaveBeenCalledWith('dragover', onDragOver);
      expect(grid.$table.off).toHaveBeenCalledWith('dragend', onDragEnd);
      expect(grid.$table.off).toHaveBeenCalledWith('dragleave', onDragLeave);
      expect(grid.$table.off).toHaveBeenCalledWith('dragenter', onDragEnter);
      expect(grid.$table.off).toHaveBeenCalledWith('drop', onDragDrop);
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
        onClickThead: {
          events: 'click',
          handler: jasmine.any(Function)
        },
        onClickTbody: {
          events: 'click',
          handler: jasmine.any(Function)
        }
      });

      expect(grid.$thead.on).toHaveBeenCalledWith('click', grid.$$events.onClickThead.handler);
      expect(grid.$tbody.on).toHaveBeenCalledWith('click', grid.$$events.onClickTbody.handler);

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
        onClickThead: {
          events: 'click',
          handler: jasmine.any(Function)
        }
      });

      expect(grid.$thead.on).toHaveBeenCalledWith('click', grid.$$events.onClickThead.handler);

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
        onClickTfoot: {
          events: 'click',
          handler: jasmine.any(Function)
        },
        onClickTbody: {
          events: 'click',
          handler: jasmine.any(Function)
        }
      });

      expect(grid.$tfoot.on).toHaveBeenCalledWith('click', grid.$$events.onClickTfoot.handler);
      expect(grid.$tbody.on).toHaveBeenCalledWith('click', grid.$$events.onClickTbody.handler);

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
        onClickTfoot: {
          events: 'click',
          handler: jasmine.any(Function)
        }
      });

      expect(grid.$tfoot.on).toHaveBeenCalledWith('click', grid.$$events.onClickTfoot.handler);

      // It should not bind twice
      grid.$tfoot.on.calls.reset();
      grid.$tbody.on.calls.reset();

      GridDomBinders.bindSort(grid);

      expect(grid.$tfoot.on).not.toHaveBeenCalled();
    });
  });
});
