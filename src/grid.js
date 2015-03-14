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
/* global $doc */
/* global Collection */
/* global Column */
/* global $ */
/* global _ */
/* global $parse */
/* global $comparators */
/* global $$createComparisonFunction */
/* global CSS_SORTABLE_ASC */
/* global CSS_SORTABLE_DESC */
/* global DATA_WAFFLE_ID */
/* global DATA_WAFFLE_ORDER */
/* global DATA_WAFFLE_SORTABLE */
/* global CHAR_ORDER_ASC */
/* global CHAR_ORDER_DESC */

// Normalize sort predicate
// This function will return an array of id preprended with sort order
// For exemple:
//   $$parseSort('foo') => ['+foo']
//   $$parseSort(['foo', 'bar']) => ['+foo', '+bar']
//   $$parseSort(['-foo', 'bar']) => ['-foo', '+bar']
//   $$parseSort(['-foo', '+bar']) => ['-foo', '+bar']
var $$parseSort = function(ids) {
  var array = ids || [];
  if (!_.isArray(array)) {
    array = [array];
  }

  return _.map(array, function(current) {
    var firstChar = current.charAt(0);
    return firstChar !== CHAR_ORDER_ASC && firstChar !== CHAR_ORDER_DESC ? CHAR_ORDER_ASC + current : current;
  });
};

var SCROLLBAR_WIDTH = 16;

var $$dim = function(type) {
  return function(val) {
    var dim = type + ': ' + val + 'px;';
    var max = 'max-' + dim;
    var min = 'min-' + dim;
    return {
      style: max + min + dim
    };
  }
}

var $$width = $$dim('width');
var $$height = $$dim('height');

var Grid = function(table, options) {
  if (!(this instanceof Grid)) {
    return new Grid(table, options);
  }

  this.$table = $(table);

  this.$data = new Collection(options.data || []);

  this.$columns = new Collection(options.columns || [], {
    key: 'id',
    model: Column
  });

  this.$height = options.height;
  this.$width = options.width;

  this.$sortBy = [];

  this.$$createNodes()
      .$$bind()
      .$$observe()
      .assignWidth()
      .renderHeader()
      .sortBy(options.sortBy, false)
      .renderBody();
};

// Create new grid
Grid.create = function(table, options) {
  return new Grid(table, options);
};

