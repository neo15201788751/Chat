define(function(require, exports) {
    var $ = require('jquery');
    exports.user = null;
    exports.usernameTxt = $('#username');
    exports.passwordTxt = $('#password');
    exports.errorMsg = $('.login-window-error');
    exports.pageCover = $('.page-cover');
    exports.loginWin = $('.login-window');
});