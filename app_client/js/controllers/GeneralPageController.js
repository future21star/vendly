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

.controller('GeneralPageController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;


        $scope.editorContent = {
            "data": [{
                "type": "text",
                "data": {
                    "text": "<p align='center'>Start creating your event handbook!</p>",
                    "format": "html"
                }
            }]
        };

    });

}]);
