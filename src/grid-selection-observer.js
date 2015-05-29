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
/* global _ */
/* global CSS_SELECTED */
/* global $util */
/* exported GridSelectionObserver */

var GridSelectionObserver = (function() {
  var findCheckBox = function(row) {
    return row.childNodes[0].childNodes[0];
  };

  var updateCheckbox = function(checkbox, checked) {
    checkbox.checked = checked;
  };

  var o = {
    // Apply data changes to grid.
    on: function(grid, changes) {
      _.forEach(changes, function(change) {
        var fnName = 'on' + $util.capitalize(change.type);
        var fn = GridSelectionObserver[fnName];
        if (fn) {
          fn.call(GridSelectionObserver, grid, change);
        }
      });

      return this;
    },

    // Update selection
    onSplice: function(grid, change) {
      var $tbody = grid.$tbody;
      var $data = grid.$data;
      var idx, row;

      var tbody = $tbody[0];
      var childNodes = tbody.childNodes;
      var index = change.index;
      var removed = change.removed;
      var addedCount = change.addedCount;
      var collection = change.object;

      // Deselection
      var removedCount = removed.length;
      if (removedCount > 0) {
        for (var k = 0; k < removedCount; ++k) {
          idx = $data.indexOf(removed[k]);
          row = childNodes[idx];

          $(row).removeClass(CSS_SELECTED);
          if (grid.hasCheckbox()) {
            updateCheckbox(findCheckBox(row), false);
          }
        }
      }

      // Selection
      if (addedCount > 0) {
        for (var i = 0; i < addedCount; ++i) {
          idx = $data.indexOf(collection.at(index + i));
          row = childNodes[idx];

          $(row).addClass(CSS_SELECTED);
          if (grid.hasCheckbox()) {
            updateCheckbox(findCheckBox(row), true);
          }
        }
      }

      if (grid.hasCheckbox()) {
        var $thead = grid.$thead;
        var thead = $thead[0];
        var cell = thead.childNodes[0].childNodes[0];
        var childNodesCell = cell.childNodes;
        childNodesCell[0].innerHTML = collection.length;
        childNodesCell[0].setAttribute('title', collection.length);
        childNodesCell[1].checked = grid.isSelected();
      }

      return this;
    }
  };

  return o;
})();