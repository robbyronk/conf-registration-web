'use strict';

angular.module('confRegistrationWebApp')
  .directive('page', function () {
    return {
      templateUrl: 'views/pageDirective.html',
      restrict: 'E',
      controller: function ($scope, $location) {
        $scope.wizard = $location.path().indexOf('wizard') !== -1;
        $scope.$watch('pageForm.$valid', function (valid) {
          $scope.$emit('pageValid', valid);
        });
      }
    };
  });
