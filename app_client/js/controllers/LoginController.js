angular.module('MetronicApp').controller('LoginController', ['$location', 'authentication', '$scope', '$rootScope', 'meanData',
    function($location, authentication, $scope, $rootScope, meanData) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;


        });

        $scope.onSubmit = function() {
            authentication
                .login($scope.credentials)
                .error(function(err) {
                    toastr.error(err.message, 'Error');
                })
                .then(function() {
                    $('.modal-backdrop').remove();
                    $location.path('dashboard');
                });
        };

        $scope.onRegisterSubmit = function() {
            console.log('Submitting registration');
            authentication
                .register($scope.register)
                .error(function(err) {
                    toastr.error(err, 'Error');
                })
                .then(function() {
                    $('.modal-backdrop').remove();
                    $location.path('/account/settings');
                    // TODO : complete user sign up email
                    // meanData.signUpUser($scope.register)
                    //     .success(function() {
                    //         $('.modal-backdrop').remove();
                    //         $location.path('/account/settings');
                    //     });
                });
        };

        $('#registerModal').on('hide.bs.modal', function() {
            $('#loginModal').modal({
                backdrop: 'static',
                keyboard: 'false'
            }).modal('show');
        });

        $('#registerButton').click(function() {
            $('#loginModal').modal('hide');
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

        $(document).ready(function() {
            console.log('SHOW MODAL');
            $('#email').on('blur', function() {
                console.log('EMAIL')
                if ($('#email').hasClass('ng-invalid-email')) {
                    $('.email-confirmation-alert').removeClass('hidden');
                }
            });

            $('#email').on('keyup', function() {
                console.log('HELLO WORLD#@#$@#$@#');
                if ($('#email').hasClass('ng-valid-email')) {
                    $('.email-confirmation-alert').addClass('hidden');
                }
            });
        });
    }
]);