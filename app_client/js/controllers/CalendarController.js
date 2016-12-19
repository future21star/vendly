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
                        // $('#modalTitle').html(event.title);
                        $('#eventId').val(event._id);
                        $('#eventtitle').val(event.title);
                        $('#description').val(event.description);
                        $('#eventstartpicker').data("DateTimePicker").date(event.start._d);
                        $('#eventendpicker').data("DateTimePicker").date(event.end._d);

                        $('#edit_event').modal();
                    }
                });

                $scope.comingevents = $.grep(data, function(e){
                    var now = new Date().getTime();
                    var thisdate = new Date(e.start).getTime();
                    return thisdate > now;
                });

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
            .error(function(e){
                console.log(e);
            })
            .then(function(){
                $('#add_event').modal('hide');
                // TODO - calendar reload not working
                loadCalendar();
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
            .then(function () {
                $('#edit_event').modal('hide');
                loadCalendar();
            })
    };


}]);
