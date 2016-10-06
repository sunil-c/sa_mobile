(function () {
    'use strict';

    console.log('starting script');

    var gServicePath = "",
        gAuthPath = "",
        gCompanyID = 0,
        gRenderedFilters = false;

    if (window.location.host.indexOf('localhost') >= 0) {           // running from localhost
        gServicePath = 'http://localhost:25004/api';
        gAuthPath = 'http://localhost:25004/api';
    }
    else {                                                // on web server
        gAuthPath = '/services/api';
        gServicePath = '/services/api';
    }
    //initialize the authorization object
    var authorize = new Authorize({}, gAuthPath);
    //initialize the Util object
    var util = new Util();
    var colRpt = new ColumnReport();
    var rowRpt = new RowReport();
    var chartRpt = new ChartReport();
    var chartInstance = {};

    Handlebars.registerHelper('eq', function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });

    var availRoute = function () {
        console.log('availRoute');
        if (authorize.isAuthorized()) {
            getAvailableReports();
        }
        else {
            //tell authorize what to trigger after login
            util.showSection('login');
        }
    };
    var reportRoute = function (reportID) {
        console.log('getReportRoute');
        if (authorize.isAuthorized()) {
            getReport(reportID);
        }
        else {
            //tell authorize what to trigger after login
            util.showSection('login');
        }
    };
    var loginRoute = function () {
        console.log('loginRoute');

        if (!authorize.isAuthorized()) {
            //call authorize code here
            authorize.login($('#userNameInp').val, $('#passwordInp').val, getAvailableReports);
        }
    };

    var getOrgHierarchy = function (callBack) {
        var data = {};
        var url = "/data/org-hierarchy.json";
        $.ajax({
            method: "GET",
            url: url,
            data: data,
            dataType: "script",
            beforeSend: function () {

            },
            success: function (data) {
                data = JSON.parse(data);
                var func = callBack;
                func.call(null, data);
            },
            error: function (err) {
                console.log("error: " + err);
            }
        });
    };

    var getTimeOptions = function (callBack) {
        var data = {};
        var url = "/data/time-hierarchy.json";
        $.ajax({
            method: "GET",
            url: url,
            data: data,
            dataType: "script",
            beforeSend: function () {

            },
            success: function (data) {
                data = JSON.parse(data);
                var func = callBack;
                func.call(null, data);
            },
            error: function (err) {
                console.log("error: " + err);
            }
        });
    };

    var getChart = function () {
        console.log('getChart');

        chartRpt.getData("/data/series-chart-data.json", {}, renderCharts, renderCharts)
    };

    var getReport = function (reportID) {
        console.log('getReport:' + reportID);
        var data = [];
        var report = parseInt(reportID);
        switch (report) {
            case 1:
                //same as 2
                console.log('report type = ' + reportID);
                colRpt.getData("/data/growing-accounts.json", { "reportID": reportID }, renderColumnReport, renderColumnReport);
                break;
            case 2:
                //same as 1
                console.log('report type = ' + reportID);
                colRpt.getData("/data/declining-accounts.json", { "reportID": reportID }, renderColumnReport, renderColumnReport);
                break;
            case 3:
                console.log('report type = ' + reportID);
                colRpt.getData('/data/team-performance.json', { "reportID": reportID }, renderMstrDtlReport, renderMstrDtlReport)
                break;
            case 4:
                console.log('report type = ' + reportID);
                colRpt.getData("/data/new-cust-revenue.json", { "reportID": reportID }, renderColumnReport, renderColumnReport);
                break;
            case 5:
                console.log('report type = ' + reportID);
                colRpt.getData("/data/time-between-orders.json", { "reportID": reportID }, renderColumnReport, renderColumnReport);
                break;
            default:
                break;
        }
        
    };

    var renderOrgDD = function (items) {
        console.log('renderOrgDD');

        // The main template.
        var main = Handlebars.compile($("#orglist").html());

        // Register the list partial that "main" uses.
        Handlebars.registerPartial("sublist", $("#sublist").html());

        // Render the list.
        $("#" + "orgListArea").html(main({ items: items }));
    }

    var renderTimeDD = function (items) {
        console.log('renderTimeDD');

        // The main template
        var main = Handlebars.compile($("#timelist").html());

        // Register the list partial that "main" uses.
        Handlebars.registerPartial("sublist", $("#sublist").html());

        // Render the list.
        $("#" + "timeListArea").html(main({ items: items }));
    };

    var getFilters = function () {
        getTimeOptions(renderTimeDD);
        getOrgHierarchy(renderOrgDD);
        gRenderedFilters = true;
    }

    var toggleFilters = function (onOff) {
        var filters = $('.filters');

        if (onOff === "on") {
            filters.removeClass("hide");
            filters.addClass("show");
        }
        else {
            filters.removeClass("show");
            filters.addClass("hide");
        }
    }

    var renderColumnReport = function (data) {
        console.log('renderColumnReport');

        if (!gRenderedFilters) {
            getFilters()
        }

        data = JSON.parse(data);
        var x = colRpt.getResponsiveColumnTable(data, true, true);
        $('#col-data-out').empty();
        $(x).appendTo('#col-data-out');

        toggleFilters("on");
        util.showSection('col-data');

    };

    var renderMstrDtlReport = function (data) {
        console.log('renderColumnReport');

        if (!gRenderedFilters) {
            getFilters()
        }

        data = JSON.parse(data);
        var x = colRpt.getMasterDtlTable(data, true);
        $('#mstr-dtl-data-out').empty();
        $(x).appendTo('#mstr-dtl-data-out');

        toggleFilters("on");
        util.showSection('mstr-dtl-data');

    };

    var renderCharts = function (data) {
        console.log('renderCharts');

        if (!gRenderedFilters) {
            getFilters();
        }

        //render the chart to screen
        data = JSON.parse(data);
        var series = data[0].header.series;
        var dataSource = data[0].data;
        if (chartInstance) {
            $("#chart").empty();
            $("#chart").removeData('dxChart');
        }

        chartInstance = chartRpt.renderChart(dataSource, series, "chart", {
            title: data[0].header.title,
            argumentField: data[0].header.argumentField,
            valueAxisFormat: data[0].header.valueAxisFormat
        });

        toggleFilters("on");
        util.showSection('chart-data');
    };

    var renderAvailableReports = function (reports) {
        console.log('renderAvailableReports');
        toggleFilters("off");
        var itemTemplate = Handlebars.compile($('#report-list-template').html());
        var template = itemTemplate(reports);
        $('#reportListData').html(template);
        util.showSection('reportList');
    };

    var getAvailableReports = function () {
        console.log('getAvailableReports');
        //get the stats across all companies

        // collect the criteria for the call
        var parameters = {

        };
        var self = this;
        var token = authorize.getToken();
        //make a call
        $.ajax({
            type: 'GET',
            data: null,
            contentType: 'application/x-www-form-urlencoded',
            url: gServicePath + '/reports/getavailablereports?token=' + token,
            dataType: "json",
            beforeSend: function () {

            },
            success: function (data) {
                console.log("Avaliable Reports", data);

                renderAvailableReports(data);
            },
            error: function (err) {
                console.log("Error obtaining reports: " + err.responseText);
            },
            complete: function () {

            }
        });
    };

    var chartRoute = function () {
        console.log('chartRoute');
        if (authorize.isAuthorized()) {
            getChart();
        }
        else {
            //tell authorize what to trigger after login
            util.showSection('login');
        }
    };

    var routes = {
        '/availableReports': availRoute,
        '/login': loginRoute,
        '/report/:reportID': reportRoute,
        '/chart': chartRoute,
        '/potential': function () { location.href = "potential.html" },
        '/profile': function () { location.href = "profile.html" }
    };

    var router = Router(routes);
    router.init();

    $(document).ready(function () {

    });

})();


