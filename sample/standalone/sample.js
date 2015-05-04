"use strict";

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
  onAdded: function(data, rows, index) {
    console.log('New row appended (line ' + index + ' => ' + JSON.stringify(data) + ')');
  },
  onRemoved: function(data, rows, index) {
    console.log('Rows removed (line ' + index + ' => ' + JSON.stringify(data) + ')');
  },
  onSorted: function() {
    console.log('Sort has been updated');
  }
};

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
