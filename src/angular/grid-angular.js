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

waffleModule.directive('waffle', ['$parse', function($parse) {
  return {
    restrict: 'AE',
    replace: false,
    template: '<table><thead></thead><tbody></tbody></table>',

    link: function(scope, element, attrs) {
      var table = element;
      if (table[0].tagName.toLowerCase() !== 'table') {
        table = table.children().eq(0);
      }

      // Options can be defined in two ways
      // - Using waffle-options: one way binding, given option will never be updated
      // - Using waffle-grid: two way binding, grid attribute will be update with grid object
      var options = (function() {
        var attr = attrs.waffleOptions || attrs.waffleGrid;
        return $parse(attr)(scope) || {};
      })();

      // Create setter for two ways binding
      var setter = $parse(attrs.waffleGrid).assign || _.noop;

      // Create grid object
      var grid = Grid.create(table, options);

      // Implement two-ways binding and set it to grid attribute
      setter(scope, grid);

      // Destroy grid when scope is destroyed
      scope.$on('$destroy', function() {
        grid.destroy();
        grid = options = setter = table = null;
      });
    }
  };
}]);
