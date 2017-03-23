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
    controller: ["$scope", function ($scope) {

      $scope.edit = function () {
        $scope.editedClient = angular.copy($scope.client);
        $scope.editing = true
      };

      $scope.stopEditing = function() {
        $scope.editing = false
      };

      $scope.save = function() {

      };

    }]
  }
});