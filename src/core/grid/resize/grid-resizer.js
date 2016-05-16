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

/**
 * Resize grid: compute new columns width and apply change events.
 */

const GridResizer = (() => {

  const PX = 'px';
  const PERCENT = 'percent';
  const AUTO = 'auto';
  const widthComputer = {
    [PX]: newWidth => $util.fromPx(newWidth),
    [PERCENT]: (newWidth, total) => $util.fromPercentage(newWidth) * total / 100,
    [AUTO]: (newWidth, total, size) => total / size
  };

  const o = {
    // Resize grid.
    resize: grid => o.applySize(grid),

    // Apply new size on the grid.
    applySize: grid => {
      const size = grid.options.size;

      // Get table size
      // These properties may be some external functions
      const tableWidth = _.result(size, 'width');
      const tableHeight = _.result(size, 'height');

      // Check if grid has fixed size
      const isFixedWidth = tableWidth && tableWidth !== AUTO;
      const isFixedHeight = tableHeight && tableHeight !== AUTO;

      // Fix table width using inline styles
      if (isFixedWidth) {
        const pxWidth = $util.toPx(tableWidth);
        grid.$table.css({
          width: pxWidth,
          maxWidth: pxWidth,
          minWidth: pxWidth
        });
      }

      // Fix table height using inline styles
      if (isFixedHeight) {
        const pxHeight = $util.toPx(tableHeight);
        grid.$tbody.css({
          maxHeight: pxHeight
        });
      }

      // Compute available space
      let rowWidth = isFixedWidth ? $util.fromPx(tableWidth) : null;

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
      const columns = grid.$columns;
      const diff = o.computeWidth(rowWidth, columns);

      if (diff.length > 0) {
        // If a pending change is already here for this column, then do not trigger
        // a second one since the first will be enough to update column
        const pendingChanges = _.indexBy(columns.pendingChanges(), change => change.type + '_' + change.index);

        for (let i = 0, ln = diff.length; i < ln; ++i) {
          const index = columns.indexOf(diff[i]);
          if (!_.has(pendingChanges, 'update_' + index)) {
            // We can trigger the update
            columns.notifyUpdate(index);
          }
        }
      }

      return this;
    },

    // Compute width for each columns
    computeWidth: (totalWidth, columns) => {
      let remainingSpace = totalWidth;
      let constrainedColumnCount = 0;

      const mapWidth = new HashMap();

      // Split columns into groups:
      // - Group with fixed width.
      // - Group with width that must be computed using percentage of remaining space.
      // - Group with width that should expand to remaining space.
      const groups = columns.groupBy(column => {
        const width = _.result(column, 'width');

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
      const diff = [];

      // Now, update widths for each groups
      _.forEach([PX, PERCENT, AUTO], group => {
        const cols = groups[group];
        if (cols) {
          const total = remainingSpace;
          const size = cols.length;

          _.forEach(cols, column => {
            const computedWidth = widthComputer[group](mapWidth.get(column.id), total, size);

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
