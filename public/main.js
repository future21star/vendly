$(function() {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        var href = $(e.target).attr('href');
        var $curr = $(".checkout-bar  a[href='" + href + "']").parent();

        $('.checkout-bar li').removeClass();

        $curr.addClass("active");
        $curr.prevAll().addClass("visited");

    });
    
    $('#continue').click(function(e) {
        var href = $('form > div.active').attr('href');
        var $curr = $(".checkout-bar  a[href='" + href + "']").parent();

        $('.checkout-bar li').removeClass();

        $curr.addClass("active");
        $curr.prevAll().addClass("visited");
        
        $('form > div.active').hide("slide", { direction: "left" }, function() {
            $('form > div.active').next().show("slide", { direction: "right" });
        });
    });
    
    $('#myModal').modal('show');
});