(function () {

  angular.module('meanApp', ['ngRoute']);

  function config ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .when('/dashboard', {
        templateUrl: 'dashboard/dashboard.view.html',
        controller: 'dashboardCtrl',
        controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl: '/auth/register/register.view.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: '/auth/login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .when('/logout', {
        templateUrl: '/auth/login/login.view.html',
        controller: 'logoutCtrl',
        controllerAs: 'vm'
      })
      .when('/profile', {
        templateUrl: '/profile/profile.view.html',
        controller: 'profileCtrl',
        controllerAs: 'vm'
      })
      .when('/rolodex', {
        templateUrl: '/rolodex/rolodex.view.html',
        controller: 'rolodexCtrl',
        controllerAs: 'vm'
      })
      .when('/calendar', {
        templateUrl: '/calendar/calendar.view.html',
        controller: 'calendarCtrl',
        controllerAs: 'vm'
      })
      .when('/booklet', {
        templateUrl: '/booklet/booklet.view.html',
        controller: 'bookletCtrl',
        controllerAs: 'vm'
      })
      .when('/contract', {
        templateUrl: '/contract/contract.view.html',
        controller: 'contractCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }

  function run($rootScope, $location, authentication) {
      $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
          if ($location.path() === '/' && authentication.isLoggedIn()) {
              $location.path('/dashboard');
          }
          
          if ($location.path() === '/profile' && !authentication.isLoggedIn()) {
              $location.path('/login');
          }
          
          if ($location.path() === '/' && !authentication.isLoggedIn()) {
              $location.path('/login');
          }
          
      });
  }
  
  angular
    .module('meanApp')
    .config(['$routeProvider', '$locationProvider', config])
    .run(['$rootScope', '$location', 'authentication', run]);

})();