angular.module('MetronicApp').controller('LoginController', ['$location', 'authentication', '$scope', '$rootScope', 'meanData',
    function ($location, authentication, $scope, $rootScope, meanData) {
        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            App.initAjax();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;


        });

        $scope.onSubmit = function () {
            authentication
                .login($scope.credentials)
                .error(function (err) {
                    toastr.error(err.message, 'Error');
                })
                .then(function () {
                    $('.modal-backdrop').remove();
                    $location.path('dashboard');
                });
        };

        $scope.onRegisterSubmit = function () {
            console.log('Submitting registration');
            authentication
                .register($scope.register)
                .error(function (err) {
                    toastr.error(err, 'Error');
                })
                .then(function () {
                    meanData.signUpUser($scope.register)
                        .success(function () {
                            $('.modal-backdrop').remove();
                            $location.path('/account/settings');
                        });
                });
        };

        $('#registerButton').click(function () {
            $('#registerModal').modal('show');
        });

        $('#loginModal').modal({
            backdrop: 'static',
            keyboard: false
        }).modal('show');

        $('#confirmEmailModal').modal({
            backdrop: 'static',
            keyboard: false
        }).modal('show');

    }
]);