"use strict";

$.fn.waffle.addRenderer('email', function(value) {
  return '<a href="mailto:' + value + '">' + value + '</a>';
});

var options = {
  data: generatedData,
  columns: columns,
  sortBy: 'firstName'
};

var grid = $('#waffle').waffle(options).data('wafflejs');

$('#add').on('click', function() {
  grid.data().push(createFakePerson());
});

$('#remove').on('click', function() {
  grid.data().pop();
});

$('#clear').on('click', function() {
  grid.data().clear();
});
