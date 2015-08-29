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
/* global $ */
/* global _ */
/* global $doc */
/* global CHAR_ORDER_ASC */
/* global CHAR_ORDER_DESC */
/* global DATA_WAFFLE_ID */
/* global DATA_WAFFLE_IDX */
/* global DATA_WAFFLE_ORDER */
/* global DATA_WAFFLE_SORTABLE */
/* global CSS_DRAGGABLE_DRAG */
/* global CSS_DRAGGABLE_OVER */
/* exported GridDomHandlers */

/**
 * Handle DOM events:
 * - Sort
 * - Selection
 * - Edition
 * - Drag & Drop
 */

var GridDomHandlers = (function() {

  var THEAD = 'THEAD';
  var TFOOT = 'TFOOT';
  var TBODY = 'TBODY';
  var TH = 'TH';
  var TR = 'TR';
  var INPUT = 'INPUT';
  var SELECT = 'SELECT';

  var isInputCheckbox = function(node) {
    return node.tagName === INPUT && node.getAttribute('type') === 'checkbox';
  };

  var isEditableControl = function(node) {
    var tagName = node.tagName;
    var isControl = tagName === INPUT || tagName === SELECT;
    return isControl && node.getAttribute(DATA_WAFFLE_ID) != null;
  };

  var isDraggable = function(node) {
    return !!node.getAttribute('draggable');
  };

  var hasParent = function(node, expectedParent) {
    var parent = $doc.findParent(node, expectedParent.tagName);
    return parent === expectedParent;
  };

  // Data formatter used when editable column cell is updated
  var dataFormatters = {
    number: function(value) {
      return Number(value);
    },
    checkbox: function(value) {
      return !!value;
    }
  };

  var inputValue = {
    checkbox: 'checked'
  };

  var onClickTitle = function(e, tagName) {
    var target = e.target;
    var th = $doc.findParent(e.target, TH);

    // If target is thead it means click was pressed in a th and released in another
    if (target.tagName === tagName) {
      return;
    }

    if (this.isSelectable() && isInputCheckbox(target)) {
      // Checkbox

      if (target.checked) {
        this.select();
      } else {
        this.deselect();
      }

    } else if (th && th.getAttribute(DATA_WAFFLE_SORTABLE)) {
      // Column header

      var id = th.getAttribute(DATA_WAFFLE_ID);
      var currentOrder = th.getAttribute(DATA_WAFFLE_ORDER) || CHAR_ORDER_DESC;
      var newOrder = currentOrder === CHAR_ORDER_ASC ? CHAR_ORDER_DESC : CHAR_ORDER_ASC;
      var newPredicate = newOrder + id;

      var newSortBy;

      if (e.shiftKey) {
        var oldPredicate = currentOrder + id;
        newSortBy = _.reject(this.$sortBy, function(predicate) {
          return predicate === oldPredicate;
        });
      } else {
        newSortBy = [];
      }

      newSortBy.push(newPredicate);
      this.sortBy(newSortBy);
    }
  };

  var o = {
    onClickThead: function(e) {
      return onClickTitle.call(this, e, THEAD);
    },

    onClickTfoot: function(e) {
      return onClickTitle.call(this, e, TFOOT);
    },

    onClickTbody: function(e) {
      // If grid is not selectable, ignore event.
      if (!this.isSelectable()) {
        return;
      }

      var target = e.target;

      // If target is tbody it means click was pressed in a tr and released in another.
      // If target is an editable control added by waffle, then we should not update selection, since
      // this is not a real row click event.
      if (target.tagName === TBODY || isEditableControl(target)) {
        return;
      }

      var tr = $doc.findParent(target, TR);
      var idx = tr.getAttribute(DATA_WAFFLE_IDX);
      var $data = this.$data;
      var data = $data.at(idx);

      // If data is not selectable, ignore event
      if (!this.isSelectable(data)) {
        return;
      }

      var selection = this.$selection;

      if (this.options.selection.multi) {
        if (e.shiftKey) {
          var idxF = parseFloat(idx);
          var selectAnchorF = parseFloat(this.$$selectAnchor);
          var lowerBound = Math.min(idxF, selectAnchorF);
          var upperBound = Math.max(idxF, selectAnchorF);

          var toAdd = [];
          for (var i = lowerBound; i <= upperBound; ++i) {
            var current = $data.at(i);
            if (!selection.contains(current) && this.isSelectable(current)) {
              toAdd.push(current);
            }
          }

          if (toAdd.length > 0) {
            selection.push.apply(selection, toAdd);
          }
        } else {
          selection.toggle(data);
          this.$$selectAnchor = idx;
        }
      } else {
        var dataIdx = selection.indexOf(data);

        if (dataIdx >= 0) {
          selection.remove(dataIdx, 1);
        } else {
          selection.reset([data]);
        }
      }
    },

    // Update grid data when editable column has been updated
    onInputTbody: function(e) {
      var target = e.target;
      var columnId = target.getAttribute(DATA_WAFFLE_ID);
      var column = columnId ? this.$columns.byKey(columnId) : null;

      if (column && column.isEditable()) {
        var tr = $doc.findParent(target, 'TR');
        if (tr) {
          var type = column.editable.type;
          var formatter = dataFormatters[type] || _.identity;
          var inputProp = inputValue[type] || 'value';

          var idx = Number(tr.getAttribute(DATA_WAFFLE_IDX));
          var data = this.$data;
          var object = data.at(idx);

          var oldValue = column.value(object);
          var newValue = formatter(target[inputProp]);

          if (oldValue !== newValue) {
            column.value(object, newValue);

            // Dispatch events
            this.dispatchEvent('datachanged', {
              index: idx,
              object: object,
              field: columnId,
              oldValue: oldValue,
              newValue: newValue
            });

            // Another field may have been updated, so
            // we should force an update to refresh the entire row.
            // Replacing data may change the index if collection
            // is sorted.
            data.replace(object);
          }
        }
      }
    },

    // Triggered when drag event is started
    onDragStart: function(e) {
      var target = e.target;
      var originalEvent = e.originalEvent || e;
      var dataTransfer = originalEvent.dataTransfer;

      if (isDraggable(target)) {
        $(target).addClass(CSS_DRAGGABLE_DRAG);

        dataTransfer.effectAllowed = 'move';
        dataTransfer.clearData();
        dataTransfer.setData('Text', target.getAttribute(DATA_WAFFLE_ID));
      }
    },

    // Triggered when drag event is finished
    onDragEnd: function(e) {
      var target = e.target;
      var table = this.$table[0];

      $($doc.byTagName('th', table)).removeClass(CSS_DRAGGABLE_OVER);

      if (isDraggable(target) && hasParent(target, table)) {
        $(e.target).removeClass(CSS_DRAGGABLE_DRAG);
      }
    },

    // Triggerd when draggable element is over an other element.
    onDragOver: function(e) {
      var target = e.target;
      if (isDraggable(target) && hasParent(target, this.$table[0])) {
        var originalEvent = e.originalEvent || e;
        var dataTransfer = originalEvent.dataTransfer;
        dataTransfer.dropEffect = 'move';

        e.preventDefault();
        return false;
      }
    },

    // Triggerd when draggable element enter inside other element.
    onDragEnter: function(e) {

      var target = e.target;
      if (isDraggable(target) && hasParent(target, this.$table[0])) {
        $(target).addClass(CSS_DRAGGABLE_OVER);

        e.preventDefault();
        return false;
      }
    },

    // Triggerd when draggable element leaves other element.
    onDragLeave: function(e) {
      var target = e.target;
      if (isDraggable(target) && hasParent(target, this.$table[0])) {
        $(target).removeClass(CSS_DRAGGABLE_OVER);

        e.preventDefault();
        return false;
      }
    },

    // Triggerd when draggable element is dropped on other element.
    onDragDrop: function(e) {
      var target = e.target;
      if (isDraggable(target) && hasParent(target, this.$table[0])) {

        var originalEvent = e.originalEvent || e;
        var dataTransfer = originalEvent.dataTransfer;

        var oldId = dataTransfer.getData('Text');
        var newId = target.getAttribute(DATA_WAFFLE_ID);

        if (oldId !== newId) {
          var columns = this.$columns;
          var oldIdx = columns.indexOf(oldId);
          var newIdx = columns.indexOf(newId);
          columns.add(columns.remove(oldIdx, 1), newIdx);

          // Do not forget to remove css class
          $(target).removeClass(CSS_DRAGGABLE_OVER);
        }

        e.preventDefault();
        return false;
      }
    },

    // Event triggered when text selection occurs
    // This is an event for IE <= 9 to handle drag&drop
    // on none link nodes.
    onSelectStart: function(e) {
      var target = e.target;
      if (isDraggable(target)) {
        e.preventDefault();
        target.dragDrop();
        return false;
      }
    }
  };

  return o;

})();
