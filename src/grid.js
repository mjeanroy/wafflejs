/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mickael Jeanroy
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
/* global DATA_WAFFLE_IDX */
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

  this.$sortBy = [];

  this.$$createNodes()
      .$$bind()
      .renderHeader()
      .sortBy(options.sortBy);
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
    return this.renderHeader().renderBody();
  },

  // Render entire header of grid
  renderHeader: function() {
    var tr = $doc.tr();

    this.$columns.forEach(function(column) {
      var attributes = {};
      attributes[DATA_WAFFLE_ID] = column.id;
      if (column.sortable) {
        attributes[DATA_WAFFLE_SORTABLE] = true;
        if (column.asc != null) {
          attributes[DATA_WAFFLE_ORDER] = column.asc ? CHAR_ORDER_ASC : CHAR_ORDER_DESC;
        }
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

    this.$data.forEach(function(data, idx) {
      var row = this.$$renderRow(data, idx);
      fragment.appendChild(row);
    }, this);

    this.$tbody.empty().append(fragment);
    return this;
  },

  // Sort grid by fields
  sortBy: function(sortBy) {
    // Store new sort
    var normalizedSortBy = $$parseSort(sortBy);

    // Check if sort predicate has changed
    // Compare array instance, or serialized array to string and compare string values (faster than array comparison)
    if (this.$sortBy === normalizedSortBy || this.$sortBy.join() === normalizedSortBy.join()) {
      return this.renderBody();
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

    // Body need to be rendered since data is now sorted
    return this.renderBody();
  },

  // Destroy datagrid
  destroy: function() {
    return this.$$unbind().$$destroy();
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

    // Render grid on initialization
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

  // Build row and return it
  // Should be a private function
  $$renderRow: function(data, idx) {
    var tr = $doc.tr();
    tr.setAttribute(DATA_WAFFLE_IDX, idx);

    this.$columns.forEach(function(column) {
      var attributes = {};
      attributes[DATA_WAFFLE_ID] = column.id;
      attributes[DATA_WAFFLE_IDX] = idx;

      var $node = $($doc.td())
        .addClass(column.cssClasses())
        .attr(attributes)
        .html(column.render(data));

      tr.appendChild($node[0]);
    });

    return tr;
  }
};
