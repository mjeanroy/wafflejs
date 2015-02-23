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
    escape: false,
    renderer: renderer
  };
};

var fullNameRenderer = function(value, object) {
  return value + ' ' + this.uppercase(object.lastName);
};

var showEmailLink = function(value) {
  return '<a href="mailto:' + value + '">' + value + '</a>';
};

var columns = [
  newColumn('firstName', 'Name', [fullNameRenderer, 'capitalize']),
  newColumn('userName', 'Login'),
  newColumn('email', 'Email', ['lowercase', showEmailLink])
];

var table = new Grid(document.getElementById('waffle'), {
  data: generatedData,
  columns: columns
});
