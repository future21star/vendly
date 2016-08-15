angular.module('MetronicApp').controller('LoginController', ['$location', 'authentication', '$scope', '$rootScope',  function($location, authentication, $scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        
        
        
    });
  
    var vm = this;

    vm.credentials = {
        name : "",
        email : "",
        password : "",
        usertype : ""
    };

    vm.onSubmit = function () {
      authentication
        .login(vm.credentials)
        .error(function(err){
          alert('Error: ' + err.message);
        })
        .then(function(){
          $location.path('dashboard');
        });
    };


//    vm.onRegisterSubmit = function () {
//        console.log('Submitting registration');
//        authentication
//            .register(vm.credentials)
//            .error(function(err){
//                alert(err);
//            })
//            .then(function(){
//                $location.path('profile');
//            });
//    };
//
//    $('.registerButton').click(function(){
//        $('#loginModal').modal('hide');
//        $('#registerModal').modal('show');
//    });
//
//    $('.loginButton').click(function(){
//        $('#registerModal').modal('hide');
//        $('#loginModal').modal('show');
//    });

    $('#loginModal').modal({
        backdrop: 'static',
        keyboard: false
    })
    .modal('show');
    
}]);