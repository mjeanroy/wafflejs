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

describe('GridComparator', function() {

  var grid;

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
  });

  it('should create comparator', function() {
    var column = grid.$columns[1];

    var comparator = FieldComparator.of(grid, '+firstName');
    expect(comparator.id).toBe('firstName');
    expect(comparator.asc).toBe(true);
    expect(comparator.parser).toBeDefined();
    expect(comparator.comparator).toBeDefined();
    expect(comparator.parser).toBe(column.$parser);
    expect(comparator.comparator).toBe(column.$comparator);
  });

  it('should create comparator in descendant order', function() {
    var column = grid.$columns[1];

    var comparator = FieldComparator.of(grid, '-firstName');
    expect(comparator.id).toBe('firstName');
    expect(comparator.asc).toBe(false);
    expect(comparator.parser).toBeDefined();
    expect(comparator.comparator).toBeDefined();
    expect(comparator.parser).toBe(column.$parser);
    expect(comparator.comparator).toBe(column.$comparator);
  });

  it('should create comparator in default order', function() {
    var column = grid.$columns[1];

    var comparator = FieldComparator.of(grid, 'firstName');
    expect(comparator.id).toBe('firstName');
    expect(comparator.asc).toBe(true);
    expect(comparator.parser).toBeDefined();
    expect(comparator.comparator).toBeDefined();
    expect(comparator.parser).toBe(column.$parser);
    expect(comparator.comparator).toBe(column.$comparator);
  });

  it('should create comparator twice', function() {
    var c1 = FieldComparator.of(grid, 'firstName');
    var c2 = FieldComparator.of(grid, c1);
    expect(c1).toBe(c2);
  });

  it('should compare objects', function() {
    var comparator = FieldComparator.of(grid, 'firstName');

    var o1 = {firstName: 'foo'};
    var o2 = {firstName: 'bar'};
    var o3 = {firstName: 'bar'};

    expect(comparator.compare(o1, o2)).toBePositive();
    expect(comparator.compare(o2, o1)).toBeNegative();
    expect(comparator.compare(o2, o3)).toBeZero();
  });

  it('should chcck if comparators are equals', function() {
    var c1 = FieldComparator.of(grid, 'firstName');
    var c2 = FieldComparator.of(grid, '+firstName');
    var c3 = FieldComparator.of(grid, '-firstName');

    expect(c1.equals(c2)).toBeTrue();
    expect(c2.equals(c1)).toBeTrue();
    expect(c1.equals(c3)).toBeFalse();

    c1.comparator = jasmine.createSpy('comparator');
    expect(c1.equals(c2)).toBeFalse();
  });
});
