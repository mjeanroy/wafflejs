"use strict";

angular.module('SampleApp', ['waffle'])

  .config(['WaffleProvider', function(Waffle) {
    Waffle.addRenderer('email', function(value) {
      return '<a href="mailto:' + value + '">' + value + '</a>';
    });
  }])

  .controller('SampleController', ['$scope', '$log', function($scope, $log) {
    $scope.options = {
      data: generatedData,
      columns: columns,
      sortBy: 'firstName'
    };

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

    $scope.onInitialized = function() {
      $log.debug('Grid initialized');
    };

    $scope.onRendered = function() {
      $log.debug('Grid rendered');
    };

    $scope.onAdded = function() {
      $log.debug('New row added');
    };

    $scope.onRemoved = function() {
      $log.debug('Row removed');
    };

    $scope.onSorted = function() {
      $log.debug('Sort updated');
    };
  }]);
