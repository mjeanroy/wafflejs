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

(function(window) {
  'use strict';

  var generatedData = [];
  var uid = 0;

  var createFakePerson = function() {
    return {
      id: ++uid,
      firstName: faker.Name.firstName(),
      lastName: faker.Name.lastName(),
      userName: faker.Internet.userName(),
      email: faker.Internet.email(),
      name: function() {
        return this.firstName + ' ' + this.lastName.toUpperCase()
      }
    };
  };

  for (var i = 0; i < 20; i++) {
    generatedData[i] = createFakePerson();
  };

  var newColumn = function(id, title, renderer, width, editable) {
    var column = {
      id: id,
      title: title,
      escape: false,
      comparator: '$string'
    };

    if (renderer) {
      column.renderer = renderer;
    }

    if (editable) {
      column.editable = editable;
    }

    if (width) {
      column.width = width;
    }

    return column;
  };

  var columns = [
    newColumn('name()', 'Name', ['$capitalize'], '20%'),
    newColumn('userName', 'Login'), 
    newColumn('email', 'Email', ['$lowercase', 'email'], '60%', {
      type: 'email',
      css: 'form-control'
    })
  ];

  var options = {
    data: generatedData,
    columns: columns
  };

  // Expose some global variables.
  // In a real app, this should not be done this way, but this
  // is fine for a sample.
  window.createFakePerson = createFakePerson;
  window.options = options;

})(window);
