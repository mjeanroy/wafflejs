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
/* global $filters */
/* global $util */
/* global EventBus */
/* global GridComparator */
/* global GridBuilder */
/* global GridResizer */
/* global GridDomBinders */
/* global GridDataObserver */
/* global GridColumnsObserver */
/* global GridSelectionObserver */
/* global GridFilter */
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

const Grid = (() => {

  // Save bytes
  const resultWith = $util.resultWith;

  class Grid {
    constructor(node, options) {
      // Grid may be attached to a dom node later.
      if (arguments.length === 0 || (!_.isElement(node) && !(node instanceof $))) {
        options = node;
        node = null;
      }

      // Initialize main table and default options
      const table = node ? $(node)[0] : null;
      const opts = this.options = options = options || {};
      const defaultOptions = Grid.options;

      // Try to initialize options with default values
      // - If option is already defined, use it (but initialize default values for nested object).
      // - If option is not defined, try to get html value.
      // - If option is still not defined, use default.
      _.forEach(_.keys(defaultOptions), optName => {
        const def = defaultOptions[optName];

        let opt = opts[optName];

        // Try to initialize from html
        // If options is already defined, do not try to parse html
        if (_.isUndefined(opt) && table) {
          const attrName = $util.toSpinalCase(optName);
          const htmlAttr = table.getAttribute('data-waffle-' + attrName) ||
            table.getAttribute('waffle-' + attrName) ||
            table.getAttribute('data-' + attrName) ||
            table.getAttribute(attrName);

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

      const isSortable = this.isSortable();
      const isDraggable = this.isDraggable();

      if (opts.columns && (!isSortable || isDraggable)) {
        // Force column not to be sortable
        _.forEach(opts.columns, column => {
          if (!isSortable) {
            column.sortable = false;
          }

          // Force column to be draggable if flag is not set.
          if (isDraggable) {
            column.draggable = column.draggable == null ? true : !!column.draggable;
          }
        });
      }

      // Initialize data
      this.$data = new Collection(opts.data, {
        key: opts.key,
        model: opts.model
      });

      // Initialize columns
      this.$columns = new Collection(opts.columns, {
        key: 'id',
        model: Column
      });

      // Initialize selection.
      this.$selection = new Collection([], this.$data.options());

      // Initialize comparators.
      this.$comparators = new Collection([], {
        key: function(o) {
          return o.id;
        }
      });

      // Create event bus.
      this.$bus = new EventBus();

      // Wrap callbacks to events
      _.forEach(_.keys(opts.events), name => {
        const fn = this.options.events[name];
        if (fn) {
          this.addEventListener(name.slice(2), this.options.events[name]);
        }
      });

      // Parse sortBy option.
      this.sortBy(options.sortBy, false);

      // Attach dom node if it was specified.
      if (table) {
        this.attach(table);
      }

      this.dispatchEvent('initialized');
    }

    // Attach table.
    // Note that once initialized, grid options should not be updated, so
    // updating attached table will not use html attributes.
    attach(table) {
      // First detach current dom node if it is already attached.
      if (this.$table) {
        this.detach();
      }

      const $table = this.$table = $(table);
      const isSortable = this.isSortable();
      const isDraggable = this.isDraggable();
      const isSelectable = this.isSelectable();
      const isEditable = this.isEditable();

      // Add appropriate css to table
      $table.addClass(this.cssClasses().join(' '));

      // Create main nodes
      const view = [TBODY];

      // Check if we should append table header
      if (this.hasHeader()) {
        view.unshift(THEAD);
      }

      // Check if we should append table footer
      if (this.hasFooter()) {
        view.push(TFOOT);
      }

      _.forEach(view, tagName => {
        // Get existing node or create it
        const varName = '$' + tagName;
        const $table = this.$table;

        // Get it...
        this[varName] = $($doc.byTagName(tagName, $table[0]));

        // ... or create it !
        if (!this[varName].length) {
          this[varName] = $($doc[tagName]());
        }

        // Just append at the end of the table
        $table.append(this[varName][0]);
      });

      // Observe collection to update grid accordingly
      this.$data.observe(GridDataObserver.on, this);
      this.$columns.observe(GridColumnsObserver.on, this);
      this.$selection.observe(GridSelectionObserver.on, this);

      // Initialize events dictionary.
      this.$$events = {};

      // Bind dom handlers only if needed.
      if (isSortable) {
        GridDomBinders.bindSort(this);
      }

      if (isEditable) {
        GridDomBinders.bindEdition(this);
      }

      if (isSelectable) {
        GridDomBinders.bindSelection(this);
      }

      // If height is specified, we need to set column size.
      // Bind resize event to resize grid automatically when window view is resized
      if (this.isResizable()) {
        this.resize();
        GridDomBinders.bindResize(this);
      }

      this.render();
      this.clearChanges();

      if (isDraggable) {
        GridDomBinders.bindDragDrop(this);
      }

      this.dispatchEvent('attached');

      return this;
    }

    // Detach table:
    // - Unbind dom events.
    // - Remove observers.
    // - Dispatch detach event.
    detach() {
      const $table = this.$table;
      if ($table) {
        // Remove waffle classes.
        $table.removeClass(this.cssClasses().join(' '));

        // Unbind dom events.
        GridDomBinders.unbindSort(this);
        GridDomBinders.unbindEdition(this);
        GridDomBinders.unbindSelection(this);
        GridDomBinders.unbindResize(this);
        GridDomBinders.unbindDragDrop(this);

        // Unobserve collections (since observers are only used to update
        // dom nodes).
        this.clearChanges();
        this.$data.unobserve(GridDataObserver.on, this);
        this.$columns.unobserve(GridColumnsObserver.on, this);
        this.$selection.unobserve(GridSelectionObserver.on, this);

        // Dispatch event.
        this.dispatchEvent('detached');

        // Dereference dom nodes.
        this.$table = this.$tbody = this.$thead = this.$tfoot = null;
      }

      return this;
    }

    cssClasses() {
      const classes = [CSS_GRID];

      if (this.isSelectable()) {
        classes.push(CSS_SELECTABLE);
      }

      if (this.isScrollable()) {
        classes.push(CSS_SCROLLABLE);
      }

      return classes;
    }

    // Get all rows.
    // An array is returned (not a NodeList).
    rows() {
      return _.toArray(this.$tbody[0].childNodes);
    }

    // Get data collection
    data() {
      return this.$data;
    }

    // Get columns collection
    columns() {
      return this.$columns;
    }

    // Get selection collection
    selection() {
      return this.$selection;
    }

    // Check if grid hasat least
    isEditable() {
      return this.options.editable || this.$columns.some(column => column.isEditable());
    }

    // Check if grid is sortable
    isSortable() {
      return this.options.sortable;
    }

    // Check if grid is selectable
    isSelectable(data) {
      const selection = this.options.selection;

      // We are sure it is disable
      if (!selection || !selection.enable) {
        return false;
      }

      return data ? resultWith(selection.enable, this, [data]) : true;
    }

    // Check if grid is resizable
    isResizable() {
      const size = this.options.size;
      return !!size.height || !!size.width;
    }

    // Check if grid is scrollable.
    isScrollable() {
      return this.options.scrollable;
    }

    // Check if grid render checkbox as first column
    hasCheckbox() {
      return this.isSelectable() && this.options.selection.checkbox;
    }

    // Check if grid has a table header
    hasHeader() {
      return this.options.view.thead;
    }

    // Check if grid has a table footer
    hasFooter() {
      return this.options.view.tfoot;
    }

    // Without parameter, check if grid is selected.
    // If first parameter is set, check if data is selected.
    isSelected(data) {
      if (!this.isSelectable()) {
        return false;
      }

      if (data) {
        return this.$selection.contains(data);
      }

      const selectionSize = this.$selection.length;
      if (selectionSize === 0) {
        return false;
      }

      let dataSize = this.$data.length;

      // If some data may not be selectable, then we should check size
      // against all selectable data.
      if (_.isFunction(this.options.selection.enable)) {
        dataSize = this.$data.filter(this.isSelectable, this).length;
      }

      return selectionSize >= dataSize;
    }

    // Check if grid columns should be draggable by default.
    isDraggable() {
      return !!this.options.dnd;
    }

    // Check if given is visible (not filtered).
    // If data is visible, then a row should exist.
    isVisible(current) {
      const ctx = this.$data.ctx(current);
      return ctx && ctx.visible !== false;
    }

    // Get only visible data.
    // An array will always be returned.
    visibleData() {
      const data = this.$data;
      const filter = this.$filter;
      return filter != null ? data.filter(this.isVisible, this) : data.toArray();
    }

    // Render entire grid
    render(async) {
      return this.renderHeader()
          .renderFooter()
          .renderBody(async)
          .clearChanges();
    }

    // Render entire header of grid
    renderHeader() {
      if (this.hasHeader()) {
        const tr = GridBuilder.theadRow(this);
        this.$thead.empty().append(tr);
      }
      return this;
    }

    // Render entire footer of grid
    renderFooter() {
      if (this.hasFooter()) {
        const tr = GridBuilder.tfootRow(this);
        this.$tfoot.empty().append(tr);
      }
      return this;
    }

    // Render entire body of grid
    // Each row is appended to a fragment in memory
    // This fragment will be appended once to tbody element to avoid unnecessary DOM access
    // If render is asynchronous, data will be split into chunks, each chunks will be appended
    // one by one using setTimeout to let the browser to be refreshed periodically.
    renderBody(async) {
      const asyncRender = async == null ? this.options.async : async;

      let oldNodes = this.rows();
      let grid = this;

      var empty = _.once(() => grid.$tbody.empty());

      var build = (data, startIdx) => {
        const fragment = GridBuilder.tbodyRows(grid, data, startIdx);
        empty();
        grid.$tbody.append(fragment);
      };

      var onEnded = () => {
        grid.$data.clearChanges();

        grid.dispatchEvent('rendered', {
          data: grid.data(),
          removedNodes: oldNodes,
          addedNodes: grid.rows()
        });

        // Free memory
        grid = empty = build = onEnded = oldNodes = null;
      };

      // If grid is filtered, then we must only render visible data.
      const dataToRender = this.$filter == null ? this.$data : this.visibleData();
      if (asyncRender) {
        $util.asyncTask($util.split(dataToRender, 200), 10, build, onEnded);
      } else {
        build(dataToRender, 0);
        onEnded();
      }

      return this;
    }

    // Resize grid with new values
    resize() {
      GridResizer.resize(this);
      return this;
    }

    // Select everything
    select() {
      if (this.$selection.length !== this.$data.length) {
        this.$selection.add(this.$data.filter(this.isSelectable, this));
      }

      return this;
    }

    // Deselect everything
    deselect() {
      if (!this.$selection.isEmpty()) {
        this.$selection.clear();
      }

      return this;
    }

    // Sort grid by fields
    // Second parameter is a parameter used internally to disable automatic rendering after sort
    sortBy(sortBy, $$render) {
      // Store new sort
      const comparators = sortBy != null ? GridComparator.of(this, sortBy) : [];

      // Check if sort predicate has changed
      // Compare array instance, or serialized array to string and compare string values (faster than array comparison)
      if (GridComparator.equals(this.$comparators, comparators)) {
        return this;
      }

      this.$comparators.reset(comparators);
      this.$data.sort(GridComparator.createComparator(this));

      if (this.$table) {
        const hasHeader = this.hasHeader();
        const hasFooter = this.hasFooter();

        const $headers = hasHeader ? this.$thead.children().eq(0).children() : null;
        const $footers = hasFooter ? this.$tfoot.children().eq(0).children() : null;

        const clearSort = $items => {
          $items.removeClass(CSS_SORTABLE_ASC + ' ' + CSS_SORTABLE_DESC)
                .removeAttr(DATA_WAFFLE_ORDER);
        };

        const addSort = ($items, index, asc) => {
          const flag = asc ? CHAR_ORDER_ASC : CHAR_ORDER_DESC;
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

        const $columns = this.$columns;
        const hasCheckbox = this.hasCheckbox();

        // Update DOM
        _.forEach(this.$comparators, comparator => {
          const columnId = comparator.id;
          const asc = comparator.asc;

          const index = $columns.indexOf(columnId);
          const thIndex = hasCheckbox ? index + 1 : index;

          if (index >= 0) {
            // Update order flag
            if ($headers) {
              addSort($headers, thIndex, asc);
            }
            if ($footers) {
              addSort($footers, thIndex, asc);
            }
          }
        });
      }

      if ($$render !== false) {
        // Body need to be rendered since data is now sorted
        this.renderBody();
      }

      return this.dispatchEvent('sorted');
    }

    // Filter data
    filter(predicate) {
      // Check if predicate is empty.
      // Note that an empty string should remove filter since everything will match.
      const isEmptyPredicate = predicate == null || predicate === '';
      const newPredicate = isEmptyPredicate ? undefined : predicate;

      const oldFilter = this.$filter;
      const oldPredicate = oldFilter ? oldFilter.$predicate : null;
      const isUpdated = oldPredicate == null || oldPredicate !== newPredicate;

      if (isUpdated) {
        // Store predicate...
        this.$filter = newPredicate == null ? undefined : $filters.$create(newPredicate);

        // ... and apply filter
        GridFilter.applyFilter.call(this, this.$filter);
      }

      // Chain
      return this;
    }

    // This is a shorthand for this.filter(null);
    removeFilter() {
      if (this.$filter != null) {
        this.filter(undefined);
      }

      return this;
    }

    // Trigger events listeners
    // First argument is the name of the event.
    // For lazy evaluation of arguments, second argument is a function that
    // should return event argument. This function will be called if and only if
    // event need to be triggered.
    // If lazy evaluation is needless, just put arguments next to event name.
    dispatchEvent(name, argFn) {
      this.$bus.dispatchEvent(this, name, argFn);

      // Trigger events when one of other event is triggered
      // This can be a way to add a single listener to all events
      this.$bus.dispatchEvent(this, 'updated');

      return this;
    }

    // Add new event listener.
    // Type of event is case insensitive.
    addEventListener(type, listener) {
      this.$bus.addEventListener(type, listener);
      return this;
    }

    // Remove existing event listener.
    // Type of event is case insensitive.
    removeEventListener(type, listener) {
      this.$bus.removeEventListener(type, listener);
      return this;
    }

    // Clear all pending changes.
    clearChanges() {
      this.$data.clearChanges();
      this.$columns.clearChanges();

      if (this.$selection) {
        this.$selection.clearChanges();
      }

      return this;
    }

    // Destroy datagrid
    destroy() {
      this.detach();
      this.$bus.clear();
      this.$$events = null;
      $util.destroy(this);
    }
  }

  // Create new grid
  Grid.create = (table, options) => new Grid(table, options);

  // Define default options.
  Grid.options = {
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
  var events = [
    'onInitialized',
    'onUpdated',
    'onRendered',
    'onDataSpliced',
    'onDataChanged',
    'onDataUpdated',
    'onColumnsSpliced',
    'onColumnsUpdated',
    'onSelectionChanged',
    'onFilterUpdated',
    'onSorted',
    'onAttached',
    'onDetached'
  ];

  _.forEach(events, name => {
    Grid.options.events[name] = null;
  });

  return Grid;

})();
