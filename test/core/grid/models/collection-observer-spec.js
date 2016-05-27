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

describe('Collection observers', () => {

  let o1;
  let o2;
  let collection;

  let callback1;
  let callback2;

  let ctx1;
  let ctx2;

  let change1;
  let change2;

  beforeEach(() => {
    o1 = { id: 1, name: 'foo' };
    o2 = { id: 2, name: 'bar' };

    collection = new Collection([o1, o2]);
    collection.clearChanges();

    expect(collection.length).toBe(2);
    expect(collection.$$changes).toBeEmpty();

    jasmine.clock().tick(1);

    callback1 = jasmine.createSpy('callback1');
    callback2 = jasmine.createSpy('callback2');

    ctx1 = { foo: 'bar' };
    ctx2 = { bar: 'foo' };

    change1 = { type: 'splice', addedCount: 1, index: 3, object: collection, removed: [] };
    change2 = { type: 'splice', addedCount: 1, index: 4, object: collection, removed: [] };
  });

  it('should register observer', () => {
    collection.observe(callback1);

    expect(collection.$$observers).toEqual([
      { ctx: null, callback: callback1 }
    ]);
  });

  it('should register observer with context', () => {
    collection.observe(callback1, ctx1);

    expect(collection.$$observers).toEqual([
      { ctx: ctx1, callback: callback1 }
    ]);
  });

  it('should unregister everything', () => {
    collection.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    collection.unobserve();

    expect(collection.$$observers).toEqual([]);
  });

  it('should unregister callback', () => {
    collection.$$observers = [
      { ctx: null, callback: callback1 },
      { ctx: null, callback: callback2 }
    ];

    collection.unobserve(callback1);

    expect(collection.$$observers).toEqual([
      { ctx: null, callback: callback2 }
    ]);
  });

  it('should unregister callback with context', () => {
    collection.$$observers = [
      { ctx: ctx1, callback: callback1 },
      { ctx: ctx2, callback: callback1 }
    ];

    collection.unobserve(callback1, ctx1);

    expect(collection.$$observers).toEqual([
      { ctx: ctx2, callback: callback1 }
    ]);
  });

  it('should notify changes asynchronously', () => {
    collection.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    const changes = [change1, change2];

    collection.notify(changes);

    expect(collection.$$changes).toEqual(changes);
    expect(callback1).not.toHaveBeenCalled();

    const $$changes = collection.$$changes.slice();

    jasmine.clock().tick(1);

    expect(callback1).toHaveBeenCalledWith($$changes);
    expect(collection.$$changes).toEqual([]);
  });

  it('should notify single change', () => {
    collection.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    collection.notify(change1);

    expect(collection.$$changes.length).toBe(1);
    expect(collection.$$changes).toEqual([change1]);
    expect(callback1).not.toHaveBeenCalled();

    const $$changes = collection.$$changes.slice();

    jasmine.clock().tick(1);

    expect(callback1).toHaveBeenCalledWith($$changes);
    expect(collection.$$changes).toEqual([]);
  });

  it('should notify all changes once asynchronously', () => {
    collection.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    const changes1 = [change1];
    collection.notify(changes1);

    expect(collection.$$changes.length).toBe(1);
    expect(collection.$$changes).toEqual([change1]);

    const changes2 = [change2];
    collection.notify(changes2);

    expect(collection.$$changes.length).toBe(2);
    expect(collection.$$changes).toEqual([change1, change2]);

    expect(callback1).not.toHaveBeenCalled();

    const $$changes = collection.$$changes.slice();

    jasmine.clock().tick(1);

    expect(callback1).toHaveBeenCalledWith($$changes);
    expect(collection.$$changes).toEqual([]);
  });

  it('should notify an update change', () => {
    collection.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    const result = collection.notifyUpdate(0);

    expect(result).toBe(collection);
    expect(collection.$$changes.length).toBe(1);
    expect(collection.$$changes).toEqual([
      { type: 'update', index: 0, removed: [], addedCount: 0, added: [], object: collection }
    ]);

    expect(callback1).not.toHaveBeenCalled();

    const $$changes = collection.$$changes.slice();

    jasmine.clock().tick(1);

    expect(callback1).toHaveBeenCalledWith($$changes);
    expect(collection.$$changes).toEqual([]);
  });
});
