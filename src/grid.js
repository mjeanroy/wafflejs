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
/* global EventBus */
/* global GridBuilder */
/* global GridResizer */
/* global GridDomBinders */
/* global GridDataObserver */
/* global GridColumnsObserver */
/* global GridSelectionObserver */
/* global $$createComparisonFunction */
/* global CSS_GRID */
/* global CSS_SORTABLE_ASC */
/* global CSS_SORTABLE_DESC */
/* global CSS_SCROLLABLE */
/* global CSS_SELECTABLE */
/* global DATA_WAFFLE_ORDER */
/* global CHAR_ORDER_ASC */
/* global CHAR_ORDER_DESC */
/* global THEAD */
/* global TFOOT */
/* global TBODY */
/* exported Grid */

var Grid = (function() {

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

  // Get exisiting node or create it and append it to the table.
  var createNode = function(tagName) {
    // Get existing node or create it
    var varName = '$' + tagName;
    var $table = this.$table;

    // Get it...
    this[varName] = $($doc.byTagName(tagName, $table[0]));

    // ... or create it !
    if (!this[varName].length) {
      this[varName] = $($doc[tagName]());
    }

    // Just append at the end of the table
    $table.append(this[varName][0]);
  };

  var callbackWrapper = function(name) {
    var fn = this.options.events[name];
    if (fn) {
      this.addEventListener(name.slice(2), this.options.events[name]);
    }
  };

  var Constructor = function(table, options) {
    if (!(this instanceof Constructor)) {
      return new Constructor(table, options);
    }

    // Initialize main table
    var $table = this.$table = $(table);

    // Initialize options
    var opts = this.options = options = options || {};
    var defaultOptions = Constructor.options;

    // Try to initialize options with default values
    // - If option is already defined, use it (but initialize default values for nested object).
    // - If option is not defined, try to get html value.
    // - If option is still not defined, use default.
    _.forEach(_.keys(defaultOptions), function(optName) {
      var opt = opts[optName];
      var def = defaultOptions[optName];

      // Try to initialize from html
      // If options is already defined, do not try to parse html
      if (_.isUndefined(opt)) {
        var attrName = $util.toSpinalCase(optName);
        var htmlAttr = $table[0].getAttribute(attrName) || $table[0].getAttribute('data-' + attrName);
        if (htmlAttr) {
          opt = opts[optName] = $util.parse(htmlAttr);
        }
      }

      // Initialize default values of nested objects
      if (_.isObject(def) && (_.isObject(opt) || _.isUndefined(opt))) {
        opt = opts[optName] = _.defaults(opt || {}, def);
      }

      // It it is still undefined, use default value
      if (_.isUndefined(opt)) {
        opt = opts[optName] = def;
      }
    });

    // Translate size to valid numbers.
    opts.size = {
      width: opts.size.width,
      height: opts.size.height
    };

    // Force scroll if height is specified.
    opts.scrollable = opts.scrollable || !!opts.size.height;

    // Initialize data
    this.$data = new Collection(opts.data, {
      key: opts.key,
      model: opts.model
    });

    var isSortable = this.isSortable();
    var isDraggable = this.isDraggable();

    if (opts.columns && (!isSortable || isDraggable)) {
      // Force column not to be sortable
      _.forEach(opts.columns, function(column) {
        if (!isSortable) {
          column.sortable = false;
        }

        // Force column to be draggable
        if (isDraggable) {
          column.draggable = true;
        }
      });
    }

    this.$columns = new Collection(opts.columns, {
      key: 'id',
      model: Column
    });

    // Options flags
    var isScrollable = opts.scrollable;
    var isSelectable = this.isSelectable();
    var isEditable = this.isEditable();

    this.$sortBy = [];

    // Add appropriate css to table
    $table.addClass(CSS_GRID);

    if (isSelectable) {
      $table.addClass(CSS_SELECTABLE);
    }

    if (isScrollable) {
      $table.addClass(CSS_SCROLLABLE);
    }

    // Create main nodes
    var view = [TBODY];

    // Check if we should append table header
    if (opts.view.thead) {
      view.unshift(THEAD);
    }

    // Check if we should append table footer
    if (opts.view.tfoot) {
      view.push(TFOOT);
    }

    _.forEach(view, createNode, this);

    // Observe collection to update grid accordingly
    this.$data.observe(GridDataObserver.on, this);
    this.$columns.observe(GridColumnsObserver.on, this);

    this.$$events = {};

    // Bind dom handlers only if needed
    if (isSortable) {
      GridDomBinders.bindSort(this);
    }

    // Bind input event if editable columns are updated
    if (isEditable) {
      GridDomBinders.bindEdition(this);
    }

    if (isSelectable) {
      this.$selection = new Collection([], this.$data.options());
      this.$selection.observe(GridSelectionObserver.on, this);

      // Bind selection events
      GridDomBinders.bindSelection(this);
    }

    // Create event bus...
    this.$bus = new EventBus();

    // ... and wrap callbacks to events
    _.forEach(_.keys(opts.events), callbackWrapper, this);

    // If height is specified, we need to set column size.
    if (this.isResizable()) {
      this.resize();

      // Bind resize event to resize grid automatically when window view is resized
      GridDomBinders.bindResize(this);
    }

    this.renderHeader()
        .renderFooter()
        .sortBy(options.sortBy, false)
        .renderBody();

    // Grid is up to date !
    this.clearChanges();

    if (isDraggable) {
      GridDomBinders.bindDragDrop(this);
    }

    this.dispatchEvent('initialized');
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

    // Get selection collection
    selection: function() {
      return this.$selection;
    },

    // Check if grid hasat least
    isEditable: function() {
      return this.options.editable || this.$columns.some(function(column) {
        return !!column.editable;
      });
    },

    // Check if grid is sortable
    isSortable: function() {
      return this.options.sortable;
    },

    // Check if grid is selectable
    isSelectable: function() {
      var selection = this.options.selection;
      return selection && selection.enable;
    },

    // Check if grid is resizable
    isResizable: function() {
      var size = this.options.size;
      return !!size.height || !!size.width;
    },

    // Check if grid render checkbox as first column
    hasCheckbox: function() {
      return this.isSelectable() && this.options.selection.checkbox;
    },

    // Check if grid has a table header
    hasHeader: function() {
      return !!this.$thead;
    },

    // Check if grid has a table footer
    hasFooter: function() {
      return !!this.$tfoot;
    },

    // Without parameter, check if grid is selected.
    // If first parameter is set, check if data is selected.
    isSelected: function(data) {
      if (!this.isSelectable()) {
        return false;
      }

      if (data) {
        return this.$selection.contains(data);
      }

      var s1 = this.$data.length;
      var s2 = this.$selection.length;
      return s1 > 0 && s1 === s2;
    },

    isDraggable: function() {
      return !!this.options.dnd;
    },

    // Render entire grid
    render: function() {
      this.renderHeader()
          .renderFooter()
          .renderBody();

      // Grid is up to date !
      this.clearChanges();

      return this;
    },

    // Render entire header of grid
    renderHeader: function() {
      if (this.hasHeader()) {
        var tr = GridBuilder.theadRow(this);
        this.$thead.empty().append(tr);
      }
      return this;
    },

    // Render entire footer of grid
    renderFooter: function() {
      if (this.hasFooter()) {
        var tr = GridBuilder.tfootRow(this);
        this.$tfoot.empty().append(tr);
      }
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

        grid.dispatchEvent('rendered', function() {
          return {
            data: this.$data,
            nodes: _.toArray(this.$tbody[0].childNodes)
          };
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

    // Resize grid with new values
    resize: function() {
      GridResizer.resize(this);
      return this;
    },

    // Select everything
    select: function() {
      if (this.$selection.length !== this.$data.length) {
        this.$selection.add(this.$data.toArray());
      }

      return this;
    },

    // Deselect everything
    deselect: function() {
      if (!this.$selection.isEmpty()) {
        this.$selection.clear();
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

      var hasHeader = this.hasHeader();
      var hasFooter = this.hasFooter();

      var $headers = hasHeader ? this.$thead.children().eq(0).children() : null;
      var $footers = hasFooter ? this.$tfoot.children().eq(0).children() : null;

      var clearSort = function($items) {
        $items.removeClass(CSS_SORTABLE_ASC + ' ' + CSS_SORTABLE_DESC)
              .removeAttr(DATA_WAFFLE_ORDER);
      };

      var addSort = function($items, index, asc, flag) {
        $items.eq(index)
              .addClass(asc ? CSS_SORTABLE_ASC : CSS_SORTABLE_DESC)
              .attr(DATA_WAFFLE_ORDER, flag);
      };

      // Remove order flag

      if ($headers) {
        clearSort($headers);
      }

      if ($footers) {
        clearSort($footers);
      }

      // Create comparators object that will be used to create comparison function
      var $columns = this.$columns;
      var hasCheckbox = this.hasCheckbox();

      var comparators = _.map(this.$sortBy, function(id) {
        var flag = id.charAt(0);
        var columnId = id.substr(1);
        var asc = flag === CHAR_ORDER_ASC;

        var index = $columns.indexOf(columnId);
        var thIndex = hasCheckbox ? index + 1 : index;

        var column;

        if (index >= 0) {
          column = $columns.at(index);
          column.asc = asc;

          // Update order flag
          if ($headers) {
            addSort($headers, thIndex, asc, flag);
          }

          if ($footers) {
            addSort($footers, thIndex, asc, flag);
          }
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

      return this.dispatchEvent('sorted');
    },

    // Trigger events listeners
    // First argument is the name of the event.
    // For lazy evaluation of arguments, second argument is a function that
    // should return event argument. This function will be called if and only if
    // event need to be triggered.
    // If lazy evaluation is needless, just put arguments next to event name.
    dispatchEvent: function(name, argFn) {
      this.$bus.dispatchEvent(this, name, argFn);

      // Trigger events when one of other event is triggered
      // This can be a way to add a single listener to all events
      this.$bus.dispatchEvent(this, 'updated');

      return this;
    },

    // Add new event listener.
    // Type of event is case insensitive.
    addEventListener: function(type, listener) {
      this.$bus.addEventListener(type, listener);
      return this;
    },

    // Remove existing event listener.
    // Type of event is case insensitive.
    removeEventListener: function(type, listener) {
      this.$bus.removeEventListener(type, listener);
      return this;
    },

    // Clear all pending changes.
    clearChanges: function() {
      this.$data.clearChanges();
      this.$columns.clearChanges();

      if (this.$selection) {
        this.$selection.clearChanges();
      }
    },

    // Destroy datagrid
    destroy: function() {
      // Unbind dom events
      this.$table.off();
      this.$tbody.off();

      if (this.hasHeader()) {
        this.$thead.off();
      }

      if (this.hasFooter()) {
        this.$tfoot.off();
      }

      // Unbind resize event
      if (this.$$events.onResize) {
        $(window).off('resize', this.$$events.onResize);
      }

      // Unobserve collection
      this.clearChanges();
      this.$data.unobserve();
      this.$columns.unobserve();
      this.$selection.unobserve();

      // Clear event bus
      this.$bus.clear();

      // Clear event listeners
      this.$$events = null;

      // Destroy internal property
      $util.destroy(this);
    }
  };

  // Define default options.
  Constructor.options = {
    // Default identifier for data.
    key: 'id',

    // Data initialization
    data: null,

    // Columns initialization
    columns: null,

    // Default sort
    sortBy: null,

    // Asynchronous rendering, disable by default.
    // Should be used to improve user experience with large dataset.
    async: false,

    // Global scrolling
    // Scrolling is automatically set to true if height is set
    // using size option.
    // If size is not set, scolling is enabled, but column and table
    // size have to be set using css.
    scrollable: false,

    // Global sorting
    // Sort can also be disabled per column
    sortable: true,

    // Global edition
    // This will be updated automatically if some columns are editable.
    // Set this property to true if you want to add some editable columns after initialization
    editable: false,

    // Drag&Drop
    dnd: false,

    // Selection configuration.
    // By default it is enable.
    selection: {
      enable: true,
      checkbox: true,
      multi: false
    },

    // Display view
    // By default, table header is visible, footer is not.
    view: {
      thead: true,
      tfoot: false
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
  _.forEach(['onInitialized', 'onUpdated', 'onRendered', 'onDataSpliced', 'onDataChanged', 'onDataUpdated', 'onColumnsSpliced', 'onColumnsUpdated', 'onSelectionChanged', 'onSorted'], function(name) {
    Constructor.options.events[name] = null;
  });

  return Constructor;

})();
