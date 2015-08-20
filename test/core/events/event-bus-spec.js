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

describe('EventBus', function() {

  var eventBus;

  beforeEach(function() {
    eventBus = new EventBus();
  });

  it('should create an event bus', function() {
    expect(eventBus.$events).toEqual({});
  });

  it('should add a new listener', function() {
    var listener = jasmine.createSpy('listener');

    eventBus.addEventListener('foo', listener);

    expect(eventBus.$events['foo']).toBeDefined();
    expect(eventBus.$events['foo']).toContain(listener);
  });

  it('should add a new listener with case insensitive name', function() {
    var listener1 = jasmine.createSpy('listener1');
    var listener2 = jasmine.createSpy('listener2');

    eventBus.addEventListener('foo', listener1);
    eventBus.addEventListener('Foo', listener2);

    expect(eventBus.$events['foo']).toBeDefined();
    expect(eventBus.$events['Foo']).not.toBeDefined();
    expect(eventBus.$events['foo']).toContain(listener1);
    expect(eventBus.$events['foo']).toContain(listener2);
  });

  it('should remove listener', function() {
    var listener1 = jasmine.createSpy('listener1');
    var listener2 = jasmine.createSpy('listener2');

    eventBus.addEventListener('foo', listener1);
    eventBus.addEventListener('foo', listener2);

    expect(eventBus.$events['foo']).toContain(listener1);
    expect(eventBus.$events['foo']).toContain(listener2);

    eventBus.removeEventListener('foo', listener1);

    expect(eventBus.$events['foo']).not.toContain(listener1);
    expect(eventBus.$events['foo']).toContain(listener2);

    eventBus.removeEventListener('foo', listener2);

    expect(eventBus.$events['foo']).not.toContain(listener1);
    expect(eventBus.$events['foo']).not.toContain(listener2);
  });

  it('should remove listener with case insensitive name', function() {
    var listener1 = jasmine.createSpy('listener1');
    var listener2 = jasmine.createSpy('listener2');

    eventBus.addEventListener('foo', listener1);
    eventBus.addEventListener('foo', listener2);

    expect(eventBus.$events['foo']).toContain(listener1);
    expect(eventBus.$events['foo']).toContain(listener2);

    eventBus.removeEventListener('Foo', listener1);
    expect(eventBus.$events['foo']).not.toContain(listener1);
    expect(eventBus.$events['foo']).toContain(listener2);

    eventBus.removeEventListener('FOO', listener2);
    expect(eventBus.$events['foo']).not.toContain(listener1);
    expect(eventBus.$events['foo']).not.toContain(listener2);
  });

  it('should not try to remove listener if listener array is empty', function() {
    spyOn(_, 'reject').and.callThrough();

    eventBus.removeEventListener('foo', jasmine.createSpy('listener1'));

    expect(_.reject).not.toHaveBeenCalled();
  });

  it('should not try to remove listener if second parameter is falsy', function() {
    spyOn(_, 'reject').and.callThrough();

    eventBus.removeEventListener('foo', null);

    expect(_.reject).not.toHaveBeenCalled();
  });

  it('should clear bus', function() {
    var listener1 = jasmine.createSpy('listener1');
    var listener2 = jasmine.createSpy('listener2');

    eventBus.addEventListener('foo', listener1);
    eventBus.addEventListener('foo', listener2);

    expect(eventBus.$events['foo']).toContain(listener1);
    expect(eventBus.$events['foo']).toContain(listener2);

    eventBus.clear();

    expect(eventBus.$events).toEqual({});
  });

  it('should dispatch event with details object', function() {
    var grid = jasmine.createSpy('grid');
    var listener = jasmine.createSpy('listener');
    eventBus.addEventListener('foo', listener);

    eventBus.dispatchEvent(grid, 'foo', {
      foo: 'bar'
    });

    expect(listener).toHaveBeenCalledOnce();

    var call = listener.calls.mostRecent();
    expect(call.object).toBe(grid);

    var evt = call.args[0];
    expect(evt.bubbles).toBe(false);
    expect(evt.cancelable).toBe(false);
    expect(evt.timeStamp).toBeDefined();
    expect(evt.target).toBe(grid);
    expect(evt.currentTarget).toBe(grid);
    expect(evt.details).toEqual({
      foo: 'bar'
    });
  });

  it('should dispatch event with details function', function() {
    var grid = jasmine.createSpy('grid');
    var listener = jasmine.createSpy('listener');
    var params = jasmine.createSpy('params').and.returnValue({
      foo: 'bar'
    });

    eventBus.addEventListener('foo', listener);

    eventBus.dispatchEvent(grid, 'foo', params);

    expect(listener).toHaveBeenCalledOnce();

    expect(params).toHaveBeenCalledOnce();
    expect(params.calls.mostRecent().object).toBe(grid);

    var call = listener.calls.mostRecent();
    expect(call.object).toBe(grid);

    var evt = call.args[0];
    expect(evt.bubbles).toBe(false);
    expect(evt.cancelable).toBe(false);
    expect(evt.timeStamp).toBeDefined();
    expect(evt.target).toBe(grid);
    expect(evt.currentTarget).toBe(grid);
    expect(evt.details).toEqual({
      foo: 'bar'
    });
  });

  it('should dispatch event without details', function() {
    var grid = jasmine.createSpy('grid');
    var listener = jasmine.createSpy('listener');

    eventBus.addEventListener('foo', listener);

    eventBus.dispatchEvent(grid, 'foo');

    expect(listener).toHaveBeenCalledOnce();

    var call = listener.calls.mostRecent();
    expect(call.object).toBe(grid);

    var evt = call.args[0];
    expect(evt.bubbles).toBe(false);
    expect(evt.cancelable).toBe(false);
    expect(evt.timeStamp).toBeDefined();
    expect(evt.target).toBe(grid);
    expect(evt.currentTarget).toBe(grid);
    expect(evt.details).toBeUndefined();
  });

  it('should dispatch event for all listeners', function() {
    var grid = jasmine.createSpy('grid');
    var listener1 = jasmine.createSpy('listener1');
    var listener2 = jasmine.createSpy('listener2');

    eventBus.addEventListener('foo', listener1);
    eventBus.addEventListener('foo', listener2);

    eventBus.dispatchEvent(grid, 'foo');

    expect(listener1).toHaveBeenCalledOnce();
    expect(listener2).toHaveBeenCalledOnce();
  });

  it('should dispatch event with case insensitive name', function() {
    var grid = jasmine.createSpy('grid');
    var listener1 = jasmine.createSpy('listener1');
    var listener2 = jasmine.createSpy('listener2');

    eventBus.addEventListener('Foo', listener1);
    eventBus.addEventListener('Foo', listener2);

    eventBus.dispatchEvent(grid, 'foo');

    expect(listener1).toHaveBeenCalledOnce();
    expect(listener2).toHaveBeenCalledOnce();
  });

  it('should dispatch event and ignore errors', function() {
    var grid = jasmine.createSpy('grid');
    var listener1 = jasmine.createSpy('listener1').and.throwError('Error');
    var listener2 = jasmine.createSpy('listener2');

    eventBus.addEventListener('Foo', listener1);
    eventBus.addEventListener('Foo', listener2);

    eventBus.dispatchEvent(grid, 'foo');

    expect(listener1).toHaveBeenCalledOnce();
    expect(listener2).toHaveBeenCalledOnce();
  });
});
