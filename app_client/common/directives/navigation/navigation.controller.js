(function () {

  angular
    .module('meanApp')
    .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location','authentication'];
  function navigationCtrl($location, authentication) {
    var vm = this;

    vm.isLoggedIn = authentication.isLoggedIn();

    vm.currentUser = authentication.currentUser();
      
    $('.registerButton').click(function(){
        $('#loginModal').modal('hide');
        $('#registerModal').modal('show');
    });

    $('.loginButton').click(function(){
        $('#registerModal').modal('hide');
        $('#loginModal').modal('show');
    });
      
    $(".dropdown-toggle").dropdown();
  }

})();