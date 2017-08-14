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

export const findSpec = (find) => {
  describe('find', () => {
    it('should find element in collection', () => {
      const callback = jasmine.createSpy('callback').and.callFake((value) => (
        value % 2 === 0
      ));

      const a1 = [1, 2, 3, 4];
      const a2 = [1, 3, 5];

      const r1 = find(a1, callback);
      const r2 = find(a2, callback);

      expect(r1).toBe(2);
      expect(r2).toBeUndefined();

      expect(callback).toHaveBeenCalledWith(1, 0, a1);
      expect(callback).toHaveBeenCalledWith(2, 1, a1);
      expect(callback).not.toHaveBeenCalledWith(3, 2, a1);
      expect(callback).not.toHaveBeenCalledWith(4, 3, a1);

      expect(callback).toHaveBeenCalledWith(1, 0, a2);
      expect(callback).toHaveBeenCalledWith(3, 1, a2);
      expect(callback).toHaveBeenCalledWith(5, 2, a2);
    });
  });
};
