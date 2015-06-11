"use strict";

var grid = document.getElementById('grid').grid;

console.log('sample');
document.getElementById('add').addEventListener('click', function() {
  grid.data().push(createFakePerson());
});

document.getElementById('remove').addEventListener('click', function() {
  grid.data().pop();
});

document.getElementById('clear').addEventListener('click', function() {
  grid.data().clear();
});
