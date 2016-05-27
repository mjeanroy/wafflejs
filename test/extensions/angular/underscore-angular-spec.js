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

  it('should define _.noop with angular function', () => {
    expect(_.noop).toBeAFunction();
    expect(_.noop).toBe(angular.noop);
  });

  it('should define _.identity with angular function', () => {
    expect(_.identity).toBeAFunction();
    expect(_.identity).toBe(angular.identity);
  });

  it('should define _.isString with angular function', () => {
    expect(_.isString).toBeAFunction();
    expect(_.isString).toBe(angular.isString);
  });

  it('should define _.isFunction with angular function', () => {
    expect(_.isFunction).toBeAFunction();
    expect(_.isFunction).toBe(angular.isFunction);
  });

  it('should define _.isArray with angular function', () => {
    expect(_.isArray).toBeAFunction();
    expect(_.isArray).toBe(angular.isArray);
  });

  it('should define _.isNumber with angular function', () => {
    expect(_.isNumber).toBeAFunction();
    expect(_.isNumber).toBe(angular.isNumber);
  });

  it('should define _.isDate with angular function', () => {
    expect(_.isDate).toBeAFunction();
    expect(_.isDate).toBe(angular.isDate);
  });

  it('should define _.isObject with angular function', () => {
    expect(_.isObject).toBeAFunction();
    expect(_.isObject).toBe(angular.isObject);
  });

  it('should define _.isElement with angular function', () => {
    expect(_.isElement).toBeAFunction();
    expect(_.isElement).toBe(angular.isElement);
  });

  it('should define _.clone with angular function', () => {
    expect(_.clone).toBeAFunction();
    expect(_.clone).toBe(angular.copy);
  });
});
