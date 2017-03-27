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
    controller: ["$scope", "meanData", function ($scope, meanData) {

      $scope.edit = function () {
        $scope.editedClient = angular.copy($scope.client);
        $scope.editing = true
      };

      $scope.stopEditing = function() {
        $scope.editing = false
      };

      $scope.save = function() {
        meanData.updateContact($scope.editedClient, function(response) {
          $scope.client = response.data;
          $scope.stopEditing()
        }, function(response) {
          $scope.error = response.message;
        })
      };

    }]
  }
});