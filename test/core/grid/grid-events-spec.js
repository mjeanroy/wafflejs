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

describe('Grid Events', () => {

  it('should event listener', () => {
    const table = document.createElement('table');
    const event = 'initialized';
    const listener = jasmine.createSpy('onInitialized');

    const grid = new Grid(table, {
    });

    const result = grid.addEventListener(event, listener);

    expect(result).toBe(grid);
    expect(grid.$bus.$events).toEqual({
      'initialized': [listener]
    });
  });

  it('should remove event listener', () => {
    const table = document.createElement('table');
    const event = 'initialized';
    const listener = jasmine.createSpy('onInitialized');

    const grid = new Grid(table, {
    });

    grid.addEventListener(event, listener);
    expect(grid.$bus.$events).toEqual({
      'initialized': [listener]
    });

    const result = grid.removeEventListener(event, listener);

    expect(result).toBe(grid);
    expect(grid.$bus.$events).toEqual({
      'initialized': []
    });
  });

  it('should call onInitialized after initialization', () => {
    const table = document.createElement('table');
    const onInitialized = jasmine.createSpy('onInitialized');

    const grid = new Grid(table, {
      events: {
        onInitialized: onInitialized
      },
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    expect(onInitialized).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should dispatch "updated" event when grid is updated', () => {
    const table = document.createElement('table');
    const grid = new Grid(table, {
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    spyOn(grid.$bus, 'dispatchEvent').and.callThrough();

    grid.dispatchEvent('initialized');

    expect(grid.$bus.dispatchEvent).toHaveBeenCalledWith(grid, 'updated');
  });

  it('should call onRendered callbacks after body rendering', () => {
    const table = document.createElement('table');
    const onRendered = jasmine.createSpy('onRendered');

    const grid = new Grid(table, {
      events: {
        onRendered: onRendered
      },
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    expect(onRendered).toHaveBeenCalledWith(jasmine.any(Object));

    const evt = onRendered.calls.mostRecent().args[0];
    expect(evt.details.data).toEqual(grid.$data);
    expect(evt.details.removedNodes).toEqual([]);
  });

  it('should call onDataSpliced callback after data has been pushed', () => {
    const table = document.createElement('table');
    const onDataSpliced = jasmine.createSpy('onDataSpliced');

    const grid = new Grid(table, {
      events: {
        onDataSpliced: onDataSpliced
      },
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    const data = [
      { id: 1, name: 'foo' },
      { id: 2, name: 'bar' }
    ];

    expect(onDataSpliced).not.toHaveBeenCalled();

    grid.data().push(data[0], data[1]);
    jasmine.clock().tick();

    expect(onDataSpliced).toHaveBeenCalledWith(jasmine.any(Object));

    const evt = onDataSpliced.calls.mostRecent().args[0];
    expect(evt.details.added).toEqual([grid.$data[0], grid.$data[1]]);
    expect(evt.details.addedNodes).toEqual([grid.$tbody[0].childNodes[0], grid.$tbody[0].childNodes[1]]);
    expect(evt.details.index).toBe(0);
  });

  it('should call onDataSpliced callback after data has been removed', () => {
    const table = document.createElement('table');
    const onDataSpliced = jasmine.createSpy('onDataSpliced');

    const data = [
      { id: 1, name: 'foo' },
      { id: 2, name: 'bar' }
    ];

    const grid = new Grid(table, {
      events: {
        onDataSpliced: onDataSpliced
      },
      data: data,
      columns: [
        { id: 'bar' },
        { id: 'foo' }
      ]
    });

    expect(onDataSpliced).not.toHaveBeenCalled();

    const nodes = [].slice.call(grid.$tbody[0].childNodes);
    grid.data().pop();
    jasmine.clock().tick();

    expect(onDataSpliced).toHaveBeenCalledWith(jasmine.any(Object));

    const evt = onDataSpliced.calls.mostRecent().args[0];
    expect(evt.details.removed).toEqual([data[1]]);
    expect(evt.details.removedNodes).toEqual([nodes[1]]);
    expect(evt.details.index).toBe(1);
  });

  it('should call onSorted callback when grid is sorted', () => {
    const table = document.createElement('table');
    const onSorted = jasmine.createSpy('sorted');
    const grid = new Grid(table, {
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
    expect(onSorted).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should call onSelectionChanged callback when selection is updated', () => {
    const table = document.createElement('table');
    const onSelectionChanged = jasmine.createSpy('onSelectionChanged');
    const grid = new Grid(table, {
      events: {
        onSelectionChanged: onSelectionChanged
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

    expect(onSelectionChanged).not.toHaveBeenCalled();

    grid.$selection.push(grid.$data[0]);
    jasmine.clock().tick();

    expect(onSelectionChanged).toHaveBeenCalledWith(jasmine.any(Object));

    const evt = onSelectionChanged.calls.mostRecent().args[0];
    expect(evt.details.selection).toEqual(grid.$selection.toArray());
  });
});
