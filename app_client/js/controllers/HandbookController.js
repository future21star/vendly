angular.module('MetronicApp').controller('HandbookController', ['$rootScope', '$scope', 'settings', 'meanData', function($rootScope, $scope, settings, meanData) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    var formbuilder = new Formbuilder({
        selector: '#formbuilder',
        bootstrapData: [{"label":"Section Break","field_type":"new_section_break","required":false,
            "field_options":{"description":"Description about this section."},"cid":"c8"}, {"label":"Wedding Date",
            "field_type":"date","required":true,"field_options":{"description":""},"cid":"c13"},
            {"label":"Which if the following do you want to include in your wedding?","field_type":"checkboxes",
                "required":true,"field_options":{"options":[{"label":"Unity Candle","checked":false},
                {"label":"Wedding cord/lasso","checked":false}],"include_other_option":true},"cid":"c17"}]
    });

    formbuilder.on('save', function(payload){
        console.log(payload);
    });
}]);
