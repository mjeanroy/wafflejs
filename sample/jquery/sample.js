"use strict";

$.fn.waffle.addRenderer('email', function(value) {
  return '<a href="mailto:' + value + '">' + value + '</a>';
});

$('#waffle').waffle({
  data: generatedData,
  columns: columns,
  sortBy: 'firstName',
  multiSelect: true
});
