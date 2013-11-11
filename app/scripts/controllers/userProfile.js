'use strict';

angular.module('confRegistrationWebApp')
  .controller('ProfileCtrl', function ($scope, $modal, $location, $http) {
    $http.get('profile/').success(function (result) {
      console.log(result);
    });
  });
