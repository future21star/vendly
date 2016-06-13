(function() {
  
  angular
    .module('meanApp')
    .controller('rolodexCtrl', rolodexCtrl);

  rolodexCtrl.$inject = ['$location', 'meanData'];
  function rolodexCtrl($location, meanData) {
    var vm = this;

    vm.contact = {
      name : "",
      email : ""
    };
      
    vm.onSubmit = function () {
        console.log('Submitting contact ' + vm.contact.name);
        meanData.saveContact(vm.contact)
        .error(function(e){
            console.log(e);
        });
    };

//    meanData.getRolodex()
//      .success(function(data) {
//        vm.user = data;
//      })
//      .error(function (e) {
//        console.log(e);
//      });
      
      
      
    $('#example').DataTable();
      
      
      
      
      
      
    // delete below  
//    var vm = this;
//      
//    vm.credentials = {
//      name : "",
//      email : "",
//      password : "",
//      usertype : ""
//    };
//      
//    vm.onSubmit = function () {
//      console.log('Submitting registration');
//      authentication
//        .register(vm.credentials)
//        .error(function(err){
//          alert(err);
//        })
//        .then(function(){
//          $location.path('profile');
//        });
//    };
      
  }

})();