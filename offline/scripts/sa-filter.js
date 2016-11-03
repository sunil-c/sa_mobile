var Filter = function () {

    if (this instanceof Filter) {
        this.callBack = {};
        this.errCallBack = {};
    } else {
        return new Filter();
    }
    //private recursive process method
    ///data: array of json objects
    ///arr: array of ui artifacts
    ///buildUIMethod: function which returns an ui artifact
    var processNodes = function (data, arr) {
        var i = 0;
        while (data.length > 0) {
            var node = data[i];
            //put it in the array
            arr[arr.length] = node;
            //if the items property has nodes process them
            if (node.items.length > 0) {
                //recurse
                processNodes(node.items, arr)
            }
            //if all nodes processed
            if (++i >= data.length) break;
        };
        //return the array of processed items
        return arr;
    };

    //privileged method which exposes the process method
    ///data: array of json objects
    ///buildUIMethod: function which returns an ui artifact
    this.processFilterData = function (data) {
        var arrayOfNodes = [];
        //call private method
        return processNodes(data, arrayOfNodes);
    };
};
Filter.prototype.getCallBack = function () {
    return this.callBack;
};
Filter.prototype.setCallBack = function (val) {
    this.callBack = val;
};
Filter.prototype.getErrCallBack = function () {
    return this.errCallBack;
};
Filter.prototype.setErrCallBack = function (val) {
    this.errCallBack = val;
};
Filter.prototype.getData = function (url, params, callBack, errCallBack) {
    /* arguments
     * url = the url from where to get the data
     * data = json object with parameters
     * callBack = pointer to function to call upon success
     * errCallBack = pointer to error handler
     */
    console.log("Filter.getData");

    this.setCallBack(callBack);
    this.setErrCallBack(errCallBack);

    var self = this;
    params = params || {};
    $.ajax({
        method: "GET",
        url: url,
        data: params,
        dataType: "script",
        beforeSend: function () {

        },
        success: function (data) {
            data = JSON.parse(data);
            var func = self.getCallBack();
            func.call(null, data);
        },
        error: function (err) {
            var func = self.getErrCallBack();
            func.call(null, err);
        }
    });
};
Filter.prototype.getDropDownFilter = function (nodes, filterName, filterID) {

    //make sure we have a name and id
    filterName = filterName || "filterName" + (Math.random() * 50).toString();
    filterID = filterID || "filterID" + (Math.random() * 50).toString();
    //create the base component
    var baseEl = $("<div class='dropdown pull-left dropdown-height-200' />").attr("id", filterID);
    baseEl.append($("<button class='btn btn-sm dropdown-toggle control-150' type='button' data-toggle='dropdown' />").attr("id", "menu" + filterID).text(filterName).append("<span class='caret' />"));
    baseEl.append($('<ul data-level="1" class="dropdown-menu" role="menu" />').attr("aria-labelledby", "menu" + filterID));

    var parent = 0, node, ul, parentLI, newLevel, ulExists;

    //iterate nodes and create UL's
    for (var i = 0; i < nodes.length; i++) {
        //grab a node
        node = nodes[i];
        //save for later
        newLevel = parseInt(node.level);
        //parent of top level is blank string
        parent = (node.parent.length === 0) ? 0 : parseInt(node.parent);

        //check to see if we need to add a ul
        if (parent === 0) {
            ul = baseEl.find("ul[data-level='" + newLevel + "']");
            ulExists = true;
        } else {
            parentLI = baseEl.find("li[id='" + node.parent + "']");
            ul = parentLI.find("ul[data-level='" + newLevel + "']");
            ulExists = ul.length > 0 ? true : false;
        }

        if (!ulExists) {
            //create new ul and li
            ul = $('<ul data-level="' + newLevel + '" class="inner-menu" />')
                .append($("<li />").addClass("dropdown-item").attr("id", node.id)
                .append($("<a href='#' />").text(node.name))
                );
            //find the li parent for the ul
            parentLI = baseEl.find("li[id='" + node.parent + "']");
            //attach ul
            $(parentLI).append(ul);
        }
        else {
            //add an li to ul
            $(ul).append($("<li />").addClass("dropdown-item").attr("id", node.id).append($("<a href='#' />").text(node.name)));
        }
    }

    return baseEl;
};

