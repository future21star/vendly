/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "angular-sir-trevor",
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

        var isLoggedIn = function() {
          var token = getToken();
          var payload;

          if(token){
            payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);

            return payload.exp > Date.now() / 1000;
          } else {
            return false;
          }
        };

        var currentUser = function() {
          if(isLoggedIn()){
            var token = getToken();
            var payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            return {
              email : payload.email,
              name : payload.name
            };
          }
        };

        register = function(user) {
          return $http.post('/api/register', user).success(function(data){
            saveToken(data.token);
          });
        };

        login = function(user) {
          return $http.post('/api/login', user).success(function(data) {
            saveToken(data.token);
          });
        };

        logout = function() {
          clearToken();
        };

        return {
          currentUser : currentUser,
          saveToken : saveToken,
          getToken : getToken,
          isLoggedIn : isLoggedIn,
          register : register,
          login : login,
          logout : logout
        };
    }
]);

MetronicApp.service('meanData', ['$http', 'authentication',
    function ($http, authentication) {

        var getProfile = function () {
          return $http.get('/api/profile', {
            headers: {
              Authorization: 'Bearer '+ authentication.getToken()
            }
          });
        };

        var getRolodex = function () {
            return $http.get('/api/rolodex', {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                }
            });
        };

        var saveContact = function (contact) {
            return $http.post('/api/saveContact', contact, {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                }
            });
        };

        var getCalendar = function () {
            return $http.get('/api/calendar', {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                }
            });
        };

        var saveEvent = function (event) {
            return $http.post('/api/saveEvent', event, {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                }
            });
        };

        var getBooklets = function () {
            return $http.get('/api/booklets', {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                }
            });
        };

        var saveBooklet = function (booklet) {
            return $http.post('/api/saveBooklet', booklet, {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                }
            });
        };

        var updateBooklet = function (booklet) {
            return $http.put('/api/updateBooklet', booklet, {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                }
            });
        }
        
        var sendNewUserInviteEmail = function (user) {
            return $http.post('/api/sendNewUserInviteEmail', user, {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                }
            });
        };

        var sendEmail = function (email, subject, content) {
            return $http.post('/api/sendEmail', user, {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                }
            });
        };

        return {
          getProfile : getProfile,
          getRolodex : getRolodex,
          saveContact: saveContact,
          getCalendar: getCalendar,
          saveEvent  : saveEvent,
          getBooklets: getBooklets,
          saveBooklet: saveBooklet,
          updateBooklet: updateBooklet,
          sendNewUserInviteEmail: sendNewUserInviteEmail,
          sendEmail  : sendEmail
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
            data: {pageTitle: 'Login'},
            controller: "LoginController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Calendar'},
            controller: "CalendarController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Uploaded Documents'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })
        // Inbox
        .state('inbox', {
            url: "/inbox",
            templateUrl: "views/inbox.html",
            data: {pageTitle: 'Inbox'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Something Went Wrong'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Dashboard'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
        // Client Rolodex
        .state('rolodex', {
            url: "/rolodex",
            templateUrl: "views/ven/rolodex.html",
            data: {pageTitle: 'Rolodex'},
            controller: "RolodexController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Handbooks'},
            controller: "HandbookController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Client Details'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Handbook Editor'},
            controller: "HandbookController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Handbook Editor'},
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
            data: {pageTitle: 'Finances - Overview'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
        // Finances - Revenue
        .state('fin_revenue', {
            url: "/finance/revenue",
            templateUrl: "views/ven/finances/revenue.html",
            data: {pageTitle: 'Finances - Revenue'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
        // Finances - Expenses
        .state('fin_expenses', {
            url: "/finance/expenses",
            templateUrl: "views/ven/finances/expenses.html",
            data: {pageTitle: 'Finances - Expenses'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                          '../assets/global/plugins/morris/morris.css',
                          '../assets/global/plugins/morris/morris.js',
                          '../assets/global/plugins/morris/raphael-min.js',

                          '../assets/pages/scripts/dashboard.js',
                          '../assets/pages/scripts/charts-morris.js',
                          'js/controllers/GeneralPageController.js',
                          'js/controllers/RolodexController.js'
                        ]
                    });
                }]
            }
        })
        // Inventory
        .state('inventory', {
            url: "/inventory",
            templateUrl: "views/ven/inventory.html",
            data: {pageTitle: 'Inventory'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Account Settings'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Employees'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Preferred Businesses'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Payments'},
            controller: "PaymentPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Notifications'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Invoice'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Dashboard'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Venue Details'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Vendor Details'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Event Details'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Finances'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Account Settings'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
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
            data: {pageTitle: 'Notifications'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })
}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", "authentication", "$location", "editableOptions", function($rootScope, settings, $state, authentication, $location, editableOptions, theme) {
    $rootScope.$on('$locationChangeStart', function(event, nextRoute, currentRoute) {
        if (!authentication.isLoggedIn()) {
            // TODO fix this so it isn't logging in automatically
            $location.path('/login');

//            var creds = {
//                email : "seth@vendly.com",
//                password : "seth"
//            };

//            authentication
//                .login(creds)
//                .error(function(err){
//                  alert('Error: ' + err.message);
//                })
//                .then(function(){
//                  $location.path('dashboard');
//                });
        }

        if ($location.path() === '' && authentication.isLoggedIn()) {
            $location.path('/dashboard');
        }
    });

    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);
