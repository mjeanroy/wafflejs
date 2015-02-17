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

var Column = function(column) {
  var isUndefined = $util.isUndefined;
  var escape = column.escape;
  var sortable = column.sortable;

  this.id = column.id;
  this.title = column.title || '';
  this.escape = isUndefined(escape) ? true : !!escape;
  this.sortable = isUndefined(sortable) ? true : !!sortable;

  // Sanitize input at construction
  if (escape) {
    this.title = $sanitize(this.title);
  }

  // Parse that will be used to extract data value from plain old javascript object
  this.$parser = $parse(this.id);
};

Column.prototype = {

  extract: function(object) {
    var isDefined = function(val) {
      return !$util.isUndefined(val) && !$util.isNull(val);
    };

    if (!isDefined(object)) {
      return '';
    }

    var value = this.$parser(object);

    if (!isDefined(value)) {
      return '';
    }

    return this.escape ? $sanitize(value) : value;
  }
};
