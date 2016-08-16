/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
<<<<<<< HEAD
    "angular-sir-trevor"
=======
    "xeditable"
>>>>>>> handbook-edits
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
          $window.localStorage.removeItem('mean-token');
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

        return {
          getProfile : getProfile,
          getRolodex : getRolodex,
          saveContact: saveContact,
          getCalendar: getCalendar,
          saveEvent  : saveEvent,
          getBooklets: getBooklets,
          saveBooklet: saveBooklet
        };
    }
]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/404");

    $stateProvider

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

        // Dashboard
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html",
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
            templateUrl: "views/venue_details.html",
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
            templateUrl: "views/vendor_details.html",
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

        // Calendar
        .state('calendar', {
            url: "/calendar",
            templateUrl: "views/calendar.html",
            data: {pageTitle: 'Calendar'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                          '../assets/global/plugins/moment.min.js',
                          '../assets/global/plugins/fullcalendar/fullcalendar.min.js',
                          '../assets/global/plugins/jquery-ui/jquery-ui.min.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Client Rolodex
        .state('rolodex', {
            url: "/rolodex",
            templateUrl: "views/rolodex.html",
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
            templateUrl: "views/handbooks.html",
            data: {pageTitle: 'Handbooks'},
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
            url: "/handbook_editor",
            templateUrl: "views/handbook_editor.html",
            data: {pageTitle: 'Handbook Editor'},
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
            templateUrl: "views/settings/account.html",
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
        // Payment Settings Page
        .state('payments', {
            url: "/settings/payments",
            templateUrl: "views/settings/payments.html",
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
        // Notifications Page
        .state('notifications', {
            url: "/settings/notifications",
            templateUrl: "views/settings/notifications.html",
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
            url: "/settings/invoice",
            templateUrl: "views/settings/invoice.html",
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
        // 404 Page
        .state('404', {
            url: "/404",
            templateUrl: "views/404.html",
            data: {pageTitle: 'Something Went Wrong'},
            controller: "BlankController",
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

        // Blank Page
        .state('blank', {
            url: "/templates/blank",
            templateUrl: "views/templates/blank.html",
            data: {pageTitle: 'Blank Page Template'},
            controller: "BlankController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/BlankController.js'
                        ]
                    });
                }]
            }
        })

        // AngularJS plugins
        .state('fileupload', {
            url: "/templates/file_upload.html",
            templateUrl: "views/templates/file_upload.html",
            data: {pageTitle: 'AngularJS File Upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            '../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ]
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('uiselect', {
            url: "/templates/ui_select.html",
            templateUrl: "views/templates/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ]
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/UISelectController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/templates/ui_bootstrap.html",
            templateUrl: "views/templates/ui_bootstrap.html",
            data: {pageTitle: 'AngularJS UI Bootstrap'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Tree View
        .state('tree', {
            url: "/templates/tree",
            templateUrl: "views/templates/tree.html",
            data: {pageTitle: 'jQuery Tree View'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/jstree/dist/themes/default/style.min.css',

                            '../assets/global/plugins/jstree/dist/jstree.min.js',
                            '../assets/pages/scripts/ui-tree.min.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Form Tools
        .state('formtools', {
            url: "/templates/form_tools",
            templateUrl: "views/templates/form_tools.html",
            data: {pageTitle: 'Form Tools'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../assets/global/plugins/typeahead/typeahead.css',

                            '../assets/global/plugins/fuelux/js/spinner.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '../assets/global/plugins/typeahead/handlebars.min.js',
                            '../assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            '../assets/pages/scripts/components-form-tools-2.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Date & Time Pickers
        .state('pickers', {
            url: "/templates/pickers",
            templateUrl: "views/templates/pickers.html",
            data: {pageTitle: 'Date & Time Pickers'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/templates/dropdowns",
            templateUrl: "views/templates/dropdowns.html",
            data: {pageTitle: 'Custom Dropdowns'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
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
                    }]);
                }]
            }
        })

        // Advanced Datatables
        .state('datatablesAdvanced', {
            url: "/templates/datatables/managed.html",
            templateUrl: "views/templates/datatables/managed.html",
            data: {pageTitle: 'Advanced Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',

                            '../assets/pages/scripts/table-datatables-managed.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesAjax', {
            url: "/templates/datatables/ajax.html",
            templateUrl: "views/templates/datatables/ajax.html",
            data: {pageTitle: 'Ajax Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/scripts/datatable.js',

                            'js/scripts/table-ajax.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/templates/profile/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/pages/css/profile.css',

                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/pages/scripts/profile.min.js',

                            'js/controllers/UserProfileController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/templates/profile/dashboard",
            templateUrl: "views/templates/profile/dashboard.html",
            data: {pageTitle: 'User Profile'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/templates/profile/account",
            templateUrl: "views/templates/profile/account.html",
            data: {pageTitle: 'User Account'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/templates/profile/help",
            templateUrl: "views/templates/profile/help.html",
            data: {pageTitle: 'User Help'}
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/templates/todo.html",
            data: {pageTitle: 'Todo'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/controllers/TodoController.js'
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
           // $location.path('/login');

            var creds = {
                email : "seth@vendly.com",
                password : "seth"
            };

            authentication
                .login(creds)
                .error(function(err){
                  alert('Error: ' + err.message);
                })
                .then(function(){
                  $location.path('dashboard');
                });
        }
    });

    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);
