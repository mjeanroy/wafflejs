"use strict";

var generatedData = [];

for (var i = 0; i < 10; i++) {
  var randomPerson = {
    firstName: Faker.Name.firstName(),
    lastName: Faker.Name.lastName(),
    userName: Faker.Internet.userName(),
    email: Faker.Internet.email()
  };

  generatedData[i] = randomPerson;
};

var newColumn = function(id, title) {
  return {
    id: id,
    title: title
  };
};

var columns = [
  newColumn('firstName', 'Firstname'),
  newColumn('lastName', 'Lastname'),
  newColumn('userName', 'Login'),
  newColumn('email', 'Email')
];

var table = new Grid(document.getElementById('waffle'), {
  data: generatedData,
  columns: columns
});
