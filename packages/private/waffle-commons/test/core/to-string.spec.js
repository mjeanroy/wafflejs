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

 export const toStringSpec = (toString) => {
   describe('toString', () => {
     it('should should return to string value', () => {
       expect(toString(null)).toBe('');
       expect(toString(undefined)).toBe('');
       expect(toString('foo')).toBe('foo');
       expect(toString('FOO')).toBe('FOO');
       expect(toString(0)).toBe('0');
       expect(toString(false)).toBe('false');
     });

     it('should should call object toString value', () => {
       const expected = 'o';
       const toStringSpy = jasmine.createSpy('toString').and.returnValue(expected);
       const o = {
         toString: toStringSpy,
       };

       const result = toString(o);

       expect(result).toBe(expected);
       expect(toStringSpy).toHaveBeenCalledWith();
     });
   });
 };
