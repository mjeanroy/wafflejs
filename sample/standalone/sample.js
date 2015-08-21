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

/* global waffleOptions */
/* global Waffle */
/* global ajax */

(function(Waffle, ajax, document) {

  'use strict';

  Waffle.addRenderer('email', function(value) {
    return '<a href="mailto:' + value + '">' + value + '</a>';
  });

  var url = '/people';
  var grid = Waffle.create(document.getElementById('waffle'), waffleOptions);
  var data = grid.data();

  document.getElementById('add').addEventListener('click', function() {
    ajax('POST', url, function(response) {
      data.push(response);
    });
  });

  document.getElementById('remove').addEventListener('click', function() {
    var last = data.last();
    if (last) {
      ajax('DELETE', url + '/' + last.id, function() {
        data.remove(last);
      });
    }
  });

  document.getElementById('clear').addEventListener('click', function() {
    ajax('DELETE', url, function() {
      data.clear();
    });
  });

  document.getElementById('input-filter').addEventListener('keyup', function() {
    grid.filter({
      'name()': this.value
    });
  });

  document.getElementById('clear-filter').addEventListener('click', function() {
    document.getElementById('input-filter').value = '';
    grid.removeFilter();
  });

  var init = function() {
    ajax('GET', url, function(response) {
      data.reset(response);
    });
  };

  init();

})(Waffle, ajax, document);
