"use strict";

/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", ["ui.router", "ui.bootstrap", "oc.lazyLoad", "ngSanitize", "angular-sir-trevor", "xeditable"]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

MetronicApp.service('authentication', ['$http', '$window', function ($http, $window) {

    var saveToken = function saveToken(token) {
        $window.localStorage['mean-token'] = token;
    };

    var clearToken = function clearToken() {
        $window.localStorage.removeItem('mean-token');
    };

    var getToken = function getToken() {
        return $window.localStorage['mean-token'];
    };

    var isLoggedIn = function isLoggedIn() {
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

    var currentUser = function currentUser() {
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

    var register = function register(user) {
        console.log("User: " + JSON.stringify(user));
        return $http.post('/register', user).success(function (data) {
            saveToken(data.token);
        });
    };

    var login = function login(user) {
        return $http.post('/api/login', user).success(function (data) {
            saveToken(data.token);
        });
    };

    var logout = function logout() {
        clearToken();
    };

    var changePassword = function changePassword() {
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
}]);

MetronicApp.service('meanData', ['$http', 'authentication', function ($http, authentication) {

    var auth = {
        headers: {
            Authorization: 'Bearer ' + authentication.getToken()
        }
    };

    var getProfile = function getProfile() {
        return $http.get('/api/profile', auth);
    };

    var updateProfile = function updateProfile(profile) {
        return $http.put('/api/updateProfile', profile, auth);
    };

    var getRolodex = function getRolodex() {
        return $http.get('/api/rolodex', auth);
    };

    var saveContact = function saveContact(contact) {
        return $http.post('/api/saveContact', contact, auth);
    };

    var getCalendar = function getCalendar() {
        return $http.get('/api/calendar', auth);
    };

    var saveEvent = function saveEvent(event) {
        return $http.post('/api/saveEvent', event, auth);
    };

    var updateEvent = function updateEvent(event) {
        return $http.put('/api/updateEvent', event, auth);
    };

    var getBooklets = function getBooklets() {
        return $http.get('/api/booklets', auth);
    };

    var saveBooklet = function saveBooklet(booklet) {
        return $http.post('/api/saveBooklet', booklet, auth);
    };

    var updateBooklet = function updateBooklet(booklet) {
        return $http.put('/api/updateBooklet', booklet, auth);
    };

    var setActiveHandbook = function setActiveHandbook(booklet) {
        return $http.put('/api/setActiveHandbook', booklet, auth);
    };

    var getActiveHandbook = function getActiveHandbook() {
        return $http.get('/api/getActiveHandbook', auth);
    };

    var sendNewUserInviteEmail = function sendNewUserInviteEmail(user) {
        return $http.post('/api/sendNewUserInviteEmail', user, auth);
    };

    var sendEmail = function sendEmail(email, subject, content) {
        return $http.post('/api/sendEmail', user, auth);
    };

    var getDocuments = function getDocuments() {
        return $http.get('/api/getFiles', auth);
    };

    var saveDocument = function saveDocument(document) {
        return $http.post('/api/saveFile', document, auth);
    };

    var signUpUser = function signUpUser(user) {
        return $http.post('/api/signUpUser', user, auth);
    };

    var saveEmployee = function saveEmployee(employee) {
        return $http.post('/api/saveEmployee', employee, auth);
    };

    var updateEmployees = function updateEmployees(employee) {
        return $http.put('/api/updateEmployees', employee, auth);
    };

    var getEmployees = function getEmployees() {
        return $http.get('/api/getEmployees', auth);
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
        getEmployees: getEmployees
    };
}]);

MetronicApp.service('amazons3', ['$http', 'authentication', function ($http, authentication) {
    var uploadFile = function uploadFile(file) {
        sign_request(file).success(function (response) {
            upload(file.file, response.signed_request, response.url, function () {
                // document.getElementById("preview").src = response.url
            });
        });
    };

    var uploadAvatar = function uploadAvatar(file) {
        sign_avatar(file).success(function (response) {
            upload(file, response.signed_request, response.url, function () {
                document.getElementById("preview").src = response.url;
            });
        });
    };

    var getImage = function getImage() {};

    function upload(file, signed_request, url, done) {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", signed_request);
        xhr.setRequestHeader('x-amz-acl', 'public-read');
        xhr.onload = function () {
            if (xhr.status === 200) {
                done();
            }
        };

        xhr.send(file);
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
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/404");

    $stateProvider

    // Log out
    .state('logout', {
        url: "/logout",
        templateUrl: "views/login.html",
        controller: function controller($location, authentication) {
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/LoginController.js']
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: ['js/controllers/LoginController.js']
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['../assets/global/plugins/moment.min.js', '../assets/global/plugins/fullcalendar/fullcalendar.min.js', '../assets/global/plugins/jquery-ui/jquery-ui.min.js', 'js/controllers/CalendarController.js']
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/DocumentsController.js']
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/GeneralPageController.js']
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/GeneralPageController.js']
                });
            }]
        }
    })

    // Venue and Vendor Specific Controllers //
    // Dashboard
    .state('dashboard', {
        url: "/dashboard",
        templateUrl: "views/ven/dashboard.html",
        data: { pageTitle: 'Dashboard' },
        // controller: "DashboardController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['../assets/global/plugins/morris/morris.css', '../assets/global/plugins/morris/morris.min.js', '../assets/global/plugins/morris/raphael-min.js', '../assets/pages/scripts/dashboard.min.js', 'js/controllers/DashboardController.js']
                });
            }]
        }
    })
    // Client Rolodex
    .state('rolodex', {
        url: "/rolodex",
        templateUrl: "views/ven/rolodex.html",
        data: { pageTitle: 'Rolodex' },
        controller: "RolodexController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css', '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js', '../assets/pages/scripts/components-date-time-pickers.min.js', 'js/controllers/RolodexController.js']
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/HandbookController.js']
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/GeneralPageController.js']
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/HandbookController.js']
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: ['js/controllers/HandbookController.js']
                });
            }]
        }
    })
    // Finances - Overview
    .state('fin_overview', {
        url: "/finance/overview",
        templateUrl: "views/ven/finances/overview.html",
        data: { pageTitle: 'Finances - Overview' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['../assets/global/plugins/morris/morris.css', '../assets/global/plugins/morris/morris.js', '../assets/global/plugins/morris/raphael-min.js', '../assets/pages/scripts/dashboard.js', '../assets/pages/scripts/charts-morris.js', 'js/controllers/GeneralPageController.js']
                });
            }]
        }
    })
    // Finances - Revenue
    .state('fin_revenue', {
        url: "/finance/revenue",
        templateUrl: "views/ven/finances/revenue.html",
        data: { pageTitle: 'Finances - Revenue' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['../assets/global/plugins/morris/morris.css', '../assets/global/plugins/morris/morris.js', '../assets/global/plugins/morris/raphael-min.js', '../assets/pages/scripts/dashboard.js', '../assets/pages/scripts/charts-morris.js', 'js/controllers/GeneralPageController.js']
                });
            }]
        }
    })
    // Finances - Expenses
    .state('fin_expenses', {
        url: "/finance/expenses",
        templateUrl: "views/ven/finances/expenses.html",
        data: { pageTitle: 'Finances - Expenses' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['../assets/global/plugins/morris/morris.css', '../assets/global/plugins/morris/morris.js', '../assets/global/plugins/morris/raphael-min.js', '../assets/pages/scripts/dashboard.js', '../assets/pages/scripts/charts-morris.js', 'js/controllers/GeneralPageController.js', 'js/controllers/RolodexController.js']
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['../assets/pages/css/coming-soon.min.css', '../assets/pages/scripts/coming-soon.min.js', 'js/controllers/GeneralPageController.js']
                });
            }]
        }
    })

    // Venue & Vendor Account Settings Page
    .state('ven_account', {
        url: "/account/settings",
        templateUrl: "views/ven/account/settings.html",
        data: { pageTitle: 'Account Settings' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/GeneralPageController.js']
                });
            }]
        }
    })
    // Employee Settings Page
    .state('employees', {
        url: "/account/employees",
        templateUrl: "views/ven/account/employees.html",
        data: { pageTitle: 'Employees' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: ['js/controllers/GeneralPageController.js']
                });
            }]
        }
    })
    // Preferred Businesses Settings Page
    .state('preferred_business', {
        url: "/account/preferred",
        templateUrl: "views/ven/account/preferred_business.html",
        data: { pageTitle: 'Preferred Businesses' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: ['js/controllers/GeneralPageController.js']
                });
            }]
        }
    })
    // Payment Settings Page
    .state('payments', {
        url: "/account/payments",
        templateUrl: "views/ven/account/payments.html",
        data: { pageTitle: 'Payments' },
        controller: "PaymentPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/GeneralPageController.js']
                });
            }]
        }
    })
    // Venue & Vendor Notifications Page
    .state('ven_notifications', {
        url: "/account/notifications",
        templateUrl: "views/ven/account/notifications.html",
        data: { pageTitle: 'Notifications' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/GeneralPageController.js']
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/GeneralPageController.js']
                });
            }]
        }
    })

    // Event Planner Specific Controllers //
    // Dashboard
    .state('plan_dashboard', {
        url: "/dashboard-plan",
        templateUrl: "views/plan/dashboard.html",
        data: { pageTitle: 'Dashboard' },
        controller: "DashboardController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: ['../assets/global/plugins/morris/morris.css', '../assets/global/plugins/morris/morris.min.js', '../assets/global/plugins/morris/raphael-min.js', '../assets/pages/scripts/dashboard.min.js', 'js/controllers/DashboardController.js']
                });
            }]
        }
    })
    // Venue Details
    .state('venuedetails', {
        url: "/venue_details",
        templateUrl: "views/plan/venue_details.html",
        data: { pageTitle: 'Venue Details' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/GeneralPageController.js']
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css', '../assets/global/plugins/select2/css/select2.min.css', '../assets/global/plugins/select2/css/select2-bootstrap.min.css', '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js', '../assets/global/plugins/select2/js/select2.full.min.js', '../assets/pages/scripts/components-bootstrap-select.min.js', '../assets/pages/scripts/components-select2.min.js', 'js/controllers/GeneralPageController.js']
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: ['js/controllers/GeneralPageController.js']
                });
            }]
        }
    })
    // Finances
    .state('finances', {
        url: "/finances",
        templateUrl: "views/plan/finances.html",
        data: { pageTitle: 'Finances' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/GeneralPageController.js']
                });
            }]
        }
    })
    // Account Settings Page
    .state('account', {
        url: "/settings/account",
        templateUrl: "views/plan/settings/account.html",
        data: { pageTitle: 'Account Settings' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/GeneralPageController.js']
                });
            }]
        }
    })
    // Planner Notifications Page
    .state('plan_notifications', {
        url: "/settings/notifications",
        templateUrl: "views/plan/settings/notifications.html",
        data: { pageTitle: 'Notifications' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files.js before a LINK element with this ID. Dynamic CSS files.js must be loaded between core and theme css files.js
                    files: ['js/controllers/GeneralPageController.js']
                });
            }]
        }
    });
}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", "authentication", "$location", "editableOptions", "meanData", function ($rootScope, settings, $state, authentication, $location, editableOptions, meanData) {
    $rootScope.$on('$locationChangeStart', function (event, nextRoute, currentRoute) {
        if (!authentication.isLoggedIn()) {
            $location.path('/login');
        } else {
            meanData.getProfile().success(function (data) {
                $rootScope.userlogintype = data.usertype;
            }).error(function (e) {
                console.log(e);
            });
        }

        if ($location.path() === '' && authentication.isLoggedIn()) $location.path('/dashboard');
    });

    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);
