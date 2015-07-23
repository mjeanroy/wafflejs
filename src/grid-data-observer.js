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
/* global $doc  */
/* global $vdom */
/* global $util */
/* global GridBuilder */
/* global DATA_WAFFLE_IDX */
/* exported GridDataObserver */

var GridDataObserver = {
  // Apply data changes to grid.
  on: function(changes) {
    _.forEach(changes, function(change) {
      var fnName = 'on' + $util.capitalize(change.type);
      GridDataObserver[fnName].call(this, change);
    }, this);

    return this;
  },

  // Update grid on splice change.
  onSplice: function(change) {
    var $tbody = this.$tbody;
    var tbody = $tbody[0];
    var childNodes = tbody.childNodes;
    var index = change.index;
    var addedCount = change.addedCount;
    var collection = change.object;

    var removedNodes;
    var addedNodes;
    var addedData;
    var removedData = change.removed;

    var removedCount = removedData.length;
    if (removedCount > 0) {
      if (index === 0 && removedCount === childNodes.length) {
        removedNodes = _.toArray(childNodes);
        $tbody.empty();
      } else {
        removedNodes = [];
        for (var k = 0; k < removedCount; ++k) {
          removedNodes.push(tbody.removeChild(childNodes[index]));
        }
      }

      // Do not forget to remove previously selected data !
      var $selection = this.$selection;
      if ($selection && $selection.length > 0) {
        $selection.remove(removedData);
      }
    }

    // Append new added data
    if (addedCount > 0) {
      addedNodes = [];
      addedData = [];

      var fragment = $doc.createFragment();

      for (var i = 0; i < addedCount; ++i) {
        var rowIdx = i + index;
        var data = collection.at(rowIdx);
        var tr = GridBuilder.tbodyRow(this, data, rowIdx);

        addedNodes.push(tr);
        addedData.push(data);
        fragment.appendChild(tr);
      }

      if (index > 0) {
        // Add after existing node
        $tbody.children().eq(index - 1).after(fragment);
      } else {
        // Add at the beginning
        $tbody.prepend(fragment);
      }
    }

    if (removedNodes || addedNodes) {
      // We need to update row index
      for (var start = (index + addedCount), length = childNodes.length; start < length; ++start) {
        childNodes[start].setAttribute(DATA_WAFFLE_IDX, start);
      }

      // Trigger events
      this.dispatchEvent('dataspliced', {
        added: addedData || [],
        addedNodes: addedNodes || [],
        removedNodes: removedNodes || [],
        removed: removedData,
        index: index
      });
    }

    return this;
  },

  // Update grid on update change
  onUpdate: function(change) {
    var index = change.index;
    var data = this.$data.at(index);
    var tbody = this.$tbody[0];

    // Create new node representation and merge diff with old node
    var oldNode = tbody.childNodes[index];
    var newNode = GridBuilder.tbodyRow(this, data, index);
    var result = $vdom.mergeNodes(tbody, oldNode, newNode);

    // Trigger event
    this.dispatchEvent('dataupdated', {
      index: index,
      oldNode: oldNode,
      newNode: result
    });

    return this;
  }
};
