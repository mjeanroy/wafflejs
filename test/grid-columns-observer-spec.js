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

describe('Grid Columns Observer', function() {

  var columns, data, table, grid, $columns;

  beforeEach(function() {
    columns = [
      { id: 'id' },
      { id: 'firstName' }
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

    $columns = grid.$columns;

    spyOn(GridColumnsObserver, 'onSplice').and.callThrough();
    spyOn(grid, 'dispatchEvent').and.callThrough();

    jasmine.clock().tick();

    expect(grid.$thead[0].childNodes[0].childNodes.length).toBe(1 + 2);
    expect(grid.$tfoot[0].childNodes[0].childNodes.length).toBe(1 + 2);
    expect(grid.$tbody[0].childNodes).toVerify(function(tr) {
      return tr.childNodes.length === (1 + 2);
    });
  });

  it('should call onSplice for a "splice" change', function() {
    var changes = [
      { type: 'splice', removed: [], index: 0, addedCount: 0, object: data }
    ];

    GridColumnsObserver.on.call(grid, changes);

    expect(GridColumnsObserver.onSplice).toHaveBeenCalledWith(changes[0]);
  });

  describe('with splice change', function() {
    it('should add new column', function() {
      var thead = grid.$thead[0];
      var tbody = grid.$tbody[0];
      var tfoot = grid.$tfoot[0];

      expect(thead.childNodes[0].childNodes.length).toBe(1 + 2);
      expect(tfoot.childNodes[0].childNodes.length).toBe(1 + 2);
      expect(tbody.childNodes).toVerify(function(tr) {
        return tr.childNodes.length === (1 + 2);
      });

      $columns.push({
        id: 'lastName'
      });

      jasmine.clock().tick();

      expect(thead.childNodes[0].childNodes.length).toBe(1 + 3);
      expect(tfoot.childNodes[0].childNodes.length).toBe(1 + 3);
      expect(tbody.childNodes).toVerify(function(tr) {
        return tr.childNodes.length === (1 + 3);
      });

      expect(thead.childNodes[0].childNodes[0].getAttribute('data-waffle-id')).toBeNull();
      expect(thead.childNodes[0].childNodes[1].getAttribute('data-waffle-id')).toBe($columns.at(0).id);
      expect(thead.childNodes[0].childNodes[2].getAttribute('data-waffle-id')).toBe($columns.at(1).id);

      expect(tfoot.childNodes[0].childNodes[0].getAttribute('data-waffle-id')).toBeNull();
      expect(tfoot.childNodes[0].childNodes[1].getAttribute('data-waffle-id')).toBe($columns.at(0).id);
      expect(tfoot.childNodes[0].childNodes[2].getAttribute('data-waffle-id')).toBe($columns.at(1).id);

      expect(tbody.childNodes).toVerify(function(tr) {
        return tr.childNodes[0].getAttribute('data-waffle-id') === null;
      });

      expect(tbody.childNodes).toVerify(function(tr) {
        return tr.childNodes[1].getAttribute('data-waffle-id') === $columns.at(0).id &&
               tr.childNodes[2].getAttribute('data-waffle-id') === $columns.at(1).id;
      });

      expect(grid.dispatchEvent).toHaveBeenCalledWith('columnsspliced', {
        index: 2,

        removedNodes: {
          thead: [],
          tbody: [],
          tfoot: []
        },

        addedNodes: {
          thead: [thead.childNodes[0].childNodes[3]],
          tbody: [
            tbody.childNodes[0].childNodes[3],
            tbody.childNodes[1].childNodes[3],
            tbody.childNodes[2].childNodes[3]
          ],
          tfoot: [tfoot.childNodes[0].childNodes[3]]
        }
      });
    });

    it('should remove column', function() {
      var thead = grid.$thead[0];
      var tbody = grid.$tbody[0];
      var tfoot = grid.$tfoot[0];

      var expectedTheadRemovedNodes = [
        thead.childNodes[0].childNodes[1]
      ];

      var expectedTfootRemovedNodes = [
        tfoot.childNodes[0].childNodes[1]
      ];

      var expectedTbodyRemovedNodes = [
        tbody.childNodes[0].childNodes[1],
        tbody.childNodes[1].childNodes[1],
        tbody.childNodes[2].childNodes[1]
      ];

      $columns.splice(0, 1);
      jasmine.clock().tick();

      expect(GridColumnsObserver.onSplice).toHaveBeenCalled();

      expect(grid.$columns.length).toBe(1);

      expect(thead.childNodes[0].childNodes.length).toBe(1 + 1);
      expect(tfoot.childNodes[0].childNodes.length).toBe(1 + 1);
      expect(tbody.childNodes).toVerify(function(tr) {
        return tr.childNodes.length === (1 + 1);
      });

      expect(thead.childNodes[0].childNodes[0].getAttribute('data-waffle-id')).toBeNull();
      expect(thead.childNodes[0].childNodes[1].getAttribute('data-waffle-id')).toBe($columns.at(0).id);

      expect(tfoot.childNodes[0].childNodes[0].getAttribute('data-waffle-id')).toBeNull();
      expect(tfoot.childNodes[0].childNodes[1].getAttribute('data-waffle-id')).toBe($columns.at(0).id);

      expect(tbody.childNodes).toVerify(function(tr) {
        return tr.childNodes[0].getAttribute('data-waffle-id') === null;
      });

      expect(tbody.childNodes).toVerify(function(tr) {
        return tr.childNodes[1].getAttribute('data-waffle-id') === $columns.at(0).id;
      });

      expect(grid.dispatchEvent).toHaveBeenCalledWith('columnsspliced', {
        index: 0,

        removedNodes: {
          thead: expectedTheadRemovedNodes,
          tbody: expectedTbodyRemovedNodes,
          tfoot: expectedTfootRemovedNodes
        },

        addedNodes: {
          thead: [],
          tbody: [],
          tfoot: []
        }
      });
    });

    it('should add and remove columns', function() {
      var thead = grid.$thead[0];
      var tbody = grid.$tbody[0];
      var tfoot = grid.$tfoot[0];

      var expectedTheadRemovedNodes = [
        thead.childNodes[0].childNodes[1]
      ];

      var expectedTfootRemovedNodes = [
        tfoot.childNodes[0].childNodes[1]
      ];

      var expectedTbodyRemovedNodes = [
        tbody.childNodes[0].childNodes[1],
        tbody.childNodes[1].childNodes[1],
        tbody.childNodes[2].childNodes[1]
      ];

      $columns.splice(0, 1, {
        id: 'lastName'
      });

      jasmine.clock().tick();

      expect(GridColumnsObserver.onSplice).toHaveBeenCalled();

      expect(grid.$columns.length).toBe(2);

      expect(thead.childNodes[0].childNodes.length).toBe(1 + 2);
      expect(tfoot.childNodes[0].childNodes.length).toBe(1 + 2);
      expect(tbody.childNodes).toVerify(function(tr) {
        return tr.childNodes.length === (1 + 2);
      });

      expect(thead.childNodes[0].childNodes[0].getAttribute('data-waffle-id')).toBeNull();
      expect(thead.childNodes[0].childNodes[1].getAttribute('data-waffle-id')).toBe($columns.at(0).id);
      expect(thead.childNodes[0].childNodes[2].getAttribute('data-waffle-id')).toBe($columns.at(1).id);

      expect(tfoot.childNodes[0].childNodes[0].getAttribute('data-waffle-id')).toBeNull();
      expect(tfoot.childNodes[0].childNodes[1].getAttribute('data-waffle-id')).toBe($columns.at(0).id);
      expect(tfoot.childNodes[0].childNodes[2].getAttribute('data-waffle-id')).toBe($columns.at(1).id);

      expect(tbody.childNodes).toVerify(function(tr) {
        return tr.childNodes[0].getAttribute('data-waffle-id') === null;
      });

      expect(tbody.childNodes).toVerify(function(tr) {
        return tr.childNodes[1].getAttribute('data-waffle-id') === $columns.at(0).id &&
               tr.childNodes[2].getAttribute('data-waffle-id') === $columns.at(1).id;
      });

      expect(grid.dispatchEvent).toHaveBeenCalledWith('columnsspliced', {
        index: 0,

        removedNodes: {
          thead: expectedTheadRemovedNodes,
          tbody: expectedTbodyRemovedNodes,
          tfoot: expectedTfootRemovedNodes
        },

        addedNodes: {
          thead: [thead.childNodes[0].childNodes[1]],
          tbody: [
            tbody.childNodes[0].childNodes[1],
            tbody.childNodes[1].childNodes[1],
            tbody.childNodes[2].childNodes[1]
          ],
          tfoot: [tfoot.childNodes[0].childNodes[1]]
        }
      });
    });
  });
});
