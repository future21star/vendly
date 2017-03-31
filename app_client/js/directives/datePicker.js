/**
 * Created by Adam on 3/30/17.
 */
var app = angular.module("MetronicApp");


app.directive('datePicker', function () {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    link: function(scope, element, attrs) {
      $(element).datepicker({startDate: '+0d'});
      $(element).datepicker('setDate', new Date(scope.ngModel));
    }
  }
});