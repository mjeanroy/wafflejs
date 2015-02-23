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

describe('renderers', function() {

  it('should turn value to a lowercase string', function() {
    expect($renderers.lowercase('FOO')).toBe('foo');
    expect($renderers.lowercase('foo')).toBe('foo');
    expect($renderers.lowercase('Foo')).toBe('foo');

    expect($renderers.lowercase(undefined)).toBe('');
    expect($renderers.lowercase(null)).toBe('');
    expect($renderers.lowercase(0)).toBe('0');
    expect($renderers.lowercase(false)).toBe('false');
  });

  it('should turn value to an uppercase string', function() {
    expect($renderers.uppercase('FOO')).toBe('FOO');
    expect($renderers.uppercase('foo')).toBe('FOO');
    expect($renderers.uppercase('Foo')).toBe('FOO');

    expect($renderers.uppercase(undefined)).toBe('');
    expect($renderers.uppercase(null)).toBe('');
    expect($renderers.uppercase(0)).toBe('0');
    expect($renderers.uppercase(false)).toBe('FALSE');
  });

  it('should return exact value', function() {
    expect($renderers.identity('FOO')).toBe('FOO');
    expect($renderers.identity(undefined)).toBe(undefined);
    expect($renderers.identity(null)).toBe(null);
    expect($renderers.identity(0)).toBe(0);
    expect($renderers.identity(false)).toBe(false);
  });

  it('should return empty value', function() {
    expect($renderers.empty('FOO')).toBe('');
    expect($renderers.empty(undefined)).toBe('');
    expect($renderers.empty(null)).toBe('');
    expect($renderers.empty(0)).toBe('');
    expect($renderers.empty(false)).toBe('');
  });

  it('should capitalize string', function() {
    expect($renderers.capitalize('foo')).toBe('Foo');
    expect($renderers.capitalize('FOO')).toBe('FOO');
    expect($renderers.capitalize(0)).toBe('0');
    expect($renderers.capitalize(false)).toBe('False');
    expect($renderers.capitalize(null)).toBe('');
    expect($renderers.capitalize(undefined)).toBe('');
  });
});