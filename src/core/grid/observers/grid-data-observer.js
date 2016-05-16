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
/* global $doc  */
/* global $vdom */
/* global $util */
/* global GridUtil */
/* global GridBuilder */
/* global DATA_WAFFLE_CID */
/* global DATA_WAFFLE_IDX */
/* exported GridDataObserver */

/**
 * Handle data change events:
 * - When data are added, new dom rows are built and appended to the grid.
 * - When data are removed, dom rows are removed.
 * - When data is updated, associated dom row are updated.
 */

const GridDataObserver = (() => {
  const readDataIndex = GridUtil.getDataIndex;
  const findPreviousIndex = GridUtil.getPreviousRowIndexForDataIndex;
  const findIndex = GridUtil.getRowIndexForDataIndex;

  const instance = {
    // Apply data changes to grid.
    on: function(changes) {
      _.forEach(changes, change => {
        const fnName = 'on' + $util.capitalize(change.type);
        instance[fnName].call(this, change);
      });

      return this;
    },

    // Update grid on splice change.
    onSplice: function(change) {
      const $tbody = this.$tbody;
      const tbody = $tbody[0];
      const childNodes = tbody.childNodes;
      const index = change.index;
      const addedCount = change.addedCount;
      const collection = change.object;

      const addedData = change.added;
      const removedData = change.removed;
      const startIndex = findPreviousIndex(childNodes, index) + 1;

      let removedNodes;
      let addedNodes;

      const removedCount = removedData.length;
      if (removedCount > 0) {
        const wasCleared = index === 0 && (collection.length - addedCount) === 0;
        if (wasCleared) {
          removedNodes = _.toArray(childNodes);
          $tbody.empty();
        } else {
          removedNodes = [];

          let removedRow = childNodes[startIndex];

          for (let k = 0; k < removedCount && removedRow; ++k) {
            // Remove if and only if row index match
            const currentRemovedIndex = index + k;
            const currentRowIndex = readDataIndex(removedRow);
            if (currentRowIndex === currentRemovedIndex) {
              removedNodes.push(tbody.removeChild(removedRow));
              removedRow = childNodes[startIndex];
            }
          }
        }

        // Do not forget to remove previously selected data !
        const $selection = this.$selection;
        if ($selection && $selection.length > 0) {
          $selection.remove(removedData);
        }
      }

      // Append new added data
      if (addedCount > 0) {
        addedNodes = [];

        const fragment = $doc.createFragment();
        const predicate = this.$filter || _.constant(true);

        for (let i = 0; i < addedCount; ++i) {
          const rowIdx = i + index;
          const data = addedData[i];
          const ctx = collection.ctx(data);

          // Update flag
          ctx.visible = predicate(data);

          // Append if and only if data must be visible
          if (ctx.visible) {
            const tr = GridBuilder.tbodyRow(this, data, rowIdx);
            addedNodes.push(tr);
            fragment.appendChild(tr);
          }
        }

        if (addedNodes.length > 0) {
          if (startIndex > 0) {
            // Add after existing node
            $(childNodes[startIndex - 1]).after(fragment);
          } else {
            // Add at the beginning
            $tbody.prepend(fragment);
          }
        }
      }

      if (removedNodes || addedNodes) {
        // We need to update row index
        const diff = addedCount - removedCount;

        let start = index + _.size(addedNodes);
        for (let length = childNodes.length; start < length; ++start) {
          const childNode = childNodes[start];
          const oldIdx = readDataIndex(childNode);
          childNode.setAttribute(DATA_WAFFLE_IDX, oldIdx + diff);
        }

        // Trigger events
        this.dispatchEvent('dataspliced', {
          added: addedData || [],
          addedNodes: addedNodes || [],
          removedNodes: removedNodes || [],
          removed: removedData,
          index: index,
          nodeIndex: startIndex
        });
      }

      return this;
    },

    // Update grid on update change
    onUpdate: function(change) {
      const index = change.index;
      const data = this.$data.at(index);

      // Create new node representation and merge diff with old node
      const tbody = this.$tbody[0];
      const childNodes = tbody.childNodes;
      const nodeIndex = findIndex(childNodes, index);
      if (nodeIndex >= 0) {
        const node = childNodes[nodeIndex];
        const tmpNode = GridBuilder.tbodyRow(this, data, index);
        const cid = node.getAttribute(DATA_WAFFLE_CID);

        // Merge new row into old row (this will update content).
        $vdom.mergeNodes(tbody, node, tmpNode);

        // Do not forget to reset cid, since it may have been updated (important
        // since it may be used by angular module to get associated scope).
        node.setAttribute(DATA_WAFFLE_CID, cid);

        // Trigger event
        this.dispatchEvent('dataupdated', {
          index: index,
          nodeIndex: nodeIndex,
          node: node
        });
      }

      return this;
    }
  };

  return instance;
})();
