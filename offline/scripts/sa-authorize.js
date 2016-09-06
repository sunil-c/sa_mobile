var Authorize = function (callBack, authPath) {
    if (this instanceof Authorize) {
        this.authPath = authPath || "";
        this.callBack = callBack || {};
        this.token = "";
        this.authorized = false;
    } else {
        return new Authorize(callBack, authPath);
    }
};
Authorize.prototype.getToken = function () {
    return this.token;
};
Authorize.prototype.setToken = function (token) {
    console.log('token:' + token);
    this.token = token;
};
Authorize.prototype.isAuthorized = function () {
    return this.authorized
};
Authorize.prototype.setAuthorized = function (val) {
    this.authorized = val;
};
Authorize.prototype.getAuthPath = function () {
    return this.authPath;
};
Authorize.prototype.setAuthPath = function (val) {
    this.authPath = val;
};
Authorize.prototype.getCallBack = function () {
    return this.callBack;
};
Authorize.prototype.setCallBack = function (val) {
    this.callBack = val;
};

Authorize.prototype.login = function (userName, password, callBack) {
    //check the callback
    if (typeof callBack === "function") {
        this.setCallBack(callBack)
    }
    // collect the criteria for the call
    var parameters = {
        username: userName,
        password: password
    };
    self = this;
    var url = this.getAuthPath() + '/authorize/login';

    //make a call
    $.ajax({
        type: 'POST',
        data: JSON.stringify(parameters),
        contentType: 'application/x-www-form-urlencoded',
        url: url,
        dataType: "json",
        beforeSend: function () {

        },
        success: function (data) {
            console.log("Login Success", data);
            //hide login controls
            $("#loginSection").removeClass("show");
            $("#loginSection").addClass("hide");

            self.setToken(data.token);
            self.setAuthorized(true);

            if (typeof self.getCallBack() === 'function') {
                var func = self.getCallBack();
                func.apply();
            };
        },
        error: function (err) {
            console.log("Error loading closets: " + err.responseText);
            self.setToken("");
            self.setAuthorized(false);
        },
        complete: function () {

        }
    });
};
Authorize.prototype.logout = function () {
    //nothing yet
};

