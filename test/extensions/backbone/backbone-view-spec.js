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

describe('Backbone WaffleView', function() {
  var Model;
  var Collection;
  var table;

  beforeEach(function() {
    Model = Backbone.Model.extend({
      urlRoot: '/foo'
    });

    Collection = Backbone.Collection.extend({
      model: Model,
      url: '/foo'
    });

    table = document.createElement('table');
  });

  it('should have el tagName', function() {
    expect(Backbone.WaffleView.prototype.tagName).toBe('table');
  });

  it('should create default view', function() {
    spyOn(Waffle, 'create').and.callThrough();

    var data = [
      {id: 1, name: 'foo'},
      {id: 2, name: 'bar'}
    ];

    var options = {
      comparator: 'name'
    };

    var collection = new Collection(data, options);

    var view = new Backbone.WaffleView({
      collection: collection
    });

    expect(Waffle.create).toHaveBeenCalledWith(view.el, jasmine.objectContaining({
      data: collection.models,
      sortBy: 'name',
      model: jasmine.any(Function),
      key: '_cid'
    }));

    expect(view).toBeDefined();
    expect(view.grid).toBeDefined();
    expect(view.grid.$comparators).toBeDefined();
    expect(view.grid.$comparators.length).toBe(1);
    expect(view.grid.$comparators[0]).toEqual(jasmine.objectContaining({
      id: 'name',
      asc: true
    }));

    expect(view.grid.$table).toBeDefined();
    expect(view.grid.$table[0]).toBe(view.el);

    expect(view.grid.$data.length).toBe(2);
    expect(view.grid.$data[0]).toEqual(jasmine.objectContaining(collection.at(0).toJSON()));
    expect(view.grid.$data[1]).toEqual(jasmine.objectContaining(collection.at(1).toJSON()));
  });

  describe('once initialized', function() {
    var collection;
    var view;

    beforeEach(function() {
      var data = [
        {id: 1, name: 'foo'},
        {id: 2, name: 'bar'}
      ];

      collection = new Collection(data);

      spyOn(Backbone.WaffleView.prototype, 'onChange').and.callThrough();

      view = new Backbone.WaffleView({
        collection: collection,
        waffle: {
          columns: [
            {id: 'name', editable: true}
          ]
        }
      });
    });

    it('should render grid', function() {
      spyOn(view.grid, 'render').and.callThrough();
      view.render();
      expect(view.grid.render).toHaveBeenCalled();
    });

    it('should update grid when data is added to the collection', function() {
      spyOn(view.grid.$data, 'add').and.callThrough();

      var o = {
        id: 3,
        name: 'qux'
      };

      collection.push(o);

      expect(view.grid.$data.add).toHaveBeenCalledWith(collection.last(), 2);

      var data = view.grid.$data;
      expect(data.length).toBe(3);
      expect(data[0]).toEqual(jasmine.objectContaining(collection.at(0).toJSON()));
      expect(data[1]).toEqual(jasmine.objectContaining(collection.at(1).toJSON()));
      expect(data[2]).toEqual(jasmine.objectContaining(collection.at(2).toJSON()));
    });

    it('should update grid when data is removed from the collection', function() {
      spyOn(view.grid.$data, 'remove').and.callThrough();

      var removed = collection.pop();

      expect(view.grid.$data.remove).toHaveBeenCalledWith(removed);

      var data = view.grid.$data;
      expect(data.length).toBe(1);
      expect(data[0]).toEqual(jasmine.objectContaining(collection.at(0).toJSON()));
    });

    it('should update grid when collection is resetted', function() {
      spyOn(view.grid.$data, 'reset').and.callThrough();

      collection.reset([
        {id: 3, name: 'qux'}
      ]);

      expect(view.grid.$data.reset).toHaveBeenCalledWith(collection.models);

      var data = view.grid.$data;
      expect(data.length).toBe(1);
      expect(data[0]).toEqual(jasmine.objectContaining(collection.at(0).toJSON()));
    });

    it('should update grid when model is changed', function() {
      spyOn(view.grid.$data, 'replace').and.callThrough();

      collection.last().set('name', 'qux');

      expect(view.grid.$data.replace).toHaveBeenCalledWith(collection.last());

      var data = view.grid.$data;
      expect(data.length).toBe(2);

      var o = data[1];
      expect(o.name).toBe('qux');
    });

    it('should update grid when collection is sorted', function() {
      spyOn(view.grid, 'sortBy').and.callThrough();

      collection.comparator = 'name';
      collection.sort();

      expect(view.grid.sortBy).toHaveBeenCalledWith('name');

      var data = view.grid.$data;
      expect(data[0]).toEqual(jasmine.objectContaining(collection.at(0).toJSON()));
      expect(data[1]).toEqual(jasmine.objectContaining(collection.at(1).toJSON()));
    });

    it('should trigger update on model if data is edited', function() {
      var spy = jasmine.createSpy('spy');
      collection.on('change', spy);

      var tr = document.createElement('tr');
      tr.setAttribute('data-waffle-idx', '0');
      tr.setAttribute('data-waffle-id', collection.at(0).cid);

      var input = document.createElement('input');
      input.setAttribute('data-waffle-id', 'name');
      input.value = 'qux';

      spyOn($doc, 'findParent').and.returnValue(tr);
      spyOn(view.grid, 'dispatchEvent').and.callThrough();

      var event = {
        type: 'change',
        target: input
      };

      // Reset calls to be sure nothing happen.
      view.onChange.calls.reset();

      // Trigger input event.
      GridDomHandlers.onInputTbody.call(view.grid, event);

      expect(view.grid.dispatchEvent).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      expect(collection.at(0).get('name')).toBe('qux');
      expect(view.onChange).not.toHaveBeenCalled();
    });

    it('should trigger sort on collection when grid is sorted', function() {
      var spy = jasmine.createSpy('spy');
      collection.on('sort', spy);

      var th = document.createElement('th');
      th.setAttribute('data-waffle-id', 'name');
      th.setAttribute('data-waffle-order', '-');
      th.setAttribute('data-waffle-sortable', 'true');

      var event = {
        target: th
      };

      spyOn($doc, 'findParent').and.returnValue(th);
      spyOn(view.grid, 'dispatchEvent').and.callThrough();
      spyOn(view.grid, 'sortBy').and.callThrough();

      expect(collection.comparator).toBeFalsy();
      expect(collection.at(0).get('name')).toBe('foo');
      expect(collection.at(1).get('name')).toBe('bar');

      // Trigger input event.
      GridDomHandlers.onClickThead.call(view.grid, event);

      expect(view.grid.sortBy).toHaveBeenCalled();
      expect(view.grid.dispatchEvent).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();

      expect(collection.comparator).toBeDefined();
      expect(collection.comparator).toBeAFunction();
      expect(collection.comparator.length).toBe(2);
      expect(collection.at(0).get('name')).toBe('bar');
      expect(collection.at(1).get('name')).toBe('foo');
    });

    it('should destroy grid when view is removed', function() {
      var destroyFn = spyOn(view.grid, 'destroy').and.callThrough();
      view.remove();
      expect(destroyFn).toHaveBeenCalled();
    });

    it('should update element', function() {
      spyOn(view.grid, 'attach').and.callThrough();

      var newTable = document.createElement('table');

      view.setElement(newTable);

      expect(view.grid.attach).toHaveBeenCalledWith(newTable);
    });

    it('should proxify filter method', function() {
      spyOn(view.grid, 'filter').and.callThrough();

      var result = view.filter('foo');

      expect(view.grid.filter).toHaveBeenCalledWith('foo');
      expect(result).toBe(view);
    });

    it('should proxify removeFilter method', function() {
      spyOn(view.grid, 'removeFilter').and.callThrough();

      var result = view.removeFilter();

      expect(view.grid.removeFilter).toHaveBeenCalled();
      expect(result).toBe(view);
    });

    it('should proxify select method', function() {
      spyOn(view.grid, 'select').and.callThrough();

      var result = view.select();

      expect(view.grid.select).toHaveBeenCalled();
      expect(result).toBe(view);
    });

    it('should proxify deselect method', function() {
      spyOn(view.grid, 'deselect').and.callThrough();

      var result = view.deselect();

      expect(view.grid.deselect).toHaveBeenCalled();
      expect(result).toBe(view);
    });

    it('should proxify resize method', function() {
      spyOn(view.grid, 'resize').and.callThrough();

      var result = view.resize();

      expect(view.grid.resize).toHaveBeenCalled();
      expect(result).toBe(view);
    });

    it('should proxify renderBody method', function() {
      spyOn(view.grid, 'renderBody').and.callThrough();

      var result = view.renderBody();

      expect(view.grid.renderBody).toHaveBeenCalled();
      expect(result).toBe(view);
    });

    it('should proxify renderFooter method', function() {
      spyOn(view.grid, 'renderFooter').and.callThrough();

      var result = view.renderFooter();

      expect(view.grid.renderFooter).toHaveBeenCalled();
      expect(result).toBe(view);
    });

    it('should proxify renderHeader method', function() {
      spyOn(view.grid, 'renderHeader').and.callThrough();

      var result = view.renderHeader();

      expect(view.grid.renderHeader).toHaveBeenCalled();
      expect(result).toBe(view);
    });
  });
});
