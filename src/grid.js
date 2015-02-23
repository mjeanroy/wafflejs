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
/* global DATA_WAFFLE_ID */
/* global DATA_WAFFLE_IDX */
/* global DATA_WAFFLE_ORDER */
/* global CHAR_ORDER_ASC */
/* global CHAR_ORDER_DESC */


var Grid = function(table, options) {
  this.$table = $(table);

  this.$data = new Collection(options.data || []);
  this.$columns = new Collection(options.columns || [], {
    key: 'id',
    model: Column
  });

  this.init();
};

Grid.prototype = {
  // Initialize grid:
  //  - Create or retrieve thead element
  //  - Create or retrieve tbody element
  init: function() {
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
    return this.$$bind().render();
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
      if (column.asc != null) {
        attributes[DATA_WAFFLE_ORDER] = column.asc ? CHAR_ORDER_ASC : CHAR_ORDER_DESC;
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
  sortBy: function(columnIds) {
    if (!_.isArray(columnIds)) {
      columnIds = [columnIds];
    }

    // Create comparators object that will be used to create comparison function
    var comparators = _.map(columnIds, function(id) {
      var firstChar = id.charAt(0);
      var columnId = firstChar === CHAR_ORDER_DESC || firstChar === CHAR_ORDER_ASC ? id.substr(1) : id;
      var flag = firstChar === CHAR_ORDER_DESC ? CHAR_ORDER_DESC : CHAR_ORDER_ASC;

      var index = this.$columns.indexByKey(columnId);

      var $tr = this.$thead.children().eq(0);
      var $th = $tr.children();

      // Remove order flag
      $th.removeAttr(DATA_WAFFLE_ORDER);

      var column;
      if (index >= 0) {
        column = this.$columns.at(index);

        // Update order flag
        $th.eq(index)
           .attr(DATA_WAFFLE_ORDER, flag);

      } else {
        column = {};
      }

      column.asc = flag === CHAR_ORDER_ASC;

      return {
        parser: column.$parser || $parse(id),
        fn: column.comparator || $comparators.$auto,
        desc: !column.asc
      };
    }, this);

    this.$data.sort($$createComparisonFunction(comparators));

    // Body need to be rendered since data is now sorted
    return this.renderBody();
  },

  // Destroy datagrid
  destroy: function() {
    return this.$$unbind().$$destroy();
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
      var id = th.getAttribute(DATA_WAFFLE_ID);
      var currentOrder = th.getAttribute(DATA_WAFFLE_ORDER) || CHAR_ORDER_DESC;
      var newOrder = currentOrder === CHAR_ORDER_ASC ? CHAR_ORDER_DESC : CHAR_ORDER_ASC;
      that.sortBy([newOrder + id]);
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
