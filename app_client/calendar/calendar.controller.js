(function () {
  
  angular
    .module('meanApp')
    .controller('calendarCtrl', calendarCtrl);

  calendarCtrl.$inject = ['$location', 'meanData', '$route', '$scope'];
  function calendarCtrl($location, meanData, $route, $scope) {
    var vm = this;

    meanData.getCalendar()
        .success(function(data) {
            $('#calendar').fullCalendar({
                events: data
            });
        })
        .error(function (e) {
            console.log(e);
        });
      
    this.picker = {
      date: new Date()
    };
      
    vm.openCalendar = function() {
        vm.picker.open = true;
    };
      
    vm.onSubmit = function () {
        alert(JSON.stringify(vm.event));
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