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
/* global $parsers */
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

const GridDomHandlers = (() => {

  const THEAD = 'THEAD';
  const TFOOT = 'TFOOT';
  const TBODY = 'TBODY';
  const TH = 'TH';
  const TR = 'TR';
  const INPUT = 'INPUT';
  const SELECT = 'SELECT';

  const isInputCheckbox = node => node.tagName === INPUT && node.getAttribute('type') === 'checkbox';

  const isEditableControl = node => {
    const tagName = node.tagName;
    const isControl = tagName === INPUT || tagName === SELECT;
    return isControl && node.getAttribute(DATA_WAFFLE_ID) != null;
  };

  const isDraggable = node => !!node.getAttribute('draggable');

  const hasParent = (node, expectedParent) => {
    const parent = $doc.findParent(node, expectedParent.tagName);
    return parent === expectedParent;
  };

  const inputValue = {
    checkbox: 'checked'
  };

  const onClickTitle = function(e, tagName) {
    const target = e.target;
    const th = $doc.findParent(e.target, TH);

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

      const id = th.getAttribute(DATA_WAFFLE_ID);
      const currentOrder = th.getAttribute(DATA_WAFFLE_ORDER) || CHAR_ORDER_DESC;
      const newOrder = currentOrder === CHAR_ORDER_ASC ? CHAR_ORDER_DESC : CHAR_ORDER_ASC;
      const newPredicate = newOrder + id;

      let newSortBy;

      if (e.shiftKey) {
        const oldPredicate = currentOrder + id;
        newSortBy = _.reject(this.$comparators, comparator => comparator.predicate() === oldPredicate);
      } else {
        newSortBy = [];
      }

      newSortBy.push(newPredicate);
      this.sortBy(newSortBy);
    }
  };

  const stopDebouncer = (column, id) => {
    const debouncers = column.$debouncers;
    if (debouncers.contains(id)) {
      clearTimeout(debouncers.get(id));
      debouncers.remove(id);
    }
  };

  const createDebouncer = (column, id, fn, debounce) => {
    stopDebouncer(column, id);
    column.$debouncers.put(id, setTimeout(fn, debounce));
  };

  const editFn = (grid, column, tr, target) => {
    return () => {
      const type = column.editable.type;
      const inputProp = inputValue[type] || 'value';

      const idx = Number(tr.getAttribute(DATA_WAFFLE_IDX));
      const dataId = tr.getAttribute(DATA_WAFFLE_ID);
      const data = grid.$data;
      const object = data.byKey(dataId);

      const oldValue = column.value(object);
      const newValue = $parsers.$format(type, target[inputProp]);

      if (oldValue !== newValue) {
        column.value(object, newValue);

        // Dispatch events
        grid.dispatchEvent('datachanged', {
          index: idx,
          object: object,
          field: column.id,
          oldValue: oldValue,
          newValue: newValue
        });

        // Another field may have been updated, so
        // we should force an update to refresh the entire row.
        // Replacing data may change the index if collection
        // is sorted.
        data.replace(object);
      }

      // Stop debouncer if it exists.
      stopDebouncer(column, dataId);

      // Free memory.
      grid = column = tr = target = null;
    };
  };

  const o = {
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

      const target = e.target;

      // If target is tbody it means click was pressed in a tr and released in another.
      // If target is an editable control added by waffle, then we should not update selection, since
      // this is not a real row click event.
      if (target.tagName === TBODY || isEditableControl(target)) {
        return;
      }

      const tr = $doc.findParent(target, TR);
      const idx = tr.getAttribute(DATA_WAFFLE_IDX);
      const $data = this.$data;
      const data = $data.at(idx);

      // If data is not selectable, ignore event
      if (!this.isSelectable(data)) {
        return;
      }

      const selection = this.$selection;

      if (this.options.selection.multi) {
        if (e.shiftKey) {
          const idxF = parseFloat(idx);
          const selectAnchorF = parseFloat(this.$$selectAnchor);
          const lowerBound = Math.min(idxF, selectAnchorF);
          const upperBound = Math.max(idxF, selectAnchorF);

          const toAdd = [];
          for (let i = lowerBound; i <= upperBound; ++i) {
            const current = $data.at(i);
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
        const dataIdx = selection.indexOf(data);

        if (dataIdx >= 0) {
          selection.remove(dataIdx, 1);
        } else {
          selection.reset([data]);
        }
      }
    },

    // Update grid data when editable column has been updated
    onInputTbody: function(e) {
      const eventType = e.type;
      const target = e.target;

      const tr = $doc.findParent(target, 'TR');
      if (!tr) {
        return;
      }

      const columnId = target.getAttribute(DATA_WAFFLE_ID);
      const column = columnId ? this.$columns.byKey(columnId) : null;

      if (!column || !column.handleEvent(eventType)) {
        return;
      }

      // Create update function.
      const fn = editFn(this, column, tr, target);

      // Cancel previous timer.
      stopDebouncer(column);

      const debounceValue = column.editable.debounce;
      const debounce = _.isNumber(debounceValue) ?
        debounceValue :
        debounceValue[eventType] || 0;

      if (debounce) {
        const id = tr.getAttribute(DATA_WAFFLE_ID);
        createDebouncer(column, id, fn, debounce);
      } else {
        fn();
      }
    },

    // Triggered when drag event is started
    onDragStart: function(e) {
      const target = e.target;
      const originalEvent = e.originalEvent || e;
      const dataTransfer = originalEvent.dataTransfer;

      if (isDraggable(target)) {
        $(target).addClass(CSS_DRAGGABLE_DRAG);

        dataTransfer.effectAllowed = 'move';
        dataTransfer.clearData();
        dataTransfer.setData('Text', target.getAttribute(DATA_WAFFLE_ID));
      }
    },

    // Triggered when drag event is finished
    onDragEnd: function(e) {
      const target = e.target;
      const table = this.$table[0];

      $($doc.byTagName('th', table)).removeClass(CSS_DRAGGABLE_OVER);

      if (isDraggable(target) && hasParent(target, table)) {
        $(e.target).removeClass(CSS_DRAGGABLE_DRAG);
      }
    },

    // Triggerd when draggable element is over an other element.
    onDragOver: function(e) {
      const target = e.target;
      if (isDraggable(target) && hasParent(target, this.$table[0])) {
        const originalEvent = e.originalEvent || e;
        const dataTransfer = originalEvent.dataTransfer;
        dataTransfer.dropEffect = 'move';

        e.preventDefault();
        return false;
      }
    },

    // Triggerd when draggable element enter inside other element.
    onDragEnter: function(e) {
      const target = e.target;
      if (isDraggable(target) && hasParent(target, this.$table[0])) {
        $(target).addClass(CSS_DRAGGABLE_OVER);

        e.preventDefault();
        return false;
      }
    },

    // Triggerd when draggable element leaves other element.
    onDragLeave: function(e) {
      const target = e.target;
      if (isDraggable(target) && hasParent(target, this.$table[0])) {
        $(target).removeClass(CSS_DRAGGABLE_OVER);

        e.preventDefault();
        return false;
      }
    },

    // Triggerd when draggable element is dropped on other element.
    onDragDrop: function(e) {
      const target = e.target;
      if (isDraggable(target) && hasParent(target, this.$table[0])) {

        const originalEvent = e.originalEvent || e;
        const dataTransfer = originalEvent.dataTransfer;

        const oldId = dataTransfer.getData('Text');
        const newId = target.getAttribute(DATA_WAFFLE_ID);

        if (oldId !== newId) {
          const columns = this.$columns;
          const oldIdx = columns.indexOf(oldId);
          const newIdx = columns.indexOf(newId);
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
      const target = e.target;
      if (isDraggable(target)) {
        e.preventDefault();
        target.dragDrop();
        return false;
      }
    }
  };

  return o;

})();
