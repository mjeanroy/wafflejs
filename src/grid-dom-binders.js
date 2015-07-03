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
/* global $sniffer */
/* global $util */
/* global GridDomHandlers */
/* exported GridDomBinders */

var GridDomBinders = (function() {

  var bind = function(grid, target, events, handlerName) {
    if (!grid.$$events[handlerName]) {
      grid.$$events[handlerName] = _.bind(GridDomHandlers[handlerName], grid);
      grid['$' + target].on(events, grid.$$events[handlerName]);
    }
  };

  var unbind = function(grid, target, events, handlerName) {
    if (grid.$$events[handlerName]) {
      grid['$' + target].off(events, grid.$$events[handlerName]);
      grid.$$events[handlerName] = null;
    }
  };

  var inputEvents = function() {
    var mainEvent = $sniffer.hasEvent('input') ? 'input' : 'keyup';
    return mainEvent += ' change';
  };

  // Save bytes
  var CLICK = 'click';

  var o = {
    bindResize: function(grid) {
      if (!grid.$$events.onResize) {
        var resizeFn = _.bind(grid.resize, grid);
        grid.$$events.onResize = _.debounce(resizeFn, 100);
        $(window).on('resize', grid.$$events.onResize);
      }
    },

    // Bind input events on tbody element
    bindEdition: function(grid) {
      bind(grid, TBODY, inputEvents(), 'onInputTbody');
    },

    // Unbind input events on tbody element
    unbindEdition: function(grid) {
      unbind(grid, TBODY, inputEvents(), 'onInputTbody');
    },

    // Bind selection events (click) on thead, tfoot and tbody elements
    bindSelection: function(grid) {
      bind(grid, THEAD, CLICK, 'onClickThead');
      bind(grid, TFOOT, CLICK, 'onClickTfoot');
      bind(grid, TBODY, CLICK, 'onClickTbody');
    },

    // Bind sort events (click) on thead and tfoot elements.
    bindSort: function(grid) {
      bind(grid, THEAD, CLICK, 'onClickThead');
      bind(grid, TFOOT, CLICK, 'onClickTfoot');
    },

    // Bind drag&drop events on table element.
    bindDragDrop: function(grid) {
      bind(grid, TABLE, 'dragstart', 'onDragStart');
      bind(grid, TABLE, 'dragover', 'onDragOver');
      bind(grid, TABLE, 'dragend', 'onDragEnd');
      bind(grid, TABLE, 'dragleave', 'onDragLeave');
      bind(grid, TABLE, 'dragenter', 'onDragEnter');
      bind(grid, TABLE, 'drop', 'onDragDrop');

      // IE <= 9 need this workaround to handle drag&drop
      if ($util.msie() <= 9) {
        bind(grid, TABLE, 'selectstart', 'onSelectStart');
      }
    }
  };

  return o;

})();
