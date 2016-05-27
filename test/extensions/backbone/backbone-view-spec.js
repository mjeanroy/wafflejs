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

describe('Backbone WaffleView', () => {
  let Model;
  let Collection;
  let table;

  beforeEach(() => {
    Model = Backbone.Model.extend({
      urlRoot: '/foo'
    });

    Collection = Backbone.Collection.extend({
      model: Model,
      url: '/foo'
    });

    table = document.createElement('table');
  });

  it('should have el tagName', () => {
    expect(Backbone.WaffleView.prototype.tagName).toBe('table');
  });

  it('should create default view', () => {
    spyOn(Waffle, 'create').and.callThrough();

    const data = [
      {id: 1, name: 'foo'},
      {id: 2, name: 'bar'}
    ];

    const options = {
      comparator: 'name'
    };

    const collection = new Collection(data, options);

    const view = new Backbone.WaffleView({
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

  describe('once initialized', () => {
    let collection;
    let view;

    beforeEach(() => {
      const data = [
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

    it('should render grid', () => {
      spyOn(view.grid, 'render').and.callThrough();
      view.render();
      expect(view.grid.render).toHaveBeenCalled();
    });

    it('should update grid when data is added to the collection', () => {
      spyOn(view.grid.$data, 'add').and.callThrough();

      const o = {
        id: 3,
        name: 'qux'
      };

      collection.push(o);

      expect(view.grid.$data.add).toHaveBeenCalledWith(collection.last(), 2);

      const data = view.grid.$data;
      expect(data.length).toBe(3);
      expect(data[0]).toEqual(jasmine.objectContaining(collection.at(0).toJSON()));
      expect(data[1]).toEqual(jasmine.objectContaining(collection.at(1).toJSON()));
      expect(data[2]).toEqual(jasmine.objectContaining(collection.at(2).toJSON()));
    });

    it('should update grid when data is removed from the collection', () => {
      spyOn(view.grid.$data, 'remove').and.callThrough();

      const removed = collection.pop();

      expect(view.grid.$data.remove).toHaveBeenCalledWith(removed);

      const data = view.grid.$data;
      expect(data.length).toBe(1);
      expect(data[0]).toEqual(jasmine.objectContaining(collection.at(0).toJSON()));
    });

    it('should update grid when collection is resetted', () => {
      spyOn(view.grid.$data, 'reset').and.callThrough();

      collection.reset([
        {id: 3, name: 'qux'}
      ]);

      expect(view.grid.$data.reset).toHaveBeenCalledWith(collection.models);

      const data = view.grid.$data;
      expect(data.length).toBe(1);
      expect(data[0]).toEqual(jasmine.objectContaining(collection.at(0).toJSON()));
    });

    it('should update grid when model is changed', () => {
      spyOn(view.grid.$data, 'replace').and.callThrough();

      collection.last().set('name', 'qux');

      expect(view.grid.$data.replace).toHaveBeenCalledWith(collection.last());

      const data = view.grid.$data;
      expect(data.length).toBe(2);

      const o = data[1];
      expect(o.name).toBe('qux');
    });

    it('should update grid when collection is sorted', () => {
      spyOn(view.grid, 'sortBy').and.callThrough();

      collection.comparator = 'name';
      collection.sort();

      expect(view.grid.sortBy).toHaveBeenCalledWith('name');

      const data = view.grid.$data;
      expect(data[0]).toEqual(jasmine.objectContaining(collection.at(0).toJSON()));
      expect(data[1]).toEqual(jasmine.objectContaining(collection.at(1).toJSON()));
    });

    it('should trigger update on model if data is edited', () => {
      const spy = jasmine.createSpy('spy');
      collection.on('change', spy);

      const tr = document.createElement('tr');
      tr.setAttribute('data-waffle-idx', '0');
      tr.setAttribute('data-waffle-id', collection.at(0).cid);

      const input = document.createElement('input');
      input.setAttribute('data-waffle-id', 'name');
      input.value = 'qux';

      spyOn($doc, 'findParent').and.returnValue(tr);
      spyOn(view.grid, 'dispatchEvent').and.callThrough();

      const event = {
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

    it('should trigger sort on collection when grid is sorted', () => {
      const spy = jasmine.createSpy('spy');
      collection.on('sort', spy);

      const th = document.createElement('th');
      th.setAttribute('data-waffle-id', 'name');
      th.setAttribute('data-waffle-order', '-');
      th.setAttribute('data-waffle-sortable', 'true');

      const event = {
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

    it('should destroy grid when view is removed', () => {
      const destroyFn = spyOn(view.grid, 'destroy').and.callThrough();
      view.remove();
      expect(destroyFn).toHaveBeenCalled();
    });

    it('should update element', () => {
      spyOn(view.grid, 'attach').and.callThrough();

      const newTable = document.createElement('table');

      view.setElement(newTable);

      expect(view.grid.attach).toHaveBeenCalledWith(newTable);
    });

    it('should proxify filter method', () => {
      spyOn(view.grid, 'filter').and.callThrough();

      const result = view.filter('foo');

      expect(view.grid.filter).toHaveBeenCalledWith('foo');
      expect(result).toBe(view);
    });

    it('should proxify removeFilter method', () => {
      spyOn(view.grid, 'removeFilter').and.callThrough();

      const result = view.removeFilter();

      expect(view.grid.removeFilter).toHaveBeenCalled();
      expect(result).toBe(view);
    });

    it('should proxify select method', () => {
      spyOn(view.grid, 'select').and.callThrough();

      const result = view.select();

      expect(view.grid.select).toHaveBeenCalled();
      expect(result).toBe(view);
    });

    it('should proxify deselect method', () => {
      spyOn(view.grid, 'deselect').and.callThrough();

      const result = view.deselect();

      expect(view.grid.deselect).toHaveBeenCalled();
      expect(result).toBe(view);
    });

    it('should proxify resize method', () => {
      spyOn(view.grid, 'resize').and.callThrough();

      const result = view.resize();

      expect(view.grid.resize).toHaveBeenCalled();
      expect(result).toBe(view);
    });

    it('should proxify renderBody method', () => {
      spyOn(view.grid, 'renderBody').and.callThrough();

      const result = view.renderBody();

      expect(view.grid.renderBody).toHaveBeenCalled();
      expect(result).toBe(view);
    });

    it('should proxify renderFooter method', () => {
      spyOn(view.grid, 'renderFooter').and.callThrough();

      const result = view.renderFooter();

      expect(view.grid.renderFooter).toHaveBeenCalled();
      expect(result).toBe(view);
    });

    it('should proxify renderHeader method', () => {
      spyOn(view.grid, 'renderHeader').and.callThrough();

      const result = view.renderHeader();

      expect(view.grid.renderHeader).toHaveBeenCalled();
      expect(result).toBe(view);
    });
  });
});
