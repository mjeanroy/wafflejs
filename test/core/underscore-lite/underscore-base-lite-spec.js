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

describe('_', () => {

  it('should check if object is null', () => {
    expect(_.isNull(null)).toBe(true);
    expect(_.isNull(undefined)).toBe(false);
    expect(_.isNull(0)).toBe(false);
    expect(_.isNull('')).toBe(false);
    expect(_.isNull(NaN)).toBe(false);
  });

  it('should check if object is a boolean', () => {
    expect(_.isBoolean(true)).toBe(true);
    expect(_.isBoolean(false)).toBe(true);
    expect(_.isBoolean(Boolean(''))).toBe(true);

    expect(_.isBoolean(undefined)).toBe(false);
    expect(_.isBoolean(null)).toBe(false);
    expect(_.isBoolean(1)).toBe(false);
  });

  it('should check if object is NaN', () => {
    expect(_.isNaN(true)).toBe(false);
    expect(_.isNaN(false)).toBe(false);
    expect(_.isNaN(Boolean(''))).toBe(false);
    expect(_.isNaN(undefined)).toBe(false);
    expect(_.isNaN(null)).toBe(false);
    expect(_.isNaN(1)).toBe(false);

    expect(_.isNaN(NaN)).toBe(true);
  });

  it('should bind function with context', () => {
    const fn = function() {
      return this;
    };

    const ctx = {
      foo: 'bar'
    };

    const result = _.bind(fn, ctx);

    expect(result()).toBe(ctx);
  });

  it('should get a constant function', () => {
    expect(_.constant(true)()).toBe(true);
    expect(_.constant(false)()).toBe(false);
    expect(_.constant('foo')()).toBe('foo');
    expect(_.constant('')()).toBe('');
  });

  it('should call function once and only once', () => {
    const callback = jasmine.createSpy('callback').and.returnValue('foo');
    const func = _.once(callback);

    const r1 = func(1, 2, 3);
    expect(r1).toBe('foo');
    expect(callback).toHaveBeenCalledWith(1, 2, 3);
    expect(callback.calls.count()).toBe(1);

    const r2 = func(1, 2, 3);
    expect(r2).toBe('foo');
    expect(callback).toHaveBeenCalledWith(1, 2, 3);
    expect(callback.calls.count()).toBe(1);
  });

  it('should transmute arguments object to an array', () => {
    const foo = (...args) => args;
    const newArray = foo(1, 2, 3);

    expect(newArray).toEqual([1, 2, 3]);
  });

  it('should get all functions of given object', () => {
    const o1 = {
      foo: 'custom',
      bar: undefined
    };

    const o2 = {
      foo: 'foo',
      bar: 'bar',
      baz: 'baz'
    };

    const result = _.defaults(o1, o2);

    expect(result).toBe(o1);
    expect(result).toEqual({
      foo: 'custom',
      bar: 'bar',
      baz: 'baz'
    });
  });

  it('should get all functions of given object', () => {
    const obj = {
      foo: () => {},
      bar: () => {},
      foobar: 2
    };

    const functions = _.functions(obj);

    expect(functions).toEqual(['bar', 'foo']);
  });

  it('should execute or return value', () => {
    const obj = {
      foo: 1,
      bar: jasmine.createSpy('bar').and.returnValue(2)
    };

    expect(_.result(obj, 'foo')).toBe(1);
    expect(_.result(obj, 'bar')).toBe(2);
  });

  it('should check if object contains key', () => {
    expect(_.has({ foo: 'foo' }, 'foo')).toBe(true);
    expect(_.has({ foo: 'foo' }, 'bar')).toBe(false);

    expect(_.has([1, 2], '0')).toBe(true);
    expect(_.has([1, 2], '1')).toBe(true);
    expect(_.has([1, 2], '2')).toBe(false);
  });

  it('should get size of list', () => {
    expect(_.size(undefined)).toBe(0);
    expect(_.size(null)).toBe(0);
    expect(_.size([])).toBe(0);
    expect(_.size([1])).toBe(1);
    expect(_.size([1, 2])).toBe(2);
  });

  it('should check get object keys', () => {
    const k1 = _.keys({ foo: '0', 'bar': '1' });
    expect(k1).toHaveLength(2);
    expect(k1).toContain('foo');
    expect(k1).toContain('bar');

    const k2 = _.keys([1, 2]);
    expect(k2).toHaveLength(2);
    expect(k2).toContain('0');
    expect(k2).toContain('1');
  });

  it('should apply callback and return new array with results', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value * 2);
    const array = [1, 2, 3];

    const results = _.map(array, callback);

    expect(results).toEqual([2, 4, 6]);
    expect(array).toEqual([1, 2, 3]);
    expect(callback).toHaveBeenCalledWith(1, 0, array);
    expect(callback).toHaveBeenCalledWith(2, 1, array);
    expect(callback).toHaveBeenCalledWith(3, 2, array);
  });

  it('should check if every elements of array statisfy callback', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value % 2 === 0);
    const array1 = [1, 2, 3];
    const array2 = [2, 4, 6];

    const r1 = _.every(array1, callback);

    expect(r1).toBe(false);
    expect(callback).toHaveBeenCalledWith(1, 0, array1);
    expect(callback).not.toHaveBeenCalledWith(2, 1, array1);
    expect(callback).not.toHaveBeenCalledWith(3, 2, array1);

    const r2 = _.every(array2, callback);

    expect(r2).toBe(true);
    expect(callback).toHaveBeenCalledWith(2, 0, array2);
    expect(callback).toHaveBeenCalledWith(4, 1, array2);
    expect(callback).toHaveBeenCalledWith(6, 2, array2);
  });

  it('should check if some elements of array statisfy callback', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value % 2 === 0);
    const array1 = [1, 3, 5];
    const array2 = [2, 4, 6];

    const r1 = _.some(array1, callback);

    expect(r1).toBe(false);
    expect(callback).toHaveBeenCalledWith(1, 0, array1);
    expect(callback).toHaveBeenCalledWith(3, 1, array1);
    expect(callback).toHaveBeenCalledWith(5, 2, array1);

    const r2 = _.some(array2, callback);

    expect(r2).toBe(true);
    expect(callback).toHaveBeenCalledWith(2, 0, array2);
    expect(callback).not.toHaveBeenCalledWith(4, 1, array2);
    expect(callback).not.toHaveBeenCalledWith(6, 2, array2);
  });

  it('should reduce array from left to right to a single value without initial value', () => {
    const callback = jasmine.createSpy('callback').and.callFake((previous, value) => previous + value);
    const array = [0, 1, 2, 3, 4];
    const result = _.reduce(array, callback);

    expect(result).toBe(10);

    expect(callback).toHaveBeenCalledWith(0, 1, 1, array);
    expect(callback).toHaveBeenCalledWith(1, 2, 2, array);
    expect(callback).toHaveBeenCalledWith(3, 3, 3, array);
    expect(callback).toHaveBeenCalledWith(6, 4, 4, array);
  });

  it('should reduce array from left to right to a single value with initial value', () => {
    const callback = jasmine.createSpy('callback').and.callFake((previous, value) => previous + value);
    const array = [0, 1, 2, 3, 4];
    const result = _.reduce(array, callback, 10);

    expect(result).toBe(20);

    expect(callback).toHaveBeenCalledWith(10, 0, 0, array);
    expect(callback).toHaveBeenCalledWith(10, 1, 1, array);
    expect(callback).toHaveBeenCalledWith(11, 2, 2, array);
    expect(callback).toHaveBeenCalledWith(13, 3, 3, array);
    expect(callback).toHaveBeenCalledWith(16, 4, 4, array);
  });

  it('should reduce array from right to left to a single value without initial value', () => {
    const callback = jasmine.createSpy('callback').and.callFake((previous, value) => previous + value);
    const array = [0, 1, 2, 3, 4];
    const result = _.reduceRight(array, callback);

    expect(result).toBe(10);
    expect(callback).toHaveBeenCalledWith(4, 3, 3, array);
    expect(callback).toHaveBeenCalledWith(7, 2, 2, array);
    expect(callback).toHaveBeenCalledWith(9, 1, 1, array);
    expect(callback).toHaveBeenCalledWith(10, 0, 0, array);
  });

  it('should reduce array from right to left to a single value with initial value', () => {
    const callback = jasmine.createSpy('callback').and.callFake((previous, value) => previous + value);
    const array = [0, 1, 2, 3, 4];
    const result = _.reduceRight(array, callback, 10);

    expect(result).toBe(20);
    expect(callback).toHaveBeenCalledWith(10, 4, 4, array);
    expect(callback).toHaveBeenCalledWith(14, 3, 3, array);
    expect(callback).toHaveBeenCalledWith(17, 2, 2, array);
    expect(callback).toHaveBeenCalledWith(19, 1, 1, array);
  });

  it('should filter array', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value % 2 === 0);
    const array = [1, 2, 3, 4];
    const newArray = _.filter(array, callback, 10);

    expect(newArray).toEqual([2, 4]);
    expect(callback).toHaveBeenCalledWith(1, 0, array);
    expect(callback).toHaveBeenCalledWith(2, 1, array);
    expect(callback).toHaveBeenCalledWith(3, 2, array);
    expect(callback).toHaveBeenCalledWith(4, 3, array);
  });

  it('should reject value in array', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value % 2 === 0);
    const array = [1, 2, 3, 4];
    const newArray = _.reject(array, callback, 10);

    expect(newArray).toEqual([1, 3]);
    expect(callback).toHaveBeenCalledWith(1, 0, array);
    expect(callback).toHaveBeenCalledWith(2, 1, array);
    expect(callback).toHaveBeenCalledWith(3, 2, array);
    expect(callback).toHaveBeenCalledWith(4, 3, array);
  });

  it('should get first index of element in array', () => {
    const array = [1, 2, 3, 4, 4];

    expect(_.indexOf(array, 1)).toBe(0);
    expect(_.indexOf(array, 2)).toBe(1);
    expect(_.indexOf(array, 3)).toBe(2);
    expect(_.indexOf(array, 4)).toBe(3);
    expect(_.indexOf(array, 5)).toBe(-1);
    expect(_.indexOf(array, 0)).toBe(-1);
  });

  it('should get last index of element in array', () => {
    const array = [1, 2, 3, 4, 4];

    expect(_.lastIndexOf(array, 1)).toBe(0);
    expect(_.lastIndexOf(array, 2)).toBe(1);
    expect(_.lastIndexOf(array, 3)).toBe(2);
    expect(_.lastIndexOf(array, 4)).toBe(4);
    expect(_.lastIndexOf(array, 5)).toBe(-1);
    expect(_.lastIndexOf(array, 0)).toBe(-1);
  });

  it('should array contains data', () => {
    const array = [1, 2, 3, 4, 4];

    expect(_.contains(array, 1)).toBe(true);
    expect(_.contains(array, 2)).toBe(true);
    expect(_.contains(array, 3)).toBe(true);
    expect(_.contains(array, 4)).toBe(true);
    expect(_.contains(array, 5)).toBe(false);
    expect(_.contains(array, 0)).toBe(false);
  });

  it('should get first elements of array', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value % 2 === 0);
    const array = [1, 2, 3, 4];

    expect(_.first(array)).toBe(1);
    expect(_.first(array, 1)).toEqual([1]);
    expect(_.first(array, 2)).toEqual([1, 2]);
    expect(_.first(array, 3)).toEqual([1, 2, 3]);
    expect(_.first(array, 4)).toEqual([1, 2, 3, 4]);
  });

  it('should get last elements of array', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value % 2 === 0);
    const array = [1, 2, 3, 4];

    expect(_.last(array)).toBe(4);
    expect(_.last(array, 1)).toEqual([4]);
    expect(_.last(array, 2)).toEqual([3, 4]);
    expect(_.last(array, 3)).toEqual([2, 3, 4]);
    expect(_.last(array, 4)).toEqual([1, 2, 3, 4]);
  });

  it('should return rest of array', () => {
    const array = [5, 4, 3, 2, 1];
    expect(_.rest(array)).toEqual([4, 3, 2, 1]);
    expect(_.rest(array, 1)).toEqual([4, 3, 2, 1]);
    expect(_.rest(array, 2)).toEqual([3, 2, 1]);
    expect(_.rest(array, 3)).toEqual([2, 1]);
    expect(_.rest(array, 4)).toEqual([1]);
    expect(_.rest(array, 5)).toEqual([]);
  });

  it('should return initial elements of array', () => {
    const array = [5, 4, 3, 2, 1];
    expect(_.initial(array)).toEqual([5, 4, 3, 2]);
    expect(_.initial(array, 1)).toEqual([5, 4, 3, 2]);
    expect(_.initial(array, 2)).toEqual([5, 4, 3]);
    expect(_.initial(array, 3)).toEqual([5, 4]);
    expect(_.initial(array, 4)).toEqual([5]);
    expect(_.initial(array, 5)).toEqual([]);
  });

  it('should find element in array', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value % 2 === 0);
    const a1 = [1, 2, 3, 4];
    const a2 = [1, 3, 5];

    const r1 = _.find(a1, callback);
    const r2 = _.find(a2, callback);

    expect(r1).toBe(2);
    expect(r2).toBeUndefined();

    expect(callback).toHaveBeenCalledWith(1, 0, a1);
    expect(callback).toHaveBeenCalledWith(2, 1, a1);
    expect(callback).not.toHaveBeenCalledWith(3, 2, a1);
    expect(callback).not.toHaveBeenCalledWith(4, 3, a1);

    expect(callback).toHaveBeenCalledWith(1, 0, a2);
    expect(callback).toHaveBeenCalledWith(3, 1, a2);
    expect(callback).toHaveBeenCalledWith(5, 2, a2);
  });

  it('should wrap function', () => {
    const fn = jasmine.createSpy('fn').and.returnValue('hello world');
    const wrapper = jasmine.createSpy('wrapper').and.callFake(function(wrapper, a1, a2) {
      return wrapper.call(this, a1, a2);
    });

    const object = {};

    const proxy = _.wrap(fn, wrapper);

    expect(proxy).toBeAFunction();
    expect(fn).not.toHaveBeenCalled();
    expect(wrapper).not.toHaveBeenCalled();

    const result = proxy.call(object, 'foo', 'bar');

    expect(fn).toHaveBeenCalledWith('foo', 'bar');
    expect(wrapper).toHaveBeenCalledWith(fn, 'foo', 'bar');

    const callWrapper = wrapper.calls.mostRecent();
    expect(callWrapper.object).toBe(object);

    const callFn = fn.calls.mostRecent();
    expect(callFn.object).toBe(object);
  });

  it('should index element in array', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value.id);
    const o1 = { id: 1 };
    const o2 = { id: 2 };
    const o3 = { id: 3 };
    const o4 = { id: 4 };
    const a = [o1, o2, o3, o4];

    const i1 = _.indexBy(a, callback);
    const i2 = _.indexBy(a, 'id');

    expect(i1).toEqual(i2);
    expect(i1).toEqual({
      1: o1,
      2: o2,
      3: o3,
      4: o4
    });
  });

  it('should group element in array', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value.name);
    const o1 = { id: 1, name: 'foo' };
    const o2 = { id: 2, name: 'bar' };
    const o3 = { id: 3, name: 'foo' };
    const o4 = { id: 4, name: 'bar' };
    const a = [o1, o2, o3, o4];

    const g1 = _.groupBy(a, callback);
    const g2 = _.groupBy(a, 'name');

    expect(g1).toEqual(g2);
    expect(g1).toEqual({
      foo: [o1, o3],
      bar: [o2, o4]
    });
  });

  it('should count element in array', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value.name);
    const o1 = { id: 1, name: 'foo' };
    const o2 = { id: 2, name: 'bar' };
    const o3 = { id: 3, name: 'foo' };
    const a = [o1, o2, o3];

    const c1 = _.countBy(a, callback);
    const c2 = _.countBy(a, callback);

    expect(c1).toEqual(c2);
    expect(c1).toEqual({
      foo: 2,
      bar: 1
    });
  });

  it('should partition array', () => {
    const callback = jasmine.createSpy('callback').and.callFake(value => value % 2 !== 0);
    const a = [0, 1, 2, 3, 4, 5];

    const partition = _.partition(a, callback);

    expect(partition).toEqual([
      [1, 3, 5],
      [0, 2, 4]
    ]);

    expect(callback).toHaveBeenCalledWith(a[0], 0, a);
    expect(callback).toHaveBeenCalledWith(a[1], 1, a);
  });

  it('should memoize result', () => {
    const expensive = jasmine.createSpy('callback').and.returnValue('foo');
    const fn = () => {
      return expensive();
    };

    const memoize = _.memoize(fn, () => {
      return 'foo';
    });

    expect(memoize()).toBe('foo');
    expect(expensive.calls.count()).toBe(1);

    expect(memoize()).toBe('foo');
    expect(expensive.calls.count()).toBe(1);
  });

  it('should debounce function', () => {
    const expensive = jasmine.createSpy('callback').and.returnValue('bar');
    const debounced = _.debounce(expensive, 500);
    const now = new Date().getTime();

    spyOn(_, 'now').and.returnValue(now);

    debounced('foo');

    expect(expensive).not.toHaveBeenCalled();

    _.now.and.returnValue(now + 250);
    jasmine.clock().tick(250);

    expect(expensive).not.toHaveBeenCalled();

    debounced('foo');

    _.now.and.returnValue(now + 750);
    jasmine.clock().tick(500);

    expect(expensive).toHaveBeenCalledWith('foo');
  });

  it('should generate unique id', () => {
    const id1 = _.uniqueId();
    const id2 = _.uniqueId();

    expect(id1).toBeDefined();
    expect(id2).toBeDefined();
    expect(id1).not.toEqual(id2);
  });

  it('should generate unique id with prefix', () => {
    const prefix = 'foo';
    const id1 = _.uniqueId(prefix);
    const id2 = _.uniqueId(prefix);

    expect(id1).toBeDefined();
    expect(id2).toBeDefined();
    expect(id1).not.toEqual(id2);

    expect(id1).toStartWith(prefix);
    expect(id2).toStartWith(prefix);
  });
});
