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
/* global $vdom */
/* global $util */
/* global GridBuilder */
/* global GridDomBinders */
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

  // Cell factories, related to parent tag name.
  var cellFactories = {
    tbody: function(column, nodeIndex, idx) {
      return GridBuilder.tbodyCell(this, this.$data.at(idx), column, nodeIndex);
    },
    thead: function(column, nodeIndex) {
      return GridBuilder.theadCell(this, column, nodeIndex);
    },
    tfoot: function(column, nodeIndex) {
      return GridBuilder.tfootCell(this, column, nodeIndex);
    }
  };

  // Cell updater.
  // This function will update cell at given index for
  // each row of given tag name.
  var cellFactory = function(tagName, column, nodeIndex) {
    return function(tr, index) {
      var oldNode = tr.childNodes[nodeIndex];
      var newNode = cellFactories[tagName].call(this, column, nodeIndex, index);
      var result = $vdom.mergeNodes(tr, oldNode, newNode);
      return {
        oldNode: oldNode,
        newNode: result
      };
    };
  };

  // Update column flag according to grid options
  var updateColumn = function(grid, column) {
    // Update draggable flag
    column.draggable = !!column.draggable || !!grid.isDraggable();

    if (!grid.isSortable()) {
      column.sortable = false;
    }
  };

  var o = {
    // Apply columns changes to grid.
    on: function(changes) {
      _.forEach(changes, function(change) {
        var fnName = 'on' + $util.capitalize(change.type);
        o[fnName].call(this, change);
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

          var column = $columns.at(idx);

          // Update column flags
          updateColumn(this, column);

          var th1 = GridBuilder.theadCell(this, column, idx);
          var th2 = GridBuilder.tfootCell(this, column, idx);

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
        // Editable column may have been added, or editable columns
        // may have been removed, so we should bind or unbind event.
        var isEditable = this.isEditable();
        if (addedCount > 0 && isEditable) {
          GridDomBinders.bindEdition(this);
        } else if (removedCount > 0 && !isEditable) {
          GridDomBinders.unbindEdition(this);
        }

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
    },

    // Column has been updated
    onUpdate: function(change) {
      var index = change.index;
      var nodeIndex = this.hasCheckbox() ? index + 1 : index;
      var column = this.$columns.at(index);

      // Update column flags
      updateColumn(this, column);

      var iteratee = function(tagName) {
        var acc = [
          [], // Store old nodes
          []  // Store new nodes
        ];

        var childNodes = this['$' + tagName][0].childNodes;
        var factory = cellFactory.call(this, tagName, column, nodeIndex);
        var fn = function(acc, tr, index) {
          var result = factory.call(this, tr, index);
          acc[0].push(result.oldNode);
          acc[1].push(result.newNode);
          return acc;
        };

        return _.reduce(childNodes, fn, acc, this);
      };

      // Iterate for each section
      var results = _.map(['thead', 'tfoot', 'tbody'], iteratee, this);

      // Update editable state
      if (column.editable) {
        GridDomBinders.bindEdition(this);
      } else if (!this.isEditable()) {
        GridDomBinders.unbindEdition(this);
      }

      // Dispatch event
      this.dispatchEvent('columnsupdated', {
        index: index,
        oldNodes: {
          thead: results[0][0],
          tfoot: results[1][0],
          tbody: results[2][0]
        },
        newNodes: {
          thead: results[0][1],
          tfoot: results[1][1],
          tbody: results[2][1]
        }
      });

      return this;
    }
  };

  return o;
})();