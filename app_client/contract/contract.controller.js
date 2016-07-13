(function () {
  
  angular
    .module('meanApp')
    .controller('contractCtrl', contractCtrl);

  contractCtrl.$inject = ['$location', 'meanData', '$route', '$scope'];
  function contractCtrl($location, meanData, $route, $scope) {
    var vm = this;
  }

})();