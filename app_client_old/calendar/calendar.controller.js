(function () {
  
  angular
    .module('meanApp')
    .controller('calendarCtrl', calendarCtrl);

  calendarCtrl.$inject = ['$location', 'meanData', '$route', '$scope'];
  function calendarCtrl($location, meanData, $route, $scope) {
    var vm = this;
    vm.event = {};

    meanData.getCalendar()
        .success(function(data) {
            $('#calendar').fullCalendar({
                events: data,
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                timezone: 'local',
                eventClick: function(event, jsEvent, view) {
                    $('#modalTitle').html(event.title);
                    $('#eventtitle').val(event.title);
                    $('#eventstart').val(event.start.format('LLL'));
                    $('#eventend').val(event.end.format('LLL'));
//                    $('#modalBody').html(event.description);

                    $('#fullCalModal').modal();
                }
            });
        })
        .error(function (e) {
            console.log(e);
        });
      
    $('#neweventbutton').click(function(){
        $('#neweventmodal').modal();
    });
    
    $('#starttimepicker')
        .datetimepicker()
        .on("dp.change", function() {
            vm.event.start = $('#starttimepicker > input').val();
        });
      
    $('#endtimepicker')
        .datetimepicker()
        .on("dp.change", function() {
            vm.event.start = $('#endtimepicker > input').val();
        });
      
    vm.onSubmit = function () {
        console.log('Submitting events ' + vm.event.title);
        vm.event.start = moment.utc($("#starttimepicker").data("DateTimePicker").date()).valueOf();
        vm.event.end = moment.utc($("#endtimepicker").data("DateTimePicker").date()).valueOf();
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