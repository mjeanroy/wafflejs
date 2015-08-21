/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mickael Jeanroy, Cedric Nisio
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

var open = require('open');
var express = require('express');
var _ = require('underscore');
var faker = require('faker');

var port = 8080;
var app = express();

var createPerson = function(data) {
  data = data || {};
  return {
    id: Number(_.uniqueId()),
    firstName: data.firstName || faker.name.firstName(),
    lastName: data.lastName || faker.name.lastName(),
    userName: data.userName || faker.internet.userName(),
    email: data.email || faker.internet.email()
  };
};

// Initialize array with 10 random person
var people = (function() {
  var array = [];
  for (var i = 0; i < 10; i++) {
    array.push(createPerson());
  }
  return array;
})();

app.use(require('connect-livereload')());
app.use(require('body-parser').json());

// Static directories
app.use('/vendors', express.static('vendors'));
app.use('/dist', express.static('dist'));
app.use('/', express.static('sample'));

// Get list of people
app.get('/people', function(req, res) {
  return res.json(people);
});

// Create new person
app.post('/people', function(req, res) {
  var person = createPerson(req.body);
  people.push(person);
  return res.status(201).json(person);
});

// Update person with given id.
app.put('/people/:id', function(req, res) {
  var id = Number(req.params.id);
  var idx = _.findIndex(people, function(current) {
    return current.id === id;
  });

  if (idx < 0) {
    return res.status(404).send();
  } else {
    _.extend(people[idx], req.body);
    return res.status(204).send();
  }
});

// Delete person with given id.
app.delete('/people/:id', function(req, res) {
  var id = Number(req.params.id);
  var idx = _.findIndex(people, function(current) {
    return current.id === id;
  });

  if (idx < 0) {
    return res.status(404).send();
  } else {
    people.splice(idx, 1);
    return res.status(204).send();
  }
});

// Delete entire collection.
app.delete('/people', function(req, res) {
  people = [];
  return res.status(204).send();
});

// Bootstrap application
app.listen(port, function () {
  console.log('Server listening on : http://localhost:' + port);
  open('http://localhost:' + port);
});
