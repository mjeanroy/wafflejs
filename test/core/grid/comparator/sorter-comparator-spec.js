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

describe('SorterComparator', function() {

  var grid;
  var comparisonFunction;

  beforeEach(function() {
    var columns = [
      { id: 'id', sortable: false },
      { id: 'firstName' },
      { id: 'lastName' }
    ];

    var data = [
      { id: 1, firstName: 'foo1', lastName: 'bar1' },
      { id: 2, firstName: 'foo2', lastName: 'bar2' },
      { id: 3, firstName: 'foo2', lastName: 'bar3' }
    ];

    grid = new Grid({
      data: data,
      columns: columns,
      key: function(o) {
        return o.id;
      }
    });

    comparisonFunction = function(o1, o2) {
      return o1.id - o2.id;
    };
  });

  it('should create comparator', function() {
    var comparator = SorterComparator.of(grid, comparisonFunction);
    expect(comparator.id).toBeDefined();
    expect(comparator.comparator).toBe(comparisonFunction);
  });

  it('should be an instance of BasicComparator', function() {
    var comparator = SorterComparator.of(grid, comparisonFunction);
    expect(comparator).toBeInstanceOf(BasicComparator);
  });

  it('should return predicate', function() {
    var comparator = SorterComparator.of(grid, comparisonFunction);
    expect(comparator.predicate()).toBe(comparator.id);
  });

  it('should compare objects', function() {
    var comparator = SorterComparator.of(grid, comparisonFunction);

    var o1 = {id: 1};
    var o2 = {id: 2};
    var o3 = {id: 2};

    expect(comparator.compare(o1, o2)).toBeNegative();
    expect(comparator.compare(o2, o1)).toBePositive();
    expect(comparator.compare(o2, o3)).toBeZero();
  });

  it('should check if comparators are equals', function() {
    var c1 = SorterComparator.of(grid, comparisonFunction);
    var c2 = SorterComparator.of(grid, comparisonFunction);

    expect(c1.equals(c1)).toBeTrue();
    expect(c1.equals(c2)).toBeFalse();
    expect(c2.equals(c1)).toBeFalse();
  });
});
