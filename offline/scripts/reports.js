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
    //initialize the authorization object
    var authorize = new Authorize({}, gAuthPath);

    Handlebars.registerHelper('eq', function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });
    var util = {
        uuid: function () {
            /*jshint bitwise:false */
            console.log('util.uuid');
            var i, random;
            var uuid = '';

            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += '-';
                }
                uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
            }

            return uuid;
        },
        pluralize: function (count, word) {
            console.log('util.pluralize');
            return count === 1 ? word : word + 's';
        },
        store: function (namespace, data) {
            console.log('util.store');
            if (arguments.length > 1) {
                return localStorage.setItem(namespace, JSON.stringify(data));
            } else {
                var store = localStorage.getItem(namespace);
                return (store && JSON.parse(store)) || [];
            }
        },
        remove: function (namespace) {
            var nameLength = namespace.length;

            Object.keys(localStorage)
                .forEach(function (key) {
                    if (key.substring(0, nameLength) === namespace) {
                        localStorage.removeItem(key);
                    }
                });
        },
        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        //turns a section on and all others off depending on flag value
        showSection: function (route, hideOtherSections) {
            console.log('showSection');
            hideOtherSections = hideOtherSections || true;
            //get a list of all containers with section class
            var sections = $('.section');
            var section;
            //choose the one section we want
            section = sections.filter('[data-route=' + route + ']');

            if (section.length) {
                if (hideOtherSections === true) {
                    sections.removeClass('show');
                    sections.addClass('hide');
                }

                section.removeClass('hide');
                section.addClass('show');
            }
        }
    };

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

    var getOrgHierarchy = function () {
        var data = [];
        data.push({
            "id": "1", "name": "John Smith", "parent": "", "level": "1",
            "items": [{ "id": "2", "name": "James Pettibone", "parent": "1", "level": "2", "items": [] },
                      { "id": "3", "name": "Frank Thomas", "parent": "1", "level": "2", "items": [] }]
        });

        data.push({
            "id": "4", "name": "Jane Doe", "parent": "", "level": "1",
            "items": [{ "id": "5", "name": "Thomas Frank", "parent": "4", "level": "2", "items": [] },
                      {
                          "id": "6", "name": "Frank Thomas", "parent": "4", "level": "2",
                          "items": [{ "id": "55", "name": "Jackie Sherill", "parent": "6", "level": "3", "items": [] }]
                      }]
        });
        data.push({
            "id": "7", "name": "Todd Gatlin", "parent": "", "level": "1",
            "items": []
        });

        return data;
    };

    var getTimeOptions = function () {
        var data = [];
        data.push({ "id": "1", "name": "Current Month", "parent": "", "level": "1", "items": [] });
        data.push({ "id": "2", "name": "Prior Month", "parent": "", "level": "1", "items": [] });
        data.push({ "id": "3", "name": "Current Quarter", "parent": "", "level": "1", "items": [] });
        data.push({ "id": "4", "name": "Prior Quarter", "parent": "", "level": "1", "items": [] });
        data.push({ "id": "5", "name": "Current YTD", "parent": "", "level": "1", "items": [] });
        data.push({ "id": "6", "name": "Prior Year", "parent": "", "level": "1", "items": [] });
        data.push({ "id": "7", "name": "Prior 12 Months", "parent": "", "level": "1", "items": [] });
        return data;
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
                data.push({ "custID": "100", "custName": "Customer 100", "salesVar": "$1234.56", "gmVar": "$234.65", "gmPctVar": "5.8%" });
                data.push({ "custID": "200", "custName": "Customer 200", "salesVar": "$2234.56", "gmVar": "$334.65", "gmPctVar": "6.8%" });
                data.push({ "custID": "300", "custName": "Customer 300", "salesVar": "$3234.56", "gmVar": "$434.65", "gmPctVar": "7.8%" });
                renderGrowDeclReport(data);
                break;
            case 2:
                //same as 1
                console.log('report type = ' + reportID);
                data.push({ "custID": "100", "custName": "Customer 100", "salesVar": "$1234.56", "gmVar": "$234.65", "gmPctVar": "5.8%" });
                data.push({ "custID": "200", "custName": "Customer 200", "salesVar": "$2234.56", "gmVar": "$334.65", "gmPctVar": "6.8%" });
                data.push({ "custID": "300", "custName": "Customer 300", "salesVar": "$3234.56", "gmVar": "$434.65", "gmPctVar": "7.8%" });
                renderGrowDeclReport(data);
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
                data.push({ "custID": "100", "custName": "Customer 100", "sales": "$1234.56", "gm": "$234.65", "gmPct": "5.8%" });
                data.push({ "custID": "200", "custName": "Customer 200", "sales": "$2234.56", "gm": "$334.65", "gmPct": "6.8%" });
                data.push({ "custID": "300", "custName": "Customer 300", "sales": "$3234.56", "gm": "$434.65", "gmPct": "7.8%" });
                renderNewCustReport(data);
                break;
            case 5:
                console.log('report type = ' + reportID);
                data.push({ "custID": "100", "custName": "Customer 100", "avgTBO": "12", "currTBO": "30", "var": "18" });
                data.push({ "custID": "200", "custName": "Customer 200", "avgTBO": "23", "currTBO": "40", "var": "17" });
                data.push({ "custID": "300", "custName": "Customer 300", "avgTBO": "21", "currTBO": "29", "var": "8" });
                renderLateOrdersReport(data);
                break;
            default:
                break;
        }
        
    };

    var renderOrgDD = function (orgListArea) {
        console.log('renderOrgDD');
        var items = getOrgHierarchy();

        // The main template.
        var main = Handlebars.compile($("#orglist").html());

        // Register the list partial that "main" uses.
        Handlebars.registerPartial("sublist", $("#sublist").html());

        // Render the list.
        $("#" + orgListArea).html(main({ items: items }));

    }

    var renderTimeDD = function (timeListArea) {
        console.log('renderTimeDD');
        var items = getTimeOptions();

        // The main template
        var main = Handlebars.compile($("#timelist").html());

        // Register the list partial that "main" uses.
        Handlebars.registerPartial("sublist", $("#sublist").html());

        // Render the list.
        $("#" + timeListArea).html(main({ items: items }));
    };

    var renderGrowDeclReport = function (data) {
        console.log('renderGrowDeclReport');
        renderOrgDD("orgListArea1");
        renderTimeDD("timeListArea1");
        var itemTemplate = Handlebars.compile($('#growdecl-template').html());
        //add data to template
        var template = itemTemplate(data);
        $('#growdeclListData').html(template);

        util.showSection('growdecl');
    };

    var renderTeamPerfReport = function (data) {
        console.log('renderTeamPerfReport');
        renderOrgDD('orgListArea2');
        renderTimeDD("timeListArea2");
        var itemTemplate = Handlebars.compile($('#team-perf-template').html());
        //add data to template
        var template = itemTemplate(data);
        $('#teamPerfListData').html(template);
        util.showSection('teamPerf');
    };

    var renderNewCustReport = function (data) {
        console.log('renderNewCustReport');
        renderOrgDD("orgListArea3");
        renderTimeDD("timeListArea3");
        var itemTemplate = Handlebars.compile($('#new-cust-template').html());
        //add data to template
        var template = itemTemplate(data);
        $('#newCustData').html(template);

        util.showSection('newCust');
    };

    var renderLateOrdersReport = function (data) {
        console.log('renderLateOrdersReport');
        renderOrgDD("orgListArea4");
        renderTimeDD("timeListArea4");
        var itemTemplate = Handlebars.compile($('#late-orders-template').html());
        //add data to template
        var template = itemTemplate(data);
        $('#lateOrdersData').html(template);

        util.showSection('lateOrders');
    };

    var renderCharts = function (data) {
        console.log('renderCharts');

        renderOrgDD("orgListArea5");
        renderTimeDD("timeListArea5");

        $("#chartContainer").dxChart({
            dataSource: data,
            containerBackgroundColor: 'crimson',
            legend: { visible: false },
            series: {
                argumentField: "day",
                valueField: "oranges",
                name: "My oranges",
                type: "line",
                color: '#ffa500'
            }
        });
        util.showSection('charts');
    };

    var renderAvailableReports = function (reports) {
        console.log('renderAvailableReports');
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
    console.log(router);
    $(document).ready(function () {

    });

})();


