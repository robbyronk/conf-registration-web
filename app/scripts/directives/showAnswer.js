'use strict';

angular.module('confRegistrationWebApp')
  .directive('showAnswer', function (AnswerCache, $modal, $location, uuid) {
    return {
      templateUrl: 'views/adminAnswerDisplay.html',
      restrict: 'E',
      scope: {
        block: '=',
        registration: '='
      },
      controller: function ($scope) {
        if ($location.$$path.indexOf('adminData/') !== -1) {
          $scope.answerEditable = true;
        }

        var editAnswerDialogOptions = {
          templateUrl: 'views/editAnswer.html',
          controller: 'EditAnswerDialogCtrl',
          scope: $scope
        };

        $scope.createEditDialog = function () {
          if ($scope.answerEditable) {
            if (angular.isUndefined($scope.answer)) {
              $scope.answer = {
                id: uuid(),
                registrationId: $scope.registration.id,
                blockId: $scope.block.id,
                value: null
              };
            }
            $modal.open(editAnswerDialogOptions).result.then(function () {
              AnswerCache.syncBlock($scope, 'answer');
            });
          }
        };

        $scope.$watch('answers', function () {
          if ($scope.registration.answers) {
            var answerObject = _.find($scope.registration.answers, { blockId: $scope.block.id });
            if (answerObject) {
              $scope.answer = answerObject;
            }
          }
        });

        $scope.getSelectedCheckboxes = function (choices) {
          return _.keys(_.pick(choices, function (val) {
            return val === true;
          }));
        };

      }
    };
  });
