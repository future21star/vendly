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
    
    
    /**
     * Countdown clock
     */
    
    
    
    
    /**
     * Side nav
     */
    
    
    function openNav() {
        document.getElementById("mySidenav").style.width = "60px";
        $('.leftnavicon').width('50px');
        $('.leftnavicon').height('50px');
    }

    function closeNav() {
        document.getElementById("mySidenav").style.width = "25px";
        $('.leftnavicon').width('15px');
        $('.leftnavicon').height('15px');
        
        $('#clockdiv').slideUp();
    }
    
    function fullOpenNav() {
        document.getElementById("mySidenav").style.width = "250px";
        $('.leftnavicon').width('50px');
        $('.leftnavicon').height('50px');
        
        $('#clockdiv').slideDown();
    }
    
    $('.sidenav').hover(function() {
        if ($(this).width() < 60)
            openNav();   
    });
    
    $('.sidenav').mouseleave(function() {
        if ($(this).width() < 250)
            closeNav();
    });
    
    $('.sidenav').click(function() {
        if ($(this).width() < 250)
            fullOpenNav();
        else
            closeNav();
    });
});