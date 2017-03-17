/**
 * Created by Adam on 3/16/17.
 */
app = angular.module("MetronicApp")

app.directive('clientDetails', function() {
   return {
       templateUrl: "/views/templates/client-details.html",
       scope: {
           client: "=client"
       }
   }
});