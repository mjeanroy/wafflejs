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
/* global $util */
/* global $$createComparisonFunction */
/* global CSS_SORTABLE_ASC */
/* global CSS_SORTABLE_DESC */
/* global DATA_WAFFLE_ID */
/* global DATA_WAFFLE_ORDER */
/* global DATA_WAFFLE_SORTABLE */
/* global CHAR_ORDER_ASC */
/* global CHAR_ORDER_DESC */
/* global SCROLLBAR_WIDTH */
/* exported Grid */

var Grid = (function() {

  // Save bytes
  var toPx = $util.toPx;
  var fromPx = $util.fromPx;

  // Normalize sort predicate
  // This function will return an array of id preprended with sort order
  // For exemple:
  //   parseSort('foo') => ['+foo']
  //   parseSort(['foo', 'bar']) => ['+foo', '+bar']
  //   parseSort(['-foo', 'bar']) => ['-foo', '+bar']
  //   parseSort(['-foo', '+bar']) => ['-foo', '+bar']
  var parseSort = function(ids) {
    var array = ids || [];
    if (!_.isArray(array)) {
      array = [array];
    }

    return _.map(array, function(current) {
      var firstChar = current.charAt(0);
      return firstChar !== CHAR_ORDER_ASC && firstChar !== CHAR_ORDER_DESC ? CHAR_ORDER_ASC + current : current;
    });
  };

  // == Private utilities

  // Call an event listener of given grid.
  // Grid object is returned.
  var call = function(grid, name, argFn) {
    var fn = grid.options.events[name];
    if (fn !== _.noop) {
      fn.apply(grid, (argFn || _.noop).call(grid));
    }
    return grid;
  };

  // Initialize grid:
  //  - Create or retrieve thead element
  //  - Create or retrieve tbody element
  var createNodes = function(grid) {
    var table = grid.$table[0];
    grid.$tbody = $($doc.byTagName('tbody', table));
    grid.$thead = $($doc.byTagName('thead', table));

    if (!grid.$thead.length) {
      var thead = $doc.thead();
      grid.$thead = $(thead);
      grid.$table.append(thead);
    }

    if (!grid.$tbody.length) {
      var tbody = $doc.tbody();
      grid.$tbody = $(tbody);
      grid.$table.append(tbody);
    }

    return grid;
  };

  // Build row and return it
  // Should be a private function
  var renderRow = function(grid, data) {
    var tr = $doc.tr();

    grid.$columns.forEach(function(column, idx) {
      var $node = $($doc.td())
        .addClass(column.cssClasses(idx, false))
        .css(column.styles(idx, false))
        .attr(column.attributes(idx, false))
        .html(column.render(data));

       tr.appendChild($node[0]);
    });

    return tr;
  };

  var Constructor = function(table, options) {
    if (!(this instanceof Constructor)) {
      return new Constructor(table, options);
    }

    // Initialize options with default values
    _.defaults(options.events || {}, Constructor.options.events);
    this.options = _.defaults(options || {}, Constructor.options);

    // Initialize main table
    this.$table = $(table);

    // Initialize data and columns
    this.$data = new Collection(options.data || [], {
      key: options.key
    });

    this.$columns = new Collection(options.columns || [], {
      key: 'id',
      model: Column
    });

    // Extract size
    var size = options.size;
    this.options.size = {
      width: fromPx(size.width),
      height: fromPx(size.height)
    };

    this.$sortBy = [];

    createNodes(this);

    this.$$bind()
        .$$observe()
        .assignWidth()
        .renderHeader()
        .sortBy(options.sortBy, false)
        .renderBody();

    call(this, 'onInitialized');
  };

  // Create new grid
  Constructor.create = function(table, options) {
    return new Constructor(table, options);
  };

  Constructor.prototype = {
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
      return this.renderHeader()
                 .renderBody();
    },

    // Calculate column width
    assignWidth: function() {
      var size = this.options.size;
      var rowWidth = size.width;

      if (size.height) {
        var px = toPx(size.width);
        this.$table.addClass('waffle-fixedheader')
                   .css({
                     width: px,
                     maxWidth: px,
                     minWidth: px
                   });

        this.$tbody.css({
          maxHeight: toPx(size.height)
        });

        rowWidth -= SCROLLBAR_WIDTH;
      }

      var constrainedWidth = 0;
      var constrainedColumnCount = 0;
      this.$columns.forEach(function(col) {
        var width = col.size.width;
        if (width) {
          constrainedWidth += width;
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
      this.$columns.forEach(function(col) {
        var oldWidth = col.size.width;
        var newWidth = oldWidth || 0;

        // If size is not explicitly specified, we should compute a size
        // For now, use the same width for every column
        if (!newWidth) {
          offset += remains;
          if (offset >= 1) {
            newWidth = flooredCalculatedWidth + 1;
            offset--;
          } else {
            newWidth = flooredCalculatedWidth;
          }
        }

        // Update size if we detect a change
        if (newWidth !== oldWidth) {
          col.updateWidth(newWidth);
        }
      });

      return this;
    },

    // Render entire header of grid
    renderHeader: function() {
      var tr = $doc.tr();

      this.$columns.forEach(function(column, idx, array) {
        var $node = $($doc.th())
          .addClass(column.cssClasses(idx, true))
          .css(column.styles(idx, true))
          .attr(column.attributes(idx, array, true))
          .html(column.title);

        tr.appendChild($node[0]);
      });

      this.$thead.empty().append(tr);

      return this;
    },

    // Render entire body of grid
    // Each row is appended to a fragment in memory
    // This fragment will be appended once to tbody element to avoid unnecessary DOM access
    // If render is asynchronous, data will be split into chunks, each chunks will be appended
    // one by one using setTimeout to let the browser to be refreshed periodically.
    renderBody: function(async) {
      var asyncRender = async == null ? this.options.async : async;
      var grid = this;

      var buildFragment = function(grid, data) {
        var fragment = $doc.createFragment();
        for (var i = 0, dataSize = data.length; i < dataSize; ++i) {
          var row = renderRow(grid, data[i]);
          fragment.appendChild(row);
        }
        return fragment;
      };

      var onEnded = function(grid) {
        grid.$data.clearChanges();

        call(grid, 'onRendered', function() {
          return [this.$data, _.toArray(this.$tbody[0].childNodes)];
        });

        // Free memory
        grid = buildFragment = onEnded = null;
      };

      if (asyncRender) {
        // Async rendering
        var delay = 10;
        var chunks = this.$data.split(200);
        var timer = function() {
          if (chunks.length > 0) {
            var fragment = buildFragment(grid, chunks.shift());
            grid.$tbody.append(fragment);
            setTimeout(timer, delay);
          } else {
            onEnded(grid);
            timer = chunks = null;
          }
        };

        this.$tbody.empty();
        setTimeout(timer);
      }
      else {
        var fragment = buildFragment(grid, grid.data());
        grid.$tbody.empty().append(fragment);
        onEnded(grid);
      }

      return this;
    },

    // Sort grid by fields
    // Second parameter is a parameter used internally to disable automatic rendering after sort
    sortBy: function(sortBy, $$render) {
      // Store new sort
      var normalizedSortBy = parseSort(sortBy);

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

      return call(this, 'onSorted');
    },

    // Destroy datagrid
    destroy: function() {
      return this.$$unbind()
                 .$$unobserve()
                 .$$destroy();
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
        var removedNodes;

        if (index === 0 && removedCount === this.$tbody[0].childNodes.length) {
          removedNodes = _.toArray(this.$tbody[0].childNodes);
          this.$tbody.empty();
        } else {
          removedNodes = [];
          for (var k = 0; k < removedCount; ++k) {
            var removedIndex = k + index;
            var $node = this.$tbody.children().eq(removedIndex);
            removedNodes.push($node[0]);
            $node.remove();
          }
        }

        // Trigger callback
        call(this, 'onRemoved', function() {
          return [change.removed, removedNodes, index];
        });
      }

      // Append new added data
      if (addedCount > 0) {
        var fragment = $doc.createFragment();
        var added = [];
        var addedNodes = [];

        for (var i = 0; i < addedCount; ++i) {
          var rowIdx = i + index;
          var data = collection.at(rowIdx);
          var tr = renderRow(this, data);

          addedNodes.push(tr);
          added.push(data);
          fragment.appendChild(tr);
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

        // Trigger callback
        call(this, 'onAdded', function() {
          return [added, addedNodes, index];
        });
      }

      return this;
    },

    // Some data have been updated
    // Should be a private function
    $$on_update: function(change) {
      var index = change.index;
      var data = this.$data.at(index);
      var tbody = this.$tbody[0];

      var oldNode = tbody.childNodes[index];
      var newNode = renderRow(this, data);
      tbody.replaceChild(newNode, oldNode);

      return this;
    }
  };

  // Define some default options
  Constructor.options = {
    key: 'id',
    async: false,
    size: {
      width: null,
      height: null
    },
    events: {
    }
  };

  // Initialize events with noop
  _.forEach(['onInitialized', 'onRendered', 'onAdded', 'onRemoved', 'onSorted'], function(name) {
    Constructor.options.events[name] = _.noop;
  });

  return Constructor;

})();