Grid.prototype = {
  // Get data collection
  data: function() {
    return this.$data;
  },

  // Get columns collection
  columns: function() {
    return this.$columns;
  },

  // Render entire grid
  render: function() {
    return this.calculateWidth().renderHeader().renderBody();
  },

  // Calculate column width
  assignWidth: function() {
    var borderWidth = 1;
    var rowWidth = this.$width - (2 * borderWidth);
    if (this.$height) {
      this.$table.addClass('waffle-fixedheader')
                 .attr($$width(this.$width));
      rowWidth -= SCROLLBAR_WIDTH;
    }

    var constrainedWidth = 0;
    var constrainedColumnCount = 0;
    this.$columns.forEach(function(col) {
      if (col.width) {
        constrainedWidth += col.width;
        ++constrainedColumnCount;
      }
    });

    var columnCount = this.$columns.length;
    var remainingColumns = columnCount - constrainedColumnCount;
    var flooredCalculatedWidth = 0;
    var remains = 0;
    if (remainingColumns) {
      var calculatedWidthColumn = (rowWidth - constrainedWidth) / remainingColumns;
      flooredCalculatedWidth = Math.floor(calculatedWidthColumn);
      remains = calculatedWidthColumn - flooredCalculatedWidth;
    }

    var offset = 0;
    this.$columns.forEach(function(col, idx) {
      if (col.width) {
        col.calculatedWidth = col.width;
      } else {
        offset += remains;
        if (offset >= 1) {
          col.calculatedWidth = flooredCalculatedWidth + 1;
          offset -= 1;
        } else {
          col.calculatedWidth = flooredCalculatedWidth;
        }
      }
    });

    return this;
  },

  // Render entire header of grid
  renderHeader: function() {
    var tr = $doc.tr();
    var that = this;

    this.$columns.forEach(function(column, idx) {
      var attributes = {};
      attributes[DATA_WAFFLE_ID] = column.id;
      if (column.sortable) {
        attributes[DATA_WAFFLE_SORTABLE] = true;
        if (column.asc != null) {
          attributes[DATA_WAFFLE_ORDER] = column.asc ? CHAR_ORDER_ASC : CHAR_ORDER_DESC;
        }
      }
      var width = column.calculatedWidth;
      if (width) {
        width += (that.$height && that.$columns.length === (idx + 1)) ? SCROLLBAR_WIDTH : 0;
        attributes.style = $$width(width).style;
      }

      var $node = $($doc.th())
        .addClass(column.cssClasses())
        .attr(attributes)
        .html(column.title);

      tr.appendChild($node[0]);
    });

    this.$thead.empty().append(tr);
    return this;
  },

  // Render entire body of grid
  // Each row is appended to a fragment in memory
  // This fragment will be appended once to tbody element to avoid unnecessary DOM access
  renderBody: function() {
    var fragment = $doc.createFragment();

    this.$data.forEach(function(data) {
      var row = this.$$renderRow(data);
      fragment.appendChild(row);
    }, this);

    this.$tbody.empty().append(fragment);

    if (this.$height) {
      this.$tbody.attr({style: 'max-height: ' + this.$height + 'px;'});
    }

    // Clear changes since data is now synchronized with grid
    this.$data.$$changes = [];

    return this;
  },

  // Sort grid by fields
  // Second parameter is a parameter used internally to disable automatic rendering after sort
  sortBy: function(sortBy, $$render) {
    // Store new sort
    var normalizedSortBy = $$parseSort(sortBy);

    // Check if sort predicate has changed
    // Compare array instance, or serialized array to string and compare string values (faster than array comparison)
    if (this.$sortBy === normalizedSortBy || this.$sortBy.join() === normalizedSortBy.join()) {
      return this;
    }

    this.$sortBy = normalizedSortBy;

    // Remove order flag
    var $tr = this.$thead.children().eq(0);
    var $th = $tr.children();
    $th.removeClass(CSS_SORTABLE_ASC + ' ' + CSS_SORTABLE_DESC)
       .removeAttr(DATA_WAFFLE_ORDER);

    // Create comparators object that will be used to create comparison function
    var $columns = this.$columns;
    var comparators = _.map(this.$sortBy, function(id) {
      var flag = id.charAt(0);
      var columnId = id.substr(1);
      var asc = flag === CHAR_ORDER_ASC;

      var index = $columns.indexByKey(columnId);

      var column;

      if (index >= 0) {
        column = $columns.at(index);
        column.asc = asc;

        // Update order flag
        $th.eq(index)
           .addClass(asc ? CSS_SORTABLE_ASC : CSS_SORTABLE_DESC)
           .attr(DATA_WAFFLE_ORDER, flag);

      } else {
        column = {};
      }

      return {
        parser: column.$parser || $parse(id),
        fn: column.$comparator || $comparators.$auto,
        desc: !asc
      };
    });

    this.$data.sort($$createComparisonFunction(comparators));

    if ($$render !== false) {
      // Body need to be rendered since data is now sorted
      this.renderBody();
    }

    return this;
  },

  // Destroy datagrid
  destroy: function() {
    return this.$$unbind()
               .$$unobserve()
               .$$destroy();
  },

  // Initialize grid:
  //  - Create or retrieve thead element
  //  - Create or retrieve tbody element
  $$createNodes: function() {
    var table = this.$table[0];
    this.$tbody = $($doc.byTagName('tbody', table));
    this.$thead = $($doc.byTagName('thead', table));

    if (!this.$thead.length) {
      var thead = $doc.thead();
      this.$thead = $(thead);
      this.$table.append(thead);
    }

    if (!this.$tbody.length) {
      var tbody = $doc.tbody();
      this.$tbody = $(tbody);
      this.$table.append(tbody);
    }

    return this;
  },

  // Destroy internal data
  // Should be a private function
  $$destroy: function() {
    for (var i in this) {
      if (this.hasOwnProperty(i)) {
        this[i] = null;
      }
    }
    return this;
  },

  // Bind user events
  // Should be a private function
  $$bind: function() {
    var that = this;
    this.$thead.on('click', function(e) {
      var th = e.target;
      if (th.getAttribute(DATA_WAFFLE_SORTABLE)) {
        var id = th.getAttribute(DATA_WAFFLE_ID);
        var currentOrder = th.getAttribute(DATA_WAFFLE_ORDER) || CHAR_ORDER_DESC;
        var newOrder = currentOrder === CHAR_ORDER_ASC ? CHAR_ORDER_DESC : CHAR_ORDER_ASC;

        var newPredicate = newOrder + id;

        var newSortBy;

        if (e.shiftKey) {
          newSortBy = that.$sortBy.slice();

          // We need to remove old predicate
          var oldPredicate = currentOrder + id;
          var idx = newSortBy.indexOf(oldPredicate);
          if (idx >= 0) {
            newSortBy.splice(idx, 1);
          }

          // And append new predicate
          newSortBy.push(newPredicate);

        }
        else {
          newSortBy = [newPredicate];
        }

        that.sortBy(newSortBy);
      }
    });
    return this;
  },

  // Unbind user events
  // Should be a private function
  $$unbind: function() {
    this.$thead.off();
    return this;
  },

  // Observe data collection
  $$observe: function() {
    this.$data.observe(this.$$onDataChange, this);
    return this;
  },

  // Delete all observers on data collection
  $$unobserve: function() {
    this.$data.unobserve();
    return this;
  },

  // Listener on changes on data collection
  $$onDataChange: function(changes) {
    _.forEach(changes, function(change) {
      var type = change.type;
      var method = '$$on_' + type;
      this[method](change);
    }, this);

    return this;
  },

  // Data collection has been spliced
  // It means that elements have been added or removed
  $$on_splice: function(change) {
    var index = change.index;
    var addedCount = change.addedCount;
    var collection = change.object;

    var removedCount = change.removed.length;
    if (removedCount > 0) {
      if (index === 0 && removedCount === this.$tbody[0].childNodes.length) {
        this.$tbody.empty();
      } else {
        for (var k = 0; k < removedCount; ++k) {
          var removedIndex = k + index;
          this.$tbody.children()
                     .eq(removedIndex)
                     .remove();
        }
      }
    }

    // Append new added data
    if (addedCount > 0) {
      var fragment = $doc.createFragment();
      for (var i = 0; i < addedCount; ++i) {
        var rowIdx = i + index;
        var data = collection.at(rowIdx);
        var $tr = this.$$renderRow(data);
        fragment.appendChild($tr);
      }

      if (index > 0) {
        // Add after existing node
        this.$tbody.children()
                   .eq(index - 1)
                   .after(fragment);
      } else {
        // Add at the beginning
        this.$tbody.prepend(fragment);
      }
    }

    return this;
  },

  // Build row and return it
  // Should be a private function
  $$renderRow: function(data) {
    var tr = $doc.tr();

    this.$columns.forEach(function(column, idx) {
      var attributes = {};
      attributes[DATA_WAFFLE_ID] = column.id;
      var width = column.calculatedWidth;
      if (width) {
        attributes.style = $$width(width).style;
      }

      var $node = $($doc.td())
        .addClass(column.cssClasses())
        .attr(attributes)
        .html(column.render(data));

      tr.appendChild($node[0]);
    });

    return tr;
  }
};
