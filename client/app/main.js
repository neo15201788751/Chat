/* globals define,io */
define(function (require/*, exports, module*/) {
    var $ = require('jquery');
    var commonElements = require('commonElements');
    var messager = require('messager');

    $('.chat-input').submit(function () {
        var partner = $('.chat-partner span');
        var id = partner.data('id');
        var name = partner.text();
        if (!id) {
            alert('请双击在线列表中的在线用户，以选择一个人聊天！');
            return false;
        }
        var msg$ = $('#m');
        messager.sendMessage(id, name, msg$.val());
        $('#messages').append($('<li>').text(commonElements.user.name + ' : ' + msg$.val()));
        msg$.val('');
        return false;
    });

    commonElements.loginWin.submit(function () {
        if (!commonElements.usernameTxt.val() || !commonElements.passwordTxt.val()) {
            commonElements.errorMsg.empty().text('请填写用户名和密码!');
        } else {
            messager.login();
        }

        return false;
    });
    $('.chat-user-online').on('dblclick', 'li', function () {
        var ts = $(this);
        $('.chat-partner span').data('id', ts.attr('id')).text(ts.text());
    });
});