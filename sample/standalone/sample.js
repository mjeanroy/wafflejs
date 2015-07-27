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

(function(Waffle, document) {

  'use strict';

  Waffle.addRenderer('email', function(value) {
    return '<a href="mailto:' + value + '">' + value + '</a>';
  });

  options.events = {
    onInitialized: function() {
      console.log('Grid is initialized');
    },
    onRendered: function() {
     console.log('Grid has been rendered');
    },
    onDataSpliced: function(event) {
      var index = event.index;
      var details = event.details;

      if (details.added.length > 0) {
        console.log('New row appended (line ' + index + ' => ' + JSON.stringify(details.added) + ')');
      }

      if (details.removed.length > 0) {
        console.log('Rows removed (line ' + index + ' => ' + JSON.stringify(details.removed) + ')');
      }
    },
    onSorted: function() {
      console.log('Sort has been updated');
    }
  };

  var grid = Waffle.create(document.getElementById('waffle'), options);

  document.getElementById('add').addEventListener('click', function() {
    grid.data().push(createFakePerson());
  });

  document.getElementById('remove').addEventListener('click', function() {
    grid.data().pop();
  });

  document.getElementById('clear').addEventListener('click', function() {
    grid.data().clear();
  });

  document.getElementById('input-filter').addEventListener('keyup', function() {
    var value = this.value;
    grid.filter(value);
    /*grid.filter(function(current) {
      return current.name().toLowerCase().indexOf(value.toLowerCase()) >= 0;
    });*/
  });

  document.getElementById('clear-filter').addEventListener('click', function() {
    document.getElementById('input-filter').value = '';
    grid.removeFilter();
  });

})(Waffle, document);
