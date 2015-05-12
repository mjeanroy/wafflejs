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

describe('Grid Observers', function() {

  var columns, data, table, grid;

  beforeEach(function() {
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

  it('should observe data collection', function() {
    var table = document.createElement('table');

    var grid = new Grid(table, {
      data: [],
      columns: [
        { id: 'foo', title: 'Foo' },
        { id: 'bar', title: 'Boo' }
      ]
    });

    expect(grid.$data.$$observers).toContain(jasmine.objectContaining({
      ctx: grid,
      callback: grid.$$onDataChange
    }));
  });

  it('should refresh grid when data array is reversed', function() {
    grid.data().reverse();
    jasmine.clock().tick();

    expect(grid.$tbody[0].childNodes).toVerify(function(tr, idx) {
      return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
    });
  });

  describe('observe', function() {
    var change;
    var changes;
    var newData;

    beforeEach(function() {
      spyOn(grid, '$$on_splice').and.callThrough();
    });

    describe('add', function() {

      beforeEach(function() {
        change = {
          type: 'splice',
          index: 3,
          addedCount: 1,
          removed: [],
          object: grid.$data
        };

        newData = {
          id: 4,
          firstName: 'foo4',
          lastName: 'bar4'
        };

        changes = [change];
      });

      it('should add row at the end with a splice change', function() {
        grid.$data[3] = newData;
        grid.$data.length = 4;
        change.index = 3;

        grid.$$onDataChange(changes);
        expect(grid.$$on_splice).toHaveBeenCalledWith(change);

        var trs = grid.$tbody[0].childNodes;
        expect(trs.length).toBe(4);
        expect(trs).toVerify(function(tr, idx) {
          return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
        });
      });

      it('should add row at the beginning with a splice change', function() {
        grid.$data[3] = grid.$data[2];
        grid.$data[2] = grid.$data[1];
        grid.$data[1] = grid.$data[0];
        grid.$data[0] = newData;
        grid.$data.length = 4;
        change.index = 0;

        grid.$$onDataChange(changes);

        expect(grid.$$on_splice).toHaveBeenCalledWith(change);

        var trs = grid.$tbody[0].childNodes;
        expect(trs.length).toBe(4);
        expect(trs).toVerify(function(tr, idx) {
          return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
        });
      });

      it('should add row at the middle with a splice change', function() {
        grid.$data[3] = grid.$data[2];
        grid.$data[2] = grid.$data[1];
        grid.$data[1] = newData;
        grid.$data.length = 4;
        change.index = 1;

        grid.$$onDataChange(changes);

        expect(grid.$$on_splice).toHaveBeenCalledWith(change);

        var trs = grid.$tbody[0].childNodes;
        expect(trs.length).toBe(4);
        expect(trs).toVerify(function(tr, idx) {
          return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
        });
      });
    });

    describe('remove', function() {
      beforeEach(function() {
        change = {
          type: 'splice',
          index: 0,
          addedCount: 0,
          removed: [],
          object: grid.$data
        };

        newData = {
          id: 4,
          firstName: 'foo4',
          lastName: 'bar4'
        };

        changes = [change];
      });

      it('should remove first row with a splice change', function() {
        change.index = 0;
        change.removed = [grid.$data[0]];

        grid.$data[0] = grid.$data[1];
        grid.$data[1] = grid.$data[2];

        delete grid.$data[2];
        grid.$data.length = 2;

        grid.$$onDataChange(changes);

        expect(grid.$$on_splice).toHaveBeenCalledWith(change);

        var trs = grid.$tbody[0].childNodes;
        expect(trs.length).toBe(2);
        expect(trs).toVerify(function(tr, idx) {
          return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
        });
      });

      it('should remove last row with a splice change', function() {
        change.index = 2;
        change.removed = [grid.$data[2]];

        delete grid.$data[2];
        grid.$data.length = 2;

        grid.$$onDataChange(changes);

        expect(grid.$$on_splice).toHaveBeenCalledWith(change);

        var trs = grid.$tbody[0].childNodes;
        expect(trs.length).toBe(2);
        expect(trs).toVerify(function(tr, idx) {
          return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
        });
      });

      it('should middle row with a splice change', function() {
        change.index = 1;
        change.removed = [grid.$data[1]];

        grid.$data[1] = grid.$data[2];
        delete grid.$data[2];
        grid.$data.length = 2;

        grid.$$onDataChange(changes);

        expect(grid.$$on_splice).toHaveBeenCalledWith(change);

        var trs = grid.$tbody[0].childNodes;
        expect(trs.length).toBe(2);
        expect(trs).toVerify(function(tr, idx) {
          return tr.childNodes[0].innerHTML === grid.$data[idx].id.toString();
        });
      });

      it('should remove everything', function() {
        change.index = 0;
        change.removed = [grid.$data[0], grid.$data[1], grid.$data[2]];

        delete grid.$data[0];
        delete grid.$data[1];
        delete grid.$data[2];
        grid.$data.length = 0;

        grid.$$onDataChange(changes);

        expect(grid.$$on_splice).toHaveBeenCalledWith(change);

        var trs = grid.$tbody[0].childNodes;
        expect(trs.length).toBe(0);
      });
    });
  });
});
