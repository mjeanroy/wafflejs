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
/* global GridUtil */
/* exported GridSelectionObserver */

/**
 * Handle selection change events:
 * - When data are added, associated rows are flagged as "checked".
 * - When data are removed, associated rows are flagged as "unchecked".
 */

const GridSelectionObserver = (() => {
  const findIndex = GridUtil.getRowIndexForDataIndex;
  const findCheckBox = GridUtil.getCheckbox;
  const updateCheckbox = (checkbox, checked) => checkbox.checked = checked;

  const instance = {
    // Apply data changes to grid.
    on: function(changes) {
      _.forEach(changes, change => {
        const fnName = 'on' + $util.capitalize(change.type);
        const fn = instance[fnName];
        if (fn) {
          fn.call(this, change);
        }
      });

      return this;
    },

    // Update selection
    onSplice: function(change) {
      const $tbody = this.$tbody;
      const $data = this.$data;
      const $selection = change.object;

      const tbody = $tbody[0];
      const childNodes = tbody.childNodes;
      const added = change.added;
      const removed = change.removed;
      const addedCount = change.addedCount;

      // Deselection
      const removedCount = removed.length;
      if (removedCount > 0) {
        for (let k = 0; k < removedCount; ++k) {
          let idx = $data.indexOf(removed[k]);

          // Data may not be in grid data collection, since this change
          // may have been triggered because data has been removed.
          if (idx >= 0) {
            let rowIndex = findIndex(childNodes, idx);
            let row = childNodes[rowIndex];

            if (row) {
              $(row).removeClass(CSS_SELECTED);

              if (this.hasCheckbox()) {
                let checkbox = findCheckBox(row);
                if (checkbox) {
                  updateCheckbox(checkbox, false);
                }
              }
            }
          }
        }
      }

      // Selection
      if (addedCount > 0) {
        for (let i = 0; i < addedCount; ++i) {
          let idx = $data.indexOf(added[i]);
          let rowIndex = findIndex(childNodes, idx);
          let row = childNodes[rowIndex];

          if (row) {
            $(row).addClass(CSS_SELECTED);

            if (this.hasCheckbox()) {
              let checkbox = findCheckBox(row);
              if (checkbox) {
                updateCheckbox(checkbox, true);
              }
            }
          }
        }
      }

      if (addedCount > 0 || removedCount > 0) {
        // If no difference with the selection size, no need to manipulate the dom here
        const diff = addedCount - removedCount;
        if (diff && this.hasCheckbox()) {
          const selectionLength = $selection.length;
          const isSelected = this.isSelected();
          const isIndeterminate = selectionLength > 0 && $data.length !== selectionLength;

          const thead = this.hasHeader() ? this.$thead[0] : null;
          const tfoot = this.hasFooter() ? this.$tfoot[0] : null;

          if (thead) {
            const theadCell = thead.childNodes[0].childNodes[0];
            const theadSpan = theadCell.childNodes[0];
            const theadCheckbox = theadCell.childNodes[1];

            theadSpan.innerHTML = theadSpan.title = selectionLength;
            theadCheckbox.checked = isSelected;
            theadCheckbox.indeterminate = isIndeterminate;
          }

          if (tfoot) {
            const tfootCell = tfoot.childNodes[0].childNodes[0];
            const tfootSpan = tfootCell.childNodes[1];
            const tfootCheckbox = tfootCell.childNodes[0];

            tfootSpan.innerHTML = tfootSpan.title = selectionLength;
            tfootCheckbox.checked = isSelected;
            tfootCheckbox.indeterminate = isIndeterminate;
          }
        }

        // Trigger event
        this.dispatchEvent('selectionchanged', () => {
          return {
            selection: this.$selection.toArray()
          };
        });
      }

      return this;
    }
  };

  return instance;
})();
