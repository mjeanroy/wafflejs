"use strict";

Waffle.addRenderer('email', function(value) {
  return '<a href="mailto:' + value + '">' + value + '</a>';
});

var grid = new Waffle.Grid(document.getElementById('waffle'), {
  data: generatedData,
  columns: columns,
  sortBy: 'firstName',
  multiSelect: true
});
