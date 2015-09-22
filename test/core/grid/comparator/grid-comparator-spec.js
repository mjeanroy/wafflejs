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

  describe('Comparators', function() {
    it('create single comparator in ascendant order', function() {
      var flag = '+';
      var field = 'firstName';
      var sortBy = flag + field;

      var comparators = GridComparator.of(grid, sortBy);

      expect(comparators).toBeDefined();
      expect(comparators.length).toBe(1);

      var comparator = comparators[0];
      expect(comparator.id).toBe(field);
      expect(comparator.parser).toBeDefined();
      expect(comparator.parser).toBe(grid.$columns[1].$parser);
      expect(comparator.asc).toBeTrue();
    });

    it('create single comparator in descendant order', function() {
      var flag = '-';
      var field = 'firstName';
      var sortBy = flag + field;

      var comparators = GridComparator.of(grid, sortBy);

      expect(comparators).toBeDefined();
      expect(comparators.length).toBe(1);

      var comparator = comparators[0];
      expect(comparator.id).toBe(field);
      expect(comparator.parser).toBeDefined();
      expect(comparator.parser).toBe(grid.$columns[1].$parser);
      expect(comparator.asc).toBeFalse();
    });

    it('create sorter comparator in descendant order', function() {
      var sorter = function(o1, o2) {
        return o1.id - o2.id;
      };

      var comparators = GridComparator.of(grid, sorter);

      expect(comparators).toBeDefined();
      expect(comparators.length).toBe(1);

      var comparator = comparators[0];
      expect(comparator).toBeInstanceOf(SorterComparator);
    });

    it('create sortBy comparator in descendant order', function() {
      var sortByFunction = function(o) {
        return o.id;
      };

      var comparators = GridComparator.of(grid, sortByFunction);

      expect(comparators).toBeDefined();
      expect(comparators.length).toBe(1);

      var comparator = comparators[0];
      expect(comparator).toBeInstanceOf(SortByComparator);
    });

    it('create fail if comparator cannot be created', function() {
      var comp = true;

      var create = function() {
        GridComparator.of(grid, comp);
      };

      expect(create).toThrow('Cannot create comparator from object: true');
    });

    it('create array of comparators', function() {
      var f1 = 'firstName';
      var f2 = 'lastName';
      var sortBy = ['+' + f1, '-' + f2];

      var comparators = GridComparator.of(grid, sortBy);

      expect(comparators).toBeDefined();
      expect(comparators.length).toBe(2);

      var c1 = comparators[0];
      expect(c1.id).toBe(f1);
      expect(c1.parser).toBeDefined();
      expect(c1.parser).toBe(grid.$columns[1].$parser);
      expect(c1.asc).toBeTrue();

      var c2 = comparators[1];
      expect(c2.id).toBe(f2);
      expect(c2.parser).toBeDefined();
      expect(c2.parser).toBe(grid.$columns[2].$parser);
      expect(c2.asc).toBeFalse();
    });
  });

  describe('Comparison Function', function() {
    it('should compare two objects using single comparator', function() {
      var comparator = FieldComparator.of(grid, '+name');
      grid.$comparators = [comparator];

      var o1 = { id: 1, name: 'foo' };
      var o2 = { id: 2, name: 'bar' };
      var o3 = { id: 3, name: 'bar' };
      var o4 = { id: 1, name: 'foo' };

      var compareFn = GridComparator.createComparator(grid);

      // o1 === o1 => should return zero
      expect(compareFn(o1, o1)).toBeZero();

      // foo > bar => should return positive value
      expect(compareFn(o1, o2)).toBePositive();

      // bar < foo => should return negative value
      expect(compareFn(o2, o1)).toBeNegative();
    });

    it('should compare two objects using array of comparators', function() {
      var comparators = [
        FieldComparator.of(grid, '+name'),
        FieldComparator.of(grid, '-idx')
      ];

      grid.$comparators = comparators;

      var o1 = { id: 1, name: 'foo', idx: 1 };
      var o2 = { id: 2, name: 'bar', idx: 2 };
      var o3 = { id: 3, name: 'bar', idx: 3 };
      var o4 = { id: 4, name: 'foo', idx: 1 };

      spyOn(grid.$data, 'indexOf').and.callFake(function(o) {
        return o.id;
      });

      var compareFn = GridComparator.createComparator(grid);

      // o1 === o1 => should return zero
      expect(compareFn(o1, o1)).toBeZero();
      expect(grid.$data.indexOf).not.toHaveBeenCalled();

      // foo > bar => should return positive value
      expect(compareFn(o1, o2)).toBePositive();
      expect(grid.$data.indexOf).not.toHaveBeenCalled();

      // bar < foo => should return negative value
      expect(compareFn(o2, o1)).toBeNegative();
      expect(grid.$data.indexOf).not.toHaveBeenCalled();

      // o2.name === o3.name && o2.id < o3.id => should return negative value because id is in descendant order
      expect(compareFn(o2, o3)).toBePositive();
      expect(grid.$data.indexOf).not.toHaveBeenCalled();

      // o1 !== o4 but o1.id === o4.id && o1.name === o4.name => should return stable sort
      expect(compareFn(o1, o4)).toBeNegative();
      expect(grid.$data.indexOf).toHaveBeenCalledWith(o1);
      expect(grid.$data.indexOf).toHaveBeenCalledWith(o4);
    });
  });

  it('should check if comparators are equals', function() {
    var c1 = FieldComparator.of(grid, '+name');
    var c2 = FieldComparator.of(grid, '+idx');

    spyOn(c1, 'equals').and.callThrough();
    spyOn(c2, 'equals').and.callThrough();

    var comparators1 = [c1, c2];
    var comparators2 = [c2, c1];
    var comparators3 = [c2, c1, c2];

    expect(GridComparator.equals(comparators1, comparators1)).toBeTrue();
    expect(c1.equals).not.toHaveBeenCalled();
    expect(c2.equals).not.toHaveBeenCalled();

    expect(GridComparator.equals(comparators1, comparators3)).toBeFalse();
    expect(c1.equals).not.toHaveBeenCalled();
    expect(c2.equals).not.toHaveBeenCalled();

    expect(GridComparator.equals(comparators1, comparators2)).toBeFalse();
    expect(c1.equals).toHaveBeenCalled();
    expect(c2.equals).not.toHaveBeenCalled();

    expect(GridComparator.equals(comparators1, comparators1.slice())).toBeTrue();
    expect(c1.equals).toHaveBeenCalled();
    expect(c2.equals).toHaveBeenCalled();
  });
});
