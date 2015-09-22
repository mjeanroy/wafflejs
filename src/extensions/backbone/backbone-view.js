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

  var EVENTS = ['add', 'remove', 'reset', 'change'];
  var bindEvents = function(evt) {
    var fn = 'on' + $util.capitalize(evt);
    this.listenTo(this.collection, evt, this[fn]);
  };

  var Model = function(o) {
    _.extend(this, o.toJSON());
    this[KEY] = o.cid;
  };

  return Backbone.View.extend({
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
          model: Model,
          key: KEY
        });

        // Create grid.
        this.grid = Waffle.create(this.el, waffleOpts);
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
      _.forEach(EVENTS, bindEvents, this);
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
    }
  });
})();
