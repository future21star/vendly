angular.module('MetronicApp').controller('DocumentsController', ['$rootScope', '$scope', 'settings', 'meanData', 'amazons3',
function ($rootScope, $scope, settings, meanData, amazons3) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    $scope.docs = {};

    var loadDocs = function () {
        meanData.getDocuments()
            .success(function (data) {
                $scope.documents = data;
            })
            .error(function (e) {
                console.log(e);
            });
    };

    loadDocs();

    $scope.uploadDocument = function () {
        var file = $('#newDoc')[0].files[0];
        if (!file) return;

        amazons3.uploadFile({'file': file, 'name': $scope.document.filename});

        $scope.document.uploaded = moment.utc();
        meanData.saveDocument($scope.document)
            .error(function(e){console.log(e)})
            .success(function () {
                $('#add_doc').modal('hide');
                toastr.success('Document was added successfully.', 'Document Added');
                loadDocs();
            });

    };

    $scope.viewDocument = function(document) {
        window.open('https://ourstory-vendly.s3.amazonaws.com/' + document._owner + '/' + document.name);
    };

}]);
