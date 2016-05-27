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

describe('Grid Observers', () => {

  let columns, data, table, grid;

  beforeEach(() => {
    columns = [
      { id: 'id', sortable: false },
      { id: 'firstName' },
      { id: 'lastName' }
    ];

    data = [
      { id: 2, firstName: 'foo2', lastName: 'bar2' },
      { id: 1, firstName: 'foo1', lastName: 'bar1' },
      { id: 3, firstName: 'foo2', lastName: 'bar3' }
    ];

    table = document.createElement('table');
    fixtures.appendChild(table);

    grid = new Grid(table, {
      data: data,
      columns: columns
    });
  });

  it('should observe data collection', () => {
    spyOn(GridDataObserver, 'on');

    const table = document.createElement('table');

    const grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    expect(grid.$data.$$observers).toEqual([{
      ctx: grid,
      callback: jasmine.any(Function)
    }]);

    const observer = grid.$data.$$observers[0];
    const changes = [];

    observer.callback.call(observer.ctx, changes);
    expect(GridDataObserver.on).toHaveBeenCalledWith(changes);
  });

  it('should observe selection collection', () => {
    spyOn(GridSelectionObserver, 'on');

    const table = document.createElement('table');

    const grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    expect(grid.$selection.$$observers).toEqual([{
      ctx: grid,
      callback: jasmine.any(Function)
    }]);

    const observer = grid.$selection.$$observers[0];
    const changes = [];
    observer.callback.call(observer.ctx, changes);
    expect(GridSelectionObserver.on).toHaveBeenCalledWith(changes);
  });
});
