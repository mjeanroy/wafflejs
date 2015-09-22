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

/* global waffleOptions */
/* global _ */
/* global Backbone */

(function(Backbone) {

  'use strict';

  var url = '/people';

  var Person = Backbone.Model.extend({
    urlRoot: url,
    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.apply(this, arguments);

      json.name = function() {
        var firstName = this.firstName || '';
        var lastName = this.lastName || '';
        return !firstName && !lastName ? '' : firstName + ' ' + lastName.toUpperCase();
      };

      return json;
    }
  });

  var People = Backbone.Collection.extend({
    url: url,
    model: Person,
    destroy: function() {
      var onDone = function() {
        this.reset([]);
      };

      Backbone.$.ajax({method: 'DELETE', url: url})
        .done(_.bind(onDone, this));
    }
  });

  var App = Backbone.View.extend({
    el: '#container',
    initialize: function() {
      // Initialize collection.
      this.collection = new People();

      // Create grid.
      this.waffle = new Backbone.WaffleView({
        el: this.$('table'),
        collection: this.collection,
        waffle: waffleOptions
      });

      // Fetch people.
      this.collection.fetch();
    },

    events: {
      'keyup #input-filter': 'onFilter',
      'click #clear-filter': 'clearFilter',
      'click #add': 'onAdd',
      'click #remove': 'onRemove',
      'click #clear': 'onClear'
    },

    onFilter: function(e) {
      var val = Backbone.$(e.currentTarget).val();
      this.waffle.filter({
        'name()': val || undefined
      });
    },

    clearFilter: function() {
      this.waffle.removeFilter();
    },

    onAdd: function() {
      this.collection.create({});
    },

    onRemove: function() {
      this.collection.last().destroy();
    },

    onClear: function() {
      this.collection.destroy();
    }
  });

  var init = function() {
    return new App();
  };

  init();

})(Backbone);
