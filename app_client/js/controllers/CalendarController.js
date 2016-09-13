/* Setup calendar controller */
angular.module('MetronicApp')
.controller('CalendarController', ['$rootScope', '$scope', 'settings', 'meanData', function($rootScope, $scope, settings, meanData) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

    });
    
    var vm = this;
    vm.event = {};
    
    loadCalendar = function() {

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
    
    };
      
    $('#neweventbutton').click(function(){
        $('#neweventmodal').modal();
    });
    
    $('#starttimepicker')
        .datetimepicker()
        .on("dp.change", function() {
        // TODO - come back and fix these
            //$scope.event.start = $('#starttimepicker > input').val();
        });
      
    $('#endtimepicker')
        .datetimepicker()
        .on("dp.change", function() {
            //$scope.event.end = $('#endtimepicker > input').val();
        });
    
    loadCalendar();
      
    $scope.onAddSubmit = function () {
        console.log('Submitting event ' + $scope.event.title);
        $scope.event.start = moment.utc($("#starttimepicker").data("DateTimePicker").date()).valueOf();
        $scope.event.end = moment.utc($("#endtimepicker").data("DateTimePicker").date()).valueOf();
        meanData.saveEvent($scope.event)
            .error(function(e){
                console.log(e);
            })
            .then(function(){
                $('#add_event').modal('hide');
                loadCalendar();
            });
    };
   

}]);
