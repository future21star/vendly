/* Setup general page controller */
angular.module('MetronicApp')

// .config(['sirTrevorServiceProvider', function(sirTrevorServiceProvider) {
//     // set config
//     sirTrevorServiceProvider.setConfig({
//         "debug": false,
//         "scribeDebug": false,
//         "language": "en"
//     });
// 
//     // set defaults
//     sirTrevorServiceProvider.setDefaults({
//         "iconUrl": "vendor/sir-trevor/src/icons/sir-trevor-icons.svg"
//     });
// 
//     // set block options
//     sirTrevorServiceProvider.setBlockOptions({
//         /* put block options here */
//     });
// }])

.controller('GeneralPageController', ['$rootScope', '$scope', 'settings', 'meanData', 'amazons3', 'authentication',
function($rootScope, $scope, settings, meanData, amazons3, authentication) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

    });

    $scope.handbook = {
      name: 'Untitled'
    };
    
    $scope.uploadImage = function() {
        var file = $('#avatarImg')[0].files[0];
        if (!file) return;
        amazons3.uploadAvatar(file);
    };
    
    $('#avatarImg').change(function () {
        var file = $(this)[0].files[0];
        $('#preview').attr('src', URL.createObjectURL(file));
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

    $scope.updateProfile = function() {
        for (var key in $scope.user_settings) {
            var obj = $scope.user_settings[key];
            if (typeof obj === 'undefined')
                $scope.user_settings[key] = '';
        }

        meanData.updateProfile($scope.user_settings)
            .success(function() {
                toastr.success('Your profile info was successfully changed.', 'Settings Changed');
            })
            .error(function(e) {
                toastr.error(e.message, 'Error');
            });
    };

    $scope.changePassword = function () {
        authentication.changePassword($scope.user_settings)
            .success(function () {
                toastr.success('Your password was successfully changed.', 'Password Changed');
            })
            .error(function (e) {
                toastr.error(e.message, 'Error');
            });
    };

    $scope.myEmployees = {};
    meanData.getEmployees()
        .success(function (employees) {
            $scope.myEmployees = employees;
        })
        .error(function (e) {
            console.log(e);
        });

    $scope.saveEmployee = function () {
        meanData.saveEmployee($scope.employee)
            .success(function () {
                toastr.success('Employee saved successfully.', 'Employee Saved');
            })
            .error(function (e) {
                toastr.error(e.message, 'Error');
            });
    };

    $scope.updateEmployees = function () {
        meanData.updateEmployees($scope.employeeChanges)
            .success(function () {
                toastr.success('Employee settings changed successfully.', 'Changes Saved');
            })
            .error(function (e) {
                toastr.error(e.message, 'Error');
            });
    };
    
    // $scope.notificationSettings = {};
    // meanData.getNotificationSettings()
    //     .success(function (notificationSettings) {
    //         $scope.notificationSettings = notificationSettings[0];
    //     })
    //     .error(function (e) {
    //         console.log(e);
    //     });

    // $scope.notificationChanges = {};
    // $scope.updateNotificationSettings = function () {
    //     meanData.updateNotificationSettings($scope.notificationSettings)
    //         .success(function () {
    //             toastr.success('Notification settings changed successfully.', 'Changes Saved');
    //         })
    //         .error(function (e) {
    //             toastr.error(e.message, 'Error');
    //         });
    // };
}]);
