'use strict';

// 退室メッセージをサーバに送信する
function exit() {
    // ユーザ名取得
    let userName = $('#userName').val();
    // < という特殊文字を置換
    userName = userName.replace(/</g, "&lt;");
    // > という特殊文字を置換
    userName = userName.replace(/>/g, "&gt;");
    // 退室メッセージイベントを送信する
    socket.emit('exitMyselfEvent', userName);
    // 退室
    location.href = '/';
}

// サーバから受信した退室メッセージを画面上に表示する
socket.on('exitOtherEvent', function (data) {
    let $box = $('<div class="message-box"></div>').prependTo($('#thread'));
    $box.append('<pre class="text-success">' + data + 'さんが退室しました。' + '</pre>');
});
