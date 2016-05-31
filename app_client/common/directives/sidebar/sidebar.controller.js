(function () {

  angular
    .module('meanApp')
    .controller('sidebarCtrl', sidebarCtrl);

  sidebarCtrl.$inject = ['$location','authentication'];
  function sidebarCtrl($location, authentication) {
    var vm = this;

    vm.isLoggedIn = authentication.isLoggedIn();

    vm.currentUser = authentication.currentUser();
      
    $('.bar').css('visibility','hidden');
    
    function openNav() {
        document.getElementById("mySidenav").style.width = "40px";
        $('.leftnavicon').width('30px');
        $('.leftnavicon').height('30px');
        $('.leftnavicon').css('margin-bottom', '0px');
        
        $('.bar').css('visibility','hidden');
        $('#clockdiv').css('visibility','hidden');
    }

    function closeNav() {
        document.getElementById("mySidenav").style.width = "25px";
        $('.leftnavicon').width('15px');
        $('.leftnavicon').height('15px');
        $('.leftnavicon').css('margin-bottom', '15px');
        
        $('#clockdiv').css('visibility','hidden');
    }
    
    function fullOpenNav() {
        document.getElementById("mySidenav").style.width = "170px";
        $('.leftnavicon').width('30px');
        $('.leftnavicon').height('30px');
        
        $('.bar').css('visibility','visible');
        $('#clockdiv').css('visibility','visible');
    }
    
    $('.sidenav').hover(function() {
        if ($(this).width() < 40)
            openNav();   
    });
    
    $('.sidenav').mouseleave(function() {
        if ($(this).width() < 170)
            closeNav();
    });
    
    $('.sidenav').click(function() {
        if ($(this).width() < 170)
            fullOpenNav();
        else
            openNav();
    });


  }
    
    
})();