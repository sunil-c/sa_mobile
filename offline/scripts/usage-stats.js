(function () {
    'use strict';
    
    console.log('starting script');

    var gServicePath = "",
        gAuthPath = "",
        gCompanyID = 0,
        gOnline = true;

    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;
    var TIME_INTERVAL = 30000; //30 secs
    var ABORT_AFTER_INTERVAL = 20000; //20 secs
    var FILE_TO_CHECKFOR = "/check/online.html"; //you can change this to whatever

    var getOnlineStatus = function () {
        return gOnline;
    };
    var setOnlineStatus = function (val) {
        gOnline = val;
    };

    if (window.location.host.indexOf('localhost') >= 0) {           // running from localhost
        gServicePath = 'http://localhost:25004/api';
        gAuthPath = 'http://localhost:25004/api';
    }
    else {                                                // on web server
        gAuthPath = '/services/api';
        gServicePath = '/services/api';
    }

    Handlebars.registerHelper('eq', function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });

    //initialize the Util object
    var util = new Util();
    //initialize the authorization object
    var authorize = new Authorize({}, gAuthPath);
    var colRpt = new ColumnReport();

    //create a function that will dispatch a custom event
    var fireEvent = function (name, data) {
        var e = document.createEvent("Event");
        e.initEvent(name, true, true);
        e.data = data;
        window.dispatchEvent(e);
    };

    //capture custom event and toggle some css when the event occurs
    window.addEventListener("goodconnection", function (e) {
        $(".info").toggleClass("onlineindicator-off", false);
        setOnlineStatus(true);
    });
    //capture custom event and toggle some css when the event occurs
    window.addEventListener("connectionerror", function (e) {
        $(".info").toggleClass("onlineindicator-off", true);
        setOnlineStatus(false);
    });
    //capture custom event and toggle some css when the event occurs
    window.addEventListener("connectiontimeout", function (e) {
        $(".info").toggleClass("onlineindicator-off", true);
        setOnlineStatus(false);
    });

    var companiesRoute = function () {
        console.log('companiesRoute');
        if (authorize.isAuthorized()) {
            getCompanyStats();
        }
        else {
            util.showSection('login');
        }
    };
    var reportsRoute = function () {
        console.log('reportsRoute');
        if (authorize.isAuthorized()) {
            getCompanyReports();
        }
        else {
            util.showSection('login');
        }
        
    };
    var loadRoute = function () {
        console.log('loadRoute');
        if (authorize.isAuthorized()) {
            getCompanyLoadStats();
        }
        else {
            util.showSection('login');
        }

    };
    var loginRoute = function () {
        console.log('loginRoute');

        if (!authorize.isAuthorized()) {
            //call authorize code here
            authorize.login($('#userNameInp').val, $('#passwordInp').val, getCompanyStats);
        }
    };

    var routes = {
        '/companyStats': companiesRoute,
        '/companyReports': reportsRoute,
        '/loadStats': loadRoute,
        '/login' : loginRoute
    };
    var router = Router(routes);
    router.init();

    //this is a common call to the web service
    var getReportData = function (custID, level, callBack) {
        console.log('getReport');

        // collect the criteria for the call
        var parameters = { };
        var token = authorize.getToken();
        var url = gAuthPath + '/stat/getstats?token=' + token + '&custID=' + custID.toString() + '&level=' + level.toString();
        var func = callBack;

        //make a call
        $.ajax({
            type: 'GET',
            data: null,
            contentType: 'application/x-www-form-urlencoded',
            url: url,
            dataType: "json",
            beforeSend: function () {

            },
            success: function (data) {
                console.log("Common Get Stats for Companies", data);
                func.call(null, data);
            },
            error: function (err) {
                console.log("Error obtaining stats: " + err.responseText);
            },
            complete: function () {

            }
        });

        return;
    };

    var getCompanyStats = function () {
        console.log('getStatsForCompanies');
        getReportData(0, 0, renderCompanyStats);
        return;
    };
    var getCompanyLoadStats = function () {
        console.log('getCompanyLoadStats');
        getReportData(0, 2, renderCompanyLoadStats);

        return;
    };
    var getCompanyReports = function () {
        console.log('getCompanyReports');
        getReportData(0, 1, renderCompanyReports);

        return;
    };
    var renderCompanyLoadStats = function (compData) {
        console.log('renderCompanyLoadStats2');
        //do something
        compData = [compData];
        //send data to colRpt to get rendering of table
        var x = colRpt.getResponsiveColumnTable(compData, true);
        $('#companyLoadStatsData').empty();
        $(x).appendTo('#companyLoadStatsData');
        util.showSection('loadStats');
    };
    var renderCompanyReports = function (compData) {
        console.log('renderCompanyReports');
        //do something
        compData = [compData];
        //send data to colRpt to get rendering of table
        var x = colRpt.getResponsiveColumnTable(compData, true);
        $('#companyReportsData').empty();
        $(x).appendTo('#companyReportsData');
        util.showSection('reports');
    };
    var renderCompanyStats = function (compData) {
        console.log('renderCompanyStats');
        var rows = [];
        var row = {};
        //deconstruct the common data structure
        //create an array of rows to be applied to a handlebars template
        for (var i = 0; i < compData.rows.length; i++) {
            row = {};
            for (var j = 0; j < compData.columns.colMap.length; j++) {
                row[compData.columns.colMap[j]] = compData.rows[i].values[j];
            }
            rows[rows.length] = row;
        }

        //apply data to handlebars template
        var itemTemplate = Handlebars.compile($('#company-template').html());
        //add data to template
        var template = itemTemplate(rows);
        $('#companyListData').html(template);
        //click event logic
        $(".company-reports")
            .off('click')
            .on('click', function () {
                gCompanyID = $(this).attr('data-id');
            }
        );
        util.showSection('companies');
    };

    var loginClicked = function () {
        console.log('loginClicked');
        //login button was clicked
        if (!authorize.isAuthorized()) {
            //call authorize code here
            authorize.login($('#userNameInp').val, $('#passwordInp').val, getCompanyStats);
        }

        return;
    };

    $(document).ready(function () {
        //nothing for now
    });

})();


