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
/* global $ */
/* global $doc */
/* global $util */
/* global DATA_WAFFLE_ID */
/* global DATA_WAFFLE_IDX */
/* global CSS_SELECTED */
/* global CSS_CHECKBOX_CELL */
/* exported GridBuilder */

var GridBuilder = (function() {

  var PX = 'px';
  var PERCENT = 'percent';
  var AUTO = 'auto';

  var widthComputer = {};

  widthComputer[PX] = function(col) {
    return $util.fromPx(col.computedWidth);
  };

  widthComputer[PERCENT] = function(col, total) {
    return $util.fromPercentage(col.computedWidth) * total / 100;
  };

  widthComputer[AUTO] = function(col, total, size) {
    return total / size;
  };

  var o = {
    // Compute width for each columns
    computeWidth: function(totalWidth, columns) {
      var remainingSpace = totalWidth;
      var constrainedColumnCount = 0;

      // Split columns into groups:
      // - Group with fixed width.
      // - Group with width that must be computed using percentage of remaining space.
      // - Group with width that should expand to remaining space.
      var groups = columns.groupBy(function(column) {
        var width = column.computedWidth = _.result(column, 'width');

        if (_.isNumber(width) || $util.isPx(width)) {
          return PX;
        }

        if ($util.isPercentage(width)) {
          return PERCENT;
        }

        return AUTO;
      });

      // Now, update widths for each columns
      _.forEach([PX, PERCENT, AUTO], function(group) {
        var cols = groups[group];
        if (cols) {
          var total = remainingSpace;
          var size = cols.length;

          _.forEach(cols, function(col) {
            var computedWidth = widthComputer[group](col, total, size);

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
    theadRow: function(grid) {
      var tr = $doc.tr();

      if (grid.hasCheckbox()) {
        tr.appendChild(o.theadCheckboxCell(grid));
      }

      grid.$columns.forEach(function(column, idx) {
        tr.appendChild(o.theadCell(grid, column, idx));
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

    // Create cell for grid thead node.
    theadCheckboxCell: function(grid) {
      var selectionLength = grid.$selection.size();
      var dataLength = grid.$data.size();

      var $span = $($doc.span())
        .attr('title', selectionLength)
        .html(selectionLength);

      var $input = $($doc.inputCheckbox())
        .prop('checked', grid.isSelected())
        .prop('indeterminate', selectionLength > 0 && selectionLength !== dataLength);

      return $($doc.th())
        .addClass(CSS_CHECKBOX_CELL)
        .append($span[0])
        .append($input[0])[0];
    },

    // Create row to append to thead node.
    tfootRow: function(grid) {
      var tr = $doc.tr();

      if (grid.hasCheckbox()) {
        tr.appendChild(o.tfootCheckboxCell(grid));
      }

      grid.$columns.forEach(function(column, idx) {
        tr.appendChild(o.tfootCell(grid, column, idx));
      });

      return tr;
    },

    // For now, tfoot cell is the same as the thead cell
    tfootCell: function(grid, column, idx) {
      return o.theadCell(grid, column, idx);
    },

    // Create cell for grid thead node.
    tfootCheckboxCell: function(grid) {
      var cell = o.theadCheckboxCell(grid);

      // Put the span value at the the bottom...
      cell.appendChild(cell.childNodes[0]);

      return cell;
    },

    // Create fragment of rows.
    tbodyRows: function(grid, data, startIdx) {
      var fragment = $doc.createFragment();
      for (var i = 0, size = data.length; i < size; ++i) {
        fragment.appendChild(o.tbodyRow(grid, data[i], startIdx + i));
      }

      return fragment;
    },

    // Create a row for grid tbody node.
    tbodyRow: function(grid, data, idx) {
      var $tr = $($doc.tr());

      // Add index
      $tr.attr(DATA_WAFFLE_IDX, idx);

      // Add css for selected row
      if (grid.isSelectable() && grid.$selection.contains(data)) {
        $tr.addClass(CSS_SELECTED);
      }

      if (grid.hasCheckbox()) {
        $tr[0].appendChild(o.tbodyCheckboxCell(grid, data));
      }

      grid.$columns.forEach(function(column, idx) {
        $tr[0].appendChild(o.tbodyCell(grid, data, column, idx));
      });

      return $tr[0];
    },

    // Create a cell for grid tbody node
    tbodyCell: function(grid, data, column, idx) {
      var $td = $($doc.td())
        .addClass(column.cssClasses(idx, false))
        .css(column.styles(idx, false))
        .attr(column.attributes(idx, false));

      // Check for editable column
      var editable = column.editable;
      if (editable) {
        $td.append(o.tbodyControl(column, data));
      } else {
        $td.html(column.render(data));
      }

      return $td[0];
    },

    // Create a cell for grid tbody node
    tbodyCheckboxCell: function(grid, data) {
      var $checkbox = $($doc.inputCheckbox())
        .prop('checked', grid.isSelected(data));

      return $($doc.td())
        .addClass(CSS_CHECKBOX_CELL)
        .append($checkbox[0])[0];
    },

    // Create control for editable cell
    tbodyControl: function(column, data) {
      var editable = column.editable;

      var control;

      if (editable.type === 'select') {
        control = $doc.select();

        // Append custom options
        if (editable.options) {
          _.forEach(editable.options, function(option) {
            var opt = $doc.option();

            opt.innerHTML = option.label != null ? option.label : '';

            if (option.value != null) {
              opt.value = option.value;
            }

            control.appendChild(opt);
          });
        }
      } else {
        control = $doc.input();
        control.setAttribute('type', editable.type);
      }

      control.setAttribute('value', column.value(data));
      control.setAttribute(DATA_WAFFLE_ID, column.id);

      // Append custom css
      if (editable.css) {
        control.className = editable.css;
      }

      return control;
    }
  };

  return o;
})();
