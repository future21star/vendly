/**
 * Created by Adam on 4/23/17.
 */

app = angular.module("MetronicApp");

app.directive("linksBar", function () {
  return {
    templateUrl: "/views/templates/links-bar.html",
    scope: {
      links: "=links",
    }
  }
});
