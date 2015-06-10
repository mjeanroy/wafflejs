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
/* global $util */
/* global GridBuilder */
/* exported GridColumnsObserver */

var GridColumnsObserver = (function() {

  var removeColumns = function(wrapper, idx) {
    var removedNodes = [];
    var childNodes = wrapper.childNodes;
    for (var i = 0, size = childNodes.length; i < size; ++i) {
      removedNodes.push(childNodes[i].removeChild(childNodes[i].childNodes[idx]));
    }

    return removedNodes;
  };

  var insertBefore = function(parentNode, child, idx) {
    return parentNode.insertBefore(child, parentNode.childNodes[idx] || null);
  };

  var o = {
    // Apply columns changes to grid.
    on: function(changes) {
      _.forEach(changes, function(change) {
        var fnName = 'on' + $util.capitalize(change.type);
        var fn = GridColumnsObserver[fnName];
        if (fn) {
          fn.call(this, change);
        }
      }, this);

      return this;
    },

    // Update columns on splice change.
    onSplice: function(change) {
      var thead = this.$thead[0];
      var tbody = this.$tbody[0];
      var tfoot = this.$tfoot[0];

      var hasCheckbox = this.hasCheckbox();
      var index = change.index;
      var addedCount = change.addedCount;
      var removedData = change.removed;

      var theadRemovedNodes = [];
      var tbodyRemovedNodes = [];
      var tfootRemovedNodes = [];

      var $data = this.$data;
      var $columns = this.$columns;

      var i, k, idx, tr, dataSize;

      var removedCount = removedData.length;
      if (removedCount > 0) {
        for (i = 0; i < removedCount; ++i) {
          idx = hasCheckbox ? index + 1 : index;
          theadRemovedNodes.push.apply(theadRemovedNodes, removeColumns(thead, idx));
          tbodyRemovedNodes.push.apply(tbodyRemovedNodes, removeColumns(tbody, idx));
          tfootRemovedNodes.push.apply(tfootRemovedNodes, removeColumns(tfoot, idx));
        }
      }

      var theadAddedNodes = [];
      var tbodyAddedNodes = [];
      var tfootAddedNodes = [];

      // Insert new columns
      if (addedCount > 0) {
        // Update header & footer
        for (i = 0; i < addedCount; ++i) {
          idx = index + i;

          var th1 = GridBuilder.theadCell(this, $columns.at(idx), idx);
          var th2 = GridBuilder.tfootCell(this, $columns.at(idx), idx);

          tr = thead.childNodes[0];
          theadAddedNodes.push(insertBefore(tr, th1, hasCheckbox ? idx + 1 : idx));

          tr = tfoot.childNodes[0];
          tfootAddedNodes.push(insertBefore(tr, th2, hasCheckbox ? idx + 1 : idx));
        }

        // Update body rows
        for (k = 0, dataSize = $data.length; k < dataSize; ++k) {
          tr = tbody.childNodes[k];
          var data = $data.at(k);
          for (i = 0; i < addedCount; ++i) {
            idx = index + i;

            var td = GridBuilder.tbodyCell(this, data, $columns.at(idx), idx);
            tbodyAddedNodes.push(insertBefore(tr, td, hasCheckbox ? idx + 1 : idx));
          }
        }
      }

      if (removedCount > 0 || addedCount > 0) {
        this.dispatchEvent('columnsspliced', {
          index: index,

          removedNodes: {
            thead: theadRemovedNodes,
            tbody: tbodyRemovedNodes,
            tfoot: tfootRemovedNodes
          },

          addedNodes: {
            thead: theadAddedNodes,
            tbody: tbodyAddedNodes,
            tfoot: tfootAddedNodes
          }
        });
      }

      return this;
    }
  };

  return o;
})();