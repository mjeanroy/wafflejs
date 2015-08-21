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
/* global _ */
/* global jQuery */

(function($, _) {

  'use strict';

  $.fn.waffle.addRenderer('email', function(value) {
    return '<a href="mailto:' + value + '">' + value + '</a>';
  });

  var url = '/people';
  var grid = $('#waffle').waffle(waffleOptions).data('wafflejs');
  var data = grid.data();

  $('#add').on('click', function() {
    $.post(url).done(function(response) {
      data.push(response);
    });
  });

  $('#remove').on('click', function() {
    var last = data.last();
    if (last) {
      $.ajax({ method: 'DELETE', url: url + '/' + last.id }).done(function() {
        data.remove(last);
      });
    }
  });

  $('#clear').on('click', function() {
    $.ajax({ method: 'DELETE', url: url }).done(function() {
      data.clear();
    });
  });

  var onFilterUpdate = function() {
    grid.filter({
      'name()': $(this).val()
    });
  };

  $('#input-filter').on('keyup', _.debounce(onFilterUpdate, 150));

  $('#clear-filter').on('click', function() {
    $('#input-filter').val('');
    grid.removeFilter();
  });

  var init = function() {
    $.get(url).done(function(response) {
      data.reset(response);
    });
  };

  init();

})(jQuery, _);
