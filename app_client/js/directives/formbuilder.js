/**
 * Created by Adam on 4/23/17.
 */
app = angular.module("MetronicApp");

app.directive("formbuilder", function () {
  return {
    template: "<div id='formbuilder'></div>",
    scope: {
      content: "=content",
      onSave: "&onSave"
    },
    controller: ["$scope", function ($scope) {
      var formbuilder;
      $scope.$watch("content", function (content) {
        if (!!content) {
          console.log(content);
          formbuilder = new Formbuilder({
            selector: '#formbuilder',
            bootstrapData: content
          });

          formbuilder.on('save', function (payload) {
            if (!!scope.onSave) {
              scope.onSave(payload);
            }
          });
        }

      })
    }]
  }
});
