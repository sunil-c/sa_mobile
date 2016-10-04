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
ColumnReport.prototype.getData = function (url, data, callBack, errCallBack) {
    /* arguments
     * url = the url from where to get the data
     * data = json object with parameters
     * callBack = pointer to function to call upon success
     * errCallBack = pointer to error handler
     */
    console.log("ColumnReport.getData");

    this.setCallBack(callBack);
    this.setErrCallBack(errCallBack);

    var self = this;
    data = data || {};
    $.ajax({
        method: "GET",
        url: url,
        data: data,
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
ColumnReport.prototype.getResponsiveColumnTable = function (data, displayHeaders, displayFooter) {
    //creates a responsive table based on the data object displayed at the bottom of this file

    var cols, rows, row, colCount, rowCount;
    var hasColumnsProperty = data[0].hasOwnProperty("columns");
    var hasRowProperty = data[0].hasOwnProperty("rows");
    var hasFooterProperty = data[0].hasOwnProperty("footer");
    //if no column property then return empty div 
    if (!hasColumnsProperty) {
        return $('<div/>')
    }
    else {
        colCount = data[0].columns.names.length;
    }
    //if no rows property set rows to 0
    rowCount = !hasRowProperty ? 0 : data[0].rows.length;
    
    var d1 = $('<div/>').addClass("container-fluid");
    var d2 = $('<div/>').addClass("table-responsive").appendTo(d1);
    var t1 = $('<table/>').addClass("table table-striped table-hover").appendTo(d2);
    var h1 = $('<thead/>').appendTo(t1);
    var b1 = $('<tbody/>').appendTo(t1);

    //create the header row
    if (displayHeaders === true && hasColumnsProperty && data[0].columns.hasOwnProperty("names")) {
        var row = $('<tr/>').appendTo(h1);
        //create column headers
        for (cols = 0; cols < colCount; cols++) {
            $('<th/>').text(data[0].columns.names[cols]).addClass(data[0].columns.hdrAttr[cols]).appendTo(row);
        }
    }

    //create the data rows
    if (hasRowProperty && data[0].rows.length > 0) {
        for (rows = 0; rows < rowCount; rows++) {
            //create row
            row = $('<tr/>').appendTo(b1);
            //create cells
            for (cols = 0; cols < colCount; cols++) {
                $('<td/>').text(data[0].rows[rows].values[cols]).addClass(data[0].columns.cellAttr[cols]).appendTo(row);
            }
        }
    }

    if (displayFooter === true && hasFooterProperty && (data[0].footer.length > 0)) {
        var row = $('<tr/>').appendTo(b1);
        //create footers
        for (cols = 0; cols < colCount; cols++) {
            $('<td/>').text(data[0].footer[0].values[cols]).addClass(data[0].columns.ftrAttr[cols]).appendTo(row);
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
RowReport.prototype.getData = function (url, data, callBack, errCallBack) {
    /* arguments
     * url = the url from where to get the data
     * data = json object with parameters
     * callBack = pointer to function to call upon success
     * errCallBack = pointer to error handler
     */
    this.setCallBack(callBack);
    this.setErrCallBack(errCallBack);

    var self = this;
    data = data || {};
    $.ajax({
        method: "GET",
        url: url,
        data: data,
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

/*****************************************************************************/
//CHARTING
/*****************************************************************************/
var ChartReport = function () {
    if (this instanceof ChartReport) {
        this.callBack = {};
        this.errCallBack = {};
    } else {
        return new ChartReport();
    }
}
ChartReport.prototype.getCallBack = function () {
    return this.callBack;
};
ChartReport.prototype.setCallBack = function (val) {
    this.callBack = val;
};
ChartReport.prototype.getErrCallBack = function () {
    return this.errCallBack;
};
ChartReport.prototype.setErrCallBack = function (val) {
    this.errCallBack = val;
};
ChartReport.prototype.getData = function (url, data, callBack, errCallBack) {
    /* arguments
     * url = the url from where to get the data
     * data = json object with parameters
     * callBack = pointer to function to call upon success
     * errCallBack = pointer to error handler
     */
    this.setCallBack(callBack);
    this.setErrCallBack(errCallBack);

    var self = this;
    data = data || {};
    $.ajax({
        method: "GET",
        url: url,
        data: data,
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
ChartReport.prototype.renderChart = function (data, series, containerName, options) {
    /* renders a simple one series chart
     * arguments
     * data: data to bind to the chart
     * series: an array of chart series objects
     * containerName: the div where you want chart rendered
     * options: {showLegend = true/false, 
     *           argumentField: name of x-axis field in data, 
     *           valueAxisFormat: the format string for the Y axis
     *           title: title for chart
     * }
     * Accepted Values for valueAxis format: 'currency' | 'fixedPoint' | 'percent' | 'decimal' | 'exponential' | 'largeNumber' | 'thousands' | 'millions' | 'billions' | 'trillions' | 'longDate' | 'longTime' | 'monthAndDay' | 'monthAndYear' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'millisecond' | 'day' | 'month' | 'quarter' | 'year'
     */
    return $("#" + containerName).dxChart({
        dataSource: data,
        commonSeriesSettings: {
            type: "bar"//, //default, but series will override
            //argumentField: options.argumentField
        },
        series: series,
        margin: {
            bottom: 10
        },
        title: options.title,
        argumentAxis: {
            valueMarginsEnabled: false
        },
        valueAxis: {
            label: {
                format: options.valueAxisFormat
            }
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            "visible": options.showLegend
        }
    }).dxChart("instance");
};
ChartReport.prototype.renderPieChart = function (data, series, containerName, options) {
    /* renders a simple one series chart
     * arguments
     * data: data to bind to the chart
     * series: an array of chart series objects
     * containerName: the div whwere you want chart rendered
     * options: {showLegend = true/false,
     *           showLabel = true/false shows pie section labels 
     *           title: title for chart
     *           valueAxisFormat: the format string for the Y axis
     * }
     * Accepted Values for valueAxis format: 'currency' | 'fixedPoint' | 'percent' | 'decimal' | 'exponential' | 'largeNumber' | 'thousands' | 'millions' | 'billions' | 'trillions' | 'longDate' | 'longTime' | 'monthAndDay' | 'monthAndYear' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'millisecond' | 'day' | 'month' | 'quarter' | 'year'
     */
    return $("#" + containerName).dxPieChart({
        "dataSource": data,
        "series": series,
        "type": options.pieType || "pie",
        "title": options.title,
        "commonSeriesSettings": {
            "label": {
                "visible": options.showLabel
            }
        },
        "valueAxis": {
            "label": {
                "format": options.valueAxisFormat
            }
        },
        "legend": {
            "visible": options.showLegend,
            "orientation": "horizontal",
            "verticalAlignment": "bottom",
            "horizontalAlignment": "center"
        },
    }).dxPieChart("instance");
}


