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
    
    loadRolodex = function () {
        meanData.getRolodex()
            .success(function(data) {
                $scope.clients = data;
                //$('#example').DataTable();
            })
            .error(function (e) {
                console.log(e);
            });
    };
    
    loadRolodex();
      
    $scope.onSubmit = function () {
        $scope.contact.name = $scope.firstname + ' ' + $scope.lastname;
        console.log('Submitting contact ' + $scope.contact.name);
        meanData.saveContact($scope.contact)
        .error(function(e){
            console.log(e);
        })
        .then(function(){
            $('#add_client').modal('hide');
            loadRolodex();
        });
    };
    
}]);
