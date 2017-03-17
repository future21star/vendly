angular.module('MetronicApp').controller('RolodexController', ['$rootScope', '$scope', 'settings', 'meanData', function($rootScope, $scope, settings, meanData) {
    $scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
    
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

    $scope.contact = {};
    $scope.onContactSubmit = function () {
        $scope.contact.name = $scope.firstname + ' ' + $scope.lastname;
        console.log('Submitting contact ' + $scope.contact.name);
        meanData.saveContact($scope.contact)
            .error(function(e){
                console.log(e);
            })
            .then(function(){
                $('#add_client').modal('hide');
                toastr.success('An invitation email has been sent to them to access your handbook.', 'Client Added');
                loadRolodex();
            });
    };
    
    $scope.viewContact = function(client) {
        $scope.viewingClient = client
    };
    
    $('#viewfulldetails').click(function () {
        $('.modal-backdrop').remove();
    });

    // Date toggle current and past customers
    var currentClients = function(wedding, today) {
        return wedding >= today;
    };
    var pastClients = function(wedding, today) {
        return wedding < today;
    };
    $scope.dateFilterFunction = currentClients;
    $scope.dateFilter = function (client) {
        return $scope.dateFilterFunction(new Date(client.weddingdate).getDate(), new Date().getDate());
    };
    $scope.toggleCurrentClients = function () {
        if ($scope.dateFilterFunction === pastClients)
            $scope.dateFilterFunction = currentClients;
        else
            $scope.dateFilterFunction = pastClients;
    };

    ComponentsDateTimePickers.init(); // init todo page
}]);
