var Dashboard = function() {

    return {

        initMorisCharts: function() {
          if (Morris.EventEmitter && $('#sales_statistics').size() > 0) {
              dashboardMainChart = Morris.Area({
                  element: 'sales_statistics',
                  padding: 0,
                  behaveLikeLine: true,
                  gridEnabled: false,
                  gridLineColor: false,
                  axes: false,
                  fillOpacity: .55,
                  data: [{
                      period: '2014 Q2',
                      profit: 875
                  }, {
                      period: '2014 Q3',
                      profit: 690
                  }, {
                      period: '2014 Q4',
                      profit: 900
                  }, {
                      period: '2015 Q1',
                      profit: 400
                  }, {
                      period: '2015 Q2',
                      profit: 1350
                  }, {
                      period: '2015 Q3',
                      profit: 740
                  }, {
                      period: '2015 Q4',
                      profit: 670
                  }, {
                      period: '2016 Q1',
                      profit: 800
                  }],
                  lineColors: ['#7FA8D7'],
                  xkey: 'period',
                  ykeys: ['profit'],
                  labels: ['Profit'],
                  pointSize: 4,
                  lineWidth: 1,
                  hideHover: 'auto',
                  resize: true,
                  preUnits: '$'
              });

          }

          if (Morris.EventEmitter && $('#revenue_area_chart').size() > 0) {
              dashboardMainChart = Morris.Area({
                  element: 'revenue_area_chart',
                  padding: 0,
                  behaveLikeLine: true,
                  gridEnabled: false,
                  gridLineColor: false,
                  axes: false,
                  fillOpacity: .55,
                  data: [{
                      period: '2014 Q2',
                      revenue: 875
                  }, {
                      period: '2014 Q3',
                      revenue: 690
                  }, {
                      period: '2014 Q4',
                      revenue: 900
                  }, {
                      period: '2015 Q1',
                      revenue: 400
                  }, {
                      period: '2015 Q2',
                      revenue: 1350
                  }, {
                      period: '2015 Q3',
                      revenue: 740
                  }, {
                      period: '2015 Q4',
                      revenue: 670
                  }, {
                      period: '2016 Q1',
                      revenue: 800
                  }],
                  lineColors: ['#7FA8D7'],
                  xkey: 'period',
                  ykeys: ['revenue'],
                  labels: ['Revenue'],
                  pointSize: 4,
                  lineWidth: 1,
                  hideHover: 'auto',
                  resize: true,
                  preUnits: '$'
              });

          }

          if (Morris.EventEmitter && $('#payments_due_pie').size() > 0) {
              // Use Morris.Area instead of Morris.Line
              dashboardMainChart = Morris.Donut({
                  element: 'payments_due_pie',
                  xkey: 'period',
                  ykeys: ['profit'],
                  labels: ['Profit'],
                  data: [{
                    label: 'Due Next Month',
                    value: 879.01
                  }, {
                    label: 'Due This Month',
                    value: 1253.34
                  }, {
                    label: 'Payment Overdue',
                    value: 305.56
                  }],
                  colors: ['#BFBFBF', '#7FA8D7', '#E26A6A'],
                  resize: true,
                  formatter: function (y, data) { return '$' + y }
              });
          }

          if (Morris.EventEmitter && $('#expenses_bar_chart').size() > 0) {
              // Use Morris.Area instead of Morris.Line
              dashboardMainChart = Morris.Bar({
                  element: 'expenses_bar_chart',
                  xkey: 'month',
                  ykeys: ['expenses'],
                  labels: ['Expenses'],
                  data: [{
                      month: 'March \'16',
                      expenses: 875
                  }, {
                      month: 'April \'16',
                      expenses: 690
                  }, {
                      month: 'May \'16',
                      expenses: 900
                  }, {
                      month: 'June \'16',
                      expenses: 400
                  }, {
                      month: 'July \'16',
                      expenses: 670
                  }, {
                      month: 'August \'16',
                      expenses: 800
                  }],
                  barColors: ['#E26A6A'],
                  hideHover: 'auto',
                  resize: true
              });
          }
        },

        initChat: function() {
            var cont = $('#chats');
            var list = $('.chats', cont);
            var form = $('.chat-form', cont);
            var input = $('input', form);
            var btn = $('.btn', form);

            var handleClick = function(e) {
                e.preventDefault();

                var text = input.val();
                if (text.length == 0) {
                    return;
                }

                var time = new Date();
                var time_str = (time.getHours() + ':' + time.getMinutes());
                var tpl = '';
                tpl += '<li class="out">';
                tpl += '<img class="avatar" alt="" src="' + Layout.getLayoutImgPath() + 'avatar1.jpg"/>';
                tpl += '<div class="message">';
                tpl += '<span class="arrow"></span>';
                tpl += '<a href="#" class="name">Bob Nilson</a>&nbsp;';
                tpl += '<span class="datetime">at ' + time_str + '</span>';
                tpl += '<span class="body">';
                tpl += text;
                tpl += '</span>';
                tpl += '</div>';
                tpl += '</li>';

                var msg = list.append(tpl);
                input.val("");

                var getLastPostPos = function() {
                    var height = 0;
                    cont.find("li.out, li.in").each(function() {
                        height = height + $(this).outerHeight();
                    });

                    return height;
                }

                cont.find('.scroller').slimScroll({
                    scrollTo: getLastPostPos()
                });
            }

            $('body').on('click', '.message .name', function(e) {
                e.preventDefault(); // prevent click event

                var name = $(this).text(); // get clicked user's full name
                input.val('@' + name + ':'); // set it into the input field
                App.scrollTo(input); // scroll to input if needed
            });

            btn.click(handleClick);

            input.keypress(function(e) {
                if (e.which == 13) {
                    handleClick(e);
                    return false; //<---- Add this line
                }
            });
        },

        init: function() {
            this.initChat();
            this.initMorisCharts();
        }
    };

}();

if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        Dashboard.init(); // init metronic core componets
    });
}
