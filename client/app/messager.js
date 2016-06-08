define(function (require, exports) {
    require('socket');
    var $ = require('jquery');
    var commonElements = require('commonElements');
    var socket = io();
    socket.on('chat message', function (msgObj) {
        var fromUser = msgObj.from;
        $('.chat-partner span').data('id', fromUser.id).text(fromUser.name);
        $('#messages').append($('<li>').text(fromUser.name + ' : ' + msgObj.msg));
    });
    socket.on('user login', function (loginUser) {
        if (!commonElements.user) return;
        if (loginUser.id !== commonElements.user.id && loginUser.name !== commonElements.user.name) {
            $('.chat-user-online').append($('<li id="' + loginUser.id + '">').text(loginUser.name));
        }
    });
    socket.on('user offline', function (id) {
        if (!commonElements.user) return;
        $('.chat-user-online').find('#' + id).remove();
        var partner = $('.chat-partner span');
        if (partner.data('id') === id) {
            partner.removeData('id').text('');
            $('#messages').empty();
        }
    });
    socket.on('force offline', function () {
        commonElements.pageCover.show();
        commonElements.loginWin.fadeIn(500);
        commonElements.user = null;
        commonElements.errorMsg.empty().text('您已在其他地方登录！');
    });
    exports.sendMessage = function (id, name, msg) {
        socket.emit('chat message', {
            from: {
                id: socket.id,
                name: commonElements.user.name
            },
            to: {
                id: id,
                name: name
            },
            msg: msg
        });
    };
    exports.login = function () {
        var loginUser = {
            id: socket.id,
            name: commonElements.usernameTxt.val(),
            password: commonElements.passwordTxt.val()
        };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "api/login",
            data: JSON.stringify(loginUser)
        }).done(function (res) {
            commonElements.pageCover.hide();
            commonElements.loginWin.fadeOut(500);
            commonElements.errorMsg.empty();
            commonElements.user = loginUser;
            var currentUser = [];
            for (var n in res.currentUser) {
                if (res.currentUser.hasOwnProperty(n)) {
                    if (res.currentUser[n].id !== commonElements.user.id && res.currentUser[n].name !== commonElements.user.name) {
                        currentUser.push('<li id="' + res.currentUser[n].id + '">' + res.currentUser[n].name + '</li>');
                    }
                }
            }
            $('.chat-user-online').empty().append(currentUser.join(''));
            $('.chat-user-current span').text(commonElements.user.name);
        }).fail(function (error) {
            errorMsg.empty().text(error.responseText);
        });
    };
    exports.id = socket.id;
});