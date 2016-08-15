angular.module('MetronicApp').controller('RolodexController', ['$rootScope', '$scope', 'settings', 'meanData', function($rootScope, $scope, settings, meanData) {
    $scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
    
    var vm = this;

    $scope.clients = {};
      
    meanData.getRolodex()
        .success(function(data) {
            $scope.clients = data;
            //$('#example').DataTable();
        })
        .error(function (e) {
            console.log(e);
        });
    
//    vm.onSubmit = function () {
//        console.log('Submitting contact ' + vm.contact.name);
//        meanData.saveContact(vm.contact)
//        .error(function(e){
//            console.log(e);
//        })
//        .then(function(){
//            $route.reload();
//        });
//    };
      
//    $('#newcontactbutton').click(function(){
//        $('#newcontactmodal').modal();
//    });
    
}]);
