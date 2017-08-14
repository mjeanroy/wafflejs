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

import {getRenderer} from '../../../src/core/renderers/index';

describe('renderers', () => {
  it('should turn value to a lowercase string', () => {
    const lowercase = getRenderer('$lowercase');

    expect(lowercase('FOO')).toBe('foo');
    expect(lowercase('foo')).toBe('foo');
    expect(lowercase('Foo')).toBe('foo');

    expect(lowercase(undefined)).toBe('');
    expect(lowercase(null)).toBe('');
    expect(lowercase(0)).toBe('0');
    expect(lowercase(false)).toBe('false');
  });

  it('should turn value to an uppercase string', () => {
    const uppercase = getRenderer('$uppercase');

    expect(uppercase('FOO')).toBe('FOO');
    expect(uppercase('foo')).toBe('FOO');
    expect(uppercase('Foo')).toBe('FOO');

    expect(uppercase(undefined)).toBe('');
    expect(uppercase(null)).toBe('');
    expect(uppercase(0)).toBe('0');
    expect(uppercase(false)).toBe('FALSE');
  });

  it('should return exact value', () => {
    const identity = getRenderer('$identity');

    expect(identity('FOO')).toBe('FOO');
    expect(identity(undefined)).toBe(undefined);
    expect(identity(null)).toBe(null);
    expect(identity(0)).toBe(0);
    expect(identity(false)).toBe(false);
  });

  it('should return empty value', () => {
    const empty = getRenderer('$empty');

    expect(empty('FOO')).toBe('');
    expect(empty(undefined)).toBe('');
    expect(empty(null)).toBe('');
    expect(empty(0)).toBe('');
    expect(empty(false)).toBe('');
  });

  it('should capitalize string', () => {
    const capitalize = getRenderer('$capitalize');

    expect(capitalize('foo')).toBe('Foo');
    expect(capitalize('FOO')).toBe('FOO');
    expect(capitalize(0)).toBe('0');
    expect(capitalize(false)).toBe('False');
    expect(capitalize(null)).toBe('');
    expect(capitalize(undefined)).toBe('');
  });
});
