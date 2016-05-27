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

describe('SortByComparator', () => {

  let grid;
  let getterFunction;

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

    getterFunction = o => o.id;
  });

  it('should create comparator', () => {
    const comparator = SortByComparator.of(grid, getterFunction);
    expect(comparator.id).toBeDefined();
    expect(comparator.parser).toBe(getterFunction);
  });

  it('should be an instance of BasicComparator', () => {
    const comparator = SortByComparator.of(grid, getterFunction);
    expect(comparator).toBeInstanceOf(BasicComparator);
  });

  it('should return predicate', () => {
    const comparator = SortByComparator.of(grid, getterFunction);
    expect(comparator.predicate()).toBe(comparator.id);
  });

  it('should compare objects', () => {
    const comparator = SortByComparator.of(grid, getterFunction);

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 2};

    expect(comparator.compare(o1, o2)).toBeNegative();
    expect(comparator.compare(o2, o1)).toBePositive();
    expect(comparator.compare(o2, o3)).toBeZero();
  });

  it('should check if comparators are equals', () => {
    const c1 = SortByComparator.of(grid, getterFunction);
    const c2 = SortByComparator.of(grid, getterFunction);

    expect(c1.equals(c1)).toBeTrue();
    expect(c1.equals(c2)).toBeFalse();
    expect(c2.equals(c1)).toBeFalse();
  });
});
