/*****************************************************************************/
//RESPONSIVE COLUMN TABLE
/*****************************************************************************/
var ColumnReport = function () {
    if (this instanceof ColumnReport) {
        this.callBack = {};
        this.errCallBack = {};
    } else {
        return new ColumnReport();
    }
};
ColumnReport.prototype.getCallBack = function () {
    return this.callBack;
};
ColumnReport.prototype.setCallBack = function (val) {
    this.callBack = val;
};
ColumnReport.prototype.getErrCallBack = function () {
    return this.errCallBack;
};
ColumnReport.prototype.setErrCallBack = function (val) {
    this.errCallBack = val;
};
ColumnReport.prototype.getData = function (callBack, errCallBack) {
    this.setCallBack(callBack);
    this.setErrCallBack(errCallBack);

    var self = this;
    //
    $.ajax({
        method: "GET",
        url: "/data/col-report-data.json",
        dataType: "script",
        beforeSend: function(){

        },
        success: function (data) {
            var func = self.getCallBack();
            func.call(null, data);
        },
        error: function (err) {
            var func = self.getErrCallBack();
            func.call(null, err);
        }
    });

};
ColumnReport.prototype.getResponsiveColumnTable = function (data, displayHeaders) {
    //creates a responsive table based on the data object displayed at the bottom of this file

    //some variables
    var cols, rows, row, colCount, rowCount;
    colCount = data[0].columns.names.length;
    rowCount = data[0].rows.length;

    var d1 = $('<div/>').addClass("container-fluid");
    var d2 = $('<div/>').addClass("table-responsive").appendTo(d1);
    var t1 = $('<table/>').addClass("table table-striped table-hover").appendTo(d2);
    var h1 = $('<thead/>').appendTo(t1);
    var b1 = $('<tbody/>').appendTo(t1);

    //create the header row
    if (displayHeaders === true) {
        var row = $('<tr/>').appendTo(h1);
        //create column headers
        for (cols = 0; cols < colCount; cols++) {
            $('<th/>').text(data[0].columns.names[cols]).addClass(data[0].columns.hdrAttr[cols]).appendTo(row);
        }
    }

    //create the data rows
    for (rows = 0; rows < rowCount; rows++) {
        //create row
        row = $('<tr/>').appendTo(b1);
        //create cells
        for (cols = 0; cols < colCount; cols++) {
            $('<td/>').text(data[0].rows[rows].values[cols]).addClass(data[0].columns.cellAttr[cols]).appendTo(row);
        }
    }
    return d1;
};

/*****************************************************************************/
//RESPONSIVE ROW TABLE
/*****************************************************************************/
var RowReport = function () {
    if (this instanceof RowReport) {
        this.callBack = {};
        this.errCallBack = {};
    } else {
        return new RowReport();
    }
};
RowReport.prototype.getCallBack = function () {
    return this.callBack;
};
RowReport.prototype.setCallBack = function (val) {
    this.callBack = val;
};
RowReport.prototype.getErrCallBack = function () {
    return this.errCallBack;
};
RowReport.prototype.setErrCallBack = function (val) {
    this.errCallBack = val;
};
RowReport.prototype.getData = function (callBack, errCallBack) {
    this.setCallBack(callBack);
    this.setErrCallBack(errCallBack);

    var self = this;
    //
    $.ajax({
        method: "GET",
        url: "/data/row-report-data.json",
        dataType: "script",
        beforeSend: function () {

        },
        success: function (data) {
            var func = self.getCallBack();
            func.call(null, data);
        },
        error: function (err) {
            var func = self.getErrCallBack();
            func.call(null, err);
        }
    });

};
RowReport.prototype.getResponsiveRowTable = function (data, displayHeaders) {
    //creates a responsive table based on the data object displayed at the bottom of this file

    //some variables
    var cols, rows, row, colCount, rowCount;
    colCount = data[0].columns.names.length;
    rowCount = data[0].rows.length;

    var d1 = $('<div/>').addClass("container-fluid");
    var d2 = $('<div/>').addClass("table-responsive").appendTo(d1);
    var t1 = $('<table/>').addClass("table table-striped table-hover").appendTo(d2);
    var h1 = $('<thead/>').appendTo(t1);
    var b1 = $('<tbody/>').appendTo(t1);

    //create the header row
    if (displayHeaders === true) {
        var row = $('<tr/>').appendTo(h1);
        //create column headers
        for (cols = 0; cols < colCount; cols++) {
            $('<th/>').text(data[0].columns.names[cols]).addClass(data[0].columns.hdrAttr[cols]).appendTo(row);
        }
    }

    //create the data rows
    for (rows = 0; rows < rowCount; rows++) {
        //create row
        row = $('<tr/>').appendTo(b1);
        //create cells
        for (cols = 0; cols < colCount; cols++) {
            $('<td/>').text(data[0].rows[rows].values[cols]).addClass(data[0].columns.cellAttr[cols]).appendTo(row);
        }
    }
    return d1;
};


//[
//  {
//      "columns": {
//          "names": ["id", "Name", "Current", "Prior", "Variance"],
//          "colMaps": ["id", "name", "current", "prior", "variance"],
//          "colID": [],
//          "hdrAttr": ["hide", "", "", "", ""],
//          "cellAttr": ["hide", "pull-left", "pull-right", "pull-right", "pull-right"]
//      },
//      "rows": [
//        { "values": ["12345", "Item #12345", "1123.87", "612.99", "0.01234"] },
//        { "values": ["63346", "Item #12345", "1123.87", "612.99", "0.01234"] },
//        { "values": ["71397", "Item #21762", "923.87", "416.07", "0.01433"] },
//        { "values": ["77748", "Item #45332", "1567.33", "564.66", "0.01299"] },
//        { "values": ["89341", "Item #15366", "1345.33", "676.67", "0.2344"] }
//      ]
//  }
//]