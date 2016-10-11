/* Setup general page controller */
angular.module('MetronicApp')

.config(['sirTrevorServiceProvider', function(sirTrevorServiceProvider) {
    // set config
    sirTrevorServiceProvider.setConfig({
        "debug": false,
        "scribeDebug": false,
        "language": "en"
    });

    // set defaults
    sirTrevorServiceProvider.setDefaults({
        "iconUrl": "vendor/sir-trevor/src/icons/sir-trevor-icons.svg"
    });

    // set block options
    sirTrevorServiceProvider.setBlockOptions({
        /* put block options here */
    });
}])

.controller('GeneralPageController', ['$rootScope', '$scope', 'settings', 'meanData', function($rootScope, $scope, settings, meanData) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;


        $scope.editorContent = {
          "data": [{
              "type": "checkbox",
              "data": {
                  "text": "<p>Start creating your event handbook!</p>",
                  "format": "html"
              }
          }]
        };

    });

    $scope.handbook = {
      name: 'Untitled'
    };
    
    $scope.onNewProvilegeUserSubmit = function () {
        // save user data
        
        meanData.sendNewUserInviteEmail($scope.user)
            .error(function(e){
                console.log(e);
            })
            .then(function(){
                $('#add_privilege_user').modal('hide');
            });
    };

}]);
