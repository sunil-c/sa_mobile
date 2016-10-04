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

        var dataSource = [{
            day: "Monday",
            oranges: 3
        }, {
            day: "Tuesday",
            oranges: 2
        }, {
            day: "Wednesday",
            oranges: 3
        }, {
            day: "Thursday",
            oranges: 4
        }, {
            day: "Friday",
            oranges: 6
        }, {
            day: "Saturday",
            oranges: 11
        }, {
            day: "Sunday",
            oranges: 4
        }];
        //normally this is takes place after an ajax call to the ws to get data
        renderCharts(dataSource);
        return dataSource
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
                data.push({ "repID": "100", "repName": "John Smith", "rows": [{ "name": "Sales", "curr": "$1234.56", "prior": "$1234.56", "var": "$1234.56" }, { "name": "GM", "curr": "$1234.56", "prior": "$1234.56", "var": "$1234.56" }, { "name": "GM%", "curr": "12.66%", "prior": "1.66%", "var": "1.00%" }] });
                data.push({ "repID": "100", "repName": "Jane Doe", "rows": [{ "name": "Sales", "curr": "$2234.56", "prior": "$1234.56", "var": "$1234.56" }, { "name": "GM", "curr": "$1234.56", "prior": "$1234.56", "var": "$1234.56" }, { "name": "GM%", "curr": "12.66%", "prior": "1.66%", "var": "1.00%" }] });
                data.push({ "repID": "100", "repName": "Frank Jones", "rows": [{ "name": "Sales", "curr": "$3234.56", "prior": "$1234.56", "var": "$1234.56" }, { "name": "GM", "curr": "$1234.56", "prior": "$1234.56", "var": "$1234.56" }, { "name": "GM%", "curr": "12.66%", "prior": "1.66%", "var": "1.00%" }] });
                renderTeamPerfReport(data);
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
        $(x).appendTo('#col-data-out');

        toggleFilters("on");
        util.showSection('col-data');

    };

    var renderTeamPerfReport = function (data) {
        console.log('renderTeamPerfReport');
        if (!gRenderedFilters) {
            renderFilters();
        }
    };

    var renderCharts = function (data) {
        console.log('renderCharts');

        if (!gRenderedFilters) {
            getFilters();
        }

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


