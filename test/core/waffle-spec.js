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

describe('waffle', function() {

  it('should define Grid', function() {
    expect(Waffle.Grid).toBe(Grid);
  });

  it('should create Grid', function() {
    var table = document.createElement('table');
    var options = {
    };

    var grid = Waffle.create(table, options);

    expect(grid).toBeDefined();
    expect(grid).toBeInstanceOf(Grid);
  });

  it('should add new global renderer', function() {
    expect($renderers.foo).toBeUndefined();
    var renderer = jasmine.createSpy('renderer').and.returnValue('foo');

    Waffle.addRenderer('foo', renderer);

    expect($renderers.foo).toBe(renderer);
    delete $renderers.foo;
  });

  it('should add new global comparator', function() {
    expect($comparators.foo).toBeUndefined();
    var comparator = jasmine.createSpy('comparator').and.returnValue(0);

    Waffle.addComparator('foo', comparator);

    expect($comparators.foo).toBe(comparator);
    delete $comparators.foo;
  });
});
