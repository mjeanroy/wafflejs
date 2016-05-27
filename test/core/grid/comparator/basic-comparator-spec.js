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

  it('should create basic comparator', () => {
    const column = grid.$columns[1];

    const c1 = new BasicComparator();
    c1.id = 'foo';

    const c2 = new BasicComparator();
    c2.id = 'bar';

    const c3 = new BasicComparator();
    c3.id = 'foo';

    expect(c1.predicate()).toBe('foo');
    expect(c2.predicate()).toBe('bar');
    expect(c3.predicate()).toBe('foo');

    expect(c1.equals(c2)).toBeFalse();
    expect(c1.equals(c3)).toBeTrue();
  });

  it('should throw error in compare function', () => {
    const c1 = new BasicComparator();
    c1.id = 'foo';

    const compare = () => {
      const o1 = {};
      const o2 = {};
      return c1.compare(o1, o2);
    };

    expect(compare).toThrow('Function compare must be implemented');
  });
});
