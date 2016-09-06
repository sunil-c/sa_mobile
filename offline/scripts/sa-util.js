var Util = function () {

    if (this instanceof Util) {

    } else {
        return new Util();
    }
};

Util.prototype.uuid = function () {
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
};

//pluralize a singular word
Util.prototype.pluralize = function (count, word) {
    console.log('util.pluralize');
    return count === 1 ? word : word + 's';
};

//if namespace and data passed in then store, else retrieve items in namespace
Util.prototype.store = function (namespace, data) {
        console.log('util.store');
        if (arguments.length > 1) {
            return localStorage.setItem(namespace, JSON.stringify(data));
        } else {
            var store = localStorage.getItem(namespace);
            return (store && JSON.parse(store)) || [];
        }
};

//removes a key from the localdatastore
Util.prototype.remove = function (namespace) {
    var nameLength = namespace.length;

    Object.keys(localStorage)
        .forEach(function (key) {
            if (key.substring(0, nameLength) === namespace) {
                localStorage.removeItem(key);
            }
        });
};

//produces a random integer
Util.prototype.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

//turns a section on and all others off depending on flag value
Util.prototype.showSection = function (route, hideOtherSections) {
    console.log('showSection');
    var hideOtherSections = (typeof hideOtherSections !== 'undefined') ? hideOtherSections : true;
    //get a list of all containers with section class
    var sections = $('.section');
    var section;
    //choose the one section we want
    section = sections.filter('[data-route=' + route + ']');

    if (section.length) {
        if (hideOtherSections) {
            sections.removeClass('show');
            sections.addClass('hide');
        }

        section.removeClass('hide');
        section.addClass('show');
    }
};
