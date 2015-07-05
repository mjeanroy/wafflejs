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
/* exported Observable */

var Observable = (function() {
  var isNotEmpty = function(array) {
    return array && array.length > 0;
  };

  var asyncFn = function() {
    var changes = this.$$changes;
    var observers = this.$$observers;

    if (isNotEmpty(changes) && isNotEmpty(observers)) {
      // Current changes will be executed accross all observers
      // If other changes are added by observers during iteration, then they will
      // be executed asynchronously later
      // Remove changes to be executed and use them for each observers.
      var removed = changes.splice(0, changes.length);

      // Trigger changes for each observer
      _.forEach(observers, function(o) {
        o.callback.call(o.ctx, removed);
      });
    }
  };

  var o = {
    // Add new observer
    observe: function(callback, observer) {
      this.$$observers = this.$$observers || [];
      this.$$observers.push({
        ctx: observer || null,
        callback: callback
      });

      return this;
    },

    // Remove observer
    unobserve: function(callback, observer) {
      if (isNotEmpty(this.$$observers)) {
        if (arguments.length === 0) {
          // Unobserve everything
          this.$$observers = [];
        } else {
          var ctx = observer || null;
          this.$$observers = _.reject(this.$$observers, function(o) {
            return o.ctx === ctx && callback === o.callback;
          });
        }
      }

      return this;
    },

    // Trigger changes
    // Note that callbacks will be called asynchronously
    trigger: function(changes) {
      if (!_.isArray(changes)) {
        changes = [changes];
      }

      // Append new change
      this.$$changes = this.$$changes || [];
      this.$$changes.push.apply(this.$$changes, changes);

      // Trigger asynchronous task
      setTimeout(_.bind(asyncFn, this));

      return this;
    },

    // Get pending changes
    pendingChanges: function() {
      return this.$$changes || [];
    },

    // Clear pending changes
    clearChanges: function() {
      if (this.$$changes) {
        this.$$changes.splice(0, this.$$changes.length);
      }

      return this;
    }
  };

  return o;
})();