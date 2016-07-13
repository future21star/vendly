(function () {
  
  angular
    .module('meanApp')
    .controller('bookletCtrl', bookletCtrl);

  bookletCtrl.$inject = ['$location', 'meanData', '$route', '$scope'];
  function bookletCtrl($location, meanData, $route, $scope) {
        var vm = this;
        vm.booklets = {};
        vm.booklet = {};
      
        meanData.getBooklets()
            .success(function(data) {
                vm.booklets = data;
            })
            .error(function (e) {
                console.log(e);
            });
      
        var fbTemplate = document.getElementById('fb-template');
        var renderedContainer = document.getElementById('rendered-form');
        $(fbTemplate).formBuilder();

        $(fbTemplate).bind("change", function(e) {
            $(fbTemplate).formRender({
              container: renderedContainer
            });
        });
      
      $('#newbooklet').click(function() {
          $('#newbookletmodal').modal();           
      });
      
      $(document).on('click', '.openBooklet', function() {
          $('#modalTitle').html($(this).parent().siblings().first().html());

          $('#render').text($(this).next().text());
          
          var fbTemplate = document.getElementById('render');
          $(fbTemplate).formRender();

          $('#openbookletmodal').modal();
      });
      
      $('.form-builder-save').click(function() {
          $('.view-data').click();
          vm.booklet.content = $('code').text();
          
          console.log('Submitting booklet ' + vm.booklet.title);
          meanData.saveBooklet(vm.booklet)
            .error(function(e){
                console.log(e);
            })
            .then(function(){
                $route.reload();
            });
      });
      
  }

})();