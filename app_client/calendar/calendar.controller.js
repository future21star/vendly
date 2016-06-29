(function() {
  
  angular
    .module('meanApp')
    .controller('calendarCtrl', calendarCtrl);

  calendarCtrl.$inject = ['$location', 'meanData', '$route'];
  function calendarCtrl($location, meanData, $route) {
    var vm = this;

    vm.events = {};
      
    meanData.getCalendar()
    .success(function(data) {
        $('#calendar').fullCalendar({
            events: data
        });
        vm.events = data;
    })
    .error(function (e) {
        console.log(e);
    });
      
    vm.onSubmit = function () {
        console.log('Submitting events ' + vm.event.title);
        meanData.saveEvent(vm.event)
        .error(function(e){
            console.log(e);
        })
        .then(function(){
            $route.reload();
        });
    };
      
    
  }

})();