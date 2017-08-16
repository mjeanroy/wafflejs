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

import {Observable} from '../../../src/core/observable/observable';

describe('Observable', () => {
  let object;

  let callback1;
  let callback2;

  let ctx1;
  let ctx2;

  let change1;
  let change2;

  beforeEach(() => jasmine.clock().install());
  afterEach(() => jasmine.clock().uninstall());

  beforeEach(() => {
    object = new Observable();
  });

  beforeEach(() => {
    callback1 = jasmine.createSpy('callback1');
    callback2 = jasmine.createSpy('callback2');

    ctx1 = {foo: 'bar'};
    ctx2 = {bar: 'foo'};

    change1 = {
      type: 'splice',
      addedCount: 1,
      index: 3,
      removed: [],
      object,
    };

    change2 = {
      type: 'splice',
      addedCount: 1,
      index: 4,
      removed: [],
      object,
    };
  });

  it('should register observer', () => {
    object.observe(callback1);

    expect(object._observers).toEqual([
      {ctx: null, callback: callback1},
    ]);
  });

  it('should register observer with context', () => {
    object.observe(callback1, ctx1);

    expect(object._observers).toEqual([
      {ctx: ctx1, callback: callback1},
    ]);
  });

  it('should unregister everything', () => {
    object._observers = [{
      ctx: null,
      callback: callback1,
    }];

    object.unobserve();

    expect(object._observers).toEqual([]);
  });

  it('should unregister callback', () => {
    object._observers = [
      {ctx: null, callback: callback1},
      {ctx: null, callback: callback2},
    ];

    object.unobserve(callback1);

    expect(object._observers).toEqual([
      {ctx: null, callback: callback2},
    ]);
  });

  it('should unregister callback with context', () => {
    object._observers = [
      {ctx: ctx1, callback: callback1},
      {ctx: ctx2, callback: callback1},
    ];

    object.unobserve(callback1, ctx1);

    expect(object._observers).toEqual([
      {ctx: ctx2, callback: callback1},
    ]);
  });

  it('should notify changes asynchronously', () => {
    object._observers = [{
      ctx: null,
      callback: callback1,
    }];

    const changes = [change1, change2];

    object.notify(changes);

    expect(object._changes).toEqual(changes);
    expect(callback1).not.toHaveBeenCalled();

    const previousChanges = object._changes.slice();

    jasmine.clock().tick(1);

    expect(callback1).toHaveBeenCalledWith(previousChanges);
    expect(object._changes).toEqual([]);
  });

  it('should notify single change', () => {
    object._observers = [{
      ctx: null,
      callback: callback1,
    }];

    object.notify(change1);

    expect(callback1).not.toHaveBeenCalled();
    expect(object._changes).toEqual([change1]);
    expect(object._observableTask).toBeTruthy();

    const _changes = object._changes.slice();

    jasmine.clock().tick(1);

    expect(callback1).toHaveBeenCalledWith(_changes);
    expect(object._changes).toEqual([]);
    expect(object._observableTask).toBeNull();
  });

  it('should notify changes and keep new changes', () => {
    const asyncCallback = jasmine.createSpy('asyncCallback').and.callFake(() => (
      object._changes.push(change2)
    ));

    object._observers = [{
      ctx: null,
      callback: asyncCallback,
    }];

    object.notify(change1);

    expect(asyncCallback).not.toHaveBeenCalled();
    expect(object._changes).toEqual([change1]);
    expect(object._observableTask).toBeTruthy();

    const _changes = object._changes.slice();

    jasmine.clock().tick(1);

    expect(asyncCallback).toHaveBeenCalledWith(_changes);
    expect(object._changes).not.toEqual([]);
    expect(object._changes).toEqual([change2]);
    expect(object._observableTask).toBeNull();
  });

  it('should notify changes and remove old ones', () => {
    const asyncCallback = jasmine.createSpy('asyncCallback').and.callFake(() => (
      object.notify(change2)
    ));

    object._observers = [{
      ctx: null,
      callback: asyncCallback,
    }];

    object.notify(change1);

    expect(asyncCallback).not.toHaveBeenCalled();
    expect(object._changes).toEqual([change1]);
    expect(object._observableTask).toBeTruthy();

    const _changes = object._changes.slice();

    jasmine.clock().tick();

    expect(asyncCallback).toHaveBeenCalledWith(_changes);
    expect(object._changes.length).toBe(1);
    expect(object._changes).toEqual([change2]);
    expect(object._observableTask).toBeNull();
  });

  it('should notify all changes once asynchronously', () => {
    object._observers = [{
      ctx: null,
      callback: callback1,
    }];

    const changes1 = [change1];
    const changes2 = [change2];

    object.notify(changes1);
    object.notify(changes2);

    expect(callback1).not.toHaveBeenCalled();
    expect(object._changes).toEqual([...changes1, ...changes2]);
    expect(object._observableTask).toBeTruthy();

    const _changes = object._changes.slice();

    jasmine.clock().tick(1);

    expect(callback1).toHaveBeenCalledWith(_changes);
    expect(object._changes).toEqual([]);
    expect(object._observableTask).toBeNull();
  });

  it('should notify all changes once and notify callback once', () => {
    object._observers = [{
      ctx: null,
      callback: callback1,
    }];

    // notify first change
    const changes1 = [change1];
    const changes2 = [change2];

    object.notify(changes1);
    object.notify(changes2);

    jasmine.clock().tick(1);

    expect(callback1).toHaveBeenCalledWith([...changes1, ...changes2]);
    expect(callback1.calls.count()).toBe(1);
  });

  it('should clear changes', () => {
    object._observers = [{
      ctx: null,
      callback: callback1,
    }];

    object.clearChanges();

    expect(object._changes).toEqual([]);
  });

  it('should clear changes and create empty array', () => {
    object._observers = [{
      ctx: null,
      callback: callback1,
    }];

    const changes1 = [change1];
    const changes2 = [change2];

    object.notify(changes1);
    object.notify(changes2);

    expect(object._observableTask).not.toBeNull();
    expect(object._observableTask).toBeDefined();
    expect(object._changes.length).toBe(2);

    object.clearChanges();

    expect(object._changes.length).toBe(0);
    expect(object._observableTask).toBeNull();
  });

  it('should get pending changes', () => {
    object._observers = [{
      ctx: null,
      callback: callback1,
    }];

    expect(object.pendingChanges()).toEqual([]);

    object.notify([change1]);

    expect(object.pendingChanges()).toEqual([change1]);
  });
});
