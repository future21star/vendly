angular.module('MetronicApp')
    .controller('NotificationsController', ['$rootScope', '$scope', 'settings', 'meanData', 'amazons3', 'authentication',
        function ($rootScope, $scope, settings, meanData, amazons3, authentication) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();

                // set default layout mode
                $rootScope.settings.layout.pageContentWhite = true;
                $rootScope.settings.layout.pageBodySolid = false;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            $scope.notificationSettings = {};
            meanData.getNotificationSettings()
                .success(function (notificationSettings) {
                    $scope.notificationSettings = notificationSettings[0];
                })
                .error(function (e) {
                    console.log(e);
                });

            $scope.notificationChanges = {};
            $scope.updateNotificationSettings = function () {
                meanData.updateNotificationSettings($scope.notificationSettings)
                    .success(function () {
                        toastr.success('Notification settings changed successfully.', 'Changes Saved');
                    })
                    .error(function (e) {
                        toastr.error(e.message, 'Error');
                    });
            };
        }
    ]);
