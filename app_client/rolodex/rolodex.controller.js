(function() {
  
  angular
    .module('meanApp')
    .controller('rolodexCtrl', rolodexCtrl);

  rolodexCtrl.$inject = ['$location', 'meanData', '$route'];
  function rolodexCtrl($location, meanData, $route) {
    var vm = this;

    vm.contacts = {};
      
    meanData.getRolodex()
        .success(function(data) {
            vm.contacts = data;
            //$('#example').DataTable();
        })
        .error(function (e) {
            console.log(e);
        });
    
    vm.onSubmit = function () {
        console.log('Submitting contact ' + vm.contact.name);
        meanData.saveContact(vm.contact)
        .error(function(e){
            console.log(e);
        })
        .then(function(){
            $route.reload();
        });
    };

    
  }

})();