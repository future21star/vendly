/* Setup general page controller */
angular.module('MetronicApp').controller('GeneralPageController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {
    	// initialize core components
    	App.initAjax();

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);
angular.module('MetronicApp').config(function($window) {
    $window.Stripe.setPublishableKey('pk_test_iCItT9AHVuBcIZipWBVAVcZw');
});
angular.module('MetronicApp', ['angularPayments'])
    .controller('paymentController', function($scope){
        $scope.stripeCallback = function (code, result) {
			if (result.error) {
				window.alert('it failed! error: ' + result.error.message);
			} else {
				window.alert('success! token: ' + result.id);
			}
		};
    });