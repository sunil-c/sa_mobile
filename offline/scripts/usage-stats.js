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
    //initialize the authorization object
    var authorize = new Authorize({}, gAuthPath);

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

    var statsRoute = function () {
        console.log('statsRoute');
        if (authorize.isAuthorized()) {
            getStats();
        }
        else {
            util.showSection('login');
        }
    };
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

    var getStats = function () {
        console.log('getStats');
        //get the stats across all companies

        // collect the criteria for the call
        var parameters = {
        };
        self = this;
        //make a call
        $.ajax({
            type: 'GET',
            data: null,
            contentType: 'application/x-www-form-urlencoded',
            url: gAuthPath + '/stat/getaggregatestats?token=' + self.authorize.getToken(),
            dataType: "json",
            beforeSend: function () {

            },
            success: function (data) {
                console.log("Get Stats", data);

                renderStats(data);
            },
            error: function (err) {
                console.log("Error obtaining stats: " + err.responseText);
            },
            complete: function () {

            }
        });

        return;
    };

    var renderStats = function (stats) {
        console.log('renderStats');
        var itemTemplate = Handlebars.compile($('#toplevel-template').html());
        var template = itemTemplate(stats);
        $('#stats').html(template);
        util.showSection('stats');
        return;
    };

    var getCompanyStats = function () {
        console.log('getStatsForCompanies');
        //get stats broken out by company 
        // collect the criteria for the call
        var parameters = {
        };
        //make a call
        var self = this;
        var token = authorize.getToken();
        $.ajax({
            type: 'GET',
            data: null,
            contentType: 'application/x-www-form-urlencoded',
            url: gAuthPath + '/stat/getstats?token=' + token + '&custID=0&level=0',
            dataType: "json",
            beforeSend: function () {

            },
            success: function (data) {
                console.log("Get Stats for Companies", data);

                renderCompanyStats(data);
            },
            error: function (err) {
                console.log("Error obtaining stats: " + err.responseText);
            },
            complete: function () {

            }
        });

        return;
    };

    var renderCompanyStats = function (compData) {
        console.log('renderCompanyStats');
        var itemTemplate = Handlebars.compile($('#company-template').html());
        //add data to template
        var template = itemTemplate(compData);
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

    var getCompanyLoadStats = function () {
        console.log('getCompanyLoadStats');
        //get stats broken out by company 
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
            url: gAuthPath + '/stat/getstats?token=' + token + '&custID=0&level=2',
            dataType: "json",
            beforeSend: function () {

            },
            success: function (data) {
                console.log("Get Stats for Companies", data);

                renderCompanyLoadStats(data);
            },
            error: function (err) {
                console.log("Error obtaining stats: " + err.responseText);
            },
            complete: function () {

            }
        });

        return;
    };

    var renderCompanyLoadStats = function (compData) {
        console.log('renderCompanyStats');
        var itemTemplate = Handlebars.compile($('#load-detail-template').html());
        //add data to template
        var template = itemTemplate(compData);
        $('#companyLoadStatsData').html(template);

        util.showSection('loadStats');
    };

    var getCompanyReports = function () {
        console.log('getCompanyReports');
        //get report stats for a company 
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
            url: gAuthPath + '/stat/getstats?token=' + token + '&custID=' + gCompanyID + '&level=1',
            dataType: "json",
            beforeSend: function () {

            },
            success: function (data) {
                console.log("Get Stats for Companies", data);
                renderCompanyReports(data);
            },
            error: function (err) {
                console.log("Error obtaining stats: " + err.responseText);
            },
            complete: function () {

            }
        });
        
        return;
    };

    var renderCompanyReports = function (compData) {
        console.log('renderCompanyReports');
        //get the report stats from the data object passed back
        var reportData = compData[0].reportStats;
        var itemTemplate = Handlebars.compile($('#report-detail-template').html());
        //add data to template
        var template = itemTemplate(reportData);
        $('#companyReportsData').html(template);
        util.showSection('reports');
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


