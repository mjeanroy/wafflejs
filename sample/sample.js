"use strict";

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
