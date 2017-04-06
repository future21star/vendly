/**
 * Created by Adam on 3/16/17.
 */
app = angular.module("MetronicApp");

app.directive("clientDetails", function () {
  return {
    templateUrl: "/views/templates/client-details.html",
    scope: {
      client: "=client",
    },
    controller: ["$scope", "meanData", "$location", function ($scope, meanData, $location) {

      $scope.edit = function () {
        $scope.editedClient = angular.copy($scope.client);
        $scope.editing = true
      };

      $scope.stopEditing = function () {
        $scope.editing = false
      };

      $scope.save = function () {
        $scope.error = null;
        meanData.updateContact($scope.editedClient, function (response) {
          $scope.client = response.data;
          $scope.stopEditing()
        }, function (response) {
          $scope.error = response.data.message;
        })
      };

      $scope.goToClientDetails = function () {
        // TEMP to get rid of modal backdrop div
        $location.path("/client_details");
        $location.search("clientId", $scope.client._id);
        $('.modal-backdrop').remove();
      }

    }]
  }
});