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

describe('GridComparator', () => {

  let grid;

  beforeEach(() => {
    const columns = [
      { id: 'id', sortable: false },
      { id: 'firstName' },
      { id: 'lastName' }
    ];

    const data = [
      { id: 1, firstName: 'foo1', lastName: 'bar1' },
      { id: 2, firstName: 'foo2', lastName: 'bar2' },
      { id: 3, firstName: 'foo2', lastName: 'bar3' }
    ];

    grid = new Grid({
      data: data,
      columns: columns,
      key: o => o.id
    });
  });

  describe('Comparators', () => {
    it('create single comparator in ascendant order', () => {
      const flag = '+';
      const field = 'firstName';
      const sortBy = flag + field;

      const comparators = GridComparator.of(grid, sortBy);

      expect(comparators).toBeDefined();
      expect(comparators.length).toBe(1);

      const comparator = comparators[0];
      expect(comparator.id).toBe(field);
      expect(comparator.parser).toBeDefined();
      expect(comparator.parser).toBe(grid.$columns[1].$parser);
      expect(comparator.asc).toBeTrue();
    });

    it('create single comparator in descendant order', () => {
      const flag = '-';
      const field = 'firstName';
      const sortBy = flag + field;

      const comparators = GridComparator.of(grid, sortBy);

      expect(comparators).toBeDefined();
      expect(comparators.length).toBe(1);

      const comparator = comparators[0];
      expect(comparator.id).toBe(field);
      expect(comparator.parser).toBeDefined();
      expect(comparator.parser).toBe(grid.$columns[1].$parser);
      expect(comparator.asc).toBeFalse();
    });

    it('create sorter comparator in descendant order', () => {
      const sorter = (o1, o2) => o1.id - o2.id;
      const comparators = GridComparator.of(grid, sorter);

      expect(comparators).toBeDefined();
      expect(comparators.length).toBe(1);

      const comparator = comparators[0];
      expect(comparator).toBeInstanceOf(SorterComparator);
    });

    it('create sortBy comparator in descendant order', () => {
      const sortByFunction = o => o.id;

      const comparators = GridComparator.of(grid, sortByFunction);

      expect(comparators).toBeDefined();
      expect(comparators.length).toBe(1);

      const comparator = comparators[0];
      expect(comparator).toBeInstanceOf(SortByComparator);
    });

    it('create fail if comparator cannot be created', () => {
      const comp = true;

      const create = () => {
        GridComparator.of(grid, comp);
      };

      expect(create).toThrow('Cannot create comparator from object: true');
    });

    it('create array of comparators', () => {
      const f1 = 'firstName';
      const f2 = 'lastName';
      const sortBy = ['+' + f1, '-' + f2];

      const comparators = GridComparator.of(grid, sortBy);

      expect(comparators).toBeDefined();
      expect(comparators.length).toBe(2);

      const c1 = comparators[0];
      expect(c1.id).toBe(f1);
      expect(c1.parser).toBeDefined();
      expect(c1.parser).toBe(grid.$columns[1].$parser);
      expect(c1.asc).toBeTrue();

      const c2 = comparators[1];
      expect(c2.id).toBe(f2);
      expect(c2.parser).toBeDefined();
      expect(c2.parser).toBe(grid.$columns[2].$parser);
      expect(c2.asc).toBeFalse();
    });
  });

  describe('Comparison Function', () => {
    it('should compare two objects using single comparator', () => {
      const comparator = FieldComparator.of(grid, '+name');
      grid.$comparators = [comparator];

      const o1 = { id: 1, name: 'foo' };
      const o2 = { id: 2, name: 'bar' };
      const o3 = { id: 3, name: 'bar' };
      const o4 = { id: 1, name: 'foo' };

      const compareFn = GridComparator.createComparator(grid);

      // o1 === o1 => should return zero
      expect(compareFn(o1, o1)).toBeZero();

      // foo > bar => should return positive value
      expect(compareFn(o1, o2)).toBePositive();

      // bar < foo => should return negative value
      expect(compareFn(o2, o1)).toBeNegative();
    });

    it('should compare two objects using array of comparators', () => {
      const comparators = [
        FieldComparator.of(grid, '+name'),
        FieldComparator.of(grid, '-idx')
      ];

      grid.$comparators = comparators;

      const o1 = { id: 1, name: 'foo', idx: 1 };
      const o2 = { id: 2, name: 'bar', idx: 2 };
      const o3 = { id: 3, name: 'bar', idx: 3 };
      const o4 = { id: 4, name: 'foo', idx: 1 };

      spyOn(grid.$data, 'indexOf').and.callFake(o => o.id);

      const compareFn = GridComparator.createComparator(grid);

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

  it('should check if comparators are equals', () => {
    const c1 = FieldComparator.of(grid, '+name');
    const c2 = FieldComparator.of(grid, '+idx');

    spyOn(c1, 'equals').and.callThrough();
    spyOn(c2, 'equals').and.callThrough();

    const comparators1 = [c1, c2];
    const comparators2 = [c2, c1];
    const comparators3 = [c2, c1, c2];

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
