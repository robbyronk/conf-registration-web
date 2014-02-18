'use strict';

angular.module('confRegistrationWebApp')
  .controller('AdminDataCtrl', function ($scope, registrations, conference, permissions, $modal, AnswerCache) {
    $scope.conference = conference;
    $scope.offlineMode = JSON.parse(localStorage.getItem('offlineMode-' + $scope.conference.id));

    $scope.blocks = [];
    $scope.reversesort = false;

    registrations = _.filter(registrations, function (item) { return item.completed !== false; });

    angular.forEach(conference.registrationPages, function (page) {
      angular.forEach(page.blocks, function (block) {
        if (block.type.indexOf('Content') === -1) {
          block.visible = true;
          $scope.blocks.push(block);
        }
      });
    });

    $scope.toggleColumn = function (block) {
      $scope.blocks[block].visible = !$scope.blocks[block].visible;
    };

    $scope.findAnswer = function (registration, blockId) {
      return _.find(registration.answers, function (answer) {
        return angular.equals(answer.blockId, blockId);
      });
    };

    $scope.getSelectedCheckboxes = function (choices) {
      return _.keys(_.pick(choices, function (val) {
        return val === true;
      }));
    };

    $scope.answerSort = function (registration) {
      if (angular.isDefined($scope.order)) {
        if (angular.isDefined($scope.findAnswer(registration, $scope.order))) {
          if ($scope.findAnswer(registration, $scope.order).value.text) { //text field
            return $scope.findAnswer(registration, $scope.order).value.text;
          } else if ($scope.getSelectedCheckboxes($scope.findAnswer(registration, $scope.order).value).length > 0) {
            //mc
            return $scope.getSelectedCheckboxes($scope.findAnswer(registration, $scope.order).value).join(' ');
          } else if (typeof $scope.findAnswer(registration, $scope.order).value === 'object') { //name
            return _.values($scope.findAnswer(registration, $scope.order).value).join(' ');
          } else { //radio
            return $scope.findAnswer(registration, $scope.order).value;
          }
        }
      } else {
        return 0;
      }
    };

    $scope.setOrder = function (order) {
      if (order === $scope.order) {
        $scope.reversesort = !$scope.reversesort;
      } else {
        $scope.reversesort = false;
      }
      $scope.order = order;
    };

    $scope.registrations = registrations;
    $scope.permissions = permissions;

    $scope.viewPayments = function (registrationId) {
      var registrationPayments = _.filter(registrations, function (item) { return item.id === registrationId; });
      registrationPayments = registrationPayments[0].pastPayments;
      console.log(registrationPayments);

      var paymentModalOptions = {
        templateUrl: 'views/paymentsModal.html',
        controller: 'errorModal',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          message: function () {
            return registrationPayments;
          }
        }
      };
      $modal.open(paymentModalOptions).result.then(function () {
      });
    };

    $scope.cacheForOffline = function () {
      localStorage.setItem('offlineMode-' + $scope.conference.id, true);
      localStorage.setItem('conf-' + $scope.conference.id, JSON.stringify($scope.conference));
      localStorage.setItem('regs-' + $scope.conference.id, JSON.stringify($scope.registrations));
      $scope.offlineMode = true;
    };

    $scope.syncCachedData = function () {
      localStorage.removeItem('offlineMode-' + $scope.conference.id);
      var updatedAnswerKeys = [];

      for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).substring(0, 6) === 'answer') {
          updatedAnswerKeys.push(localStorage.key(i));
        }
      }

      _.each(updatedAnswerKeys, function (updatedAnswerKey) {
        AnswerCache.update(JSON.parse(localStorage.getItem(updatedAnswerKey)), function () {
          localStorage.removeItem(updatedAnswerKey);
        });
      });

      localStorage.removeItem('conf-' + $scope.conference.id);
      localStorage.removeItem('regs-' + $scope.conference.id);
      $scope.offlineMode = false;
    };
  });
