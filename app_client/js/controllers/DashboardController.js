angular.module('MetronicApp').controller('DashboardController', function ($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    // TODO - add top of page message
    // TODO - pending approvals
    // TODO - recent activities

    loadTasks = function () {
        UserInfo.getTasks()
            .success(function(data) {
                alert(data);
                $scope.tasks = data;
            })
            .error(function (e) {
                console.log(e);
            });
    };

    loadTasks();

});
