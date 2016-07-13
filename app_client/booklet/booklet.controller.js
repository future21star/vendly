(function () {
  
  angular
    .module('meanApp')
    .controller('bookletCtrl', bookletCtrl);

  bookletCtrl.$inject = ['$location', 'meanData', '$route', '$scope'];
  function bookletCtrl($location, meanData, $route, $scope) {
      var vm = this;
      
      var fbTemplate = document.getElementById('fb-template');
      var renderedContainer = document.getElementById('rendered-form');
      $(fbTemplate).formBuilder();
      
      $(fbTemplate).bind("change", function(e) {
        $(fbTemplate).formRender({
          container: renderedContainer
        });
      });
  }

})();