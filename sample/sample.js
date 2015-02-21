"use strict";

var generatedData = [];

for (var i = 0; i < 1000; i++) {
  var randomPerson = {
    id: i,
    firstName: Faker.Name.firstName(),
    lastName: Faker.Name.lastName(),
    userName: Faker.Internet.userName(),
    email: Faker.Internet.email()
  };

  generatedData[i] = randomPerson;
};

var newColumn = function(id, title, renderer) {
  return {
    id: id,
    title: title,
    renderer: renderer
  };
};

var fullNameRenderer = function(value, object) {
  return value + ' ' + object.lastName;
};

var columns = [
  newColumn('firstName', 'Name', fullNameRenderer),
  newColumn('userName', 'Login'),
  newColumn('email', 'Email', 'lowercase')
];

var table = new Grid(document.getElementById('waffle'), {
  data: generatedData,
  columns: columns
});
