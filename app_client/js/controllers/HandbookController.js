angular.module('MetronicApp').controller('HandbookController', ['$rootScope', '$scope', '$stateParams', 'settings', 'meanData', function ($rootScope, $scope, $stateParams, settings, meanData) {
  $scope.$on('$viewContentLoaded', function () {
    // initialize core components
    App.initAjax();

    // set default layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
  });

  if ($stateParams.hasOwnProperty('handbookId')) {
    $scope.handbookId = $stateParams.handbookId
  }

  $scope.handbooks = {};
  var loadHandbooks = function () {
    meanData.getBooklets()
      .success(function (data) {
        $scope.handbooks = data;
      })
      .error(function (e) {
        console.log(e);
      });
  };
  loadHandbooks();

  meanData.getActiveHandbook()
    .success(function (active_booklet) {
      $scope.active_booklet = active_booklet._id;
    })
    .error(function (e) {
      console.log(e);
    });

  $scope.setActiveBooklet = function (handbook) {
    meanData.setActiveHandbook(handbook)
      .success(function () {

      })
      .error(function (e) {
        console.log(e);
      });
  };
}]);