'use strict';

/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
MetronicApp.directive('ngSpinnerBar', ['$rootScope', function ($rootScope) {
    return {
        link: function link(scope, element, attrs) {
            // by defult hide the spinner bar
            element.addClass('hide'); // hide spinner bar by default

            // display the spinner bar whenever the route changes(the content part started loading)
            $rootScope.$on('$stateChangeStart', function () {
                element.removeClass('hide'); // show spinner bar
            });

            // hide the spinner bar on rounte change success(after the content loaded)
            $rootScope.$on('$stateChangeSuccess', function () {
                element.addClass('hide'); // hide spinner bar
                $('body').removeClass('page-on-load'); // remove page loading indicator
                Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu
                // auto scorll to page top
                setTimeout(function () {
                    App.scrollTop(); // scroll to the top on content load
                }, $rootScope.settings.layout.pageAutoScrollOnLoad);
            });

            // handle errors
            $rootScope.$on('$stateNotFound', function () {
                element.addClass('hide'); // hide spinner bar
            });

            // handle errors
            $rootScope.$on('$stateChangeError', function () {
                element.addClass('hide'); // hide spinner bar
            });
        }
    };
}]);

// Handle global LINK click
MetronicApp.directive('a', function () {
    return {
        restrict: 'E',
        link: function link(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function (e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
MetronicApp.directive('dropdownMenuHover', function () {
    return {
        link: function link(scope, elem) {
            elem.dropdownHover();
        }
    };
});

// Handle Google Places Autocomplete
MetronicApp.directive('googlePlace', ['$rootScope', function ($rootScope) {
    return {
        require: 'ngModel',
        scope: {
            ngModel: '=',
            details: '=?'
        },
        link: function link(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                scope.$apply(function () {
                    scope.details = scope.gPlace.getPlace();
                    model.$setViewValue(element.val());
                    $rootScope.$broadcast('place_changed', scope.details);
                });
            });
        }
    };
}]);
'use strict';

angular.module('MetronicApp').controller('BlankController', ['$rootScope', '$scope', 'settings', function ($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);
'use strict';

/* Setup calendar controller */
angular.module('MetronicApp').controller('CalendarController', ['$rootScope', '$scope', 'settings', 'meanData', function ($rootScope, $scope, settings, meanData) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    var vm = this;
    vm.event = {};

    $scope.comingevents = {};
    var loadCalendar = function loadCalendar() {

        meanData.getCalendar().success(function (data) {
            $('#calendar').fullCalendar({
                events: data,
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                timezone: 'local',
                eventClick: function eventClick(event, jsEvent, view) {
                    // $('#modalTitle').html(event.title);
                    $('#eventId').val(event._id);
                    $('#eventtitle').val(event.title);
                    $('#description').val(event.description);
                    $('#eventstartpicker').data("DateTimePicker").date(event.start._d);
                    $('#eventendpicker').data("DateTimePicker").date(event.end._d);

                    $('#edit_event').modal();
                }
            });

            // pulling out dates after today
            $scope.comingevents = $.grep(data, function (e) {
                var now = new Date().getTime();
                var thisdate = new Date(e.start).getTime();
                return thisdate > now;
            });

            // sorting dates in order
            $scope.comingevents.sort(function (x, y) {
                return new Date(x.start).getTime() - new Date(y.start).getTime();
            });

            // formatting the dates
            $scope.comingevents.forEach(function (part, i, events) {
                events[i].start = moment(events[i].start).format('MM/DD ha');
            });
        }).error(function (e) {
            console.log(e);
        });
    };

    $('#neweventbutton').click(function () {
        $('#neweventmodal').modal();
    });

    $('#eventstartpicker').datetimepicker();
    $('#eventendpicker').datetimepicker();

    $('#starttimepicker').datetimepicker();
    $('#endtimepicker').datetimepicker();

    loadCalendar();

    $scope.onAddSubmit = function () {
        console.log('Submitting event ' + $scope.event.title);
        $scope.event.start = moment.utc($("#starttimepicker").data("DateTimePicker").date()).valueOf();
        $scope.event.end = moment.utc($("#endtimepicker").data("DateTimePicker").date()).valueOf();
        meanData.saveEvent($scope.event).success(function () {
            toastr.success('Event added successfully.', 'Event Added');
            $('#calendar').fullCalendar('destroy');
            loadCalendar();
            $('#add_event').modal('hide');
        }).error(function (e) {
            console.log(e);
        });
    };

    $scope.event = {};
    $scope.onEditSubmit = function () {
        $scope.event.title = $('#eventtitle').val();
        console.log('Editing event ' + $scope.event.title);
        $scope.event.description = $('#description').val();
        $scope.event.start = moment.utc($("#eventstartpicker").data("DateTimePicker").date()).valueOf();
        $scope.event.end = moment.utc($("#eventendpicker").data("DateTimePicker").date()).valueOf();
        $scope.event._id = $('#eventId').val();
        meanData.updateEvent($scope.event).error(function (e) {
            console.log(e);
        }).success(function () {
            toastr.success('Event updated successfully.', 'Event Updated');
            $('#calendar').fullCalendar('destroy');
            $('#edit_event').modal('hide');
            loadCalendar();
        });
    };
}]);
'use strict';

angular.module('MetronicApp').controller('DashboardController', function ($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
});
'use strict';

angular.module('MetronicApp').controller('DocumentsController', ['$rootScope', '$scope', 'settings', 'meanData', 'amazons3', function ($rootScope, $scope, settings, meanData, amazons3) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    $scope.docs = {};

    var loadDocs = function loadDocs() {
        meanData.getDocuments().success(function (data) {
            $scope.documents = data;
        }).error(function (e) {
            console.log(e);
        });
    };

    loadDocs();

    $scope.uploadDocument = function () {
        var file = $('#newDoc')[0].files[0];
        if (!file) return;

        amazons3.uploadFile({ 'file': file, 'name': $scope.document.filename });

        $scope.document.uploaded = moment.utc();
        meanData.saveDocument($scope.document).error(function (e) {
            console.log(e);
        }).success(function () {
            $('#add_doc').modal('hide');
            toastr.success('Document was added successfully.', 'Document Added');
            loadDocs();
        });
    };

    $scope.viewDocument = function (document) {
        window.open('https://ourstory-vendly.s3.amazonaws.com/' + document._owner + '/' + document.name);
    };
}]);
'use strict';

/* Setup general page controller */
angular.module('MetronicApp').config(['sirTrevorServiceProvider', function (sirTrevorServiceProvider) {
    // set config
    sirTrevorServiceProvider.setConfig({
        "debug": false,
        "scribeDebug": false,
        "language": "en"
    });

    // set defaults
    sirTrevorServiceProvider.setDefaults({
        "iconUrl": "vendor/sir-trevor/src/icons/sir-trevor-icons.svg"
    });

    // set block options
    sirTrevorServiceProvider.setBlockOptions({
        /* put block options here */
    });
}]).controller('GeneralPageController', ['$rootScope', '$scope', 'settings', 'meanData', 'amazons3', 'authentication', function ($rootScope, $scope, settings, meanData, amazons3, authentication) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        $scope.editorContent = {
            "data": [{
                "type": "checkbox",
                "data": {
                    "text": "<p>Start creating your event handbook!</p>",
                    "format": "html"
                }
            }]
        };
    });

    $scope.handbook = {
        name: 'Untitled'
    };

    $scope.uploadImage = function () {
        var file = $('#avatarImg')[0].files[0];
        if (!file) return;
        amazons3.uploadAvatar(file);
    };

    $('#avatarImg').change(function () {
        var file = $(this)[0].files[0];
        $('#preview').attr('src', URL.createObjectURL(file));
    });

    $scope.user_settings = {};
    meanData.getProfile().success(function (user) {
        // TODO - make more secure
        $scope.user_settings.avatar = 'https://ourstory-vendly.s3.amazonaws.com/' + user._id + '/avatar.png';
        $scope.user_settings.name = user.name;
        $scope.user_settings.email = user.email;
        $scope.user_settings.phone = user.phone;
        $scope.user_settings.website = user.website;
        $scope.user_settings.bus_name = user.bus_name;
        $scope.user_settings.usertype = user.usertype;
        $('#usertypeSelect').val(user.usertype);
    }).error(function (e) {
        console.log(e);
    });

    $scope.updateProfile = function () {
        for (var key in $scope.user_settings) {
            var obj = $scope.user_settings[key];
            if (typeof obj === 'undefined') $scope.user_settings[key] = '';
        }

        meanData.updateProfile($scope.user_settings).success(function () {
            toastr.success('Your profile info was successfully changed.', 'Settings Changed');
        }).error(function (e) {
            toastr.error(e.message, 'Error');
        });
    };

    $scope.changePassword = function () {
        authentication.changePassword($scope.user_settings).success(function () {
            toastr.success('Your password was successfully changed.', 'Password Changed');
        }).error(function (e) {
            toastr.error(e.message, 'Error');
        });
    };

    $scope.myEmployees = {};
    meanData.getEmployees().success(function (employees) {
        $scope.myEmployees = employees;
    }).error(function (e) {
        console.log(e);
    });

    $scope.saveEmployee = function () {
        meanData.saveEmployee($scope.employee).success(function () {
            toastr.success('Employee saved successfully.', 'Employee Saved');
        }).error(function (e) {
            toastr.error(e.message, 'Error');
        });
    };

    $scope.updateEmployees = function () {
        meanData.updateEmployees($scope.employeeChanges).success(function () {
            toastr.success('Employee settings changed successfully.', 'Changes Saved');
        }).error(function (e) {
            toastr.error(e.message, 'Error');
        });
    };
}]);
'use strict';

