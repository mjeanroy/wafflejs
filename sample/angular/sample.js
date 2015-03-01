"use strict";

angular.module('SampleApp', ['waffle'])

  .run(['Waffle', function(Waffle) {
    Waffle.addRenderer('email', function(value) {
      return '<a href="mailto:' + value + '">' + value + '</a>';
    });
  }])

  .controller('SampleController', ['$scope', function($scope) {

    $scope.grid = {
      data: generatedData,
      columns: columns,
      sortBy: 'firstName'
    };

  }]);
