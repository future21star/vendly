(function() {
  
  angular
    .module('meanApp')
    .controller('rolodexCtrl', rolodexCtrl);

  rolodexCtrl.$inject = ['$location', 'meanData'];
  function rolodexCtrl($location, meanData) {
    var vm = this;

//    vm.user = {};
//
//    meanData.getRolodex()
//      .success(function(data) {
//        vm.user = data;
//      })
//      .error(function (e) {
//        console.log(e);
//      });
      
    $('#example').DataTable();
  }

})();