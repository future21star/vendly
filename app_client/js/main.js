/***
 Metronic AngularJS App Main Script
 ***/

var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    //"angular-sir-trevor",
    "ngMaterial",
    "xeditable"
]);

MetronicApp.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('red');
});

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
          pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', 'meanData', 'authentication', function($scope, $rootScope, meanData, authentication) {
    $scope.$on('$viewContentLoaded', function() {
       App.initComponents();  //init core components
       Layout.init();  //Init entire layout on page load if the partials included in server side instead of loading with ng-include directive
    });
    $scope.user_settings = {};
    meanData.getProfile()
        .success(function(user) {
            // TODO - make more secure
            $scope.user_settings.avatar = 'https://ourstory-vendly.s3.amazonaws.com/' + user._id + '/avatar.png';
            $scope.user_settings.id = user._id;
            $scope.user_settings.name = user.name;
            $scope.user_settings.email = user.email;
            $scope.user_settings.usertype = user.usertype;
        })
        .error(function (e) {
            console.log(e);
        });
        console.log($scope);
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/
  
/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', 'meanData', 'authentication', function($scope, meanData, authentication) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', 'meanData', 'authentication', function($scope, meanData, authentication) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

MetronicApp.service('authentication', ['$http', '$window',
    function ($http, $window) {

        var saveToken = function (token) {
            $window.localStorage['mean-token'] = token;
        };

        var clearToken = function () {
            $window.localStorage.removeItem('mean-token');
        };

        var getToken = function () {
            return $window.localStorage['mean-token'];
        };

        var isLoggedIn = function () {
            var token = getToken();
            var payload;

            if (token) {
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function () {
            if (isLoggedIn()) {
                var token = getToken();
                var payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return {
                    email: payload.email,
                    name: payload.name
                };
            }
        };

        var register = function (user) {
            return $http.post('/api/register', user).success(function (data) {
                saveToken(data.token);
            });
        };

        var login = function (user) {
            return $http.post('/api/login', user).success(function (data) {
                saveToken(data.token);
            });
        };

        var logout = function () {
            clearToken();
        };

        var changePassword = function () {
            return $http.post('/api/changePassword', user).success(function (data) {
                saveToken(data.token);
            });
        };

        return {
            currentUser: currentUser,
            saveToken: saveToken,
            getToken: getToken,
            isLoggedIn: isLoggedIn,
            register: register,
            login: login,
            logout: logout,
            changePassword: changePassword
        };
    }
]);

MetronicApp.service('meanData', ['$http', 'authentication',
    function ($http, authentication) {

        var auth = {
            headers: {
                Authorization: 'Bearer ' + authentication.getToken()
            }
        };

        var getProfile = function () {
            return $http.get('/api/profile', auth);
        };

        var updateProfile = function (profile) {
            return $http.put('/api/updateProfile', profile, auth);
        };

        var getRolodex = function () {
            return $http.get('/api/rolodex', auth);
        };

        var saveContact = function (contact) {
            return $http.post('/api/saveContact', contact, auth);
        };

        var getCalendar = function () {
            return $http.get('/api/calendar', auth);
        };

        var saveEvent = function (event) {
            return $http.post('/api/saveEvent', event, auth);
        };

        var updateEvent = function (event) {
            return $http.put('/api/updateEvent', event, auth);
        };

        var getBooklets = function () {
            return $http.get('/api/booklets', auth);
        };

        var saveBooklet = function (booklet) {
            return $http.post('/api/saveBooklet', booklet, auth);
        };

        var updateBooklet = function (booklet) {
            return $http.put('/api/updateBooklet', booklet, auth);
        };

        var setActiveHandbook = function (booklet) {
            return $http.put('/api/setActiveHandbook', booklet, auth);
        };

        var getActiveHandbook = function () {
            return $http.get('/api/getActiveHandbook', auth);
        };

        var sendNewUserInviteEmail = function (user) {
            return $http.post('/api/sendNewUserInviteEmail', user, auth);
        };

        var sendEmail = function (email, subject, content) {
            return $http.post('/api/sendEmail', user, auth);
        };

        var getDocuments = function () {
            return $http.get('/api/getFiles', auth);
        };

        var saveDocument = function (document) {
            return $http.post('/api/saveFile', document, auth);
        };

        var signUpUser = function (user) {
            return $http.post('/api/signUpUser', user, auth);
        };

        var saveEmployee = function (employee) {
            return $http.post('/api/saveEmployee', employee, auth);
        };

        var updateEmployees = function (employee) {
            return $http.put('/api/updateEmployees', employee, auth);
        };

        var getEmployees = function () {
            return $http.get('/api/getEmployees', auth);
        };

        var getNotifications = function () {
            return $http.get('/api/getNotifications', auth);
        };

        var updateNotifications = function (notifications) {
            return $http.put('/api/updateNotifications', notifications, auth);
        };

        return {
            getProfile: getProfile,
            updateProfile: updateProfile,
            getRolodex: getRolodex,
            saveContact: saveContact,
            getCalendar: getCalendar,
            saveEvent: saveEvent,
            updateEvent: updateEvent,
            getBooklets: getBooklets,
            saveBooklet: saveBooklet,
            updateBooklet: updateBooklet,
            getActiveHandbook: getActiveHandbook,
            setActiveHandbook: setActiveHandbook,
            sendNewUserInviteEmail: sendNewUserInviteEmail,
            sendEmail: sendEmail,
            getDocuments: getDocuments,
            saveDocument: saveDocument,
            signUpUser: signUpUser,
            saveEmployee: saveEmployee,
            updateEmployees: updateEmployees,
            getEmployees: getEmployees,
            getNotificationSettings: getNotifications,
            updateNotificationSettings: updateNotifications
        };
    }
]);

MetronicApp.service('amazons3', ['$http', 'authentication',
    function ($http, authentication) {
        var uploadFile = function (file) {
            sign_request(file).success(function (response) {
                upload(file.file, response.signed_request, response.url, function () {
                    // document.getElementById("preview").src = response.url
                });
            });
        };

        var uploadAvatar = function (file) {
            sign_avatar(file).success(function (response) {
                upload(file, response.signed_request, response.url, function () {
                    document.getElementById("preview").src = response.url
                });
            });
        };

        var getImage = function () {

        };

        function upload(file, signed_request, url, done) {
            var xhr = new XMLHttpRequest();
            xhr.open("PUT", signed_request);
            xhr.setRequestHeader('x-amz-acl', 'public-read');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    done()
                }
            };

            xhr.send(file)
        }

        function sign_request(file) {
            return $http.get("/api/sign?file_name=" + file.name + "&file_type=" + file.file.type, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        }

        function sign_avatar(file) {
            // TODO remove avatar naming and change to file.name
            return $http.get("/api/sign?file_name=" + 'avatar.png' + "&file_type=" + file.type, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        }

        return {
            uploadFile: uploadFile,
            uploadAvatar: uploadAvatar,
            getImage: getImage
        };
    }
]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/404");

    $stateProvider

    // Log out
        .state('logout', {
        url: "/logout",
        templateUrl: "views/login.html",
        controller: function($location, authentication) {
            authentication.logout();
            $location.path('login');
        }
    })

    // Login
    .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            data: { pageTitle: 'Login' },
            controller: "LoginController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                        files: [
                            'js/controllers/LoginController.js',
                            '../assets/pages/css/login.css'
                        ]
                    });
                }]
            }
        })
        // Confirm Email
        .state('confirm_email', {
            url: "/confirm_email",
            templateUrl: "views/confirm_email.html",
            data: { pageTitle: 'Confirm Email' },
            controller: "LoginController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/LoginController.js'
                        ]
                    });
                }]
            }
        })
        // Dashboard
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html",
            data: { pageTitle: 'Dashboard' },
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',

                            '../assets/pages/scripts/dashboard.min.js',
                            'js/controllers/DashboardController.js'
                        ]
                    });
                }]
            }
        })
        // Calendar
        .state('calendar', {
            url: "/calendar",
            templateUrl: "views/calendar.html",
            data: { pageTitle: 'Calendar' },
            controller: "CalendarController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '../assets/global/plugins/moment.min.js',
                            '../assets/global/plugins/fullcalendar/fullcalendar.min.js',
                            '../assets/global/plugins/jquery-ui/jquery-ui.min.js',
                            'js/controllers/CalendarController.js'
                        ]
                    });
                }]
            }
        })
        // Uploaded Documents
        .state('documents', {
            url: "/documents",
            templateUrl: "views/documents.html",
            data: { pageTitle: 'Uploaded Documents' },
            controller: "DocumentsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/DocumentsController.js'
                        ]
                    });
                }]
            }
        })
        // Inbox
        .state('inbox', {
            url: "/inbox",
            templateUrl: "views/inbox.html",
            data: { pageTitle: 'Inbox' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })
        // Account Settings Page
        .state('account', {
            url: "/settings/account",
            templateUrl: "views/settings/account.html",
            data: { pageTitle: 'Account Settings' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })
        .state('business_settings', {
            url: "/settings/business",
            templateUrl: "views/settings/business.html",
            data: { pageTitle: 'Business Settings' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })
        // Invoice Page
        .state('invoice', {
            url: "/account/invoice",
            templateUrl: "views/ven/account/invoice.html",
            data: { pageTitle: 'Invoice' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })
        
        // 404 Page
        .state('404', {
            url: "/404",
            templateUrl: "views/404.html",
            data: { pageTitle: 'Something Went Wrong' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })


    // Venue and Vendor Specific Controllers //
        // Client Rolodex
        .state('rolodex', {
            url: "/rolodex",
            templateUrl: "views/ven/rolodex.html",
            data: { pageTitle: 'Rolodex' },
            controller: "RolodexController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/pages/scripts/components-date-time-pickers.min.js',

                            'js/controllers/RolodexController.js'
                        ]
                    });
                }]
            }
        })
        // Handbooks
        .state('handbooks', {
            url: "/handbooks",
            templateUrl: "views/ven/handbooks.html",
            data: { pageTitle: 'Handbooks' },
            controller: "HandbookController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/HandbookController.js'
                        ]
                    });
                }]
            }
        })
        // Full Client Details
        .state('client_details', {
            url: "/client_details",
            templateUrl: "views/ven/client_details.html",
            data: { pageTitle: 'Client Details' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })
        // Handbook Editor
        .state('handbookeditor', {
            url: "/handbook_editor/{handbookId}",
            templateUrl: "views/ven/handbook_editor.html",
            data: { pageTitle: 'Handbook Editor' },
            controller: "HandbookController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/HandbookController.js'
                        ]
                    });
                }]
            }
        })
        // New Handbook
        .state('newhandbook', {
            url: "/newhandbook",
            templateUrl: "views/ven/newhandbook.html",
            data: { pageTitle: 'Handbook Editor' },
            controller: "HandbookController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/HandbookController.js'
                        ]
                    });
                }]
            }
        })
        // Finances
        .state('fin_overview', {
            url: "/finances",
            templateUrl: "views/ven/finances.html",
            data: { pageTitle: 'Finances' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.js',
                            '../assets/global/plugins/morris/raphael-min.js',

                            '../assets/pages/scripts/dashboard.js',
                            '../assets/pages/scripts/charts-morris.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })
        // Inventory
        .state('inventory', {
            url: "/inventory",
            templateUrl: "views/ven/inventory.html",
            data: { pageTitle: 'Inventory' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '../assets/pages/css/coming-soon.min.css',

                            '../assets/pages/scripts/coming-soon.min.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

    // Event Planner Specific Controllers //
        // Venue Details
        .state('venuedetails', {
            url: "/venue_details",
            templateUrl: "views/plan/venue_details.html",
            data: { pageTitle: 'Venue Details' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })
        // Vendor Details
        .state('vendordetails', {
            url: "/vendor_details",
            templateUrl: "views/plan/vendor_details.html",
            data: { pageTitle: 'Vendor Details' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/pages/scripts/components-bootstrap-select.min.js',
                            '../assets/pages/scripts/components-select2.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })
        // Event Handbook
        .state('event_handbook', {
            url: "/event_handbook",
            templateUrl: "views/plan/event_details.html",
            data: { pageTitle: 'Event Details' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })
        // Payments
        .state('budget', {
            url: "/budget",
            templateUrl: "views/plan/budget.html",
            data: { pageTitle: 'Budget' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.js',
                            '../assets/global/plugins/morris/raphael-min.js',

                            '../assets/pages/scripts/dashboard.js',
                            '../assets/pages/scripts/charts-morris.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", "authentication", "$location", "editableOptions", "meanData",
    function($rootScope, settings, $state, authentication, $location, editableOptions, meanData) {
        $rootScope.$on('$locationChangeStart', function(event, nextRoute, currentRoute) {
            if (!authentication.isLoggedIn()) {
                $location.path('/login');
            } else {
                meanData.getProfile()
                    .success(function(data) {
                        $rootScope.userlogintype = data.usertype;
                    })
                    .error(function(e) {
                        console.log(e);
                    });
            }

            if ($location.path() === '' && authentication.isLoggedIn())
                $location.path('/dashboard');
        });

        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$settings = settings; // state to be accessed from view
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }
]);
