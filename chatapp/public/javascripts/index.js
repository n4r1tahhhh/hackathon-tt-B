'use strict';

// チャットルームに入室する
function enter() {
    // 入力されたユーザ名を取得する
    const userName = $('#userName').val();
    const userNameText = $('#userName').text();
    console.log(userNameText);

    // ユーザ名が未入力でないかチェックする
    if (/\S/.test(userName)) {
        $('form').submit();
    } else {
        window.alert('名前を入力してください。');
        $('#userName').val('');
        return;
    }

}

var $userName = $("#userName");

$(document).on("keypress", $userName, function(e) {
    // Enterが押された
    if (e.keyCode == 13) {
        enter();
        // submitを中断
        e.preventDefault();
    }
});