angular.module('MetronicApp').controller('HandbookController', ['$rootScope', '$scope', '$stateParams', 'settings', 'meanData', function ($rootScope, $scope, $stateParams, settings, meanData) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    var formbuilder = new Formbuilder({
        selector: '#formbuilder',
        bootstrapData: [{ "label": "Section Break", "field_type": "new_section_break", "required": false,
            "field_options": { "description": "Description about this section." }, "cid": "c8" }, { "label": "Wedding Date",
            "field_type": "date", "required": true, "field_options": { "description": "" }, "cid": "c13" }, { "label": "Which if the following do you want to include in your wedding?", "field_type": "checkboxes",
            "required": true, "field_options": { "options": [{ "label": "Unity Candle", "checked": false }, { "label": "Wedding cord/lasso", "checked": false }], "include_other_option": true }, "cid": "c17" }]
    });

    $scope.handbook = {};
    $scope.handbooks = {};
    var loadHandbooks = function loadHandbooks() {
        meanData.getBooklets().success(function (data) {
            $scope.handbooks = data;
            if ($stateParams.hasOwnProperty('handbookId')) {
                $scope.handbook = $.grep(data, function (e) {
                    return e._id == $stateParams.handbookId;
                })[0];

                formbuilder = new Formbuilder({
                    selector: '#formbuilder',
                    bootstrapData: JSON.parse($scope.handbook.content).fields
                });

                formbuilder.on('save', function (payload) {
                    $scope.handbook.content = payload;
                    $scope.handbook.updated_date = moment.utc();
                    meanData.updateBooklet($scope.handbook).error(function (e) {
                        console.log(e);
                    }).then(function () {});
                });
            }
        }).error(function (e) {
            console.log(e);
        });
    };
    loadHandbooks();

    formbuilder.on('save', function (payload) {
        $scope.handbook.content = payload;
        meanData.saveBooklet($scope.handbook).error(function (e) {
            console.log(e);
        }).then(function () {});
    });

    meanData.getActiveHandbook().success(function (active_booklet) {
        $scope.active_booklet = active_booklet._id;
    }).error(function (e) {
        console.log(e);
    });

    $scope.setActiveBooklet = function (handbook) {
        meanData.setActiveHandbook(handbook).success(function () {}).error(function (e) {
            console.log(e);
        });
    };
}]);
'use strict';

