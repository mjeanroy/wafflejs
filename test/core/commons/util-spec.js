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

describe('$util', () => {

  it('should translate a value to a px notation', () => {
    expect($util.toPx(100)).toBe('100px');
    expect($util.toPx('100px')).toBe('100px');
  });

  it('should translate a px notation to a number', () => {
    expect($util.fromPx('100px')).toBe(100);
    expect($util.fromPx(100)).toBe(100);
  });

  it('should check if string end with given suffix', () => {
    expect($util.endWith('10%', '%')).toBeTrue();
    expect($util.endWith('10%', 'px')).toBeFalse();
  });

  it('should check if value is a percentage value', () => {
    expect($util.isPercentage('10%')).toBeTrue();
    expect($util.isPercentage('10px')).toBeFalse();
  });

  it('should convert percentage value', () => {
    expect($util.fromPercentage(10)).toBe(10);
    expect($util.fromPercentage('10%')).toBe(10);
  });

  it('should check if value is a percentage value', () => {
    expect($util.isPx('10px')).toBeTrue();
    expect($util.isPx('10%')).toBeFalse();
  });

  it('should capitalize string', () => {
    expect($util.capitalize('foo')).toBe('Foo');
    expect($util.capitalize('FOO')).toBe('FOO');
    expect($util.capitalize('Foo')).toBe('Foo');
  });

  it('should parse json object', () => {
    const o = $util.parse('{"id": 1, "name": "foo"}');
    expect(o).toEqual({
      id: 1,
      name: 'foo'
    });
  });

  it('should parse json array', () => {
    const o = $util.parse('[{"id": 1, "name": "foo"}]');
    expect(o).toEqual([{
      id: 1,
      name: 'foo'
    }]);
  });

  it('should parse boolean value', () => {
    const f = $util.parse('false');
    const t = $util.parse('true');
    expect(f).toBe(false);
    expect(t).toBe(true);
  });

  it('should handle exception', () => {
    spyOn($json, 'fromJson').and.throwError('Error');

    expect($util.parse('false')).toBe(false);
    expect($util.parse('true')).toBe(true);
    expect($util.parse('10')).toBe(10);
    expect($util.parse('foo')).toBe('foo');
  });

  it('should parse number value', () => {
    const nb = $util.parse('25');
    expect(nb).toBe(25);
  });

  it('should parse string value', () => {
    const str1 = $util.parse('hello');
    const str2 = $util.parse('"hello"');
    expect(str1).toBe('hello');
    expect(str2).toBe('hello');
  });

  it('should convert to spinal case string', () => {
    expect($util.toSpinalCase('hello')).toBe('hello');
    expect($util.toSpinalCase('helloWorld')).toBe('hello-world');
    expect($util.toSpinalCase('hello-world')).toBe('hello-world');
  });

  it('should get result', () => {
    expect($util.resultWith('foo')).toBe('foo');

    const ctx = {};
    const fn = jasmine.createSpy('fn').and.returnValue('bar');
    expect($util.resultWith(fn, ctx, ['foo'])).toBe('bar');
    expect(fn).toHaveBeenCalledWith('foo');
  });

  it('should split array into chunks', () => {
    const array = [0, 1];
    const chunks = $util.split(array, 1);
    expect(chunks).toEqual([[0], [1]]);
  });

  it('should split collection into chunks of two elements', () => {
    const array = [0, 1, 2];
    const chunks = $util.split(array, 2);
    expect(chunks).toEqual([[0, 1], [2]]);
  });

  it('should destroy object', () => {
    const fn = jasmine.createSpy('fn');
    class Test {
      constructor() {
        this.foo = 'test';
        this.fn = fn;
      }

      protoFn() {
      }
    }

    const o = new Test();
    const proto = Test.prototype;

    $util.destroy(o);

    expect(o.foo).toBeNull();
    expect(o.fn).toBeNull();
    expect(proto.protoFn).toBeDefined();
  });

  it('should call async task', () => {
    const data = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];

    const onIteration = jasmine.createSpy('onIteration');
    const onEnded = jasmine.createSpy('onEnded');

    $util.asyncTask(data, 10, onIteration, onEnded);

    expect(onIteration).not.toHaveBeenCalled();
    expect(onEnded).not.toHaveBeenCalled();

    jasmine.clock().tick();

    expect(onIteration).toHaveBeenCalledWith([1, 2, 3], 0);
    expect(onEnded).not.toHaveBeenCalled();

    onIteration.calls.reset();
    onEnded.calls.reset();

    jasmine.clock().tick(10);

    expect(onIteration).toHaveBeenCalledWith([4, 5, 6], 3);
    expect(onEnded).not.toHaveBeenCalled();

    onIteration.calls.reset();
    onEnded.calls.reset();

    jasmine.clock().tick(10);

    expect(onIteration).toHaveBeenCalledWith([7, 8, 9], 6);
    expect(onEnded).toHaveBeenCalled();
  });
});
