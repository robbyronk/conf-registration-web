'use strict';

angular.module('confRegistrationWebApp')
  .controller('ProfileCtrl', function ($scope, $modal, $location, $http) {
    console.log('hi');

    $http.get('profile/').success(function (result) {
      console.log(result);
    });
  });
