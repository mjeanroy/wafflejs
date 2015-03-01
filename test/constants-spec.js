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

describe('constants', function() {

  it('should define css sortable class', function() {
    expect(CSS_SORTABLE).toBe('waffle-sortable');
  });

  it('should define css sortable asc class', function() {
    expect(CSS_SORTABLE_ASC).toBe('waffle-sortable-asc');
  });

  it('should define css sortable desc class', function() {
    expect(CSS_SORTABLE_DESC).toBe('waffle-sortable-desc');
  });

  it('should define data attribute name for id value', function() {
    expect(DATA_WAFFLE_ID).toBe('data-waffle-id');
  });

  it('should define data attribute name for idx value', function() {
    expect(DATA_WAFFLE_IDX).toBe('data-waffle-idx');
  });

  it('should define data attribute name for sortable value', function() {
    expect(DATA_WAFFLE_SORTABLE).toBe('data-waffle-sortable');
  });

  it('should define data attribute name for order value', function() {
    expect(DATA_WAFFLE_ORDER).toBe('data-waffle-order');
  });

  it('should define order flag for ascendant order', function() {
    expect(CHAR_ORDER_ASC).toBe('+');
  });

  it('should define order flag for descendant order', function() {
    expect(CHAR_ORDER_DESC).toBe('-');
  });
});