var ErrorHandler = function (serviceURL) {
    if (this instanceof ErrorHandler) {
        //instance variables
        this.serviceURL = serviceURL || "";
        this.msg = "";
        this.error = "";
        this.errorURL = "";
        this.line = 0;
        this.col = 0;
    } else {
        return new ErrorHandler(serviceURL);
    }
    this.getURL = function () {
        return this.serviceURL;
    }
};
ErrorHandler.prototype.getError = function () {
    var formattedMsg;
    formattedMsg  = !this.msg ? '' : '\nMessage: ' + this.msg;
    formattedMsg += !this.errorURL ? '' : '\nLocation: ' + this.errorURL;
    formattedMsg += !this.line ? '' : '\nLine: ' + this.line;
    formattedMsg += !this.col ? '' : '\nColumn: ' + this.col;
    formattedMsg += !this.error ? '' : '\nError: ' + this.error;

    return formattedMsg;
};
ErrorHandler.prototype.onError = function (msg, url, line, col, error) {
    // Note that col & error are new to the HTML 5 spec and may not be 
    // supported in every browser. 

    //store in instance variables
    this.msg = msg;
    this.errorURL = url;
    this.line = line;
    this.col = !col ? '' : col;
    this.error = !error ? '' : error;

    // You can view the information in an alert to see things working like this:
    //alert("Error: " + this.getError());

    // Report this error via ajax so you can keep track of what pages have JS issues
    //ignore result
    if (this.serviceURL) {
        $.ajax({
            method: "POST",
            url: this.serviceURL,
            data: { msg: msg, url: url, line: line, col: col, error: error },
            dataType: "json",
            beforeSend: function () {

            },
            success: function (data) {

            },
            error: function (xhr) {
                alert("An error occured sending your error data to the server: " + xhr.status + " " + xhr.statusText);
            }
        });
    }

    var suppressErrorAlert = true;
    // If you return true, then error alerts (like in older versions of 
    // Internet Explorer) will be suppressed.
    return suppressErrorAlert;
};
