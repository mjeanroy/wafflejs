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

  beforeEach(function() {
    jasmine.clock().tick(1);

    callback1 = jasmine.createSpy('callback1');
    callback2 = jasmine.createSpy('callback2');

    ctx1 = { foo: 'bar' };
    ctx2 = { bar: 'foo' };

    change1 = { type: 'splice', addedCount: 1, index: 3, object: Observable, removed: [] };
    change2 = { type: 'splice', addedCount: 1, index: 4, object: Observable, removed: [] };

    Observable.$$observers = undefined;
    Observable.$$changes = undefined;
  });

  it('should register observer', function() {
    Observable.observe(callback1);

    expect(Observable.$$observers).toEqual([
      { ctx: null, callback: callback1 }
    ]);
  });

  it('should register observer with context', function() {
    Observable.observe(callback1, ctx1);

    expect(Observable.$$observers).toEqual([
      { ctx: ctx1, callback: callback1 }
    ]);
  });

  it('should unregister everything', function() {
    Observable.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    Observable.unobserve();

    expect(Observable.$$observers).toEqual([]);
  });

  it('should unregister callback', function() {
    Observable.$$observers = [
      { ctx: null, callback: callback1 },
      { ctx: null, callback: callback2 }
    ];

    Observable.unobserve(callback1);

    expect(Observable.$$observers).toEqual([
      { ctx: null, callback: callback2 }
    ]);
  });

  it('should unregister callback with context', function() {
    Observable.$$observers = [
      { ctx: ctx1, callback: callback1 },
      { ctx: ctx2, callback: callback1 }
    ];

    Observable.unobserve(callback1, ctx1);

    expect(Observable.$$observers).toEqual([
      { ctx: ctx2, callback: callback1 }
    ]);
  });

  it('should trigger changes asynchronously', function() {
    Observable.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    var changes = [change1, change2];

    Observable.trigger(changes);

    expect(Observable.$$changes).toEqual(changes);
    expect(callback1).not.toHaveBeenCalled();

    var $$changes = Observable.$$changes;

    jasmine.clock().tick(1);

    expect(callback1).toHaveBeenCalledWith($$changes);
    expect(Observable.$$changes).toEqual([]);
  });

  it('should trigger single change', function() {
    Observable.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    Observable.trigger(change1);

    expect(Observable.$$changes).toEqual([change1]);
    expect(callback1).not.toHaveBeenCalled();

    var $$changes = Observable.$$changes;

    jasmine.clock().tick(1);

    expect(callback1).toHaveBeenCalledWith($$changes);
    expect(Observable.$$changes).toEqual([]);
  });

  it('should trigger all changes once asynchronously', function() {
    Observable.$$observers = [{
      ctx: null,
      callback: callback1
    }];

    var changes1 = [change1];
    Observable.trigger(changes1);

    var changes2 = [change2];
    Observable.trigger(changes2);

    expect(Observable.$$changes).toEqual(changes1.concat(changes2));
    expect(callback1).not.toHaveBeenCalled();

    var $$changes = Observable.$$changes;

    jasmine.clock().tick(1);

    expect(callback1).toHaveBeenCalledWith($$changes);
    expect(Observable.$$changes).toEqual([]);
  });
});
