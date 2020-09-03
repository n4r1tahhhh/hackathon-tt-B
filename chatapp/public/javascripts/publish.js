'use strict';

// 投稿メッセージをサーバに送信する
function publish() {
    // ユーザ名を取得
    const userName = $('#userName').val();
    // 入力されたメッセージを取得
    const message = $('#message').val();
    // 投稿内容を送信
    sendMessage(message)
    return false;
}

// メッセージを入力する
function sendMessage(message) {
    //const message = prompt('メッセージを入力してください。\n' +
        //'このメッセージはすべてのクライアントに送信されます。');

    // メッセージ入力イベント（sendMessageEvent）を送信する
    socket.emit('sendMessageEvent', message);

}

// サーバから受信した投稿メッセージを画面上に表示する
socket.on('recieveMessageEvent', function (data) {
    $('#thread').prepend('<pre>' + data + '</pre>');
});

var $ta = $("#message");

$(document).on("keypress", $ta, function(e) {
    // shift + Enterが押された
    if (e.shiftKey && e.keyCode == 13) { 
        // 改行の入力を中断
        e.preventDefault();
        // 投稿
        publish($ta);
    }
});