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

/* global $ */
/* global $doc */
/* global DATA_WAFFLE_IDX */
/* global CSS_SELECTED */
/* exported GridBuilder */

var GridBuilder = {
  // Create row to append to thead node.
  theadRow: function(grid) {
    var tr = $doc.tr();

    grid.$columns.forEach(function(column, idx) {
      tr.appendChild(GridBuilder.theadCell(grid, column, idx));
    });

    return tr;
  },

  // Create cell for grid thead node.
  theadCell: function(grid, column, idx) {
    return $($doc.th())
      .addClass(column.cssClasses(idx, true))
      .css(column.styles(idx, true))
      .attr(column.attributes(idx, true))
      .html(column.title)[0];
  },

  // Create fragment of rows.
  tbodyRows: function(grid, data, startIdx) {
    var fragment = $doc.createFragment();
    for (var i = 0, size = data.length; i < size; ++i) {
      fragment.appendChild(GridBuilder.tbodyRow(grid, data[i], startIdx + i));
    }

    return fragment;
  },

  // Create a row for grid tbody node.
  tbodyRow: function(grid, data, idx) {
    var $tr = $($doc.tr());

    // Add index
    $tr.attr(DATA_WAFFLE_IDX, idx);

    // Add css for selected row
    if (grid.$selection.contains(data)) {
      $tr.addClass(CSS_SELECTED);
    }

    grid.$columns.forEach(function(column, idx) {
      $tr[0].appendChild(GridBuilder.tbodyCell(grid, data, column, idx));
    });

    return $tr[0];
  },

  // Create a cell for grid tbody node
  tbodyCell: function(grid, data, column, idx) {
    return $($doc.td())
      .addClass(column.cssClasses(idx, false))
      .css(column.styles(idx, false))
      .attr(column.attributes(idx, false))
      .html(column.render(data))[0];
  }
};
