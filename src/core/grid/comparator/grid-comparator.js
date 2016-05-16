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
/* global BasicComparator */
/* global FieldComparator */
/* global SorterComparator */
/* global SortByComparator */
/* exported GridComparator */

const GridComparator = (() => {
  const comparisonFunction = function(o1, o2) {
    if (o1 === o2 || (o1 == null && o2 == null)) {
      return 0;
    }

    const comparators = this.$comparators;

    for (let i = 0, size = comparators.length; i < size; ++i) {
      const current = comparators[i];
      const result = current.compare(o1, o2);

      // Return first result that is not zero
      if (result) {
        return result;
      }
    }

    // Each comparator return zero.
    // Provide a stable sort by using data index.
    const $data = this.$data;
    return $data.indexOf(o1) - $data.indexOf(o2);
  };

  const createComparator = (grid, comparator) => {
    if (comparator instanceof BasicComparator) {
      return comparator;
    }

    if (_.isString(comparator)) {
      return FieldComparator.of(grid, comparator);
    }

    if (_.isFunction(comparator)) {
      const nbArgs = comparator.length;
      return nbArgs <= 1 ?
        SortByComparator.of(grid, comparator) :
        SorterComparator.of(grid, comparator);
    }

    throw `Cannot create comparator from object: ${comparator}`;
  };

  return {
    // Create comparators.
    // Return value will always be an array.
    of: (grid, comparators) => {
      if (!_.isArray(comparators)) {
        comparators = [comparators];
      }

      return _.map(comparators, id => {
        const comparator = createComparator(grid, id);

        // Update column.
        // TODO find another way, it should not have side effect.
        const column = grid.$columns.byKey(comparator.id);
        if (column) {
          column.asc = comparator.asc;
        }

        return comparator;
      });
    },

    // Check if both comparators are equals.
    equals: (comparators1, comparators2) => {
      if (comparators1 === comparators2) {
        return true;
      }

      if (comparators1.length !== comparators2.length) {
        return false;
      }

      return _.every(comparators1, (c, idx) => c.equals(comparators2[idx]));
    },

    // Create comparison function for given grid.
    createComparator: grid => _.bind(comparisonFunction, grid)
  };
})();
