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

describe('Observable', function() {

  var callback1;
  var callback2;

  var ctx1;
  var ctx2;

  var change1;
  var change2;

  var instance;

  beforeEach(function() {
    jasmine.clock().tick(1);

    callback1 = jasmine.createSpy('callback1');
    callback2 = jasmine.createSpy('callback2');

    ctx1 = { foo: 'bar' };
    ctx2 = { bar: 'foo' };

    change1 = {
      type: 'splice',
      addedCount: 1,
      index: 3,
      object: Observable,
      removed: []
    };

    change2 = {
      type: 'splice',
      addedCount: 1,
      index: 4,
      object: Observable,
      removed: []
    };

    Observable.$$observers = undefined;
    Observable.$$changes = undefined;

    var Constructor = function() {
    };

    for (var i in Observable) {
      if (Observable.hasOwnProperty(i)) {
        Constructor.prototype[i] = Observable[i];
      }
    }

    instance = new Constructor();
  });

  it('should register observer', function() {
    instance.observe(callback1);

    expect(instance.$$observers).toEqual([
      { ctx: null, callback: callback1 }
    ]);
  });

  it('should register observer with context', function() {
    instance.observe(callback1, ctx1);

    expect(instance.$$observers).toEqual([
      { ctx: ctx1, callback: callback1 }
    ]);
  });

  it('should unregister everything', function() {
    instance.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    instance.unobserve();

    expect(instance.$$observers).toEqual([]);
  });

  it('should unregister callback', function() {
    instance.$$observers = [
      { ctx: null, callback: callback1 },
      { ctx: null, callback: callback2 }
    ];

    instance.unobserve(callback1);

    expect(instance.$$observers).toEqual([
      { ctx: null, callback: callback2 }
    ]);
  });

  it('should unregister callback with context', function() {
    instance.$$observers = [
      { ctx: ctx1, callback: callback1 },
      { ctx: ctx2, callback: callback1 }
    ];

    instance.unobserve(callback1, ctx1);

    expect(instance.$$observers).toEqual([
      { ctx: ctx2, callback: callback1 }
    ]);
  });

  it('should trigger changes asynchronously', function() {
    instance.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    var changes = [change1, change2];

    instance.trigger(changes);

    expect(instance.$$changes).toEqual(changes);
    expect(callback1).not.toHaveBeenCalled();

    var $$changes = instance.$$changes.slice();

    jasmine.clock().tick(1);

    expect(callback1).toHaveBeenCalledWith($$changes);
    expect(instance.$$changes).toEqual([]);
  });

  it('should trigger single change', function() {
    instance.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    instance.trigger(change1);

    expect(instance.$$changes).toEqual([change1]);
    expect(callback1).not.toHaveBeenCalled();
    expect(instance.$asyncTask).toBeTruthy();

    var $$changes = instance.$$changes.slice();

    jasmine.clock().tick(1);

    expect(callback1).toHaveBeenCalledWith($$changes);
    expect(instance.$$changes).toEqual([]);
    expect(instance.$asyncTask).toBeNull();
  });

  it('should trigger changes and keep new changes', function() {
    var asyncCallback = jasmine.createSpy('asyncCallback').and.callFake(function() {
      instance.$$changes.push(change2);
    });

    instance.$$observers = [{
      ctx: null,
      callback: asyncCallback
    }];

    instance.trigger(change1);

    expect(instance.$$changes).toEqual([change1]);
    expect(asyncCallback).not.toHaveBeenCalled();
    expect(instance.$asyncTask).toBeTruthy();

    var $$changes = instance.$$changes.slice();

    jasmine.clock().tick(1);

    expect(asyncCallback).toHaveBeenCalledWith($$changes);
    expect(instance.$$changes).not.toEqual([]);
    expect(instance.$$changes).toEqual([change2]);
    expect(instance.$asyncTask).toBeNull();
  });

  it('should trigger changes and remove old ones', function() {
    var asyncCallback = jasmine.createSpy('asyncCallback').and.callFake(function() {
      return instance.trigger(change2);
    });

    instance.$$observers = [{
      ctx: null,
      callback: asyncCallback
    }];

    instance.trigger(change1);

    expect(instance.$$changes).toEqual([change1]);
    expect(asyncCallback).not.toHaveBeenCalled();
    expect(instance.$asyncTask).toBeTruthy();

    var $$changes = instance.$$changes.slice();

    jasmine.clock().tick();

    expect(asyncCallback).toHaveBeenCalledWith($$changes);
    expect(instance.$$changes.length).toBe(1);
    expect(instance.$$changes).toEqual([change2]);
    expect(instance.$asyncTask).toBeNull();
  });

  it('should trigger all changes once asynchronously', function() {
    instance.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    var changes1 = [change1];
    instance.trigger(changes1);

    var changes2 = [change2];
    instance.trigger(changes2);

    expect(instance.$$changes).toEqual(changes1.concat(changes2));
    expect(callback1).not.toHaveBeenCalled();
    expect(instance.$asyncTask).toBeTruthy();

    var $$changes = instance.$$changes.slice();

    jasmine.clock().tick(1);

    expect(callback1).toHaveBeenCalledWith($$changes);
    expect(instance.$$changes).toEqual([]);
    expect(instance.$asyncTask).toBeNull();
  });

  it('should trigger all changes once and trigger callback once', function() {
    var asyncFn = jasmine.createSpy('asyncFn');
    spyOn(_, 'bind').and.returnValue(asyncFn);

    instance.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    // Trigger first change
    var changes1 = [change1];
    instance.trigger(changes1);

    // Trigger second change
    var changes2 = [change2];
    instance.trigger(changes2);

    expect(asyncFn).not.toHaveBeenCalled();

    jasmine.clock().tick(1);

    expect(asyncFn).toHaveBeenCalled();
    expect(asyncFn.calls.count()).toBe(1);
  });

  it('should clear changes', function() {
    instance.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    instance.clearChanges();

    expect(instance.$$changes).not.toBeDefined();
  });

  it('should clear changes and create empty array', function() {
    instance.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    var changes1 = [change1];
    var changes2 = [change2];

    instance.trigger(changes1);
    instance.trigger(changes2);

    expect(instance.$asyncTask).not.toBeNull();
    expect(instance.$asyncTask).toBeDefined();
    expect(instance.$$changes.length).toBe(2);

    var $asyncTask = instance.$asyncTask;

    instance.clearChanges();

    expect(instance.$$changes.length).toBe(0);
    expect(instance.$asyncTask).toBeNull();
  });

  it('should get pending changes', function() {
    instance.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    expect(instance.pendingChanges()).toEqual([]);
    instance.trigger([change1]);
    expect(instance.pendingChanges()).toEqual([change1]);
  });
});
