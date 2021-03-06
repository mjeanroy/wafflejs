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

describe('collection', () => {

  it('should initialize empty collection', () => {
    const collection = new Collection();
    expect(collection.length).toBe(0);
    expect(collection.$$map).toEqual(createMap());
    expect(collection.$$model).toBe(Object);
    expect(collection.$$key).toEqual(jasmine.any(Function));

    const id = collection.$$key({ id: 1 });
    expect(id).toBe(1);
  });

  it('should initialize empty collection with id attribute', () => {
    const collection = new Collection([], {
      key: 'name'
    });

    expect(collection.length).toBe(0);
    expect(collection.$$map).toEqual(createMap());
    expect(collection.$$model).toBe(Object);
    expect(collection.$$key).toEqual(jasmine.any(Function));

    const name = collection.$$key({ id: 1, name: 'foo' });
    expect(name).toBe('foo');
  });

  it('should initialize empty collection with model constructor', () => {
    const Model = () => { };

    const collection = new Collection([], {
      key: 'name',
      model: Model
    });

    expect(collection.length).toBe(0);
    expect(collection.$$map).toEqual(createMap());
    expect(collection.$$model).toBe(Model);
    expect(collection.$$key).toEqual(jasmine.any(Function));
  });

  it('should initialize collection with array', () => {
    const o1 = { id: 1, name: 'foo' };
    const o2 = { id: 2, name: 'bar' };
    const items = [o1, o2];

    const collection = new Collection(items);

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

  it('should initialize collection with array and model constructor', () => {
    class Model {
      constructor(data) {
        this.id = data.id;
        this.name = data.name;
      }
    }

    const o1 = { id: 1, name: 'foo' };
    const o2 = { id: 2, name: 'bar' };
    const items = [o1, o2];

    const collection = new Collection(items, {
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

  describe('once initialized', () => {
    let o1;
    let o2;
    let collection;

    beforeEach(() => {
      class Model {
        constructor(id, name) {
          this.id = id;
          this.name = name;
        }

        toString() {
          return this.id.toString();
        }
      }

      o1 = new Model(1, 'foo');
      o2 = new Model(2, 'bar');

      collection = new Collection([o1, o2]);
      expect(collection.length).toBe(2);

      jasmine.clock().tick(1);
    });

    it('should get collection options', () => {
      const options = collection.options();
      expect(options).toEqual({
        model: collection.$$model,
        key: collection.$$key
      });
    });

    it('should fail if added value is not object', () => {
      const o1 = { id: 1, name: 'foo' };
      const o2 = { id: 2, name: 'bar' };
      const o3 = { id: 3, name: 'foo' };
      const o4 = null;
      const collection = new Collection([o1, o2]);

      const push = () => collection.push(o3, o4);
      const unshift = () => collection.unshift(o3, o4);
      const add = () => collection.add([o3, o4], 0);
      const splice = () => collection.splice(0, 0, o3, o4);

      const error = new Error('Waffle collections are not array, only object are allowed');

      expect(push).toThrow(error);
      expect(unshift).toThrow(error);
      expect(add).toThrow(error);
      expect(splice).toThrow(error);

      // Check collection has not been updated
      expect(collection.length).toBe(2);
      expect(collection[0]).toBe(o1);
      expect(collection[1]).toBe(o2);
    });

    it('should fail if added value is does not have an id', () => {
      const o1 = { name: 'foo' };
      const collection = new Collection([]);

      const create = () => new Collection([o1]);
      const push = () => collection.push(o1);
      const unshift = () => collection.unshift(o1);
      const add = () => collection.add([o1], 0);
      const splice = () => collection.splice(0, 0, o1);

      const error = new Error('Collection elements must have an id, you probably missed to specify the id key on initialization ?');

      expect(create).toThrow(error);
      expect(push).toThrow(error);
      expect(unshift).toThrow(error);
      expect(add).toThrow(error);
      expect(splice).toThrow(error);

      // Check collection has not been updated
      expect(collection.length).toBe(0);
    });

    it('get element by key', () => {
      const o1 = { id: 1, name: 'foo' };
      const o2 = { id: 2, name: 'bar' };
      const items = [o1, o2];

      const collection = new Collection(items);

      expect(collection.byKey(1)).toBe(o1);
      expect(collection.byKey(2)).toBe(o2);
      expect(collection.byKey(3)).toBe(undefined);
    });

    it('should join elements', () => {
      expect(collection.join()).toBe('1,2');
      expect(collection.join(';')).toBe('1;2');
    });

    it('should get string value', () => {
      expect(collection.toString()).toBe('1,2');
    });

    it('should get locale string value', () => {
      const expectedValue = ['1', '2'].toLocaleString();
      expect(collection.toLocaleString()).toBe(expectedValue);
    });

    it('should get json representation', () => {
      expect(collection.toJSON()).toEqual(JSON.stringify([o1, o2]));
    });

    it('should check if collection is empty', () => {
      expect(new Collection().isEmpty()).toBe(true);
      expect(collection.isEmpty()).toBe(false);
    });

    it('should get size of collection', () => {
      expect(new Collection().size()).toBe(0);
      expect(collection.size()).toBe(2);
    });

    it('should get element at index', () => {
      expect(collection.at(0)).toBe(o1);
      expect(collection.at(1)).toBe(o2);
    });

    it('should concat collections', () => {
      const o3 = { id: 3 };
      const o4 = { id: 4 };

      const newCollection = collection.concat([o3, o4]);

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

    it('should slice entire collection', () => {
      const c1 = collection.slice();
      jasmine.clock().tick(1);
      expect(c1).toEqual(collection);

      const c2 = collection.slice(0);
      jasmine.clock().tick(1);
      expect(c2).toEqual(collection);

      const c3 = collection.slice(0, collection.length);
      jasmine.clock().tick(1);
      expect(c3).toEqual(collection);
    });

    it('should split collection into chunks', () => {
      const chunks = collection.split(1);
      expect(chunks).toEqual([[o1], [o2]]);
    });

    it('should split collection into chunks of two elements', () => {
      const o1 = { id: 1 };
      const o2 = { id: 2 };
      const o3 = { id: 3 };
      collection = new Collection([o1, o2, o3]);

      const chunks = collection.split(2);

      expect(chunks).toEqual([[o1, o2], [o3]]);
    });

    it('should clear collection', () => {
      spyOn(collection, 'notify').and.callThrough();

      const old1 = collection[0];
      const old2 = collection[1];

      collection.clear();

      expect(collection.$$map).toEqual(createMap());
      expect(collection.length).toBe(0);
      expect(collection[0]).toBeUndefined();
      expect(collection[1]).toBeUndefined();

      expect(collection.notify).toHaveBeenCalledWith({
        type: 'splice',
        removed: [old1, old2],
        index: 0,
        addedCount: 0,
        added: [],
        object: collection
      });
    });

    it('should reset collection', () => {
      spyOn(collection, 'notify').and.callThrough();

      expect(collection.length).toBe(2);

      const o3 = {
        id: 3,
        name: 'foo3'
      };

      const o4 = {
        id: 4,
        name: 'foo4'
      };

      const o5 = {
        id: 5,
        name: 'foo5'
      };

      collection.reset([o3, o4, o5]);

      expect(collection.length).toBe(3);
      expect(collection[0]).toBe(o3);
      expect(collection[1]).toBe(o4);
      expect(collection[2]).toBe(o5);

      expect(collection.notify).toHaveBeenCalledWith([
        { type: 'splice', removed: [o1, o2], addedCount: 3, added: [o3, o4, o5], index: 0, object: collection }
      ]);
    });

    it('should reset collection and push new elements', () => {
      spyOn(collection, 'notify').and.callThrough();

      expect(collection.length).toBe(2);

      const newElements = [];
      for (let i = 0; i < 10; i++) {
        newElements.push({
          id: i,
          name: 'foo' + i
        });
      }

      collection.reset(newElements);

      expect(collection.length).toBe(10);

      for (let k = 0; k < 10; k++) {
        expect(collection[k]).toBe(newElements[k]);
      }

      expect(collection.notify).toHaveBeenCalledWith([
        { type: 'splice', removed: [o1, o2], addedCount: 10, added: newElements, index: 0, object: collection }
      ]);
    });

    it('should reset collection and notify with models', () => {
      class Model {
        constructor(o) {
          this.id = o.id;
          this.name = o.name;
          this.toString = o.toString;
        }
      }

      collection = new Collection([o1, o2], {
        model: Model
      });

      expect(collection.length).toBe(2);

      const o3 = {
        id: 3,
        name: 'foo3'
      };

      jasmine.clock().tick();
      spyOn(collection, 'notify').and.callThrough();

      collection.reset([o3]);

      expect(collection.length).toBe(1);
      expect(collection[0]).toEqual(jasmine.objectContaining(o3));

      expect(collection.notify).toHaveBeenCalledWith([
        {
          type: 'splice',
          removed: [jasmine.objectContaining(o1), jasmine.objectContaining(o2)],
          addedCount: 1,
          added: [jasmine.objectContaining(o3)],
          index: 0,
          object: collection
        }
      ]);

      const added = collection.notify.calls.mostRecent().args[0][0].added;
      expect(added[0]).toBeInstanceOf(Model);
    });

    it('should reset collection with order', () => {
      class Model {
        constructor(data) {
          this.id = data.id;
        }

        name() {
          return 'foo ' + this.id;
        }
      }

      const sortFn = jasmine.createSpy('sortFn').and.callFake((o1, o2) => o1.name().localeCompare(o2.name()));
      const m1 = { id: 1 };
      const m2 = { id: 2 };
      const collection = new Collection([m1, m2], {
        model: Model
      });

      collection.sort(sortFn);

      expect(collection.length).toBe(2);
      expect(collection[0]).toEqual(jasmine.objectContaining(m1));
      expect(collection[1]).toEqual(jasmine.objectContaining(m2));

      const m3 = { id: 3 };
      const m4 = { id: 4 };

      collection.reset([m4, m3]);

      expect(collection.length).toBe(2);
      expect(collection[0]).toEqual(jasmine.objectContaining(m3));
      expect(collection[1]).toEqual(jasmine.objectContaining(m4));
    });

    it('should remove array data', () => {
      spyOn(collection, 'splice').and.callThrough();
      spyOn(collection, 'notify').and.callThrough();

      const old1 = collection[0];
      const old2 = collection[1];

      collection.notify.calls.reset();
      collection.splice.calls.reset();

      collection.remove([old1]);

      expect(collection.splice).not.toHaveBeenCalled();

      expect(collection.$$map).toEqual(createMap({
        2: { idx: 0 }
      }));

      expect(collection.length).toBe(1);
      expect(collection[0]).toBe(old2);
      expect(collection[1]).toBeUndefined();

      expect(collection.notify).toHaveBeenCalledWith([{
        type: 'splice',
        removed: [old1],
        index: 0,
        addedCount: 0,
        added: [],
        object: collection
      }]);
    });

    it('should remove single data', () => {
      spyOn(collection, 'splice').and.callThrough();
      spyOn(collection, 'notify').and.callThrough();

      const old1 = collection[0];
      const old2 = collection[1];

      collection.splice.calls.reset();
      collection.notify.calls.reset();

      collection.remove(old1);

      expect(collection.splice).toHaveBeenCalledWith(0, 1);

      expect(collection.$$map).toEqual(createMap({
        2: { idx: 0 }
      }));

      expect(collection.length).toBe(1);
      expect(collection[0]).toBe(old2);
      expect(collection[1]).toBeUndefined();

      expect(collection.notify).toHaveBeenCalledWith([{
        type: 'splice',
        removed: [old1],
        index: 0,
        addedCount: 0,
        added: [],
        object: collection
      }]);
    });

    it('should remove data with a predicate', () => {
      spyOn(collection, 'splice').and.callThrough();
      spyOn(collection, 'notify').and.callThrough();

      const old1 = collection[0];
      const old2 = collection[1];

      collection.splice.calls.reset();
      collection.notify.calls.reset();

      collection.remove(current => current.id === old1.id);

      expect(collection.splice).not.toHaveBeenCalled();

      expect(collection.$$map).toEqual(createMap({
        2: { idx: 0 }
      }));

      expect(collection.length).toBe(1);
      expect(collection[0]).toBe(old2);
      expect(collection[1]).toBeUndefined();

      expect(collection.notify).toHaveBeenCalledWith([{
        type: 'splice',
        removed: [old1],
        index: 0,
        addedCount: 0,
        added: [],
        object: collection
      }]);
    });

    it('should not remove unknown data', () => {
      spyOn(collection, 'splice').and.callThrough();
      spyOn(collection, 'notify').and.callThrough();

      collection.splice.calls.reset();
      collection.notify.calls.reset();

      const removed = collection.remove({
        id: 5
      });

      expect(removed).toEqual([]);
      expect(collection.splice).not.toHaveBeenCalled();
      expect(collection.notify).not.toHaveBeenCalled();
    });

    it('should slice part of collection', () => {
      const results = collection.slice(0, 1);
      expect(results.length).toBe(1);
      expect(results[0]).toBe(collection[0]);
      expect(results.$$map).toEqual(createMap({
        1: { idx: 0 }
      }));
    });

    it('should get index of element', () => {
      expect(collection.indexOf(o1)).toBe(0);
      expect(collection.indexOf(o2)).toBe(1);
      expect(collection.indexOf({ id: 3 })).toBe(-1);

      expect(collection.indexOf(1)).toBe(0);
      expect(collection.indexOf(2)).toBe(1);
      expect(collection.indexOf(3)).toBe(-1);
    });

    it('should get last index of element', () => {
      expect(collection.lastIndexOf(o1)).toBe(0);
      expect(collection.lastIndexOf(o2)).toBe(1);
      expect(collection.lastIndexOf({ id: 3 })).toBe(-1);

      expect(collection.lastIndexOf(1)).toBe(0);
      expect(collection.lastIndexOf(2)).toBe(1);
      expect(collection.lastIndexOf(3)).toBe(-1);
    });

    it('should check if collection contains data', () => {
      expect(collection.contains(o1)).toBeTrue();
      expect(collection.contains(o2)).toBeTrue();
      expect(collection.contains({ id: 3 })).toBeFalse();

      expect(collection.contains(1)).toBeTrue();
      expect(collection.contains(2)).toBeTrue();
      expect(collection.contains(3)).toBeFalse();
    });

    it('should toggle data', () => {
      expect(collection.contains(o1)).toBeTrue();

      spyOn(collection, 'push').and.callThrough();
      spyOn(collection, 'remove').and.callThrough();

      collection.toggle(o1);
      expect(collection.contains(o1)).toBeFalse();
      expect(collection.remove).toHaveBeenCalledWith(0, 1);
      expect(collection.push).not.toHaveBeenCalled();

      collection.remove.calls.reset();
      collection.push.calls.reset();

      collection.toggle(o1);
      expect(collection.contains(o1)).toBeTrue();
      expect(collection.push).toHaveBeenCalledWith(o1);
      expect(collection.remove).not.toHaveBeenCalled();
    });

    it('should get first element of collection', () => {
      expect(collection.first()).toBe(o1);
      expect(collection.first(1)).toEqual([o1]);
      expect(collection.first(2)).toEqual([o1, o2]);
    });

    it('should get last element of collection', () => {
      expect(collection.last()).toBe(o2);
      expect(collection.last(1)).toEqual([o2]);
      expect(collection.last(2)).toEqual([o1, o2]);
    });

    it('should get rest of collection', () => {
      expect(collection.rest()).toEqual([o2]);
      expect(collection.rest(1)).toEqual([o2]);
      expect(collection.rest(2)).toEqual([]);
    });

    it('should get initial elements of collection', () => {
      expect(collection.initial()).toEqual([o1]);
      expect(collection.initial(1)).toEqual([o1]);
      expect(collection.initial(2)).toEqual([]);
    });

    it('should apply callback on each elements', () => {
      const callback = jasmine.createSpy('callback');

      collection.forEach(callback);

      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should map elements', () => {
      const callback = jasmine.createSpy('callback').and.callFake(current => current.id);
      const newArray = collection.map(callback);

      expect(newArray.length).toBe(2);
      expect(newArray[0]).toBe(collection[0].id);
      expect(newArray[1]).toBe(collection[1].id);

      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should check if every collection elements satisfies test', () => {
      const callback = jasmine.createSpy('callback').and.callFake(current => !!current.id);
      const result = collection.every(callback);

      expect(result).toBe(true);
      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should check if some collection elements satisfies test', () => {
      const callback = jasmine.createSpy('callback').and.callFake(current => !!current.id);
      const result = collection.some(callback);

      expect(result).toBe(true);
      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).not.toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should reduce collection from left to right', () => {
      const callback = jasmine.createSpy('callback').and.callFake((previous, current) => previous + current.id);
      const result = collection.reduce(callback, 0);

      expect(result).toBe(3);
      expect(callback).toHaveBeenCalledWith(0, collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(1, collection[1], 1, collection);
    });

    it('should reduce collection from right to left', () => {
      const callback = jasmine.createSpy('callback').and.callFake((previous, current) => previous + current.id);
      const result = collection.reduceRight(callback, 0);

      expect(result).toBe(3);
      expect(callback).toHaveBeenCalledWith(0, collection[1], 1, collection);
      expect(callback).toHaveBeenCalledWith(2, collection[0], 0, collection);
    });

    it('should filter collection', () => {
      const callback = jasmine.createSpy('callback').and.callFake(current => current.id === 2);
      const results = collection.filter(callback);

      expect(results).toEqual([collection[1]]);
      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should reject collection', () => {
      const callback = jasmine.createSpy('callback').and.callFake(current => current.id === 2);
      const results = collection.reject(callback);

      expect(results).toEqual([collection[0]]);
      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should find element in collection', () => {
      const callback = jasmine.createSpy('callback').and.callFake(current => current.id === 2);
      const result = collection.find(callback);

      expect(result).toBe(collection[1]);
      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should find element index in collection', () => {
      const callback = jasmine.createSpy('callback').and.callFake(current => current.id === 2);
      const result = collection.findIndex(callback);

      expect(result).toBe(1);
      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should return -1 if element index in collection is not found', () => {
      const callback = jasmine.createSpy('callback').and.callFake(current => false);
      const result = collection.findIndex(callback);

      expect(result).toBe(-1);
      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should partition array', () => {
      const callback = jasmine.createSpy('callback').and.callFake(value => value.id % 2 === 0);
      const partition = collection.partition(callback);

      expect(partition).toEqual([
        [collection[1]],
        [collection[0]]
      ]);

      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should pluck collection', () => {
      collection[0].foo = { id: 1 };
      collection[1].foo = { id: 2 };

      const result1 = collection.pluck('id');
      const result2 = collection.pluck('foo.id');

      expect(result1).toEqual(result2);
      expect(result1).toEqual([1, 2]);
    });

    it('should index collection', () => {
      collection[0].foo = { id: 1 };
      collection[1].foo = { id: 2 };

      const callback = jasmine.createSpy('callback').and.callFake(value => value.id);
      const result1 = collection.indexBy(callback);
      const result2 = collection.indexBy('id');
      const result3 = collection.indexBy('foo.id');

      expect(result1).toEqual(result2);
      expect(result1).toEqual(result3);
      expect(result1).toEqual({
        1: collection[0],
        2: collection[1]
      });

      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should group collection', () => {
      collection[0].foo = { id: 1 };
      collection[1].foo = { id: 2 };

      const callback = jasmine.createSpy('callback').and.callFake(value => value.id);
      const result1 = collection.groupBy(callback);
      const result2 = collection.groupBy('id');
      const result3 = collection.groupBy('foo.id');

      expect(result1).toEqual(result2);
      expect(result1).toEqual(result3);
      expect(result1).toEqual({
        1: [collection[0]],
        2: [collection[1]]
      });

      expect(callback).toHaveBeenCalledWith(collection[0], 0, collection);
      expect(callback).toHaveBeenCalledWith(collection[1], 1, collection);
    });

    it('should group collection', () => {
      collection[0].foo = { id: 1 };
      collection[1].foo = { id: 2 };

      const callback = jasmine.createSpy('callback').and.callFake(value => value.id);
      const result1 = collection.countBy(callback);
      const result2 = collection.countBy('id');
      const result3 = collection.countBy('foo.id');

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
