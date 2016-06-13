(function() {
  
  angular
    .module('meanApp')
    .controller('rolodexCtrl', rolodexCtrl);

  rolodexCtrl.$inject = ['$location', 'meanData'];
  function rolodexCtrl($location, meanData) {
    var vm = this;

    vm.contacts = {};
      
    meanData.getRolodex()
    .success(function(data) {
        vm.contacts = data;
    })
    .error(function (e) {
        console.log(e);
    });
      
    vm.onSubmit = function () {
        console.log('Submitting contact ' + vm.contact.name);
        meanData.saveContact(vm.contact)
        .error(function(e){
            console.log(e);
        });
    };

    $('#example').DataTable();
  }

})();