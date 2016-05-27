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

describe('$json', () => {

  let JSON;

  beforeEach(() => JSON = window.JSON);
  afterEach(() => window.JSON = JSON);

  it('toJson should turn a javascript to a json string', () => {
    const json = $json.toJson({
      foo: "bar"
    });

    expect(json).toBe('{"foo":"bar"}');
  });

  it('toJson should turn a json string to a javascript object', () => {
    const o = $json.fromJson('{"foo":"bar"}');
    expect(o).toEqual({
      foo: 'bar'
    });
  });

  it('should throw error if JSON object is not available', () => {
    window.JSON = null;

    const fromJson = () => $json.fromJson('{"foo": "bar"}');
    const toJson = () => $json.toJson({
      foo: 'bar'
    });

    expect(toJson).toThrow(Error('JSON.stringify is not available in your browser'));
    expect(fromJson).toThrow(Error('JSON.parse is not available in your browser'));
  });

  it('should throw error if JSON functions are not available', () => {
    window.JSON = {};

    const fromJson = () => $json.fromJson('{"foo": "bar"}');
    const toJson = () => $json.toJson({
      foo: 'bar'
    });

    expect(toJson).toThrow(Error('JSON.stringify is not available in your browser'));
    expect(fromJson).toThrow(Error('JSON.parse is not available in your browser'));
  });
});
