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

          let formBuilderOptions = {
            formData: '[{"type":"text", "label":"Text Field", "className":"form-control"}]',
            onSave: function (event, payload) {
              console.log(payload)
            },
            disableFields: ["autocomplete", "hidden", "file", "button"],
            disabledAttrs: ["access", "name", "inline", "toggle"]
            //disabledActionButtons: ["data"]
          };

          allShownOptionTypes = ["checkbox-group", "date", "number", "radio-group", "select", "text", "textarea"]
          typeUserAttrs = {}
          for (var i = 0; i < allShownOptionTypes.length; i++) {
            type = allShownOptionTypes[i]
            typeUserAttrs[type] = {
              deadline: {
                label: "Deadline (number of days before event)",
                type: "number",
                description: "Set deadlines to remind clients you need certain event details before the event"
              }
            }
          }
          formBuilderOptions.typeUserAttrs = typeUserAttrs

          formbuilder = $("#formbuilder").formBuilder(formBuilderOptions);
          console.log(formbuilder);

        }

      })
    }]
  }
});
