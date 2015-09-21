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

    var collection = new Collection([
      {id: 1, name: 'foo'},
      {id: 2, name: 'bar'}
    ]);

    var view = new Backbone.WaffleView({
      collection: collection
    });

    expect(Waffle.create).toHaveBeenCalledWith(view.el, jasmine.objectContaining({
      data: collection.models,
      model: jasmine.any(Function),
      key: '_cid'
    }));

    expect(view).toBeDefined();
    expect(view.grid).toBeDefined();

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
      collection = new Collection([
        {id: 1, name: 'foo'},
        {id: 2, name: 'bar'}
      ]);

      view = new Backbone.WaffleView({
        collection: collection
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
  });
});
