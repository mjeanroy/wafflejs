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

describe('Unsorted collection', function() {

  var o0;
  var o1;
  var o2;
  var o3;
  var o4;
  var collection;

  beforeEach(function() {
    o0 = { id: 0, name: 'foobar' };
    o1 = { id: 1, name: 'foo' };
    o2 = { id: 2, name: 'bar' };
    o3 = { id: 3, name: 'foobar' };
    o4 = { id: 4, name: 'foobar' };

    collection = new Collection([o1, o2]);
    expect(collection.length).toBe(2);

    jasmine.clock().tick(1);

    spyOn(Collection.prototype, 'trigger').and.callThrough();
  });

  it('should remove last element', function() {
    var removedElement = collection.pop();

    expect(removedElement).toBe(o2);
    expect(collection.length).toBe(1);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBeUndefined();
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([{
      addedCount: 0,
      index: 1,
      removed: [o2],
      type: 'splice',
      object: collection
    }]);
  });

  it('should remove first element', function() {
    var removedElement = collection.shift();

    expect(removedElement).toBe(o1);
    expect(collection.length).toBe(1);
    expect(collection[0]).toBe(o2);
    expect(collection[1]).toBeUndefined();
    expect(collection.$$map).toEqual(createMap({
      2: { idx: 0 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([{
      addedCount: 0,
      index: 0,
      removed: [o1],
      type: 'splice',
      object: collection
    }]);
  });

  it('should push new elements at the end', function() {
    var newLength = collection.push(o0, o3);

    expect(newLength).toBe(4);
    expect(collection.length).toBe(4);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o0);
    expect(collection[3]).toBe(o3);

    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      0: { idx: 2 },
      3: { idx: 3 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 2, index: 2, removed: [], object: collection }
    ]);
  });

  it('should unshift new elements', function() {
    var newLength = collection.unshift(o3, o4);

    expect(newLength).toBe(4);
    expect(collection.length).toBe(4);
    expect(collection[0]).toBe(o3);
    expect(collection[1]).toBe(o4);
    expect(collection[2]).toBe(o1);
    expect(collection[3]).toBe(o2);

    expect(collection.$$map).toEqual(createMap({
      1: { idx: 2 },
      2: { idx: 3 },
      3: { idx: 0 },
      4: { idx: 1 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 2, index: 0, removed: [], object: collection }
    ]);
  });

  it('should add elements at given index', function() {
    collection = new Collection([o0, o1, o2, o3]);
    expect(collection.length).toBe(4);

    var newLength = collection.add([o4], 2);

    expect(newLength).toBe(5);
    expect(collection.length).toBe(5);
    expect(collection[0]).toBe(o0);
    expect(collection[1]).toBe(o1);
    expect(collection[2]).toBe(o4);
    expect(collection[3]).toBe(o2);
    expect(collection[4]).toBe(o3);

    expect(collection.$$map).toEqual(createMap({
      0: { idx: 0 },
      1: { idx: 1 },
      4: { idx: 2 },
      2: { idx: 3 },
      3: { idx: 4 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, index: 2, removed: [], object: collection }
    ]);
  });

  it('should add elements at the end by default', function() {
    collection = new Collection([o0, o1, o2, o3]);
    expect(collection.length).toBe(4);

    var newLength = collection.add([o4]);

    expect(newLength).toBe(5);
    expect(collection.length).toBe(5);
    expect(collection[0]).toBe(o0);
    expect(collection[1]).toBe(o1);
    expect(collection[2]).toBe(o2);
    expect(collection[3]).toBe(o3);
    expect(collection[4]).toBe(o4);

    expect(collection.$$map).toEqual(createMap({
      0: { idx: 0 },
      1: { idx: 1 },
      2: { idx: 2 },
      3: { idx: 3 },
      4: { idx: 4 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, index: 4, removed: [], object: collection }
    ]);
  });

  it('should add elements at the beginning with zero', function() {
    collection = new Collection([o0, o1, o2, o3]);
    expect(collection.length).toBe(4);

    var newLength = collection.add([o4], 0);

    expect(newLength).toBe(5);
    expect(collection.length).toBe(5);
    expect(collection[0]).toBe(o4);
    expect(collection[1]).toBe(o0);
    expect(collection[2]).toBe(o1);
    expect(collection[3]).toBe(o2);
    expect(collection[4]).toBe(o3);

    expect(collection.$$map).toEqual(createMap({
      4: { idx: 0 },
      0: { idx: 1 },
      1: { idx: 2 },
      2: { idx: 3 },
      3: { idx: 4 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, index: 0, removed: [], object: collection }
    ]);
  });

  it('should not changed collection using splice with no args', function() {
    collection = new Collection([o1, o2, o3]);
    collection.trigger.calls.reset();

    var removed = collection.splice();

    expect(removed).toEqual([]);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o3);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      3: { idx: 2 }
    }));

    expect(collection.trigger).not.toHaveBeenCalled();
  });

  it('should remove element using splice with two argument', function() {
    collection = new Collection([o1, o2, o3]);
    collection.trigger.calls.reset();

    var removed = collection.splice(1, 1);

    expect(removed).toEqual([o2]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o3);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      3: { idx: 1 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, index: 1, removed: [o2], object: collection }
    ]);
  });

  it('should remove element using splice with negative argument', function() {
    collection = new Collection([o1, o2, o3]);

    var removed = collection.splice(-1, 1);

    expect(removed).toEqual([o3]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, index: 2, removed: [o3], object: collection }
    ]);
  });

  it('should remove element and add new one using splice', function() {
    collection = new Collection([o1, o2, o3]);

    var removed = collection.splice(1, 1, o4);

    expect(removed).toEqual([o2]);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o4);
    expect(collection[2]).toBe(o3);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      4: { idx: 1 },
      3: { idx: 2 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, index: 1, removed: [o2], object: collection }
    ]);
  });

  it('should remove element and add new one using splice', function() {
    collection = new Collection([o1, o2]);

    var removed = collection.splice(1, 1, o3, o4);

    expect(removed).toEqual([o2]);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o3);
    expect(collection[2]).toBe(o4);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      3: { idx: 1 },
      4: { idx: 2 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 2, index: 1, removed: [o2], object: collection }
    ]);
  });

  it('should replace existing data using splice', function() {
    collection = new Collection([o1, o2]);
    var removed = collection.splice(0, 0, o1);

    expect(removed).toEqual([]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, index: 0, removed: [], object: collection }
    ]);
  });

  it('should replace existing data and add new data using splice', function() {
    collection = new Collection([o1, o2]);
    var removed = collection.splice(2, 0, o1, o3);

    expect(removed).toEqual([]);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o3);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      3: { idx: 2 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, index: 2, removed: [], object: collection },
      { type: 'update', addedCount: 0, index: 0, removed: [], object: collection }
    ]);
  });

  it('should replace existing data and add new data using splice and keep order', function() {
    collection = new Collection([o1, o2]);
    var removed = collection.splice(0, 0, o1, o3);

    expect(removed).toEqual([]);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o3);
    expect(collection[1]).toBe(o1);
    expect(collection[2]).toBe(o2);
    expect(collection.$$map).toEqual(createMap({
      3: { idx: 0 },
      1: { idx: 1 },
      2: { idx: 2 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, index: 0, removed: [], object: collection },
      { type: 'update', addedCount: 0, index: 1, removed: [], object: collection }
    ]);
  });

  it('should remove element using start index', function() {
    collection = new Collection([o1, o2, o3, o4]);
    expect(collection.length).toBe(4);

    var removed = collection.remove(2);

    expect(removed).toEqual([o3, o4]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBeUndefined();
    expect(collection[3]).toBeUndefined();
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, index: 2, removed: [o3, o4], object: collection }
    ]);
  });

  it('should remove element using index and delete count', function() {
    collection = new Collection([o1, o2, o3, o4]);
    expect(collection.length).toBe(4);

    var removed = collection.remove(2, 1);

    expect(removed).toEqual([o3]);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o4);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      4: { idx: 2 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, index: 2, removed: [o3], object: collection }
    ]);
  });

  it('should remove element using predicate', function() {
    collection = new Collection([o1, o2, o3, o4]);
    expect(collection.length).toBe(4);

    var removed = collection.remove(function(o) {
      return o.id % 2 !== 0;
    });

    expect(removed).toEqual([o1, o3]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o2);
    expect(collection[1]).toBe(o4);
    expect(collection[2]).toBeUndefined();
    expect(collection[3]).toBeUndefined();
    expect(collection.$$map).toEqual(createMap({
      2: { idx: 0 },
      4: { idx: 1 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, index: 0, removed: [o1], object: collection },
      { type: 'splice', addedCount: 0, index: 2, removed: [o3], object: collection }
    ]);
  });

  it('should remove element using predicate and merge changes', function() {
    collection = new Collection([o1, o2, o3, o4]);
    expect(collection.length).toBe(4);

    var removed = collection.remove(function(o) {
      return o.id <= 2;
    });

    expect(removed).toEqual([o1, o2]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o3);
    expect(collection[1]).toBe(o4);
    expect(collection[2]).toBeUndefined();
    expect(collection[3]).toBeUndefined();
    expect(collection.$$map).toEqual(createMap({
      3: { idx: 0 },
      4: { idx: 1 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, index: 0, removed: [o1, o2], object: collection }
    ]);
  });

  it('should remove array of elements', function() {
    collection = new Collection([o1, o2, o3, o4]);
    expect(collection.length).toBe(4);

    var removed = collection.remove([o1, o3]);

    expect(removed).toEqual([o1, o3]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o2);
    expect(collection[1]).toBe(o4);
    expect(collection[2]).toBeUndefined();
    expect(collection[3]).toBeUndefined();
    expect(collection.$$map).toEqual(createMap({
      2: { idx: 0 },
      4: { idx: 1 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, index: 0, removed: [o1], object: collection },
      { type: 'splice', addedCount: 0, index: 2, removed: [o3], object: collection }
    ]);
  });

  it('should remove single element', function() {
    collection = new Collection([o1, o2, o3, o4]);
    expect(collection.length).toBe(4);

    var removed = collection.remove([o1]);

    expect(removed).toEqual([o1]);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o2);
    expect(collection[1]).toBe(o3);
    expect(collection[2]).toBe(o4);
    expect(collection[3]).toBeUndefined();
    expect(collection.$$map).toEqual(createMap({
      2: { idx: 0 },
      3: { idx: 1 },
      4: { idx: 2 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, index: 0, removed: [o1], object: collection },
    ]);
  });

  it('should reverse collection with odd length', function() {
    collection = new Collection([o1, o2]);

    var result = collection.reverse();

    expect(result).toBe(collection);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o2);
    expect(collection[1]).toBe(o1);

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, index: 0, removed: [], object: collection },
      { type: 'update', addedCount: 0, index: 1, removed: [], object: collection }
    ]);
  });

  it('should reverse collection with even length', function() {
    collection = new Collection([o1, o2, o3]);

    var result = collection.reverse();

    expect(result).toBe(collection);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o3);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o1);

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, index: 0, removed: [], object: collection },
      { type: 'update', addedCount: 0, index: 2, removed: [], object: collection }
    ]);
  });
});
