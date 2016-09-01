(function () {
    'use strict';

    console.log('starting script');

    var gServicePath = "",
        gAuthPath = "",
        gAuthorized = false,
        gToken = {},
        gCustID = 0,
        gGetPot = 0,
        gGetPro = 0,
        gOnline = true;

    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;
    var TIME_INTERVAL = 30000; //30 secs
    var ABORT_AFTER_INTERVAL = 20000; //20 secs
    var FILE_TO_CHECKFOR = "/check/online.html"; //you can change this to whatever
    var CLOSET_NAMESPACE_PREFIX = "closet-";
    var CLOSETS_NAMESPACE = "closets";

    var clearReportFlags = function () {
        gGetPot = 0;
        gGetPro = 0;
    };
    var setPotentialFlag = function (val) {
        gGetPot = val;
    };
    var setProfileFlag = function (val) {
        gGetPro = val;
    };
    var getPotentialFlag = function () {
        return gGetPot;
    };
    var getProfileFlag = function () {
        return gGetPro;
    };
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
        //turns a section on and all others off
        showSection: function (route, hideotherSections) {
            console.log('showSection');
            var hideOtherSections = hideotherSections || true;
            //get a list of all containers with section class
            var sections = $('.section');
            var section;
            //choose the one section we want
            section = sections.filter('[data-route=' + route + ']');

            if (section.length) {
                if (hideotherSections === true) {
                    sections.removeClass('show');
                    sections.addClass('hide');
                }

                section.removeClass('hide');
                section.addClass('show');
            }
        }
    };

    var authorize = {
        callBack: {},
        init: function (callBack) {
            //do something
            this.callBack = callBack;
        },
        login: function (userName, password, callBack) {
            //check the callback
            if (typeof callBack === "function") {
                this.callBack = callBack;
            }
            // collect the criteria for the call
            var parameters = {
                username: userName,
                password: password
            };
            self = this;
            //make a call
            $.ajax({
                type: 'POST',
                data: JSON.stringify(parameters),
                contentType: 'application/x-www-form-urlencoded',
                url: gAuthPath + '/authorize/login',
                dataType: "json",
                beforeSend: function () {

                },
                success: function (data) {
                    console.log("Login Success", data);
                    //hide login controls
                    $("#loginSection").removeClass("show");
                    $("#loginSection").addClass("hide");

                    gToken = data.token;
                    gAuthorized = true;
                    self.callBack.apply();
                },
                error: function (err) {
                    console.log("Error loading closets: " + err.responseText);
                    gToken = "";
                    gAuthorized = false;
                },
                complete: function () {

                }
            });
        },
        logout: function () {
            //call logout service
        }
    };

    var loginRoute = function () {
        console.log('loginRoute');

        if (!gAuthorized) {
            //call authorize code here
            authorize.login($('#userNameInp').val, $('#passwordInp').val, showTopSection);
        }
    };

    var availRoute = function () {
        location.href = "reports.html";
    };

    //customer selected in search dialog
    var selectCustomer = function (custID) {
        gCustID = custID;
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

    var showTopSection = function () {
        renderOrgDD('orgListArea');
        renderTimeDD("timeListArea");
        util.showSection('criteria');
    };

    var getReport = function (reportID) {
        console.log('getReport:' + reportID);
        var data = [];
        var report = parseInt(reportID);
        switch (report) {

            case 100:
                //sales trend profile
                data.push({ "name": "January 2015", "sales": "$1,233", "gm": "$766", "gmPct": "7.89%" });
                data.push({ "name": "February 2015", "sales": "$1,233", "gm": "$766", "gmPct": "7.89%" });
                data.push({ "name": "March 2015", "sales": "$1,233", "gm": "$766", "gmPct": "7.89%" });
                data.push({ "name": "April 2015", "sales": "$1,233", "gm": "$766", "gmPct": "7.89%" });
                data.push({ "name": "May 2015", "sales": "$1,233", "gm": "$766", "gmPct": "7.89%" });
                data.push({ "name": "June 2015", "sales": "$1,233", "gm": "$766", "gmPct": "7.89%" });
                data.push({ "name": "July 2015", "sales": "$1,233", "gm": "$766", "gmPct": "7.89%" });
                data.push({ "name": "August 2015", "sales": "$1,233", "gm": "$766", "gmPct": "7.89%" });
                data.push({ "name": "September 2015", "sales": "$1,233", "gm": "$766", "gmPct": "7.89%" });
                data.push({ "name": "October 2015", "sales": "$1,233", "gm": "$766", "gmPct": "7.89%" });
                data.push({ "name": "November 2015", "sales": "$1,233", "gm": "$766", "gmPct": "7.89%" });
                data.push({ "name": "December 2015", "sales": "$1,233", "gm": "$766", "gmPct": "7.89%" });
                renderSalesTrendReport(data);
                break;
            case 200:
                //general overview profile
                data.push({ "name": "Sales", "currVal": "$11,233", "priorVal": "$6,766", "changeVal": "$4,573" });
                data.push({ "name": "GM", "currVal": "$11,233", "priorVal": "$6,766", "changeVal": "$4,573" });
                data.push({ "name": "GM %", "currVal": "17.56%", "priorVal": "15.56%", "changeVal": "2.00%" });
                data.push({ "name": "Orders", "currVal": "11,233", "priorVal": "6,766", "changeVal": "4,573" });
                data.push({ "name": "Invoices", "currVal": "11,233", "priorVal": "6,766", "changeVal": "4,573" });
                data.push({ "name": "New Customers", "currVal": "213", "priorVal": "176", "changeVal": "37" });
                renderGenOverviewReport(data);
                break;
            case 300:
                //top categories profile
                data.push({ "name": "Category #201", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Category #302", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Category #403", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Category #504", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Category #605", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Category #706", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Category #807", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Category #908", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Category #110", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Category #120", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                renderRankingReport(data, 300);
                break;
            case 400:
                //top items profile
                data.push({ "name": "Item Number #111", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #112", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #113", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #114", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #115", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #116", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #117", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #118", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #119", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #110", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                renderRankingReport(data, 400);
                break;
            case 500:
                //item downtrend profile
                data.push({ "name": "Item Number #101", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #102", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #103", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #104", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #105", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #106", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #107", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #108", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #109", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                data.push({ "name": "Item Number #110", "sales": "$1,233", "salesPrior": "$766", "gmPct": "7.89%", "gmPctPrior": "7.89%", "salesChange": "$573" });
                renderRankingReport(data, 500);
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

    var renderSalesTrendReport = function (data) {
        console.log('renderSalesTrendReport');
        var itemTemplate = Handlebars.compile($('#sales-trend-template').html());
        //add data to template
        var template = itemTemplate(data);
        $('#salesTrendListData').html(template);
    };
    var renderGenOverviewReport = function (data) {
        console.log('renderGenOverviewReport');
        var itemTemplate = Handlebars.compile($('#general-overview-template').html());
        //add data to template
        var template = itemTemplate(data);
        $('#genOverviewListData').html(template);
    };
    var renderRankingReport = function (data, rptID) {
        console.log('renderRankingReport');
        var itemTemplate = Handlebars.compile($('#ranking-template').html());
        //add data to template
        var template = itemTemplate(data);
        switch (rptID) {
            case 300:
                $('#topCategoriesListData').empty();
                $('#topCategoriesListData').html(template);
                break;
            case 400:
                $('#topItemsListData').empty();
                $('#topItemsListData').html(template);
                break;
            case 500:
                $('#itemsDownListData').empty();
                $('#itemsDownListData').html(template);
                break;
            default:
                break;
        }


    };

    var dummyPlaceHolder = function () {
        console.log('getAvailableReports');
        //get the stats across all companies

        // collect the criteria for the call
        var parameters = {
        };
        //make a call
        $.ajax({
            type: 'GET',
            data: null,
            contentType: 'application/x-www-form-urlencoded',
            url: gServicePath + '/reports/getavailablereports?token=' + gToken,
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

    var searchCustomers = function (custSearchCriteria) {
        console.log('searchCustomers');

        //make the call to the server to get the data
        var data = [];
        data.push({ "custID": "100", "custAcctCode": "12345A", "custname": "customer 100", "custAddr": "some address somewhere", "billTo": "false" });
        data.push({ "custID": "110", "custAcctCode": "12346A", "custname": "customer 110", "custAddr": "some address somewhere", "billTo": "false" });
        data.push({ "custID": "120", "custAcctCode": "12347A", "custname": "customer 120", "custAddr": "some address somewhere", "billTo": "false" });
        data.push({ "custID": "130", "custAcctCode": "12348A", "custname": "customer 130", "custAddr": "some address somewhere", "billTo": "false" });
        data.push({ "custID": "140", "custAcctCode": "12349A", "custname": "customer 140", "custAddr": "some address somewhere", "billTo": "false" });
        data.push({ "custID": "150", "custAcctCode": "12355A", "custname": "customer 150", "custAddr": "some address somewhere", "billTo": "false" });
        data.push({ "custID": "160", "custAcctCode": "12365A", "custname": "customer 160", "custAddr": "some address somewhere", "billTo": "false" });
        data.push({ "custID": "170", "custAcctCode": "12375A", "custname": "customer 170", "custAddr": "some address somewhere", "billTo": "false" });
        data.push({ "custID": "180", "custAcctCode": "12385A", "custname": "customer 180", "custAddr": "some address somewhere", "billTo": "false" });
        data.push({ "custID": "190", "custAcctCode": "12395A", "custname": "customer 190", "custAddr": "some address somewhere", "billTo": "false" });
        data.push({ "custID": "200", "custAcctCode": "12445A", "custname": "customer 200", "custAddr": "some address somewhere", "billTo": "false" });
        data.push({ "custID": "210", "custAcctCode": "12545A", "custname": "customer 210", "custAddr": "some address somewhere", "billTo": "false" });
        data.push({ "custID": "220", "custAcctCode": "12645A", "custname": "customer 220", "custAddr": "some address somewhere", "billTo": "false" });
        data.push({ "custID": "230", "custAcctCode": "12745A", "custname": "customer 230", "custAddr": "some address somewhere", "billTo": "false" });
        data.push({ "custID": "240", "custAcctCode": "12845A", "custname": "customer 240", "custAddr": "some address somewhere", "billTo": "false" });
        renderCustomers(data);

    };
    var renderCustomers = function (data) {
        console.log('renderCustomers');

        var itemTemplate = Handlebars.compile($('#custlist-template').html());
        //add data to template
        var template = itemTemplate(data);
        $('#custListData').html(template);
        $("#myModal").modal();
    };

    var routes = {
        '/custSearch': searchCustomers,
        '/availableReports': availRoute,
        '/report/:reportID': getReport,
        '/selectCust/:custID': selectCustomer,
        '/login': loginRoute
    };

    var router = Router(routes);
    router.init();
    console.log(router);

    $(document).ready(function () {
        //button next to the search box
        $("#goSearchBtn").off().click(function () {
            console.log('goSearchBtn click');
            searchCustomers($('#searchTxt').val());
        });

        //cancel btn in the customer select dialog
        $("#cancelBtn").off().click(function () {
            console.log('modal cancel button clicked');
            gCustID = 0;
        });

        //ok button in the customer select dialog
        $("#saveBtn").off().click(function () {
            console.log('modal Ok button clicked');
            getReport(100); //sales trend
            getReport(200); //gen overview
            getReport(500); //item downtrend
            setProfileFlag(gCustID);
            util.showSection('profile', false);
        });

        $(".nav.nav-pills li > a").off().click(function () {
            console.log('profileNav clicked');
            //call the functions to get the reports
            var selectePill = $(this).attr("data-route");
            console.log(selectePill);
            //selectedPill points to potential
            switch (selectePill) {
                case "downTrend":
                    getReport(500);
                    break;
                case "topItems":
                    getReport(400);
                    break;
                case "topCategories":
                    getReport(300);
                    break;
                default:

            }

        });

    });

})();


