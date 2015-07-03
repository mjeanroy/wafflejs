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

describe('Grid Util', function() {

  beforeEach(function() {
  });

  it('should get data index from row', function() {
    var row = document.createElement('tr');
    row.setAttribute('data-waffle-idx', 10);
    expect(GridUtil.getDataIndex(row)).toBe(10);
  });

  describe('getRowIndexForDataIndex', function() {
    it('should return -1 if rows is an empty array', function() {
      var rows = [];
      expect(GridUtil.getRowIndexForDataIndex(rows, 0)).toBe(-1);
      expect(GridUtil.getRowIndexForDataIndex(rows, 1)).toBe(-1);
      expect(GridUtil.getRowIndexForDataIndex(rows, 2)).toBe(-1);
    });

    it('should get row index of data', function() {
      var upperBound = 10;
      var rows = [];

      for (var i = 0; i < upperBound; i++) {
        var row = document.createElement('tr');
        row.setAttribute('data-waffle-idx', i);
        rows.push(row);
      }

      for (var k = 0; k < upperBound; k++) {
        expect(GridUtil.getRowIndexForDataIndex(rows, k)).toBe(k);
      }
    });

    it('should get row index of data with filtered data', function() {
      var upperBound = 10;
      var rows = [];

      for (var i = 0; i < upperBound; i++) {
        if (i % 2 === 0) {
          var row = document.createElement('tr');
          row.setAttribute('data-waffle-idx', i);
          rows.push(row);
        }
      }

      for (var k = 0, expectedIndex = 0; k < upperBound; k++) {
        if (k % 2 === 0) {
          expect(GridUtil.getRowIndexForDataIndex(rows, k)).toBe(expectedIndex);
          expectedIndex++;
        }
      }
    });

    it('should return -1 if row does not exist', function() {
      var upperBound = 10;
      var rows = [];

      for (var i = 0; i < upperBound; i++) {
        var row = document.createElement('tr');
        row.setAttribute('data-waffle-idx', i);
        rows.push(row);
      }

      expect(GridUtil.getRowIndexForDataIndex(rows, upperBound + 1)).toBe(-1);
    });
  });

  describe('getPreviousRowIndexForDataIndex', function() {
    it('should return -1 for en empty array', function() {
      var rows = [];
      expect(GridUtil.getPreviousRowIndexForDataIndex(rows, 0)).toBe(-1);
      expect(GridUtil.getPreviousRowIndexForDataIndex(rows, 1)).toBe(-1);
      expect(GridUtil.getPreviousRowIndexForDataIndex(rows, 2)).toBe(-1);
    });

    it('should get row index of data', function() {
      var upperBound = 10;
      var rows = [];

      for (var i = 0; i < upperBound; i++) {
        var row = document.createElement('tr');
        row.setAttribute('data-waffle-idx', i);
        rows.push(row);
      }

      for (var k = 0; k < upperBound; k++) {
        expect(GridUtil.getPreviousRowIndexForDataIndex(rows, k)).toBe(Math.max(k - 1, -1));
      }
    });

    it('should get previous row index of data with filtered data', function() {
      var upperBound = 10;
      var rows = [];

      for (var i = 0; i < upperBound; i++) {
        if (i % 2 === 0) {
          var row = document.createElement('tr');
          row.setAttribute('data-waffle-idx', i);
          rows.push(row);
        }
      }

      for (var k = 0, expectedIndex = 0; k < upperBound; k++) {
        if (k % 2 === 0) {
          expect(GridUtil.getPreviousRowIndexForDataIndex(rows, k)).toBe(Math.max(expectedIndex - 1, -1));
          expectedIndex++;
        }
      }
    });

    it('should return -1 if previous row does not exist', function() {
      var upperBound = 10;
      var lowerBound = 5;
      var rows = [];

      for (var i = lowerBound; i < upperBound; i++) {
        var row = document.createElement('tr');
        row.setAttribute('data-waffle-idx', i);
        rows.push(row);
      }

      for (var k = 0; k < lowerBound; k++) {
        expect(GridUtil.getPreviousRowIndexForDataIndex(rows, k)).toBe(-1);
      }
    });
  });
});
