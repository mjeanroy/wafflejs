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

/* global _ */
/* global Backbone */
/* global $util */
/* global Waffle */
/* exported WaffleView */

// Just define $ variable
Backbone.WaffleView = (function() {
  var KEY = '_cid';

  var createBackboneEventHandler = function(fn) {
    return function() {
      var options = _.last(arguments);

      // Execute handler iif it is not triggered by waffle view.
      // Options is always the last argument.
      if (!options.waffle) {
        this[fn].apply(this, arguments);
      }

      return this;
    };
  };

  var BB_HANDLERS = {};
  var BB_EVENTS = ['add', 'remove', 'reset', 'change', 'sort'];
  var WAFFLE_EVENTS = ['datachanged', 'sorted'];

  _.forEach(BB_EVENTS, function(evt) {
    BB_HANDLERS[evt] = createBackboneEventHandler('on' + $util.capitalize(evt));
  });

  var bindBackboneEvents = function(evt) {
    this.listenTo(this.collection, evt, BB_HANDLERS[evt]);
  };

  var bindWaffleEvents = function(evt) {
    var callback = '_' + evt;
    var fn = this[callback];
    this.grid.addEventListener(evt, _.bind(fn, this));
  };

  var Model = function(o) {
    _.extend(this, o.toJSON());
    this[KEY] = o.cid;
  };

  var createComparatorFunction = function(comparator) {
    var sortFn = function(o1, o2) {
      var v1 = o1 instanceof Backbone.Model ? o1.toJSON() : o1;
      var v2 = o2 instanceof Backbone.Model ? o2.toJSON() : o2;
      return comparator(v1, v2);
    };

    // Store original comparison function.
    // This will be useful to avoid multiple sort with exactly the
    // same function.
    sortFn.$$sortFn = comparator;

    return sortFn;
  };

  var WaffleView = Backbone.View.extend({
    // Default tagName.
    tagName: 'table',

    // Constructor function.
    constructor: function(options) {
      Backbone.View.apply(this, arguments);
      this.initializeWaffle(options);
      this.setupListener();
    },

    // Initialize waffle.
    initializeWaffle: function(options) {
      // If grid is already created, do not override it.
      if (!this.grid) {
        // Create options.
        var opts = options || {};
        var waffleOpts = _.extend(opts.waffle || {}, {
          data: this.collection.models,
          sortBy: this.collection.comparator,
          model: Model,
          key: KEY
        });

        // Create grid.
        this.grid = Waffle.create(this.el, waffleOpts);
      }

      // Set comparator if it has been defined during construction.
      // Note that backbone listeners are not already available, so it
      // must be done explicitly.
      if (this.grid.$comparators.length > 0) {
        this._sorted();
      }

      return this;
    },

    // Default render implementation.
    render: function() {
      this.grid.render();
      return this;
    },

    // Remove view.
    // Grid must be destroyed.
    remove: function() {
      var retValue = Backbone.View.prototype.remove.apply(this, arguments);
      this.grid.destroy();
      return retValue;
    },

    // Apply view to a different DOM element.
    setElement: function() {
      var retValue = Backbone.View.prototype.setElement.apply(this, arguments);

      // Reattach grid to the new element.
      if (this.grid) {
        this.grid.attach(this.el);
      }

      return retValue;
    },

    // Bind backbone events to waffle updates.
    setupListener: function() {
      _.forEach(BB_EVENTS, bindBackboneEvents, this);
      _.forEach(WAFFLE_EVENTS, bindWaffleEvents, this);
      return this;
    },

    // A model has been added to the collection.
    onAdd: function(model, collection, options) {
      this.grid.data().add(model, options.index);
      return this;
    },

    // A model has been removed from the collection.
    onRemove: function(model) {
      this.grid.data().remove(model);
      return this;
    },

    // Collection's entire contents have been replaced.
    onReset: function(collection) {
      this.grid.data().reset(collection.models);
      return this;
    },

    // A model attribute has changed.
    onChange: function(model) {
      this.grid.data().replace(model);
      return this;
    },

    // Collection has been sorted.
    onSort: function(collection) {
      var comparator = collection.comparator;

      // Extract comparison function.
      var sortFn = _.isFunction(comparator) && _.isFunction(comparator.$$sortFn) ?
        comparator.$$sortFn : comparator;

      // Apply sort if it is needed.
      if (sortFn !== this.grid.$data.$$sortFn) {
        this.grid.sortBy(sortFn);
      }

      return this;
    },

    // Field has been edited.
    _datachanged: function(event) {
      var details = event.details;
      var cid = details.object[KEY];
      var model = this.collection.get(cid);

      // Do not forget to tag event as a waffle event.
      // This allow us to not update grid since it's already done.
      model.set(details.field, details.newValue, {
        waffle: true
      });

      return this;
    },

    // Columns has been sorted.
    _sorted: function() {
      this.collection.comparator = createComparatorFunction(this.grid.$data.$$sortFn);

      // Do not forget to tag event as a waffle event.
      // This allow us to not update grid since it's already done.
      this.collection.sort({
        waffle: true
      });

      return this;
    }
  });

  // Bind some waffle function.
  _.forEach(['filter', 'removeFilter', 'select', 'deselect', 'resize'], function(fn) {
    WaffleView.prototype[fn] = function() {
      var retValue = this.grid[fn].apply(this.grid, arguments);
      return retValue === this.grid ? this : retValue;
    };
  });

  return WaffleView;
})();
