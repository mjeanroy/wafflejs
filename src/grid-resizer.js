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

/* global _ */
/* global $doc */
/* global $util */
/* global HashMap */
/* exported GridResizer */

var GridResizer = (function() {

  var PX = 'px';
  var PERCENT = 'percent';
  var AUTO = 'auto';

  var widthComputer = {};

  widthComputer[PX] = function(newWidth) {
    return $util.fromPx(newWidth);
  };

  widthComputer[PERCENT] = function(newWidth, total) {
    return $util.fromPercentage(newWidth) * total / 100;
  };

  widthComputer[AUTO] = function(newWidth, total, size) {
    return total / size;
  };

  var o = {
    // Resize grid.
    resize: function(grid) {
      o.applySize(grid);
    },

    // Apply new size on the grid.
    applySize: function(grid) {
      var size = grid.options.size;

      // Get table size
      // These properties may be some external functions
      var tableWidth = _.result(size, 'width');
      var tableHeight = _.result(size, 'height');

      // Check if grid has fixed size
      var isFixedWidth = tableWidth && tableWidth !== AUTO;
      var isFixedHeight = tableHeight && tableHeight !== AUTO;

      // Fix table width using inline styles
      if (isFixedWidth) {
        var pxWidth = $util.toPx(tableWidth);
        grid.$table.css({
          width: pxWidth,
          maxWidth: pxWidth,
          minWidth: pxWidth
        });
      }

      // Fix table height using inline styles
      if (isFixedHeight) {
        var pxHeight = $util.toPx(tableHeight);
        grid.$tbody.css({
          maxHeight: pxHeight
        });
      }

      // Compute available space
      var rowWidth = isFixedWidth ? $util.fromPx(tableWidth) : null;

      // Size is not explicitly fixed, try to get width from real dom element
      // This allow size to be defined with css rules
      // At this step, table must have been appended to the dom
      if (!rowWidth) {
        rowWidth = grid.$table[0].offsetWidth;
      }

      // We have to retain scrollbar size
      rowWidth -= $doc.scrollbarWidth();

      // We also have to retain size for checkbox column
      if (grid.hasCheckbox()) {
        rowWidth -= 30;
      }

      // Now, we can update column width
      var columns = grid.$columns;
      var diff = o.computeWidth(rowWidth, columns);

      // Trigger an update for each diff
      for (var i = 0, ln = diff.length; i < ln; ++i) {
        columns.triggerUpdate(columns.indexOf(diff[i]));
      }

      return this;
    },

    // Compute width for each columns
    computeWidth: function(totalWidth, columns) {
      var remainingSpace = totalWidth;
      var constrainedColumnCount = 0;

      var mapWidth = new HashMap();

      // Split columns into groups:
      // - Group with fixed width.
      // - Group with width that must be computed using percentage of remaining space.
      // - Group with width that should expand to remaining space.
      var groups = columns.groupBy(function(column) {
        var width = _.result(column, 'width');

        // Track width
        mapWidth.put(column.id, width);

        // Fixed size, set as a number or as a px value
        if (_.isNumber(width) || $util.isPx(width)) {
          return PX;
        }

        // Percentage size, column size will be computed using percentage
        // of available space
        if ($util.isPercentage(width)) {
          return PERCENT;
        }

        // Automatic sizing, column will expand to available space
        return AUTO;
      });

      // Track changes
      var diff = [];

      // Now, update widths for each groups
      _.forEach([PX, PERCENT, AUTO], function(group) {
        var cols = groups[group];
        if (cols) {
          var total = remainingSpace;
          var size = cols.length;

          _.forEach(cols, function(column) {
            var computedWidth = widthComputer[group](mapWidth.get(column.id), total, size);

            // Update computed width
            if (computedWidth !== column.computedWidth) {
              column.computedWidth = computedWidth;
              diff.push(column);
            }

            // And update remaining flags
            remainingSpace -= computedWidth;
            constrainedColumnCount++;
          });
        }
      });

      return diff;
    }
  };

  return o;
})();
