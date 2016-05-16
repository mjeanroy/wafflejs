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

/* global $parse */
/* global $comparators */
/* global CHAR_ORDER_ASC */
/* global CHAR_ORDER_DESC */
/* global BasicComparator */
/* exported FieldComparator */

class FieldComparator extends BasicComparator {
  constructor(grid, predicate) {
    super();

    const flag = predicate.charAt(0);
    const id = flag === CHAR_ORDER_ASC || flag === CHAR_ORDER_DESC ? predicate.slice(1) : predicate;
    const column = grid.$columns.byKey(id);

    this.id = id;
    this.asc = flag !== CHAR_ORDER_DESC;

    let parser;
    let comparator;
    if (column) {
      parser = column.$parser;
      comparator = column.$comparator;
    }

    this.parser = parser || $parse(id);
    this.comparator = comparator || $comparators.$auto;
  }

  compare(o1, o2) {
    if (o1 === o2) {
      return 0;
    }

    const f1 = this.parser(o1);
    const f2 = this.parser(o2);
    const result = this.comparator(f1, f2);
    return this.asc ? result : result * -1;
  }

  // Get predicate representation.
  predicate() {
    const prefix = this.asc ? CHAR_ORDER_ASC : CHAR_ORDER_DESC;
    return prefix + this.id;
  }

  // Check if both comparator are equals.
  equals(comparator) {
    return this.id === comparator.id &&
      this.asc === comparator.asc &&
      this.comparator === comparator.comparator;
  }
}

// Create comparator.
FieldComparator.of = (grid, sortBy) => sortBy instanceof FieldComparator ? sortBy : new FieldComparator(grid, sortBy);
