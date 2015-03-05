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

describe('waffle-jquery', function() {

  var table;
  var fixtures;

  beforeEach(function() {
    table = document.createElement('table');
    table.setAttribute('id', 'waffle-table');

    fixtures = document.createElement('div');
    fixtures.appendChild(table);

    document.body.appendChild(fixtures);
  });

  afterEach(function() {
    fixtures.parentNode.removeChild(fixtures);
    fixtures = null;
    table = null;
  });

  it('should define waffle as a jquery plugin', function() {
    var $table = $('#waffle-table');
    expect($table.data('wafflejs')).toBeUndefined();

    var $result = $table.waffle();

    expect($result).toBe($table);
    expect($.data(table, 'wafflejs')).not.toBeUndefined();
    expect($.data(table, 'wafflejs')).toBeInstanceOf(Grid);
  });

  it('should instantiate grid with options', function() {
  	var data = [
      { id: 1, name: 'foo' },
      { id: 2, name: 'bar' }
    ];

    var columns = [
      { id: 'id' },
      { id: 'name' }
    ];

    var $table = $('#waffle-table').waffle({
      data: data,
      columns: columns
    });

    var grid = $.data(table, 'wafflejs');

    expect(grid.$data.length).toBe(data.length);
    expect(grid.$data).toVerify(function(current, idx) {
      return current.id === data[idx].id;
    });

    expect(grid.$columns.length).toBe(columns.length);
    expect(grid.$columns).toVerify(function(column, idx) {
      return column.id === columns[idx].id;
    });
  });

  describe('once initialized', function() {
    var $table;
    var grid;

    beforeEach(function() {
      $table = $('#waffle-table').waffle();
      grid = $table.data('wafflejs');
    });

    it('should have public functions of Grid', function() {
      var functions = [];
      for (var i in Grid.prototype) {
      	if (typeof Grid.prototype[i] === 'function' && i.charAt(0) !== '$') {
          functions.push(i);
          expect($table[i]).toBeAFunction();
        }
      }

      // Check that at least one public function is tested
      expect(functions).not.toBeEmpty();
    });

    it('should not instantiate Grid twice', function() {
      var $table2 = $('#waffle-table').waffle();
      var grid2 = $table2.data('wafflejs');
      expect(grid).toBe(grid2);
    });

    it('should define global renderer', function() {
      var renderer = jasmine.createSpy('foo').and.returnValue('foobar');
      $.fn.waffle.addRenderer('foo', renderer);
      expect($renderers.foo).toBe(renderer);
      delete $renderers.foo;
    });

    it('should define global comparator', function() {
      var comparator = jasmine.createSpy('foo').and.returnValue(1);
      $.fn.waffle.addComparator('foo', comparator);
      expect($comparators.foo).toBe(comparator);
      delete $comparators.foo;
    });
  });
});