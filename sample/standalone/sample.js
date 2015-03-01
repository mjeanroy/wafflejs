"use strict";

var grid = new Waffle.Grid(document.getElementById('waffle'), {
  data: generatedData,
  columns: columns,
  sortBy: 'firstName'
});
