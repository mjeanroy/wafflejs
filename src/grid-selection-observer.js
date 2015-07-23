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
    on: function(changes) {
      _.forEach(changes, function(change) {
        var fnName = 'on' + $util.capitalize(change.type);
        var fn = GridSelectionObserver[fnName];
        if (fn) {
          fn.call(this, change);
        }
      }, this);

      return this;
    },

    // Update selection
    onSplice: function(change) {
      var $tbody = this.$tbody;
      var $data = this.$data;
      var $selection = change.object;

      var idx;
      var row;
      var checkbox;

      var tbody = $tbody[0];
      var childNodes = tbody.childNodes;
      var index = change.index;
      var removed = change.removed;
      var addedCount = change.addedCount;

      // Deselection
      var removedCount = removed.length;
      if (removedCount > 0) {
        for (var k = 0; k < removedCount; ++k) {
          idx = $data.indexOf(removed[k]);

          // Data may not be in grid data collection, since this change
          // may have been triggered because data has been removed.
          if (idx >= 0) {
            row = childNodes[idx];

            $(row).removeClass(CSS_SELECTED);

            if (this.hasCheckbox()) {
              checkbox = findCheckBox(row);
              if (checkbox) {
                updateCheckbox(checkbox, false);
              }
            }
          }
        }
      }

      // Selection
      if (addedCount > 0) {
        for (var i = 0; i < addedCount; ++i) {
          idx = $data.indexOf($selection.at(index + i));
          row = childNodes[idx];

          $(row).addClass(CSS_SELECTED);

          if (this.hasCheckbox()) {
            checkbox = findCheckBox(row);
            if (checkbox) {
              updateCheckbox(checkbox, true);
            }
          }
        }
      }

      if (addedCount > 0 || removedCount > 0) {
        // If no difference with the selection size, no need to manipulate the dom here
        var diff = addedCount - removedCount;
        if (diff && this.hasCheckbox()) {
          var selectionLength = $selection.length;
          var isSelected = this.isSelected();
          var isIndeterminate = selectionLength > 0 && $data.length !== selectionLength;

          var thead = this.hasHeader() ? this.$thead[0] : null;
          var tfoot = this.hasFooter() ? this.$tfoot[0] : null;

          if (thead) {
            var theadCell = thead.childNodes[0].childNodes[0];
            var theadSpan = theadCell.childNodes[0];
            var theadCheckbox = theadCell.childNodes[1];

            theadSpan.innerHTML = theadSpan.title = selectionLength;
            theadCheckbox.checked = isSelected;
            theadCheckbox.indeterminate = isIndeterminate;
          }

          if (tfoot) {
            var tfootCell = tfoot.childNodes[0].childNodes[0];
            var tfootSpan = tfootCell.childNodes[1];
            var tfootCheckbox = tfootCell.childNodes[0];

            tfootSpan.innerHTML = tfootSpan.title = selectionLength;
            tfootCheckbox.checked = isSelected;
            tfootCheckbox.indeterminate = isIndeterminate;
          }
        }

        // Trigger event
        this.dispatchEvent('selectionchanged', function() {
          return {
            selection: this.$selection.toArray()
          };
        });
      }

      return this;
    }
  };

  return o;
})();
