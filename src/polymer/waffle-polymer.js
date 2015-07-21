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
/* global Polymer */
/* global Waffle */
/* exported PolymerBehavior */

var PolymerBehavior = {
  // Bindable properties
  properties: {
    options: {
      type: Object,
      notify: false
    }
  },

  // Ready callback
  ready: function() {
    // Get table element
    var $this = Polymer.dom(this);
    var table = $this.firstElementChild;

    // Create table if there is no content
    if (!table) {
      table = document.createElement('table');
      $this.appendChild(table);
    }

    // Initialize grid
    this.$grid = Waffle.create(table, this.options);

    // Bind Waffle events and trigger polymer events
    var eventListener = function(e) {
      this.fire(e.type, e.details);
    };

    var bindEvent = function(evtName) {
      this.$grid.addEventListener(evtName.slice(2).toLowerCase(), _.bind(eventListener, this));
    };

    Object.keys(Waffle.options.events).forEach(_.bind(bindEvent, this));

    // Then flush dom modification
    Polymer.dom.flush();
  },

  // Detached callback
  detached: function() {
    var grid = this.grid();
    if (grid) {
      grid.destroy();
    }
  },

  // -- Public api

  grid: function() {
    return this.$grid;
  }
};
