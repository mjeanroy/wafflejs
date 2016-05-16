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

/* jshint eqnull: true */
/* global _ */
/* global $doc */
/* global $util */
/* global DATA_WAFFLE_CID */
/* global DATA_WAFFLE_ID */
/* global DATA_WAFFLE_IDX */
/* global CSS_SELECTABLE */
/* global CSS_SELECTED */
/* global CSS_CHECKBOX_CELL */
/* exported GridBuilder */

/**
 * Build DOM elements:
 * - Rows
 * - Cells
 * - Editable controls
 */

const GridBuilder = (() => {

  const PX = 'px';
  const PERCENT = 'percent';
  const AUTO = 'auto';

  const widthComputer = {
    [PX]: col => $util.fromPx(col.computedWidth),
    [PERCENT]: (col, total) => $util.fromPercentage(col.computedWidth) * total / 100,
    [AUTO]: (col, total, size) => total / size
  };

  const formatters = {
    checkbox: value => !!value
  };

  const createCheckboxCell = (grid, thead) => {
    const selectionLength = grid.$selection.size();
    const span = $doc.span({title: selectionLength}, '' + selectionLength);

    const isSelected = grid.isSelected();
    const input = $doc.inputCheckbox({
      checked: isSelected,
      indeterminate: !isSelected && selectionLength > 0
    });

    const children = thead ? [span, input] : [input, span];
    const attributes = {
      className: CSS_CHECKBOX_CELL
    };

    return $doc.th(attributes, children);
  };

  const o = {
    // Compute width for each columns
    computeWidth: (totalWidth, columns) => {
      // Split columns into groups:
      // - Group with fixed width.
      // - Group with width that must be computed using percentage of remaining space.
      // - Group with width that should expand to remaining space.
      const groups = columns.groupBy(column => {
        const width = column.computedWidth = _.result(column, 'width');

        if (_.isNumber(width) || $util.isPx(width)) {
          return PX;
        }

        if ($util.isPercentage(width)) {
          return PERCENT;
        }

        return AUTO;
      });

      let constrainedColumnCount = 0;
      let remainingSpace = totalWidth;

      // Now, update widths for each columns
      _.forEach([PX, PERCENT, AUTO], group => {
        const cols = groups[group];
        if (cols) {
          const total = remainingSpace;
          const size = cols.length;

          _.forEach(cols, col => {
            const computedWidth = widthComputer[group](col, total, size);

            // Update computed width
            col.computedWidth = computedWidth;

            // And update remaining flags
            remainingSpace -= computedWidth;
            constrainedColumnCount++;
          });
        }
      });
    },

    // Create row to append to thead node.
    theadRow: grid => {
      const children = [];

      if (grid.hasCheckbox()) {
        children.push(o.theadCheckboxCell(grid));
      }

      grid.$columns.forEach((column, idx) => children.push(o.theadCell(grid, column, idx)));

      return $doc.tr(null, children);
    },

    // Create cell for grid thead node.
    theadCell: (grid, column, idx) => {
      const attributes = column.attributes(idx, true);
      attributes.className = column.cssClasses(idx, true);
      attributes.style = column.styles(idx, true);
      return $doc.th(attributes, column.title);
    },

    // Create cell for grid thead node.
    theadCheckboxCell: grid => createCheckboxCell(grid, true),

    // Create row to append to thead node.
    tfootRow: grid => {
      const children = [];

      if (grid.hasCheckbox()) {
        children.push(o.tfootCheckboxCell(grid));
      }

      grid.$columns.forEach((column, idx) => children.push(o.tfootCell(grid, column, idx)));

      return $doc.tr(null, children);
    },

    // For now, tfoot cell is the same as the thead cell
    tfootCell: (grid, column, idx) => o.theadCell(grid, column, idx),

    // Create cell for grid thead node.
    tfootCheckboxCell: grid => createCheckboxCell(grid, false),

    // Create fragment of rows.
    tbodyRows: (grid, data, startIdx) => {
      const fragment = $doc.createFragment();
      for (let i = 0, size = data.length; i < size; ++i) {
        fragment.appendChild(o.tbodyRow(grid, data[i], startIdx + i));
      }

      return fragment;
    },

    // Create a row for grid tbody node.
    tbodyRow: (grid, data, idx) => {
      const attributes = {};
      attributes[DATA_WAFFLE_IDX] = idx;
      attributes[DATA_WAFFLE_ID] = grid.$data.$$key(data);
      attributes[DATA_WAFFLE_CID] = _.uniqueId();

      const children = [];
      let className = '';

      if (grid.isSelectable()) {
        // Add css to show that row is selectable
        if (grid.isSelectable(data)) {
          className += CSS_SELECTABLE;
        }

        // Data may be selected programmatically, but not selectable
        if (grid.$selection.contains(data)) {
          className += ' ' + CSS_SELECTED;
        }

        // Append cell if grid is defined with checkbox
        if (grid.hasCheckbox()) {
          children.push(o.tbodyCheckboxCell(grid, data));
        }
      }

      if (className) {
        attributes.className = className;
      }

      grid.$columns.forEach((column, idx) => children.push(o.tbodyCell(grid, data, column, idx)));

      return $doc.tr(attributes, children);
    },

    // Create a cell for grid tbody node
    tbodyCell: (grid, data, column, idx) => {
      const attributes = column.attributes(idx, false);
      attributes.className = column.cssClasses(idx, false, data);
      attributes.style = column.styles(idx, false);

      const children = column.isEditable(data) ?
        o.tbodyControl(column, data) : column.render(data);

      return $doc.td(attributes, children);
    },

    // Create a cell for grid tbody node
    tbodyCheckboxCell: (grid, data) => {
      const attributes = {
        className: CSS_CHECKBOX_CELL
      };

      const children = grid.isSelectable(data) ?
        $doc.inputCheckbox({checked: grid.isSelected(data)}) : null;

      return $doc.td(attributes, children);
    },

    // Create control for editable cell
    tbodyControl: (column, data) => {
      const editable = column.editable;
      const attributes = {};

      let control;
      let children;

      if (editable.type === 'select') {
        control = 'select';

        // Append custom options
        if (editable.options) {
          children = _.map(editable.options, option => {
            const attributes = option.value != null ?
              {value: option.value} : null;

            const text = option.label != null ? option.label : '';
            return $doc.option(attributes, text);
          });
        }
      } else {
        control = 'input';
        children = null;
        attributes.type = editable.type;
      }

      // Add column id to control to simplify parsing
      attributes[DATA_WAFFLE_ID] = column.id;

      // For checkbox inputs, we must set the 'checked' property...
      const prop = editable.type === 'checkbox' ? 'checked' : 'value';
      const formatter = formatters[editable.type] || _.identity;
      attributes[prop] = formatter(column.value(data));

      // Append custom css
      if (editable.css) {
        attributes.className = editable.css;
      }

      return $doc[control](attributes, children);
    }
  };

  return o;
})();
