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

describe('Grid Events', function() {

  it('should call onInitialized after initialization', function() {
    var table = document.createElement('table');
    var onInitialized = jasmine.createSpy('onInitialized');

    var grid = new Grid(table, {
      events: {
        onInitialized: onInitialized
      },
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    expect(onInitialized).toHaveBeenCalledWith();
  });

  it('should call onRendered callbacks after body rendering', function() {
    var table = document.createElement('table');
    var onRendered = jasmine.createSpy('onRendered');

    var grid = new Grid(table, {
      events: {
        onRendered: onRendered
      },
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    expect(onRendered).toHaveBeenCalledWith(grid.$data, []);
  });

  it('should call onAdded callback after data has been pushed', function() {
    var table = document.createElement('table');
    var onAdded = jasmine.createSpy('onAdded');

    var grid = new Grid(table, {
      events: {
        onAdded: onAdded
      },
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    var data = [
      { id: 1, name: 'foo' },
      { id: 2, name: 'bar' }
    ];

    expect(onAdded).not.toHaveBeenCalled();

    grid.data().push(data[0], data[1]);
    jasmine.clock().tick();

    expect(onAdded).toHaveBeenCalledWith(
        [grid.$data[0], grid.$data[1]],
        [grid.$tbody[0].childNodes[0], grid.$tbody[0].childNodes[1]],
        0
    );
  });

  it('should call onRemoved callback after data has been removed', function() {
    var table = document.createElement('table');
    var onRemoved = jasmine.createSpy('onRemoved');

    var data = [
      { id: 1, name: 'foo' },
      { id: 2, name: 'bar' }
    ];

    var grid = new Grid(table, {
      events: {
        onRemoved: onRemoved
      },
      data: data,
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    expect(onRemoved).not.toHaveBeenCalled();

    var nodes = [].slice.call(grid.$tbody[0].childNodes);
    grid.data().pop();
    jasmine.clock().tick();

    expect(onRemoved).toHaveBeenCalledWith(
        [data[1]],
        [nodes[1]],
        1
    );
  });

  it('should call onSorted callback when grid is sorted', function() {
    var table = document.createElement('table');
    var onSorted = jasmine.createSpy('onSorted');
    var grid = new Grid(table, {
      events: {
        onSorted: onSorted
      },
      data: [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' }
      ],
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    expect(onSorted).not.toHaveBeenCalled();
    grid.sortBy('id');
    expect(onSorted).toHaveBeenCalledWith();
  });
});
