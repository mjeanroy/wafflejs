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

describe('Sorted collection', () => {

  let o1;
  let o2;
  let o5;
  let o10;
  let sortFn;
  let collection;

  beforeEach(() => {
    o1 = { id: 1, name: 'foo01' };
    o2 = { id: 2, name: 'foo02' };
    o5 = { id: 5, name: 'foo05' };
    o10 = { id: 10, name: 'foo10' };

    sortFn = jasmine.createSpy('sortFn').and.callFake((o1, o2) => o1.name.localeCompare(o2.name));

    collection = new Collection([o1, o10, o5, o2]);
    collection.sort(sortFn);
    expect(collection.length).toBe(4);

    jasmine.clock().tick(1);

    spyOn(Collection.prototype, 'notify').and.callThrough();
  });

  it('should sort collection', () => {
    collection = new Collection([o1, o10, o5, o2]);
    const result = collection.sort(sortFn);

    expect(result).toBe(collection);

    expect(collection.length).toBe(4);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o5);
    expect(collection[3]).toBe(o10);

    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      5: { idx: 2 },
      10: { idx: 3 }
    }));

    expect(collection.$$sortFn).toBe(sortFn);
  });

  it('should push elements in order', () => {
    const o6 = { id: 6, name: 'foo06' };
    const o7 = { id: 7, name: 'foo07' };

    const newLength = collection.push(o6, o7);

    expect(newLength).toBe(6);
    expect(collection.length).toBe(6);

    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o5);
    expect(collection[3]).toBe(o6);
    expect(collection[4]).toBe(o7);
    expect(collection[5]).toBe(o10);

    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      5: { idx: 2 },
      6: { idx: 3 },
      7: { idx: 4 },
      10: { idx: 5 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 2, added: [o6, o7], index: 3, removed: [], object: collection }
    ]);
  });

  it('should unshift elements in order', () => {
    const o6 = { id: 6, name: 'foo06' };
    const o7 = { id: 7, name: 'foo07' };

    const newLength = collection.unshift(o6, o7);

    expect(newLength).toBe(6);
    expect(collection.length).toBe(6);

    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o5);
    expect(collection[3]).toBe(o6);
    expect(collection[4]).toBe(o7);
    expect(collection[5]).toBe(o10);

    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      5: { idx: 2 },
      6: { idx: 3 },
      7: { idx: 4 },
      10: { idx: 5 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 2, added: [o6, o7], index: 3, removed: [], object: collection }
    ]);
  });

  it('should add elements in order', () => {
    const o6 = { id: 6, name: 'foo06' };

    expect(collection.length).toBe(4);

    const newLength = collection.add([o6]);

    expect(newLength).toBe(5);
    expect(collection.length).toBe(5);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o5);
    expect(collection[3]).toBe(o6);
    expect(collection[4]).toBe(o10);

    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      5: { idx: 2 },
      6: { idx: 3 },
      10: { idx: 4 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [o6], index: 3, removed: [], object: collection }
    ]);
  });

  it('should add elements in order even with an index', () => {
    const o6 = { id: 6, name: 'foo06' };
    expect(collection.length).toBe(4);

    const newLength = collection.add([o6], 0);

    expect(newLength).toBe(5);
    expect(collection.length).toBe(5);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o5);
    expect(collection[3]).toBe(o6);
    expect(collection[4]).toBe(o10);

    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      5: { idx: 2 },
      6: { idx: 3 },
      10: { idx: 4 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [o6], index: 3, removed: [], object: collection }
    ]);
  });

  it('should push elements, keep order and notify changes by index', () => {
    const o6 = { id: 6, name: 'foo06' };
    const o11 = { id: 11, name: 'foo11' };

    const newLength = collection.push(o6, o11);

    expect(newLength).toBe(6);
    expect(collection.length).toBe(6);

    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o5);
    expect(collection[3]).toBe(o6);
    expect(collection[4]).toBe(o10);
    expect(collection[5]).toBe(o11);

    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      5: { idx: 2 },
      6: { idx: 3 },
      10: { idx: 4 },
      11: { idx: 5 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [o6], index: 3, removed: [], object: collection },
      { type: 'splice', addedCount: 1, added: [o11], index: 5, removed: [], object: collection }
    ]);
  });

  it('should unshift elements in order and group changes', () => {
    const o6 = { id: 6, name: 'foo06' };
    const o11 = { id: 11, name: 'foo11' };

    const newLength = collection.unshift(o6, o11);

    expect(newLength).toBe(6);
    expect(collection.length).toBe(6);

    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o5);
    expect(collection[3]).toBe(o6);
    expect(collection[4]).toBe(o10);
    expect(collection[5]).toBe(o11);

    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      5: { idx: 2 },
      6: { idx: 3 },
      10: { idx: 4 },
      11: { idx: 5 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [o6], index: 3, removed: [], object: collection },
      { type: 'splice', addedCount: 1, added: [o11], index: 5, removed: [], object: collection }
    ]);
  });

  it('should not changed collection using splice with no args', () => {
    collection = new Collection([o1, o2, o5]);
    collection.notify.calls.reset();

    const removed = collection.splice();

    expect(removed).toEqual([]);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o5);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      5: { idx: 2 }
    }));

    expect(collection.notify).not.toHaveBeenCalled();
  });

  it('should remove element using splice with two argument', () => {
    collection = new Collection([o1, o2, o5]);
    collection.notify.calls.reset();

    const removed = collection.splice(1, 1);

    expect(removed).toEqual([o2]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o5);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      5: { idx: 1 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 1, removed: [o2], object: collection }
    ]);
  });

  it('should remove element using splice with negative argument', () => {
    collection = new Collection([o1, o2, o5]);

    const removed = collection.splice(-1, 1);

    expect(removed).toEqual([o5]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 2, removed: [o5], object: collection }
    ]);
  });

  it('should remove element and add new one in sorted order using splice', () => {
    collection = new Collection([o1, o2, o5]);
    collection.sort(sortFn);

    const removed = collection.splice(1, 1, o10);

    expect(removed).toEqual([o2]);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o5);
    expect(collection[2]).toBe(o10);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      5: { idx: 1 },
      10: { idx: 2 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 1, removed: [o2], object: collection },
      { type: 'splice', addedCount: 1, added: [o10], index: 2, removed: [], object: collection }
    ]);
  });

  it('should remove element and add new ones using splice', () => {
    collection = new Collection([o1, o5]);
    collection.sort(sortFn);

    const removed = collection.splice(0, 1, o2, o10);

    expect(removed).toEqual([o1]);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o2);
    expect(collection[1]).toBe(o5);
    expect(collection[2]).toBe(o10);
    expect(collection.$$map).toEqual(createMap({
      2: { idx: 0 },
      5: { idx: 1 },
      10: { idx: 2 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [o2], index: 0, removed: [o1], object: collection },
      { type: 'splice', addedCount: 1, added: [o10], index: 2, removed: [], object: collection }
    ]);
  });

  it('should replace existing data using splice', () => {
    collection = new Collection([o1, o5]);
    collection.sort(sortFn);

    const removed = collection.splice(0, 0, o1);

    expect(removed).toEqual([]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o5);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      5: { idx: 1 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, added: [], index: 0, removed: [], object: collection }
    ]);
  });

  it('should replace existing data and add new data using splice', () => {
    collection = new Collection([o1, o5]);
    collection.sort(sortFn);

    const removed = collection.splice(0, 0, o1, o2);

    expect(removed).toEqual([]);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o5);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      5: { idx: 2 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [o2], index: 1, removed: [], object: collection }
    ]);

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, added: [], index: 0, removed: [], object: collection }
    ]);
  });

  it('should replace existing data and add new data using splice and keep order', () => {
    collection = new Collection([o1, o5]);
    collection.sort(sortFn);

    const removed = collection.splice(0, 0, o5, o2);

    expect(removed).toEqual([]);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o5);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      5: { idx: 2 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [o2], index: 1, removed: [], object: collection }
    ]);

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, added: [], index: 2, removed: [], object: collection }
    ]);
  });

  it('should replace existing data and add new data using splice and notify update changes in order', () => {
    collection = new Collection([o1, o5]);
    collection.sort(sortFn);

    spyOn(collection, 'replace').and.callThrough();

    const removed = collection.splice(0, 0, o5, o1, o2);

    expect(removed).toEqual([]);
    expect(collection.length).toBe(3);

    expect(collection.replace).toHaveBeenCalledWith(o5);
    expect(collection.replace).toHaveBeenCalledWith(o1);

    expect(collection.replace).not.toHaveBeenCalledWith(o2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o5);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      5: { idx: 2 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [o2], index: 1, removed: [], object: collection }
    ]);

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, added: [], index: 0, removed: [], object: collection }
    ]);

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, added: [], index: 2, removed: [], object: collection }
    ]);
  });

  it('should remove element using start index', () => {
    expect(collection.length).toBe(4);

    const removed = collection.remove(2);

    expect(removed).toEqual([o5, o10]);
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
      { type: 'splice', addedCount: 0, added: [], index: 2, removed: [o5, o10], object: collection }
    ]);
  });

  it('should remove element using index and delete count', () => {
    expect(collection.length).toBe(4);

    const removed = collection.remove(2, 1);

    expect(removed).toEqual([o5]);
    expect(collection.length).toBe(3);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection[2]).toBe(o10);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 },
      10: { idx: 2 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 2, removed: [o5], object: collection }
    ]);
  });

  it('should remove element using predicate', () => {
    expect(collection.length).toBe(4);

    const removed = collection.remove(o => o.id % 2 !== 0);

    expect(removed).toEqual([o1, o5]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o2);
    expect(collection[1]).toBe(o10);
    expect(collection[2]).toBeUndefined();
    expect(collection[3]).toBeUndefined();
    expect(collection.$$map).toEqual(createMap({
      2: { idx: 0 },
      10: { idx: 1 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 0, removed: [o1], object: collection },
      { type: 'splice', addedCount: 0, added: [], index: 2, removed: [o5], object: collection }
    ]);
  });

  it('should remove element using predicate and merge changes', () => {
    expect(collection.length).toBe(4);

    const removed = collection.remove(o => o.id <= 2);

    expect(removed).toEqual([o1, o2]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o5);
    expect(collection[1]).toBe(o10);
    expect(collection[2]).toBeUndefined();
    expect(collection[3]).toBeUndefined();
    expect(collection.$$map).toEqual(createMap({
      5: { idx: 0 },
      10: { idx: 1 }
    }));

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 0, removed: [o1, o2], object: collection }
    ]);
  });

  it('should not reverse collection if collection is sorted', () => {
    collection = new Collection([o1, o2]);
    collection.sort(sortFn);

    collection.notify.calls.reset();

    const result = collection.reverse();

    expect(result).toBe(collection);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection.notify).not.toHaveBeenCalled();
  });

  it('should replace data at the same exact if data is still the first', () => {
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

  it('should replace data at the same exact if data is still the last', () => {
    spyOn(collection, 'splice').and.callThrough();

    const clone = {
      id: 10,
      name: 'foobar'
    };

    collection.replace(clone);

    expect(collection[3]).not.toBe(o10);
    expect(collection[3]).toBe(clone);
    expect(collection.splice).not.toHaveBeenCalled();
    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, added: [], index: 3, removed: [], object: collection }
    ]);
  });

  it('should replace data at the same exact if data is still sorted', () => {
    spyOn(collection, 'splice').and.callThrough();

    const clone = {
      id: 5,
      name: 'foo05'
    };

    collection.replace(clone);

    expect(collection[2]).not.toBe(o10);
    expect(collection[2]).toBe(clone);
    expect(collection.splice).not.toHaveBeenCalled();
    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'update', addedCount: 0, added: [], index: 2, removed: [], object: collection }
    ]);
  });

  it('should replace data and keep sort', () => {
    spyOn(collection, 'splice').and.callThrough();

    const clone = {
      id: 5,
      name: 'foo20'
    };

    collection.replace(clone);

    expect(collection[2]).not.toBe(o5);
    expect(collection[2]).toBe(o10);
    expect(collection[3]).toBe(clone);

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, added: [], index: 2, removed: [o5], object: collection }
    ]);

    expect(collection.notify).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, added: [clone], index: 3, removed: [], object: collection }
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
