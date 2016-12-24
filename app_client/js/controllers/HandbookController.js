angular.module('MetronicApp').controller('HandbookController', ['$rootScope', '$scope', '$stateParams', 'settings', 'meanData', function($rootScope, $scope, $stateParams, settings, meanData) {
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

    $scope.handbook = {};
    $scope.handbooks = {};
    var loadHandbooks = function () {
        meanData.getBooklets()
            .success(function(data) {
                $scope.handbooks = data;
                if ($stateParams.hasOwnProperty('handbookId')) {
                    $scope.handbook = $.grep(data, function(e){ return e._id == $stateParams.handbookId })[0];

                    formbuilder = new Formbuilder({
                        selector: '#formbuilder',
                        bootstrapData: JSON.parse($scope.handbook.content).fields
                    });

                    formbuilder.on('save', function(payload){
                        $scope.handbook.content = payload;
                        $scope.handbook.updated_date = moment.utc();
                        meanData.updateBooklet($scope.handbook)
                            .error(function(e){
                                console.log(e);
                            })
                            .then(function(){
                            });
                    });
                }
            })
            .error(function (e) {
                console.log(e);
            });
    };
    loadHandbooks();

    formbuilder.on('save', function(payload){
        $scope.handbook.content = payload;
        meanData.saveBooklet($scope.handbook)
            .error(function(e){
                console.log(e);
            })
            .then(function(){
            });
    });

    meanData.getActiveHandbook()
        .success(function(active_booklet) {
            $scope.active_booklet = active_booklet._id;
        })
        .error(function (e) {
            console.log(e);
        });

    $scope.setActiveBooklet = function (handbook) {
        meanData.setActiveHandbook(handbook)
            .success(function () {

            })
            .error(function (e) {
                console.log(e);
            });
    };
}]);
