angular.module('MetronicApp').controller('DashboardController', ['$rootScope', '$scope', 'meanData', 'settings', 'UserInfo', function($rootScope, $scope, meanData, settings, UserInfo) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
    
    $scope.user_settings = {};
    meanData.getProfile()
        .success(function(user) {
            // TODO - make more secure
            $scope.user_settings.avatar = 'https://ourstory-vendly.s3.amazonaws.com/' + user._id + '/avatar.png';
            $scope.user_settings.name = user.name;
            $scope.user_settings.email = user.email;
            $scope.user_settings.phone = user.phone;
            $scope.user_settings.website = user.website;
            $scope.user_settings.bus_name = user.bus_name;
            $scope.user_settings.usertype = user.usertype;
            $('#usertypeSelect').val(user.usertype);
        })
        .error(function (e) {
            console.log(e);
        });


    // TODO - add top of page message
    // TODO - pending approvals
    // TODO - recent activities

    loadTasks = function () {
        UserInfo.getTasks()
            .success(function(data) {
                //alert(data);
                $scope.tasks = data;
            })
            .error(function (e) {
                console.log(e);
            });
    };

    loadTasks();

}]);
