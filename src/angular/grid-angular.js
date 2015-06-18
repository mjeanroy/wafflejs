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

/* global waffleModule */
/* global Grid */
/* global _ */

waffleModule.directive('waffle', ['$parse', '$rootScope', function($parse, $rootScope) {
  return {
    restrict: 'AE',
    replace: false,
    require: '?ngModel',
    template: '<table><thead></thead><tbody></tbody></table>',

    link: function(scope, element, attrs, ngModel) {
      var noop = _.noop;

      // Execute given function in a digest cycle.
      // If a digest cycle is already in progress, function
      // will be executed as a standard call (does not trigger
      // digest "aldready in progress" error).
      var $apply = function(fn) {
        var func = fn || noop;
        if ($rootScope.$$phase) {
          return func();
        } else {
          return scope.$apply(func);
        }
      };

      var table = element;
      if (table[0].tagName.toLowerCase() !== 'table') {
        table = table.children().eq(0);
      }

      // Wrap function in a digest cycle
      // This will preserve arguments and "this" context
      // of original function.
      var wrap = function(fn) {
        if (fn) {
          return function() {
            var args = arguments;
            var ctx = this;

            // Exec in a digest cycle
            var result = $apply(function() {
              return fn.apply(ctx, args);
            });

            // Free memory
            ctx = args = null;

            return result;
          };
        }
      };

      // Options can be defined in two ways
      // - Using waffle-options: one way binding, given option will never be updated
      // - Using waffle-grid: two way binding, grid attribute will be update with grid object
      var options = (function() {
        var attr = attrs.waffleOptions || attrs.waffleGrid;
        return $parse(attr)(scope) || {};
      })();

      // Initialize options using html attributes
      // With angular, html attributes can be set on scope, that's why we use scope.$eval
      _.forEach(_.keys(Grid.options), function(optName) {
        if (!options[optName] && attrs[optName]) {
          options[optName] = scope.$eval(attrs[optName]);
        }
      });

      // Create setter for two ways binding
      var setter = $parse(attrs.waffleGrid).assign || _.noop;

      // Map callbacks to dom attribute
      var events = options.events = options.events || {};

      _.forEach(_.keys(Grid.options.events), function(f) {
        // Wrap original event callback
        var fn = events[f] = wrap(events[f]);

        // If an angular handler is defined, wrap event
        // callback to execute handler.
        if (attrs[f]) {
          events[f] = wrap(function(evt) {
            // Execute original event callback.
            if (fn) {
              fn.call(this, evt);
            }

            // Evaluate handler, and provide $event as local
            // scope value.
            scope.$eval(attrs[f], {
              $event: evt
            });
          });
        }
      });

      // Create grid object
      var grid = Grid.create(table, options);

      // Implement two-ways binding and set it to grid attribute
      setter(scope, grid);

      // When data is spliced, we need to launch a new digest phase if needed
      grid.addEventListener('updated', _.debounce(function() {
        $apply();
      }, 200));

      // If ngModel is specified, then it should be binded to the
      // current selection. If grid is not selectable, then
      // this attribute is useless.
      if (grid.isSelectable()) {
        grid.addEventListener('selectionchanged', function(event) {
          $apply(function() {
            if (ngModel) {
              ngModel.$setViewValue(event.details.selection);
            }
          });
        });

        if (ngModel) {
          // Update selection when ngModel value is updated from outside
          ngModel.$formatters.push(function(value) {
            grid.selection().reset(value);
            return value;
          });

          // Override: ngModel is empty means that selection is not defined
          // or is an empty array
          ngModel.$isEmpty = function(value) {
            return !value || !value.length;
          };
        }
      }

      // Destroy grid when scope is destroyed
      scope.$on('$destroy', function() {
        grid.destroy();
        grid = options = setter = table = null;
      });
    }
  };
}]);
