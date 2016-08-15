(function() {
  
  angular
    .module('meanApp')
    .controller('dashboardCtrl', dashboardCtrl);

    dashboardCtrl.$inject = ['$location','authentication'];
    function dashboardCtrl ($location, authentication) {
        console.log('Dashboard controller is running');
        
        var vm = this;
        vm.isLoggedIn = authentication.isLoggedIn();
        vm.currentUser = authentication.currentUser();
        
        
//        $('#calendar').fullCalendar({
//            // put your options and callbacks here
//        });
        
    }    

})();