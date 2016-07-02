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
              alert('Error: ' + err.message);
            })
            .then(function(){
              $location.path('profile');
            });
        };

        $('.registerButton').click(function(){
            $('#loginModal').modal('hide');
            $('#registerModal').modal('show');
        });
        
        $('.loginButton').click(function(){
            $('#registerModal').modal('hide');
            $('#loginModal').modal('show');
        });
        
        $('#loginModal').modal('show');

    }
    
    logoutCtrl.$inject = ['$location', 'authentication'];
    function logoutCtrl($location, authentication) {
        authentication.logout();
    }

})();