"use strict";

angular.module('SampleApp', ['waffle'])

  .run(['Waffle', function(Waffle) {
    Waffle.addRenderer('email', function(value) {
      return '<a href="mailto:' + value + '">' + value + '</a>';
    });
  }])

  .controller('SampleController', ['$scope', function($scope) {
    $scope.options = options;

    $scope.grid = null;

    $scope.add = function() {
      $scope.grid.data().push(createFakePerson());
    };

    $scope.pop = function() {
      $scope.grid.data().pop();
    };

    $scope.clear = function() {
      $scope.grid.data().clear();
    };
  }]);
