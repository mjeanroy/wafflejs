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

/* jshint eqnull: true */
/* global _ */
/* global FieldComparator */
/* exported GridComparator */

var GridComparator = (function() {
  var comparisonFunction = function(o1, o2) {
    if (o1 === o2 || (o1 == null && o2 == null)) {
      return 0;
    }

    var comparators = this.$comparators;

    for (var i = 0, size = comparators.length; i < size; ++i) {
      var current = comparators[i];
      var result = current.compare(o1, o2);

      // Return first result that is not zero
      if (result) {
        return result;
      }
    }

    // Each comparator return zero.
    // Provide a stable sort by using data index.
    var $data = this.$data;
    return $data.indexOf(o1) - $data.indexOf(o2);
  };

  return {
    // Create comparators.
    // Return value will always be an array.
    of: function(grid, comparators) {
      if (!_.isArray(comparators)) {
        comparators = [comparators];
      }

      return _.map(comparators, function(id) {
        var comparator = FieldComparator.of(grid, id);

        // Update column.
        // TODO find another way, it should not have side effect.
        var column = grid.$columns.byKey(comparator.id);
        if (column) {
          column.asc = comparator.asc;
        }

        return comparator;
      });
    },

    // Check if both comparators are equals.
    equals: function(comparators1, comparators2) {
      if (comparators1 === comparators2) {
        return true;
      }

      if (comparators1.length !== comparators2.length) {
        return false;
      }

      return _.every(comparators1, function(c, idx) {
        return c.equals(comparators2[idx]);
      });
    },

    // Create comparison function for given grid.
    createComparator: function(grid) {
      return _.bind(comparisonFunction, grid);
    }
  };
})();
