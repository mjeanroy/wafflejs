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

describe('waffle-jq-angular', () => {

  it('should override default options', () => {
    expect(Waffle.options).toBe(Grid.options);
    expect(Grid.options).toEqual(jasmine.objectContaining({
      key: jasmine.any(Function)
    }));
  });

  it('should generate $$hashKey by default', () => {
    spyOn(_, 'uniqueId').and.callThrough();

    const keyFn = Grid.options.key;
    const o = {};
    const id = keyFn(o);

    expect(_.uniqueId).toHaveBeenCalled();
    expect(id).toBeDefined();
    expect(id).toBeAString();
    expect(id).toBe(o.$$hashKey);

    _.uniqueId.calls.reset();

    const newId = keyFn(o);
    expect(newId).toBe(id);
    expect(_.uniqueId).not.toHaveBeenCalled();
  });
});
