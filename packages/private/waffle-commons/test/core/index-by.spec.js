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

export const indexBySpec = (indexBy) => {
  describe('indexBy', () => {
    it('should index element in array', () => {
      const callback = jasmine.createSpy('callback').and.callFake((value) => (
        value.id
      ));

      const o1 = {id: 1};
      const o2 = {id: 2};
      const o3 = {id: 3};
      const o4 = {id: 4};
      const a = [o1, o2, o3, o4];

      const i1 = indexBy(a, callback);
      const i2 = indexBy(a, 'id');

      expect(i1).toEqual(i2);
      expect(i1).toEqual({
        1: o1,
        2: o2,
        3: o3,
        4: o4,
      });
    });
  });
};
