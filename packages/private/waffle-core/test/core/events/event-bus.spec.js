/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2017 Mickael Jeanroy
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

import {EventBus} from '../../../src/core/events/event-bus';

describe('EventBus', () => {
  let eventBus;

  beforeEach(() => eventBus = new EventBus());

  it('should create an event bus', () => {
    expect(eventBus._events).toEqual({});
  });

  it('should add a new listener', () => {
    const type = 'foo';
    const listener = jasmine.createSpy('listener');

    eventBus.addEventListener(type, listener);

    expect(eventBus._events[type]).toBeDefined();
    expect(eventBus._events[type]).toContain(listener);
  });

  it('should add a new listener with case insensitive name', () => {
    const t1 = 'foo';
    const t2 = 'Foo';
    const listener1 = jasmine.createSpy('listener1');
    const listener2 = jasmine.createSpy('listener2');

    eventBus.addEventListener(t1, listener1);
    eventBus.addEventListener(t2, listener2);

    expect(eventBus._events[t1]).toBeDefined();
    expect(eventBus._events[t1]).toContain(listener1);
    expect(eventBus._events[t1]).toContain(listener2);
    expect(eventBus._events[t2]).not.toBeDefined();
  });

  it('should remove listener', () => {
    const type = 'foo';
    const listener1 = jasmine.createSpy('listener1');
    const listener2 = jasmine.createSpy('listener2');

    eventBus.addEventListener(type, listener1);
    eventBus.addEventListener(type, listener2);

    expect(eventBus._events[type]).toContain(listener1);
    expect(eventBus._events[type]).toContain(listener2);

    eventBus.removeEventListener(type, listener1);

    expect(eventBus._events[type]).not.toContain(listener1);
    expect(eventBus._events[type]).toContain(listener2);

    eventBus.removeEventListener(type, listener2);

    expect(eventBus._events[type]).not.toContain(listener1);
    expect(eventBus._events[type]).not.toContain(listener2);
  });

  it('should remove listener with case insensitive name', () => {
    const t1 = 'foo';
    const t2 = 'Foo';
    const t3 = 'FOO';
    const listener1 = jasmine.createSpy('listener1');
    const listener2 = jasmine.createSpy('listener2');

    eventBus.addEventListener(t1, listener1);
    eventBus.addEventListener(t1, listener2);

    expect(eventBus._events[t1]).toContain(listener1);
    expect(eventBus._events[t1]).toContain(listener2);

    eventBus.removeEventListener(t2, listener1);
    expect(eventBus._events[t1]).not.toContain(listener1);
    expect(eventBus._events[t1]).toContain(listener2);

    eventBus.removeEventListener(t3, listener2);
    expect(eventBus._events[t1]).not.toContain(listener1);
    expect(eventBus._events[t1]).not.toContain(listener2);
  });

  it('should not try to remove listener if listener array is empty', () => {
    const type = 'foo';
    const callback = jasmine.createSpy('callback');
    const events = eventBus._events[type];

    eventBus.removeEventListener(type, callback);

    expect(eventBus._events[type]).toBeEmpty();
    expect(eventBus._events[type]).toBe(events);
  });

  it('should remove listener if second parameter is falsy', () => {
    const type = 'foo';
    const callback = jasmine.createSpy('callback');

    eventBus.addEventListener(type, callback);
    expect(eventBus._events[type]).toContain(callback);

    eventBus.removeEventListener(type, null);
    expect(eventBus._events[type]).toBeEmpty();
  });

  it('should clear bus', () => {
    const listener1 = jasmine.createSpy('listener1');
    const listener2 = jasmine.createSpy('listener2');

    eventBus.addEventListener('foo', listener1);
    eventBus.addEventListener('foo', listener2);

    expect(eventBus._events['foo']).toContain(listener1);
    expect(eventBus._events['foo']).toContain(listener2);

    eventBus.clear();

    expect(eventBus._events).toEqual({});
  });

  it('should dispatch event with details object', () => {
    const target = {};
    const listener = jasmine.createSpy('listener');
    eventBus.addEventListener('foo', listener);

    eventBus.dispatchEvent(target, 'foo', {
      foo: 'bar',
    });

    expect(listener).toHaveBeenCalledOnce();

    const call = listener.calls.mostRecent();
    expect(call.object).toBe(target);

    const evt = call.args[0];
    expect(evt.bubbles).toBe(false);
    expect(evt.cancelable).toBe(false);
    expect(evt.timeStamp).toBeDefined();
    expect(evt.target).toBe(target);
    expect(evt.currentTarget).toBe(target);
    expect(evt.details).toEqual({
      foo: 'bar',
    });
  });

  it('should dispatch event with details function', () => {
    const target = {};
    const listener = jasmine.createSpy('listener');
    const params = jasmine.createSpy('params').and.returnValue({
      foo: 'bar',
    });

    eventBus.addEventListener('foo', listener);

    eventBus.dispatchEvent(target, 'foo', params);

    expect(listener).toHaveBeenCalledOnce();

    expect(params).toHaveBeenCalledOnce();
    expect(params.calls.mostRecent().object).toBe(target);

    const call = listener.calls.mostRecent();
    expect(call.object).toBe(target);

    const evt = call.args[0];
    expect(evt.bubbles).toBe(false);
    expect(evt.cancelable).toBe(false);
    expect(evt.timeStamp).toBeDefined();
    expect(evt.target).toBe(target);
    expect(evt.currentTarget).toBe(target);
    expect(evt.details).toEqual({
      foo: 'bar',
    });
  });

  it('should dispatch event without details', () => {
    const target = {};
    const listener = jasmine.createSpy('listener');

    eventBus.addEventListener('foo', listener);

    eventBus.dispatchEvent(target, 'foo');

    expect(listener).toHaveBeenCalledOnce();

    const call = listener.calls.mostRecent();
    expect(call.object).toBe(target);

    const evt = call.args[0];
    expect(evt.bubbles).toBe(false);
    expect(evt.cancelable).toBe(false);
    expect(evt.timeStamp).toBeDefined();
    expect(evt.target).toBe(target);
    expect(evt.currentTarget).toBe(target);
    expect(evt.details).toBeUndefined();
  });

  it('should dispatch event for all listeners', () => {
    const target = {};
    const listener1 = jasmine.createSpy('listener1');
    const listener2 = jasmine.createSpy('listener2');

    eventBus.addEventListener('foo', listener1);
    eventBus.addEventListener('foo', listener2);

    eventBus.dispatchEvent(target, 'foo');

    expect(listener1).toHaveBeenCalledOnce();
    expect(listener2).toHaveBeenCalledOnce();
  });

  it('should dispatch event with case insensitive name', () => {
    const t1 = 'Foo';
    const t2 = 'foo';
    const target = {};
    const listener1 = jasmine.createSpy('listener1');
    const listener2 = jasmine.createSpy('listener2');

    eventBus.addEventListener(t1, listener1);
    eventBus.addEventListener(t1, listener2);

    eventBus.dispatchEvent(target, t2);

    expect(listener1).toHaveBeenCalledOnce();
    expect(listener2).toHaveBeenCalledOnce();
  });

  it('should dispatch event and ignore errors', () => {
    const target = {};
    const listener1 = jasmine.createSpy('listener1').and.throwError('Error');
    const listener2 = jasmine.createSpy('listener2');

    eventBus.addEventListener('Foo', listener1);
    eventBus.addEventListener('Foo', listener2);

    eventBus.dispatchEvent(target, 'foo');

    expect(listener1).toHaveBeenCalledOnce();
    expect(listener2).toHaveBeenCalledOnce();
  });
});
