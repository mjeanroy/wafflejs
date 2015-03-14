"use strict";

Waffle.addRenderer('email', function(value) {
  return '<a href="mailto:' + value + '">' + value + '</a>';
});

var grid = new Waffle.Grid(document.getElementById('waffle'), options);

document.getElementById('add').addEventListener('click', function() {
  grid.data().push(createFakePerson());
});

document.getElementById('remove').addEventListener('click', function() {
  grid.data().pop();
});

document.getElementById('clear').addEventListener('click', function() {
  grid.data().clear();
});
