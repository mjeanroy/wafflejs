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
/* global $doc */
/* global CHAR_ORDER_ASC */
/* global CHAR_ORDER_DESC */
/* global DATA_WAFFLE_ID */
/* global DATA_WAFFLE_IDX */
/* global DATA_WAFFLE_ORDER */
/* global DATA_WAFFLE_SORTABLE */
/* exported GridDomHandlers */

var GridDomHandlers = (function() {

  var THEAD = 'THEAD';
  var TFOOT = 'TFOOT';
  var TBODY = 'TBODY';
  var TH = 'TH';
  var TR = 'TR';
  var INPUT = 'INPUT';

  var isInputCheckbox = function(node) {
    return node.tagName === INPUT && node.getAttribute('type') === 'checkbox';
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

  var onClickTitle = function(e, tagName) {
    var target = e.target;
    var th = $doc.findParent(e.target, TH);

    // If target is thead it means click was pressed in a th and released in another
    if (target.tagName === tagName) {
      return;
    }

    // Checkbox
    if (this.isSelectable() && isInputCheckbox(target)) {
      if (target.checked) {
        this.select();
      } else {
        this.deselect();
      }
    }

    // Column header
    else if (th && th.getAttribute(DATA_WAFFLE_SORTABLE)) {
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

      // If target is tbody it means click was pressed in a tr and released in another
      if (e.target.tagName === TBODY) {
        return;
      }

      var tr = $doc.findParent(e.target, TR);
      var idx = tr.getAttribute(DATA_WAFFLE_IDX);
      var data = this.$data.at(idx);
      var selection = this.$selection;

      if (this.options.selection.multi) {
        if (e.shiftKey) {
          var idxF = parseFloat(idx);
          var selectAnchorF = parseFloat(this.$$selectAnchor);
          var lowerBound = Math.min(idxF, selectAnchorF);
          var upperBound = Math.max(idxF, selectAnchorF);

          var toAdd = [];
          for (var i = lowerBound; i <= upperBound; ++i) {
            var current = this.$data.at(i);
            if (!selection.contains(current)) {
              toAdd.push(current);
            }
          }

          if (toAdd.length > 0) {
            selection.push.apply(selection, toAdd);
          }
        }
        else {
          selection.toggle(data);
          this.$$selectAnchor = idx;
        }
      }
      else {
        var dataIdx = selection.indexOf(data);

        if (dataIdx >= 0) {
          selection.remove(dataIdx, 1);
        }
        else {
          selection.reset([data]);
        }
      }
    },

    // Update grid data when editable column has been updated
    onInputTbody: function(e) {
      var target = e.target;
      var columnId = target.getAttribute(DATA_WAFFLE_ID);
      var column = columnId ? this.$columns.byKey(columnId) : null;

      if (column && column.editable) {
        var tr = $doc.findParent(target, 'TR');
        if (tr) {
          var type = column.editable.type;
          var formatter = dataFormatters[type] || _.identity;
          var idx = Number(tr.getAttribute(DATA_WAFFLE_IDX));

          var data = this.$data;
          var object = data.at(idx);

          var oldValue = column.value(object);
          var newValue = formatter($(target).val());

          if (oldValue !== newValue) {
            column.value(object, newValue);

            // Dispatch events
            this.dispatchEvent('datachanged', {
              index: idx,
              object: object,
              oldValue: oldValue,
              newValue: newValue
            });
          }
        }
      }
    }
  };

  return o;

})();
