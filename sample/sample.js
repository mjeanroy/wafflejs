"use strict";

var generatedData = [];

var uid = 0;

var createFakePerson = function() {
  return {
    id: ++uid,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.internet.userName(),
    email: faker.internet.email()
  };
};

for (var i = 0; i < 2; i++) {
  generatedData[i] = createFakePerson();
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

var columns = [
  newColumn('firstName', 'Name', [fullNameRenderer, '$capitalize']),
  newColumn('userName', 'Login'),
  newColumn('email', 'Email', ['$lowercase', 'email'])
];
