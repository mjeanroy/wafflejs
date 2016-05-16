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
/* global Waffle */
/* global _ */
/* global NgCompilator */

waffleModule.directive('waffle', ['$parse', '$rootScope', '$interpolate', function($parse, $rootScope, $interpolate) {
  return {
    restrict: 'AE',
    replace: false,
    require: '?ngModel',
    templateUrl: 'views/waffle.html',

    link: (scope, element, attrs, ngModel) => {
      let unwatchers = [];
      const noop = _.noop;

      // Execute given function in a digest cycle.
      // If a digest cycle is already in progress, function
      // will be executed as a standard call (does not trigger
      // digest "aldready in progress" error).
      const $apply = fn => {
        const func = fn || noop;
        if ($rootScope.$$phase) {
          return func();
        } else {
          return scope.$apply(func);
        }
      };

      // Debounced apply
      // Should be used to not trigger too many digest cycle
      const $applyDebounced = _.debounce($apply, 200);

      let table = element;
      if (table[0].tagName.toLowerCase() !== 'table') {
        table = table.children().eq(0);
      }

      // Wrap function in a digest cycle
      // This will preserve arguments and "this" context
      // of original function.
      const wrap = fn => {
        if (fn) {
          return function() {
            let args = arguments;
            let ctx = this;

            // Exec in a digest cycle
            const result = $apply(() => fn.apply(ctx, args));

            // Free memory
            ctx = args = null;

            return result;
          };
        }
      };

      // Options can be defined in two ways
      // - Using waffle-options: one way binding, given option will never be updated
      // - Using waffle-grid: two way binding, grid attribute will be update with grid object
      let options = (() => {
        const attr = attrs.waffleOptions || attrs.waffleGrid;
        return $parse(attr)(scope) || {};
      })();

      // Initialize options using html attributes
      // With angular, html attributes can be set on scope, that's why we use scope.$eval
      _.forEach(_.keys(Grid.options), optName => {
        if (!options[optName] && attrs[optName]) {
          options[optName] = scope.$eval(attrs[optName]);
        }
      });

      // Map callbacks to dom attribute
      const events = options.events = options.events || {};

      _.forEach(_.keys(Grid.options.events), f => {
        // Wrap original event callback
        const fn = events[f] = wrap(events[f]);

        // If an angular handler is defined, wrap event
        // callback to execute handler.
        if (attrs[f]) {
          events[f] = wrap(evt => {
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

      // Check if we should compile each row
      const ngCompile = attrs.ngCompile || attrs.waffleNgCompile;
      const useCompile = ngCompile && !!scope.$eval(ngCompile);
      if (useCompile) {
        options.ng = {
          $scope: scope
        };
      }

      // Create grid object
      let grid = Waffle.create(table, options);

      // If grid use ng-compilation, then we should destroy scopes when rows
      // are removed.
      // Rows may be removed when:
      // - Grid is fully re-rendered: rows are entirely replaced by new ones.
      // - When data collection is spliced: some rows may have been removed.
      // - When grid is filtered: rows are removed because data does not match
      //   filter.
      // - When column collection is spliced: if new cell are added, then scope
      //   must be updated because dom representation has changed.
      if (useCompile) {
        _.forEach(['rendered', 'dataspliced', 'filterupdated'], evtName => {
          grid.addEventListener(evtName, e => {
            _.forEach(e.details.removedNodes, node => NgCompilator.destroy(node));
          });
        });

        grid.addEventListener('columnsspliced', () => {
          _.forEach(grid.$tbody[0].childNodes, node =>  NgCompilator.refresh(node));
        });
      }

      // Implement two-ways binding and set it to grid attribute
      let setter = $parse(attrs.waffleGrid).assign || _.noop;
      setter(scope, grid);

      // When something happen, we need to launch a new digest phase if needed.
      grid.addEventListener('updated', $applyDebounced);

      // If ngModel is specified, then it should be binded to the
      // current selection. If grid is not selectable, then
      // this attribute is useless.
      if (grid.isSelectable()) {
        grid.addEventListener('selectionchanged', event => {
          $apply(() => {
            if (ngModel) {
              ngModel.$setViewValue(event.details.selection);
            }
          });
        });

        if (ngModel) {
          // Update selection when ngModel value is updated from outside
          ngModel.$formatters.push(value => {
            grid.selection().reset(value);
            return value;
          });

          // Override: ngModel is empty means that selection is not defined
          // or is an empty array
          ngModel.$isEmpty = value => !value || !value.length;
        }
      }

      // Watch filter if it specified.
      const filterAttr = _.find(['waffleFilter', 'filter'], attrName => _.has(attrs, attrName));

      if (filterAttr) {
        // Check if attribute must be interpolated.
        // If attribute is not an interpolated attribute, then interpolate function will return undefined,
        // in this case, attribute will be read using $parse service.
        const evalFn = $interpolate(element.attr(attrs.$attr[filterAttr]), true) || $parse(attrs[filterAttr]);

        const updateFilter = newValue => grid.filter(newValue);
        const readFilterValue = () => evalFn(scope);

        unwatchers.push(scope.$watchCollection(readFilterValue, updateFilter));
      }

      // Destroy grid when scope is destroyed
      scope.$on('$destroy', () => {
        // Unwatch everything
        _.forEach(unwatchers, unwatcher => unwatcher());

        // Destroy child scopes
        if (useCompile) {
          NgCompilator.destroy(grid.rows());
        }

        // Destroy grid
        grid.destroy();

        // Free memory
        grid = options = setter = table = unwatchers = null;
      });
    }
  };
}]);
