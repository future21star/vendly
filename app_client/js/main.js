/***
 Metronic AngularJS App Main Script
 ***/

var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    //"angular-sir-trevor",
    "xeditable"
]);

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
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
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
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
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
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
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
    // Dashboard
    .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/ven/dashboard.html",
            data: { pageTitle: 'Dashboard' },
            // controller: "DashboardController",
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
        // Finances - Overview
        .state('fin_overview', {
            url: "/finance/overview",
            templateUrl: "views/ven/finances/overview.html",
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
    // Venue & Vendor Account Settings Page
    .state('ven_account', {
            url: "/account/settings",
            templateUrl: "views/ven/account/settings.html",
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
        // Employee Settings Page
        .state('employees', {
            url: "/account/employees",
            templateUrl: "views/ven/account/employees.html",
            data: { pageTitle: 'Employees' },
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
        // Preferred Businesses Settings Page
        .state('preferred_business', {
            url: "/account/preferred",
            templateUrl: "views/ven/account/preferred_business.html",
            data: { pageTitle: 'Preferred Businesses' },
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
        // Payment Settings Page
        .state('payments', {
            url: "/account/payments",
            templateUrl: "views/ven/account/payments.html",
            data: { pageTitle: 'Payments' },
            controller: "PaymentPageController",
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
        // Venue & Vendor Notifications Page
        .state('ven_notifications', {
            url: "/account/notifications",
            templateUrl: "views/ven/account/notifications.html",
            data: { pageTitle: 'Notifications' },
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
            templateUrl: "views/ven/settings/business.html",
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


    // Event Planner Specific Controllers //
    // Dashboard
    .state('plan_dashboard', {
            url: "/dashboard-plan",
            templateUrl: "views/plan/dashboard.html",
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
                            'js/controllers/DashboardController.js',
                        ]
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
        // Finances
        .state('finances', {
            url: "/finances",
            templateUrl: "views/plan/finances.html",
            data: { pageTitle: 'Finances' },
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
        // Account Settings Page
        .state('account', {
            url: "/settings/account",
            templateUrl: "views/plan/settings/account.html",
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
        // Planner Notifications Page
        .state('plan_notifications', {
            url: "/settings/notifications",
            templateUrl: "views/plan/settings/notifications.html",
            data: { pageTitle: 'Notifications' },
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