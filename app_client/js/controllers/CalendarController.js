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

    $scope.comingevents = {};
    var loadCalendar = function() {

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
                        // $('#modalTitle').html(event.title);
                        $('#eventId').val(event._id);
                        $('#eventtitle').val(event.title);
                        $('#description').val(event.description);
                        $('#eventstartpicker').data("DateTimePicker").date(event.start._d);
                        $('#eventendpicker').data("DateTimePicker").date(event.end._d);

                        $('#edit_event').modal();
                    }
                });

                // pulling out dates after today
                $scope.comingevents = $.grep(data, function(e){
                    var now = new Date().getTime();
                    var thisdate = new Date(e.start).getTime();
                    return thisdate > now;
                });

                // sorting dates in order
                $scope.comingevents.sort(function(x, y){
                    return new Date(x.start).getTime() - new Date(y.start).getTime();
                });

                // formatting the dates
                $scope.comingevents.forEach(function(part, i, events) {
                    events[i].start = moment(events[i].start).format('MM/DD ha');
                });
            })
            .error(function (e) {
                console.log(e);
            });

    };
      
    $('#neweventbutton').click(function(){
        $('#neweventmodal').modal();
    });

    $('#eventstartpicker').datetimepicker();
    $('#eventendpicker').datetimepicker();

    $('#starttimepicker').datetimepicker();
    $('#endtimepicker').datetimepicker();

    loadCalendar();
      
    $scope.onAddSubmit = function () {
        console.log('Submitting event ' + $scope.event.title);
        $scope.event.start = moment.utc($("#starttimepicker").data("DateTimePicker").date()).valueOf();
        $scope.event.end = moment.utc($("#endtimepicker").data("DateTimePicker").date()).valueOf();
        meanData.saveEvent($scope.event)
            .success(function () {
                toastr.success('Event added successfully.', 'Event Added');
                $('#calendar').fullCalendar( 'destroy' );
                loadCalendar();
                $('#add_event').modal('hide');
            })
            .error(function(e){
                console.log(e);
            });
    };

    $scope.event = {};
    $scope.onEditSubmit = function () {
        $scope.event.title = $('#eventtitle').val();
        console.log('Editing event ' + $scope.event.title);
        $scope.event.description = $('#description').val();
        $scope.event.start = moment.utc($("#eventstartpicker").data("DateTimePicker").date()).valueOf();
        $scope.event.end = moment.utc($("#eventendpicker").data("DateTimePicker").date()).valueOf();
        $scope.event._id = $('#eventId').val();
        meanData.updateEvent($scope.event)
            .error(function (e) {
                console.log(e);
            })
            .success(function () {
                toastr.success('Event updated successfully.', 'Event Updated');
                $('#calendar').fullCalendar( 'destroy' );
                $('#edit_event').modal('hide');
                loadCalendar();
            })
    };


}]);
