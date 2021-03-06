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

describe('Unsorted collection', () => {

  let o0;
  let o1;
  let o2;
  let o3;
  let o4;
  let collection;

  beforeEach(() => {
    o0 = { id: 0, name: 'foobar' };
    o1 = { id: 1, name: 'foo' };
    o2 = { id: 2, name: 'bar' };
    o3 = { id: 3, name: 'foobar' };
    o4 = { id: 4, name: 'foobar' };

    collection = new Collection([o1, o2]);
    expect(collection.length).toBe(2);

    jasmine.clock().tick(1);

    spyOn(Collection.prototype, 'notify').and.callThrough();
  });

  it('should remove last element', () => {
    const removedElement = collection.pop();

    expect(removedElement).toBe(o2);
    expect(collection.length).toBe(1);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBeUndefined();
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([{
      addedCount: 0,
      added: [],
      index: 1,
      removed: [o2],
      type: 'splice',
      object: collection
    }]);
  });

  it('should remove first element', () => {
    const removedElement = collection.shift();

    expect(removedElement).toBe(o1);
    expect(collection.length).toBe(1);
    expect(collection[0]).toBe(o2);
    expect(collection[1]).toBeUndefined();
    expect(collection.$$map).toEqual(createMap({
      2: { idx: 0 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([{
      addedCount: 0,
      added: [],
      index: 0,
      removed: [o1],
      type: 'splice',
      object: collection
    }]);
  });

  it('should push new elements at the end', () => {
    const newLength = collection.push(o0, o3);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 2, added: [o0, o3], index: 2, removed: [], object: collection }
    ]);
  });

  it('should unshift new elements', () => {
    const newLength = collection.unshift(o3, o4);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 2, added: [o3, o4], index: 0, removed: [], object: collection }
    ]);
  });

  it('should add elements at given index', () => {
    collection = new Collection([o0, o1, o2, o3]);
    expect(collection.length).toBe(4);

    const newLength = collection.add([o4], 2);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [o4], index: 2, removed: [], object: collection }
    ]);
  });

  it('should add elements at the end by default', () => {
    collection = new Collection([o0, o1, o2, o3]);
    expect(collection.length).toBe(4);

    const newLength = collection.add([o4]);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [o4], index: 4, removed: [], object: collection }
    ]);
  });

  it('should add elements at the beginning with zero', () => {
    collection = new Collection([o0, o1, o2, o3]);
    expect(collection.length).toBe(4);

    const newLength = collection.add([o4], 0);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [o4], index: 0, removed: [], object: collection }
    ]);
  });

  it('should not changed collection using splice with no args', () => {
    collection = new Collection([o1, o2, o3]);
    collection.notify.calls.reset();

    const removed = collection.splice();

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

    expect(collection.notify).not.toHaveBeenCalled();
  });

  it('should remove element using splice with two argument', () => {
    collection = new Collection([o1, o2, o3]);
    collection.notify.calls.reset();

    const removed = collection.splice(1, 1);

    expect(removed).toEqual([o2]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o3);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      3: { idx: 1 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 1, removed: [o2], object: collection }
    ]);
  });

  it('should remove element using splice with negative argument', () => {
    collection = new Collection([o1, o2, o3]);

    const removed = collection.splice(-1, 1);

    expect(removed).toEqual([o3]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 2, removed: [o3], object: collection }
    ]);
  });

  it('should remove element and add new one using splice', () => {
    collection = new Collection([o1, o2, o3]);

    const removed = collection.splice(1, 1, o4);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [o4], index: 1, removed: [o2], object: collection }
    ]);
  });

  it('should remove element and add new one using splice', () => {
    collection = new Collection([o1, o2]);

    const removed = collection.splice(1, 1, o3, o4);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 2, added: [o3, o4], index: 1, removed: [o2], object: collection }
    ]);
  });

  it('should replace existing data using splice', () => {
    collection = new Collection([o1, o2]);
    const removed = collection.splice(0, 0, o1);

    expect(removed).toEqual([]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, added: [], index: 0, removed: [], object: collection }
    ]);
  });

  it('should replace existing data and add new data using splice', () => {
    collection = new Collection([o1, o2]);
    const removed = collection.splice(2, 0, o1, o3);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [o3], index: 2, removed: [], object: collection }
    ]);

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, added: [], index: 0, removed: [], object: collection }
    ]);
  });

  it('should replace existing data and add new data using splice and keep order', () => {
    collection = new Collection([o1, o2]);
    const removed = collection.splice(0, 0, o1, o3);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [o3], index: 0, removed: [], object: collection }
    ]);

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, added: [], index: 1, removed: [], object: collection }
    ]);
  });

  it('should remove element using start index', () => {
    collection = new Collection([o1, o2, o3, o4]);
    expect(collection.length).toBe(4);

    const removed = collection.remove(2);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 2, removed: [o3, o4], object: collection }
    ]);
  });

  it('should remove element using index and delete count', () => {
    collection = new Collection([o1, o2, o3, o4]);
    expect(collection.length).toBe(4);

    const removed = collection.remove(2, 1);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 2, removed: [o3], object: collection }
    ]);
  });

  it('should remove element using predicate', () => {
    collection = new Collection([o1, o2, o3, o4]);
    expect(collection.length).toBe(4);

    const removed = collection.remove(o => o.id % 2 !== 0);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 0, removed: [o1], object: collection },
      { type: 'splice', addedCount: 0, added: [], index: 2, removed: [o3], object: collection }
    ]);
  });

  it('should remove element using predicate and merge changes', () => {
    collection = new Collection([o1, o2, o3, o4]);
    expect(collection.length).toBe(4);

    const removed = collection.remove(o => o.id <= 2);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 0, removed: [o1, o2], object: collection }
    ]);
  });

  it('should remove array of elements', () => {
    collection = new Collection([o1, o2, o3, o4]);
    expect(collection.length).toBe(4);

    const removed = collection.remove([o1, o3]);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 0, removed: [o1], object: collection },
      { type: 'splice', addedCount: 0, added: [], index: 2, removed: [o3], object: collection }
    ]);
  });

  it('should remove single element', () => {
    collection = new Collection([o1, o2, o3, o4]);
    expect(collection.length).toBe(4);

    const removed = collection.remove([o1]);

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

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 0, removed: [o1], object: collection },
    ]);
  });

  it('should reverse collection with odd length', () => {
    collection = new Collection([o1, o2]);

    const result = collection.reverse();

    expect(result).toBe(collection);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o2);
    expect(collection[1]).toBe(o1);

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, added: [], index: 0, removed: [], object: collection },
      { type: 'update', addedCount: 0, added: [], index: 1, removed: [], object: collection }
    ]);
  });

  it('should reverse collection with even length', () => {
    collection = new Collection([o1, o2, o3]);

    const result = collection.reverse();

    expect(result).toBe(collection);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o3);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o1);

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, added: [], index: 0, removed: [], object: collection },
      { type: 'update', addedCount: 0, added: [], index: 2, removed: [], object: collection }
    ]);
  });

  it('should replace data', () => {
    collection = new Collection([o1, o2, o3]);

    spyOn(collection, 'splice').and.callThrough();

    const clone = {
      id: 1,
      name: 'foo bar'
    };

    collection.replace(clone);

    expect(collection[0]).not.toBe(o1);
    expect(collection[0]).toBe(clone);
    expect(collection.splice).not.toHaveBeenCalled();
    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, added: [], index: 0, removed: [], object: collection }
    ]);
  });

  it('should not replace unknown data', () => {
    const data = {
      id: 50,
      name: 'foo bar'
    };

    const replace = () => collection.replace(data);

    expect(replace).toThrow(Error('Data to replace is not in collection !'));
  });
});
