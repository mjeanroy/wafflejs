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

/* global $ */
/* global _ */
/* global TABLE */
/* global THEAD */
/* global TFOOT */
/* global TBODY */
/* global $events */
/* global $util */
/* global GridDomHandlers */
/* exported GridDomBinders */

/**
 * Bind DOM events on the grid.
 */

const GridDomBinders = (() => {

  const unbind = (grid, target, events, handlerName) => {
    const el = grid['$' + target];
    if (el && grid.$$events[handlerName]) {
      const handler = grid.$$events[handlerName];
      el.off(handler.events, handler.handler);
      grid.$$events[handlerName] = null;
    }
  };

  const bind = (grid, target, events, handlerName) => {
    const el = grid['$' + target];
    if (!el) {
      return;
    }

    let handler = grid.$$events[handlerName];

    // If events is not the same value as previous handler, we need
    // to rebind everything.
    if (handler && handler.events !== events) {
      unbind(grid, target, handler.events, handlerName);
      handler = null;
    }

    if (!handler) {
      grid.$$events[handlerName] = {
        events: events,
        handler: _.bind(GridDomHandlers[handlerName], grid)
      };

      el.on(events, grid.$$events[handlerName].handler);
    }
  };

  // Save bytes
  const CLICK = 'click';

  // Create binder/unbinder for events.
  const createDomBinding = (o, name, fn) => {
    o['bind' + name] = grid => fn(grid, bind);
    o['unbind' + name] = grid => fn(grid, unbind);
  };

  const instance = {
    bindResize: grid => {
      if (!grid.$$events.onResize) {
        const resizeFn = _.bind(grid.resize, grid);
        grid.$$events.onResize = _.debounce(resizeFn, 100);
        grid.$window = $(window);
        grid.$window.on('resize', grid.$$events.onResize);
      }
    },

    unbindResize: grid => {
      if (grid.$$events.onResize) {
        grid.$window.off('resize', grid.$$events.onResize);
        grid.$window = null;
      }
    }
  };

  const reducer = (acc, column) => column.isEditable() ? acc + ' ' + column.editable.updateOn : acc;
  const parseEvents = columns => columns.reduce(reducer, '');

  // Create bind/unbind functions for edition events.
  createDomBinding(instance, 'Edition', (grid, factory) => {
    const events = $events.$parse(parseEvents(grid.$columns));
    factory(grid, TBODY, events, 'onInputTbody');
  });

  // Create bind/unbind functions for selection events.
  createDomBinding(instance, 'Selection', (grid, factory) => {
    factory(grid, THEAD, CLICK, 'onClickThead');
    factory(grid, TFOOT, CLICK, 'onClickTfoot');
    factory(grid, TBODY, CLICK, 'onClickTbody');
  });

  // Create bind/unbind functions for sort events.
  createDomBinding(instance, 'Sort', (grid, factory) => {
    factory(grid, THEAD, CLICK, 'onClickThead');
    factory(grid, TFOOT, CLICK, 'onClickTfoot');
  });

  // Create bind/unbind functions for drag&drop events.
  createDomBinding(instance, 'DragDrop', (grid, factory) => {
    factory(grid, TABLE, 'dragstart', 'onDragStart');
    factory(grid, TABLE, 'dragover', 'onDragOver');
    factory(grid, TABLE, 'dragend', 'onDragEnd');
    factory(grid, TABLE, 'dragleave', 'onDragLeave');
    factory(grid, TABLE, 'dragenter', 'onDragEnter');
    factory(grid, TABLE, 'drop', 'onDragDrop');

    // IE <= 9 need this workaround to handle drag&drop
    if ($util.msie() <= 9) {
      factory(grid, TABLE, 'selectstart', 'onSelectStart');
    }
  });

  return instance;

})();
