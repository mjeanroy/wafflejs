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
  onDataSpliced: function(event) {
    var index = event.index;

    if (event.added.length > 0) {
      console.log('New row appended (line ' + index + ' => ' + JSON.stringify(event.added) + ')');
    }

    if (event.removed.length > 0) {
      console.log('Rows removed (line ' + index + ' => ' + JSON.stringify(event.removed) + ')');
    }
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
