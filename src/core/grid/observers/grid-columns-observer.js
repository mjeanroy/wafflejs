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

const GridColumnsObserver = (() => {

  const tdIndexer = td => td.getAttribute(DATA_WAFFLE_ID);

  const removeColumns = (wrapper, columns) => {
    const removedNodes = [];
    const childNodes = wrapper.childNodes;
    for (let i = 0, size = childNodes.length; i < size; ++i) {
      const row = childNodes[i];
      const map = _.indexBy(row.childNodes, tdIndexer);

      for (let k = 0, count = columns.length; k < count; ++k) {
        const childToRemove = map[columns[k].id];
        if (childToRemove) {
          removedNodes.push(row.removeChild(childToRemove));
        }
      }
    }

    return removedNodes;
  };

  const insertBefore = (parentNode, child, idx) => parentNode.insertBefore(child, parentNode.childNodes[idx] || null);

  // Cell factories, related to parent tag name.
  const cellFactories = {
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
  const cellFactory = (tagName, column, nodeIndex) => {
    return function(tr, index) {
      const oldNode = tr.childNodes[nodeIndex];
      const newNode = cellFactories[tagName].call(this, column, nodeIndex, index);
      const result = $vdom.mergeNodes(tr, oldNode, newNode);
      return {
        oldNode: oldNode,
        newNode: result
      };
    };
  };

  // Update column flag according to grid options
  const updateColumn = (grid, column) => {
    // Update draggable flag
    column.draggable = !!column.draggable || !!grid.isDraggable();

    if (!grid.isSortable()) {
      column.sortable = false;
    }
  };

  const instance = {
    // Apply columns changes to grid.
    on: function(changes) {
      _.forEach(changes, change => {
        const fnName = 'on' + $util.capitalize(change.type);
        instance[fnName].call(this, change);
      });

      return this;
    },

    // Update columns on splice change.
    onSplice: function(change) {
      const tbody = this.$tbody[0];
      const thead = this.hasHeader() ? this.$thead[0] : null;
      const tfoot = this.hasFooter() ? this.$tfoot[0] : null;

      const hasCheckbox = this.hasCheckbox();
      const index = change.index;
      const added = change.added;
      const addedCount = change.addedCount;
      const removedData = change.removed;

      const theadRemovedNodes = [];
      const tbodyRemovedNodes = [];
      const tfootRemovedNodes = [];

      const $data = this.$data;
      const $columns = this.$columns;

      const removedCount = removedData.length;

      const hasDiff = removedCount > 0 || addedCount > 0;
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

      const theadAddedNodes = [];
      const tbodyAddedNodes = [];
      const tfootAddedNodes = [];

      // Insert new columns
      if (addedCount > 0) {
        // Update header & footer
        for (let i = 0; i < addedCount; ++i) {
          let idx = index + i;

          const column = added[i];

          // Update column flags
          updateColumn(this, column);

          if (thead) {
            const th1 = GridBuilder.theadCell(this, column, idx);
            let tr = thead.childNodes[0];
            theadAddedNodes.push(insertBefore(tr, th1, hasCheckbox ? idx + 1 : idx));
          }

          if (tfoot) {
            const th2 = GridBuilder.tfootCell(this, column, idx);
            let tr = tfoot.childNodes[0];
            tfootAddedNodes.push(insertBefore(tr, th2, hasCheckbox ? idx + 1 : idx));
          }
        }

        // Update body rows
        // It is important to run through tbody nodes (and not data collection), since
        // some data may have been added, and associate change is still pending (so row
        // are not added yet).
        for (let k = 0, dataSize = tbody.childNodes.length; k < dataSize; ++k) {
          let tr = tbody.childNodes[k];

          // Index current cell
          // If grid has already been rendered due to a previous change,
          // columns may already be here
          const map = _.indexBy(tr.childNodes, tdIndexer);

          // We should retrieve data by its id
          // It is really important to do this way since data may have been unshift
          // or spliced at an arbitrary index, so row index may not be sync with data index
          // at this step (it will be updated by a pending change).
          const dataId = tr.getAttribute(DATA_WAFFLE_ID);
          const data = $data.byKey(dataId);

          for (let i = 0; i < addedCount; ++i) {
            let idx = index + i;

            const currentColumn = added[i];
            const columnId = currentColumn.id;
            if (map[columnId]) {
              // Remove, it will be added right after at the right position
              tr.removeChild(map[columnId]);
            }

            const td = GridBuilder.tbodyCell(this, data, $columns.at(idx), idx);
            tbodyAddedNodes.push(insertBefore(tr, td, hasCheckbox ? idx + 1 : idx));
          }
        }
      }

      if (hasDiff) {
        // Editable column may have been added, or editable columns
        // may have been removed, so we should bind or unbind event.
        const isEditable = this.isEditable();
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
      const index = change.index;
      const nodeIndex = this.hasCheckbox() ? index + 1 : index;
      const column = this.$columns.at(index);

      // Update column flags
      updateColumn(this, column);

      const iteratee = function(tagName) {
        let acc = [
          [], // Store old nodes
          []  // Store new nodes
        ];

        const el = this['$' + tagName];

        if (el) {
          const childNodes = el[0].childNodes;
          const factory = cellFactory.call(this, tagName, column, nodeIndex);
          const fn = function(acc, tr, index) {
            const result = factory.call(this, tr, index);
            acc[0].push(result.oldNode);
            acc[1].push(result.newNode);
            return acc;
          };

          acc = _.reduce(childNodes, fn, acc, this);
        }

        return acc;
      };

      // Iterate for each section
      const results = _.map([THEAD, TFOOT, TBODY], iteratee, this);

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
