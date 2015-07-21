/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function(angular) {

  'use strict';

  angular.module('SampleApp', ['waffle'])

    .config(['WaffleProvider', function(Waffle) {
      Waffle.addRenderer('email', function(value) {
        return '<a href="mailto:' + value + '">' + value + '</a>';
      });
    }])

    .controller('SampleController', ['$scope', '$log', function($scope, $log) {
      $scope.columns = angular.copy(options.columns);
      $scope.options = options;

      $scope.nbSort = 0;
      $scope.grid = null;

      $scope.toggleColumn = function(column, index) {
        var columns = $scope.grid.columns();
        if (columns.contains(column)) {
          columns.splice(index, 1);
        } else {
          columns.splice(index, 0, column);
        }
      };

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

      $scope.onDataSpliced = function() {
        $log.debug('New row added');
      };

      $scope.onRemoved = function() {
        $log.debug('Row removed');
      };

      $scope.onSorted = function() {
        $log.debug('Sort updated');
        $scope.nbSort++;
      };
    }]);
})(angular);
