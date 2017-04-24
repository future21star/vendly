/**
 * Created by Adam on 4/23/17.
 */
app = angular.module("MetronicApp");

app.directive("handbook", function () {
  return {
    templateUrl: "/views/templates/handbook.html",
    scope: {
      id: "=handbookId",
    },
    controller: ["$scope", "handbookRequester", "$location", function ($scope, handbookRequester, $location) {
      if ($scope.id) {
        handbookRequester.get($scope.id).then(function (response) {
            $scope.handbook = response.data
          },
          function (response) {
            console.log(response)
          })
      } else {
        $scope.handbook = {
          content: [
            {
              "label": "Section Break", "field_type": "new_section_break", "required": false,
              "field_options": {"description": "Description about this section."}, "cid": "c8"
            },
            {
              "label": "Wedding Date",
              "field_type": "date", "required": true, "field_options": {"description": ""}, "cid": "c13"
            },
            {
              "label": "Which if the following do you want to include in your wedding?", "field_type": "checkboxes",
              "required": true, "field_options": {
              "options": [
                {"label": "Unity Candle", "checked": false},
                {"label": "Wedding cord/lasso", "checked": false}], "include_other_option": true
            }, "cid": "c17"
            }
          ]
        }
      }

    }]
  }
});
