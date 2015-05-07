"use strict";

var generatedData = [];

var uid = 0;

var createFakePerson = function() {
  return {
    id: ++uid,
    firstName: faker.Name.firstName(),
    lastName: faker.Name.lastName(),
    userName: faker.Internet.userName(),
    email: faker.Internet.email()
  };
};

for (var i = 0; i < 20; i++) {
  generatedData[i] = createFakePerson();
};

var newColumn = function(id, title, renderer, width) {
  return {
    id: id,
    title: title,
    escape: false,
    comparator: '$string',
    renderer: renderer,
    size: {
      width: width
    }
  };
};

var fullNameRenderer = function(value, object) {
  return value + ' ' + this.$uppercase(object.lastName);
};

var columns = [
  newColumn('firstName', 'Name', [fullNameRenderer, '$capitalize']),
  newColumn('userName', 'Login'),
  newColumn('email', 'Email', ['$lowercase', 'email'], 500)
];

var options = {
  data: generatedData,
  columns: columns,
  sortBy: 'firstName',
  size: {
    height: 300,
    width: 1140
  }
};
