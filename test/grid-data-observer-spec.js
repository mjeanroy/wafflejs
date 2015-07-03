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

describe('Grid Data Observer', function() {

  var columns, data, table, grid, $data;

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

    $data = grid.$data;

    spyOn(GridDataObserver, 'onSplice').and.callThrough();
    spyOn(GridDataObserver, 'onUpdate').and.callThrough();
    spyOn(grid, 'dispatchEvent').and.callThrough();
  });

  it('should call onSplice for a "splice" change', function() {
    var changes = [
      { type: 'splice', removed: [], index: 0, addedCount: 0, object: data }
    ];

    GridDataObserver.on.call(grid, changes);

    expect(GridDataObserver.onSplice).toHaveBeenCalledWith(changes[0]);
  });

  it('should call onUpdate for an "update" change', function() {
    var changes = [
      { type: 'update', removed: [], index: 0, addedCount: 0, object: data }
    ];

    GridDataObserver.on.call(grid, changes);

    expect(GridDataObserver.onUpdate).toHaveBeenCalledWith(changes[0]);
  });

  it('should call all changes with appropriate methods', function() {
    var changes = [
      { type: 'splice', removed: [], index: 0, addedCount: 0, object: data },
      { type: 'update', removed: [], index: 0, addedCount: 0, object: data }
    ];

    GridDataObserver.on.call(grid, changes);

    expect(GridDataObserver.onSplice).toHaveBeenCalledWith(changes[0]);
    expect(GridDataObserver.onUpdate).toHaveBeenCalledWith(changes[1]);
  });

  describe('with splice change', function() {
    it('should add new node', function() {
      var d1 = {
        id: 4,
        firstName: 'foo4',
        lastName: 'bar4'
      };

      var d2 = {
        id: 5,
        firstName: 'foo5',
        lastName: 'bar5'
      };

      // Push will trigger observer asynchronously
      grid.$data.push(d1, d2);
      jasmine.clock().tick();

      expect(GridDataObserver.onSplice).toHaveBeenCalled();

      var expectedAddedNodes = [
        grid.$tbody[0].childNodes[3],
        grid.$tbody[0].childNodes[4]
      ];

      var expectedAddedData = [
        grid.$data[3],
        grid.$data[4]
      ];

      expect(grid.dispatchEvent).toHaveBeenCalledWith('dataspliced', {
        added: expectedAddedData,
        addedNodes: expectedAddedNodes,
        removed: [],
        removedNodes: [],
        index: 3,
        nodeIndex: 3
      });

      expect(grid.$data.length).toBe(5);
      expect(grid.$data[3]).toBe(d1);
      expect(grid.$data[4]).toBe(d2);

      var tbody = grid.$tbody[0];
      expect(tbody.childNodes.length).toBe(5);

      expect(tbody.childNodes).toVerify(function(node, idx) {
        return node.getAttribute('data-waffle-idx') === idx.toString();
      });

      // First column should be data id value
      expect(tbody.childNodes).toVerify(function(node, idx) {
        return node.childNodes[1].innerHTML === grid.$data[idx].id.toString();
      });
    });

    it('should add new node at the beginning', function() {
      var d1 = {
        id: 4,
        firstName: 'foo4',
        lastName: 'bar4'
      };

      var d2 = {
        id: 5,
        firstName: 'foo5',
        lastName: 'bar5'
      };

      // Push will trigger observer asynchronously
      grid.$data.unshift(d1, d2);
      jasmine.clock().tick();

      expect(GridDataObserver.onSplice).toHaveBeenCalled();

      var expectedAddedNodes = [
        grid.$tbody[0].childNodes[0],
        grid.$tbody[0].childNodes[1]
      ];

      var expectedAddedData = [
        grid.$data[0],
        grid.$data[1]
      ];

      expect(grid.dispatchEvent).toHaveBeenCalledWith('dataspliced', {
        added: expectedAddedData,
        addedNodes: expectedAddedNodes,
        removed: [],
        removedNodes: [],
        index: 0,
        nodeIndex: 0
      });

      expect(grid.$data.length).toBe(5);
      expect(grid.$data[0]).toBe(d1);
      expect(grid.$data[1]).toBe(d2);

      var tbody = grid.$tbody[0];
      expect(tbody.childNodes.length).toBe(5);

      expect(tbody.childNodes).toVerify(function(node, idx) {
        return node.getAttribute('data-waffle-idx') === idx.toString();
      });

      // First column should be data id value
      expect(tbody.childNodes).toVerify(function(node, idx) {
        return node.childNodes[1].innerHTML === grid.$data[idx].id.toString();
      });
    });

    it('should remove node', function() {
      var expectedRemovedNodes = [
        grid.$tbody[0].childNodes[1],
        grid.$tbody[0].childNodes[2]
      ];

      expectedRemovedData = [
        grid.$data[1],
        grid.$data[2]
      ];

      // This should trigger a new change
      grid.$data.splice(1, 2);
      jasmine.clock().tick();

      expect(GridDataObserver.onSplice).toHaveBeenCalled();

      expect(grid.dispatchEvent).toHaveBeenCalledWith('dataspliced', {
        added: [],
        addedNodes: [],
        removed: expectedRemovedData,
        removedNodes: expectedRemovedNodes,
        index: 1,
        nodeIndex: 1
      });

      expect(grid.$data.length).toBe(1);
      expect(grid.$data[0].id).toBe(2);

      var tbody = grid.$tbody[0];
      expect(tbody.childNodes.length).toBe(1);
      expect(tbody.childNodes[0].getAttribute('data-waffle-idx')).toBe('0');
      expect(tbody.childNodes[0].childNodes[1].innerHTML).toBe('2');
    });

    it('should remove node at the beginning', function() {
      var expectedRemovedNodes = [
        grid.$tbody[0].childNodes[0]
      ];

      expectedRemovedData = [
        grid.$data[0]
      ];

      // This should trigger a new change
      grid.$data.shift();
      jasmine.clock().tick();

      expect(GridDataObserver.onSplice).toHaveBeenCalled();

      expect(grid.dispatchEvent).toHaveBeenCalledWith('dataspliced', {
        added: [],
        addedNodes: [],
        removed: expectedRemovedData,
        removedNodes: expectedRemovedNodes,
        index: 0,
        nodeIndex: 0
      });

      expect(grid.$data.length).toBe(2);
      expect(grid.$data[0].id).toBe(1);
      expect(grid.$data[1].id).toBe(3);

      var tbody = grid.$tbody[0];
      expect(tbody.childNodes.length).toBe(2);

      expect(tbody.childNodes).toVerify(function(node, idx) {
        return node.getAttribute('data-waffle-idx') === idx.toString();
      });

      // First column should be data id value
      expect(tbody.childNodes).toVerify(function(node, idx) {
        return node.childNodes[1].innerHTML === grid.$data[idx].id.toString();
      });
    });

    it('should add and remove node', function() {
      var d1 = {
        id: 4,
        firstName: 'foo4',
        lastName: 'bar4'
      };

      var d2 = {
        id: 5,
        firstName: 'foo5',
        lastName: 'bar5'
      };

      var expectedRemovedNodes = [
        grid.$tbody[0].childNodes[1],
        grid.$tbody[0].childNodes[2]
      ];

      expectedRemovedData = [
        grid.$data[1],
        grid.$data[2]
      ];

      // This should trigger a new change
      grid.$data.splice(1, 2, d1, d2);
      jasmine.clock().tick();

      expect(GridDataObserver.onSplice).toHaveBeenCalled();

      var expectedAddedNodes = [
        grid.$tbody[0].childNodes[1],
        grid.$tbody[0].childNodes[2]
      ];

      var expectedAddedData = [
        grid.$data[1],
        grid.$data[2]
      ];

      expect(grid.dispatchEvent).toHaveBeenCalledWith('dataspliced', {
        added: expectedAddedData,
        addedNodes: expectedAddedNodes,
        removed: expectedRemovedData,
        removedNodes: expectedRemovedNodes,
        index: 1,
        nodeIndex: 1
      });

      expect(grid.$data.length).toBe(3);
      expect(grid.$data[0].id).toBe(2);
      expect(grid.$data[1].id).toBe(4);
      expect(grid.$data[2].id).toBe(5);

      var tbody = grid.$tbody[0];
      expect(tbody.childNodes.length).toBe(3);

      expect(tbody.childNodes).toVerify(function(node, idx) {
        return node.getAttribute('data-waffle-idx') === idx.toString();
      });

      // First column should be data id value
      expect(tbody.childNodes).toVerify(function(node, idx) {
        return node.childNodes[1].innerHTML === grid.$data[idx].id.toString();
      });
    });

    it('should clear grid', function() {
      var expectedRemovedNodes = [
        grid.$tbody[0].childNodes[0],
        grid.$tbody[0].childNodes[1],
        grid.$tbody[0].childNodes[2]
      ];

      expectedRemovedData = [
        grid.$data[0],
        grid.$data[1],
        grid.$data[2]
      ];

      // This should trigger a new change
      grid.$data.clear();
      jasmine.clock().tick();

      expect(GridDataObserver.onSplice).toHaveBeenCalled();

      expect(grid.dispatchEvent).toHaveBeenCalledWith('dataspliced', {
        added: [],
        addedNodes: [],
        removed: expectedRemovedData,
        removedNodes: expectedRemovedNodes,
        index: 0,
        nodeIndex: 0
      });

      expect(grid.$data.length).toBe(0);
      expect(grid.$tbody[0].childNodes.length).toBe(0);
    });

    it('should remove node and remove selection', function() {
      grid.$selection.push(grid.$data[0]);
      jasmine.clock().tick();
      grid.dispatchEvent.calls.reset();

      var expectedRemovedNodes = [
        grid.$tbody[0].childNodes[0]
      ];

      expectedRemovedData = [
        grid.$data[0]
      ];

      expect(grid.$selection.toArray()).toEqual([grid.$data[0]]);

      // This should trigger a new change
      grid.$data.splice(0, 1);
      jasmine.clock().tick();

      expect(GridDataObserver.onSplice).toHaveBeenCalled();

      expect(grid.dispatchEvent).toHaveBeenCalledWith('dataspliced', {
        added: [],
        addedNodes: [],
        removed: expectedRemovedData,
        removedNodes: expectedRemovedNodes,
        index: 0,
        nodeIndex: 0
      });

      expect(grid.$data.length).toBe(2);
      expect(grid.$data[0].id).toBe(1);

      var tbody = grid.$tbody[0];
      expect(tbody.childNodes.length).toBe(2);
      expect(tbody.childNodes[0].getAttribute('data-waffle-idx')).toBe('0');
      expect(tbody.childNodes[0].childNodes[1].innerHTML).toBe('1');

      expect(grid.$selection.toArray()).toEqual([]);
    });
  });

  describe('with an update change', function() {
    it('should update grid', function() {
      expect(grid.$data[0].id).toBe(2);
      expect(grid.$data[1].id).toBe(1);
      expect(grid.$data[2].id).toBe(3); 

      grid.$data.reverse();
      jasmine.clock().tick();

      expect(GridDataObserver.onUpdate).toHaveBeenCalled();

      expect(grid.dispatchEvent).toHaveBeenCalledWith('dataupdated', {
        index: 0,
        nodeIndex: 0,
        oldNode: grid.$tbody[0].childNodes[0],
        newNode: grid.$tbody[0].childNodes[0]
      });

      expect(grid.dispatchEvent).toHaveBeenCalledWith('dataupdated', {
        index: 2,
        nodeIndex: 2,
        oldNode: grid.$tbody[0].childNodes[2],
        newNode: grid.$tbody[0].childNodes[2]
      });

      expect(grid.$data[0].id).toBe(3);
      expect(grid.$data[1].id).toBe(1);
      expect(grid.$data[2].id).toBe(2);

      var tbody = grid.$tbody[0];
      expect(tbody.childNodes.length).toBe(3);

      expect(tbody.childNodes).toVerify(function(node, idx) {
        return node.getAttribute('data-waffle-idx') === idx.toString();
      });

      expect(tbody.childNodes).toVerify(function(node, idx) {
        return node.childNodes[1].innerHTML === grid.$data[idx].id.toString();
      });
    });
  });
});
