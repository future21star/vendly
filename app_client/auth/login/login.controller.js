(function () {

  angular
  .module('meanApp')
  .controller('loginCtrl', loginCtrl)
  .controller('logoutCtrl', logoutCtrl);

  loginCtrl.$inject = ['$location', 'authentication'];
  function loginCtrl($location, authentication) {
    var vm = this;

    vm.credentials = {
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      authentication
        .login(vm.credentials)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $location.path('profile');
        });
    };

  }
    
  logoutCtrl.$inject = ['$location', 'authentication'];
  function logoutCtrl($location, authentication) {
      authentication.logout();
  }

})();