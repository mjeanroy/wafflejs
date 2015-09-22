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
/* global $comparators */
/* global BasicComparator */
/* exported SortByComparator */

var SortByComparator = (function() {
  var SortByComparator = function(grid, predicate) {
    this.id = _.uniqueId();
    this.parser = predicate;
  };

  var proto = SortByComparator.prototype = new BasicComparator();

  // Compare object.
  proto.compare = function(o1, o2) {
    if (o1 === o2) {
      return 0;
    }

    var f1 = this.parser(o1);
    var f2 = this.parser(o2);
    return $comparators.$auto(f1, f2);
  };

  // Create comparator.
  SortByComparator.of = function(grid, sortBy) {
    return sortBy instanceof SortByComparator ? sortBy : new SortByComparator(grid, sortBy);
  };

  return SortByComparator;
})();
