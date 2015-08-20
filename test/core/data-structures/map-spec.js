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

describe('map', function() {

  var map;

  beforeEach(function() {
    map = new HashMap();
  });

  it('should put element with given key - value and remove by key', function() {
    var key = 'foo';
    var value = {
      id: 1,
      name: 'foo'
    };

    expect(map.contains(key)).toBe(false);
    expect(map.get(key)).toBeUndefined();

    var r1 = map.put(key, value);

    expect(r1).toBe(map);
    expect(map.contains(key)).toBe(true);
    expect(map.get(key)).toBe(value);

    var r2 = map.remove(key);

    expect(r2).toBe(map);
    expect(map.contains(key)).toBe(false);
    expect(map.get(key)).toBeUndefined();
  });
});