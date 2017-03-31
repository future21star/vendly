/**
 * Created by Adam on 3/30/17.
 */
/* Setup general page controller */
angular.module('MetronicApp').controller('ClientDetailsController', ['$scope', 'clientRequester', '$location',
  function ($scope, clientRequester, $location) {
    $scope.$on('$viewContentLoaded', function () {
      // initialize core components
      App.initAjax();
    });

    clientRequester.get($location.search().clientId).then(function (response) {
      $scope.client = response.data
    }, function (response) {

    });

  }]);
