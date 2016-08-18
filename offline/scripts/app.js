(function () {
    'use strict';
    
    console.log('starting script');

    var gServicePath = "",
        gAuthPath = "",
        gAuthorized = false,
        gToken = {},
        gClosetID = 0,
        gCompanyID = 0,
        gOnline = true,
        gCurrentCloset = {};

    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;
    var TIME_INTERVAL = 30000; //30 secs
    var ABORT_AFTER_INTERVAL = 20000; //20 secs
    var FILE_TO_CHECKFOR = "/check/online.html"; //you can change this to whatever
    var CLOSET_NAMESPACE_PREFIX = "closet-";
    var CLOSETS_NAMESPACE = "closets";

    var setClosetID = function (val) {
        gClosetID = val;
    };
    var getClosetID = function () {
        return gClosetID;
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
        }
    };
    
    //classes
    var Closets = {
        init: function () {
            console.log('Closets.init');

            //get closets from service
            this.getClosets();
            //pull the closet list from local storage
            this.items = util.store(CLOSETS_NAMESPACE);
            //if closets then render 
            if (this.items.length > 0) {
                this.render();
            }
            this.bindEvents();
        },
        bindEvents: function () {
            //on click store the closet id int he global
            $('#closetlist li')
                .off('click')
                .on('click', function () {
                    //call setter for gClosetID
                    setClosetID(this.id);
                });
        },
        // Get the companies list based on filter criteria
        getClosets: function () {
            console.log('Closets.getClosets');
            var self = this;
            var customerID = 0; //need to change this to use a real customerID
            // collect the criteria for the call
            var parameters = {

            };
            //make a call
            $.ajax({
                type: 'GET',
                data: JSON.stringify(parameters),
                contentType: 'application/x-www-form-urlencoded',
                url: gServicePath + '/closet/getClosets?customerID=' + customerID,
                dataType: "json",
                beforeSend: function () {

                },
                success: function (data) {
                    console.log("Closet Pull Success", data);
                    self.refreshClosets(data);
                    self.render();
                },
                error: function (err) {
                    console.log("Error loading closets: " + err.responseText);
                    //showMessage("error", "Error loading companies");
                },
                complete: function () {

                }
            });
        },
        refreshClosets: function (data) {
            console.log('Closets.refreshClosets');
            //get closets from db
            var closets = util.store(CLOSETS_NAMESPACE);
            //if any data the delete it
            if (closets.length > 0) {
                util.remove(CLOSETS_NAMESPACE);
            }

            //create closets
            var items = [];
            //any data from web service?
            if (data.length > 0) {
                //store closets coming frm service
                for (var i = 0; i < data.length; i++) {
                    items.push({ closet_id: data[i].closetID, closet_name: data[i].closetName });
                }
            }
            else {
                //add fake closet list
                for (var i = 1; i < 11; i++) {
                    items.push({ closet_id: i, closet_name: 'Fake Closet ' + i });
                }
            }

            util.store(CLOSETS_NAMESPACE, items);
        },
        render: function () {
            console.log('Closets.populateClosetList');
            //render the closets to page
            var closets = [];
            //iterate the items object
            $.each(this.items, function (id, option) {
                closets.push('<li id="'
                    + option.closet_id
                    + '"><a href="#closetdetails" data-role="button">'
                    + option.closet_name + '</a></li>');
            });
            var list = closets.join('');
            $('#closetlist').append(list);
            $('#closetlist').listview('refresh');
        }
    };

    var ClosetDetails = {
        init: function () {
            console.log('ClosetDetails.init');
            this.items = {};
            //get the global closet id or set to 0
            this.closetID = getClosetID() || 0;
            this.itemTemplate = Handlebars.compile($('#item-template').html());
            this.footerTemplate = Handlebars.compile($('#footer-template').html());
            this.getClosetItems(this.closetID);
        },
        destroy: function () {
            console.log('ClosetDetails.destroy');
        },
        bindEvents: function () {   
            console.log('ClosetDetails.bindEvents');
            //first turn off then on the events otherwise we get duped events
            $('#item-list')
                .off('click', '.onhand')
                .on('click', '.onhand', this.edit.bind(this))
                .off('keyup', '.edit')
                .on('keyup', '.edit', this.editKeyup.bind(this))
                .off('focusout', '.edit')
                .on('focusout', '.edit', this.update.bind(this));
        },
        render: function () {
            console.log('ClosetDetails.render');
            
            var template = this.itemTemplate(this.items);
            $('#item-list').html(template);
            this.renderFooter();

            $('#main').toggle(this.items.length > 0);
            $('.editarea').toggle();
        },
        renderFooter: function () {
            console.log('ClosetDetails.renderFooter');
            //get count of clostes items
            var itemCount = this.items.length;
            var template = this.footerTemplate({
                itemCount: itemCount
            });
            //if itemcount > 0 then show template
            $('#footer').toggle(itemCount > 0).html(template);
        },
        processResults: function (data) {
            //data contains data from service
            //call functions to render it to screen
            this.refreshClosetItems(data);
            this.render();
            this.bindEvents();
        },
        getClosetItems: function (closetID) {
            console.log('ClosetDetails.getClosetItems');
            var self = this;

            //if online get refreshed data from service otherwise pull from localstorage
            if (getOnlineStatus()) {
                //make a call to svc
                $.ajax({
                    type: 'GET',
                    //data: JSON.stringify(parameters),
                    contentType: 'application/x-www-form-urlencoded',
                    url: gServicePath + '/closet/getItems?closetID=' + closetID,
                    dataType: "json",
                    beforeSend: function () {

                    },
                    success: function (data) {
                        console.log("Closet Item Pull Success", data);
                        self.processResults(data);
                    },
                    error: function (err) {
                        console.log("Closet Item Pull Fail", data);
                        console.log("Error loading closet items: " + err.responseText);
                    },
                    complete: function () {

                    }
                })
            }
            else {
                var namespace = CLOSET_NAMESPACE_PREFIX + closetID;
                var data = util.store(namespace);
                self.processResults(data);
            }


        },
        refreshClosetItems: function(data){
            console.log('Closets.refreshClosetItems');
            //get closets from localstorage
            var namespace = CLOSET_NAMESPACE_PREFIX + this.closetID;
            //if any data the delete it, but only if there's data coming back from service 
            if (data.length === 0) {
                if (this.items.length > 0) {
                    data = this.items;
                }
            }
            else {
                if (this.items.length > 0 && getOnlineStatus()) {
                    util.remove(namespace);
                }
            }
            //create closets items
            var items = [];
            //any data from web service?
            if (data.length > 0) {
                //store closet items coming frm service
                for (var i = 0; i < data.length; i++) {
                    items.push({ item_id: 'Item ' + data[i].itemID, 
                        item_name: data[i].itemName, 
                        par: data[i].par, 
                        on_hand: data[i].onHand });
                }
            }

            //save to local storage
            this.items = items;
            util.store(namespace, items);
        },
        indexFromEl: function (el) {
            // accepts an element from inside the `.item` div and
            // returns the corresponding index in the `items` array
            console.log('ClosetDetails.indexFromEl');
            var id = $(el).closest('li').attr("data-id");
            var items = this.items;
            var i = items.length;
            //compare the id in teh data-id attribute of the li to the id's in the array to find index of clicked item
            while (i--) {
                if (items[i].item_id == id) {
                    return i;
                }
            }
        },
        edit: function (e) {
            console.log('ClosetDetails.edit');
            //find the edit area
            var editArea = $(e.target).closest('div').find('.editarea');
            //turn it on/off
            editArea.toggle();
            //find the input in the editing area
            var $input = $(e.target).closest('li').addClass('editing').find('.edit');
            //put the focus on it -- ** comment this if you need to debug
            $input.val($input.val()).focus();
        },
        editKeyup: function (e) {
            console.log('ClosetDetails.editKeyUp');
            if (e.which === ENTER_KEY) {
                e.target.blur();
            }

            //set the abort attribute to true
            if (e.which === ESCAPE_KEY) {
                $(e.target).data('abort', true).blur();
            }
        },
        update: function (e) {
            console.log('ClosetDetails.update');

            var el = e.target;
            var $el = $(el);
            var val = $el.val().trim();

            if (!val) {
                //smc: haven't figured out what this does exactly
                this.destroy(e);
                return;
            }

            //if the abort attribute is true
            if ($el.data('abort')) {
                $el.data('abort', false);
            } else {
                var index = this.indexFromEl(el);
                this.items[index].on_hand = val;
            }

            this.render();
        }
    };

    var authorize = {
        init: function () {
            //do something
        },
        login: function (userName, password) {
            //check the service 

            // collect the criteria for the call
            var parameters = {
                username: userName,
                password: password
            };
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

                    getCompanyStats()
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
        if (gAuthorized) {
            getStats();
        }
        else {
            showSection('login');
        }
    };
    var companiesRoute = function () {
        console.log('companiesRoute');
        if (gAuthorized) {
            getCompanyStats();
        }
        else {
            showSection('login');
        }
    };
    var reportsRoute = function () {
        console.log('reportsRoute');
        if (gAuthorized) {
            getCompanyReports();
        }
        else {
            showSection('login');
        }
        
    };
    var loadRoute = function () {
        console.log('loadRoute');
        if (gAuthorized) {
            getCompanyLoadStats();
        }
        else {
            showSection('login');
        }

    };
    var loginRoute = function () {
        console.log('loginRoute');

        if (!gAuthorized) {
            //call authorize code here
            authorize.login($('#userNameInp').val, $('#passwordInp').val);
        }
    };

    var showSection = function (route) {
        console.log('showSection');
        //get a list of all containers with section class
        var sections = $('.section');
        var section;
        //choose the one section we want
        section = sections.filter('[data-route=' + route + ']');

        if (section.length) {
            sections.removeClass('show');
            sections.addClass('hide');
            section.removeClass('hide');
            section.addClass('show');
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
        //make a call
        $.ajax({
            type: 'GET',
            data: null,
            contentType: 'application/x-www-form-urlencoded',
            url: gAuthPath + '/stat/getaggregatestats?token=' + gToken,
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
        showSection('stats');
        return;
    };

    var getCompanyStats = function () {
        console.log('getStatsForCompanies');
        //get stats broken out by company 
        // collect the criteria for the call
        var parameters = {
        };
        //make a call
        $.ajax({
            type: 'GET',
            data: null,
            contentType: 'application/x-www-form-urlencoded',
            url: gAuthPath + '/stat/getstats?token=' + gToken + '&custID=0&level=0',
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
        showSection('companies');
    };

    var getCompanyLoadStats = function () {
        console.log('getCompanyLoadStats');
        //get stats broken out by company 
        // collect the criteria for the call
        var parameters = {
        };
        //make a call
        $.ajax({
            type: 'GET',
            data: null,
            contentType: 'application/x-www-form-urlencoded',
            url: gAuthPath + '/stat/getstats?token=' + gToken + '&custID=0&level=2',
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

        showSection('loadStats');
    };

    var getCompanyReports = function () {
        console.log('getCompanyReports');
        //get report stats for a company 
        // collect the criteria for the call
        var parameters = {
        };
        //make a call
        $.ajax({
            type: 'GET',
            data: null,
            contentType: 'application/x-www-form-urlencoded',
            url: gAuthPath + '/stat/getstats?token=' + gToken + '&custID=' + gCompanyID + '&level=1',
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
        showSection('reports');
    };

    var loginClicked = function () {
        console.log('loginClicked');
        //login button was clicked
        if (!gAuthorized) {
            //call authorize code here
            authorize.login($('#userNameInp').val, $('#passwordInp').val);
        }

        return;
    };



    $(document).ready(function () {
        //companiesRoute();
    });

})();


