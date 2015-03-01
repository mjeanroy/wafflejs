"use strict";

var generatedData = [];

for (var i = 0; i < 1000; i++) {
  var randomPerson = {
    id: i,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.internet.userName(),
    email: faker.internet.email()
  };

  generatedData[i] = randomPerson;
};

var newColumn = function(id, title, renderer) {
  return {
    id: id,
    title: title,
    escape: false,
    comparator: '$string',
    renderer: renderer
  };
};

var fullNameRenderer = function(value, object) {
  return value + ' ' + this.$uppercase(object.lastName);
};

Waffle.addRenderer('email', function(value) {
  return '<a href="mailto:' + value + '">' + value + '</a>';
});

var columns = [
  newColumn('firstName', 'Name', [fullNameRenderer, '$capitalize']),
  newColumn('userName', 'Login'),
  newColumn('email', 'Email', ['$lowercase', 'email'])
];

var table = new Waffle.Grid(document.getElementById('waffle'), {
  data: generatedData,
  columns: columns,
  sortBy: 'firstName'
});
