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

/* global DATA_WAFFLE_IDX */
/* exported GridUtil */

const GridUtil = (() => {

  // Create initial empty object.
  const instance = {};

  const findRow = (rows, index, def, stopOn) => {
    const max = rows.length - 1;
    if (max < 0 || index < 0 || index <= def) {
      return def;
    }

    let currentIndex = Math.min(index, max);
    let dataIndex = index;

    while (currentIndex >= 0 && dataIndex >= index) {
      dataIndex = instance.getDataIndex(rows[currentIndex]);
      if (stopOn(dataIndex, index)) {
        return currentIndex;
      }

      currentIndex--;
    }

    return def;
  };

  instance.getDataIndex = row => Number(row.getAttribute(DATA_WAFFLE_IDX));

  instance.getCheckbox = row => row.childNodes[0].childNodes[0];

  instance.getRowIndexForDataIndex = (rows, index) => {
    return findRow(rows, index, -1, (dataIndex, index) => dataIndex === index);
  };

  instance.getPreviousRowIndexForDataIndex = (rows, index) => {
    return findRow(rows, index - 1, -1, (dataIndex, index) => dataIndex <= index);
  };

  return instance;

})();