angular.module('MetronicApp').controller('LoginController', ['$location', 'authentication', '$scope', '$rootScope', 'meanData', function ($location, authentication, $scope, $rootScope, meanData) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    $scope.onSubmit = function () {
        authentication.login($scope.credentials).error(function (err) {
            toastr.error(err.message, 'Error');
        }).then(function () {
            $('.modal-backdrop').remove();
            $location.path('dashboard');
        });
    };

    $scope.onRegisterSubmit = function () {
        console.log('Submitting registration');
        authentication.register($scope.register).error(function (err) {
            toastr.error(err, 'Error');
        }).then(function () {
            meanData.signUpUser($scope.register).success(function () {
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
}]);
'use strict';

/* Setup general page controller */
angular.module('MetronicApp').controller('GeneralPageController', ['$rootScope', '$scope', 'settings', function ($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);
angular.module('MetronicApp').config(function ($window) {
    $window.Stripe.setPublishableKey('YOUR-KEY-COMES-HERE');
});
'use strict';

angular.module('MetronicApp').controller('RolodexController', ['$rootScope', '$scope', 'settings', 'meanData', function ($rootScope, $scope, settings, meanData) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    $scope.clients = {};

    loadRolodex = function loadRolodex() {
        meanData.getRolodex().success(function (data) {
            $scope.clients = data;
            //$('#example').DataTable();
        }).error(function (e) {
            console.log(e);
        });
    };

    loadRolodex();

    $scope.contact = {};
    $scope.onContactSubmit = function () {
        $scope.contact.name = $scope.firstname + ' ' + $scope.lastname;
        console.log('Submitting contact ' + $scope.contact.name);
        meanData.saveContact($scope.contact).error(function (e) {
            console.log(e);
        }).then(function () {
            $('#add_client').modal('hide');
            toastr.success('An invitation email has been sent to them to access your handbook.', 'Client Added');
            loadRolodex();
        });
    };

    $scope.viewContact = function (client) {
        $('#clientname').html(client.name);
        $('#clientemail').html(client.email);
        $('#clientphone').html(client.phone);
        $('#clientweddingdate').html(new Date(client.weddingdate).toLocaleDateString());
        $('#clientbalancedue').html(client.balanceDue);
    };

    $('#viewfulldetails').click(function () {
        $('.modal-backdrop').remove();
    });

    // Date toggle current and past customers
    var currentClients = function currentClients(wedding, today) {
        return wedding >= today;
    };
    var pastClients = function pastClients(wedding, today) {
        return wedding < today;
    };
    $scope.dateFilterFunction = currentClients;
    $scope.dateFilter = function (client) {
        return $scope.dateFilterFunction(new Date(client.weddingdate).getDate(), new Date().getDate());
    };
    $scope.toggleCurrentClients = function () {
        if ($scope.dateFilterFunction === pastClients) $scope.dateFilterFunction = currentClients;else $scope.dateFilterFunction = pastClients;
    };

    ComponentsDateTimePickers.init(); // init todo page
}]);
'use strict';

angular.module('MetronicApp').controller('TodoController', function ($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components        
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;
});
'use strict';

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
angular.module('MetronicApp').filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

angular.module('MetronicApp').controller('UISelectController', function ($scope, $http, $timeout, $interval) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initAjax(); // initialize core components
    });

    var vm = this;

    vm.disabled = undefined;
    vm.searchEnabled = undefined;

    vm.setInputFocus = function () {
        $scope.$broadcast('UiSelectDemo1');
    };

    vm.enable = function () {
        vm.disabled = false;
    };

    vm.disable = function () {
        vm.disabled = true;
    };

    vm.enableSearch = function () {
        vm.searchEnabled = true;
    };

    vm.disableSearch = function () {
        vm.searchEnabled = false;
    };

    vm.clear = function () {
        vm.person.selected = undefined;
        vm.address.selected = undefined;
        vm.country.selected = undefined;
    };

    vm.someGroupFn = function (item) {

        if (item.name[0] >= 'A' && item.name[0] <= 'M') return 'From A - M';

        if (item.name[0] >= 'N' && item.name[0] <= 'Z') return 'From N - Z';
    };

    vm.firstLetterGroupFn = function (item) {
        return item.name[0];
    };

    vm.reverseOrderFilterFn = function (groups) {
        return groups.reverse();
    };

    vm.personAsync = {
        selected: "wladimir@email.com"
    };
    vm.peopleAsync = [];

    $timeout(function () {
        vm.peopleAsync = [{
            name: 'Adam',
            email: 'adam@email.com',
            age: 12,
            country: 'United States'
        }, {
            name: 'Amalie',
            email: 'amalie@email.com',
            age: 12,
            country: 'Argentina'
        }, {
            name: 'Estefanía',
            email: 'estefania@email.com',
            age: 21,
            country: 'Argentina'
        }, {
            name: 'Adrian',
            email: 'adrian@email.com',
            age: 21,
            country: 'Ecuador'
        }, {
            name: 'Wladimir',
            email: 'wladimir@email.com',
            age: 30,
            country: 'Ecuador'
        }, {
            name: 'Samantha',
            email: 'samantha@email.com',
            age: 30,
            country: 'United States'
        }, {
            name: 'Nicole',
            email: 'nicole@email.com',
            age: 43,
            country: 'Colombia'
        }, {
            name: 'Natasha',
            email: 'natasha@email.com',
            age: 54,
            country: 'Ecuador'
        }, {
            name: 'Michael',
            email: 'michael@email.com',
            age: 15,
            country: 'Colombia'
        }, {
            name: 'Nicolás',
            email: 'nicole@email.com',
            age: 43,
            country: 'Colombia'
        }];
    }, 3000);

    vm.counter = 0;
    vm.onSelectCallback = function (item, model) {
        vm.counter++;
        vm.eventResult = {
            item: item,
            model: model
        };
    };

    vm.removed = function (item, model) {
        vm.lastRemoved = {
            item: item,
            model: model
        };
    };

    vm.tagTransform = function (newTag) {
        var item = {
            name: newTag,
            email: newTag.toLowerCase() + '@email.com',
            age: 'unknown',
            country: 'unknown'
        };

        return item;
    };

    vm.peopleObj = {
        '1': {
            name: 'Adam',
            email: 'adam@email.com',
            age: 12,
            country: 'United States'
        },
        '2': {
            name: 'Amalie',
            email: 'amalie@email.com',
            age: 12,
            country: 'Argentina'
        },
        '3': {
            name: 'Estefanía',
            email: 'estefania@email.com',
            age: 21,
            country: 'Argentina'
        },
        '4': {
            name: 'Adrian',
            email: 'adrian@email.com',
            age: 21,
            country: 'Ecuador'
        },
        '5': {
            name: 'Wladimir',
            email: 'wladimir@email.com',
            age: 30,
            country: 'Ecuador'
        },
        '6': {
            name: 'Samantha',
            email: 'samantha@email.com',
            age: 30,
            country: 'United States'
        },
        '7': {
            name: 'Nicole',
            email: 'nicole@email.com',
            age: 43,
            country: 'Colombia'
        },
        '8': {
            name: 'Natasha',
            email: 'natasha@email.com',
            age: 54,
            country: 'Ecuador'
        },
        '9': {
            name: 'Michael',
            email: 'michael@email.com',
            age: 15,
            country: 'Colombia'
        },
        '10': {
            name: 'Nicolás',
            email: 'nicolas@email.com',
            age: 43,
            country: 'Colombia'
        }
    };

    vm.person = {};

    vm.person.selectedValue = vm.peopleObj[3];
    vm.person.selectedSingle = 'Samantha';
    vm.person.selectedSingleKey = '5';
    // To run the demos with a preselected person object, uncomment the line below.
    //vm.person.selected = vm.person.selectedValue;

    vm.people = [{
        name: 'Adam',
        email: 'adam@email.com',
        age: 12,
        country: 'United States'
    }, {
        name: 'Amalie',
        email: 'amalie@email.com',
        age: 12,
        country: 'Argentina'
    }, {
        name: 'Estefanía',
        email: 'estefania@email.com',
        age: 21,
        country: 'Argentina'
    }, {
        name: 'Adrian',
        email: 'adrian@email.com',
        age: 21,
        country: 'Ecuador'
    }, {
        name: 'Wladimir',
        email: 'wladimir@email.com',
        age: 30,
        country: 'Ecuador'
    }, {
        name: 'Samantha',
        email: 'samantha@email.com',
        age: 30,
        country: 'United States'
    }, {
        name: 'Nicole',
        email: 'nicole@email.com',
        age: 43,
        country: 'Colombia'
    }, {
        name: 'Natasha',
        email: 'natasha@email.com',
        age: 54,
        country: 'Ecuador'
    }, {
        name: 'Michael',
        email: 'michael@email.com',
        age: 15,
        country: 'Colombia'
    }, {
        name: 'Nicolás',
        email: 'nicolas@email.com',
        age: 43,
        country: 'Colombia'
    }];

    vm.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra', 'Turquoise'];

    vm.singleDemo = {};
    vm.singleDemo.color = '';
    vm.multipleDemo = {};
    vm.multipleDemo.colors = ['Blue', 'Red'];
    vm.multipleDemo.colors2 = ['Blue', 'Red'];
    vm.multipleDemo.selectedPeople = [vm.people[5], vm.people[4]];
    vm.multipleDemo.selectedPeople2 = vm.multipleDemo.selectedPeople;
    vm.multipleDemo.selectedPeopleWithGroupBy = [vm.people[8], vm.people[6]];
    vm.multipleDemo.selectedPeopleSimple = ['samantha@email.com', 'wladimir@email.com'];
    vm.multipleDemo.removeSelectIsFalse = [vm.people[2], vm.people[0]];

    vm.appendToBodyDemo = {
        remainingToggleTime: 0,
        present: true,
        startToggleTimer: function startToggleTimer() {
            var scope = vm.appendToBodyDemo;
            var promise = $interval(function () {
                if (scope.remainingTime < 1000) {
                    $interval.cancel(promise);
                    scope.present = !scope.present;
                    scope.remainingTime = 0;
                } else {
                    scope.remainingTime -= 1000;
                }
            }, 1000);
            scope.remainingTime = 3000;
        }
    };

    vm.address = {};
    vm.refreshAddresses = function (address) {
        var params = {
            address: address,
            sensor: false
        };
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
            params: params
        }).then(function (response) {
            vm.addresses = response.data.results;
        });
    };

    vm.addPerson = function (item, model) {
        if (item.hasOwnProperty('isTag')) {
            delete item.isTag;
            vm.people.push(item);
        }
    };

    vm.country = {};
    vm.countries = [// Taken from https://gist.github.com/unceus/6501985
    {
        name: 'Afghanistan',
        code: 'AF'
    }, {
        name: 'Åland Islands',
        code: 'AX'
    }, {
        name: 'Albania',
        code: 'AL'
    }, {
        name: 'Algeria',
        code: 'DZ'
    }, {
        name: 'American Samoa',
        code: 'AS'
    }, {
        name: 'Andorra',
        code: 'AD'
    }, {
        name: 'Angola',
        code: 'AO'
    }, {
        name: 'Anguilla',
        code: 'AI'
    }, {
        name: 'Antarctica',
        code: 'AQ'
    }, {
        name: 'Antigua and Barbuda',
        code: 'AG'
    }, {
        name: 'Argentina',
        code: 'AR'
    }, {
        name: 'Armenia',
        code: 'AM'
    }, {
        name: 'Aruba',
        code: 'AW'
    }, {
        name: 'Australia',
        code: 'AU'
    }, {
        name: 'Austria',
        code: 'AT'
    }, {
        name: 'Azerbaijan',
        code: 'AZ'
    }, {
        name: 'Bahamas',
        code: 'BS'
    }, {
        name: 'Bahrain',
        code: 'BH'
    }, {
        name: 'Bangladesh',
        code: 'BD'
    }, {
        name: 'Barbados',
        code: 'BB'
    }, {
        name: 'Belarus',
        code: 'BY'
    }, {
        name: 'Belgium',
        code: 'BE'
    }, {
        name: 'Belize',
        code: 'BZ'
    }, {
        name: 'Benin',
        code: 'BJ'
    }, {
        name: 'Bermuda',
        code: 'BM'
    }, {
        name: 'Bhutan',
        code: 'BT'
    }, {
        name: 'Bolivia',
        code: 'BO'
    }, {
        name: 'Bosnia and Herzegovina',
        code: 'BA'
    }, {
        name: 'Botswana',
        code: 'BW'
    }, {
        name: 'Bouvet Island',
        code: 'BV'
    }, {
        name: 'Brazil',
        code: 'BR'
    }, {
        name: 'British Indian Ocean Territory',
        code: 'IO'
    }, {
        name: 'Brunei Darussalam',
        code: 'BN'
    }, {
        name: 'Bulgaria',
        code: 'BG'
    }, {
        name: 'Burkina Faso',
        code: 'BF'
    }, {
        name: 'Burundi',
        code: 'BI'
    }, {
        name: 'Cambodia',
        code: 'KH'
    }, {
        name: 'Cameroon',
        code: 'CM'
    }, {
        name: 'Canada',
        code: 'CA'
    }, {
        name: 'Cape Verde',
        code: 'CV'
    }, {
        name: 'Cayman Islands',
        code: 'KY'
    }, {
        name: 'Central African Republic',
        code: 'CF'
    }, {
        name: 'Chad',
        code: 'TD'
    }, {
        name: 'Chile',
        code: 'CL'
    }, {
        name: 'China',
        code: 'CN'
    }, {
        name: 'Christmas Island',
        code: 'CX'
    }, {
        name: 'Cocos (Keeling) Islands',
        code: 'CC'
    }, {
        name: 'Colombia',
        code: 'CO'
    }, {
        name: 'Comoros',
        code: 'KM'
    }, {
        name: 'Congo',
        code: 'CG'
    }, {
        name: 'Congo, The Democratic Republic of the',
        code: 'CD'
    }, {
        name: 'Cook Islands',
        code: 'CK'
    }, {
        name: 'Costa Rica',
        code: 'CR'
    }, {
        name: 'Cote D\'Ivoire',
        code: 'CI'
    }, {
        name: 'Croatia',
        code: 'HR'
    }, {
        name: 'Cuba',
        code: 'CU'
    }, {
        name: 'Cyprus',
        code: 'CY'
    }, {
        name: 'Czech Republic',
        code: 'CZ'
    }, {
        name: 'Denmark',
        code: 'DK'
    }, {
        name: 'Djibouti',
        code: 'DJ'
    }, {
        name: 'Dominica',
        code: 'DM'
    }, {
        name: 'Dominican Republic',
        code: 'DO'
    }, {
        name: 'Ecuador',
        code: 'EC'
    }, {
        name: 'Egypt',
        code: 'EG'
    }, {
        name: 'El Salvador',
        code: 'SV'
    }, {
        name: 'Equatorial Guinea',
        code: 'GQ'
    }, {
        name: 'Eritrea',
        code: 'ER'
    }, {
        name: 'Estonia',
        code: 'EE'
    }, {
        name: 'Ethiopia',
        code: 'ET'
    }, {
        name: 'Falkland Islands (Malvinas)',
        code: 'FK'
    }, {
        name: 'Faroe Islands',
        code: 'FO'
    }, {
        name: 'Fiji',
        code: 'FJ'
    }, {
        name: 'Finland',
        code: 'FI'
    }, {
        name: 'France',
        code: 'FR'
    }, {
        name: 'French Guiana',
        code: 'GF'
    }, {
        name: 'French Polynesia',
        code: 'PF'
    }, {
        name: 'French Southern Territories',
        code: 'TF'
    }, {
        name: 'Gabon',
        code: 'GA'
    }, {
        name: 'Gambia',
        code: 'GM'
    }, {
        name: 'Georgia',
        code: 'GE'
    }, {
        name: 'Germany',
        code: 'DE'
    }, {
        name: 'Ghana',
        code: 'GH'
    }, {
        name: 'Gibraltar',
        code: 'GI'
    }, {
        name: 'Greece',
        code: 'GR'
    }, {
        name: 'Greenland',
        code: 'GL'
    }, {
        name: 'Grenada',
        code: 'GD'
    }, {
        name: 'Guadeloupe',
        code: 'GP'
    }, {
        name: 'Guam',
        code: 'GU'
    }, {
        name: 'Guatemala',
        code: 'GT'
    }, {
        name: 'Guernsey',
        code: 'GG'
    }, {
        name: 'Guinea',
        code: 'GN'
    }, {
        name: 'Guinea-Bissau',
        code: 'GW'
    }, {
        name: 'Guyana',
        code: 'GY'
    }, {
        name: 'Haiti',
        code: 'HT'
    }, {
        name: 'Heard Island and Mcdonald Islands',
        code: 'HM'
    }, {
        name: 'Holy See (Vatican City State)',
        code: 'VA'
    }, {
        name: 'Honduras',
        code: 'HN'
    }, {
        name: 'Hong Kong',
        code: 'HK'
    }, {
        name: 'Hungary',
        code: 'HU'
    }, {
        name: 'Iceland',
        code: 'IS'
    }, {
        name: 'India',
        code: 'IN'
    }, {
        name: 'Indonesia',
        code: 'ID'
    }, {
        name: 'Iran, Islamic Republic Of',
        code: 'IR'
    }, {
        name: 'Iraq',
        code: 'IQ'
    }, {
        name: 'Ireland',
        code: 'IE'
    }, {
        name: 'Isle of Man',
        code: 'IM'
    }, {
        name: 'Israel',
        code: 'IL'
    }, {
        name: 'Italy',
        code: 'IT'
    }, {
        name: 'Jamaica',
        code: 'JM'
    }, {
        name: 'Japan',
        code: 'JP'
    }, {
        name: 'Jersey',
        code: 'JE'
    }, {
        name: 'Jordan',
        code: 'JO'
    }, {
        name: 'Kazakhstan',
        code: 'KZ'
    }, {
        name: 'Kenya',
        code: 'KE'
    }, {
        name: 'Kiribati',
        code: 'KI'
    }, {
        name: 'Korea, Democratic People\'s Republic of',
        code: 'KP'
    }, {
        name: 'Korea, Republic of',
        code: 'KR'
    }, {
        name: 'Kuwait',
        code: 'KW'
    }, {
        name: 'Kyrgyzstan',
        code: 'KG'
    }, {
        name: 'Lao People\'s Democratic Republic',
        code: 'LA'
    }, {
        name: 'Latvia',
        code: 'LV'
    }, {
        name: 'Lebanon',
        code: 'LB'
    }, {
        name: 'Lesotho',
        code: 'LS'
    }, {
        name: 'Liberia',
        code: 'LR'
    }, {
        name: 'Libyan Arab Jamahiriya',
        code: 'LY'
    }, {
        name: 'Liechtenstein',
        code: 'LI'
    }, {
        name: 'Lithuania',
        code: 'LT'
    }, {
        name: 'Luxembourg',
        code: 'LU'
    }, {
        name: 'Macao',
        code: 'MO'
    }, {
        name: 'Macedonia, The Former Yugoslav Republic of',
        code: 'MK'
    }, {
        name: 'Madagascar',
        code: 'MG'
    }, {
        name: 'Malawi',
        code: 'MW'
    }, {
        name: 'Malaysia',
        code: 'MY'
    }, {
        name: 'Maldives',
        code: 'MV'
    }, {
        name: 'Mali',
        code: 'ML'
    }, {
        name: 'Malta',
        code: 'MT'
    }, {
        name: 'Marshall Islands',
        code: 'MH'
    }, {
        name: 'Martinique',
        code: 'MQ'
    }, {
        name: 'Mauritania',
        code: 'MR'
    }, {
        name: 'Mauritius',
        code: 'MU'
    }, {
        name: 'Mayotte',
        code: 'YT'
    }, {
        name: 'Mexico',
        code: 'MX'
    }, {
        name: 'Micronesia, Federated States of',
        code: 'FM'
    }, {
        name: 'Moldova, Republic of',
        code: 'MD'
    }, {
        name: 'Monaco',
        code: 'MC'
    }, {
        name: 'Mongolia',
        code: 'MN'
    }, {
        name: 'Montserrat',
        code: 'MS'
    }, {
        name: 'Morocco',
        code: 'MA'
    }, {
        name: 'Mozambique',
        code: 'MZ'
    }, {
        name: 'Myanmar',
        code: 'MM'
    }, {
        name: 'Namibia',
        code: 'NA'
    }, {
        name: 'Nauru',
        code: 'NR'
    }, {
        name: 'Nepal',
        code: 'NP'
    }, {
        name: 'Netherlands',
        code: 'NL'
    }, {
        name: 'Netherlands Antilles',
        code: 'AN'
    }, {
        name: 'New Caledonia',
        code: 'NC'
    }, {
        name: 'New Zealand',
        code: 'NZ'
    }, {
        name: 'Nicaragua',
        code: 'NI'
    }, {
        name: 'Niger',
        code: 'NE'
    }, {
        name: 'Nigeria',
        code: 'NG'
    }, {
        name: 'Niue',
        code: 'NU'
    }, {
        name: 'Norfolk Island',
        code: 'NF'
    }, {
        name: 'Northern Mariana Islands',
        code: 'MP'
    }, {
        name: 'Norway',
        code: 'NO'
    }, {
        name: 'Oman',
        code: 'OM'
    }, {
        name: 'Pakistan',
        code: 'PK'
    }, {
        name: 'Palau',
        code: 'PW'
    }, {
        name: 'Palestinian Territory, Occupied',
        code: 'PS'
    }, {
        name: 'Panama',
        code: 'PA'
    }, {
        name: 'Papua New Guinea',
        code: 'PG'
    }, {
        name: 'Paraguay',
        code: 'PY'
    }, {
        name: 'Peru',
        code: 'PE'
    }, {
        name: 'Philippines',
        code: 'PH'
    }, {
        name: 'Pitcairn',
        code: 'PN'
    }, {
        name: 'Poland',
        code: 'PL'
    }, {
        name: 'Portugal',
        code: 'PT'
    }, {
        name: 'Puerto Rico',
        code: 'PR'
    }, {
        name: 'Qatar',
        code: 'QA'
    }, {
        name: 'Reunion',
        code: 'RE'
    }, {
        name: 'Romania',
        code: 'RO'
    }, {
        name: 'Russian Federation',
        code: 'RU'
    }, {
        name: 'Rwanda',
        code: 'RW'
    }, {
        name: 'Saint Helena',
        code: 'SH'
    }, {
        name: 'Saint Kitts and Nevis',
        code: 'KN'
    }, {
        name: 'Saint Lucia',
        code: 'LC'
    }, {
        name: 'Saint Pierre and Miquelon',
        code: 'PM'
    }, {
        name: 'Saint Vincent and the Grenadines',
        code: 'VC'
    }, {
        name: 'Samoa',
        code: 'WS'
    }, {
        name: 'San Marino',
        code: 'SM'
    }, {
        name: 'Sao Tome and Principe',
        code: 'ST'
    }, {
        name: 'Saudi Arabia',
        code: 'SA'
    }, {
        name: 'Senegal',
        code: 'SN'
    }, {
        name: 'Serbia and Montenegro',
        code: 'CS'
    }, {
        name: 'Seychelles',
        code: 'SC'
    }, {
        name: 'Sierra Leone',
        code: 'SL'
    }, {
        name: 'Singapore',
        code: 'SG'
    }, {
        name: 'Slovakia',
        code: 'SK'
    }, {
        name: 'Slovenia',
        code: 'SI'
    }, {
        name: 'Solomon Islands',
        code: 'SB'
    }, {
        name: 'Somalia',
        code: 'SO'
    }, {
        name: 'South Africa',
        code: 'ZA'
    }, {
        name: 'South Georgia and the South Sandwich Islands',
        code: 'GS'
    }, {
        name: 'Spain',
        code: 'ES'
    }, {
        name: 'Sri Lanka',
        code: 'LK'
    }, {
        name: 'Sudan',
        code: 'SD'
    }, {
        name: 'Suriname',
        code: 'SR'
    }, {
        name: 'Svalbard and Jan Mayen',
        code: 'SJ'
    }, {
        name: 'Swaziland',
        code: 'SZ'
    }, {
        name: 'Sweden',
        code: 'SE'
    }, {
        name: 'Switzerland',
        code: 'CH'
    }, {
        name: 'Syrian Arab Republic',
        code: 'SY'
    }, {
        name: 'Taiwan, Province of China',
        code: 'TW'
    }, {
        name: 'Tajikistan',
        code: 'TJ'
    }, {
        name: 'Tanzania, United Republic of',
        code: 'TZ'
    }, {
        name: 'Thailand',
        code: 'TH'
    }, {
        name: 'Timor-Leste',
        code: 'TL'
    }, {
        name: 'Togo',
        code: 'TG'
    }, {
        name: 'Tokelau',
        code: 'TK'
    }, {
        name: 'Tonga',
        code: 'TO'
    }, {
        name: 'Trinidad and Tobago',
        code: 'TT'
    }, {
        name: 'Tunisia',
        code: 'TN'
    }, {
        name: 'Turkey',
        code: 'TR'
    }, {
        name: 'Turkmenistan',
        code: 'TM'
    }, {
        name: 'Turks and Caicos Islands',
        code: 'TC'
    }, {
        name: 'Tuvalu',
        code: 'TV'
    }, {
        name: 'Uganda',
        code: 'UG'
    }, {
        name: 'Ukraine',
        code: 'UA'
    }, {
        name: 'United Arab Emirates',
        code: 'AE'
    }, {
        name: 'United Kingdom',
        code: 'GB'
    }, {
        name: 'United States',
        code: 'US'
    }, {
        name: 'United States Minor Outlying Islands',
        code: 'UM'
    }, {
        name: 'Uruguay',
        code: 'UY'
    }, {
        name: 'Uzbekistan',
        code: 'UZ'
    }, {
        name: 'Vanuatu',
        code: 'VU'
    }, {
        name: 'Venezuela',
        code: 'VE'
    }, {
        name: 'Vietnam',
        code: 'VN'
    }, {
        name: 'Virgin Islands, British',
        code: 'VG'
    }, {
        name: 'Virgin Islands, U.S.',
        code: 'VI'
    }, {
        name: 'Wallis and Futuna',
        code: 'WF'
    }, {
        name: 'Western Sahara',
        code: 'EH'
    }, {
        name: 'Yemen',
        code: 'YE'
    }, {
        name: 'Zambia',
        code: 'ZM'
    }, {
        name: 'Zimbabwe',
        code: 'ZW'
    }];
});
'use strict';

