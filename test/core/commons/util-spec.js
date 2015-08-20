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

describe('$util', function() {

  it('should translate a value to a px notation', function() {
    expect($util.toPx(100)).toBe('100px');
    expect($util.toPx('100px')).toBe('100px');
  });

  it('should translate a px notation to a number', function() {
    expect($util.fromPx('100px')).toBe(100);
    expect($util.fromPx(100)).toBe(100);
  });

  it('should check if string end with given suffix', function() {
    expect($util.endWith('10%', '%')).toBeTrue();
    expect($util.endWith('10%', 'px')).toBeFalse();
  });

  it('should check if value is a percentage value', function() {
    expect($util.isPercentage('10%')).toBeTrue();
    expect($util.isPercentage('10px')).toBeFalse();
  });

  it('should convert percentage value', function() {
    expect($util.fromPercentage(10)).toBe(10);
    expect($util.fromPercentage('10%')).toBe(10);
  });

  it('should check if value is a percentage value', function() {
    expect($util.isPx('10px')).toBeTrue();
    expect($util.isPx('10%')).toBeFalse();
  });

  it('should capitalize string', function() {
    expect($util.capitalize('foo')).toBe('Foo');
    expect($util.capitalize('FOO')).toBe('FOO');
    expect($util.capitalize('Foo')).toBe('Foo');
  });

  it('should parse json object', function() {
    var o = $util.parse('{"id": 1, "name": "foo"}');
    expect(o).toEqual({
      id: 1,
      name: 'foo'
    });
  });

  it('should parse json array', function() {
    var o = $util.parse('[{"id": 1, "name": "foo"}]');
    expect(o).toEqual([{
      id: 1,
      name: 'foo'
    }]);
  });

  it('should parse boolean value', function() {
    var f = $util.parse('false');
    var t = $util.parse('true');
    expect(f).toBe(false);
    expect(t).toBe(true);
  });

  it('should parse number value', function() {
    var nb = $util.parse('25');
    expect(nb).toBe(25);
  });

  it('should parse string value', function() {
    var str1 = $util.parse('hello');
    var str2 = $util.parse('"hello"');
    expect(str1).toBe('hello');
    expect(str2).toBe('hello');
  });

  it('should convert to spinal case string', function() {
    expect($util.toSpinalCase('hello')).toBe('hello');
    expect($util.toSpinalCase('helloWorld')).toBe('hello-world');
    expect($util.toSpinalCase('hello-world')).toBe('hello-world');
  });

  it('should get result', function() {
    expect($util.resultWith('foo')).toBe('foo');

    var ctx = {};
    var fn = jasmine.createSpy('fn').and.returnValue('bar');
    expect($util.resultWith(fn, ctx, ['foo'])).toBe('bar');
    expect(fn).toHaveBeenCalledWith('foo');
  });

  it('should split array into chunks', function() {
    var array = [0, 1];
    var chunks = $util.split(array, 1);
    expect(chunks).toEqual([[0], [1]]);
  });

  it('should split collection into chunks of two elements', function() {
    var array = [0, 1, 2];
    var chunks = $util.split(array, 2);
    expect(chunks).toEqual([[0, 1], [2]]);
  });

  it('should destroy object', function() {
    var fn = jasmine.createSpy('fn');
    var protoFn = jasmine.createSpy('protoFn');
    var prototype = {
      protoFn: protoFn
    };

    var o = {
      foo: 'bar',
      fn: fn
    };

    o.prototype = prototype;

    $util.destroy(o);

    expect(o.foo).toBeNull();
    expect(o.fn).toBeNull();
    expect(o.prototype).toBeNull();
    expect(prototype.protoFn).toBe(protoFn);
  });

  it('should call async task', function() {
    var data = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];

    var onIteration = jasmine.createSpy('onIteration');
    var onEnded = jasmine.createSpy('onEnded');

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
