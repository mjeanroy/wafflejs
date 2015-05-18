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

describe('collection', function() {

  it('should initialize empty collection', function() {
    var collection = new Collection();
    expect(collection.length).toBe(0);
    expect(collection.$$map).toEqual(createMap());
    expect(collection.$$model).toBe(Object);
    expect(collection.$$key).toEqual(jasmine.any(Function));

    var id = collection.$$key({ id: 1 });
    expect(id).toBe(1);
  });

  it('should initialize empty collection with id attribute', function() {
    var collection = new Collection([], {
      key: 'name'
    });

    expect(collection.length).toBe(0);
    expect(collection.$$map).toEqual(createMap());
    expect(collection.$$model).toBe(Object);
    expect(collection.$$key).toEqual(jasmine.any(Function));

    var name = collection.$$key({ id: 1, name: 'foo' });
    expect(name).toBe('foo');
  });

  it('should initialize empty collection with model constructor', function() {
    var Model = function() { };

    var collection = new Collection([], {
      key: 'name',
      model: Model
    });

    expect(collection.length).toBe(0);
    expect(collection.$$map).toEqual(createMap());
    expect(collection.$$model).toBe(Model);
    expect(collection.$$key).toEqual(jasmine.any(Function));
  });

  it('should initialize collection with array', function() {
    var o1 = { id: 1, name: 'foo' };
    var o2 = { id: 2, name: 'bar' };
    var items = [o1, o2];

    var collection = new Collection(items);

    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);

    expect(collection.$$map.get(1)).toEqual({
      idx: 0
    });

    expect(collection.$$map.get(2)).toEqual({
      idx: 1
    });
  });

  it('should initialize collection with array and model constructor', function() {
    var Model = function(data) {
      this.id = data.id;
      this.name = data.name;
    };

    var o1 = { id: 1, name: 'foo' };
    var o2 = { id: 2, name: 'bar' };
    var items = [o1, o2];

    var collection = new Collection(items, {
      model: Model
    });

    expect(collection.length).toBe(2);
    expect(collection[0]).not.toBe(o1);
    expect(collection[1]).not.toBe(o2);

    expect(collection[0]).toEqual(jasmine.objectContaining(o1));
    expect(collection[1]).toEqual(jasmine.objectContaining(o2));

    expect(collection.$$map.get(1)).toEqual({
      idx: 0
    });

    expect(collection.$$map.get(2)).toEqual({
      idx: 1
    });
  });

  describe('once initialized', function() {
    var o1;
    var o2;
    var collection;

    beforeEach(function() {
      o1 = { id: 1, name: 'foo' };
      o2 = { id: 2, name: 'bar' };

      o1.toString = function() {
        return this.id;
      };

      o2.toString = function() {
        return this.id;
      };

      collection = new Collection([o1, o2]);
      expect(collection.length).toBe(2);

      jasmine.clock().tick(1);
    });

    it('should fail if added value is not object', function() {
      var o1 = { id: 1, name: 'foo' };
      var o2 = { id: 2, name: 'bar' };
      var o3 = { id: 3, name: 'foo' };
      var o4 = null;
      var collection = new Collection([o1, o2]);

      var push = function() {
        collection.push(o3, o4);
      };

      var unshift = function() {
        collection.unshift(o3, o4);
      };

      var add = function() {
        collection.add(0, [o3, o4]);
      };

      var splice = function() {
        collection.splice(0, 0, o3, o4);
      };

      var error = new Error('Waffle collections are not array, only object are allowed');

      expect(push).toThrow(error);
      expect(unshift).toThrow(error);
      expect(add).toThrow(error);
      expect(splice).toThrow(error);

      // Check collection has not been updated
      expect(collection.length).toBe(2);
      expect(collection[0]).toBe(o1);
      expect(collection[1]).toBe(o2);
    });

    it('get element by key', function() {
      var o1 = { id: 1, name: 'foo' };
      var o2 = { id: 2, name: 'bar' };
      var items = [o1, o2];

      var collection = new Collection(items);

      expect(collection.byKey(1)).toBe(o1);
      expect(collection.byKey(2)).toBe(o2);
      expect(collection.byKey(3)).toBe(undefined);
    });

    it('get element index by key', function() {
      var o1 = { id: 1, name: 'foo' };
      var o2 = { id: 2, name: 'bar' };
      var items = [o1, o2];

      var collection = new Collection(items);

      expect(collection.indexByKey(1)).toBe(0);
      expect(collection.indexByKey(2)).toBe(1);
      expect(collection.indexByKey(3)).toBe(-1);
    });

    it('should join elements', function() {
      expect(collection.join()).toBe('1,2');
      expect(collection.join(';')).toBe('1;2');
    });

    it('should get string value', function() {
      expect(collection.toString()).toBe('1,2');
    });

    it('should get locale string value', function() {
      expect(collection.toLocaleString()).toBe('1,2');
    });

    it('should get json representation', function() {
      expect(collection.toJSON()).toEqual(JSON.stringify([o1, o2]));
    });

    it('should check if collection is empty', function() {
      expect(new Collection().isEmpty()).toBe(true);
      expect(collection.isEmpty()).toBe(false);
    });

    it('should get size of collection', function() {
      expect(new Collection().size()).toBe(0);
      expect(collection.size()).toBe(2);
    });

    it('should get element at index', function() {
      expect(collection.at(0)).toBe(o1);
      expect(collection.at(1)).toBe(o2);
    });

    it('should concat collections', function() {
      var o3 = { id: 3 };
      var o4 = { id: 4 };

      var newCollection = collection.concat([o3, o4]);

      expect(newCollection).not.toBe(collection);
      expect(newCollection.length).toBe(4);
      expect(newCollection[0]).toBe(o1);
      expect(newCollection[1]).toBe(o2);
      expect(newCollection[2]).toBe(o3);
      expect(newCollection[3]).toBe(o4);
      expect(newCollection.$$map).toEqual(createMap({
        1: { idx: 0 },
        2: { idx: 1 },
        3: { idx: 2 },
        4: { idx: 3 }
      }));
    });

    it('should slice entire collection', function() {
      var c1 = collection.slice();
      jasmine.clock().tick(1);
      expect(c1).toEqual(collection);

      var c2 = collection.slice(0);
      jasmine.clock().tick(1);
      expect(c2).toEqual(collection);

      var c3 = collection.slice(0, collection.length);
      jasmine.clock().tick(1);
      expect(c3).toEqual(collection);
    });

    it('should split collection into chunks', function() {
      var chunks = collection.split(1);
      expect(chunks).toEqual([[o1], [o2]]);
    });

    it('should split collection into chunks of two elements', function() {
      var o1 = { id: 1 };
      var o2 = { id: 2 };
      var o3 = { id: 3 };
      collection = new Collection([o1, o2, o3]);

      var chunks = collection.split(2);

      expect(chunks).toEqual([[o1, o2], [o3]]);
    });

    it('should clear collection', function() {
      spyOn(collection, 'trigger').and.callThrough();

      var old1 = collection[0];
      var old2 = collection[1];

      collection.clear();

      expect(collection.$$map).toEqual(createMap());
      expect(collection.length).toBe(0);
      expect(collection[0]).toBeUndefined();
      expect(collection[1]).toBeUndefined();

      expect(collection.trigger).toHaveBeenCalledWith({
        type: 'splice',
        removed: [old1, old2],
        index: 0,
        addedCount: 0,
        object: collection
      });
    });

    it('should slice part of collection', function() {
      var results = collection.slice(0, 1);
      expect(results.length).toBe(1);
      expect(results[0]).toBe(collection[0]);
      expect(results.$$map).toEqual(createMap({
        1: { idx: 0 }
      }));
    });

    it('should get index of element', function() {
      expect(collection.indexOf(o1)).toBe(0);
      expect(collection.indexOf(o2)).toBe(1);
      expect(collection.indexOf({ id: 3 })).toBe(-1);
    });

    it('should get last index of element', function() {
      expect(collection.lastIndexOf(o1)).toBe(0);
      expect(collection.lastIndexOf(o2)).toBe(1);
      expect(collection.lastIndexOf({ id: 3 })).toBe(-1);
    });

    it('should get first element of collection', function() {
      expect(collection.first()).toBe(o1);
      expect(collection.first(1)).toEqual([o1]);
      expect(collection.first(2)).toEqual([o1, o2]);
    });

    it('should get last element of collection', function() {
      expect(collection.last()).toBe(o2);
      expect(collection.last(1)).toEqual([o2]);
      expect(collection.last(2)).toEqual([o1, o2]);
    });

    it('should get rest of collection', function() {
      expect(collection.rest()).toEqual([o2]);
      expect(collection.rest(1)).toEqual([o2]);
      expect(collection.rest(2)).toEqual([]);
    });

    it('should get initial elements of collection', function() {
      expect(collection.initial()).toEqual([o1]);
      expect(collection.initial(1)).toEqual([o1]);
      expect(collection.initial(2)).toEqual([]);
    });

    it('should apply callback on each elements', function() {
      var callback = jasmine.createSpy('callback');

      collection.forEach(callback);

      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should map elements', function() {
      var callback = jasmine.createSpy('callback').and.callFake(function(current) {
        return current.id;
      });

      var newArray = collection.map(callback);

      expect(newArray.length).toBe(2);
      expect(newArray[0]).toBe(collection[0].id);
      expect(newArray[1]).toBe(collection[1].id);

      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should check if every collection elements satisfies test', function() {
      var callback = jasmine.createSpy('callback').and.callFake(function(current) {
        return !!current.id;
      });

      var result = collection.every(callback);

      expect(result).toBe(true);
      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should check if some collection elements satisfies test', function() {
      var callback = jasmine.createSpy('callback').and.callFake(function(current) {
        return !!current.id;
      });

      var result = collection.some(callback);

      expect(result).toBe(true);
      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).not.toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should reduce collection from left to right', function() {
      var callback = jasmine.createSpy('callback').and.callFake(function(previous, current) {
        return previous + current.id;
      });

      var result = collection.reduce(callback, 0);

      expect(result).toBe(3);
      expect(callback).toHaveBeenCalledWith(0, collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(1, collection[1], 1, collection);
    });

    it('should reduce collection from right to left', function() {
      var callback = jasmine.createSpy('callback').and.callFake(function(previous, current) {
        return previous + current.id;
      });

      var result = collection.reduceRight(callback, 0);

      expect(result).toBe(3);
      expect(callback).toHaveBeenCalledWith(0, collection[1], 1, collection);
      expect(callback).toHaveBeenCalledWith(2, collection[0], 0, collection);
    });

    it('should filter collection', function() {
      var callback = jasmine.createSpy('callback').and.callFake(function(current) {
        return current.id === 2;
      });

      var results = collection.filter(callback);

      expect(results).toEqual([collection[1]]);
      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should reject collection', function() {
      var callback = jasmine.createSpy('callback').and.callFake(function(current) {
        return current.id === 2;
      });

      var results = collection.reject(callback);

      expect(results).toEqual([collection[0]]);
      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should find element in collection', function() {
      var callback = jasmine.createSpy('callback').and.callFake(function(current) {
        return current.id === 2;
      });

      var result = collection.find(callback);

      expect(result).toBe(collection[1]);
      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should find element index in collection', function() {
      var callback = jasmine.createSpy('callback').and.callFake(function(current) {
        return current.id === 2;
      });

      var result = collection.findIndex(callback);

      expect(result).toBe(1);
      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should partition array', function() {
      var callback = jasmine.createSpy('callback').and.callFake(function(value) {
        return value.id % 2 === 0;
      });

      var partition = collection.partition(callback);

      expect(partition).toEqual([
        [collection[1]],
        [collection[0]]
      ]);

      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should pluck collection', function() {
      collection[0].foo = { id: 1 };
      collection[1].foo = { id: 2 };

      var result1 = collection.pluck('id');
      var result2 = collection.pluck('foo.id');

      expect(result1).toEqual(result2);
      expect(result1).toEqual([1, 2]);
    });

    it('should index collection', function() {
      collection[0].foo = { id: 1 };
      collection[1].foo = { id: 2 };

      var callback = jasmine.createSpy('callback').and.callFake(function(value) {
        return value.id;
      });

      var result1 = collection.indexBy(callback);
      var result2 = collection.indexBy('id');
      var result3 = collection.indexBy('foo.id');

      expect(result1).toEqual(result2);
      expect(result1).toEqual(result3);
      expect(result1).toEqual({
        1: collection[0],
        2: collection[1]
      });

      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should group collection', function() {
      collection[0].foo = { id: 1 };
      collection[1].foo = { id: 2 };

      var callback = jasmine.createSpy('callback').and.callFake(function(value) {
        return value.id;
      });

      var result1 = collection.groupBy(callback);
      var result2 = collection.groupBy('id');
      var result3 = collection.groupBy('foo.id');

      expect(result1).toEqual(result2);
      expect(result1).toEqual(result3);
      expect(result1).toEqual({
        1: [collection[0]],
        2: [collection[1]]
      });

      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should group collection', function() {
      collection[0].foo = { id: 1 };
      collection[1].foo = { id: 2 };

      var callback = jasmine.createSpy('callback').and.callFake(function(value) {
        return value.id;
      });

      var result1 = collection.countBy(callback);
      var result2 = collection.countBy('id');
      var result3 = collection.countBy('foo.id');

      expect(result1).toEqual(result2);
      expect(result1).toEqual(result3);
      expect(result1).toEqual({
        1: 1,
        2: 1
      });

      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });
  });
});