angular.module('MetronicApp').controller('UserProfileController', function ($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
        Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu 
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;
});
'use strict';

var TableAjax = function () {

    var initPickers = function initPickers() {
        //init date pickers
        $('.date-picker').datepicker({
            rtl: App.isRTL(),
            autoclose: true
        });
    };

    var handleRecords = function handleRecords() {

        var grid = new Datatable();

        grid.init({
            src: $("#datatable_ajax"),
            onSuccess: function onSuccess(grid) {
                // execute some code after table records loaded
            },
            onError: function onError(grid) {
                // execute some code on network or other general error  
            },
            loadingMessage: 'Loading...',
            dataTable: { // here you can define a typical datatable settings from http://datatables.net/usage/options 

                // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/scripts/datatable.js). 
                // So when dropdowns used the scrollable div should be removed. 
                //"dom": "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>",

                "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

                "lengthMenu": [[10, 20, 50, 100, 150, -1], [10, 20, 50, 100, 150, "All"] // change per page values here
                ],
                "pageLength": 10, // default record count per page
                "ajax": {
                    "url": "demo/table_ajax.php" },
                "order": [[1, "asc"]] // set first column as a default sort by asc
            }
        });

        // handle group actionsubmit button click
        grid.getTableWrapper().on('click', '.table-group-action-submit', function (e) {
            e.preventDefault();
            var action = $(".table-group-action-input", grid.getTableWrapper());
            if (action.val() != "" && grid.getSelectedRowsCount() > 0) {
                grid.setAjaxParam("customActionType", "group_action");
                grid.setAjaxParam("customActionName", action.val());
                grid.setAjaxParam("id", grid.getSelectedRows());
                grid.getDataTable().ajax.reload();
                grid.clearAjaxParams();
            } else if (action.val() == "") {
                App.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'Please select an action',
                    container: grid.getTableWrapper(),
                    place: 'prepend'
                });
            } else if (grid.getSelectedRowsCount() === 0) {
                App.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'No record selected',
                    container: grid.getTableWrapper(),
                    place: 'prepend'
                });
            }
        });
    };

    return {

        //main function to initiate the module
        init: function init() {

            initPickers();
            handleRecords();
        }

    };
}();