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

describe('Sorted collection', function() {

  var o1;
  var o2;
  var o5;
  var o10;
  var sortFn;
  var collection;

  beforeEach(function() {
    o1 = { id: 1, name: 'foo' };
    o2 = { id: 2, name: 'bar' };
    o5 = { id: 5, name: 'foobar' };
    o10 = { id: 10, name: 'foobar' };

    sortFn = jasmine.createSpy('sortFn').and.callFake(function(o1, o2) {
      return o1.id - o2.id;
    });

    collection = new Collection([o1, o10, o5, o2]);
    collection.sort(sortFn);
    expect(collection.length).toBe(4);

    jasmine.clock().tick(1);

    spyOn(Collection.prototype, 'trigger').and.callThrough();
  });

  it('should sort collection', function() {
    collection = new Collection([o1, o10, o5, o2]);
    var result = collection.sort(sortFn);

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

  it('should push elements in order', function() {
    var o6 = { id: 6, name: 'foobar' };
    var o7 = { id: 7, name: 'foobar' };

    var newLength = collection.push(o6, o7);

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

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 2, index: 3, removed: [], object: collection }
    ]);
  });

  it('should unshift elements in order', function() {
    var o6 = { id: 6, name: 'foobar' };
    var o7 = { id: 7, name: 'foobar' };

    var newLength = collection.unshift(o6, o7);

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

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 2, index: 3, removed: [], object: collection }
    ]);
  });

  it('should push elements, keep order and trigger changes by index', function() {
    var o6 = { id: 6, name: 'foobar' };
    var o11 = { id: 11, name: 'foobar' };

    var newLength = collection.push(o6, o11);

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

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, index: 3, removed: [], object: collection },
      { type: 'splice', addedCount: 1, index: 5, removed: [], object: collection }
    ]);
  });

  it('should unshift elements in order and group changes', function() {
    var o6 = { id: 6, name: 'foobar' };
    var o11 = { id: 11, name: 'foobar' };

    var newLength = collection.unshift(o6, o11);

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

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, index: 3, removed: [], object: collection },
      { type: 'splice', addedCount: 1, index: 5, removed: [], object: collection }
    ]);
  });

  it('should not changed collection using splice with no args', function() {
    collection = new Collection([o1, o2, o5]);
    collection.trigger.calls.reset();

    var removed = collection.splice();

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

    expect(collection.trigger).not.toHaveBeenCalled();
  });

  it('should remove element using splice with two argument', function() {
    collection = new Collection([o1, o2, o5]);
    collection.trigger.calls.reset();

    var removed = collection.splice(1, 1);

    expect(removed).toEqual([o2]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o5);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      5: { idx: 1 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, index: 1, removed: [o2], object: collection }
    ]);
  });

  it('should remove element using splice with negative argument', function() {
    collection = new Collection([o1, o2, o5]);

    var removed = collection.splice(-1, 1);

    expect(removed).toEqual([o5]);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection.$$map).toEqual(createMap({
      1: { idx: 0 },
      2: { idx: 1 }
    }));

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, index: 2, removed: [o5], object: collection }
    ]);
  });

  it('should remove element and add new one in sorted order using splice', function() {
    collection = new Collection([o1, o2, o5]);
    collection.sort(sortFn);

    var removed = collection.splice(1, 1, o10);

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

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 0, index: 1, removed: [o2], object: collection },
      { type: 'splice', addedCount: 1, index: 2, removed: [], object: collection }
    ]);
  });

  it('should remove element and add new ones using splice', function() {
    collection = new Collection([o1, o5]);
    collection.sort(sortFn);

    var removed = collection.splice(0, 1, o2, o10);

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

    expect(collection.trigger).toHaveBeenCalledWith([
      { type: 'splice', addedCount: 1, index: 0, removed: [o1], object: collection },
      { type: 'splice', addedCount: 1, index: 2, removed: [], object: collection }
    ]);
  });

  it('should not reverse collection if collection is sorted', function() {
    collection = new Collection([o1, o2]);
    collection.sort(sortFn);

    collection.trigger.calls.reset();

    var result = collection.reverse();

    expect(result).toBe(collection);
    expect(collection.length).toBe(2);
    expect(collection[0]).toBe(o1);
    expect(collection[1]).toBe(o2);
    expect(collection.trigger).not.toHaveBeenCalled();
  });
});
