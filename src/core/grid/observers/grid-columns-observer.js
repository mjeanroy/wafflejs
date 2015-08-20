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
/* global DATA_WAFFLE_ID */
/* global THEAD */
/* global TFOOT */
/* global TBODY */
/* exported GridColumnsObserver */

/**
 * Handle columns change events:
 * - When columns are added, new dom node are built and appended to the grid.
 * - When columns are removed, dom nodes are removed.
 * - When column is updated, associated dom nodes are updated.
 */

var GridColumnsObserver = (function() {

  var tdIndexer = function(td) {
    return td.getAttribute(DATA_WAFFLE_ID);
  };

  var removeColumns = function(wrapper, columns) {
    var removedNodes = [];
    var childNodes = wrapper.childNodes;
    for (var i = 0, size = childNodes.length; i < size; ++i) {
      var row = childNodes[i];
      var map = _.indexBy(row.childNodes, tdIndexer);

      for (var k = 0, count = columns.length; k < count; ++k) {
        var childToRemove = map[columns[k].id];
        if (childToRemove) {
          removedNodes.push(row.removeChild(childToRemove));
        }
      }
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

  var instance = {
    // Apply columns changes to grid.
    on: function(changes) {
      _.forEach(changes, function(change) {
        var fnName = 'on' + $util.capitalize(change.type);
        instance[fnName].call(this, change);
      }, this);

      return this;
    },

    // Update columns on splice change.
    onSplice: function(change) {
      var tbody = this.$tbody[0];
      var thead = this.hasHeader() ? this.$thead[0] : null;
      var tfoot = this.hasFooter() ? this.$tfoot[0] : null;

      var hasCheckbox = this.hasCheckbox();
      var index = change.index;
      var addedCount = change.addedCount;
      var removedData = change.removed;

      var theadRemovedNodes = [];
      var tbodyRemovedNodes = [];
      var tfootRemovedNodes = [];

      var $data = this.$data;
      var $columns = this.$columns;

      var i;
      var k;
      var idx;
      var tr;
      var dataSize;

      var removedCount = removedData.length;

      var hasDiff = removedCount > 0 || addedCount > 0;
      if (hasDiff && this.isResizable()) {
        // Columns have been added or removed, a new resize should be applied
        this.resize();
      }

      if (removedCount > 0) {
        tbodyRemovedNodes.push.apply(tbodyRemovedNodes, removeColumns(tbody, removedData));

        if (thead) {
          theadRemovedNodes.push.apply(theadRemovedNodes, removeColumns(thead, removedData));
        }

        if (tfoot) {
          tfootRemovedNodes.push.apply(tfootRemovedNodes, removeColumns(tfoot, removedData));
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

          if (thead) {
            var th1 = GridBuilder.theadCell(this, column, idx);
            tr = thead.childNodes[0];
            theadAddedNodes.push(insertBefore(tr, th1, hasCheckbox ? idx + 1 : idx));
          }

          if (tfoot) {
            var th2 = GridBuilder.tfootCell(this, column, idx);
            tr = tfoot.childNodes[0];
            tfootAddedNodes.push(insertBefore(tr, th2, hasCheckbox ? idx + 1 : idx));
          }
        }

        // Update body rows
        // It is important to run through tbody nodes (and not data collection), since
        // some data may have been added, and associate change is still pending (so row
        // are not added yet).
        for (k = 0, dataSize = tbody.childNodes.length; k < dataSize; ++k) {
          tr = tbody.childNodes[k];

          // Index current cell
          // If grid has already been rendered due to a previous change,
          // columns may already be here
          var map = _.indexBy(tr.childNodes, tdIndexer);

          // We should retrieve data by its id
          // It is really important to do this way since data may have been unshift
          // or spliced at an arbitrary index, so row index may not be sync with data index
          // at this step (it will be updated by a pending change).
          var dataId = tr.getAttribute(DATA_WAFFLE_ID);
          var data = $data.byKey(dataId);

          for (i = 0; i < addedCount; ++i) {
            idx = index + i;

            var currentColumn = $columns.at(idx);
            var columnId = currentColumn.id;
            if (map[columnId]) {
              // Remove, it will be added right after at the right position
              tr.removeChild(map[columnId]);
            }

            var td = GridBuilder.tbodyCell(this, data, $columns.at(idx), idx);
            tbodyAddedNodes.push(insertBefore(tr, td, hasCheckbox ? idx + 1 : idx));
          }
        }
      }

      if (hasDiff) {
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

        var el = this['$' + tagName];

        if (el) {
          var childNodes = el[0].childNodes;
          var factory = cellFactory.call(this, tagName, column, nodeIndex);
          var fn = function(acc, tr, index) {
            var result = factory.call(this, tr, index);
            acc[0].push(result.oldNode);
            acc[1].push(result.newNode);
            return acc;
          };

          acc = _.reduce(childNodes, fn, acc, this);
        }

        return acc;
      };

      // Iterate for each section
      var results = _.map([THEAD, TFOOT, TBODY], iteratee, this);

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

  return instance;
})();
