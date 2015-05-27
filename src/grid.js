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
/* global GridBuilder */
/* global $$createComparisonFunction */
/* global CSS_SORTABLE_ASC */
/* global CSS_SORTABLE_DESC */
/* global CSS_SCROLLABLE */
/* global CSS_SELECTED */
/* global DATA_WAFFLE_ID */
/* global DATA_WAFFLE_ORDER */
/* global DATA_WAFFLE_IDX */
/* global DATA_WAFFLE_SORTABLE */
/* global CHAR_ORDER_ASC */
/* global CHAR_ORDER_DESC */
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

  var Constructor = function(table, options) {
    if (!(this instanceof Constructor)) {
      return new Constructor(table, options);
    }

    var opts = options = options || {};
    var defaultOptions = Constructor.options;

    // Initialize nested object of options with default values.
    _.forEach(['events', 'selection', 'size'], function(optName) {
      opts[optName] = _.defaults(opts[optName] || {}, defaultOptions[optName]);
    });

    // Initialize options with default values.
    // Keep options as an internal property.
    this.options = _.defaults(opts, defaultOptions);

    // Initialize main table
    this.$table = $(table);

    // Initialize data
    this.$data = new Collection(opts.data, {
      key: opts.key,
      model: opts.model
    });

    // Initialize column collection
    this.$columns = new Collection(opts.columns, {
      key: 'id',
      model: Column
    });

    // Initialize selection data.
    // Use same options as data collection.
    this.$selection = new Collection([], this.$data.options());

    // Translate size to valid numbers.
    opts.size = {
      width: fromPx(opts.size.width),
      height: fromPx(opts.size.height)
    };

    this.$sortBy = [];

    createNodes(this);

    // Observe collection to update grid accordingly
    this.$data.observe(this.$$onDataChange, this);

    this.$$bind()
        .assignWidth()
        .renderHeader()
        .sortBy(options.sortBy, false)
        .renderBody();

    this.trigger('onInitialized');
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
        this.$table.addClass(CSS_SCROLLABLE)
                   .css({
                     width: px,
                     maxWidth: px,
                     minWidth: px
                   });

        this.$tbody.css({
          maxHeight: toPx(size.height)
        });

        rowWidth -= $doc.scrollbarWidth();
      }

      var constrainedWidth = 0;
      var constrainedColumnCount = 0;
      this.$columns.forEach(function(col) {
        var width = col.width;
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
        var oldWidth = col.width;
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
      var tr = GridBuilder.theadRow(this);
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

      var empty = _.once(function() {
        grid.$tbody.empty();
      });

      var build = function(data, startIdx) {
        var fragment = GridBuilder.tbodyRows(grid, data, startIdx);
        empty();
        grid.$tbody.append(fragment);
      };

      var onEnded = function() {
        grid.$data.clearChanges();

        grid.trigger('onRendered', function() {
          return [this.$data, _.toArray(this.$tbody[0].childNodes)];
        });

        // Free memory
        grid = empty = build = onEnded = null;
      };

      if (asyncRender) {
        $util.asyncTask(this.$data.split(200), 10, build, onEnded);
      } else {
        build(this.$data, 0);
        onEnded();
      }

      return this;
    },

    select: function(newSelection) {
      var that = this;

      if (!_.isArray(newSelection)) {
        newSelection = [newSelection];
      }

      var previousSelection = this.$selection;

      var toggle = function(data) {
        var idx = that.$data.indexOf(data);
        var select = !that.$data.at(idx).$$selected;
        that.$data.at(idx).$$selected = select;
        var $tr = $(that.$tbody[0].rows[idx]);
        if (select) {
          $tr.addClass(CSS_SELECTED);
        } else {
          $tr.removeClass(CSS_SELECTED);
        }
      };

      _.forEach(newSelection, function(data) {
        if (!data.$$selected) {
          toggle(data);
        }
      });

      previousSelection.forEach(function(data) {
        if (!_.contains(newSelection, data)) {
          toggle(data);
        }
      });

      this.$selection.reset(newSelection);
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

        var index = $columns.indexOf(columnId);

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

      return this.trigger('onSorted');
    },

    // Trigger events listeners
    // First argument is the name of the event.
    // For lazy evaluation of arguments, second argument is a function that
    // should return event argument. This function will be called if and only if
    // event need to be triggered.
    // If lazy evaluation is needless, just put arguments next to event name.
    trigger: function(name, argFn) {
      var fn = this.options.events[name];
      if (fn && fn !== _.noop) {
        var args = _.isFunction(argFn) ? argFn.call(this) : _.rest(arguments);
        fn.apply(this, args);
      }

      return this;
    },

    // Destroy datagrid
    destroy: function() {
      // Unbind dom events
      this.$thead.off();
      this.$tbody.off();

      // Unobserve collection
      this.$data.unobserve();

      // Destroy internal property
      $util.destroy(this);
    },

    // Bind user events
    // Should be a private function
    $$bind: function() {
      var that = this;
      this.$thead.on('click', function(e) {
        // If target is thead it means click was pressed in a th and released in another
        if (e.target.tagName === 'THEAD') {
          return;
        }

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

      this.$tbody.on('click', function(e) {
        // If target is tbody it means click was pressed in a tr and released in another
        if (e.target.tagName === 'TBODY') {
          return;
        }

        var tr = $doc.findParent(e.target, 'TR');
        var idx = tr.getAttribute(DATA_WAFFLE_IDX);
        var data = that.$data.at(idx);
        var previouslySelected = data.$$selected;
        var newSelection = [];

        if (that.options.selection.multi) {
          if (e.shiftKey) {
            var idxF = parseFloat(idx);
            var selectAnchorF = parseFloat(that.$$selectAnchor);
            var lowerBound = idxF > selectAnchorF ? selectAnchorF : idxF;
            var upperBound = idxF > selectAnchorF ? idxF : selectAnchorF;
            for (var i = lowerBound; i <= upperBound; ++i) {
              newSelection.push(that.$data.at(i));
            }
          } else if (e.ctrlKey) {
            that.$selection.forEach(function(data, currIdx) {
              if (idx !== currIdx) {
                newSelection.push(data);
              }
            });
            if (!previouslySelected) {
              newSelection.push(data);
            }
          } else if (!previouslySelected || that.$selection.length > 1) {
            newSelection.push(data);
            that.$$selectAnchor = idx;
          }
        } else {
          if (!previouslySelected) {
            newSelection.push(data);
          }
        }

        that.select(newSelection);
      });

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
        this.trigger('onRemoved', function() {
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
          var tr = GridBuilder.tbodyRow(this, data, rowIdx);

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
        this.trigger('onAdded', added, addedNodes, index);
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
      var newNode = GridBuilder.tbodyRow(this, data, index);
      tbody.replaceChild(newNode, oldNode);

      return this;
    }
  };

  // Define default options.
  Constructor.options = {
    // Default identifier for data.
    key: 'id',

    // Asynchronous rendering, disable by default.
    // Should be used to improve user experience with large dataset.
    async: false,

    // Selection configuration.
    // By default it is not enable.
    selection: {
      multi: false
    },

    // Size of grid, default is to use automatic size.
    size: {
      width: null,
      height: null
    },

    // Set of events.
    events: {
    }
  };

  // Initialize events with noop
  _.forEach(['onInitialized', 'onRendered', 'onAdded', 'onRemoved', 'onSorted'], function(name) {
    Constructor.options.events[name] = _.noop;
  });

  return Constructor;

})();
