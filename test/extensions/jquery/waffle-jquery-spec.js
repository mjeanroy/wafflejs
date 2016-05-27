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

describe('waffle-jquery', () => {

  let table;
  let css;

  beforeEach(() => {
    css = 'waffle-grid';

    table = document.createElement('table');
    table.setAttribute('id', 'waffle-table');
    table.className = css;
    fixtures.appendChild(table);
  });

  afterEach(() => table = null);

  it('should define waffle as a jquery plugin', () => {
    const $table = $('#waffle-table');
    expect($table.data('wafflejs')).toBeUndefined();

    const $result = $table.waffle();

    expect($result).toBe($table);
    expect($.data(table, 'wafflejs')).not.toBeUndefined();
    expect($.data(table, 'wafflejs')).toBeInstanceOf(Grid);
  });

  it('should create grid with jquery element', () => {
    const $table = $('#waffle-table');

    const grid = Waffle.create($table, {
      key: 'id',
      columns: [
        { id: 'name' }
      ]
    });

    expect(grid).toBeDefined();
    expect(grid.$table[0]).toBe($table[0]);
  });

  it('should have default options', () => {
    expect($.fn.waffle.options).toBe(Grid.options);
  });

  it('should instantiate grid with options', () => {
  	const data = [
      { id: 1, name: 'foo' },
      { id: 2, name: 'bar' }
    ];

    const columns = [
      { id: 'id' },
      { id: 'name' }
    ];

    const $table = $('#waffle-table').waffle({
      data: data,
      columns: columns
    });

    const grid = $.data(table, 'wafflejs');

    expect(grid.$data.length).toBe(data.length);
    expect(grid.$data).toVerify((current, idx) => current.id === data[idx].id);

    expect(grid.$columns.length).toBe(columns.length);
    expect(grid.$columns).toVerify((column, idx) => column.id === columns[idx].id);
  });

  describe('once initialized', () => {
    let $table;
    let $grid;

    beforeEach(() => {
      $table = $('#waffle-table').waffle();
      $grid = $table.data('wafflejs');

      jasmine.spyEach(Grid.prototype);
    });

    it('should have public functions of Grid', () => {
      const functions = [];
      for (const i in Grid.prototype) {
      	if (typeof Grid.prototype[i] === 'function' && i.charAt(0) !== '$') {
          functions.push(i);
          expect($.fn.waffle[i]).toBeAFunction();
        }
      }

      // Check that at least one public function is tested
      expect(functions).not.toBeEmpty();
    });

    it('should render grid and chain result', () => {
      const $result = $table.waffle('renderBody');
      expect(Grid.prototype.renderBody).toHaveBeenCalledOnce();
      expect($result).toBe($table);
    });

    it('should get grid data', () => {
      const $result = $table.waffle('data');
      expect(Grid.prototype.data).toHaveBeenCalledOnce();
      expect($result).toEqual($grid.data());
    });

    it('should not instantiate Grid twice', () => {
      const $table2 = $('#waffle-table').waffle();
      const grid2 = $table2.data('wafflejs');
      expect($grid).toBe(grid2);
    });

    it('should define global renderer', () => {
      const renderer = jasmine.createSpy('foo').and.returnValue('foobar');
      $.fn.waffle.addRenderer('foo', renderer);
      expect($renderers.foo).toBe(renderer);
      delete $renderers.foo;
    });

    it('should define global comparator', () => {
      const comparator = jasmine.createSpy('foo').and.returnValue(1);
      $.fn.waffle.addComparator('foo', comparator);
      expect($comparators.foo).toBe(comparator);
      delete $comparators.foo;
    });

    it('should call waffle methods using static methods', () => {
      const $result = $.fn.waffle.renderBody($table);
      expect(Grid.prototype.renderBody).toHaveBeenCalledOnce();
      expect($result).toBe($table);
    });

    it('should destroy grid when node is removed', () => {
      expect(Grid.prototype.destroy).not.toHaveBeenCalled();

      $table.remove();

      expect(Grid.prototype.destroy).toHaveBeenCalled();
      expect($table.data('wafflejs')).toBeUndefined();
    });
  });

  describe('with several matcher', () => {
    let table2;
    let $tables;

    let $grid1;
    let $grid2;

    beforeEach(() => {
      table2 = document.createElement('table');
      table2.className = css;

      fixtures.appendChild(table2);

      $tables = $('.' + css).waffle();
      $grid1 = $tables.eq(0).data('wafflejs');
      $grid2 = $tables.eq(1).data('wafflejs');

      jasmine.spyEach(Grid.prototype);
    });

    it('should have public functions of Grid', () => {
      const functions = [];
      for (const i in Grid.prototype) {
        if (typeof Grid.prototype[i] === 'function' && i.charAt(0) !== '$') {
          functions.push(i);
          expect($.fn.waffle[i]).toBeAFunction();
        }
      }

      // Check that at least one public function is tested
      expect(functions).not.toBeEmpty();
    });

    it('should render grid and chain result', () => {
      Grid.prototype.renderBody.calls.reset();

      const $result = $tables.waffle('renderBody');

      expect($grid1.renderBody).toHaveBeenCalled();
      expect($grid2.renderBody).toHaveBeenCalled();
      expect(Grid.prototype.renderBody.calls.count()).toBe(2);

      expect($result).toBe($tables);
    });

    it('should get grid data', () => {
      Grid.prototype.renderBody.calls.reset();

      const $result = $tables.waffle('data');

      expect(Grid.prototype.data).toHaveBeenCalled();
      expect(Grid.prototype.data.calls.count()).toBe(2);

      expect($result).not.toBe($tables);
      expect($result.length).toBe(2);
      expect($result[0]).toEqual($grid1.data());
      expect($result[1]).toEqual($grid2.data());
    });

    it('should destroy both grid when nodes are removed', () => {
      expect(Grid.prototype.destroy).not.toHaveBeenCalled();

      $tables.remove();

      expect(Grid.prototype.destroy).toHaveBeenCalled();
      expect(Grid.prototype.destroy.calls.count()).toBe(2);
      expect($tables.eq(0).data('wafflejs')).toBeUndefined();
      expect($tables.eq(1).data('wafflejs')).toBeUndefined();
    });
  });
});
